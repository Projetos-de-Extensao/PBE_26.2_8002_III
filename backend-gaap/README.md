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
