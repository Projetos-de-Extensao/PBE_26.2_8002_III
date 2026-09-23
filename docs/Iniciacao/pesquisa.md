---
id: pesquisa
title: Pesquisa
---

# Pesquisa

### **1. Capa**

- **Tema**: Sistema Backend GAAP (Gestão de Atletas de Alta Performance)
- **Data**: 2026.2
- **Stakeholder**: Centro de Treinamento Esportivo / Pró-Reitoria Acadêmica Ibmec

---

## 2. Pesquisa de Domínio e Aplicações

### 2.1. Contexto do Projeto

<p align="justify">
Academias e centros de treinamento esportivo de alta performance lidam diariamente com a alocação de atletas em múltiplas modalidades esportivas e serviços de saúde integrados (Treino Físico/Técnico, Fisioterapia, Nutrição e Psicologia Esportiva). A carência de um sistema integrado gera conflitos de horários de profissionais, superlotação de salas e perda de histórico de presenças e relatórios de evolução.
</p>

### 2.2. Objetivo do Projeto

<p align="justify">
O objetivo do projeto é conceber, projetar e implementar um sistema back-end funcional, robusto, testado e documentado denominado <b>GAAP</b>. A solução visa centralizar a gestão de agendas de treinos e atendimentos multidisciplinares, validar regras de consistência de horários e capacidade de espaços em tempo real, e registrar o histórico de presenças e relatórios técnicos operacionais.
</p>

### 2.3. Público-Alvo

O sistema destina-se aos seguintes grupos de usuários:

* **Administradores do Centro Esportivo**: Responsáveis pelo cadastramento e manutenção de alunos, profissionais, salas/espaços, serviços e bloqueios de agenda.
* **Treinadores Esportivos**: Profissionais responsáveis pela condução dos treinos, controle de presença e elaboração de relatórios técnicos pós-treino.
* **Profissionais de Saúde** *(Fisioterapeutas, Nutricionistas e Psicólogos)*: Especialistas que realizam atendimentos clínicos e registram o acompanhamento dos atletas.
* **Alunos e Atletas** *(ou seus Responsáveis)*: Beneficiários que consultam a disponibilidade de grade e realizam agendamentos de sessões.

### 2.4. Escopo do Projeto

* **No Escopo**: Autenticação com controle de acesso baseado em papéis (RBAC), cadastros de base (alunos, profissionais, salas, serviços), motor de agendamento com validação atômica contra sobreposições e limites de lotação, controle de bloqueios de indisponibilidade e emissão de relatórios de sessão.
* **Fora de Escopo**: Módulos financeiros de cobrança recorrente e gateways de pagamento, prontuário clínico detalhado com assinatura digital, aplicativo móvel nativo, dashboards analíticos avançados de BI e operação offline.

---

### 2.5. Análise de Aplicações e Mercado (Benchmarking)

| Sistema | Foco Principal | Pontos Fortes | Limitações para o Cenário GAAP |
| :--- | :--- | :--- | :--- |
| **Tecnofit** | Gestão de academias e estúdios fitness. | Controle de matrículas e fluxo financeiro. | Foco primariamente comercial e de catraca; pouca flexibilidade para relatórios técnicos multidisciplinares. |
| **Zen Planner** | Estúdios de artes marciais e boxes. | Controle de turmas e graduações. | Não integra de forma nativa serviços clínicos de saúde (Fisioterapia, Psicologia) com o treinamento esportivo. |
| **Calendly** | Agendamento universal de reuniões. | Interface rápida e intuitiva de reserva. | Não possui conceito de capacidade de salas, gestão de presenças ou relatórios de sessão esportiva. |
| **Mindbody** | Centros integrados de bem-estar e spas. | Robusto suporte a múltiplos serviços. | Alta complexidade, custo elevado e ausência de modelo focado no acompanhamento técnico de atletas. |

---

### 2.6. Levantamento de Legislação e Conformidade

A concepção do sistema GAAP observa as seguintes diretrizes legais e normativas:

1. **Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)**:
   * **Finalidade e Necessidade**: Coleta restrita aos dados estritamente necessários para identificação, agendamento e segurança durante o treinamento.
   * **Segurança da Informação**: Armazenamento seguro de credenciais com criptografia/hash, tráfego sob canal cifrado e controle de acesso baseado em perfil (*Role-Based Access Control*), garantindo que dados de saúde e atendimento sejam visíveis apenas a profissionais autorizados.
2. **Normativas dos Conselhos Profissionais**:
   * **Educação Física (CONFEF)**: Exigência de registro profissional para prescrição e acompanhamento de treinos físicos.
   * **Fisioterapia (COFFITO)**, **Nutrição (CFN)** e **Psicologia (CFP)**: Diretrizes relativas à confidencialidade das sessões, guarda e fidedignidade dos relatórios técnicos de atendimento registrados na plataforma.

---

## 3. Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Versão inicial da pesquisa de mercado | Arthur Calebe |
| 2026.2 | 2.0 | Alinhamento da pesquisa ao cenário do sistema GAAP | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.1 | Inclusão de Objetivo, Público-Alvo e Levantamento de Legislação conforme modelo oficial | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
