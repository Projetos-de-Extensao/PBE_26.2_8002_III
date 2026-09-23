---
id: brainstorm
title: Brainstorming
---

# Brainstorming

## Introdução

<p align="justify">
O brainstorm é uma técnica de elicitação de requisitos que consiste em reunir a equipe e discutir sobre diversos tópicos gerais do projeto apresentados no documento problema de negócio. No brainstorm o diálogo é incentivado e críticas são evitadas para permitir que todos colaborem com suas próprias ideias.
</p>

## Metodologia

<p align="justify">
A equipe se reuniu para debater ideias gerais sobre o projeto via Microsoft Teams, começou às 14:00 e terminou às 15:30 do dia 15/08/2026, onde Arthur Calebe foi o moderador, direcionando a equipe com questões pré-elaboradas, e transcrevendo as respostas para o documento.
</p>

## Brainstorm

## Versão 1.0

## Perguntas

### 1. Qual o objetivo principal da aplicação?

<p align="justify">
<b>Arthur Calebe</b> - Deve ser um sistema back-end que centralize e orquestre a operação da academia, organizando a marcação de treinos e atendimentos multidisciplinares.
<br><br>
<b>Antonio Reuter</b> - A plataforma deve fornecer uma base confiável para gerenciar horários, evitando sobreposição de agenda de profissionais e espaços físicos.
<br><br>
<b>Pedro Henrique Becker</b> - O objetivo é integrar quatro áreas essenciais: Treino, Fisioterapia, Psicologia e Nutrição, garantindo que cada profissional atenda exclusivamente em sua especialidade.
<br><br>
<b>Breno Huf</b> - A aplicação deve gerenciar o fluxo operacional pós-sessão, permitindo registro de presenças e relatórios técnicos de treino e atendimento.
</p>

---

### 2. Como será o processo para cadastrar um novo cliente/aluno e os usuários do sistema?

<p align="justify">
<b>Arthur Calebe</b> - O administrador deverá autenticar-se e cadastrar os perfis de acesso: Administrador, Treinador, Profissional de Saúde e Aluno.
<br><br>
<b>Antonio Reuter</b> - Para os alunos, devem ser registrados dados de identificação, contato, data de nascimento e responsável quando aplicável.
<br><br>
<b>Pedro Henrique Becker</b> - O profissional de saúde deve ter vinculada sua especialidade (Fisioterapia, Psicologia ou Nutrição) para que o sistema valide os agendamentos corretos.
<br><br>
<b>Breno Huf</b> - O sistema deve controlar o acesso por perfil, garantindo que alunos só vejam suas próprias agendas e profissionais suas respectivas sessões.
</p>

---

### 3. Como será a forma de gerenciar e agendar os serviços oferecidos (Treino, Fisioterapia, Psicologia e Nutrição)?

<p align="justify">
<b>Arthur Calebe</b> - O administrador cadastra as salas físicas com suas respectivas capacidades máximas e os tipos de serviços disponíveis com suas durações padrão.
<br><br>
<b>Antonio Reuter</b> - O agendamento deve vincular um aluno, um profissional habilitado, a sala correspondente e o horário desejado.
<br><br>
<b>Pedro Henrique Becker</b> - Antes de confirmar o agendamento, o sistema deve validar atomicamente se não há bloqueio administrativo, se o profissional está livre e se a sala possui capacidade disponível.
<br><br>
<b>Breno Huf</b> - O sistema deve permitir tanto agendamentos individuais (atendimentos clínicos) quanto agendamentos em grupo (treinos), respeitando o teto de lotação do espaço.
</p>

---

### 4. Quais regras de negócio são essenciais para validar os agendamentos e evitar conflitos?

<p align="justify">
<b>Arthur Calebe</b> - A regra primordial é impedir conflito de horários (<i>double-booking</i>): um profissional ou uma sala não podem ter duas sessões simultâneas.
<br><br>
<b>Antonio Reuter</b> - Devemos respeitar a capacidade máxima de cada sala, impedindo reservas quando o limite de atletas for atingido.
<br><br>
<b>Pedro Henrique Becker</b> - Deve haver um módulo de bloqueios de agenda para manutenções ou indisponibilidades de profissionais e espaços, sobrepondo novas marcações.
<br><br>
<b>Breno Huf</b> - A restrição por especialidade: um treinador não pode ministrar fisioterapia, e um psicólogo não pode ser agendado para treino técnico.
</p>

