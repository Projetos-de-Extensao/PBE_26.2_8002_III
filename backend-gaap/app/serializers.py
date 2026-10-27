from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from .models import (
    Administrador,
    Agendamento,
    Aluno,
    BloqueioAgenda,
    Espaco,
    Profissional,
    RelatorioTreino,
    Servico,
    StatusAgendamento,
)


def validate_model_instance(serializer, attrs, excludes=()):
    instance = serializer.instance or serializer.Meta.model()
    model_fields = {field.name for field in serializer.Meta.model._meta.get_fields()}
    many_to_many = {
        relation.name for relation in serializer.Meta.model._meta.many_to_many
    }
    for field, value in attrs.items():
        if field in model_fields and field not in many_to_many:
            setattr(instance, field, value)
    try:
        instance.full_clean(exclude=list(excludes) + list(many_to_many))
    except DjangoValidationError as exc:
        detail = exc.message_dict if hasattr(exc, "message_dict") else exc.messages
        raise serializers.ValidationError(detail) from exc
    return attrs


class UsuarioSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True, required=False)

    class Meta:
        fields = (
            "id",
            "nome",
            "email",
            "senha",
            "telefone",
            "perfil",
            "ativo",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        if self.instance is None and not attrs.get("senha"):
            raise serializers.ValidationError({"senha": "Este campo é obrigatório."})
        return validate_model_instance(self, attrs, excludes=("senha_hash",))

    def create(self, validated_data):
        senha = validated_data.pop("senha")
        validated_data["senha_hash"] = make_password(senha)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        senha = validated_data.pop("senha", None)
        if senha:
            validated_data["senha_hash"] = make_password(senha)
        return super().update(instance, validated_data)


class AdministradorSerializer(UsuarioSerializer):
    class Meta(UsuarioSerializer.Meta):
        model = Administrador
        fields = UsuarioSerializer.Meta.fields + ("setor",)


class ProfissionalSerializer(UsuarioSerializer):
    class Meta(UsuarioSerializer.Meta):
        model = Profissional
        fields = UsuarioSerializer.Meta.fields + (
            "registro_profissional",
            "especialidade",
        )


class AlunoSerializer(UsuarioSerializer):
    class Meta(UsuarioSerializer.Meta):
        model = Aluno
        fields = UsuarioSerializer.Meta.fields + (
            "matricula",
            "data_nascimento",
            "observacoes_medicas",
        )


class ValidatedModelSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        return validate_model_instance(self, attrs)


class ServicoSerializer(ValidatedModelSerializer):
    class Meta:
        model = Servico
        fields = ("id", "nome", "duracao_minutos", "ativo")
        read_only_fields = ("id",)


class EspacoSerializer(ValidatedModelSerializer):
    class Meta:
        model = Espaco
        fields = ("id", "nome", "capacidade_maxima", "localizacao", "ativo")
        read_only_fields = ("id",)


class AgendamentoSerializer(ValidatedModelSerializer):
    status = serializers.ChoiceField(
        choices=StatusAgendamento.choices,
        required=False,
        default=StatusAgendamento.AGENDADO,
    )
    alunos = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Aluno.objects.all(),
        allow_empty=False,
    )

    class Meta:
        model = Agendamento
        fields = (
            "id",
            "data_hora_inicio",
            "data_hora_fim",
            "status",
            "profissional",
            "alunos",
            "espaco",
            "servico",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if (
            self.instance is None
            and "status" in attrs
            and attrs["status"] != StatusAgendamento.AGENDADO
        ):
            raise serializers.ValidationError(
                {"status": "Um novo agendamento deve iniciar como AGENDADO."}
            )
        inicio = attrs.get(
            "data_hora_inicio",
            getattr(self.instance, "data_hora_inicio", None),
        )
        fim = attrs.get(
            "data_hora_fim",
            getattr(self.instance, "data_hora_fim", None),
        )
        if inicio and fim and inicio >= fim:
            raise serializers.ValidationError(
                {"data_hora_fim": "Deve ser posterior à data e hora de início."}
            )
        return attrs

    def create(self, validated_data):
        alunos = validated_data.pop("alunos")
        validated_data["status"] = StatusAgendamento.AGENDADO
        agendamento = Agendamento(**validated_data)

        try:
            with transaction.atomic():
                agendamento.full_clean()
                agendamento.save()
                agendamento.alunos.set(alunos)
                if len(alunos) > agendamento.espaco.capacidade_maxima:
                    raise serializers.ValidationError(
                        {"alunos": "A quantidade de alunos excede a capacidade do espaço."}
                    )
                self._validate_conflicts(agendamento)
        except DjangoValidationError as exc:
            detail = exc.message_dict if hasattr(exc, "message_dict") else exc.messages
            raise serializers.ValidationError(detail) from exc

        return agendamento

    def update(self, instance, validated_data):
        alunos = validated_data.pop("alunos", None)
        try:
            with transaction.atomic():
                instance = super().update(instance, validated_data)
                if alunos is not None:
                    instance.alunos.set(alunos)
                instance.full_clean()
                if instance.alunos.count() > instance.espaco.capacidade_maxima:
                    raise serializers.ValidationError(
                        {"alunos": "A quantidade de alunos excede a capacidade do espaço."}
                    )
                self._validate_conflicts(instance)
        except DjangoValidationError as exc:
            detail = exc.message_dict if hasattr(exc, "message_dict") else exc.messages
            raise serializers.ValidationError(detail) from exc

        return instance

    @staticmethod
    def _validate_conflicts(agendamento):
        if (
            agendamento.status == StatusAgendamento.AGENDADO
            and agendamento.validar_conflito()
        ):
            raise serializers.ValidationError(
                "O horário conflita com outro agendamento do profissional, "
                "espaço ou aluno."
            )


class BloqueioAgendaSerializer(ValidatedModelSerializer):
    class Meta:
        model = BloqueioAgenda
        fields = (
            "id",
            "data_hora_inicio",
            "data_hora_fim",
            "motivo",
            "profissional",
            "espaco",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        inicio = attrs.get(
            "data_hora_inicio",
            getattr(self.instance, "data_hora_inicio", None),
        )
        fim = attrs.get(
            "data_hora_fim",
            getattr(self.instance, "data_hora_fim", None),
        )
        if inicio and fim and inicio >= fim:
            raise serializers.ValidationError(
                {"data_hora_fim": "Deve ser posterior à data e hora de início."}
            )
        profissional = attrs.get(
            "profissional",
            getattr(self.instance, "profissional", None),
        )
        espaco = attrs.get("espaco", getattr(self.instance, "espaco", None))
        if profissional is None and espaco is None:
            raise serializers.ValidationError(
                "Informe o profissional ou o espaço que ficará indisponível."
            )
        return attrs


class RelatorioTreinoSerializer(ValidatedModelSerializer):
    class Meta:
        model = RelatorioTreino
        fields = (
            "id",
            "presenca",
            "atividades_realizadas",
            "observacoes_tecnicas",
            "data_finalizacao",
            "agendamento",
        )
        read_only_fields = ("id",)
