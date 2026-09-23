---
id: prototipo_baixa_fidelidade
title: Protótipo de Baixa Fidelidade
---

# Protótipo de Baixa Fidelidade — Sistema GAAP

## Introdução

<p align="justify">
Este documento apresenta o protótipo conceitual de baixa fidelidade do sistema GAAP (Gestão de Atletas de Alta Performance). O protótipo utiliza <b>PlantUML</b> para representar os fluxos essenciais de navegação, campos e ações disponíveis para Administradores, Treinadores/Profissionais de Saúde e Alunos/Responsáveis, cobrindo os quatro serviços centrais: <b>Treino</b>, <b>Fisioterapia</b>, <b>Psicologia</b> e <b>Nutrição</b>.
</p>

---

## 1. Escopo das Telas Prototipadas

* **Autenticação**: Login e recuperação de acesso.
* **Painel do Administrador**: Gestão de Alunos, Profissionais, Serviços, Salas e Bloqueios.
* **Painel do Treinador / Profissional de Saúde**: Agenda do dia, registro de presença/falta e elaboração de relatório de treino/atendimento.
* **Painel do Aluno / Responsável**: Consulta de horários, solicitação de agendamento e visualização do histórico.

---

## 2. Diagrama de Telas e Navegação em PlantUML

```plantuml
@startsalt
{+
  <b>SISTEMA GAAP
  Gestão de Atletas de Alta Performance
  ==
  {
    E-mail: | "nome@exemplo.com    "
    Senha:  | "**********          "
  }
  ==
  [ ENTRAR ] | [ Esqueci minha senha ]
}
@endsalt
```

```plantuml
@startsalt
{+
  <b>PAINEL ADMINISTRATIVO
  ==
  [ GESTÃO DE ALUNOS ]
  [ GESTÃO DE PROFISSIONAIS ]
  [ SALAS E SERVIÇOS ]
  [ GRADE E BLOQUEIOS ]
}
@endsalt
```

```plantuml
@startsalt
{+
  <b>NOVO AGENDAMENTO
  ==
  {
    Aluno:       | ^SELECIONAR ALUNO^
    Serviço:     | ^Treino ^ Fisio ^ Psico ^ Nutri^
    Profissional:| ^SELECIONAR PROFISSIONAL^
    Sala/Espaço: | ^SELECIONAR SALA^
    Data e Hora: | "DD/MM/AAAA - HH:MM"
  }
  ==
  <b>STATUS DE DISPONIBILIDADE:
  * Profissional: Disponível
  * Sala: Capacidade 8/10
  * Sem bloqueios
  ==
  [ CONFIRMAR AGENDAMENTO ] | [ CANCELAR ]
}
@endsalt
```

```plantuml
@startsalt
{+
  <b>AGENDA DO DIA
  ==
  <b>Sessão 09:00 - Treino Físico (Sala 1)
  Alunos: João Silva, Pedro Santos
  --
  <b>Sessão 10:30 - Fisioterapia (Consultório 2)
  Aluno: Lucas Lima
  ==
  [ REGISTRAR PRESENÇA ] | [ FINALIZAR RELATÓRIO ]
}
@endsalt
```

```plantuml
@startsalt
{+
  <b>RELATÓRIO DE SESSÃO
  ==
  Presença: | (X) Presente | () Ausente
  ==
  Atividades Realizadas:
  {S
    "                                      "
    "                                      "
    "                                      "
  }
  Observações Técnicas / Recomendações:
  {S
    "                                      "
    "                                      "
    "                                      "
  }
  ==
  [ SALVAR E FINALIZAR ] | [ CANCELAR ]
}
@endsalt
```

---

## 3. Conclusão

<p align="justify">
O protótipo de baixa fidelidade consolida o fluxo das operações fundamentais do sistema GAAP, garantindo aderência aos casos de uso prioritários de agendamento, validação de capacidade e registro operacional.
</p>

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Versão inicial | Breno Huf |
| 2026.2 | 2.0 | Atualização para os fluxos reais do Backend GAAP (Admin, Treinador, Saúde e Aluno) | Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf |
