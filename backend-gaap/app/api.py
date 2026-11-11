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
from .serializers import (
    AdministradorSerializer,
    AgendamentoSerializer,
    AlunoSerializer,
    BloqueioAgendaSerializer,
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
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.user.is_staff:
            return True
        return (
            view.action == "create"
            and Responsavel.objects.filter(
                email__iexact=request.user.username,
                ativo=True,
            ).exists()
        )


class AlunoPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.user.is_staff:
            return True
        return (
            view.action == "create"
            and Responsavel.objects.filter(
                email__iexact=request.user.username,
                ativo=True,
            ).exists()
        )


class ProtegidoModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, EquipeOuLeitura]


class AdministradorViewSet(ProtegidoModelViewSet):
    queryset = Administrador.objects.all().order_by("id")
    serializer_class = AdministradorSerializer


class ProfissionalViewSet(ProtegidoModelViewSet):
    queryset = Profissional.objects.all().order_by("id")
    serializer_class = ProfissionalSerializer


class AlunoViewSet(ProtegidoModelViewSet):
    queryset = Aluno.objects.all().order_by("id")
    serializer_class = AlunoSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return super().get_queryset()
        return Aluno.objects.filter(
            responsavel__email__iexact=self.request.user.username,
            responsavel__ativo=True,
        ).order_by("id")

    permission_classes = [IsAuthenticated, AlunoPermission]


class ResponsavelViewSet(ProtegidoModelViewSet):
    queryset = Responsavel.objects.all().order_by("id")
    serializer_class = ResponsavelSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_permissions(self):
        if self.action == "me":
            return [IsAuthenticated()]
        return super().get_permissions()

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        responsavel = Responsavel.objects.filter(
            email__iexact=request.user.username,
            ativo=True,
        ).first()
        return Response(
            {
                "perfil": "RESPONSAVEL" if responsavel else None,
                "is_staff": request.user.is_staff,
                "nome": responsavel.nome if responsavel else None,
            }
        )


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
        if self.request.user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(
            alunos__responsavel__email__iexact=self.request.user.username,
            alunos__responsavel__ativo=True,
        ).distinct()


class BloqueioAgendaViewSet(ProtegidoModelViewSet):
    queryset = BloqueioAgenda.objects.select_related("profissional", "espaco").order_by(
        "data_hora_inicio"
    )
    serializer_class = BloqueioAgendaSerializer


class RelatorioTreinoViewSet(ProtegidoModelViewSet):
    queryset = RelatorioTreino.objects.select_related(
        "agendamento",
        "agendamento__profissional",
        "agendamento__espaco",
        "agendamento__servico",
    ).prefetch_related("agendamento__alunos").order_by("data_finalizacao")
    serializer_class = RelatorioTreinoSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class CadastroResponsavelView(APIView):
    permission_classes = [AllowAny]

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
