from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api import (
    AdministradorViewSet,
    AgendamentoViewSet,
    AlunoViewSet,
    BloqueioAgendaViewSet,
    EspacoViewSet,
    ProfissionalViewSet,
    RelatorioTreinoViewSet,
    ServicoViewSet,
)

router = DefaultRouter()
router.register("administradores", AdministradorViewSet)
router.register("profissionais", ProfissionalViewSet)
router.register("alunos", AlunoViewSet)
router.register("servicos", ServicoViewSet)
router.register("espacos", EspacoViewSet)
router.register("agendamentos", AgendamentoViewSet)
router.register("bloqueios-agenda", BloqueioAgendaViewSet)
router.register("relatorios-treino", RelatorioTreinoViewSet)

urlpatterns = [path("api/", include(router.urls))]