---

### 5. Quais informações e operações seriam importantes para o acompanhamento pós-sessão?

<p align="justify">
<b>Arthur Calebe</b> - Após a aula ou consulta, o profissional responsável deve marcar a presença ou registrar a falta do aluno.
<br><br>
<b>Antonio Reuter</b> - O treinador ou profissional de saúde deve elaborar um relatório técnico com os exercícios ministrados ou parecer do atendimento.
<br><br>
<b>Pedro Henrique Becker</b> - Apenas o profissional vinculado àquela sessão ou o administrador pode registrar o relatório, assegurando a integridade técnica.
<br><br>
<b>Breno Huf</b> - Uma vez finalizado o relatório, ele deve ser bloqueado para edição para fins de histórico e auditoria.
</p>

---

### 6. Quais informações seriam interessantes para os alunos e responsáveis acessarem?

<p align="justify">
<b>Arthur Calebe</b> - Os alunos e responsáveis devem visualizar a grade de horários disponíveis para marcar suas sessões de treino ou consultas de saúde.
<br><br>
<b>Antonio Reuter</b> - Eles devem conseguir consultar seu histórico de agendamentos confirmados, cancelados e realizados.
<br><br>
<b>Pedro Henrique Becker</b> - Devem ter visibilidade da confirmação de presença e do registro geral de evolução de seus treinos na academia.
<br><br>
<b>Breno Huf</b> - Devem ter a possibilidade de solicitar o cancelamento ou reagendamento com antecedência de acordo com as regras operacionais da academia.
</p>

---

### Requisitos elicitados

| ID | Descrição |
| :---: | :--- |
| **BS01** | O sistema deve autenticar usuários e diferenciar permissões por perfil (Administrador, Treinador, Profissional de Saúde e Aluno/Responsável). |
| **BS02** | O sistema deve permitir o cadastro de alunos, profissionais, serviços e salas com controle de capacidade máxima. |
| **BS03** | O sistema deve permitir a configuração da grade horária e registro de bloqueios administrativos de agenda por manutenção ou indisponibilidade. |
| **BS04** | O sistema deve validar a disponibilidade simultânea do profissional, da sala e do aluno antes de efetivar qualquer agendamento. |
| **BS05** | O sistema deve impedir sobreposição de horários (*double-booking*) para profissionais e espaços físicos. |
| **BS06** | O sistema deve respeitar o limite de capacidade máxima das salas em agendamentos coletivos ou individuais. |
| **BS07** | O sistema deve garantir a compatibilidade entre a especialidade do profissional e o serviço agendado (Treino, Fisioterapia, Psicologia, Nutrição). |
| **BS08** | O sistema deve permitir o cancelamento e a reagenda de sessões com liberação imediata do horário e vaga. |
| **BS09** | O sistema deve oferecer consultas de agenda filtradas por data, profissional, aluno, sala e serviço. |
| **BS10** | O sistema deve permitir o registro de presença ou falta dos alunos ao término de cada sessão. |
| **BS11** | O sistema deve permitir que o profissional atribuído elabore e finalize o relatório técnico da sessão. |
| **BS12** | O sistema deve garantir a imutabilidade do relatório técnico após a sua finalização. |
| **BS13** | O sistema deve permitir que alunos e responsáveis consultem seus agendamentos e histórico de presença. |

---

## Conclusão

<p align="justify">
Através da aplicação da técnica, foi possível elicitar alguns dos primeiros requisitos do projeto.
</p>

## Referências Bibliográficas

> BARBOSA, S. D. J; DA SILVA, B. S. Interação humano-computador. Elsevier, 2010.

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :---: | :---: | :--- | :--- |
| 2026.2 | 1.0 | Criação inicial do Brainstorming | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.0 | Reformulação dos requisitos e adequação ao modelo oficial com respostas nominais | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.1 | Correção da numeração das perguntas e formatação dos subtítulos de debate | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
