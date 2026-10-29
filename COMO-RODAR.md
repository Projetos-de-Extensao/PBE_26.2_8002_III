# Como rodar o GAAP (backend + frontend)

Guia rápido para rodar o projeto no PC do laboratório (Windows / PowerShell).

São **dois repositórios** e **dois terminais** rodando ao mesmo tempo:

| Parte    | Repositório                                                   | Endereço                |
|----------|---------------------------------------------------------------|-------------------------|
| Backend  | `Projetos-de-Extensao/PBE_26.2_8002_III`                      | http://127.0.0.1:8000   |
| Frontend | `Arthur-Calebe/Frontend-gaap`                                 | http://localhost:5173   |

Links úteis com o backend rodando:

- **Documentação da API (Swagger):** http://127.0.0.1:8000/api/docs/ — clique em **Authorize → basicAuth** para testar as rotas
- **Contrato OpenAPI (YAML):** http://127.0.0.1:8000/api/schema/
- **Painel administrativo:** http://127.0.0.1:8000/admin/

---

## 0. Primeira vez na máquina

Teste no terminal:

```powershell
python --version
node -v
```

Se algum der "não reconhecido", instale **só para o seu usuário** (não precisa de admin):

```powershell
winget install -e --id Python.Python.3.13 --scope user
winget install -e --id OpenJS.NodeJS.LTS --scope user
```

Depois **feche e reabra o VS Code**.

Clone os dois repositórios (em pastas separadas):

```powershell
git clone https://github.com/Projetos-de-Extensao/PBE_26.2_8002_III.git
git clone https://github.com/Arthur-Calebe/Frontend-gaap.git
```

---

## 1. Terminal 1 — Backend (Django)

Na **raiz** do repositório `PBE_26.2_8002_III`:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
python -m venv .venv                  # só na primeira vez
.\.venv\Scripts\Activate.ps1          # tem que aparecer (.venv) no início da linha
pip install -r requirements.txt       # só na primeira vez ou após git pull
cd backend-gaap
python manage.py migrate
python manage.py runserver
```

✅ Deve aparecer `Starting development server at http://127.0.0.1:8000/`.

**Deixe esse terminal quieto.** Não digite nada nele nem use Ctrl+C, senão o backend cai.

---

## 2. Terminal 2 — Frontend (React + Vite)

Abra um **terminal novo** (botão **+** no painel do terminal) e vá para a pasta `Frontend-gaap`:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install                           # só na primeira vez
npm run dev
```

✅ Deve aparecer `Local: http://localhost:5173/`.

**Também deixe esse terminal quieto.**

---

## 3. Conectar no navegador

1. Abra **http://localhost:5173**
2. Clique em **Credenciais** (canto superior direito)
3. Usuário: `PBGRUPO3`, senha: peça ao grupo
4. **Salvar e Conectar**
5. O rodapé da barra lateral deve ficar verde: **API Conectada**

As credenciais ficam salvas só no navegador. Em outro PC, repita este passo.

---

## Problemas comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `running scripts is disabled on this system` | PowerShell bloqueia scripts | `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` |
| `Python was not found` / `node não reconhecido` | Não instalado ou VS Code não reaberto | Passo 0 e reabrir o VS Code |
| `Couldn't import Django` | `.venv` não ativado | `.\.venv\Scripts\Activate.ps1` |
| `can't open file ... manage.py` | Pasta errada | `cd backend-gaap` |
| `Could not read package.json` | Rodou `npm` na pasta do backend | Vá para a pasta `Frontend-gaap` |
| `localhost refused to connect` (porta 5173) | Front parou | `npm run dev` no terminal 2 |
| Front mostra **"Backend Django Desconectado"** | Django parou | `python manage.py runserver` no terminal 1 (com `.venv` ativo) |
| Front mostra **credenciais inválidas** / 403 | Senha errada | `python manage.py changepassword PBGRUPO3` |

---

## Antes de fazer commit

- Não suba o `.venv` nem o `node_modules` (já estão no `.gitignore`).
- Cuidado com o `db.sqlite3`: se não quiser sobrescrever o banco do grupo, rode `git restore backend-gaap/db.sqlite3` antes do `git add`.
- Instalou pacote novo? Atualize as dependências na raiz: `pip freeze > requirements.txt`.
