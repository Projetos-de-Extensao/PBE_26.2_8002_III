from django.db import models


class TipoServico(models.TextChoices):
    TREINO = "TREINO", "Treino"
    FISIOTERAPIA = "FISIOTERAPIA", "Fisioterapia"
    PSICOLOGIA = "PSICOLOGIA", "Psicologia"
    NUTRICAO = "NUTRICAO", "Nutrição"


class TipoPerfil(models.TextChoices):
    ADMINISTRADOR = "ADMINISTRADOR", "Administrador"
    TREINADOR = "TREINADOR", "Treinador"
    PROFISSIONAL_SAUDE = "PROFISSIONAL_SAUDE", "Profissional de Saúde"
    ALUNO = "ALUNO", "Aluno"


class Agendamento(models.Model):
    id = models.AutoField(primary_key=True)
    data_hora_inicio = models.DateTimeField(null=False)
    data_hora_fim = models.DateTimeField(null=False)
    status = models.CharField(max_length=20, choices=[('PENDENTE', 'Pendente'), ('CONFIRMADO', 'Confirmado'), ('CANCELADO', 'Cancelado')], default='PENDENTE')
    id_aluno = models.ForeignKey('Aluno', on_delete=models.CASCADE, null=False)
    id_profissional = models.ForeignKey('Profissional', on_delete=models.CASCADE, null=False)
    id_servico = models.ForeignKey('Servico', on_delete=models.CASCADE, null=False)


class Servico(models.Model):
    id_servico = models.AutoField(primary_key=True)
    nome = models.CharField(
        max_length=20,
        choices=TipoServico.choices,
        null=False,
    )
    duracao_minutos = models.PositiveIntegerField(null=False)
    ativo = models.BooleanField(default=True, null=False)

    def __str__(self):
        return self.get_nome_display()


class Espaco(models.Model):
    id_espaco = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100, null=False)
    capacidade_maxima = models.PositiveIntegerField(null=False)
    localizacao = models.CharField(max_length=150, null=False)
    ativo = models.BooleanField(default=True, null=False)

    def __str__(self):
        return self.nome


class Usuario(models.Model):
    """Base abstrata (diagrama: Usuario <|-- Profissional, Aluno).
    abstract = True: não cria tabela própria; cada filha herda os campos."""

    nome = models.CharField(max_length=100, null=False)
    email = models.EmailField(unique=True, null=False)
    telefone = models.CharField(max_length=20, blank=True)
    perfil = models.CharField(max_length=20, choices=TipoPerfil.choices, null=False)
    ativo = models.BooleanField(default=True, null=False)

    class Meta:
        abstract = True

    def __str__(self):
        return self.nome


class Profissional(Usuario):
    registro_profissional = models.CharField(max_length=30, unique=True, null=False)
    especialidade = models.CharField(
        max_length=20,
        choices=TipoServico.choices,
        null=False,
    )

    class Meta:
        verbose_name = "Profissional"
        verbose_name_plural = "Profissionais"

    def save(self, *args, **kwargs):
        # Treino -> Treinador; Fisioterapia/Psicologia/Nutrição -> Profissional de Saúde
        if self.especialidade == TipoServico.TREINO:
            self.perfil = TipoPerfil.TREINADOR
        else:
            self.perfil = TipoPerfil.PROFISSIONAL_SAUDE
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nome} ({self.get_especialidade_display()})"


class Aluno(Usuario):
    matricula = models.CharField(max_length=20, unique=True, null=False)
    data_nascimento = models.DateField(null=False)
    observacoes_medicas = models.TextField(blank=True)

    class Meta:
        verbose_name = "Aluno"
        verbose_name_plural = "Alunos"

    def save(self, *args, **kwargs):
        self.perfil = TipoPerfil.ALUNO
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nome} ({self.matricula})"
