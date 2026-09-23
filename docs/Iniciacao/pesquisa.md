---
id: pesquisa
title: Pesquisa
---

# Pesquisa

### **1. Capa**

- **Tema**: Sistema Backend GAAP (Gestão de Atletas de Alta Performance)
- **Data**: 2026.2
- **Stakeholder**: Centro de Treinamento Esportivo / Coordenação Acadêmica Ibmec

---

## 2. Pesquisa de Domínio e Aplicações Similares

### 2.1. Contexto do Projeto

<p align="justify">
Escolas e centros de treinamento de alta performance lidam diariamente com a alocação de atletas em múltiplas modalidades esportivas e serviços de saúde integrados (Treino Físico/Técnico, Fisioterapia, Nutrição e Psicologia Esportiva). A carência de um sistema integrado gera conflitos de horários de profissionais, superlotação de salas e perda de histórico de presenças e relatórios de evolução.
</p>

### 2.2. Comparativo de Plataformas de Mercado

| Sistema | Foco Principal | Pontos Fortes | Limitações para o Cenário GAAP |
| :--- | :--- | :--- | :--- |
| **Tecnofit** | Gestão de academias e estúdios fitness. | Controle de matrículas e fluxo financeiro. | Foco primariamente comercial e de catraca; pouca flexibilidade para relatórios técnicos multidisciplinares. |
| **Zen Planner** | Estúdios de artes marciais e boxes. | Controle de turmas e graduações. | Não integra de forma nativa serviços clínicos de saúde (Fisioterapia, Psicologia) com o treinamento esportivo. |
| **Calendly** | Agendamento universal de reuniões. | Interface rápida e intuitiva de reserva. | Não possui conceito de capacidade de salas, gestão de presenças ou relatórios de sessão esportiva. |
| **Mindbody** | Centros integrados de bem-estar e spas. | Robusto suporte a múltiplos serviços. | Alta complexidade, custo elevado e ausência de modelo focado no acompanhamento técnico de atletas. |

### 2.3. Funcionalidades Essenciais Identificadas para o MVP

1. **Gestão de Agendamentos Multidisciplinares**: Reserva de sessões para Treino, Fisioterapia, Psicologia e Nutrição.
2. **Prevenção de Conflitos em Tempo Real**: Bloqueio de reservas sobrepostas para o mesmo profissional ou para a mesma sala.
3. **Controle de Capacidade de Espaços**: Garantia de que salas coletivas não ultrapassem a lotação estipulada.
4. **Bloqueios Administrativos de Agenda**: Capacidade de pausar horários para manutenção, eventos ou descanso de profissionais.
5. **Acompanhamento Pós-Sessão**: Registro de presença/falta e criação de relatórios de treino/atendimento pelos especialistas.

---

## 3. Delimitação do Escopo

* **No Escopo**: Autenticação com controle de acesso baseado em papéis (RBAC), cadastros de base, agendamentos, validação de regras de negócio de agenda e emissão de relatórios operacionais.
* **Fora de Escopo**: Módulos financeiros de cobrança, prontuário médico detalhado com assinatura digital, aplicativo móvel nativo e dashboards avançados de BI.

---

## 4. Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Versão inicial da pesquisa de mercado | Arthur Calebe |
| 2026.2 | 2.0 | Alinhamento da pesquisa ao cenário do Backend GAAP e serviços integrados | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
