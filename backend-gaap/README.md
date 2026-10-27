# Backend GAAP

Aplicação Django do GAAP, separada da documentação do projeto. O SQLite é o banco
de dados usado no desenvolvimento; não é o nome do backend.

## Estrutura do Projeto

```text
backend-gaap/
├── app/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py         # Modelos do domínio GAAP
│   ├── urls.py           # Rotas da aplicação
│   └── views.py
├── project/
│   ├── settings.py       # Configurações do Django
│   ├── urls.py           # Roteamento raiz
│   ├── wsgi.py
│   └── asgi.py
├── db.sqlite3            # Banco de dados SQLite
├── manage.py
└── requirements.txt
```

## Como executar no Windows

Abra o terminal na raiz do repositório e execute:

```powershell
python -m venv backend-gaap\.venv
.\backend-gaap\.venv\Scripts\Activate.ps1
Set-Location backend-gaap
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Abra o painel em [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/).

Para acessar o admin, crie um usuário com `python manage.py createsuperuser`.

## Como executar no Linux/macOS

Na raiz do repositório:

```bash
python -m venv backend-gaap/.venv
source backend-gaap/.venv/bin/activate
cd backend-gaap
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Os modelos do domínio GAAP são criados no banco pelas migrações e ficam disponíveis
no painel administrativo.

## API REST

A API usa autenticação. Crie um usuário do Django para testes com
`python manage.py createsuperuser`. No Postman, configure **Authorization >
Basic Auth** com o usuário e a senha desse superusuário. Na interface navegável
do DRF, entre em `http://127.0.0.1:8000/api-auth/login/`.

Todos os recursos abaixo aceitam `GET` na coleção para listar e `POST` para
cadastrar. O endereço de um item, com seu ID (por exemplo,
`/api/servicos/1/`), aceita `GET`, `PUT`, `PATCH` e `DELETE`. Os IDs usados nas
relações precisam existir.

| Recurso | Coleção |
|---|---|
| Administradores | `/api/administradores/` |
| Profissionais | `/api/profissionais/` |
| Alunos | `/api/alunos/` |
| Serviços | `/api/servicos/` |
| Espaços | `/api/espacos/` |
| Agendamentos | `/api/agendamentos/` |
| Bloqueios de agenda | `/api/bloqueios-agenda/` |
| Relatórios de treino | `/api/relatorios-treino/` |

Para criar um agendamento, envie os IDs de um ou mais alunos, do profissional,
do espaço e do serviço, além das datas em formato ISO 8601:

```json
{
  "data_hora_inicio": "2026-11-02T10:00:00-03:00",
  "data_hora_fim": "2026-11-02T11:00:00-03:00",
  "profissional": 1,
  "alunos": [1],
  "espaco": 1,
  "servico": 1
}
```

O status de um agendamento novo é `AGENDADO`. A API rejeita horários invertidos,
conflitos de horário e agendamentos que excedam a capacidade do espaço. Para
cadastrar administradores, profissionais e alunos, envie os campos específicos
do modelo e `senha` (a senha é armazenada como hash e nunca devolvida na resposta).

Como alunos e relatórios contêm informações pessoais e médicas, mantenha a API
autenticada e não a publique com dados reais sem configurar permissões por perfil
e HTTPS.
