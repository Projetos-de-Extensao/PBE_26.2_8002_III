from base64 import b64encode
from datetime import date, datetime, timedelta, timezone

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    Administrador,
    Agendamento,
    Aluno,
    Espaco,
    Profissional,
    RelatorioTreino,
    Responsavel,
    Servico,
    StatusAgendamento,
    TipoPerfil,
    TipoServico,
)


class DiagramaMethodsTest(TestCase):
    def setUp(self):
        self.administrador = Administrador.objects.create(
            nome="Admin",
            email="admin@gaap.com",
            senha_hash="hash",
            telefone="111",
            perfil=TipoPerfil.ADMINISTRADOR,
            ativo=True,
            setor="Gestão",
        )
        self.profissional = Profissional.objects.create(
            nome="Carlos",
            email="carlos.metodos@gaap.com",
            senha_hash="hash",
            telefone="222",
            perfil=TipoPerfil.TREINADOR,
            ativo=True,
            registro_profissional="CREF-MET-001",
            especialidade=TipoServico.TREINO,
        )
        responsavel_user = get_user_model().objects.create_user(
            username="responsavel-metodos",
            password="senha-segura",
        )
        self.responsavel = Responsavel.objects.create(
            nome="Responsável",
            email="responsavel.metodos@gaap.com",
            senha_hash="hash",
            telefone="333",
            perfil=TipoPerfil.RESPONSAVEL,
            ativo=True,
        )
        self.aluno = Aluno.objects.create(
            nome="Joana",
            email="joana.metodos@gaap.com",
            senha_hash="hash",
            telefone="444",
            perfil=TipoPerfil.ALUNO,
            ativo=True,
            matricula="MET-001",
            data_nascimento=date(2000, 5, 10),
            observacoes_medicas="",
            responsavel=self.responsavel,
        )
        self.servico = Servico.objects.create(
            nome=TipoServico.TREINO,
            duracao_minutos=60,
            ativo=True,
        )
        self.espaco = Espaco.objects.create(
            nome="Sala de testes",
            capacidade_maxima=10,
            localizacao="Bloco A",
            ativo=True,
        )

    def criar_dados_agendamento(self, inicio):
        return {
            "data_hora_inicio": inicio,
            "data_hora_fim": inicio + timedelta(hours=1),
            "status": StatusAgendamento.AGENDADO,
            "profissional": self.profissional,
            "espaco": self.espaco,
            "servico": self.servico,
        }

    def test_administrador_cadastra_usuario_e_configura_recursos(self):
        usuario = self.administrador.cadastrar_usuario(
            {
                "nome": "Novo aluno",
                "email": "novo@gaap.com",
                "senha_hash": "hash",
                "telefone": "444",
                "perfil": TipoPerfil.ALUNO,
                "ativo": True,
                "matricula": "NOVO-001",
                "data_nascimento": date(2001, 1, 1),
                "observacoes_medicas": "Sem observacoes",
                "responsavel": self.responsavel,
            }
        )
        sala = self.administrador.configurar_sala(
            {
                "nome": "Sala B",
                "capacidade_maxima": 8,
                "localizacao": "Bloco B",
                "ativo": True,
            }
        )
        servico = self.administrador.configurar_servico(
            {
                "nome": TipoServico.FISIOTERAPIA,
                "duracao_minutos": 45,
                "ativo": True,
            }
        )
        bloqueio = self.administrador.aplicar_bloqueio(
            {
                "data_hora_inicio": datetime(2026, 10, 26, 10, tzinfo=timezone.utc),
                "data_hora_fim": datetime(2026, 10, 26, 11, tzinfo=timezone.utc),
                "motivo": "Manutenção",
                "espaco": sala,
            }
        )

        self.assertIsInstance(usuario, Aluno)
        self.assertEqual(sala.nome, "Sala B")
        self.assertEqual(servico.obter_duracao(), 45)
        self.assertEqual(bloqueio.espaco, sala)

    def test_responsavel_agenda_para_aluno_e_consulta_agenda(self):
        inicio = datetime(2026, 10, 27, 10, tzinfo=timezone.utc)
        agendamento = self.responsavel.solicitar_agendamento(
            {
                **self.criar_dados_agendamento(inicio),
                "alunos": [self.aluno],
            }
        )

        self.assertEqual(self.aluno.consultar_agenda(), [agendamento])
        self.assertEqual(self.responsavel.consultar_agenda(), [agendamento])
        self.assertEqual(self.profissional.consultar_agenda(), [agendamento])
        self.assertEqual(agendamento.status, StatusAgendamento.AGENDADO)

    def test_solicitacao_rejeita_conflito_de_horario(self):
        inicio = datetime(2026, 10, 27, 10, tzinfo=timezone.utc)
        dados = {
            **self.criar_dados_agendamento(inicio),
            "alunos": [self.aluno],
        }
        self.responsavel.solicitar_agendamento(dados)

        with self.assertRaises(ValidationError):
            self.responsavel.solicitar_agendamento(dados)

    def test_responsavel_nao_agenda_para_aluno_nao_vinculado(self):
        outro_aluno = Aluno.objects.create(
            nome="Outro aluno",
            email="outro.metodos@gaap.com",
            senha_hash="hash",
            telefone="555",
            perfil=TipoPerfil.ALUNO,
            ativo=True,
            matricula="MET-002",
            data_nascimento=date(2001, 5, 10),
        )

        with self.assertRaises(ValidationError):
            self.responsavel.solicitar_agendamento(
                {
                    **self.criar_dados_agendamento(
                        datetime(2026, 10, 27, 10, tzinfo=timezone.utc)
                    ),
                    "alunos": [outro_aluno],
                }
            )

    def test_metodos_de_servico_espaco_agendamento_e_bloqueio(self):
        self.assertTrue(self.espaco.verificar_capacidade(10))
        self.assertFalse(self.espaco.verificar_capacidade(11))
        self.assertEqual(self.servico.obter_duracao(), 60)

        inicio = datetime(2026, 10, 27, 10, tzinfo=timezone.utc)
        agendamento = self.responsavel.solicitar_agendamento(
            {
                **self.criar_dados_agendamento(inicio),
                "alunos": [self.aluno],
            }
        )
        self.assertFalse(agendamento.validar_conflito())
        agendamento.cancelar()
        self.assertEqual(agendamento.status, StatusAgendamento.CANCELADO)

        bloqueio = self.administrador.aplicar_bloqueio(
            {
                "data_hora_inicio": inicio,
                "data_hora_fim": inicio + timedelta(hours=1),
                "motivo": "Manutenção",
                "espaco": self.espaco,
            }
        )
        self.assertTrue(
            bloqueio.verificar_intersecao(
                inicio + timedelta(minutes=30),
                inicio + timedelta(hours=2),
            )
        )

    def test_profissional_finaliza_relatorio_e_registra_presenca(self):
        agendamento = Agendamento.objects.create(
            **self.criar_dados_agendamento(
                datetime(2026, 10, 27, 10, tzinfo=timezone.utc)
            )
        )
        agendamento.alunos.add(self.aluno)
        relatorio = self.profissional.finalizar_relatorio(
            agendamento.id,
            {
                "presenca": False,
                "atividades_realizadas": "Treino de mobilidade",
                "observacoes_tecnicas": "Sem observações",
            },
        )

        self.profissional.registrar_presenca(agendamento.id, True)
        relatorio.refresh_from_db()
        self.assertTrue(relatorio.presenca)
        self.assertIsNotNone(relatorio.data_finalizacao)
        self.assertEqual(RelatorioTreino.objects.count(), 1)

    def test_usuario_altera_e_autentica_senha(self):
        self.aluno.alterar_senha("nova-senha")
        self.aluno.refresh_from_db()

        self.assertTrue(self.aluno.autenticar("nova-senha"))
        self.assertFalse(self.aluno.autenticar("senha-incorreta"))

    def test_representacao_em_texto_dos_modelos(self):
        agendamento = Agendamento.objects.create(
            **self.criar_dados_agendamento(
                datetime(2026, 10, 28, 10, tzinfo=timezone.utc)
            )
        )
        relatorio = RelatorioTreino(
            presenca=True,
            atividades_realizadas="Treino",
            observacoes_tecnicas="Sem observações",
            data_finalizacao=datetime(2026, 10, 28, 11, tzinfo=timezone.utc),
            agendamento=agendamento,
        )

        self.assertEqual(str(self.administrador), "Admin")
        self.assertEqual(str(self.profissional), "Carlos")
        self.assertEqual(str(self.aluno), "Joana")
        self.assertEqual(str(self.responsavel), "Responsável")
        self.assertEqual(str(self.servico), "Treino")
        servico_personalizado = Servico(
            nome="Pilates",
            duracao_minutos=50,
            ativo=True,
        )
        self.assertEqual(str(servico_personalizado), "Pilates")
        self.assertEqual(str(self.espaco), "Sala de testes")
        self.assertEqual(str(agendamento), f"Agendamento #{agendamento.pk}")
        self.assertEqual(str(relatorio), f"Relatório do agendamento #{agendamento.pk}")


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


