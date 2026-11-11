from django.contrib import admin
from django.contrib.auth.hashers import make_password
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
    TipoPerfil,
)

admin.site.register(Servico)
admin.site.register(Espaco)
admin.site.register(Administrador)
admin.site.register(BloqueioAgenda)
admin.site.register(RelatorioTreino)


@admin.register(Responsavel)
class ResponsavelAdmin(admin.ModelAdmin):
    list_display = ("nome", "email", "telefone", "ativo")
    list_filter = ("ativo",)
    search_fields = ("nome", "email", "telefone")
    fields = ("nome", "email", "telefone", "perfil", "ativo")
    readonly_fields = fields

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Agendamento)
class AgendamentoAdmin(admin.ModelAdmin):
    filter_horizontal = ("alunos",)


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
    list_display = (
        "nome",
        "matricula",
        "data_nascimento",
        "responsavel",
        "email",
        "ativo",
    )
    list_filter = ("ativo",)
    search_fields = ("nome", "email", "matricula")
    readonly_fields = ("perfil",)
    exclude = ("senha_hash",)

    def save_model(self, request, obj, form, change):
        if not obj.senha_hash:
            obj.senha_hash = make_password(None)
        obj.perfil = TipoPerfil.ALUNO
        super().save_model(request, obj, form, change)
