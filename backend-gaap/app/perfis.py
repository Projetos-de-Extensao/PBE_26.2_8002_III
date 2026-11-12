"""Identificação do perfil do usuário logado e sincronização das contas de acesso.

O login da API usa o usuário padrão do Django (username = e-mail). Cada pessoa do
domínio (Responsavel, Profissional, Aluno) fica ligada à sua conta pelo e-mail.
"""

from dataclasses import dataclass

from django.contrib.auth import get_user_model
from django.db import transaction

from .models import Administrador, Aluno, Profissional, Responsavel, TipoPerfil

ADMINISTRADOR = TipoPerfil.ADMINISTRADOR
RESPONSAVEL = TipoPerfil.RESPONSAVEL
TREINADOR = TipoPerfil.TREINADOR
PROFISSIONAL_SAUDE = TipoPerfil.PROFISSIONAL_SAUDE
ALUNO = TipoPerfil.ALUNO

# Treinadores e profissionais de saúde têm as mesmas permissões no sistema.
PERFIS_PROFISSIONAIS = (TREINADOR, PROFISSIONAL_SAUDE)


@dataclass(frozen=True)
class PerfilAcesso:
    """Perfil do usuário logado e o objeto do domínio que o representa."""

    perfil: str | None
    objeto: object = None

    @property
    def is_profissional(self):
        return self.perfil in PERFIS_PROFISSIONAIS

    @property
    def is_responsavel(self):
        return self.perfil == RESPONSAVEL

    @property
    def is_aluno(self):
        return self.perfil == ALUNO


def obter_perfil(user):
    """Retorna o perfil do usuário: equipe (staff) ou a pessoa ativa ligada ao e-mail."""
    if user is None or not user.is_authenticated:
        return PerfilAcesso(None)
    if user.is_staff:
        return PerfilAcesso(ADMINISTRADOR)

    email = user.username
    responsavel = Responsavel.objects.filter(email__iexact=email, ativo=True).first()
    if responsavel:
        return PerfilAcesso(RESPONSAVEL, responsavel)

    profissional = Profissional.objects.filter(email__iexact=email, ativo=True).first()
    if profissional:
        perfil = profissional.perfil if profissional.perfil in PERFIS_PROFISSIONAIS else TREINADOR
        return PerfilAcesso(perfil, profissional)

    aluno = Aluno.objects.filter(email__iexact=email, ativo=True).first()
    if aluno:
        return PerfilAcesso(ALUNO, aluno)

    return PerfilAcesso(None)


def dados_do_usuario(user):
    """Resumo do usuário logado devolvido por /api/me/."""
    acesso = obter_perfil(user)
    objeto = acesso.objeto
    if acesso.perfil == ADMINISTRADOR:
        nome = user.get_full_name() or user.username
    else:
        nome = getattr(objeto, "nome", None)
    return {
        "perfil": acesso.perfil,
        "is_staff": bool(user.is_staff),
        "id": getattr(objeto, "pk", None),
        "nome": nome,
        "email": user.username,
        "especialidade": getattr(objeto, "especialidade", None),
    }


def email_em_uso(email, excluir=None):
    """Indica se o e-mail já pertence a uma conta ou a outra pessoa do sistema."""
    if excluir is not None and excluir.email and excluir.email.casefold() == email.casefold():
        return False
    if get_user_model().objects.filter(username__iexact=email).exists():
        return True
    return any(
        model.objects.filter(email__iexact=email).exists()
        for model in (Administrador, Responsavel, Profissional, Aluno)
    )


def criar_conta(email, senha, ativo=True):
    """Cria a conta de login (usuário Django) ligada ao e-mail."""
    return get_user_model().objects.create_user(
        username=email,
        email=email,
        password=senha,
        is_active=ativo,
    )


def sincronizar_conta(pessoa, email_anterior=None, senha=None):
    """Mantém a conta de login alinhada com a pessoa: e-mail, senha e situação (ativo)."""
    user_model = get_user_model()
    usuario = user_model.objects.filter(
        username__iexact=email_anterior or pessoa.email
    ).first()
    if usuario is None:
        if senha:
            return criar_conta(pessoa.email, senha, ativo=pessoa.ativo)
        return None

    with transaction.atomic():
        usuario.username = pessoa.email
        usuario.email = pessoa.email
        usuario.is_active = pessoa.ativo
        if senha:
            usuario.set_password(senha)
        usuario.save()
    return usuario
