from django.contrib import admin, messages
from django.contrib.auth.hashers import make_password
from django.db import transaction

from .perfis import sincronizar_conta
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


def email_salvo(obj):
    """E-mail gravado antes da edição, para achar a conta de login correspondente."""
    if not obj.pk:
        return None
    return type(obj).objects.filter(pk=obj.pk).values_list("email", flat=True).first()


@admin.register(Profissional)
# Define a listagem e os filtros de profissionais no admin.
class ProfissionalAdmin(admin.ModelAdmin):
    list_display = ("nome", "especialidade", "registro_profissional", "email", "ativo")
    list_filter = ("ativo", "especialidade")
    search_fields = ("nome", "email", "registro_profissional")
    readonly_fields = ("perfil",)
    exclude = ("senha_hash",)
    actions = ["aprovar_cadastros"]

    @admin.action(description="Aprovar cadastros selecionados (liberar login)")
    def aprovar_cadastros(self, request, queryset):
        pendentes = list(queryset.filter(ativo=False))
        with transaction.atomic():
            for profissional in pendentes:
                profissional.ativo = True
                profissional.save(update_fields=["ativo"])
                sincronizar_conta(profissional)
        self.message_user(
            request,
            f"{len(pendentes)} cadastro(s) aprovado(s).",
            messages.SUCCESS,
        )

    def save_model(self, request, obj, form, change):
        anterior = email_salvo(obj)
        if not obj.senha_hash:
            obj.senha_hash = make_password(None)
        super().save_model(request, obj, form, change)
        # Ativar ou desativar aqui também libera ou bloqueia o login.
        sincronizar_conta(obj, anterior)


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
        anterior = email_salvo(obj)
        if not obj.senha_hash:
            obj.senha_hash = make_password(None)
        obj.perfil = TipoPerfil.ALUNO
        super().save_model(request, obj, form, change)
        sincronizar_conta(obj, anterior)
