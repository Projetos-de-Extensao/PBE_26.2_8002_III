---
id: metodologia
title: Metodologia
---

# Metodologia de Desenvolvimento — Backend GAAP

## 1. Introdução

<p align="justify">
A metodologia do projeto GAAP combina o rigor arquitetural do <b>Processo Unificado (RUP / UP)</b> com a flexibilidade operacional de práticas ágeis baseadas em <b>Kanban</b> e <b>Programação Orientada a Objetos (POO)</b>, conforme preconizado na disciplina de Projeto Back-End (IBM8936) do Ibmec.
</p>

---

## 2. Abordagens e Práticas Adotadas

### 2.1. RUP / Processo Unificado (UP)
O ciclo de vida do projeto é estruturado em quatro fases sequenciais e iterativas:

1. **Iniciação (Inception)**: Definição do escopo, visão do produto, stakeholders, 5W2H, brainstorm e protótipo conceitual.
2. **Elaboração (Elaboration)**: Detalhamento de requisitos (RF/RNF), regras de negócio, casos de uso prioritários e modelagem UML (Diagramas de Classes e Sequência).
3. **Construção (Construction)**: Implementação iterativa do backend em Python/Django, migrações de banco de dados, regras de negócio e testes automatizados.
4. **Transição (Transition)**: Homologação, validação de endpoints, documentação final e entrega do produto.

### 2.2. Programação Orientada a Objetos (POO)
* Modelagem de entidades do domínio (*Usuario, Profissional, Aluno, Servico, Espaco, Agendamento, RelatorioTreino*).
* Encapsulamento de regras de validação contra conflitos de agenda e respeito à capacidade de salas.

### 2.3. Gestão Ágil com Kanban (GitHub Projects)
O fluxo de trabalho da equipe é gerenciado por meio de um quadro Kanban com as colunas:
* **Backlog**: Tarefas e requisitos mapeados.
* **Pronto para Desenvolvimento**: Issues priorizadas para a iteração.
* **Em Andamento**: Tarefas em implementação ativa.
* **Em Revisão / PR**: Código em processo de code review via Pull Request.
* **Em Teste**: Validação de testes automatizados e integração contínua.
* **Concluído**: Funcionalidades integradas à branch principal.

---

## 3. Ferramental e Governança

* **Versionamento**: Git com fluxo de *feature branches* e *Pull Requests* obrigatórios.
* **Backend**: Python 3.11+ e Django / Django REST Framework.
* **Documentação**: MkDocs Material com suporte a diagramas PlantUML.

---

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Criação inicial da metodologia | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
| 2026.2 | 2.0 | Alinhamento com as diretrizes do RUP/UP e do projeto GAAP | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
