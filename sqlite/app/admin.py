from django.contrib import admin
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

admin.site.register(Servico)
admin.site.register(Espaco)
admin.site.register(Agendamento)
admin.site.register(Administrador)
admin.site.register(BloqueioAgenda)
admin.site.register(RelatorioTreino)


@admin.register(Profissional)
# Define a listagem e os filtros de profissionais no admin.
class ProfissionalAdmin(admin.ModelAdmin):
    list_display = ("nome", "especialidade", "registro_profissional", "email", "ativo")
    list_filter = ("especialidade", "ativo")
    search_fields = ("nome", "email", "registro_profissional")
    readonly_fields = ("perfil",)


@admin.register(Aluno)
# Define a listagem e os filtros de alunos no admin.
class AlunoAdmin(admin.ModelAdmin):
    list_display = ("nome", "matricula", "data_nascimento", "email", "ativo")
    list_filter = ("ativo",)
    search_fields = ("nome", "email", "matricula")
    readonly_fields = ("perfil",)
