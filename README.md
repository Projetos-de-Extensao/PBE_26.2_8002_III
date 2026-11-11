# GAAP — Gestão de Atletas de Alta Performance

👉 Para rodar o projeto completo (Backend + Frontend) passo a passo, veja [COMO-RODAR.md](COMO-RODAR.md).

**Disciplina**: Projeto Back-End (IBM8936) — Ibmec 2026.2  
**Equipe**: Grupo 3 (Arthur Calebe, Antonio Reuther, Pedro Henrique Becker e Breno Huf)

---

## Sobre o Projeto

O **GAAP (Gestão de Atletas de Alta Performance)** é uma solução completa desenvolvida para centralizar e orquestrar a operação de centros de treinamento esportivo de alto rendimento. O sistema gerencia horários, profissionais multidisciplinares, alunos e espaços físicos para quatro modalidades integradas:

* **Treino** (Físico e Técnico)
* **Fisioterapia**
* **Psicologia Esportiva**
* **Nutrição**

A plataforma conta com backend robusto em Django REST Framework com validação de conflitos em tempo real (*double-booking*), controle de capacidade de salas, gestão de bloqueios de agenda e registro de relatórios técnicos pós-sessão, além de frontend moderno e intuitivo em React (Vite).

Responsáveis podem criar uma conta com nome, e-mail e senha, cadastrar e vincular seus alunos e agendar sessões para eles. Alunos menores não criam nem alteram agendamentos.

---

## Tecnologias Utilizadas

* **Linguagem Back-End**: Python 3.11+
* **Framework Back-End**: Django & Django REST Framework
* **Front-End**: React, Vite, Lucide Icons e CSS puro responsivo
* **Banco de Dados**: Relacional (SQLite em desenvolvimento / PostgreSQL em produção)
* **Documentação da API**: OpenAPI / Swagger (`/api/docs/`)
* **Documentação do Projeto**: MkDocs com tema Material e suporte a PlantUML
* **Metodologia**: RUP/UP e Kanban via GitHub Projects

---

## Estrutura do Repositório (Monorepo)

* [`backend-gaap/`](./backend-gaap/) — Aplicação Django (API REST, autenticação e regras de domínio).
* [`frontend-gaap/`](./frontend-gaap/) — Interface em React com painéis de gestão, agendamento e relatórios.
* [`docs/`](./docs/) — Documentação completa do projeto e artefatos de análise.
* [`COMO-RODAR.md`](./COMO-RODAR.md) — Guia detalhado de execução local para o laboratório.

---

## Como Executar o Projeto Completo

Acesse o guia rápido [COMO-RODAR.md](COMO-RODAR.md). Em resumo, utilize dois terminais no VS Code:

- **Terminal 1 (Backend):** 
  ```powershell
  cd backend-gaap
  python manage.py runserver
  ```
- **Terminal 2 (Frontend):** 
  ```powershell
  cd frontend-gaap
  npm run dev
  ```

---

## Como Executar a Documentação MkDocs Localmente

1. Crie e ative o ambiente virtual:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

2. Instale as dependências:
   ```powershell
   pip install -r requirements.txt
   ```

3. Inicie o servidor do MkDocs:
   ```powershell
   python -X utf8 -m mkdocs serve
   ```

4. Acesse a documentação em: `http://127.0.0.1:8000`
