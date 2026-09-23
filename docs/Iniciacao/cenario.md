---
id: cenario
title: Cenário do Projeto - Backend GAAP
---

# Cenário de Aula: Backend GAAP

## 1. Contexto e Desafio

Uma academia de treinamento esportivo precisa organizar alunos, profissionais e sessões de **Treino**, **Fisioterapia**, **Psicologia** e **Nutrição**. Atualmente, a operação depende de controles dispersos e não possui uma fonte confiável para acompanhar vagas, presenças e relatórios de treino.

A equipe deverá projetar e entregar, em quatro meses, o backend de um recorte inicial do **GAAP (Gestão de Atletas de Alta Performance)**. A proposta parte da análise do ambiente *PKZ & One to One*, mas o produto acadêmico não deve tentar reproduzir todos os módulos clínicos, financeiros, de BI ou mobile observados. O foco é entregar um **sistema back-end funcional, testado e documentado** para sustentar a operação de agenda e treino.

---

## 2. Objetivos Pedagógicos

* **Programação Orientada a Objetos**: Modelar as regras e entidades do domínio esportivo e multidisciplinar.
* **Banco de Dados Relacional**: Projetar esquema normalizado e implementar persistência com ORM (Django).
* **Engenharia de Software & UML**: Produzir e manter diagramas de Casos de Uso, Classes e Sequência rastreáveis.
* **Desenvolvimento Back-End**: Construir regras de negócio com validação, tratamento de erros, autenticação e autorização por perfil.
* **Metodologia Iterativa**: Trabalhar com RUP/UP, Git, GitHub Issues, Pull Requests e GitHub Projects.

---

## 3. Escopo do MVP

### 3.1 Perfis de Usuário

| Perfil | Responsabilidades Principais |
| :--- | :--- |
| **Administrador** | Mantém alunos, profissionais, serviços, espaços/salas, horários e bloqueios de agenda; consulta pendências e lotação. |
| **Treinador** | Consulta a agenda sob sua responsabilidade, registra presença/falta e elabora relatórios de treino. |
| **Profissional de Saúde** | *(Fisioterapeuta, Nutricionista, Psicólogo)* Consulta apenas os atendimentos e sessões atribuídos ao seu serviço e agenda. |
| **Aluno / Responsável** | Consulta disponibilidade, agenda sessões e acompanha histórico de treinos e presenças. |

### 3.2 Funcionalidades Iniciais do MVP

1. **Autenticação e Autorização**: Login seguro e restrição de rotas por perfil de acesso.
2. **Cadastros de Base**: Gestão de Alunos, Profissionais, Serviços (Treino, Fisio, Psico, Nutrição) e Espaços/Salas.
3. **Gestão de Agenda e Bloqueios**: Definição de horários de atendimento, bloqueios por manutenção e indisponibilidade.
4. **Agendamento com Validação Simultânea**: Reserva de sessões garantindo ausência de conflitos (profissional e sala) e respeito à capacidade máxima.
5. **Operação e Registro**: Registro de presença/falta e finalização de relatórios de treino pelo profissional.

### 3.3 Fora do Escopo da Entrega

* Pagamentos, gateway, cobrança recorrente e ledger financeiro completo.
* Prontuário clínico detalhado, assinatura digital e cálculos avançados de força por sexo e idade.
* Aplicativo mobile nativo, QR Code, notificações por WhatsApp/SMS e operação offline.
* Dashboards analíticos avançados, Data Warehouse, multi-tenancy e integrações públicas.
* Geração de PDF e upload de fotos (o sistema deve deixar apenas pontos de extensão documentados).

---

## 4. Modelo Inicial do Domínio

As entidades fundamentais do GAAP contemplam:

* **Usuário / Autenticação**: Base para Administrador, Treinador, Profissional de Saúde e Aluno.
* **Serviço**: Tipos de atendimento oferecidos (*Treino, Fisioterapia, Psicologia, Nutrição*).
* **Espaço / Sala**: Locais físicos com controle de capacidade e disponibilidade.
* **Agendamento / Sessão**: Vínculo entre Aluno, Profissional, Serviço, Espaço, Data/Hora e Status.
* **Bloqueio de Agenda**: Períodos de indisponibilidade de profissionais ou ambientes.
* **Relatório de Treino / Registro de Presença**: Confirmação de presença e observações técnicas da sessão.

