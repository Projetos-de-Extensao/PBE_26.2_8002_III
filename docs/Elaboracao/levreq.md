---
id: levantamento_de_requisitos
title: Levantamento de Requisitos
---

# Levantamento de Requisitos

## Introdução

<p align = "justify">
Este documento consolida o levantamento de requisitos do sistema de agendamento para treinamento infantil de alta performance. Seu propósito é reunir, em um único artefato rastreável, os stakeholders envolvidos, os requisitos funcionais e não funcionais e as regras de negócio que condicionam a marcação de treinos, servindo de referência para os Casos de Uso, o Diagrama de Classes, o Diagrama de Sequência e o Protótipo de Baixa Fidelidade produzidos na fase de Elaboração.
</p>

### Objetivo

<p align = "justify">
O sistema tem como objetivo orquestrar a agenda de treinamentos de jovens atletas de 7 a 12 anos, validando a disponibilidade simultânea de sala, professor e atleta antes de confirmar qualquer marcação. Com isso, busca-se evitar agendamentos conflitantes, respeitar os limites biológicos da faixa etária atendida e garantir a segurança e a qualidade do acompanhamento realizado pelo centro de treinamento.
</p>

### Escopo

<p align = "justify">
O escopo abrange a gestão de contas de responsáveis e o vínculo de atletas, o agendamento, o cancelamento e o reagendamento de treinos, o calendário com visões adaptadas ao gestor e aos responsáveis, o cadastro e a disponibilidade de professores, o controle de salas e equipamentos, a fila de espera, o registro de métricas pós-treino e os relatórios de acompanhamento do desenvolvimento motor e cognitivo.
</p>

<p align = "justify">
Estão fora do escopo deste documento o controle financeiro e de mensalidades, a emissão de documentos fiscais e qualquer interface destinada ao uso direto pelo jovem atleta, que figura no sistema como beneficiário e não como usuário operador.
</p>

## Metodologia

<p align = "justify">
Os requisitos aqui registrados são derivados dos artefatos já produzidos pela equipe na fase de Iniciação: a <code>pesquisa.md</code>, que analisou aplicações de alocação de eventos e plataformas similares e elicitou requisitos nos grupos ALO, CAL, SAL e PRF; o <code>Brainstorm.md</code>, que consolidou os requisitos BS01 a BS14 a partir das questões do 5W2H; e o <code>design_thinking.md</code>, que organizou o problema central e os critérios de uma marcação adequada. Esses identificadores de origem são unificados neste documento em um esquema único de RF, RNF e RN, preservando a rastreabilidade até os Casos de Uso.
</p>

### Convenção de identificadores

| Prefixo | Significado |
| ------- | ----------- |
| `RF-nn` | Requisito Funcional |
| `RNF-nn` | Requisito Não Funcional |
| `RN-nn` | Regra de Negócio |
| `UC-nn` | Caso de Uso |

## 1. Stakeholders

<p align = "justify">
São considerados stakeholders as partes interessadas identificadas no 5W2H e no Design Thinking, tanto as que operam o sistema quanto as que são afetadas por ele sem utilizá-lo diretamente.
</p>

| Stakeholder | Descrição | Interesse no sistema |
| ----------- | --------- | -------------------- |
| Responsável | Pai, mãe ou tutor do jovem atleta. É o titular da conta e o pagante dos treinos. | Agendar, cancelar e reagendar treinos dos dependentes, acompanhar a rotina e o desenvolvimento de cada um. |
| Jovem atleta | Criança de 7 a 12 anos atendida pelo centro de treinamento. Beneficiário do sistema, não o opera diretamente. | Receber treinos compatíveis com seu nível de desenvolvimento motor e ter respeitados os períodos de descanso e recuperação. |
| Professor | Profissional que conduz os treinos e registra o desempenho dos atletas. | Consultar a agenda do dia, registrar métricas pós-treino com agilidade e ter seus turnos e bloqueios respeitados. |
| Administrador | Gestor do centro de treinamento, com perfil administrativo no sistema. | Cadastrar professores, salas e equipamentos, visualizar a lotação total e garantir a capacidade e a segurança dos ambientes. |
| Coordenador técnico | Responsável por validar previamente a certificação e a área de atuação dos profissionais. | Assegurar que apenas profissionais habilitados sejam vinculados a cada modalidade e faixa etária. |
| Centro de treinamento | Organização proprietária dos espaços físicos e dos equipamentos. | Ocupação eficiente das salas, cumprimento das janelas de manutenção e conformidade com os limites de segurança. |
| Equipe de desenvolvimento | Grupo 3 da disciplina de Projeto Back-End do IBMEC. | Entregar o sistema conforme o escopo e os prazos da disciplina, seguindo a metodologia RUP/UP. |