class AgendamentoApiTest(APITestCase):
    def setUp(self):
        self.api_user = get_user_model().objects.create_user(
            username="api-test",
            password="test-password",
        )
        self.client.force_authenticate(user=self.api_user)
        self.api_user.is_staff = True
        self.api_user.save(update_fields=["is_staff"])
        self.responsavel_user = get_user_model().objects.create_user(
            username="responsavel.api@gaap.com",
            email="responsavel.api@gaap.com",
            password="senha-segura",
        )
        self.responsavel = Responsavel.objects.create(
            nome="Responsável API",
            email="responsavel.api@gaap.com",
            senha_hash="hash",
            telefone="333",
            perfil=TipoPerfil.RESPONSAVEL,
            ativo=True,
        )
        self.profissional = Profissional.objects.create(
            nome="Profissional API",
            email="profissional.api@gaap.com",
            senha_hash="hash",
            telefone="111",
            perfil=TipoPerfil.TREINADOR,
            ativo=True,
            registro_profissional="CREF-API-001",
            especialidade=TipoServico.TREINO,
        )
        self.aluno = Aluno.objects.create(
            nome="Aluno API",
            email="aluno.api@gaap.com",
            senha_hash="hash",
            telefone="222",
            perfil=TipoPerfil.ALUNO,
            ativo=True,
            matricula="API-001",
            data_nascimento=date(2000, 1, 1),
            observacoes_medicas="",
            responsavel=self.responsavel,
        )
        self.espaco = Espaco.objects.create(
            nome="Sala API",
            capacidade_maxima=10,
            localizacao="Bloco A",
            ativo=True,
        )
        self.servico = Servico.objects.create(
            nome=TipoServico.TREINO,
            duracao_minutos=60,
            ativo=True,
        )
        self.url = "/api/agendamentos/"
        self.payload = {
            "data_hora_inicio": "2026-11-02T10:00:00Z",
            "data_hora_fim": "2026-11-02T11:00:00Z",
            "profissional": self.profissional.pk,
            "alunos": [self.aluno.pk],
            "espaco": self.espaco.pk,
            "servico": self.servico.pk,
        }

    def test_get_lista_agendamentos(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_post_cria_agendamento_com_status_agendado(self):
        response = self.client.post(self.url, self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data["status"], StatusAgendamento.AGENDADO)
        self.assertEqual(Agendamento.objects.count(), 1)
        self.assertEqual(
            list(Agendamento.objects.get().alunos.values_list("pk", flat=True)),
            [self.aluno.pk],
        )

    def test_responsavel_pode_agendar_para_aluno_vinculado(self):
        self.client.force_authenticate(user=self.responsavel_user)

        response = self.client.post(self.url, self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(Agendamento.objects.count(), 1)

    def test_usuario_sem_perfil_responsavel_pode_consultar_mas_nao_agendar(self):
        usuario_aluno = get_user_model().objects.create_user(
            username="aluno-api",
            password="senha-segura",
        )
        self.client.force_authenticate(user=usuario_aluno)

        get_response = self.client.get(self.url)
        post_response = self.client.post(self.url, self.payload, format="json")

        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(post_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Agendamento.objects.count(), 0)

    def test_responsavel_nao_agenda_para_aluno_de_outra_familia(self):
        outro_aluno = Aluno.objects.create(
            nome="Outro aluno",
            email="outro.aluno.api@gaap.com",
            senha_hash="hash",
            telefone="444",
            perfil=TipoPerfil.ALUNO,
            ativo=True,
            matricula="API-002",
            data_nascimento=date(2001, 1, 1),
        )
        self.client.force_authenticate(user=self.responsavel_user)

        response = self.client.post(
            self.url,
            {**self.payload, "alunos": [outro_aluno.pk]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Agendamento.objects.count(), 0)

    def test_responsavel_nao_pode_alterar_ou_excluir_agendamento(self):
        agendamento_response = self.client.post(
            self.url,
            self.payload,
            format="json",
        )
        self.assertEqual(agendamento_response.status_code, status.HTTP_201_CREATED)
        agendamento_id = agendamento_response.data["id"]
        self.client.force_authenticate(user=self.responsavel_user)

        update_response = self.client.patch(
            f"{self.url}{agendamento_id}/",
            {"status": StatusAgendamento.CANCELADO},
            format="json",
        )
        delete_response = self.client.delete(f"{self.url}{agendamento_id}/")

        self.assertEqual(update_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_post_rejeita_conflito_sem_persistir_agendamento(self):
        Agendamento.objects.create(
            data_hora_inicio="2026-11-02T10:00:00Z",
            data_hora_fim="2026-11-02T11:00:00Z",
            status=StatusAgendamento.AGENDADO,
            profissional=self.profissional,
            espaco=self.espaco,
            servico=self.servico,
        )

        response = self.client.post(self.url, self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Agendamento.objects.count(), 1)

    def test_post_rejeita_horario_invertido(self):
        payload = {
            **self.payload,
            "data_hora_inicio": "2026-11-02T11:00:00Z",
            "data_hora_fim": "2026-11-02T10:00:00Z",
        }

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Agendamento.objects.count(), 0)

    def test_api_exige_autenticacao(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_responsavel_se_cadastra_e_cria_aluno_vinculado(self):
        self.client.force_authenticate(user=None)
        cadastro_response = self.client.post(
            "/api/responsaveis/cadastro/",
            {
                "nome": "Responsável novo",
                "email": "novo.responsavel@gaap.com",
                "senha": "senha-segura-123",
            },
            format="json",
        )

        self.assertEqual(
            cadastro_response.status_code,
            status.HTTP_201_CREATED,
            cadastro_response.data,
        )
        self.assertNotIn("senha", cadastro_response.data)
        responsavel = Responsavel.objects.get(email="novo.responsavel@gaap.com")
        credentials = b64encode(
            b"novo.responsavel@gaap.com:senha-segura-123"
        ).decode()
        self.client.credentials(HTTP_AUTHORIZATION=f"Basic {credentials}")

        perfil_response = self.client.get("/api/responsaveis/me/")
        self.assertEqual(perfil_response.status_code, status.HTTP_200_OK)
        self.assertEqual(perfil_response.data["perfil"], "RESPONSAVEL")

        aluno_response = self.client.post(
            "/api/alunos/",
            {
                "nome": "Filho do responsável",
                "email": "aluno.responsavel@gaap.com",
                "telefone": "555",
                "perfil": TipoPerfil.ALUNO,
                "ativo": True,
                "matricula": "RESP-001",
                "data_nascimento": "2012-01-01",
                "observacoes_medicas": "",
            },
            format="json",
        )

        self.assertEqual(
            aluno_response.status_code,
            status.HTTP_201_CREATED,
            aluno_response.data,
        )
        aluno = Aluno.objects.get(pk=aluno_response.data["id"])
        self.assertEqual(aluno.responsavel, responsavel)
        self.assertFalse(aluno.autenticar("senha-segura-123"))
        self.assertEqual(
            list(self.client.get("/api/alunos/").data)[0]["id"],
            aluno.pk,
        )

    def test_responsavel_consulta_apenas_os_proprios_alunos(self):
        outro_aluno = Aluno.objects.create(
            nome="Aluno de outra família",
            email="outro.familia@gaap.com",
            senha_hash="hash",
            telefone="666",
            perfil=TipoPerfil.ALUNO,
            ativo=True,
            matricula="API-003",
            data_nascimento=date(2010, 1, 1),
        )
        self.client.force_authenticate(user=self.responsavel_user)

        response = self.client.get("/api/alunos/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([aluno["id"] for aluno in response.data], [self.aluno.pk])
        self.assertNotIn(outro_aluno.pk, [aluno["id"] for aluno in response.data])

    def test_cadastro_de_responsavel_rejeita_email_em_uso(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(
            "/api/responsaveis/cadastro/",
            {
                "nome": "Duplicado",
                "email": self.responsavel.email,
                "senha": "senha-segura-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_crud_de_servico(self):
        response = self.client.post(
            "/api/servicos/",
            {
                "nome": TipoServico.FISIOTERAPIA,
                "duracao_minutos": 45,
                "ativo": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        servico_id = response.data["id"]

        response = self.client.patch(
            f"/api/servicos/{servico_id}/",
            {"duracao_minutos": 50},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["duracao_minutos"], 50)

        response = self.client.delete(f"/api/servicos/{servico_id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Servico.objects.filter(pk=servico_id).exists())

    def test_servico_aceita_modalidade_nova_e_disponibiliza_tipos_predefinidos(self):
        tipos_response = self.client.get("/api/servicos/tipos/")

        self.assertEqual(tipos_response.status_code, status.HTTP_200_OK)
        self.assertIn(
            {"value": TipoServico.TREINO, "label": "Treino"},
            tipos_response.data,
        )

        response = self.client.post(
            "/api/servicos/",
            {
                "nome": "Pilates",
                "duracao_minutos": 50,
                "ativo": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data["nome"], "Pilates")
        self.assertTrue(Servico.objects.filter(nome="Pilates").exists())

    def test_crud_de_espaco(self):
        response = self.client.post(
            "/api/espacos/",
            {
                "nome": "Sala nova",
                "capacidade_maxima": 8,
                "localizacao": "Bloco B",
                "ativo": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        espaco_id = response.data["id"]
        response = self.client.patch(
            f"/api/espacos/{espaco_id}/",
            {"capacidade_maxima": 9},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["capacidade_maxima"], 9)

        response = self.client.delete(f"/api/espacos/{espaco_id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_crud_de_profissional(self):
        response = self.client.post(
            "/api/profissionais/",
            {
                "nome": "Profissional novo",
                "email": "profissional.novo@gaap.com",
                "senha": "senha-secreta",
                "telefone": "444",
                "perfil": TipoPerfil.TREINADOR,
                "ativo": True,
                "registro_profissional": "CREF-API-002",
                "especialidade": TipoServico.TREINO,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        profissional_id = response.data["id"]
        response = self.client.patch(
            f"/api/profissionais/{profissional_id}/",
            {"telefone": "555"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["telefone"], "555")

        response = self.client.delete(f"/api/profissionais/{profissional_id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_crud_de_administrador(self):
        response = self.client.post(
            "/api/administradores/",
            {
                "nome": "Administrador novo",
                "email": "administrador.novo@gaap.com",
                "senha": "senha-secreta",
                "telefone": "666",
                "perfil": TipoPerfil.ADMINISTRADOR,
                "ativo": True,
                "setor": "Gestão",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        administrador_id = response.data["id"]
        response = self.client.patch(
            f"/api/administradores/{administrador_id}/",
            {"setor": "Coordenação"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["setor"], "Coordenação")

        response = self.client.delete(
            f"/api/administradores/{administrador_id}/"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_crud_de_bloqueio_e_relatorio(self):
        response = self.client.post(
            "/api/bloqueios-agenda/",
            {
                "data_hora_inicio": "2026-11-02T12:00:00Z",
                "data_hora_fim": "2026-11-02T13:00:00Z",
                "motivo": "Manutenção",
                "espaco": self.espaco.pk,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        bloqueio_id = response.data["id"]
        response = self.client.patch(
            f"/api/bloqueios-agenda/{bloqueio_id}/",
            {"motivo": "Reforma"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(f"/api/bloqueios-agenda/{bloqueio_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        agendamento = Agendamento.objects.create(
            data_hora_inicio="2026-11-02T14:00:00Z",
            data_hora_fim="2026-11-02T15:00:00Z",
            status=StatusAgendamento.AGENDADO,
            profissional=self.profissional,
            espaco=self.espaco,
            servico=self.servico,
        )
        response = self.client.post(
            "/api/relatorios-treino/",
            {
                "presenca": True,
                "atividades_realizadas": "Treino",
                "observacoes_tecnicas": "Sem observações",
                "data_finalizacao": "2026-11-02T15:00:00Z",
                "agendamento": agendamento.pk,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        relatorio_id = response.data["id"]
        response = self.client.patch(
            f"/api/relatorios-treino/{relatorio_id}/",
            {"presenca": False},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(f"/api/relatorios-treino/{relatorio_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_agendamento_pode_ser_atualizado_e_removido(self):
        create_response = self.client.post(self.url, self.payload, format="json")
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        agendamento_id = create_response.data["id"]

        response = self.client.patch(
            f"{self.url}{agendamento_id}/",
            {"status": StatusAgendamento.CANCELADO},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data["status"], StatusAgendamento.CANCELADO)

        response = self.client.delete(f"{self.url}{agendamento_id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_criacao_de_aluno_guarda_hash_sem_devolve_lo(self):
        response = self.client.post(
            "/api/alunos/",
            {
                "nome": "Aluno novo",
                "email": "aluno.novo@gaap.com",
                "senha": "senha-secreta",
                "telefone": "333",
                "perfil": TipoPerfil.ALUNO,
                "ativo": True,
                "matricula": "API-002",
                "data_nascimento": "2001-01-01",
                "observacoes_medicas": "Restrito",
                "responsavel": self.responsavel.pk,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("senha", response.data)
        self.assertNotIn("senha_hash", response.data)
        self.assertTrue(
            Aluno.objects.get(pk=response.data["id"]).autenticar("senha-secreta")
        )


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
        responsavel_user = get_user_model().objects.create_user(
            username="responsavel-admin",
            email="responsavel.admin@gaap.com",
            password="senha-segura",
        )
        self.responsavel = Responsavel.objects.create(
            nome="Responsável Admin",
            email="responsavel.admin@gaap.com",
            senha_hash="hash",
            telefone="111",
            perfil=TipoPerfil.RESPONSAVEL,
            ativo=True,
        )

    def test_paginas_admin_respondem_200(self):
        for url in (
            "/admin/app/administrador/",
            "/admin/app/agendamento/",
            "/admin/app/bloqueioagenda/",
            "/admin/app/profissional/",
            "/admin/app/profissional/add/",
            "/admin/app/aluno/",
            "/admin/app/aluno/add/",
            "/admin/app/responsavel/",
            "/admin/app/relatoriotreino/",
            "/admin/app/servico/",
            "/admin/app/espaco/",
        ):
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url).status_code, 200)

    def test_post_cria_aluno(self):
        response = self.client.post(
            "/admin/app/aluno/add/",
            {
                "nome": "Maria",
                "email": "maria@gaap.com",
                "telefone": "555",
                "ativo": "on",
                "matricula": "2026010",
                "data_nascimento": "2001-03-15",
                "observacoes_medicas": "",
                "responsavel": self.responsavel.pk,
            },
        )
        self.assertEqual(
            response.status_code,
            302,
            response.content.decode()[:2000],
        )
        aluno = Aluno.objects.get(matricula="2026010")
        self.assertEqual(aluno.perfil, TipoPerfil.ALUNO)
