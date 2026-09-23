---
id: levantamento_de_requisitos
title: Levantamento de Requisitos
---

# Levantamento de Requisitos — Backend GAAP

## Introdução

<p align="justify">
Este documento consolida a especificação dos requisitos funcionais, requisitos não funcionais e regras de negócio do sistema <b>GAAP (Gestão de Atletas de Alta Performance)</b>. Seu objetivo é servir de base e referência direta para os Casos de Uso, Diagrama de Classes e Diagramas de Sequência da fase de Elaboração.
</p>

### Objetivo do Sistema

<p align="justify">
O GAAP tem como objetivo centralizar e orquestrar a operação de agendamentos de treinos esportivos e atendimentos multidisciplinares (Fisioterapia, Psicologia e Nutrição), garantindo a integridade dos horários, a ausência de conflitos de agenda, o respeito à capacidade física dos ambientes e a rastreabilidade do desempenho por meio de relatórios operacionais.
</p>

---

## 1. Stakeholders

| Stakeholder | Descrição | Papel / Interesse no Sistema |
| :--- | :--- | :--- |
| **Administrador** | Gestor do centro esportivo. | Cadastro de alunos, profissionais, serviços, salas e bloqueios; consulta de relatórios globais e lotação. |
| **Treinador** | Profissional de educação física / técnico. | Consulta da grade de treinos, controle de presença e elaboração de relatórios técnicos de treino. |
| **Profissional de Saúde** | Fisioterapeuta, Nutricionista e Psicólogo. | Gestão de atendimentos especializados e registro de evolução clínica/técnica. |
| **Aluno / Atleta** | Praticante atendido pelo centro esportivo. | Consulta de disponibilidade, agendamento de sessões e acompanhamento de presença. |
| **Academia Esportiva** | Organização mantenedora. | Maximização do uso dos espaços com segurança e excelência no acompanhamento dos atletas. |
| **Equipe de Desenvolvimento** | Grupo 3 da disciplina PBE (Ibmec). | Entrega do sistema back-end funcional, testada e documentada com base no RUP/UP. |

---

## 2. Requisitos Funcionais

### 2.1. Autenticação e Perfis

| ID | Descrição | Prioridade |
| :--- | :--- | :---: |
| **RF-01** | O sistema deve autenticar usuários mediante e-mail e senha com hash seguro. | Must |
| **RF-02** | O sistema deve restringir o acesso a funcionalidades e dados de acordo com o perfil do usuário (Administrador, Treinador, Profissional de Saúde e Aluno). | Must |
| **RF-03** | O sistema deve permitir a recuperação de senha por meio de instruções enviadas por e-mail. | Should |

### 2.2. Cadastros de Base

| ID | Descrição | Prioridade |
| :--- | :--- | :---: |
| **RF-04** | O sistema deve permitir o cadastro, edição e inativação de Alunos com dados cadastrais e de contato. | Must |
| **RF-05** | O sistema deve permitir o cadastro, edição e inativação de Profissionais, vinculando-os à sua especialidade (Treinador, Fisioterapeuta, Psicólogo, Nutricionista). | Must |
| **RF-06** | O sistema deve permitir o cadastro de Serviços oferecidos (*Treino, Fisioterapia, Psicologia, Nutrição*), definindo duração padrão. | Must |
| **RF-07** | O sistema deve permitir o cadastro de Espaços Físicos / Salas, estipulando a capacidade máxima de ocupação. | Must |

### 2.3. Gestão de Agenda e Bloqueios

| ID | Descrição | Prioridade |
| :--- | :--- | :---: |
| **RF-08** | O sistema deve permitir ao Administrador registrar bloqueios de agenda para profissionais ou salas em períodos específicos (manutenção, eventos ou indisponibilidade). | Must |
| **RF-09** | O sistema deve permitir a consulta da agenda operacional com filtros por data, profissional, sala, aluno e tipo de serviço. | Must |
| **RF-10** | O sistema deve exibir apenas os atendimentos pertinentes ao próprio profissional ou ao próprio aluno quando consultado por esses perfis. | Must |

### 2.4. Agendamento e Validações

| ID | Descrição | Prioridade |
| :--- | :--- | :---: |
| **RF-11** | O sistema deve validar a disponibilidade simultânea do profissional, da sala e do aluno no horário solicitado. | Must |
| **RF-12** | O sistema deve impedir a confirmação de agendamento em caso de sobreposição de horário (*double-booking*) para o profissional ou para a sala. | Must |
| **RF-13** | O sistema deve verificar se o número total de alunos agendados em uma sala coletiva não ultrapassa a sua capacidade máxima. | Must |
| **RF-14** | O sistema deve impedir agendamentos em horários ou locais com bloqueio administrativo ativo. | Must |
| **RF-15** | O sistema deve garantir que o profissional selecionado possua atribuição compatível com o tipo de serviço agendado. | Must |
| **RF-16** | O sistema deve permitir o cancelamento e o reagendamento de sessões com liberação imediata dos horários. | Must |

