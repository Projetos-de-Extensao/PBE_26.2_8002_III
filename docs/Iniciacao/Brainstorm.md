---
id: brainstorm
title: Brainstorming
---

## Introdução

<p align="justify">
O brainstorm é uma técnica de elicitação de requisitos que reúne a equipe para debater ideias, identificar necessidades reais e levantar os fluxos operacionais prioritários a partir do problema de negócio apresentado no cenário do Backend GAAP.
</p>

## Metodologia

<p align="justify">
A equipe do Grupo 3 debateu os requisitos necessários para viabilizar a gestão da escola de treinamento esportivo e o suporte aos 4 serviços fundamentais (Treino, Fisioterapia, Psicologia e Nutrição), consolidando as respostas nas questões estruturadas abaixo.
</p>

---

## Questões e Debates

### 1. Qual o objetivo principal da aplicação?
**Equipe do Projeto**: Desenvolver o sistema back-end GAAP em Python e Django, permitindo a orquestração centralizada de horários, profissionais, alunos e espaços físicos, garantindo a consistência das marcações e o registro das atividades realizadas.

---

### 2. Quem são os usuários que interagem com o sistema?
**Equipe do Projeto**:
* **Administrador**: Realiza cadastros de base (alunos, profissionais, salas, serviços), gerencia a grade de horários e aplica bloqueios de agenda.
* **Treinador**: Acessa a lista de treinos sob sua tutela, confirma presença dos atletas e redige os relatórios de treino.
* **Profissional de Saúde**: *(Fisioterapeuta, Nutricionista, Psicólogo)* Acessa atendimentos específicos de sua especialidade e registra observações do atendimento.
* **Aluno / Responsável**: Consulta disponibilidade de horários e solicita agendamentos de sessões.

---

### 3. Quais serviços a escola oferece e como devem ser tratados?
**Equipe do Projeto**: A escola oferece quatro modalidades: Treino, Fisioterapia, Psicologia e Nutrição. Cada sessão deve estar vinculada ao serviço correspondente e ao profissional devidamente habilitado naquela área.

---

### 4. Quais são as regras essenciais para validar um agendamento?
**Equipe do Projeto**:
1. O profissional não pode ter dois agendamentos no mesmo horário.
2. A sala não pode estar ocupada no mesmo horário ou ter sua capacidade máxima excedida.
3. Não podem ocorrer agendamentos em horários marcados como bloqueados pela administração.
4. O aluno não pode estar em duas sessões simultâneas.

---

### 5. O que ocorre após a realização de uma sessão?
**Equipe do Projeto**: O profissional responsável acessa o agendamento para registrar a presença (ou falta) do aluno e elaborar o relatório de treino/sessão com as observações do trabalho realizado.

---

## Requisitos Elicitados no Brainstorm

| ID | Descrição do Requisito |
| :--- | :--- |
| **BS01** | O sistema deve autenticar usuários e diferenciar permissões por perfil (Admin, Treinador, Saúde, Aluno). |
| **BS02** | O sistema deve permitir o cadastro de alunos, profissionais, serviços e salas/espaços. |
| **BS03** | O sistema deve gerenciar a grade horária e permitir a criação de bloqueios de indisponibilidade na agenda. |
| **BS04** | O sistema deve validar a disponibilidade simultânea do profissional, da sala e do aluno antes de confirmar o agendamento. |
| **BS05** | O sistema deve impedir sobreposição de horários (*double-booking*) para profissionais e salas. |
| **BS06** | O sistema deve respeitar o limite de capacidade máxima das salas nos agendamentos coletivos. |
| **BS07** | O sistema deve permitir o cancelamento e a reagenda de sessões com atualização imediata dos horários. |
| **BS08** | O sistema deve permitir a consulta da agenda filtrada por profissional, aluno, data e tipo de serviço. |
| **BS09** | O sistema deve permitir que o profissional registre presença ou falta dos alunos agendados. |
| **BS10** | O sistema deve permitir que o profissional elabore e finalize relatórios técnicos de treino e atendimento. |

---

## Conclusão

<p align="justify">
A sessão de brainstorming consolidou os requisitos fundamentais do Backend GAAP, focando na simplificação do escopo essencial (MVP) e na eliminação de complexidades desnecessárias no primeiro ciclo de desenvolvimento.
</p>

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Criação inicial do Brainstorm | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.0 | Reformulação dos requisitos com foco no escopo real do GAAP | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