## 2. Requisitos Funcionais

<p align = "justify">
Os requisitos abaixo consolidam, em um esquema único, os requisitos elicitados na <code>pesquisa.md</code> (grupos ALO, CAL, SAL e PRF) e no <code>Brainstorm.md</code> (BS01 a BS14). A coluna Origem preserva a rastreabilidade até o artefato de elicitação; a marcação <em>Novo</em> indica requisito derivado dos Casos de Uso que não havia sido elicitado nos documentos da fase de Iniciação, notadamente os relativos a contas de acesso e a relatórios. A priorização segue a escala MoSCoW já adotada na pesquisa.
</p>

<p align = "justify">
O requisito BS01, "orquestrar a agenda de treinamentos", não aparece isolado na tabela por descrever a finalidade geral do sistema, e não uma função verificável: ele é realizado pelo conjunto dos requisitos de agendamento e calendário.
</p>

### 2.1 Contas e Acesso

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |
| RF-01 | Permitir o cadastro de responsável com nome, e-mail, senha e dados de contato. | Must | Novo |
| RF-02 | Validar o formato do e-mail informado e verificar se ainda não está em uso. | Must | Novo |
| RF-03 | Exigir que a senha atenda a critérios mínimos de segurança e armazená-la criptografada. | Must | Novo |
| RF-04 | Enviar e-mail de confirmação de cadastro, ativar a conta após a confirmação e permitir o reenvio do link. | Must | Novo |
| RF-05 | Autenticar o responsável por e-mail e senha e manter a sessão validada. | Must | Novo |
| RF-06 | Permitir a recuperação de senha por meio de instruções enviadas ao e-mail cadastrado. | Must | Novo |
| RF-07 | Permitir a visualização e a alteração dos dados da conta. | Should | Novo |
| RF-08 | Diferenciar os perfis de acesso de responsável, professor e administrador, restringindo as funções de cada um. | Must | Novo |

### 2.2 Atletas

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |
| RF-09 | Permitir o cadastro de atletas vinculados à conta do responsável, admitindo mais de um atleta por conta. | Must | Novo |
| RF-10 | Registrar nome, idade, nível de desenvolvimento motor e informações básicas de cada atleta. | Must | Novo |
| RF-11 | Validar que a idade do atleta esteja entre 7 e 12 anos, impedindo o cadastro fora dessa faixa. | Must | BS07 |
| RF-12 | Impedir a conclusão do cadastro quando houver campos obrigatórios não preenchidos. | Must | Novo |

### 2.3 Agendamento

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |
| RF-13 | Validar a disponibilidade simultânea de sala, professor e atleta no mesmo horário. | Must | ALO-01, BS02 |
| RF-14 | Bloquear em tempo real agendamentos conflitantes, impedindo a dupla reserva de qualquer recurso. | Must | ALO-02, BS03 |
| RF-15 | Calcular e reservar a janela de descanso e recuperação física após cada treino, considerando transição, hidratação e higienização. | Must | ALO-03, BS05 |
| RF-16 | Validar a antecedência mínima exigida para a confirmação ou a alteração de uma marcação, conforme a RN-01. | Must | BS04 |
| RF-17 | Impedir o agendamento quando o atleta estiver em período de recuperação. | Must | Novo |
| RF-18 | Sugerir horários alternativos quando houver conflito de agenda entre professor e sala. | Should | Novo |
| RF-19 | Permitir o cancelamento e o reagendamento pelo responsável, respeitando a janela de cancelamento permitida. | Must | CAL-03 |
| RF-20 | Recomendar treinos com base no nível de desenvolvimento motor do jovem atleta. | Should | ALO-05, BS13 |
| RF-21 | Restringir o número máximo de atividades de alta intensidade na mesma semana. | Could | ALO-06 |

