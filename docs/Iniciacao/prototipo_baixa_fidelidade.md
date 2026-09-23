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
@startuml
title Prototipo de Baixa Fidelidade - Sistema GAAP

' LOGIN
frame "TELA DE LOGIN" as LoginScreen {
  rectangle "SISTEMA GAAP\nGestão de Atletas de Alta Performance" as Titulo
  rectangle "E-mail: [____________________]" as CampoEmail
  rectangle "Senha:  [____________________]" as CampoSenha
  rectangle "[ ENTRAR ]" as BtnEntrar
  rectangle "[ Esqueci minha senha ]" as BtnRecuperar
}

' PAINEL ADMIN
frame "PAINEL DO ADMINISTRADOR" as AdminPanel {
  rectangle "PAINEL ADMINISTRATIVO" as TituloAdmin
  rectangle "[ GESTÃO DE ALUNOS ]" as BtnAlunos
  rectangle "[ GESTÃO DE PROFISSIONAIS ]" as BtnProfissionais
  rectangle "[ SALAS E SERVIÇOS ]" as BtnSalas
  rectangle "[ GRADE E BLOQUEIOS ]" as BtnBloqueios
}

' AGENDAMENTO
frame "AGENDAMENTO DE SESSÃO" as AgendamentoScreen {
  rectangle "NOVO AGENDAMENTO" as TituloAgendamento
  rectangle "Aluno:       [ SELECIONAR ALUNO ]" as SelAluno
  rectangle "Serviço:     [ Treino | Fisio | Psico | Nutri ]" as SelServico
  rectangle "Profissional:[ SELECIONAR PROFISSIONAL ]" as SelProf
  rectangle "Sala/Espaço: [ SELECIONAR SALA ]" as SelSala
  rectangle "Data e Hora: [ DD/MM/AAAA - HH:MM ]" as SelData
  rectangle "STATUS DE DISPONIBILIDADE:\n- Profissional: Disponível\n- Sala: Capacidade 8/10\n- Sem bloqueios" as DispStatus
  rectangle "[ CONFIRMAR AGENDAMENTO ]" as BtnConfirmar
  rectangle "[ CANCELAR ]" as BtnCancelar
}

' PAINEL TREINADOR / SAÚDE
frame "AGENDA DO PROFISSIONAL" as TrainerPanel {
  rectangle "AGENDA DO DIA" as TituloAgenda
  rectangle "Sessão 09:00 - Treino Físico (Sala 1)\nAlunos: João Silva, Pedro Santos" as Sessao1
  rectangle "Sessão 10:30 - Fisioterapia (Consultório 2)\nAluno: Lucas Lima" as Sessao2
  rectangle "[ REGISTRAR PRESENÇA ]" as BtnPresenca
  rectangle "[ FINALIZAR RELATÓRIO ]" as BtnRelatorio
}

' RELATÓRIO DE TREINO
frame "FINALIZAR RELATÓRIO" as ReportScreen {
  rectangle "RELATÓRIO DE SESSÃO" as TituloRelatorio
  rectangle "Presença: [X] Presente  [ ] Ausente" as CheckPresenca
  rectangle "Atividades Realizadas:\n[__________________________________]" as CampoAtividades
  rectangle "Observações Técnicas / Recomendações:\n[__________________________________]" as CampoObs
  rectangle "[ SALVAR E FINALIZAR ]" as BtnSalvarRelatorio
}

' NAVEGAÇÃO
BtnEntrar --> AdminPanel : Perfil Admin
BtnEntrar --> TrainerPanel : Perfil Treinador/Saúde
AdminPanel --> AgendamentoScreen : Novo Agendamento
BtnConfirmar --> AdminPanel : Agendado com sucesso
TrainerPanel --> ReportScreen : Selecionar sessão
BtnSalvarRelatorio --> TrainerPanel : Relatório salvo

@enduml
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
| 2026.2 | 2.0 | Atualização para os fluxos reais do Backend GAAP (Admin, Treinador, Saúde e Aluno) | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
