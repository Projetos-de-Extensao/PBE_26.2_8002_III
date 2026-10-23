from datetime import date, datetime, timedelta, timezone

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

from .models import (
    Agendamento,
    Aluno,
    Espaco,
    Profissional,
    Servico,
    StatusAgendamento,
    TipoPerfil,
    TipoServico,
)


class AgendamentoModelTest(TestCase):
    def test_agendamento_persiste_relacionamentos_com_servico_espaco_e_profissional(self):
        servico = Servico.objects.create(
            nome=TipoServico.TREINO,
            duracao_minutos=60,
        )
        espaco = Espaco.objects.create(
            nome="Sala 1",
            capacidade_maxima=10,
            localizacao="Bloco A",
        )
        profissional = Profissional.objects.create(
            nome="Carlos",
            email="carlos.agendamento@gaap.com",
            registro_profissional="CREF-AG-001",
            especialidade=TipoServico.TREINO,
        )
        inicio = datetime(2026, 10, 22, 10, tzinfo=timezone.utc)
        agendamento = Agendamento.objects.create(
            data_hora_inicio=inicio,
            data_hora_fim=inicio + timedelta(hours=1),
            servico=servico,
            espaco=espaco,
            profissional=profissional,
        )

        agendamento.refresh_from_db()
        self.assertEqual(agendamento.servico, servico)
        self.assertEqual(agendamento.espaco, espaco)
        self.assertEqual(agendamento.profissional, profissional)
        self.assertEqual(agendamento.status, StatusAgendamento.AGENDADO)


class ProfissionalModelTest(TestCase):
    def test_treino_recebe_perfil_treinador(self):
        p = Profissional.objects.create(
            nome="Carlos",
            email="carlos@gaap.com",
            registro_profissional="CREF-001",
            especialidade=TipoServico.TREINO,
        )
        self.assertEqual(p.perfil, TipoPerfil.TREINADOR)

    def test_fisioterapia_recebe_perfil_profissional_saude(self):
        p = Profissional.objects.create(
            nome="Ana",
            email="ana@gaap.com",
            registro_profissional="CREFITO-001",
            especialidade=TipoServico.FISIOTERAPIA,
        )
        self.assertEqual(p.perfil, TipoPerfil.PROFISSIONAL_SAUDE)

    def test_registro_profissional_duplicado(self):
        Profissional.objects.create(
            nome="Bruno",
            email="bruno@gaap.com",
            registro_profissional="CRP-001",
            especialidade=TipoServico.PSICOLOGIA,
        )
        with self.assertRaises(IntegrityError):
            Profissional.objects.create(
                nome="Bia",
                email="bia@gaap.com",
                registro_profissional="CRP-001",
                especialidade=TipoServico.PSICOLOGIA,
            )


class AlunoModelTest(TestCase):
    def test_aluno_recebe_perfil_aluno_e_ativo(self):
        a = Aluno.objects.create(
            nome="Joana",
            email="joana@gaap.com",
            matricula="2026001",
            data_nascimento=date(2000, 5, 10),
        )
        self.assertEqual(a.perfil, TipoPerfil.ALUNO)
        self.assertTrue(a.ativo)

    def test_email_duplicado(self):
        Aluno.objects.create(
            nome="Pedro",
            email="pedro@gaap.com",
            matricula="2026002",
            data_nascimento=date(1999, 1, 1),
        )
        with self.assertRaises(IntegrityError):
            Aluno.objects.create(
                nome="Paulo",
                email="pedro@gaap.com",
                matricula="2026003",
                data_nascimento=date(1998, 2, 2),
            )


class AdminTest(TestCase):
    def setUp(self):
        user = get_user_model().objects.create_superuser(
            "admin", "admin@gaap.com", "admin123"
        )
        self.client.force_login(user)

    def test_paginas_admin_respondem_200(self):
        for url in (
            "/admin/app/profissional/",
            "/admin/app/profissional/add/",
            "/admin/app/aluno/",
            "/admin/app/aluno/add/",
        ):
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 200)

    def test_post_cria_aluno(self):
        response = self.client.post(
            "/admin/app/aluno/add/",
            {
                "nome": "Maria",
                "email": "maria@gaap.com",
                "telefone": "",
                "ativo": "on",
                "matricula": "2026010",
                "data_nascimento": "2001-03-15",
                "observacoes_medicas": "",
            },
        )
        self.assertEqual(response.status_code, 302)
        aluno = Aluno.objects.get(matricula="2026010")
        self.assertEqual(aluno.perfil, TipoPerfil.ALUNO)