### 2.4 Calendário

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |
| RF-22 | Alternar entre a visão administrativa, com a lotação total do centro, e a visão parental, restrita aos dependentes do responsável. | Must | CAL-01, BS08 |
| RF-23 | Filtrar o calendário por especialidade do treino, idade ou treinador. | Should | CAL-02 |
| RF-24 | Destacar visualmente os períodos de descanso, os horários de pico e os horários ociosos do centro de treinamento. | Could | CAL-04 |
| RF-25 | Exibir o histórico de treinos e as próximas atividades de cada atleta. | Should | Novo |
| RF-26 | Bloquear o agendamento em horários retroativos, mantendo-os abertos apenas para a inserção de métricas atrasadas pelos professores. | Should | CAL-03 |

### 2.5 Salas e Equipamentos

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |
| RF-27 | Cadastrar ambientes de treinamento com nome, capacidade, metragem e descrição. | Must | SAL-01, BS09 |
| RF-28 | Vincular equipamentos específicos de alta performance a cada ambiente. | Should | SAL-02 |
| RF-29 | Bloquear espaços em horários de manutenção ou de avaliação técnica exclusiva. | Must | SAL-03, BS06 |
| RF-30 | Apresentar alerta e impedir a reserva quando a capacidade máxima recomendada da sala for excedida. | Must | Novo |

### 2.6 Professores

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |
| RF-31 | Categorizar treinadores por especialidade técnica e faixa etária de domínio. | Must | PRF-01, BS10 |
| RF-32 | Gerenciar turnos e disponibilidade dos profissionais, com bloqueios automáticos para almoço e planejamento. | Must | PRF-02, BS11 |
| RF-33 | Validar a certificação e a área de atuação do professor antes de vinculá-lo a uma modalidade. | Must | Novo |
| RF-34 | Exibir ao professor a agenda com os treinos do dia. | Must | Novo |

### 2.7 Desempenho e Relatórios

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |
| RF-35 | Oferecer atalho na agenda para o registro rápido de métricas logo após o treino. | Should | PRF-03, BS14 |
| RF-36 | Registrar os indicadores de esforço, fadiga e recuperação do atleta ao final do treino. | Must | Novo |
| RF-37 | Exigir o preenchimento dos campos obrigatórios antes de enviar o registro pós-treino. | Must | Novo |
| RF-38 | Atualizar o histórico do atleta e a recomendação de descanso a partir do registro pós-treino. | Must | Novo |
| RF-39 | Sugerir descanso ou bloquear treino futuro quando o indicador de fadiga estiver alto. | Should | Novo |
| RF-40 | Apresentar relatórios de desempenho, presença e recuperação por atleta e por modalidade. | Should | Novo |
| RF-41 | Informar ao usuário quando não houver registros suficientes para a geração do relatório. | Could | Novo |

### 2.8 Fila de Espera

| ID | Descrição | Prioridade | Origem |
| -- | --------- | ---------- | ------ |
| RF-42 | Acionar automaticamente a fila de espera quando houver cancelamento de um treino agendado. | Should | ALO-04, BS12 |
| RF-43 | Selecionar o próximo atleta da fila conforme a ordem de entrada e a compatibilidade com a vaga. | Should | Novo |
| RF-44 | Notificar o responsável do atleta selecionado e permitir a confirmação imediata da vaga. | Should | Novo |
| RF-45 | Repassar a vaga ao próximo da fila caso o responsável não confirme dentro do prazo. | Should | Novo |
| RF-46 | Manter a vaga disponível para novo agendamento quando não houver ninguém na fila. | Should | Novo |

## 3. Requisitos Não Funcionais

<p align = "justify">
Diferentemente dos requisitos funcionais, os requisitos não funcionais não haviam sido elicitados em nenhum documento da fase de Iniciação. Os requisitos desta seção foram derivados das regras de negócio descritas na <code>pesquisa.md</code>, das restrições de contexto levantadas no 5W2H e no Design Thinking e da natureza do público atendido, uma vez que o sistema trata dados pessoais de crianças de 7 a 12 anos e está sujeito ao regime especial previsto na Lei Geral de Proteção de Dados. A priorização segue a mesma escala MoSCoW adotada na seção anterior.
</p>

### 3.1 Desempenho

| ID | Categoria | Descrição | Prioridade |
| -- | --------- | --------- | ---------- |
| RNF-01 | Desempenho | A validação de disponibilidade simultânea de sala, professor e atleta deve retornar resposta em até 3 segundos. | Must |
| RNF-02 | Desempenho | O calendário mensal deve ser carregado em até 5 segundos, considerando a lotação total do centro de treinamento. | Should |
| RNF-03 | Desempenho | O sistema deve atender às marcações simultâneas de pelo menos 50 responsáveis sem degradação perceptível do tempo de resposta. | Should |

### 3.2 Segurança e Proteção de Dados

| ID | Categoria | Descrição | Prioridade |
| -- | --------- | --------- | ---------- |
| RNF-04 | Segurança | As senhas devem ser armazenadas exclusivamente sob forma criptografada, nunca em texto claro. | Must |
| RNF-05 | Segurança | Toda a comunicação entre cliente e servidor deve trafegar por canal cifrado (HTTPS). | Must |
| RNF-06 | Proteção de dados | O tratamento dos dados dos jovens atletas deve observar o regime da LGPD para crianças, condicionado ao consentimento específico do responsável legal. | Must |
| RNF-07 | Proteção de dados | O responsável deve ter acesso apenas aos dados dos atletas vinculados à própria conta, sem visibilidade sobre os demais. | Must |
| RNF-08 | Proteção de dados | O sistema deve coletar apenas os dados necessários ao agendamento e ao acompanhamento do treino, sem campos dispensáveis à finalidade. | Should |
| RNF-09 | Segurança | A sessão do usuário deve expirar automaticamente após período de inatividade, exigindo nova autenticação. | Should |
| RNF-10 | Auditoria | O sistema deve registrar log de agendamentos, cancelamentos, reagendamentos e registros de desempenho, identificando autor e data e hora da operação. | Should |

### 3.3 Usabilidade

| ID | Categoria | Descrição | Prioridade |
| -- | --------- | --------- | ---------- |
| RNF-11 | Usabilidade | A interface deve ser apresentada integralmente em português do Brasil. | Must |
| RNF-12 | Usabilidade | Toda mensagem de bloqueio deve informar o motivo da recusa e a ação corretiva possível, sem exibir mensagem genérica de erro. | Must |
| RNF-13 | Usabilidade | O registro de métricas pós-treino deve ser concluído em até três interações, por meio de controles de seleção rápida, para não consumir tempo de quadra do professor. | Should |
| RNF-14 | Usabilidade | O fluxo de agendamento de um treino deve ser concluído em até cinco passos a partir do painel inicial do responsável. | Should |
| RNF-15 | Acessibilidade | As sinalizações de estado do calendário, como períodos de descanso e horários bloqueados, não devem depender exclusivamente de cor para serem compreendidas. | Should |

### 3.4 Confiabilidade e Integridade

