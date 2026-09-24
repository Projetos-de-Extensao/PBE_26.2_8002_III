---
id: dt
title: Design Thinking
---

# Design Thinking — Backend GAAP

### **1. Capa**

- **Título do Projeto**: Sistema GAAP — Gestão de Atletas de Alta Performance
- **Nome da Equipe**: Grupo 3 (Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf)
- **Data**: 2026.2
- **Organização**: Ibmec — Disciplina de Projeto Back-End

---

### **2. Introdução**

- **Contexto do Projeto**: Academias e centros de treinamento esportivo necessitam de uma solução integrada para orquestrar horários de treinos físicos/técnicos e atendimentos multidisciplinares de saúde (Fisioterapia, Psicologia e Nutrição).
- **Objetivo**: Desenvolver o sistema back-end para sustentar a operação de agendamentos, validação de disponibilidade de espaços e profissionais, controle de presença e relatórios de treino.
- **Público-Alvo**: Gestores/Administradores do centro, Treinadores esportivos, Profissionais de Saúde e Atletas/Alunos.
- **Escopo**: Foco no sistema back-end em Django, autenticação por perfil, regras de consistência de agenda e registro de atividades pós-sessão.

---

### **3. Fases do Design Thinking**

#### **3.1. Empatia**

- **Pesquisa**: Levantamento do contexto de academias e centros de treinamento esportivo, complementado pelas discussões da equipe no brainstorm. A análise concentrou-se nos problemas de organização de horários, controle de vagas e registro das atividades realizadas.
- **Insights**:
  1. *Conflitos de agenda*: A falta de centralização pode fazer com que um profissional ou espaço seja agendado para sessões no mesmo horário.
  2. *Controle de capacidade*: Treinos em grupo precisam respeitar o limite de pessoas definido para cada sala.
  3. *Perda de informações*: Presenças e relatórios de sessões precisam ficar registrados para consulta posterior.
- **Perfis envolvidos**:
  * **Administrador**: Cadastra alunos, profissionais, serviços e salas, além de controlar bloqueios e a organização da agenda.
  * **Treinador**: Consulta seus treinos, registra presença ou falta e preenche o relatório da sessão.
  * **Profissional de Saúde**: Consulta seus atendimentos e registra as informações relacionadas à sua especialidade.
  * **Aluno ou Responsável**: Consulta horários disponíveis, solicita agendamentos e acompanha o histórico de sessões.

#### **3.2. Definição**

- **Problema Central**: Como estruturar um sistema back-end seguro e eficiente que garanta a integridade dos agendamentos multidisciplinares, impeça choque de horários e centralize o registro de presenças e relatórios de treino?
- **Pontos de Vista (POV)**:
  * *O Administrador precisa de* travas automáticas de lotação e conflito *porque* marcações incorretas geram atrito operacional e risco aos atletas.
  * *O Treinador precisa de* um canal ágil para dar baixa na sessão e registrar observações *porque* precisa comprovar a realização das atividades sem perder tempo administrativo.
  * *O Atleta precisa de* previsibilidade e confirmação imediata da vaga *porque* sua rotina de treinamento de alta performance exige planejamento rigoroso.

#### **3.3. Ideação**

- **Ideias discutidas**:
  * Centralizar os agendamentos de treinos e atendimentos em uma única agenda.
  * Conferir a disponibilidade do aluno, do profissional e da sala antes de confirmar uma sessão.
  * Respeitar a capacidade máxima dos espaços nos agendamentos em grupo.
  * Relacionar cada serviço à especialidade do profissional responsável.
  * Registrar presença ou falta e o relatório da sessão após o atendimento.
- **Seleção de ideias**: As ideias foram escolhidas por sua relação direta com os problemas identificados.
- **Ideias selecionadas**:
  1. **Validação de agendamentos**: impedir conflitos de horário e considerar bloqueios de profissionais e espaços.
  2. **Controle de capacidade**: impedir novos agendamentos quando a sala atingir o limite definido.
  3. **Registro pós-sessão**: permitir o registro de presença ou falta e do relatório técnico correspondente.

#### **3.4. Prototipagem**

- **Descrição do Protótipo**: Elaboração de diagramas conceituais de telas e navegação em PlantUML cobrindo login, painel administrativo, agenda do treinador e agendamento de sessões.
- **Materiais Utilizados**: PlantUML, MkDocs e especificações conceituais e protótipos de tela.
- **Testes Realizados**: Validação dos fluxos de navegação contra os Casos de Uso previstos no RUP/UP.

#### **3.5. Teste**

- **Feedback dos Usuários**: Validação dos fluxos com a equipe e revisão da clareza dos fluxos de operação e regras de negócio.
- **Ajustes Realizados**: Desacoplamento de regras financeiras e foco estrito na consistência da agenda e na operação técnica.
- **Resultados Finais**: Modelo aprovado para guiar a modelagem dos diagramas de classes e de sequência da fase de Elaboração.

---

### **4. Conclusão**

- **Resultados Obtidos**: Definição clara do escopo do MVP, identificação dos perfis envolvidos, formalização dos critérios de aceitação e seleção das ideias centrais do Backend GAAP.
- **Próximos Passos**: Refinamento da arquitetura na fase de Elaboração, modelagem do DER e início da implementação iterativa das migrações e rotas no Django (Construção).
- **Aprendizados**: A agenda de alta performance exige validações simultâneas e atômicas de múltiplos recursos (aluno, profissional e espaço), tornando a consistência transacional o pilar mais crítico do backend.

---

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Criação inicial do documento | Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.0 | Ajuste de personas, problemas e ideação para o escopo GAAP | Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.1 | Complementação de Insights, Personas, POV, Ideação e Teste conforme modelo oficial | Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.2 | Revisão da empatia e ideação com base no brainstorm e nos perfis do projeto | Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf |
