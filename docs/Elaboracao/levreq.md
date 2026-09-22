---
id: levantamento_de_requisitos
title: Levantamento de Requisitos
---

# Levantamento de Requisitos

## Introdução

<p align = "justify">
Este documento consolida o levantamento de requisitos do sistema de agendamento para treinamento infantil de alta performance. Seu propósito é reunir, em um único artefato rastreável, os stakeholders envolvidos, os requisitos funcionais e não funcionais e as regras de negócio que condicionam a marcação de treinos, servindo de referência para os Casos de Uso, o Diagrama de Classes, o Diagrama de Sequência e o Protótipo de Baixa Fidelidade produzidos na fase de Elaboração.
</p>

### Objetivo

<p align = "justify">
O sistema tem como objetivo orquestrar a agenda de treinamentos de jovens atletas de 7 a 12 anos, validando a disponibilidade simultânea de sala, professor e atleta antes de confirmar qualquer marcação. Com isso, busca-se evitar agendamentos conflitantes, respeitar os limites biológicos da faixa etária atendida e garantir a segurança e a qualidade do acompanhamento realizado pelo centro de treinamento.
</p>

### Escopo

<p align = "justify">
O escopo abrange a gestão de contas de responsáveis e o vínculo de atletas, o agendamento, o cancelamento e o reagendamento de treinos, o calendário com visões adaptadas ao gestor e aos responsáveis, o cadastro e a disponibilidade de professores, o controle de salas e equipamentos, a fila de espera, o registro de métricas pós-treino e os relatórios de acompanhamento do desenvolvimento motor e cognitivo.
</p>

<p align = "justify">
Estão fora do escopo deste documento o controle financeiro e de mensalidades, a emissão de documentos fiscais e qualquer interface destinada ao uso direto pelo jovem atleta, que figura no sistema como beneficiário e não como usuário operador.
</p>

## Metodologia

<p align = "justify">
Os requisitos aqui registrados são derivados dos artefatos já produzidos pela equipe na fase de Iniciação: a <code>pesquisa.md</code>, que analisou aplicações de alocação de eventos e plataformas similares e elicitou requisitos nos grupos ALO, CAL, SAL e PRF; o <code>Brainstorm.md</code>, que consolidou os requisitos BS01 a BS14 a partir das questões do 5W2H; e o <code>design_thinking.md</code>, que organizou o problema central e os critérios de uma marcação adequada. Esses identificadores de origem são unificados neste documento em um esquema único de RF, RNF e RN, preservando a rastreabilidade até os Casos de Uso.
</p>

### Convenção de identificadores

| Prefixo | Significado |
| ------- | ----------- |
| `RF-nn` | Requisito Funcional |
| `RNF-nn` | Requisito Não Funcional |
| `RN-nn` | Regra de Negócio |
| `UC-nn` | Caso de Uso |

## 1. Stakeholders

<p align = "justify">
Seção a ser preenchida na próxima etapa, identificando cada parte interessada, sua descrição e seu interesse no sistema.
</p>

| Stakeholder | Descrição | Interesse no sistema |
| ----------- | --------- | -------------------- |

## 2. Requisitos Funcionais

<p align = "justify">
Seção a ser preenchida na próxima etapa, consolidando os requisitos elicitados na pesquisa (ALO, CAL, SAL e PRF) e no brainstorm (BS01 a BS14) em um esquema único, com priorização MoSCoW.
</p>

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |

## 3. Requisitos Não Funcionais

<p align = "justify">
Seção a ser preenchida na próxima etapa, contemplando desempenho, segurança e proteção de dados de menores de idade, usabilidade, disponibilidade e compatibilidade.
</p>

| ID | Categoria | Descrição | Prioridade |
| -- | --------- | --------- | ---------- |

## 4. Regras de Negócio

<p align = "justify">
Seção a ser preenchida na próxima etapa, formalizando as restrições descritas em prosa na pesquisa e nos fluxos alternativos dos Casos de Uso, como a antecedência mínima de 12 horas, as janelas de descanso e recuperação e os bloqueios por manutenção ou avaliação técnica.
</p>

| ID | Descrição | Requisito(s) relacionado(s) |
| -- | --------- | --------------------------- |

## 5. Matriz de Rastreabilidade

<p align = "justify">
Seção a ser preenchida na próxima etapa, relacionando cada requisito funcional ao Caso de Uso que o realiza, às regras de negócio aplicáveis e à tela correspondente do Protótipo de Baixa Fidelidade.
</p>

| Requisito | Caso de Uso | Regra(s) de Negócio | Tela do Protótipo |
| --------- | ----------- | ------------------- | ----------------- |