| ID | Categoria | Descrição | Prioridade |
| -- | --------- | --------- | ---------- |
| RNF-16 | Integridade | A confirmação de um agendamento deve ser tratada como transação atômica, de modo que a reserva de atleta, professor e sala seja efetivada integralmente ou não seja efetivada. | Must |
| RNF-17 | Integridade | Falhas de comunicação ou indisponibilidade momentânea não podem resultar em reserva parcial ou em dupla reserva de um mesmo recurso. | Must |
| RNF-18 | Confiabilidade | Os dados do sistema devem ser objeto de rotina de backup diária. | Should |

### 3.5 Disponibilidade

| ID | Categoria | Descrição | Prioridade |
| -- | --------- | --------- | ---------- |
| RNF-19 | Disponibilidade | O sistema deve permanecer disponível durante todo o horário de funcionamento do centro de treinamento. | Must |
| RNF-20 | Disponibilidade | As manutenções programadas do sistema devem ocorrer fora do horário de funcionamento do centro de treinamento. | Should |

### 3.6 Compatibilidade e Portabilidade

| ID | Categoria | Descrição | Prioridade |
| -- | --------- | --------- | ---------- |
| RNF-21 | Compatibilidade | O sistema deve funcionar nas duas versões mais recentes dos navegadores Google Chrome, Mozilla Firefox e Microsoft Edge. | Must |
| RNF-22 | Portabilidade | A interface destinada ao responsável deve ser responsiva e utilizável em tela de smartphone, por ser o dispositivo de uso mais provável no contexto de agendamento. | Must |

### 3.7 Manutenibilidade

| ID | Categoria | Descrição | Prioridade |
| -- | --------- | --------- | ---------- |
| RNF-23 | Manutenibilidade | O sistema deve ser desenvolvido em Python com o framework Django, conforme definido no 5W2H do projeto. | Must |
| RNF-24 | Manutenibilidade | Os parâmetros das regras de negócio, como antecedência mínima, duração da janela de descanso e limite semanal de atividades de alta intensidade, devem ser configuráveis sem alteração de código-fonte. | Should |

## 4. Regras de Negócio

<p align = "justify">
As regras de negócio formalizam as restrições que condicionam o comportamento do sistema. Elas foram extraídas de duas fontes: os blocos "Regras de Negócio Específicas" da <code>pesquisa.md</code>, que as descreviam em prosa e sem identificador, e os fluxos alternativos dos Casos de Uso, onde apareciam implícitas nas condições de bloqueio. Cada regra concentra o valor ou o critério da política, enquanto o requisito funcional correspondente descreve apenas a validação, de modo que uma mudança de política não exija alterar o texto do requisito.
</p>

### 4.1 Agendamento e Alocação

| ID | Descrição | Requisito(s) relacionado(s) |
| -- | --------- | --------------------------- |
| RN-01 | A confirmação ou a alteração de uma marcação só é permitida com antecedência mínima de 12 horas em relação ao início do treino. | RF-16, RF-19 |
| RN-02 | Qualquer transação que gere conflito de agenda entre o atleta, o professor ou a sala deve ser interrompida, sem confirmação parcial. | RF-13, RF-14 |
| RN-03 | A janela reservada após cada treino corresponde à duração do treino somada aos tempos de transição, hidratação e higienização dos equipamentos. | RF-15 |
| RN-04 | Horários retroativos são bloqueados para agendamento, permanecendo abertos apenas para a inserção de métricas atrasadas pelos professores. | RF-26, RF-35 |
| RN-05 | Somente responsáveis autenticados podem confirmar ou alterar horários dos atletas vinculados à sua conta. | RF-05, RF-08, RF-19 |
| RN-06 | O número de atividades de alta intensidade que um mesmo atleta pode realizar na semana é limitado. | RF-21 |
| RN-07 | O cancelamento ou o reagendamento solicitado fora da janela permitida é bloqueado, com informação da política aplicável ao responsável. | RF-19 |

### 4.2 Cadastro e Acesso

