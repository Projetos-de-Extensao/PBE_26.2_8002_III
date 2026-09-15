---
id: dt
title: Design Thinking
---

## **Design Thinking**

### **1. Capa**

- **Título do Projeto**: Sistema de agendamento para treinamento infantil de alta performance
- **Nome da Equipe**: Grupo 3 do projeto: Arthur Calebe, Antonio Reuter, Pedro Henrique e Breno Ruf
- **Data**: 2026.2
- **Logo da Empresa/Organização**: Essa etapa ainda será feita.

---

### **2. Introdução**

- **Contexto do Projeto**: O projeto trata do desenvolvimento de um sistema de agendamento para treinamento infantil de alta performance. O sistema deverá orquestrar a agenda de treinamentos e validar a disponibilidade simultânea de sala, professor e jovem atleta.
- **Objetivo**: Evitar agendamentos conflitantes, respeitar os limites biológicos de crianças de 7 a 12 anos e garantir a segurança e a qualidade do acompanhamento.
- **Público-Alvo**: Gestores, responsáveis autenticados, professores e profissionais previamente validados pelo coordenador, atendendo jovens atletas de 7 a 12 anos.
- **Escopo**: O sistema abrangerá o agendamento no centro de treinamento, incluindo as zonas destinadas ao público infantil, como a pista de explosão motora e a sala de testes cognitivos. Também incluirá calendário, gestão de salas e equipamentos, categorização de treinadores, bloqueios automáticos, fila de espera, recomendações de treino e registro rápido de métricas pós-treino.

#### **2.1. Base utilizada**

O documento foi elaborado a partir do `5w2h.md` e do `Brainstorm.md`. A pesquisa registrada nessas fontes analisou aplicações de alocação de eventos, funcionalidades de calendário, salas, professores e plataformas similares. As respostas do 5W2H foram utilizadas para organizar o contexto do produto, enquanto o brainstorm detalhou as regras e transformou as ideias iniciais em requisitos elicitados.

#### **2.2. Direcionadores do projeto**

Os materiais consultados apresentam os seguintes direcionadores para a solução:

- **Centralizar a rotina de treinos** em uma agenda organizada.
- **Cruzar disponibilidades** de sala, professor e jovem atleta antes de confirmar uma marcação.
- **Evitar conflitos** e respeitar a antecedência mínima de 12 horas.
- **Preservar os intervalos necessários** para descanso, transição, hidratação e higienização.
- **Considerar indisponibilidades do centro de treinamento**, como manutenção e avaliação técnica.
- **Acompanhar o desenvolvimento** motor e cognitivo por meio de recomendações de treino e registro de métricas pós-treino.

---

### **3. Fases do Design Thinking**

#### **3.1. Empatia**

- **Pesquisa**: A pesquisa analisou aplicações de alocação de eventos, funcionalidades de calendário, salas, professores e plataformas similares. O Brainstorm foi organizado a partir das questões do 5W2H, permitindo registrar as necessidades iniciais do sistema.
- **Pessoas envolvidas**: Os usuários identificados são gestores, responsáveis autenticados, professores e profissionais previamente validados pelo coordenador. O sistema atende jovens atletas de 7 a 12 anos.
- **Contexto de uso**: A aplicação será utilizada no centro de treinamento, nas zonas destinadas ao público infantil, incluindo a pista de explosão motora e a sala de testes cognitivos.
- **Necessidades observadas**: Os materiais apontam a necessidade de visualizar a agenda, controlar a disponibilidade de salas e equipamentos, organizar profissionais por categoria e acompanhar informações relacionadas aos treinos.
- **Restrições observadas**: O agendamento precisa respeitar antecedência mínima de 12 horas, períodos de descanso, transição, hidratação e higienização, além de horários de manutenção e avaliação técnica.
- **Personas**: As personas foram identificadas, mas suas descrições detalhadas, objetivos e jornadas ainda serão elaborados.

#### **3.2. Definição**

- **Problema Central**: Como criar um sistema de agendamento para treinamento infantil de alta performance que evite conflitos, valide simultaneamente a disponibilidade de sala, professor e jovem atleta e respeite as regras de segurança e acompanhamento?
- **Necessidade do produto**: A solução precisa transformar uma agenda que depende de múltiplas disponibilidades e restrições em um processo de marcação organizado e verificável.
- **Critérios para uma marcação**: Uma marcação só deve ser considerada adequada quando houver disponibilidade simultânea de sala, professor e jovem atleta, quando a antecedência mínima for respeitada e quando não houver conflito com intervalos, manutenção ou avaliação técnica.
- **Pontos de Vista (POV)**: Os pontos de vista detalhados dos usuários ainda serão feitos. Neste momento, os materiais permitem reconhecer diferentes necessidades de visualização e operação, como as visões de calendário adaptadas ao gestor e aos pais e a validação realizada por profissionais previamente autorizados.

#### **3.3. Ideação**

- **Brainstorming**: Foram levantadas as seguintes ideias: calendário com visões adaptadas ao gestor e aos pais; gestão de salas e equipamentos; categorização de treinadores; bloqueios automáticos; fila de espera; recomendações de treino; e registro rápido de métricas pós-treino.
- **Critério de seleção**: As ideias foram relacionadas às necessidades identificadas na definição do problema: gerenciar a rotina de treinos, cruzar disponibilidades, evitar conflitos, respeitar restrições de segurança e acompanhar o desenvolvimento motor e cognitivo.
- **Ideias selecionadas e finalidade**:

| Ideia | Relação com o problema identificado |
| --- | --- |
| Validação simultânea de sala, professor e jovem atleta | Evita a confirmação de um treino quando um dos recursos necessários está indisponível. |
| Calendário com visões adaptadas ao gestor e aos pais | Organiza a visualização da agenda para os diferentes usuários identificados. |
| Gestão de salas e equipamentos | Permite considerar os recursos físicos utilizados no treinamento. |
| Categorização de treinadores | Organiza os profissionais envolvidos no atendimento. |
| Bloqueios automáticos | Apoia o respeito às indisponibilidades e aos períodos que não podem receber marcações. |
| Fila de espera | Dá suporte à organização de solicitações quando uma marcação não puder ser realizada imediatamente. |
| Recomendações de treino | Relaciona o agendamento ao acompanhamento do desenvolvimento motor e cognitivo. |
| Registro rápido de métricas pós-treino | Permite registrar informações após a realização do treino. |

- **Resultado da ideação**: A proposta consolidada é um sistema de agendamento que organiza a agenda, valida os recursos necessários e incorpora regras de segurança, acompanhamento e disponibilidade do centro de treinamento.

#### **3.3.1. Requisitos derivados do brainstorm**

O brainstorm registrou os seguintes requisitos para orientar a evolução da solução:

| ID | Requisito |
| --- | --- |
| BS01 | Orquestrar a agenda de treinamentos. |
| BS02 | Validar simultaneamente a disponibilidade de sala, professor e jovem atleta. |
| BS03 | Evitar agendamentos conflitantes. |
| BS04 | Respeitar a antecedência mínima de 12 horas. |
| BS05 | Considerar os períodos de descanso, transição, hidratação e higienização. |
| BS06 | Considerar os horários de manutenção e avaliação técnica. |
| BS07 | Atender jovens atletas de 7 a 12 anos. |
| BS08 | Oferecer um calendário com visões adaptadas ao gestor e aos pais. |
| BS09 | Permitir a gestão de salas e equipamentos. |
| BS10 | Permitir a categorização de treinadores. |
| BS11 | Realizar bloqueios automáticos. |
| BS12 | Oferecer uma fila de espera. |
| BS13 | Oferecer recomendações de treino. |
| BS14 | Permitir o registro rápido de métricas pós-treino. |

#### **3.4. Prototipagem**

- **Situação da etapa**: A prototipagem ainda não foi realizada.
- **O que deverá ser representado**: Quando essa etapa for iniciada, o protótipo deverá permitir visualizar o fluxo de agendamento, o calendário, a disponibilidade de salas e equipamentos, os bloqueios e o registro pós-treino, conforme as ideias selecionadas.
- **Materiais Utilizados**: Ainda não definidos.
- **Testes Realizados**: Ainda não realizados.

#### **3.5. Teste**

- **Situação da etapa**: Os testes com usuários ainda não foram realizados.
- **Feedback dos Usuários**: Ainda não coletado.
- **Ajustes Realizados**: Ainda não realizados.
- **Resultados Finais**: Ainda não definidos.

---

### **4. Conclusão**

- **Resultados Obtidos**: Foram organizados o contexto do centro de treinamento, os usuários envolvidos, o problema central, as restrições de agendamento, os requisitos BS01–BS14 e as ideias de solução relacionadas a cada necessidade.
- **Próximos Passos**: Detalhar as personas e seus pontos de vista, elaborar o protótipo com base nos requisitos selecionados e realizar testes com usuários para obter feedback e definir ajustes.
- **Aprendizados**: O sistema não deve tratar o agendamento apenas como a escolha de um horário. É necessário cruzar as disponibilidades de sala, profissional e aluno, respeitar a antecedência mínima de 12 horas, reservar os períodos de descanso, transição, hidratação e higienização e considerar os horários de manutenção e avaliação técnica.

---

### **5. Anexos**

- Essa etapa ainda será feita.

---

## **Dicas para Criar o Documento**

- Use uma linguagem clara e objetiva.
- Inclua visualizações, como mapas de empatia, jornadas do usuário ou esboços de ideias.
- Adapte o documento conforme o estágio do projeto.

Esse documento foi ampliado exclusivamente com base no `5w2h.md` e no `Brainstorm.md`. As etapas de prototipagem e teste permanecem identificadas como pendentes porque não foram descritas nas fontes consultadas.