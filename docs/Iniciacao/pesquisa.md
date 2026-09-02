---
id: pesquisa
title: Pesquisa
---

# Pesquisa
### **1. Capa**

- Tema: Sistema de marcação para Treinamento Infantil
- Data: 2026.2

---
## 1. Analisar Aplicações de Alocação de Eventos

---
### 1.1. Descrição

Núcleo central do sistema responsável por orquestrar a agenda de treinamentos. Ele garante a sincronia entre a disponibilidade do espaço físico, do especialista em performance e do jovem atleta, evitando sobrecargas e respeitando os limites biológicos da faixa etária (7 a 12 anos).

### 1.2. Requisitos Funcionais

| ID     | Descrição                                                                        | Prioridade |
| ------ | -------------------------------------------------------------------------------- | ---------- |
| ALO-01 | Validar disponibilidade simultânea de Sala, Professor e Aluno no mesmo horário   | Must       |
| ALO-02 | Bloquear agendamentos conflitantes em tempo real (Double-booking)                | Must       |
| ALO-03 | Inserir janela de descanso e recuperação física apropriada após cada treino      | Must       |
| ALO-04 | Acionar automaticamente a fila de espera caso haja um cancelamento pelos pais    | Should     |
| ALO-05 | Recomendar treinos baseados no nível de desenvolvimento motor do jovem atleta    | Should     |
| ALO-06 | Restringir o número máximo de atividades de alta intensidade na mesma semana     | Could      |

### 1.3. Regras de Negócio Específicas

- **Proteção contra Duplicidade:** A proteção contra duplicidade é o pilar principal, interrompendo qualquer transação que gere conflito entre a agenda do treinador e a sala.
- **Cálculo de Janela Temporal:** O cálculo da janela temporal deve considerar não apenas a duração do treino, mas o tempo de transição, hidratação e higienização dos equipamentos.
- **Prioridade de Segurança:** O sistema deve bloquear treinos classificados como extremos caso o relatório de fadiga da criança indique necessidade de repouso.

### 1.4. Estrutura de Dados e Relacionamentos

Cada alocação conecta obrigatoriamente: **Atividade**, **Profissional**, **Responsável (Pagante)** e **Jovem Atleta (Beneficiário)**, além do recurso físico (**Sala**). Deve incluir rastreabilidade temporal e métricas resumidas de conclusão.

## 2. Funcionalidades do Sistema

### 2.1 Calendário

#### 2.1.1 Descrição

Interface de gestão de tempo que oferece visões adaptadas ao usuário: o gestor visualiza a capacidade total da academia, enquanto os pais visualizam apenas a rotina de treinos e os períodos de descanso de seus filhos.

#### 2.1.2 Requisitos Funcionais

| ID     | Descrição                                                                      | Prioridade |
| ------ | ------------------------------------------------------------------------------ | ---------- |
| CAL-01 | Alternar entre visão administrativa (lotação total) e visão parental (filhos)  | Must       |
| CAL-02 | Filtrar calendário por especialidade do treino, idade ou treinador             | Should     |
| CAL-03 | Permitir cancelamento ou reagendamento pelos pais via interface simplificada   | Must       |
| CAL-04 | Destacar visualmente períodos de pico e horários ociosos do centro de treino   | Could      |

#### 2.1.3 Regras de Negócio Específicas

- Apenas responsáveis autenticados podem confirmar ou alterar horários, respeitando uma janela de antecedência mínima de 12 horas. 
- Horários retroativos são bloqueados para agendamento, mas abertos para a inserção de métricas atrasadas por parte dos professores.

### 2.2 Salas (Espaços Físicos)

#### 2.2.1 Descrição

Controle das zonas de treinamento focadas no público infantil (ex: pista de explosão motora, sala de testes cognitivos), garantindo que a lotação máxima mantenha a segurança e a qualidade do acompanhamento.

#### 2.2.2 Requisitos Funcionais

| ID     | Descrição                                                                       | Prioridade |
| ------ | ------------------------------------------------------------------------------- | ---------- |
| SAL-01 | Mapear zonas de treinamento com limites rigorosos de capacidade e metragem      | Must       |
| SAL-02 | Vincular equipamentos específicos de alta performance a cada ambiente           | Should     |
| SAL-03 | Bloquear espaços em horários de manutenção ou avaliação técnica exclusiva       | Must       |

#### 2.2.3 Regras de Negócio Específicas

- Salas com equipamentos complexos ou de risco avaliado só podem ser reservadas caso a atividade correspondente possua um treinador com a certificação técnica adequada registrada no sistema.

### 2.3 Professores (Profissionais e Especialistas)

#### 2.3.1 Descrição

Gestão do corpo técnico, assegurando que o desenvolvimento motor e cognitivo de cada jovem seja acompanhado por profissionais com a especialização correta para aquela exata fase de crescimento.

#### 2.3.2 Requisitos Funcionais

| ID     | Descrição                                                                       | Prioridade |
| ------ | ------------------------------------------------------------------------------- | ---------- |
| PRF-01 | Categorizar treinadores por especialidade técnica e faixa etária de domínio     | Must       |
| PRF-02 | Gerenciar turnos com bloqueios automáticos para almoço e planejamento           | Must       |
| PRF-03 | Fornecer atalho na agenda para input rápido de métricas logo após o treino      | Should     |

#### 2.3.3 Regras de Negócio Específicas

- O sistema impede que o mesmo profissional inicie um treino em um espaço físico distinto sem um intervalo mínimo de deslocamento. 
- A agenda do professor deve refletir apenas as modalidades para as quais ele foi previamente validado pelo coordenador da academia.

## 3. Aplicativos Similares

### 3.1 Comparativo de Plataformas

| Sistema        | Foco Principal                                      | Pontos Fortes                                                | Limitações para o Nosso Cenário                                                                  | Site Oficial          |
| :------------- | :-------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------------------------------------------- | :-------------------- |
| **Tecnofit**   | Gestão de academias e boxes de treinamento.         | Controle financeiro e gestão eficiente de lotação de turmas. | Voltado para o adulto autônomo; não possui foco em gamificação ou relatórios de jovens atletas.  | tecnofit.com.br       |
| **Zen Planner**| Estúdios de fitness e artes marciais.               | Ótimo rastreamento de presença e evolução de faixas/níveis.  | Não separa adequadamente a jornada de quem agenda (Pais) de quem executa o treino (Criança).     | zenplanner.com        |
| **Calendly**   | Agendamento universal de compromissos.              | Fluxo de reserva de tempo extremamente rápido e sem atrito.  | Zero gestão de capacidade de salas, filas de espera ou input de métricas pós-treino.             | calendly.com          |
| **Mindbody**   | Gestão de grandes centros de bem-estar e saúde.     | Interface premium e robusta para agendamento de serviços.    | Excesso de funcionalidades irrelevantes; complexo demais para o registro dinâmico de performance.| mindbodyonline.com    |

### 3.2 Funcionalidades Essenciais Extraídas

---
- **Separação de Papéis:** Interface de agendamento gerencial para o responsável e interface de consumo de resultados lúdicos para a criança.
- **Gestão Familiar:** Uma única conta de acesso pagante administrando múltiplos perfis de pequenos atletas.
- **Workflow Pós-Treino:** Tela de preenchimento rápido (sliders e botões) para o professor registrar o rendimento sem perder tempo de quadra.
- **Filtro Inteligente:** Sugestão de horários cruzando a idade da criança com as turmas de desenvolvimento compatíveis.