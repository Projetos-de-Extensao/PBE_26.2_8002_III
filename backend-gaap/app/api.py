from django.contrib.auth import get_user_model
from django.db import transaction
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.permissions import (
    AllowAny,
    SAFE_METHODS,
    BasePermission,
    IsAdminUser,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import (
    Administrador,
    Agendamento,
    Aluno,
    BloqueioAgenda,
    Espaco,
    Profissional,
    RelatorioTreino,
    Responsavel,
    Servico,
    TipoServico,
)
from .perfis import dados_do_usuario, obter_perfil, sincronizar_conta
from .serializers import (
    AdministradorSerializer,
    AgendamentoSerializer,
    AlunoSerializer,
    BloqueioAgendaSerializer,
    CadastroProfissionalSerializer,
    CadastroResponsavelSerializer,
    EspacoSerializer,
    ProfissionalSerializer,
    RelatorioTreinoSerializer,
    ResponsavelSerializer,
    ServicoSerializer,
)


class EquipeOuLeitura(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_staff


class AgendamentoPermission(BasePermission):
    """Responsável agenda; profissional conclui (PATCH) os próprios agendamentos."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.user.is_staff:
            return True
        acesso = obter_perfil(request.user)
        if view.action == "create":
            return acesso.is_responsavel
        if view.action == "partial_update":
            return acesso.is_profissional
        return False


class AlunoPermission(BasePermission):
    """Só a equipe ou o responsável legal cadastra alunos."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.user.is_staff:
            return True
        return view.action == "create" and obter_perfil(request.user).is_responsavel


class RelatorioPermission(BasePermission):
    """Profissional escreve relatórios dos seus agendamentos; aluno só lê os dele."""

    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        acesso = obter_perfil(request.user)
        if acesso.is_profissional:
            return view.action != "destroy"
        return acesso.is_aluno and request.method in SAFE_METHODS


class BloqueioPermission(BasePermission):
    """Profissional gerencia os bloqueios da própria agenda."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.user.is_staff:
            return True
        return obter_perfil(request.user).is_profissional


class ProtegidoModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, EquipeOuLeitura]


def remover_conta(pessoa):
    """Apaga a conta de login de quem foi excluído (nunca a de alguém da equipe)."""
    get_user_model().objects.filter(
        username__iexact=pessoa.email,
        is_staff=False,
    ).delete()


class AdministradorViewSet(ProtegidoModelViewSet):
    queryset = Administrador.objects.all().order_by("id")
    serializer_class = AdministradorSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class ProfissionalViewSet(ProtegidoModelViewSet):
    queryset = Profissional.objects.all().order_by("id")
    serializer_class = ProfissionalSerializer

    def get_queryset(self):
        # Cadastros aguardando aprovação só aparecem para a equipe.
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(ativo=True)

    def perform_destroy(self, instance):
        with transaction.atomic():
            remover_conta(instance)
            instance.delete()

    @extend_schema(request=None, responses=ProfissionalSerializer)
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminUser])
    def aprovar(self, request, pk=None):
        profissional = self.get_object()
        with transaction.atomic():
            profissional.ativo = True
            profissional.save(update_fields=["ativo"])
            sincronizar_conta(profissional)
        return Response(self.get_serializer(profissional).data)


class AlunoViewSet(ProtegidoModelViewSet):
    queryset = Aluno.objects.all().order_by("id")
    serializer_class = AlunoSerializer
    permission_classes = [IsAuthenticated, AlunoPermission]

    def get_queryset(self):
        if self.request.user.is_staff:
            return super().get_queryset()
        acesso = obter_perfil(self.request.user)
        if acesso.is_responsavel:
            # Dependentes que o responsável legal cadastrou.
            return Aluno.objects.filter(responsavel=acesso.objeto).order_by("id")
        if acesso.is_profissional:
            # Alunos atendidos pelo profissional em algum agendamento.
            return Aluno.objects.filter(
                agendamentos__profissional=acesso.objeto
            ).distinct().order_by("id")
        if acesso.is_aluno:
            return Aluno.objects.filter(pk=acesso.objeto.pk)
        return Aluno.objects.none()

    def perform_destroy(self, instance):
        with transaction.atomic():
            remover_conta(instance)
            instance.delete()


class ResponsavelViewSet(ProtegidoModelViewSet):
    queryset = Responsavel.objects.all().order_by("id")
    serializer_class = ResponsavelSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_permissions(self):
        if self.action == "me":
            return [IsAuthenticated()]
        return super().get_permissions()

    @extend_schema(responses=dict)
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        # Mantido por compatibilidade; o endpoint geral é /api/me/.
        return Response(dados_do_usuario(request.user))


class ServicoViewSet(ProtegidoModelViewSet):
    queryset = Servico.objects.all().order_by("id")
    serializer_class = ServicoSerializer

    @action(detail=False, methods=["get"])
    def tipos(self, request):
        return Response(
            [{"value": value, "label": label} for value, label in TipoServico.choices]
        )


class EspacoViewSet(ProtegidoModelViewSet):
    queryset = Espaco.objects.all().order_by("id")
    serializer_class = EspacoSerializer


class AgendamentoViewSet(ProtegidoModelViewSet):
    queryset = (
        Agendamento.objects.select_related("profissional", "espaco", "servico")
        .prefetch_related("alunos")
        .order_by("data_hora_inicio")
    )
    serializer_class = AgendamentoSerializer
    permission_classes = [IsAuthenticated, AgendamentoPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset
        acesso = obter_perfil(self.request.user)
        if acesso.is_responsavel:
            return queryset.filter(alunos__responsavel=acesso.objeto).distinct()
        if acesso.is_profissional:
            return queryset.filter(profissional=acesso.objeto)
        if acesso.is_aluno:
            return queryset.filter(alunos=acesso.objeto)
        return queryset.none()


class BloqueioAgendaViewSet(ProtegidoModelViewSet):
    queryset = BloqueioAgenda.objects.select_related("profissional", "espaco").order_by(
        "data_hora_inicio"
    )
    serializer_class = BloqueioAgendaSerializer
    permission_classes = [IsAuthenticated, BloqueioPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset
        acesso = obter_perfil(self.request.user)
        if acesso.is_profissional:
            return queryset.filter(profissional=acesso.objeto)
        return queryset.none()


class RelatorioTreinoViewSet(ProtegidoModelViewSet):
    queryset = RelatorioTreino.objects.select_related(
        "agendamento",
        "agendamento__profissional",
        "agendamento__espaco",
        "agendamento__servico",
    ).prefetch_related("agendamento__alunos").order_by("data_finalizacao")
    serializer_class = RelatorioTreinoSerializer
    permission_classes = [IsAuthenticated, RelatorioPermission]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset
        acesso = obter_perfil(self.request.user)
        if acesso.is_profissional:
            return queryset.filter(agendamento__profissional=acesso.objeto)
        if acesso.is_aluno:
            return queryset.filter(agendamento__alunos=acesso.objeto).distinct()
        return queryset.none()


class MeView(APIView):
    """Quem está logado e qual o seu perfil de acesso."""

    permission_classes = [IsAuthenticated]

    @extend_schema(responses=dict)
    def get(self, request):
        return Response(dados_do_usuario(request.user))


class LoginView(ObtainAuthToken):
    """Gera o token de acesso e avisa quando o cadastro ainda aguarda aprovação."""

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return super().post(request, *args, **kwargs)

        usuario = get_user_model().objects.filter(
            username=request.data.get("username", "")
        ).first()
        if (
            usuario is not None
            and not usuario.is_active
            and usuario.check_password(request.data.get("password", ""))
        ):
            return Response(
                {
                    "codigo": "aguardando_aprovacao",
                    "non_field_errors": [
                        "Seu cadastro está aguardando a aprovação do administrador."
                    ],
                },
                status=403,
            )
        raise serializers.ValidationError(serializer.errors)


class CadastroProfissionalView(APIView):
    """Cadastro público de treinador ou profissional de saúde (fica inativo até aprovação)."""

    permission_classes = [AllowAny]

    @extend_schema(request=CadastroProfissionalSerializer, responses={201: dict})
    def post(self, request):
        serializer = CadastroProfissionalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profissional = serializer.save()
        return Response(
            {
                "id": profissional.pk,
                "nome": profissional.nome,
                "email": profissional.email,
                "perfil": profissional.perfil,
                "ativo": profissional.ativo,
                "mensagem": "Cadastro recebido. Aguarde a aprovação do administrador.",
            },
            status=201,
        )


class CadastroResponsavelView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=CadastroResponsavelSerializer, responses={201: dict})
    def post(self, request):
        serializer = CadastroResponsavelSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        responsavel = serializer.save()
        return Response(
            {
                "id": responsavel.pk,
                "nome": responsavel.nome,
                "email": responsavel.email,
            },
            status=201,
        )