### 2.5. Operação Pós-Sessão e Relatórios

| ID | Descrição | Prioridade |
| :--- | :--- | :---: |
| **RF-17** | O sistema deve permitir que o profissional registre a presença ou falta do aluno na sessão. | Must |
| **RF-18** | O sistema deve permitir que o profissional elabore e finalize o relatório técnico de treino ou observações do atendimento. | Must |
| **RF-19** | O sistema deve permitir ao Administrador e aos profissionais a consulta do histórico consolidado de sessões e relatórios finalizados. | Should |

---

## 3. Requisitos Não Funcionais

| ID | Categoria | Descrição | Prioridade |
| :--- | :--- | :--- | :---: |
| **RNF-01** | **Segurança** | As senhas de acesso devem ser armazenadas exclusivamente com algoritmos de hash criptográfico seguros (ex.: PBKDF2/Argon2 do Django). | Must |
| **RNF-02** | **Integridade** | A operação de confirmação de agendamento deve ser tratada como transação atômica no banco de dados para evitar condições de corrida (*race conditions*). | Must |
| **RNF-03** | **Desempenho** | A verificação de disponibilidade e conflitos de agenda deve responder em menos de 2 segundos sob carga normal. | Should |
| **RNF-04** | **Arquitetura** | O backend deve ser desenvolvido em Python utilizando o framework Django. | Must |
| **RNF-05** | **Persistência** | O esquema de banco de dados deve ser relacional, normalizado e gerenciado através de migrações do Django ORM. | Must |
| **RNF-06** | **Manutenibilidade**| O código-fonte deve ser modular, coberto por testes automatizados de unidade e integração para os fluxos críticos de validação. | Must |

---

## 4. Regras de Negócio

| ID | Regra | Descrição | Requisitos Relacionados |
| :--- | :--- | :--- | :--- |
| **RN-01** | **Inexistência de Choque de Horário** | Um profissional ou sala física não pode possuir mais de um agendamento confirmado no mesmo intervalo de tempo. | RF-11, RF-12 |
| **RN-02** | **Respeito à Capacidade da Sala** | O somatório de alunos confirmados em uma sessão não pode exceder o limite de lotação cadastrado para o espaço físico. | RF-07, RF-13 |
| **RN-03** | **Respeito a Bloqueios Administrativos** | Períodos com bloqueio de agenda impedem qualquer novo agendamento para o profissional ou sala afetada. | RF-08, RF-14 |
| **RN-04** | **Compatibilidade Profissional-Serviço** | Treinos só podem ser conduzidos por Treinadores; Fisioterapia, Psicologia e Nutrição exigem profissionais da respectiva especialidade. | RF-05, RF-06, RF-15 |
| **RN-05** | **Autoria do Relatório e Presença** | Apenas o profissional vinculado à sessão ou o administrador possui permissão para lançar presença e finalizar o relatório de treino. | RF-17, RF-18 |
| **RN-06** | **Imutabilidade Pós-Finalização** | Relatórios de treino finalizados não podem ser alterados sem autorização administrativa para fins de auditoria. | RF-18, RF-19 |

---

## 5. Matriz de Rastreabilidade

| Requisito Funcional | Casos de Uso Relacionados | Regras de Negócio Aplicadas |
| :--- | :--- | :--- |
| **RF-01** a **RF-03** | UC-01 (Autenticação e Perfis) | — |
| **RF-04** | UC-02 (Manter Alunos) | — |
| **RF-05** | UC-03 (Manter Profissionais) | RN-04 |
| **RF-06**, **RF-07** | UC-04 (Manter Serviços e Salas) | RN-02, RN-04 |
| **RF-08** | UC-05 (Gerenciar Bloqueios) | RN-03 |
| **RF-09**, **RF-10** | UC-08 (Consultar Agenda) | — |
| **RF-11** a **RF-15** | UC-06 (Confirmar Agendamento) | RN-01, RN-02, RN-03, RN-04 |
| **RF-16** | UC-07 (Cancelar/Reagendar Sessão) | RN-01 |
| **RF-17**, **RF-18** | UC-09 (Registrar Presença), UC-10 (Finalizar Relatório) | RN-05, RN-06 |
| **RF-19** | UC-08 (Consultar Agenda / Histórico) | RN-06 |

---

## Conclusão

<p align="justify">
A especificação dos requisitos do Backend GAAP estrutura o escopo exato do MVP, eliminando ambiguidades e direcionando o desenvolvimento dos Casos de Uso e Diagramas de Classes e Sequência.
</p>

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Versão inicial | Pedro Henrique Becker |
| 2026.2 | 2.0 | Reestruturação completa dos requisitos e regras para o Backend GAAP | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
