---
id: diagrama_de_casos de uso
title: Diagrama de Casos de Uso
---

## Casos de Uso

### Descrição:

- Contas
	- Criação
	- Entrada
	- Alteração
	- Recuperar Senha
	- Visualização

- Responsáveis
	- Cadastro de dependentes
	- Agendamento de treinos
	- Cancelamento e reagendamento
	- Visualização de calendário e fila de espera

- Professores
	- Cadastro e atualização de disponibilidade
	- Registro de desempenho pós-treino
	- Visualização da agenda

- Salas e equipamentos
	- Cadastro de ambientes
	- Definição de capacidade e uso
	- Bloqueio por manutenção ou avaliação

- Treinos
	- Agendamento
	- Validação de conflitos
	- Definição de descanso e recuperação
	- Controle de intensidade semanal

### UC-01 - Cadastro de responsável no sistema

* Atores:

	- Responsável
	- Sistema

- Pré-Condições:
	- Nenhuma

* Fluxo Básico:
    1. Responsável informa nome, e-mail, senha e dados de cadastro
    2. Sistema valida os dados informados
    3. Sistema verifica se o e-mail ainda não está em uso
    4. Sistema criptografa a senha e salva os dados do responsável
    5. Sistema envia e-mail de confirmação para o responsável
    6. Responsável confirma o cadastro
    7. Sistema registra o usuário como ativo
    8. Sistema redireciona o responsável para o painel inicial

- Fluxos Alternativos:
	- 2a. E-mail informado é inválido
		- 2a1. Sistema exibe mensagem de erro
	- 2b. Senha não atende aos critérios de segurança
		- 2b1. Sistema exibe mensagem de erro
	- 5a. E-mail de confirmação não é recebido
		- 5a1. Sistema oferece opção para reenviar o link de confirmação

### UC-02 - Entrada do responsável no sistema

- Atores:
	- Responsável
	- Sistema

- Pré-Condições:
	- Responsável deve estar cadastrado e ativo

- Fluxo Básico:
    - 1. Responsável informa e-mail e senha
	- 2. Sistema autentica as credenciais
	- 3. Sistema valida a sessão do usuário
	- 4. Sistema redireciona o responsável para o painel inicial

- Fluxos Alternativos:
	- 2a. Dados informados são inválidos
		- 2a1. Sistema exibe mensagem de erro
	- 2b. Usuário esqueceu a senha
		- 2b1. Sistema envia instruções para recuperação da conta

### UC-03 - Cadastro de atleta vinculado ao responsável

- Atores:
	- Responsável
	- Sistema

- Pré-Condições:
	- Responsável deve estar autenticado

- Fluxo Básico:
    - 1. Responsável seleciona a opção “Cadastrar aluno”
	- 2. Sistema solicita nome, idade, nível de desenvolvimento e informações básicas do atleta
	- 3. Responsável informa os dados do jovem atleta
	- 4. Sistema valida as informações
	- 5. Sistema associa o atleta ao responsável
	- 6. Sistema salva o perfil do atleta no sistema

- Fluxos Alternativos:
	- 4a. Idade fora da faixa permitida
		- 4a1. Sistema informa que o atleta deve estar entre 7 e 12 anos
	- 4b. Dados incompletos
		- 4b1. Sistema impede o cadastro e solicita preenchimento dos campos obrigatórios

### UC-04 - Agendar treino

- Atores:
	- Responsável
	- Sistema
	- Professor
	- Sala

- Pré-Condições:
	- Responsável deve estar autenticado
	- Atleta deve estar cadastrado
	- Professor e sala devem estar disponíveis

- Fluxo Básico:
    - 1. Responsável seleciona o atleta e a opção de agendamento
	- 2. Sistema apresenta o calendário com horários disponíveis
	- 3. Responsável escolhe o tipo de treino, a data, o horário e o professor
	- 4. Sistema valida disponibilidade simultânea de aluno, professor e sala
	- 5. Sistema calcula a janela de descanso e recuperação necessária
	- 6. Sistema confirma o agendamento
	- 7. Sistema exibe o treino na agenda do responsável e do professor

- Fluxos Alternativos:
	- 4a. Há conflito de agenda entre professor e sala
		- 4a1. Sistema bloqueia o agendamento e sugere horários alternativos
	- 5a. Atleta está em período de recuperação
		- 5a1. Sistema impede o agendamento para evitar sobrecarga
	- 6a. Responsável tenta agendar fora do horário permitido
		- 6a1. Sistema exibe mensagem informando a regra de antecedência mínima de 12 horas

### UC-05 - Cancelar ou reagendar treino

- Atores:
	- Responsável
	- Sistema
	- Professor

- Pré-Condições:
	- Treino já deve estar agendado
	- Responsável deve estar autenticado

- Fluxo Básico:
    - 1. Responsável acessa a agenda de treinos
	- 2. Sistema lista os treinamentos cadastrados
	- 3. Responsável seleciona o treino a ser cancelado ou reagendado
	- 4. Sistema verifica a janela de cancelamento permitida
	- 5. Sistema atualiza a agenda do aluno, professor e sala
	- 6. Sistema notifica a fila de espera, se houver vagas disponíveis

