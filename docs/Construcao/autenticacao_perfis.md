# Autenticação e Perfis de Acesso

## Objetivo
Cada pessoa entra no GAAP com o próprio e-mail e senha e vê **somente o que o seu papel permite**. O sistema reconhece cinco perfis: Administrador, Responsável, Treinador, Profissional de Saúde e Aluno.

## 1) Como o login funciona
- O login usa o **token do Django REST Framework**: `POST /api/token/` com `username` (o e-mail) e `password` devolve um token.
- O frontend guarda o token e o envia em toda requisição no cabeçalho `Authorization: Token <token>`.
- Logo após o login, o frontend chama `GET /api/me/`, que informa o perfil de quem entrou. É esse perfil que define o menu e os botões exibidos.
- No backend, cada pessoa do domínio (`Responsavel`, `Profissional`, `Aluno`) fica ligada à sua conta de login pelo **e-mail**. O módulo `app/perfis.py` faz essa ligação, e todas as permissões o consultam.

!!! note "A regra vale na API, não só na tela"
    O frontend apenas esconde o que o perfil não pode usar. Quem garante a regra é o backend: uma chamada direta à API (pelo Swagger, por exemplo) recebe `403` ou uma lista filtrada.

## 2) Matriz de permissões

| Perfil | O que vê | O que pode fazer |
| --- | --- | --- |
| **Administrador** (equipe) | Tudo | Tudo, inclusive aprovar cadastros de profissionais |
| **Responsável** (responsável legal do aluno menor de idade) | Os próprios dependentes e os agendamentos deles | Cadastrar dependentes (que viram alunos da instituição) e agendar para eles |
| **Treinador** e **Profissional de Saúde** | Os agendamentos em que é o profissional e os alunos atendidos neles, com observações médicas | Marcar o próprio agendamento como `REALIZADO`, registrar e editar o relatório de treino dos seus agendamentos e bloquear a própria agenda |
| **Aluno** | Os próprios agendamentos, os relatórios de treino dele e os próprios dados | Apenas consultar |

Serviços e espaços podem ser consultados por qualquer usuário logado; só a equipe os altera.

## 3) Como cada perfil ganha acesso

| Perfil | Cadastro | Quando pode entrar |
| --- | --- | --- |
| Administrador | `python manage.py createsuperuser` | Imediatamente |
| Responsável | Tela de login → **Criar Conta** → **Responsável** | Imediatamente |
| Treinador / Profissional de Saúde | Tela de login → **Criar Conta** → **Profissional**, informando especialidade e registro (CREF, CREFITO, CRN, CRP) | Só depois que o administrador **aprovar** o cadastro |
| Aluno | O responsável (ou a equipe) cadastra o aluno e define uma senha opcional | Imediatamente, se recebeu senha |

!!! warning "Por que o profissional precisa de aprovação"
    Treinadores e profissionais de saúde veem as observações médicas dos alunos. Com cadastro aberto, qualquer pessoa poderia se passar por profissional. Por isso a conta nasce **inativa** e o login responde *"Seu cadastro está aguardando a aprovação do administrador"* até a aprovação.

O administrador aprova de três formas equivalentes:

1. No frontend, em **Profissionais**, botão **Aprovar**.
2. No Django Admin, em **Profissionals**, ação **Aprovar cadastros selecionados**.
3. Pela API: `POST /api/profissionais/{id}/aprovar/`.

Desativar uma pessoa (campo `ativo`) também bloqueia o login dela.

## 4) Bloqueio de agenda
O profissional pode bloquear a **própria** agenda (congresso, férias, consulta externa). Durante o bloqueio, nenhum agendamento novo é aceito para ele: a API responde `400` com *"O profissional ou o espaço está com a agenda bloqueada nesse horário."* Bloqueios de espaços continuam com a equipe.

## 5) Endpoints de autenticação

| Método | Rota | Quem usa | Para quê |
| --- | --- | --- | --- |
| `POST` | `/api/token/` | Todos | Gerar o token de acesso |
| `GET` | `/api/me/` | Usuário logado | Saber o perfil, o nome e o id de quem está logado |
| `POST` | `/api/responsaveis/cadastro/` | Público | Criar conta de responsável |
| `POST` | `/api/profissionais/cadastro/` | Público | Pedir conta de treinador ou profissional de saúde |
| `POST` | `/api/profissionais/{id}/aprovar/` | Administrador | Aprovar o cadastro e liberar o login |

A documentação completa e interativa de todas as rotas está no Swagger, em `http://127.0.0.1:8000/api/docs/`.

## 6) Testes automatizados
A classe `PerfisDeAcessoApiTest`, em `backend-gaap/app/tests.py`, cobre os cenários acima: o perfil devolvido por `/api/me/`, o cadastro pendente e a aprovação, o login do aluno, o que cada perfil vê, a conclusão e o relatório feitos pelo profissional e o bloqueio de agenda. Para rodar todos os testes:

```bash
cd backend-gaap
python manage.py test app
```
