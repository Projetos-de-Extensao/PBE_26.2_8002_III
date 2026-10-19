# Aplicação Web Django com SQLite e Django REST Framework

Projeto desenvolvido conforme o roteiro da disciplina **Projeto Back-End (IBM8936)**.

## Estrutura do Projeto

```text
sqlite/
├── app/
│   ├── migrations/
│   ├── admin.py
│   ├── api.py            # ViewSets da API REST
│   ├── api_urls.py       # Rotas do DRF (DefaultRouter)
│   ├── apps.py
│   ├── models.py         # Modelos Produto, Servico e Espaco
│   ├── serializers.py    # Serializer ProdutoSerializer
│   ├── urls.py           # Rotas tradicionais da app
│   └── views.py
├── project/
│   ├── settings.py       # Configurações do Django e DRF
│   ├── urls.py           # Roteamento raiz
│   ├── wsgi.py
│   └── asgi.py
├── db.sqlite3            # Banco de dados SQLite
├── manage.py
└── requirements.txt
```

## Como Executar

1. **Crie e ative o ambiente virtual:**
   ```bash
   python -m venv venv
   # No Windows:
   .\venv\Scripts\activate
   # No Linux/macOS:
   source venv/bin/activate
   ```

2. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Execute as migrações:**
   ```bash
   python manage.py migrate
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   python manage.py runserver
   ```

5. **Acesse no navegador:**
   - Interface da API REST: [http://localhost:8000/api/produtos/](http://localhost:8000/api/produtos/)
   - Painel Administrativo: [http://localhost:8000/admin/](http://localhost:8000/admin/)

Os modelos `Servico` e `Espaco`, do domínio GAAP, são criados no banco SQLite pela migração
e podem ser consultados e cadastrados pelo painel administrativo. Crie um usuário administrador
com `python manage.py createsuperuser` para acessar o painel.