- Fluxos Alternativos:
	- 4a. Cancelamento fora do prazo permitido
		- 4a1. Sistema bloqueia a alteração e informa sobre a política de cancelamento
	- 6a. Existe aluno na fila de espera
		- 6a1. Sistema notifica automaticamente o responsável disponível

### UC-06 - Visualizar calendário e rotina do atleta

- Atores:
	- Responsável
	- Sistema

- Pré-Condições:
	- Responsável deve estar autenticado
	- Pelo menos um atleta deve estar vinculado à conta

- Fluxo Básico:
    - 1. Responsável acessa a opção de calendário
	- 2. Sistema exibe a visão parental com os treinos dos filhos
	- 3. Sistema destaca períodos de descanso e horários disponíveis
	- 4. Responsável visualiza o histórico e as próximas atividades

- Fluxos Alternativos:
	- 2a. Usuário solicita visão administrativa
		- 2a1. Sistema alterna para a visão da academia com lotação total
	- 3a. Há horários de pico ou lotação alta
		- 3a1. Sistema sinaliza visualmente os períodos críticos

### UC-07 - Cadastrar e gerenciar professor

- Atores:
	- Administrador
	- Sistema
	- Professor

- Pré-Condições:
	- Usuário deve possuir perfil administrativo

- Fluxo Básico:
    - 1. Administrador acessa o módulo de profissionais
	- 2. Sistema solicita dados do professor, especialidade e faixa etária de domínio
	- 3. Administrador informa a disponibilidade e turnos do profissional
	- 4. Sistema valida a certificação e área de atuação
	- 5. Sistema salva o cadastro do professor
    - 6. Sistema atualiza a agenda e a disponibilidade do professor

- Fluxos Alternativos:
	- 4a. Professor não possui especialização adequada
		- 4a1. Sistema impede o vínculo com a modalidade correspondente
	- 5a. Há conflito de turno
		- 5a1. Sistema informa o bloqueio automático para almoço ou planejamento

### UC-08 - Cadastrar e controlar salas e equipamentos

- Atores:
	- Administrador
	- Sistema

- Pré-Condições:
	- Usuário deve possuir perfil administrativo

- Fluxo Básico:
    - 1. Administrador acessa o módulo de salas
	- 2. Sistema solicita nome, capacidade e descrição do ambiente
	- 3. Administrador informa os equipamentos vinculados
	- 4. Sistema valida a capacidade e a segurança da sala
	- 5. Sistema salva o ambiente e suas restrições
	- 6. Sistema bloqueia a sala em horários de manutenção ou avaliação

- Fluxos Alternativos:
	- 4a. Sala excede a capacidade máxima recomendada
		- 4a1. Sistema apresenta alerta e impede a reserva
	- 6a. Há manutenção programada
		- 6a1. Sistema mantém o ambiente indisponível no calendário

### UC-09 - Registrar desempenho após o treino

- Atores:
	- Professor
	- Sistema
	- Responsável

- Pré-Condições:
	- Treino deve estar concluído ou em andamento
	- Professor deve estar autenticado

- Fluxo Básico:
    - 1. Professor acessa a agenda do dia
	- 2. Sistema exibe os treinos agendados para o professor
	- 3. Professor seleciona o atleta e o treino realizado
	- 4. Sistema solicita indicadores de esforço, fadiga e recuperação
	- 5. Professor informa os dados do desempenho
	- 6. Sistema salva o registro pós-treino
	- 7. Sistema atualiza o histórico do atleta e a recomendação de descanso

- Fluxos Alternativos:
	- 4a. Aluno apresenta fadiga alta
		- 4a1. Sistema sugere descanso ou bloqueio de treino futuro
	- 5a. Professor não preenche todos os campos
		- 5a1. Sistema solicita preenchimento obrigatório antes do envio

### UC-10 - Gerenciar fila de espera

- Atores:
	- Responsável
	- Sistema
	- Professor

- Pré-Condições:
	- Deve existir pelo menos um treino cancelado ou uma vaga disponível

- Fluxo Básico:
    - 1. Sistema identifica cancelamento de treino agendado
	- 2. Sistema verifica a fila de espera
	- 3. Sistema seleciona o próximo aluno conforme a ordem e compatibilidade
	- 4. Sistema notifica o responsável do aluno selecionado
	- 5. Sistema oferece a possibilidade de confirmação imediata

- Fluxos Alternativos:
	- 3a. Nenhum aluno está na fila
		- 3a1. Sistema mantém a vaga disponível para novo agendamento
	- 4a. Responsável não confirma dentro do prazo
		- 4a1. Sistema passa a vaga para o próximo da fila

### UC-11 - Visualizar relatórios e acompanhamento do desenvolvimento

- Atores:
	- Responsável
	- Professor
	- Sistema

- Pré-Condições:
	- Aluno deve ter pelo menos um treino registrado

- Fluxo Básico:
    - 1. Usuário acessa o módulo de relatórios
	- 2. Sistema reúne dados de desempenho, presença e recuperação
	- 3. Sistema apresenta indicadores gerais por aluno e por modalidade
	- 4. Usuário analisa o resultado e toma decisões sobre agendamentos futuros

- Fluxos Alternativos:
	- 2a. Há ausência de dados
		- 2a1. Sistema informa que ainda não existem registros suficientes
	- 3a. Treino requer atenção especial
		- 3a1. Sistema destaca a necessidade de revisão e acompanhamento do professor
