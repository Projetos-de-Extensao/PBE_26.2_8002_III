from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import (
    Administrador,
    Agendamento,
    Aluno,
    BloqueioAgenda,
    Espaco,
    Profissional,
    RelatorioTreino,
    Servico,
)
from .serializers import (
    AdministradorSerializer,
    AgendamentoSerializer,
    AlunoSerializer,
    BloqueioAgendaSerializer,
    EspacoSerializer,
    ProfissionalSerializer,
    RelatorioTreinoSerializer,
    ServicoSerializer,
)


class ProtegidoModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]


class AdministradorViewSet(ProtegidoModelViewSet):
    queryset = Administrador.objects.all().order_by("id")
    serializer_class = AdministradorSerializer


class ProfissionalViewSet(ProtegidoModelViewSet):
    queryset = Profissional.objects.all().order_by("id")
    serializer_class = ProfissionalSerializer


class AlunoViewSet(ProtegidoModelViewSet):
    queryset = Aluno.objects.all().order_by("id")
    serializer_class = AlunoSerializer


class ServicoViewSet(ProtegidoModelViewSet):
    queryset = Servico.objects.all().order_by("id")
    serializer_class = ServicoSerializer


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
