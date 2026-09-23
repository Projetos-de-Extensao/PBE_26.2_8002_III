---
id: documento_de_visao
title: Documento de Visão
---

# Documento de Visão — Backend GAAP

## 1. Introdução

<p align="justify">
O propósito deste documento é fornecer uma visão abrangente sobre o desenvolvimento do sistema back-end <b>GAAP (Gestão de Atletas de Alta Performance)</b>, desenvolvido no âmbito da disciplina de Projeto Back-End (IBM8936) do curso de Engenharia de Software do Ibmec (2026.2).
</p>

---

## 2. Descrição do Problema

| Elemento | Descrição |
| :--- | :--- |
| **O problema de** | Falta de centralização e controle na gestão de horários, vagas e acompanhamento técnico de atletas. |
| **Afeta** | Administradores de centros esportivos, treinadores, profissionais de saúde (fisioterapeutas, nutricionistas, psicólogos) e atletas. |
| **Cujo impacto é** | Ocorrência de sobreposição de horários (*double-booking*), superlotação de salas, falta de controle de presenças e perda do histórico de treinos. |
| **Uma boa solução seria** | Um sistema back-end robusto em Django que centralize cadastros, valide regras de agenda em tempo real e registre presenças e relatórios técnicos. |

---

## 3. Objetivos do Produto

* Fornecer autenticação segura e autorização com base em papéis (Administrador, Treinador, Profissional de Saúde e Aluno).
* Garantir integridade na marcação de sessões para as quatro modalidades essenciais: **Treino**, **Fisioterapia**, **Psicologia** e **Nutrição**.
* Impedir conflitos de horário para profissionais e salas, respeitando a capacidade máxima de cada espaço.
* Permitir o registro rápido de presenças e a finalização de relatórios técnicos pós-sessão.

---

## 4. Perfis de Usuário

| Perfil | Descrição e Atribuições |
| :--- | :--- |
| **Administrador** | Gestão de alunos, profissionais, serviços, espaços físicos e aplicação de bloqueios de agenda. |
| **Treinador** | Consulta da grade de treinos, marcação de presença/falta e emissão de relatórios de treino. |
| **Profissional de Saúde** | Consulta e registro dos atendimentos especializados (Fisioterapia, Psicologia, Nutrição). |
| **Aluno / Responsável** | Visualização de horários disponíveis, solicitação de agendamentos e histórico de sessões. |

---

## 5. Principais Recursos e Funcionalidades

1. **Gestão de Cadastros de Base**: Manutenção de usuários, perfis, salas e serviços.
2. **Motor de Agendamento Inteligente**: Verificação atômica de disponibilidade de profissional e espaço físico.
3. **Gestão de Bloqueios**: Indisponibilização de horários por manutenção, planejamento ou eventos.
4. **Registro Operacional**: Controle de presença (presente/ausente) e preenchimento de relatório pós-treino.
5. **Histórico e Consultas**: Consultas de agenda filtradas por data, aluno, profissional e serviço.

---

## 6. Restrições e Limitações do Escopo

* O escopo do MVP não inclui gateways de pagamento, prontuários clínicos avançados com certificação digital ou aplicativo móvel nativo.
* A persistência deve utilizar banco de dados relacional normalizado via Django ORM.

---

## 7. Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Criação inicial | Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.0 | Reestruturação completa do documento de visão para o Backend GAAP | Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf |
