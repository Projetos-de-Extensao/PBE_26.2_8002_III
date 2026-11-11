from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api import (
    AdministradorViewSet,
    AgendamentoViewSet,
    AlunoViewSet,
    BloqueioAgendaViewSet,
    CadastroResponsavelView,
    EspacoViewSet,
    ProfissionalViewSet,
    RelatorioTreinoViewSet,
    ResponsavelViewSet,
    ServicoViewSet,
)

router = DefaultRouter()
router.register("administradores", AdministradorViewSet)
router.register("profissionais", ProfissionalViewSet)
router.register("alunos", AlunoViewSet)
router.register("responsaveis", ResponsavelViewSet)
router.register("servicos", ServicoViewSet)
router.register("espacos", EspacoViewSet)
router.register("agendamentos", AgendamentoViewSet)
router.register("bloqueios-agenda", BloqueioAgendaViewSet)
router.register("relatorios-treino", RelatorioTreinoViewSet)

urlpatterns = [
    path("api/responsaveis/cadastro/", CadastroResponsavelView.as_view()),
    path("api/", include(router.urls)),
]