---

## 5. Regras de Negócio Prioritárias

| ID | Regra de Negócio | Descrição |
| :--- | :--- | :--- |
| **RN01** | **Sem Conflito de Horário** | O sistema recusa qualquer agendamento em que o profissional ou o espaço físico já possua outra sessão confirmada no mesmo horário. |
| **RN02** | **Respeito à Capacidade Máxima** | O número de alunos agendados em um mesmo horário e espaço não pode ultrapassar a capacidade definida para a sala. |
| **RN03** | **Bloqueio de Indisponibilidade** | Não é permitido agendar sessões em horários ou salas marcados com bloqueio administrativo. |
| **RN04** | **Restrição por Especialidade** | Um profissional só pode ter sessões agendadas para os serviços compatíveis com a sua área de atuação. |
| **RN05** | **Autorização de Registro** | Apenas o profissional atribuído à sessão ou o administrador pode registrar presença e finalizar o relatório de treino. |

---

## 6. Requisitos Não Funcionais

* **Segurança**: Senhas protegidas por hash criptográfico e autenticação baseada em sessões seguras.
* **Integridade Transacional**: Operações de agendamento tratadas de forma atômica para prevenir sobreposição de vagas (*double-booking*).
* **Desempenho**: Tempo de resposta de validação de agenda adequado para uso em tempo real.
* **Tecnologia**: Implementação em **Python/Django** com banco de dados relacional normalizado.

---

## 7. Fases RUP/UP e Cronograma

| Fase | Semanas | Entregáveis e Marco |
| :--- | :---: | :--- |
| **Iniciação** | 1–5 | Visão do produto, stakeholders, backlog inicial, 5W2H, brainstorm, mapa mental e protótipo de baixa fidelidade. *Marco: Escopo do MVP aprovado.* |
| **Elaboração** | 6–8 | Casos de uso prioritários, critérios de aceitação, modelo de domínio, DER, diagramas UML (Classes e Sequência) e repositório configurado. *Marco: Arquitetura validada.* |
| **Construção - Iteração 1** | 9–10 | Autenticação, perfis, cadastros de aluno/profissional/serviço, migrações e testes de domínio. *Marco: Base administrativa utilizável.* |
| **Construção - Iteração 2** | 11–12 | Regras de disponibilidade, bloqueios, agendamento, consulta de agenda e testes de validação. *Marco: Agenda funcional.* |
| **Construção - Iteração 3** | 13–16 | Presença, aula ministrada, relatórios de treino, auditoria e documentação das funcionalidades. *Marco: Fluxo operacional completo.* |
| **Transição** | 17–18 | Testes de aceitação, correção de defeitos, demonstração, release e apresentação técnica. *Marco: Aplicativo entregue.* |

---

## 8. Artefatos UML Obrigatórios

1. **Diagrama de Casos de Uso**: Contemplando os perfis e os fluxos prioritários.
2. **Diagrama de Classes do Domínio**: Classes, atributos relevantes, associações, multiplicidades e responsabilidades.
3. **Diagrama de Sequência 1**: *Confirmar Agendamento*, evidenciando validação de capacidade, conflito e bloqueio.
4. **Diagrama de Sequência 2**: *Finalizar Relatório de Treino*.
5. **Diagrama Entidade-Relacionamento**: Compatível com os modelos e migrações do banco de dados relacional.

---

## 9. Gestão com GitHub

* **Repositório**: Estratégia de branches com main protegida e branches por funcionalidade (eature/... ou ix/...), com revisão via Pull Requests.
* **GitHub Issues**: Issues para cada requisito e tarefa técnica, com critérios de aceitação e labels padronizadas (	ipo:feature, 	ipo:bug, rea:backend, etc.).
* **GitHub Projects**: Quadro Kanban com colunas (*Backlog*, *Pronto*, *Em andamento*, *Em revisão*, *Em teste*, *Concluído*).
