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
| RF-16 | Validar a antecedência mínima exigida para a confirmação ou a alteração de uma marcação, conforme a regra de negócio definida na seção 4. | Must | BS04 |
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
Seção a ser preenchida na próxima etapa, formalizando as restrições descritas em prosa na pesquisa e nos fluxos alternativos dos Casos de Uso, como a antecedência mínima de 12 horas, as janelas de descanso e recuperação e os bloqueios por manutenção ou avaliação técnica.
</p>

| ID | Descrição | Requisito(s) relacionado(s) |
| -- | --------- | --------------------------- |

## 5. Matriz de Rastreabilidade

<p align = "justify">
Seção a ser preenchida na próxima etapa, relacionando cada requisito funcional ao Caso de Uso que o realiza, às regras de negócio aplicáveis e à tela correspondente do Protótipo de Baixa Fidelidade.
</p>

| Requisito | Caso de Uso | Regra(s) de Negócio | Tela do Protótipo |
| --------- | ----------- | ------------------- | ----------------- |
