# GAAP — Frontend (Gestão de Atletas de Alta Performance)

Aplicação web desenvolvida em **React puro com Vite** e estilizada com **CSS moderno**, totalmente desvinculada do backend e integrada à API REST Django do GAAP.

---

## 💻 Guia Rápido: Como Rodar na Máquina da Faculdade

Siga este passo a passo para rodar tanto o **Backend (Django)** quanto o **Frontend (React)** a partir do zero na máquina do laboratório.

---

### 1. Pré-Requisitos Necessários na Máquina
Certifique-se de que a máquina possui instalados:
* **Python 3.10+** (verifique com `python --version`)
* **Node.js 18+ e npm** (verifique com `node -v` e `npm -v`)
* **Git** (verifique com `git --version`)

---

### 2. Passo a Passo do Backend (Terminal 1)

1. Abra o terminal (PowerShell ou Prompt de Comando) e entre na pasta do backend:
   ```powershell
   cd backend-gaap
   ```

2. Crie e ative o ambiente virtual:
   ```powershell
   # Criar o ambiente virtual (se ainda não existir)
   python -m venv .venv

   # Ativar no Windows (PowerShell):
   .\.venv\Scripts\Activate.ps1
   ```
   > 💡 **Nota sobre permissão no PowerShell:** Se aparecer erro de script bloqueado, execute:
   > `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` e tente ativar novamente.

3. Instale as dependências:
   ```powershell
   pip install -r requirements.txt
   ```

4. Aplique as migrações do banco de dados:
   ```powershell
   python manage.py migrate
   ```


5. Inicie o servidor Django:
   ```powershell
   python manage.py runserver
   ```
   ✅ O backend estará rodando em: `http://127.0.0.1:8000/`

---

### 3. Passo a Passo do Frontend (Terminal 2)

1. Abra um **novo terminal** e acesse a pasta do frontend:
   ```powershell
   cd frontend-gaap
   ```

2. Instale as dependências do Node (necessário apenas na primeira vez após clonar):
   ```powershell
   npm install
   ```

3. Inicie o servidor do React com Vite:
   ```powershell
   npm run dev
   ```

4. Abra o navegador no endereço exibido:
   👉 **http://localhost:5173**

---

### 4. Como Conectar o Frontend com a API

1. Ao abrir o frontend, clique no botão **"Credenciais"** (no canto superior direito) ou em **"Configurar API"** (no menu lateral).
2. Informe o **Usuário** e a **Senha** do Django que você criou (ex: `admin` e `admin123`).
3. Clique em **Salvar e Conectar**.
4. O indicador no rodapé da barra lateral ficará verde: **"API Conectada"**.

---

## 🎯 Roteiro Sugerido para Apresentação ao Professor

Para demonstrar as principais regras de negócio exigidas no projeto:

1. **Dashboard & Métricas**:
   - Mostre os contadores em tempo real e a lista das próximas sessões.
   - Mostre a detecção automática do status do backend.

2. **Cadastro de Atleta e Profissional**:
   - Vá em **Alunos / Atletas** e cadastre um novo atleta com restrição médica (ex: "Recuperação de lesão no joelho").
   - Vá em **Profissionais** e mostre as especialidades integradas (*Treinador, Fisioterapeuta, Nutricionista, Psicólogo*).

3. **Novo Agendamento Inteligente**:
   - Clique em **Novo Agendamento**.
   - Mostre que ao escolher o serviço (ex: Fisioterapia), o sistema **calcula automaticamente o horário de término**.
   - Mostre a validação de **Capacidade da Sala**: tente colocar mais alunos do que a capacidade do espaço e aponte o alerta visual em tempo real.
   - Confirme o agendamento e mostre que ele aparece na **Grade de Agendamentos**.

4. **Validação de Conflito de Horário (*Double-Booking*)**:
   - Tente criar outro agendamento no mesmo horário para o mesmo profissional ou mesmo espaço.
   - Mostre que a API rejeita com a mensagem de conflito de agenda.

5. **Finalização e Relatório Pós-Sessão**:
   - Na lista de agendamentos, clique em **Concluir**.
   - Em **Relatórios de Treino**, registre a presença (`Presente`/`Falta`), os exercícios realizados e as observações clínicas.

---

## 🛠️ Soluções para Problemas Comuns em Laboratório

* **Erro "Script execution is disabled on this system" no PowerShell:**
  Execute no PowerShell antes de ativar a venv:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```

* **Porta 8000 já em uso:**
  Inicie o backend em outra porta, por exemplo `8001`:
  ```powershell
  python manage.py runserver 8001
  ```
  *(Se mudar a porta, ajuste o target do proxy em `vite.config.js`).*

* **Erro 403 "Invalid username/password":**
  Significa que a senha informada no botão "Credenciais" do frontend está diferente da do banco. Redefina a senha no terminal do backend com:
  ```powershell
  python manage.py changepassword admin
  ```
