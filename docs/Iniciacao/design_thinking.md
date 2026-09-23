---
id: dt
title: Design Thinking
---

# Design Thinking — Backend GAAP

### **1. Capa**

- **Título do Projeto**: Sistema GAAP — Gestão de Atletas de Alta Performance
- **Nome da Equipe**: Grupo 3 (Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf)
- **Data**: 2026.2
- **Organização**: Ibmec — Disciplina de Projeto Back-End

---

### **2. Introdução**

- **Contexto do Projeto**: Escolas e centros de treinamento esportivo necessitam de uma solução integrada para orquestrar horários de treinos físicos/técnicos e atendimentos multidisciplinares de saúde (Fisioterapia, Psicologia e Nutrição).
- **Objetivo**: Desenvolver o backend e API REST para sustentar a operação de agendamentos, validação de disponibilidade de espaços e profissionais, controle de presença e relatórios de treino.
- **Público-Alvo**: Gestores/Administradores do centro, Treinadores esportivos, Profissionais de Saúde e Atletas/Alunos.
- **Escopo**: Foco na API REST, autenticação por perfil, regras de consistência de agenda e registro de atividades pós-sessão.

---

### **3. Fases do Design Thinking**

#### **3.1. Empatia**

- **Pesquisa**: Análise de processos operacionais em academias e clínicas esportivas, identificando as dores causadas pelo uso de planilhas e anotações descentralizadas.
- **Insights**:
  1. *Falta de Sincronia*: Agendamentos manuais geram choque de horário constante para profissionais e salas.
  2. *Superlotação Invisível*: Salas de treino coletivo ultrapassam a capacidade segura por ausência de travas automáticas.
  3. *Perda de Histórico*: Relatórios de evolução técnica e registros de presença ficam dispersos em cadernos ou mensagens instantâneas.
- **Personas**:
  * **Carlos Mendes (Gestor / Administrador, 42 anos)**: Precisa de uma visão unificada da grade horária, controle de capacidade das salas e facilidade para aplicar bloqueios de manutenção sem desorganizar as turmas.
  * **Roberto Lima (Treinador de Alta Performance, 34 anos)**: Precisa consultar sua agenda diária pelo sistema de forma rápida e registrar presenças e relatórios técnicos logo após cada sessão.
  * **Dra. Mariana Souza (Fisioterapeuta Esportiva, 29 anos)**: Necessita que seus atendimentos clínicos sejam restritos ao seu consultório e horário, com sigilo sobre os relatórios emitidos.
  * **Lucas Fonseca (Atleta de Natação, 19 anos)**: Busca consultar seus treinos marcados com facilidade e ter a garantia de que sua vaga na sala de preparação física está reservada.

#### **3.2. Definição**

- **Problema Central**: Como estruturar uma API backend segura e eficiente que garanta a integridade dos agendamentos multidisciplinares, impeça choque de horários e centralize o registro de presenças e relatórios de treino?
- **Pontos de Vista (POV)**:
  * *O Administrador precisa de* travas automáticas de lotação e conflito *porque* marcações incorretas geram atrito operacional e risco aos atletas.
  * *O Treinador precisa de* um canal ágil para dar baixa na sessão e registrar observações *porque* precisa comprovar a realização das atividades sem perder tempo administrativo.
  * *O Atleta precisa de* previsibilidade e confirmação imediata da vaga *porque* sua rotina de treinamento de alta performance exige planejamento rigoroso.

#### **3.3. Ideação**

- **Brainstorming**:
  * Validação atômica de horários para evitar sobreposição (*double-booking*).
  * Limitação de agendamentos com base na capacidade máxima cadastrada para a sala.
  * Diferenciação de serviços por especialidade técnica (*Treino, Fisio, Psico, Nutrição*).
  * Registro simplificado de presença (presente/falta) acoplado à emissão do relatório de treino.
- **Seleção de Ideias**: Critérios baseados na viabilidade técnica para um MVP em 4 meses no Django e no impacto direto na redução de erros operacionais.
- **Ideias Selecionadas**:
  1. *Motor de Validação de Agenda*: Regra central que bloqueia conflito de profissional, sala e indisponibilidade administrativa.
  2. *Controle de Lotação por Espaço*: Verificação de vagas remanescentes antes de confirmar qualquer reserva.
  3. *Workflow de Finalização de Treino*: Endpoint que atualiza o status para "REALIZADO", marca presença e anexa o relatório técnico imutável.

#### **3.4. Prototipagem**

- **Descrição do Protótipo**: Elaboração de diagramas conceituais de telas e navegação em PlantUML cobrindo login, painel administrativo, agenda do treinador e agendamento de sessões.
- **Materiais Utilizados**: PlantUML, MkDocs e especificações de contratos de API REST (JSON).
- **Testes Realizados**: Validação dos fluxos de navegação contra os Casos de Uso previstos no RUP/UP.

#### **3.5. Teste**

- **Feedback dos Usuários**: Validação dos fluxos com a equipe e revisão de usabilidade dos endpoints para garantir simplicidade nas chamadas REST.
- **Ajustes Realizados**: Desacoplamento de regras financeiras e foco estrito na consistência da agenda e na operação técnica.
- **Resultados Finais**: Modelo aprovado para guiar a modelagem dos diagramas de classes e de sequência da fase de Elaboração.

---

### **4. Conclusão**

- **Resultados Obtidos**: Definição clara do escopo do MVP, validação das personas do centro esportivo, formalização dos critérios de aceitação e seleção das ideias centrais do Backend GAAP.
- **Próximos Passos**: Refinamento da arquitetura na fase de Elaboração, modelagem do DER e início da implementação iterativa das migrações e rotas no Django (Construção).
- **Aprendizados**: A agenda de alta performance exige validações simultâneas e atômicas de múltiplos recursos (aluno, profissional e espaço), tornando a consistência transacional o pilar mais crítico do backend.

---

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Criação inicial do documento | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.0 | Ajuste de personas, problemas e ideação para o escopo GAAP | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.1 | Complementação de Insights, Personas, POV, Ideação e Teste conforme modelo oficial | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
