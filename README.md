# GAAP — Gestão de Atletas de Alta Performance

**Disciplina**: Projeto Back-End (IBM8936) — Ibmec 2026.2  
**Equipe**: Grupo 3 (Arthur Calebe, Antonio Reuter, Pedro Henrique Becker e Breno Huf)

---

## Sobre o Projeto

O **GAAP (Gestão de Atletas de Alta Performance)** é uma solução de backend e API REST desenvolvida em Python/Django para centralizar e orquestrar a operação de escolas e centros de treinamento esportivo. O sistema gerencia horários, profissionais, alunos e espaços físicos para quatro modalidades integradas:

* **Treino** (Físico e Técnico)
* **Fisioterapia**
* **Psicologia Esportiva**
* **Nutrição**

A plataforma garante validação de conflitos em tempo real (*double-booking*), controle estrito de capacidade de salas, gestão de bloqueios de agenda e registro de presenças e relatórios técnicos pós-sessão.

---

## Tecnologias Utilizadas

* **Linguagem**: Python 3.11+
* **Framework Backend**: Django / Django REST Framework
* **Banco de Dados**: Relacional (SQLite em desenvolvimento / PostgreSQL em produção)
* **Documentação**: MkDocs com tema Material e suporte a PlantUML
* **Metodologia**: RUP/UP e Kanban via GitHub Projects

---

## Como Executar a Documentação Localmente

1. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   # No Windows:
   .\venv\Scripts\activate
   # No Linux/Mac:
   source venv/bin/activate
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Inicie o servidor do MkDocs:
   ```bash
   mkdocs serve
   ```

4. Acesse a documentação em seu navegador no endereço: `http://127.0.0.1:8000`