| ID | Descrição | Requisito(s) relacionado(s) |
| -- | --------- | --------------------------- |
| RN-08 | O centro de treinamento atende exclusivamente jovens atletas com idade entre 7 e 12 anos. | RF-11 |
| RN-09 | Um mesmo endereço de e-mail não pode estar associado a mais de uma conta de responsável. | RF-02 |
| RN-10 | A conta do responsável permanece inativa até a confirmação do cadastro pelo e-mail enviado. | RF-04 |
| RN-11 | A senha deve atender aos critérios mínimos de segurança definidos pelo sistema para ser aceita. | RF-03 |
| RN-12 | Cadastros e registros com campos obrigatórios não preenchidos não são aceitos pelo sistema. | RF-12, RF-37 |

### 4.3 Professores

| ID | Descrição | Requisito(s) relacionado(s) |
| -- | --------- | --------------------------- |
| RN-13 | O professor só pode ser vinculado às modalidades para as quais tenha certificação técnica previamente validada pelo coordenador. | RF-31, RF-33 |
| RN-14 | O mesmo profissional não pode iniciar treinos em espaços físicos distintos sem que haja entre eles um intervalo mínimo de deslocamento. | RF-32, RF-13 |
| RN-15 | Os turnos de almoço e de planejamento do professor são bloqueados automaticamente para agendamento. | RF-32 |
| RN-16 | A agenda exibida ao professor reflete apenas as modalidades para as quais ele foi validado. | RF-34, RF-31 |

### 4.4 Salas e Equipamentos

| ID | Descrição | Requisito(s) relacionado(s) |
| -- | --------- | --------------------------- |
| RN-17 | A reserva é impedida quando a lotação resultante exceder a capacidade máxima recomendada do ambiente. | RF-27, RF-30 |
| RN-18 | Salas com equipamentos complexos ou de risco avaliado só podem ser reservadas para atividades conduzidas por treinador com a certificação técnica correspondente. | RF-28, RF-33 |
| RN-19 | Ambientes em horário de manutenção ou de avaliação técnica exclusiva permanecem indisponíveis no calendário. | RF-29 |

### 4.5 Segurança e Desempenho do Atleta

| ID | Descrição | Requisito(s) relacionado(s) |
| -- | --------- | --------------------------- |
| RN-20 | Treinos classificados como de alta intensidade são bloqueados quando o relatório de fadiga do atleta indicar necessidade de repouso. | RF-17, RF-39 |
| RN-21 | Atleta em período de recuperação não pode receber novo agendamento até o término da janela calculada. | RF-17, RF-38 |
| RN-22 | Relatórios de acompanhamento só são gerados quando houver registros de treino em quantidade suficiente. | RF-41 |

### 4.6 Fila de Espera

| ID | Descrição | Requisito(s) relacionado(s) |
| -- | --------- | --------------------------- |
| RN-23 | A seleção do próximo atleta da fila observa a ordem de entrada e a compatibilidade com a vaga liberada. | RF-43 |
| RN-24 | A vaga oferecida ao responsável expira caso não seja confirmada dentro do prazo estabelecido, sendo repassada ao próximo da fila. | RF-44, RF-45 |
| RN-25 | Não havendo ninguém na fila de espera, a vaga permanece disponível para novo agendamento livre. | RF-46 |

### 4.7 Parâmetros pendentes de definição

<p align = "justify">
Quatro regras dependem de valores que ainda não foram fixados em nenhum documento do projeto e que precisam ser definidos pela equipe antes da implementação. Enquanto isso, as regras acima descrevem o critério sem estabelecer o número, e os valores devem ser configuráveis conforme o RNF-24.
</p>

| Regra | Parâmetro a definir |
| ----- | ------------------- |
| RN-06 | Número máximo de atividades de alta intensidade por atleta por semana. |
| RN-07 | Duração da janela de cancelamento e de reagendamento sem penalidade. |
| RN-14 | Intervalo mínimo de deslocamento do professor entre espaços físicos distintos. |
| RN-24 | Prazo de confirmação da vaga oferecida ao responsável na fila de espera. |

## 5. Matriz de Rastreabilidade

<p align = "justify">
A matriz relaciona cada requisito funcional ao Caso de Uso que o realiza, às regras de negócio que o condicionam e à tela correspondente do Protótipo de Baixa Fidelidade. Os identificadores dos Casos de Uso referem-se a <code>casos_de_uso.md</code> e os nomes das telas ao documento <code>prototipo-baixa-fidelidade.md</code>. O traço indica ausência de vínculo, situação analisada ao final da seção.
</p>

| Requisito | Caso de Uso | Regra(s) de Negócio | Tela do Protótipo |
| --------- | ----------- | ------------------- | ----------------- |
| RF-01 | UC-01 | RN-09, RN-11, RN-12 | Cadastro do Responsável |
| RF-02 | UC-01 | RN-09 | Cadastro do Responsável |
| RF-03 | UC-01 | RN-11 | Cadastro do Responsável |
| RF-04 | UC-01 | RN-10 | Cadastro do Responsável |
| RF-05 | UC-02 | RN-05 | Login |
| RF-06 | UC-02 | — | Recuperar Senha |
| RF-07 | — | — | Perfil do Responsável |
| RF-08 | UC-02, UC-07, UC-08 | RN-05 | — |
| RF-09 | UC-03 | RN-08 | Cadastrar Atleta |
| RF-10 | UC-03 | — | Cadastrar Atleta |
| RF-11 | UC-03 | RN-08 | Cadastrar Atleta |
| RF-12 | UC-03 | RN-12 | Cadastrar Atleta |
| RF-13 | UC-04 | RN-02, RN-14 | Agendar Treino |
| RF-14 | UC-04 | RN-02 | Agendar Treino |
| RF-15 | UC-04 | RN-03 | Agendar Treino |
| RF-16 | UC-04 | RN-01 | Agendar Treino |
| RF-17 | UC-04 | RN-20, RN-21 | Agendar Treino |
| RF-18 | UC-04 | RN-02 | Agendar Treino |
| RF-19 | UC-05 | RN-01, RN-05, RN-07 | Calendário de Treinos, Reagendar Treino |
| RF-20 | UC-04 | — | Agendar Treino |
| RF-21 | UC-04 | RN-06 | Agendar Treino |
| RF-22 | UC-06 | — | Calendário de Treinos |
| RF-23 | UC-06 | — | Calendário de Treinos |
| RF-24 | UC-06 | — | Calendário de Treinos |
| RF-25 | UC-06 | — | Perfil do Atleta |
| RF-26 | UC-04 | RN-04 | Calendário de Treinos |
| RF-27 | UC-08 | RN-17 | — |
| RF-28 | UC-08 | RN-18 | — |
| RF-29 | UC-08 | RN-19 | — |
| RF-30 | UC-08 | RN-17 | — |
| RF-31 | UC-07 | RN-13, RN-16 | — |
| RF-32 | UC-07 | RN-14, RN-15 | — |
| RF-33 | UC-07 | RN-13, RN-18 | — |
| RF-34 | UC-09 | RN-16 | — |
| RF-35 | UC-09 | RN-04 | — |
| RF-36 | UC-09 | — | — |
| RF-37 | UC-09 | RN-12 | — |
| RF-38 | UC-09 | RN-21 | Perfil do Atleta |
| RF-39 | UC-09 | RN-20 | Perfil do Atleta |
| RF-40 | UC-11 | — | Relatórios e Acompanhamento |
| RF-41 | UC-11 | RN-22 | Relatórios e Acompanhamento |
| RF-42 | UC-05, UC-10 | — | Fila de Espera |
| RF-43 | UC-10 | RN-23 | Fila de Espera |
| RF-44 | UC-10 | RN-24 | Fila de Espera |
| RF-45 | UC-10 | RN-24 | Fila de Espera |
| RF-46 | UC-10 | RN-25 | Fila de Espera |

### 5.1 Análise de cobertura

<p align = "justify">
Todos os onze Casos de Uso estão cobertos por ao menos um requisito funcional e todas as vinte e cinco regras de negócio aparecem vinculadas a algum requisito, o que indica que não há regra formalizada sem função que a aplique.
</p>

<p align = "justify">
Um único requisito não possui Caso de Uso correspondente: o RF-07, relativo à visualização e à alteração dos dados da conta. A função consta da lista de descrição inicial de <code>casos_de_uso.md</code>, no item Contas, mas não foi detalhada como Caso de Uso próprio, ao contrário do cadastro e da entrada no sistema. Recomenda-se a especificação desse Caso de Uso para completar a rastreabilidade.
</p>

<p align = "justify">
Doze requisitos não possuem tela correspondente no Protótipo de Baixa Fidelidade. Onze deles, do RF-27 ao RF-37, compreendem as funções administrativas de cadastro de salas e equipamentos, gestão de professores e registro de desempenho pós-treino, realizadas pelos Casos de Uso UC-07, UC-08 e UC-09. O protótipo foi construído a partir da jornada do responsável e não contempla as interfaces do administrador nem a do professor, que precisam ser prototipadas antes da fase de Construção. O RF-08, por tratar da separação entre perfis de acesso, é transversal às telas e não se vincula a nenhuma em particular.
</p>

## Conclusão

<p align = "justify">
Este documento reuniu em um único artefato os stakeholders, os quarenta e seis requisitos funcionais, os vinte e quatro requisitos não funcionais e as vinte e cinco regras de negócio do sistema de agendamento para treinamento infantil de alta performance. Com isso, os requisitos que estavam dispersos entre a pesquisa, o brainstorm e o design thinking, sob três esquemas de identificação distintos, passaram a compor um esquema único de RF, RNF e RN, com a coluna de origem preservando a rastreabilidade até o artefato em que cada requisito foi elicitado pela primeira vez.
</p>

<p align = "justify">
A consolidação também tornou visíveis lacunas que não apareciam enquanto os requisitos estavam espalhados. A fase de Iniciação não havia elicitado nenhum requisito não funcional, tampouco requisitos relativos a contas de acesso e a relatórios de acompanhamento, ainda que os Casos de Uso já previssem esses fluxos. Da mesma forma, a formalização das regras de negócio evidenciou quatro parâmetros que nenhum documento do projeto chegou a fixar, registrados na seção 4.7 para decisão da equipe.
</p>

<p align = "justify">
Resta preencher a matriz de rastreabilidade da seção 5, que depende da atribuição de identificadores aos Casos de Uso descritos em <code>casos_de_uso.md</code>. Concluída essa etapa, o documento passa a servir de entrada direta para o Diagrama de Classes e para os Diagramas de Sequência, conforme previsto nos respectivos templates da fase de Elaboração.
</p>

## Referências

> BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm

> ISO/IEC 25010. Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models.

> SOMMERVILLE, Ian. Software Engineering. 10th ed. Pearson, 2015.

> AGILE BUSINESS CONSORTIUM. MoSCoW Prioritisation. DSDM Project Framework.

> `pesquisa.md`, `5w2h.md`, `Brainstorm.md` e `design_thinking.md` - documentos internos do projeto, pasta `docs/Iniciacao`.

> `casos_de_uso.md` - documento interno do projeto, pasta `docs/Elaboracao`.

## Autor(es)

| Data | Versão | Descrição | Autor(es) |
| -- | -- | -- | -- |
| 2026.2 | 1.0 | Criação do documento com introdução, objetivo, escopo, metodologia e estrutura das seções | Pedro Henrique Becker |
| 2026.2 | 1.1 | Adição dos stakeholders e dos requisitos funcionais RF-01 a RF-46 | Pedro Henrique Becker |
| 2026.2 | 1.2 | Adição dos requisitos não funcionais RNF-01 a RNF-24 | Pedro Henrique Becker |
| 2026.2 | 1.3 | Formalização das regras de negócio RN-01 a RN-25 e dos parâmetros pendentes | Pedro Henrique Becker |
| 2026.2 | 1.4 | Adição da conclusão, das referências e do registro de autoria | Pedro Henrique Becker |
