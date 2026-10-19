from django.db import models


class TipoServico(models.TextChoices):
    TREINO = "TREINO", "Treino"
    FISIOTERAPIA = "FISIOTERAPIA", "Fisioterapia"
    PSICOLOGIA = "PSICOLOGIA", "Psicologia"
    NUTRICAO = "NUTRICAO", "Nutrição"


class Produto(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=6, decimal_places=2)
    descricao = models.TextField()
    disponivel = models.BooleanField(default=True)

    def __str__(self):
        return self.nome



class Servico(models.Model):
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
    nome = models.CharField(max_length=100, null=False)
    capacidade_maxima = models.PositiveIntegerField(null=False)
    localizacao = models.CharField(max_length=150, null=False)
    ativo = models.BooleanField(default=True, null=False)

    def __str__(self):
        return self.nome