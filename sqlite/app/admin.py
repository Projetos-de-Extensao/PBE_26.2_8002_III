from django.contrib import admin
from .models import Aluno, Espaco, Produto, Profissional, Servico

admin.site.register(Produto)
admin.site.register(Servico)
admin.site.register(Espaco)


@admin.register(Profissional)
class ProfissionalAdmin(admin.ModelAdmin):
    list_display = ("nome", "especialidade", "registro_profissional", "email", "ativo")
    list_filter = ("especialidade", "ativo")
    search_fields = ("nome", "email", "registro_profissional")
    readonly_fields = ("perfil",)


@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ("nome", "matricula", "data_nascimento", "email", "ativo")
    list_filter = ("ativo",)
    search_fields = ("nome", "email", "matricula")
    readonly_fields = ("perfil",)
