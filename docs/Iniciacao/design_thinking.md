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
- **Pessoas Envolvidas**:
  * *Administrador*: Lida com a sobrecarga de gerenciar dezenas de horários, conflitos de salas e indisponibilidade de profissionais.
  * *Treinador / Fisioterapeuta / Nutricionista / Psicólogo*: Necessitam de acesso rápido à sua agenda diária e de uma forma simples de registrar se o aluno compareceu e como foi o treino.
  * *Atleta*: Precisa de clareza sobre seus horários marcados e certeza de que seu espaço está reservado.

#### **3.2. Definição**

- **Problema Central**: Como estruturar uma API backend segura e eficiente que garanta a integridade dos agendamentos multidisciplinares, impeça choque de horários e centralize o registro de presenças e relatórios de treino?
- **Critérios de Sucesso**:
  1. Zero conflito de horários para profissionais e salas.
  2. Respeito rigoroso à lotação máxima de cada espaço físico.
  3. Separação clara de permissões e visibilidade de dados por perfil de usuário.
  4. Rastreabilidade das sessões realizadas por meio de presenças e relatórios.

#### **3.3. Ideação**

- **Propostas Selecionadas**:
  * **Motor de Validação de Agenda**: Verificação atômica de disponibilidade de profissional, sala e ausência de bloqueios antes de salvar a reserva.
  * **Categorização por Serviços**: Separação dos agendamentos em Treino, Fisioterapia, Psicologia e Nutrição com vinculação a profissionais capacitados.
  * **Fluxo Operacional de Presença e Relatório**: Endpoints dedicados para o profissional dar baixa no atendimento logo após o término da sessão.

#### **3.4. Prototipagem e Validação**

- **Abordagem**: Criação de diagramas de fluxo, protótipos de baixa fidelidade das interfaces essenciais e especificação dos contratos da API REST com validações de entrada e saída.

---

### **4. Conclusão**

<p align="justify">
A aplicação do Design Thinking permitiu alinhar o propósito da API do GAAP às necessidades práticas de administradores, treinadores e profissionais de saúde, garantindo um escopo objetivo, sem sobre-especificações e pronto para a fase de Elaboração e Construção.
</p>

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Criação inicial do documento | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.0 | Ajuste de personas, problemas e ideação para o escopo GAAP | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
