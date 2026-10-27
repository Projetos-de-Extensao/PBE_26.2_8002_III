from django.contrib.auth.hashers import check_password, make_password
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.utils import timezone


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

    # Compara a senha informada com o hash armazenado.
    def autenticar(self, senha):
        return check_password(senha, self.senha_hash)

    # Gera um novo hash e salva a senha quando o usuário já existe.
    def alterar_senha(self, nova_senha):
        self.senha_hash = make_password(nova_senha)
        if self.pk:
            self.save(update_fields=["senha_hash"])


# Representa o administrador e registra seu setor de atuação.
class Administrador(Usuario):
    setor = models.TextField()

    # Cria a subclasse de usuário indicada pelo perfil e valida seus dados.
    def cadastrar_usuario(self, dados):
        if not isinstance(dados, dict):
            raise ValidationError("Informe os dados do usuário em um dicionário.")

        modelos_por_perfil = {
            TipoPerfil.ADMINISTRADOR: Administrador,
            TipoPerfil.TREINADOR: Profissional,
            TipoPerfil.PROFISSIONAL_SAUDE: Profissional,
            TipoPerfil.ALUNO: Aluno,
        }
        try:
            modelo_usuario = modelos_por_perfil[dados["perfil"]]
        except (KeyError, TypeError) as exc:
            raise ValidationError(
                {"perfil": "Informe um perfil válido para cadastrar o usuário."}
            ) from exc

        usuario = modelo_usuario(**dados)
        usuario.full_clean()
        usuario.save()
        return usuario

    # Valida e registra um bloqueio com os dados e vínculos informados.
    def aplicar_bloqueio(self, dados):
        bloqueio = BloqueioAgenda(**dados)
        bloqueio.full_clean()
        bloqueio.save()
        return bloqueio

    # Valida e registra uma sala no sistema.
    def configurar_sala(self, dados):
        espaco = Espaco(**dados)
        espaco.full_clean()
        espaco.save()
        return espaco

    # Valida e registra um serviço no sistema.
    def configurar_servico(self, dados):
        servico = Servico(**dados)
        servico.full_clean()
        servico.save()
        return servico

    def __str__(self):
        if self.pk:
            return self.nome
        return "Agendamento não salvo"

# Representa o profissional e permite consultar seus agendamentos.
class Profissional(Usuario):
    registro_profissional = models.TextField()
    especialidade = models.CharField(max_length=20, choices=TipoServico.choices)

    def __str__(self):
        return self.nome

    # Retorna os agendamentos conduzidos por este profissional.
    def consultar_agenda(self):
        return list(Agendamento.objects.filter(profissional=self))

    # Atualiza a presença no relatório do agendamento deste profissional.
    def registrar_presenca(self, agendamento_id, presenca):
        try:
            relatorio = RelatorioTreino.objects.get(
                agendamento_id=agendamento_id,
                agendamento__profissional=self,
            )
        except RelatorioTreino.DoesNotExist as exc:
            raise ValidationError(
                "O relatório do agendamento precisa existir antes de registrar a presença."
            ) from exc

        relatorio.presenca = presenca
        relatorio.full_clean()
        relatorio.save(update_fields=["presenca"])

    # Cria ou atualiza o relatório associado ao agendamento indicado.
    def finalizar_relatorio(self, agendamento_id, dados):
        try:
            agendamento = Agendamento.objects.get(
                pk=agendamento_id,
                profissional=self,
            )
        except Agendamento.DoesNotExist as exc:
            raise ValidationError(
                "O agendamento não existe ou não pertence a este profissional."
            ) from exc

        dados_relatorio = dict(dados)
        campos_relatorio = {
            "presenca",
            "atividades_realizadas",
            "observacoes_tecnicas",
            "data_finalizacao",
        }
        campos_invalidos = dados_relatorio.keys() - campos_relatorio
        if campos_invalidos:
            campos = ", ".join(sorted(map(str, campos_invalidos)))
            raise ValidationError(
                {"dados": f"Campos de relatório inválidos: {campos}."}
            )
        dados_relatorio.setdefault("data_finalizacao", timezone.now())

        with transaction.atomic():
            relatorio = RelatorioTreino.objects.filter(
                agendamento=agendamento
            ).first()
            if relatorio is None:
                relatorio = RelatorioTreino(agendamento=agendamento)
            for campo, valor in dados_relatorio.items():
                setattr(relatorio, campo, valor)
            relatorio.preencher_relatorio()
        return relatorio

# Representa o aluno e permite consultar seus agendamentos.
class Aluno(Usuario):
    matricula = models.TextField()
    data_nascimento = models.DateField()
    observacoes_medicas = models.TextField()

    def __str__(self):
        return self.nome

    # Retorna os agendamentos dos quais este aluno participa.
    def consultar_agenda(self):
        return list(Agendamento.objects.filter(alunos=self))

    # Cria um agendamento e inclui este aluno como participante.
    def solicitar_agendamento(self, dados):
        if not self.pk:
            raise ValidationError("O aluno precisa estar salvo para solicitar um agendamento.")

        dados_agendamento = dict(dados)
        dados_agendamento.setdefault("status", StatusAgendamento.AGENDADO)
        agendamento = Agendamento(**dados_agendamento)
        agendamento.full_clean()

        with transaction.atomic():
            agendamento.save()
            agendamento.alunos.add(self)
            if agendamento.validar_conflito():
                raise ValidationError(
                    "O horário conflita com outro agendamento do profissional, espaço ou aluno."
                )

        return agendamento

        def __str__(self):
            return self.nome

# Armazena a modalidade e a duração de um serviço.
class Servico(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=20, choices=TipoServico.choices)
    duracao_minutos = models.IntegerField()
    ativo = models.BooleanField()

    # Retorna a duração configurada para o serviço, em minutos.
    def obter_duracao(self):
        return self.duracao_minutos

    def __str__(self):
        return self.get_nome_display()


# Armazena um espaço e verifica se comporta a quantidade de alunos.
class Espaco(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.TextField()
    capacidade_maxima = models.IntegerField()
    localizacao = models.TextField()
    ativo = models.BooleanField()

    # Informa se a quantidade de alunos cabe no espaço.
    def verificar_capacidade(self, qtd_alunos):
        return qtd_alunos <= self.capacidade_maxima

    def __str__(self):
        return self.nome


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

    # Verifica sobreposição de horário com profissional, espaço ou aluno.
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

    # Confirma o agendamento se não houver outro horário conflitante.
    def confirmar(self):
        if self.validar_conflito():
            raise ValidationError("Não é possível confirmar um agendamento conflitante.")
        self.status = StatusAgendamento.AGENDADO
        self.save(update_fields=["status"])

    # Altera o estado do agendamento para cancelado.
    def cancelar(self):
        self.status = StatusAgendamento.CANCELADO
        self.save(update_fields=["status"])

    def __str__(self):
        if self.pk:
            return f"Agendamento #{self.pk}"
        return "Agendamento não salvo"


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

    # Verifica se o período informado cruza o período deste bloqueio.
    def verificar_intersecao(self, inicio, fim):
        return self.data_hora_inicio < fim and self.data_hora_fim > inicio

    def __str__(self):
        return self.motivo


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

    # Valida os dados preenchidos e grava o relatório.
    def preencher_relatorio(self):
        self.full_clean()
        self.save()

    def __str__(self):
        return f"Relatório do agendamento #{self.agendamento_id}"