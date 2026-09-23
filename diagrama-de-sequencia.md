---
id: diagrama_de_sequencia
title: Diagramas de Sequência
---

# Diagramas de Sequência — Backend GAAP

## Introdução

<p align="justify">
Os Diagramas de Sequência modelam o comportamento dinâmico e a troca de mensagens entre os atores, controladores, serviços de domínio e a camada de persistência para os dois fluxos mais críticos do sistema <b>GAAP</b> exigidos no escopo da disciplina:
</p>

1. **Caso 1: Confirmar Agendamento de Sessão** (Validação de conflitos, bloqueios e capacidade).
2. **Caso 2: Finalizar Relatório de Treino** (Validação de autoria, registro de presença e encerramento).

---

## 1. Diagrama de Sequência 1 — Confirmar Agendamento

### Descrição do Fluxo
O usuário solicita a marcação de uma sessão. O controlador de agendamento valida simultaneamente:
1. Se o profissional possui especialidade para o serviço.
2. Se o profissional já possui outro agendamento no horário (*double-booking*).
3. Se a sala possui bloqueio ativo ou se excederá a capacidade máxima.
4. Se o aluno não possui outro agendamento simultâneo.
Sendo todas as condições válidas, a sessão é persistida atomicamente.

```plantuml
@startuml
title Diagrama de Sequencia 1 - Confirmar Agendamento
autonumber
actor "Usuario / Aluno" as User
boundary "API Gateway / View" as API
control "AgendamentoService" as Service
entity "BloqueioRepository" as BlockRepo
entity "AgendamentoRepository" as SchedRepo
entity "EspacoRepository" as RoomRepo
database "Banco de Dados" as DB

User -> API : POST /api/agendamentos/ (aluno_id, prof_id, sala_id, servico_id, data_hora)
activate API

API -> Service : criar_agendamento(dados)
activate Service

Service -> BlockRepo : verificar_bloqueios(prof_id, sala_id, data_hora)
activate BlockRepo
BlockRepo --> Service : sem_bloqueios
deactivate BlockRepo

Service -> SchedRepo : verificar_conflito_profissional(prof_id, data_hora)
activate SchedRepo
SchedRepo --> Service : profissional_disponivel
deactivate SchedRepo

Service -> RoomRepo : verificar_capacidade_disponivel(sala_id, data_hora)
activate RoomRepo
RoomRepo --> Service : capacidade_ok (vagas > 0)
deactivate RoomRepo

Service -> SchedRepo : salvar_agendamento(novo_agendamento)
activate SchedRepo
SchedRepo -> DB : INSERT INTO agendamento (...) [Transacao Atomica]
activate DB
DB --> SchedRepo : agendamento_salvo (id=123)
deactivate DB
SchedRepo --> Service : AgendamentoConfirmado
deactivate SchedRepo

Service --> API : Sucesso (Agendamento Criado)
deactivate Service

API --> User : HTTP 201 Created (JSON dados do agendamento)
deactivate API

@enduml
```

---

## 2. Diagrama de Sequência 2 — Finalizar Relatório de Treino

### Descrição do Fluxo
O Treinador ou Profissional de Saúde acessa a sessão realizada, informa a presença/falta do aluno, descreve as atividades e observações técnicas e finaliza o relatório de treino.

```plantuml
@startuml
title Diagrama de Sequencia 2 - Finalizar Relatorio de Treino
autonumber
actor "Profissional / Treinador" as Coach
boundary "API Gateway / View" as API
control "RelatorioService" as Service
entity "AgendamentoRepository" as SchedRepo
entity "RelatorioRepository" as ReportRepo
database "Banco de Dados" as DB

Coach -> API : POST /api/agendamentos/{id}/finalizar-relatorio/ (presenca, atividades, obs)
activate API

API -> Service : finalizar_relatorio(agendamento_id, usuario_autenticado, dados)
activate Service

Service -> SchedRepo : obter_agendamento_por_id(id)
activate SchedRepo
SchedRepo --> Service : agendamento_instancia
deactivate SchedRepo

Service -> Service : validar_permissao(usuario, agendamento)

Service -> ReportRepo : criar_relatorio(agendamento, presenca, atividades, obs)
activate ReportRepo
ReportRepo -> DB : INSERT INTO relatorio_treino (...)
activate DB
DB --> ReportRepo : relatorio_salvo
deactivate DB

ReportRepo -> SchedRepo : atualizar_status(agendamento_id, "REALIZADO")
activate SchedRepo
SchedRepo -> DB : UPDATE agendamento SET status = 'REALIZADO'
activate DB
DB --> SchedRepo : status_atualizado
deactivate DB
SchedRepo --> ReportRepo : ok
deactivate SchedRepo

ReportRepo --> Service : RelatorioFinalizado
deactivate ReportRepo

Service --> API : Sucesso (Relatorio Concluido)
deactivate Service

API --> Coach : HTTP 200 OK (JSON relatorio finalizado)
deactivate API

@enduml
```

---

## 3. Conclusão

<p align="justify">
Os diagramas de sequência detalham o ciclo de validações e persistência transacional dos dois fluxos nucleares do GAAP, garantindo aderência estrita aos critérios de aceitação e aos requisitos não funcionais de integridade e segurança.
</p>

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Versão inicial | Grupo 3 |
| 2026.2 | 2.0 | Elaboração dos diagramas oficiais do Backend GAAP (Confirmar Agendamento e Finalizar Relatório) | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
