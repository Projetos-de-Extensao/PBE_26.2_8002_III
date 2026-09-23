---
id: diagrama_de_classes
title: Diagrama de Classes
---

# Diagrama de Classes do Domínio — Backend GAAP

## 1. Descrição e Finalidade

<p align="justify">
O Diagrama de Classes representa a estrutura conceitual e orientada a objetos do sistema <b>GAAP (Gestão de Atletas de Alta Performance)</b>. Ele define as entidades fundamentais do domínio, seus atributos essenciais, métodos e os relacionamentos de associação, agregação e herança que fundamentam a modelagem do banco de dados relacional e a camada de persistência com o Django ORM.
</p>

---

## 2. Diagrama de Classes em PlantUML

```plantuml
@startuml
title Diagrama de Classes do Dominio - Backend GAAP
skinparam classAttributeIconSize 0

enum TipoPerfil {
  ADMINISTRADOR
  TREINADOR
  PROFISSIONAL_SAUDE
  ALUNO
}

enum TipoServico {
  TREINO
  FISIOTERAPIA
  PSICOLOGIA
  NUTRICAO
}

enum StatusAgendamento {
  AGENDADO
  REALIZADO
  CANCELADO
  BLOQUEADO
}

class Usuario {
  - id: int
  - nome: String
  - email: String
  - senha_hash: String
  - telefone: String
  - perfil: TipoPerfil
  - ativo: boolean
  + autenticar(senha): boolean
  + alterar_senha(nova_senha): void
}

class Administrador {
  - setor: String
  + cadastrar_usuario(): Usuario
  + aplicar_bloqueio(): BloqueioAgenda
  + configurar_sala(): Espaco
  + configurar_servico(): Servico
}

class Profissional {
  - registro_profissional: String
  - especialidade: TipoServico
  + consultar_agenda(): List<Agendamento>
  + registrar_presenca(agendamento_id, presenca): void
  + finalizar_relatorio(agendamento_id, dados): RelatorioTreino
}

class Aluno {
  - matricula: String
  - data_nascimento: Date
  - observacoes_medicas: String
  + consultar_agenda(): List<Agendamento>
  + solicitar_agendamento(): Agendamento
}

class Servico {
  - id: int
  - nome: TipoServico
  - duracao_minutos: int
  - ativo: boolean
  + obter_duracao(): int
}

class Espaco {
  - id: int
  - nome: String
  - capacidade_maxima: int
  - localizacao: String
  - ativo: boolean
  + verificar_capacidade(qtd_alunos): boolean
}

class Agendamento {
  - id: int
  - data_hora_inicio: DateTime
  - data_hora_fim: DateTime
  - status: StatusAgendamento
  + validar_conflito(): boolean
  + confirmar(): void
  + cancelar(): void
}

class BloqueioAgenda {
  - id: int
  - data_hora_inicio: DateTime
  - data_hora_fim: DateTime
  - motivo: String
  + verificar_intersecao(inicio, fim): boolean
}

class RelatorioTreino {
  - id: int
  - presenca: boolean
  - atividades_realizadas: String
  - observacoes_tecnicas: String
  - data_finalizacao: DateTime
  + preencher_relatorio(): void
}

Usuario <|-- Administrador
Usuario <|-- Profissional
Usuario <|-- Aluno

Profissional "1" -- "*" Agendamento : conduz >
Aluno "1..*" -- "*" Agendamento : participa >
Espaco "1" -- "*" Agendamento : alocado_em >
Servico "1" -- "*" Agendamento : refere-se_a >

Profissional "0..1" -- "*" BloqueioAgenda : aplica-se_a >
Espaco "0..1" -- "*" BloqueioAgenda : bloqueia >

Agendamento "1" -- "0..1" RelatorioTreino : gera >
@enduml
```

---

## 3. Principais Entidades e Responsabilidades

| Classe | Descrição |
| :--- | :--- |
| **Usuario** | Entidade base com autenticação, perfis de acesso e dados cadastrais unificados. |
| **Administrador** | Herda de `Usuario`; gerencia cadastros de base, serviços, salas e bloqueios de agenda. |
| **Profissional** | Herda de `Usuario`; representa treinadores e profissionais de saúde vinculados a sua especialidade. |
| **Aluno** | Herda de `Usuario`; representa o atleta atendido nas sessões esportivas e clínicas. |
| **Servico** | Define as modalidades atendidas (*Treino, Fisioterapia, Psicologia, Nutrição*) e durações padrão. |
| **Espaco** *(Sala)* | Ambientes físicos com controle de capacidade máxima e disponibilidade. |
| **Agendamento** | Orquestra a sessão conectando Aluno, Profissional, Sala, Serviço e horário. |
| **BloqueioAgenda** | Registra períodos de indisponibilidade programada de profissionais ou ambientes. |
| **RelatorioTreino** | Registra confirmação de presença e observações técnicas pós-atendimento. |

---

## 4. Relacionamentos e Cardinalidades

* Um **Profissional** pode conduzir múltiplos **Agendamentos** (1 para N), mas não pode ter choque no mesmo horário.
* Um ou mais **Alunos** podem participar de um **Agendamento** (1..* para N), limitado pela capacidade do **Espaco**.
* Um **Espaco** pode receber múltiplos **Agendamentos** (1 para N) em horários distintos.
* Um **Agendamento** possui no máximo um **RelatorioTreino** (1 para 0..1), gerado após a realização da sessão.
* Um **BloqueioAgenda** pode ser associado especificamente a um **Profissional** ou a um **Espaco**.

---

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| :--- | :---: | :--- | :--- |
| 2026.2 | 1.0 | Versão inicial | Grupo 3 |
| 2026.2 | 2.0 | Reestruturação completa da modelagem OO para o Backend GAAP | Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf |
