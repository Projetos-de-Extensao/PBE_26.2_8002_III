from django.contrib.auth.hashers import check_password, make_password
from django.db import models


# Define as categorias de usuário aceitas pelo sistema.
class TipoPerfil(models.TextChoices):
    ADMINISTRADOR = "ADMINISTRADOR", "Administrador"
    TREINADOR = "TREINADOR", "Treinador"
    PROFISSIONAL_SAUDE = "PROFISSIONAL_SAUDE", "Profissional de Saúde"
    ALUNO = "ALUNO", "Aluno"


# Define as modalidades de serviço oferecidas.
class TipoServico(models.TextChoices):
    TREINO = "TREINO", "Treino"
    FISIOTERAPIA = "FISIOTERAPIA", "Fisioterapia"
    PSICOLOGIA = "PSICOLOGIA", "Psicologia"
    NUTRICAO = "NUTRICAO", "Nutrição"


# Define os estados possíveis de um agendamento.
class StatusAgendamento(models.TextChoices):
    AGENDADO = "AGENDADO", "Agendado"
    REALIZADO = "REALIZADO", "Realizado"
    CANCELADO = "CANCELADO", "Cancelado"
    BLOQUEADO = "BLOQUEADO", "Bloqueado"


# Reúne dados e operações de autenticação compartilhados pelos usuários.
class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.TextField()
    email = models.TextField()
    senha_hash = models.TextField()
    telefone = models.TextField()
    perfil = models.CharField(max_length=20, choices=TipoPerfil.choices)
    ativo = models.BooleanField()

    # Marca Usuario como base sem tabela própria.
    class Meta:
        abstract = True

    def autenticar(self, senha):
        return check_password(senha, self.senha_hash)

    def alterar_senha(self, nova_senha):
        self.senha_hash = make_password(nova_senha)


# Representa o administrador e registra seu setor de atuação.
class Administrador(Usuario):
    setor = models.TextField()


# Representa o profissional e permite consultar seus agendamentos.
class Profissional(Usuario):
    registro_profissional = models.TextField()
    especialidade = models.CharField(max_length=20, choices=TipoServico.choices)

    def consultar_agenda(self):
        return Agendamento.objects.filter(profissional=self)


# Representa o aluno e permite consultar seus agendamentos.
class Aluno(Usuario):
    matricula = models.TextField()
    data_nascimento = models.DateField()
    observacoes_medicas = models.TextField()

    def consultar_agenda(self):
        return Agendamento.objects.filter(alunos=self)


# Armazena a modalidade e a duração de um serviço.
class Servico(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=20, choices=TipoServico.choices)
    duracao_minutos = models.IntegerField()
    ativo = models.BooleanField()

    def obter_duracao(self):
        return self.duracao_minutos


# Armazena um espaço e verifica se comporta a quantidade de alunos.
class Espaco(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.TextField()
    capacidade_maxima = models.IntegerField()
    localizacao = models.TextField()
    ativo = models.BooleanField()

    def verificar_capacidade(self, qtd_alunos):
        return qtd_alunos <= self.capacidade_maxima


# Relaciona participantes, profissional, espaço e serviço em um horário.
class Agendamento(models.Model):
    id = models.AutoField(primary_key=True)
    data_hora_inicio = models.DateTimeField()
    data_hora_fim = models.DateTimeField()
    status = models.CharField(max_length=20, choices=StatusAgendamento.choices)
    profissional = models.ForeignKey(
        Profissional,
        on_delete=models.CASCADE,
        related_name="agendamentos",
    )
    alunos = models.ManyToManyField(Aluno, related_name="agendamentos")
    espaco = models.ForeignKey(
        Espaco,
        on_delete=models.CASCADE,
        related_name="agendamentos",
    )
    servico = models.ForeignKey(
        Servico,
        on_delete=models.CASCADE,
        related_name="agendamentos",
    )

    def validar_conflito(self):
        conflitos = models.Q(profissional=self.profissional) | models.Q(
            espaco=self.espaco
        )
        if self.pk:
            conflitos |= models.Q(alunos__in=self.alunos.values_list("pk", flat=True))

        agendamentos = Agendamento.objects.filter(
            status=StatusAgendamento.AGENDADO,
            data_hora_inicio__lt=self.data_hora_fim,
            data_hora_fim__gt=self.data_hora_inicio,
        ).filter(conflitos)
        if self.pk:
            agendamentos = agendamentos.exclude(pk=self.pk)
        return agendamentos.exists()

    def confirmar(self):
        self.status = StatusAgendamento.AGENDADO
        self.save(update_fields=["status"])

    def cancelar(self):
        self.status = StatusAgendamento.CANCELADO
        self.save(update_fields=["status"])


# Registra períodos de indisponibilidade de profissional ou espaço.
class BloqueioAgenda(models.Model):
    id = models.AutoField(primary_key=True)
    data_hora_inicio = models.DateTimeField()
    data_hora_fim = models.DateTimeField()
    motivo = models.TextField()
    profissional = models.ForeignKey(
        Profissional,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="bloqueios_agenda",
    )
    espaco = models.ForeignKey(
        Espaco,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="bloqueios_agenda",
    )

    def verificar_intersecao(self, inicio, fim):
        return self.data_hora_inicio < fim and self.data_hora_fim > inicio


# Registra presença e observações do agendamento finalizado.
class RelatorioTreino(models.Model):
    id = models.AutoField(primary_key=True)
    presenca = models.BooleanField()
    atividades_realizadas = models.TextField()
    observacoes_tecnicas = models.TextField()
    data_finalizacao = models.DateTimeField()
    agendamento = models.OneToOneField(
        Agendamento,
        on_delete=models.CASCADE,
        related_name="relatorio_treino",
    )
