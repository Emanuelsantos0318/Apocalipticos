# Visão Geral

Apocalípticos é um jogo de desafios e interações em grupo, onde os jogadores enfrentam cartas com perguntas, desafios e situações absurdas em um ambiente temático pós-apocalíptico. O jogo pode ser jogado online ou presencialmente, com diferentes níveis de dificuldade e categorias para adaptar-se ao público.

---

## 1. Estrutura e Navegação

### Tela Incial que tem uma discrição do que é o jogo.

- Landing Page com discrição do que é o jogo. (✅ Implementado)
  - ✅ Logo "Apocalípticos" (Imagem adicionada).
  - ✅ O que é o jogo? (Seção de História Expandida).
    - ✅ Uma imagem seguida de um texto que explica o que é o jogo.
    - ✅ Botão "Jogar" (leva para a tela inicial do jogo).
  - Como jogar?
    - Um texto que explica como jogar.
  - Categorias
    - Um texto que explica as categorias.
  - Modos de jogo
    - Um texto que explica os modos de jogo.
- Botão "Jogar" (leva para a tela inicial do jogo). Segundo no final da página.
- Botão "Login" e "Cadastro".
- Botão "Sobre nós" e "Redes sociais".
- Footer com links para redes sociais e informações do jogo.

### 👨🏾‍🦳 Tela de Perfil

- **Funções iniciais:**
  1. Adicionar/redefinir senha
  2. Adicionar/vincular email
  3. Adicionar/alterar nome
  4. Adicionar/alterar foto de perfil
  5. Adicionar/alterar data de nascimento
  6. Adicionar/alterar gênero
  7. Configurações de Privacidade e Segurança
  - Permissões de compartilhamento de dados
  - Bloquear usuários
  - Denunciar usuários
  8. Configuraçoes de pagamento
  - Adicionar/remover método de pagamento
  - Ver histórico de pagamentos
  - Configurações de assinatura
  9. Configurações de notificação
  10. Configurações de idioma
  11. Configurações de tema
  12. Configurações de som
  13. Configurações de idioma
  14. Configurações de Conta
  - Excluir conta
  - Sair da conta

### 📱 Tela Inicial (Home)

**Login & Identificação**

- **Login Persistente:** Funcionalidade para manter usuários logados (Google/Email) e evitar perda de sessão ao recarregar.
- **Modo Anônimo:** Permitir jogar sem cadastro, mas com limitações de histórico.
- **Perfil de usuário:** Salvar nome, avatar, etc.

**Design e Funcionalidades**

- ✅ Logotipo "Apocalípticos" (estilo neon/grunge).
- ✅ Botões Principais: "Criar Sala", "Entrar na Sala".
- ⏳ **Footer:** Sobre nós, redes sociais, licença de uso.
- ⏳ Dar um foco maior na estilização da da carta na hora de escolher.
- ⏳ Adicionar botão com "?" para explicar o que cada botão faz, ou no caso do mobile ao passar o mouse por cima do botão ele irá mostrar uma explicação.
- ⏳ Criar uma interface que viage mais pela lory para não se tornar um jogo básico.

**Criar Sala (Modal)**

- ✅ Nome do Administrador (obrigatório).
- ✅ Data de Nascimento (verificação de idade).
- ✅ Nome da Sala (opcional).
- ✅ Nível do Jogo (Normal, +18, Difícil).
- ✅ Validação de Idade (Bloqueio para menores em modos 18+).
- ✅ Geração de código único (ex: ZUMBI).

**Entrar na Sala (Modal)**

- ✅ Nome do Jogador.
- ✅ Data de Nascimento.
- ✅ Chave de Acesso.
- ✅ Validação de Idade para sala 18+.

### 🛋️ Lobby (Sala de Espera)

- ✅ Lista de Jogadores Conectados (com avatares).
- ✅ Contagem de Jogadores.
- ✅ Botão "Iniciar Jogo" (apenas ADM).
- ⏳ Chat Simples (opcional).
- ✅ **Seleção de Personagem:** Jogadores escolhem sua Classe/Papel aqui (veja seção RPG).

### Correções

- Alterar o avatar pela carta ou transforma a carta também em avatar. Eu particulamente prefiro como está, com aquelas figuras que tinhamos feito, deixa mais personalizado e caso repita o personagem teria uma perfil diferente do outro, mas parece que meu colega quer a foto do personagem que o usuário escolheu.

- ✅ **Adicionar uma Borda Colorida no avatar dependendo da classe** (Ex: Vermelho pro Assassino, Branco pro Médico). OBS: A Borda já existe no componente de Avatar, vamos considerar ok.

- ✅ **Sair da Sala:** Ao sair da sala a musica de sair da sala só está sendo tocada quando o Admin sai, e não quando qualquer jogador sai. -> Corrigido e Verificado.

### 🎮 Tela de Jogo

**Fluxo Principal**

- ✅ **Sorteio do Jogador da Vez:** Exibe nome e avatar.
- ✅ **Sorteio da Carta:** Baseado no modo e categorias (evitar repetição).
- ✅ **Resolução da Carta:**
  - Timer de 30s.
  - Botões "Cumprir" (pontua/cura) e "Recusar" (bebe/dano).
  - Validação do Admin (confirma se cumpriu).
  - **Inatividade:** Se o tempo acabar e ninguém agir, passa e aplica penalidade automática.
- ✅ **Placar e Ranking:** Atualização em tempo real de Vida (PV) e Estatísticas.
- ⏳ Dar um foco maior na estilização da da carta na hora de escolher.
  **Funcionalidades de Sala**

- **Sair da Sala:** Botão para sair e retornar à Home.
- **Sucessão Automática:** Se o Admin sair, o próximo jogador mais antigo vira Admin.

### Correções

- ✅ **GameHeader**: Mudar o formato do jogadores da vez e adicionar o nome do jogador atual, o anterior e o próximo. E centralizar tudo.
- ✅ **Sair da Sala:** Ao sair da sala a musica de sair da sala só está sendo tocada quando o Admin sai, e não quando qualquer jogador sai.

---

## 2. Modos de Jogo e Lógica

| Tipo                   | Fluxo                                                                                                                                                                                                                                                                                     | Status          |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------- |
| **Verdade ou Desafio** | 1. ADM escolhe tipo. <br> 2. Sorteia carta.                                                                                                                                                                                                                                               | ✅ Completo     |
| **Decisões de Merda**  | 1. Situação absurda. <br> 2. Jogador decide.                                                                                                                                                                                                                                              | ✅ Implementado |
| **Amigos de Merda**    | 1. Pergunta polêmica. <br> 2. Votação secreta. <br> 3. Perdedor bebe.                                                                                                                                                                                                                     | ✅ Implementado |
| **Eu Nunca**           | 1. Afirmação. <br> 2. Voto (Já/Nunca). <br> 3. Feedback visual. <br> 4. Dependendo da pergunta se for uma pergunta de coisas boas ou ruins, ele pode beber ou não, sendo que caso uma pergunta seja ruim, ele perde pontos de vida, caso seja uma pergunta boa, ele ganha pontos de vida. | ✅ Implementado |

### Correções

⏳ **Repetição de Cartas**: Varias vezes a mesma carta pode ser sorteada. Por exemplo no Eu Nunca estava recebendo a mesma carta varias vezes. Sei que tem poucas cartas salvas ainda, mas acho que a lógica de sorteio precisa ser melhorada.

- ⏳ **Repetição de Cartas**: Implementar lógica para evitar que a mesma carta seja sorteada repetidamente na mesma sessão.

- [ ] Criar histórico de cartas usadas na sessão (Sala).

- [ ] Filtrar cartas já usadas no sorteio.

- [ ] Resetar histórico quando todas as cartas do deck forem usadas.

- **Decisoes de Merda:** O admin não está confirmando que o jogador cumpriu a tarefa.

- ✅ **Ao selecionar novo jogo:** não está resetando os dados do jogo como a vida dos jogadores.

### ⏳ Pendências

- Atualizar o useGameActions.js com os novos tipos de cartas.

#### ⏳ Funções prevista

- ⏳ Cartas com maior usabilidade
- ⏳ Minhas cartas
- ⏳ Histórico de partidas
- ⏳ Amigos
- ⏳ _Poder das cartas_
  - ⏳ O poder das cartas ainda não foram aplicadas no jogo.

---

## 3. Experiência do Usuário (UX) e Visual

- **Animações de Cartas**: Use `Framer Motion` para fazer a carta "virar" (flip effect) ao ser sorteada, ou deslizar da tela. Isso dá uma sensação tátil muito boa.

> Ainda não está muito bonito, mas é um começo. Vou pesquisar mais sobre isso. E colocamos um design de melhor qualidade.

⏳ **Feedback Visual de Dano/Cura:**

- Quando alguém perde pontos, a tela poderia piscar levemente em vermelho (vignette). Quando ganha, em verde ou dourado. (🔄 Em Desenvolvimento)
- Quando alguém usar uma habilidade seria bom que quem usou e em quem a habilidade foi aplicada fosse exibido em tela de todos os jogadores (🔄 Em Desenvolvimento)

**Temas Dinâmicos**: O fundo da tela poderia mudar sutilmente dependendo do modo de jogo (ex: mais sombrio no modo "Difícil", mais neon no "+18").

- Mudar o background para cada modo de jogo.

⏳ **Fontes**: Se você encontrar fontes mais adequadas para isso pode usar a vontade, essa que tem lá é apenas para testes.

⏳ **Efeitos Sonoros**: Adicionar efeitos sonoros e animações avançadas.

⏳ **Eventos do Caos**: Melhorar a UX/UI dos eventos do caos.

- **Cartas do Caos:** Agora exibem Ícone e Título corretamente no cartão (✅ Corrigido).

### Correções

- ✅ **Header:** Otimizado com scroll horizontal para eventos e responsividade ajustada (Next/Prev visíveis no mobile).
- ✅ **Botões dos eventos:** Refeitos com estilo visual próprio e restritos ao jogador da vez.

⏳ **Interface do Lobby**: Melhorar a interface do lobby para que seja mais agradável e bonita. Principalmente o RoomHeader.jsx, está bem simples e feio.

## 4. Universo e Mecânicas RPG (Lore & Rules)

> Uma **história narrativa coesa**, com **ambientação pós-apocalíptica**, e **5 personagens jogáveis**, cada um com **habilidades únicas** que **alteram o destino do jogo**, sempre mantendo o espírito de _drinking game_ (risco, sacrifício e escolhas difíceis).

---

### ❤️ Sistema de Vida (HP) e Modo Crítico

Todos começam com **30 Pontos de Vida (PV)**.
O objetivo é terminar o jogo com **mais PV** que os oponentes.

- **Dano e Cura:** Cartas e habilidades podem tirar ou restaurar PV.
- **Modo Crítico (0 PV):**
  - Se um jogador chegar a **0 PV**, ele **NÃO é eliminado**. Ele entra em **Modo Crítico**.
  - **Penalidade Dupla:** Enquanto estiver com 0 ou menos, qualquer punição (bebida ou perda de pontos) é **multiplicada por 2**.
  - **Recuperação:** É possível sair do modo crítico se for curado (ex: pelo Médico ou carta de recompensa).

  #### Correção
  - O modo crítico não está funcionando corretamente. Quando um jogador chega a 0 PV, no ranking em telas pequenas ele aparece como 30 PV, mas deveria aparecer como 0 PV e com um ícone de caveira ao lado do nome. E depois de um tempo jogando ele volta a aparecer como 30 PV. Tanto no ranking quanto na tela de jogo. Mesmo sem ter recebido nenhuma cura.

---

### 🧟 Personagens e Habilidades (⏳ Em Desenvolvimento)

Cada jogador assume um papel que pode **mudar o rumo da partida**. As habilidades possuem **Custo em Doses** para serem ativadas.

> **Observação:** Vou expandir o documento para incluir uma seção de Vozes do Apocalipse, com provocações específicas para cada um, focadas em suas histórias e traumas.
> Adicionei as provocações baseadas no "Fardo" de cada um. Note como o Julian foca no desperdício de vida, a Helena na carência emocional, o Elias na lógica, a Clara no sádico calor e o Jorge no cansaço de quem já viu de tudo.
> Essas frases podem aparecer em janelas de diálogo quando um jogador clica na habilidade ou até como mensagens automáticas no chat do jogo. O que achou do tom delas?

#### 🩺 1. O MÉDICO DA ZONA MORTA

**História:** Antigo socorrista de guerra, o Médico aprendeu que salvar vidas sempre cobra um preço. Ele carrega seringas improvisadas e remédios instáveis, feitos com restos do velho mundo.

- **Habilidade: “Tratamento de Risco”**  
  Cura **+1 PV** de qualquer jogador (inclusive ele mesmo).
- **Custo:**  
  🍺 O Médico bebe **1 dose**.  
  🍺 O Paciente bebe **1 dose**.
- **Regra Extra:** Não pode curar o mesmo jogador duas rodadas seguidas.

> 🧠 _Narrativa:_ “Vai doer. Se não doer, não funciona.” , "Eu já escolhi quem vive uma vez. Não me faça ter que escolher de novo."

> Provocações (Ao curar):

- "Seu batimento cardíaco é um desperdício de oxigênio que eu poderia ter usado neles."
- "Não implore. Eu já ignorei gritos muito mais altos que os seus."
- "Sinta esse ardor. É a única prova de que você ainda não é um cadáver."

#### 🔪 2. O ASSASSINO DAS RUÍNAS

**História:** Ninguém sabe de onde ele veio. Apenas que sempre sobra alguém no chão depois que ele passa. No apocalipse, a violência virou moeda.

- **Habilidade: “Roubo de Sangue”**  
  Rouba **2 PV** de qualquer jogador alvo.
- **Custo:**  
  🍺 O Assassino bebe **2 doses**.
- **Limitação:** Uso único por partida.

> 🧠 _Narrativa:_ "Não pisque. A última coisa que você verá será a minha falta de arrependimento.", “Não é pessoal. É sobrevivência.”

> Provocações (Ao tirar PV/Roubo de Sangue):

- "Me empreste um pouco da sua vida... eu já esqueci como é a sensação."
- "Você tem medo da sombra? Eu tenho medo do que sobrou da luz."
- "Maya teria a sua idade hoje. Mas ela foi mais corajosa ao morrer do que você ao viver."

#### 🧠 3. O ESTRATEGISTA (O MENTOR)

**História:** Ex-líder de um abrigo subterrâneo. Sobreviveu aprendendo que decisões erradas matam mais do que radiação.

- **Habilidade: “Plano de Contingência”**  
  Pode **alterar a ordem dos jogadores** (inverte sentido ou pula).
- **Custo:**  
  🍺 O Estrategista bebe **1 dose**.
- **Efeito:** Pode salvar alguém de um desafio pesado ou colocar um rival na linha de fogo.

> 🧠 _Narrativa:_ "O caos é apenas uma ordem que você ainda não compreendeu. Eu compreendo tudo.", “Quem controla a ordem, controla o caos.”

> Provocações (Ao tirar PV/Alterar Ordem):

- "Você é um erro de cálculo que eu finalmente decidi corrigir."
- "Sua dor é irrelevante para o resultado final do meu plano."
- "Saia da linha. Você está atrapalhando a visão da minha nova utopia."

#### 🔥 4. A INCENDIÁRIA

**História:** Viveu entre gangues nômades. Ama ver tudo pegar fogo — inclusive o equilíbrio do grupo.

- **Habilidade: “Caos Controlado”**  
  Na sua vez, pode **Forçar um jogador** a comprar um desafio. Se o jogador negar, a penalidade (bebida e dano) é **dobrada**.
- **Custo:**  
  🍺 A Incendiária bebe **2 doses**.

> 🧠 _Narrativa:_ "O escuro está chegando para você. Deixe-me iluminar o seu caminho com o que restou de você.", “Nada é mais justo do que duas péssimas opções.”

> Provocações (Ao tirar PV/Forçar Desafio):

- "Você parece estar com frio... deixe-me te dar um abraço de gasolina."
- "Cinzas não sentem remorso. Por que eu deveria sentir?"
- "Grite mais alto! O som das chamas é tão solitário sem um acompanhamento."

#### ☠️ 5. O SOBREVIVENTE (O IMORTAL)

**História:** Esteve presente em todos os colapsos. Já deveria estar morto. Ninguém sabe como ainda respira.

- **Habilidade: “Último Fôlego”**  
  Quando chegaria a **0 PV** (entraria em crítico), ele permanece com **1 PV**.
- **Custo:**  
  🍺 Bebe **2 doses** (Automático).
- **Regra:** Ativa **apenas uma vez por partida** automaticamente.

> 🧠 _Narrativa:_ "Eu já morri mil vezes. Só esqueceram de me contar onde é o meu túmulo.", “Ainda não acabou.”

> Provocações (Ao tirar PV):

- "Eu já vi cidades melhores que você caírem. Você não é especial."
- "Sinta o peso de cada dia que eu tive que enterrar um amigo."
- "Beber para esquecer? Eu bebo para ter força de te aguentar por mais uma rodada."

#### 🍺 6. O BARMAN

**História:** Dono do bar Apocalíptico, Durante a Grande Quarentena, ele transformou com a ajuda de Elias, o porão do bar em um santuário de destilação clandestina.

- **Habilidade: "A Saideira"**  
  Na sua vez, pode **Forçar um jogador** repetir o último desafio. Se o jogador negar, a penalidade (bebida e dano) é **dobrada**.
- **Custo:**  
  🍺 1 Dose (Barman) + 1 Dose (Jogador)
- **Regra:** "Não pode forçar o mesmo alvo 2x seguidas."

> 🧠 _Narrativa:_ "A única coisa mais tóxica que a névoa lá fora é o que eu acabei de colocar no seu copo.", "Relaxa, o primeiro gole é por conta da casa. O segundo é por conta do seu destino."

**Provocações (Ao forçar desafio):**

- "Bebe isso logo. No meu bunker a gente chamava essa mistura de 'Água de Batismo'."
- "Tá com essa cara por quê? A névoa lá fora tá com um aspecto bem pior que esse drink.
- "O próximo é por conta da casa... se você sobreviver até a próxima rodada."
- "Cuidado com o gelo. Ele brilha no escuro, mas não morde... eu acho."

##### Correções:

## Parece que a habilidade do Barman não está funcionando corretamente.

### ☣️ Eventos do Caos (Os 7 Pecados)

_Cartas Raras (20% chance) que interrompem o fluxo do jogo._

“Quando o mundo acabou, os pecados não morreram. Eles evoluíram.”

#### 👑 1. ORGULHO — O DITADOR SUPREMO (Evento Global)

- **Efeito:** O jogador da vez vira o Ditador por até 3 rodadas.
- **Poder:** Cria uma **Regra Física Absurda** (ex: "Falar miando", "Proibido mostrar dentes").
- **Mecânica:** Botão "APLICAR MULTA" aparece para o Ditador. Se alguém quebrar a regra, ele multa e o infrator bebe.
- **Custo:** Ditador bebe 1 dose ao ativar.
- **Ambientação:** Música de marcha, tela dourada.

#### 💣 2. GANÂNCIA — MODO BLITZ (Evento Global)

- **Efeito:** O jogo entra em **Pânico Total** por 2 rodadas.
- **Mecânica:** Timer cai de 30s para **5-10s**.
- **Penalidade:** Quem falhar ou demorar tem penalidade **TRIPLICADA**.
- **Ambientação:** Tela vermelha pulsando, sirene, música acelerada.
- **Custo:** Todos bebem 1 dose ao iniciar.
- > "No apocalipse, quem hesita… paga."

#### 🎭 3. INVEJA — TROCA DE CORPOS (Evento Global)

- **Efeito:** Avatares e Nomes são **embaralhados** na tela. Você vê o nome de outro jogador no seu lugar durante quatro rodadas.
- **Caos:** Votações e interações ficam confusas (você acha que vota em X, mas vota em Y).
- **Revelação:** Só no fim da rodada a tela "glitcha" e revela a verdade.
- **Penalidade:** Quem receber mais votos bebe **2 doses** (mesmo se foi por engano).
  > Isso seria um evento de votação? Fiquei em dúvida como implementar.

#### 🍔 4. GULA — BANQUETE TÓXICO (Evento Imediato)

- **Lore:** Um suprimento contaminado foi encontrado.
- **Decisão:** Todos devem escolher imediatamente:
  1.  **Segurança:** Beber 1 dose agora.
  2.  **Risco:** Rolar uma moeda. (Se der cara 50% Nada / Se der coroa 50% Bebe 3 Doses).
- **Ambientação:** Sons de mastigação distorcidos, mesa radioativa.

#### 😡 5. IRA — SURTO DE VIOLÊNCIA (Evento Direcionado)

- **Efeito:** O jogador da vez perde o controle e escolhe **2 oponentes**.
- **Confronto:** Esses dois duelam (bebem 1 dose cada).
- **Finalização:** O jogador da vez escolhe qual dos dois bebe +1 dose extra. (✅ Implementado)
- **Ambientação:** Tela tremendo, sons de metal e gritos.

#### 😴 6. PREGUIÇA — ABRIGO ADORMECIDO (Evento Global)

- **Efeito:** Tudo desacelera por 1 rodada.
- **Mecânica:** Timer aumenta para **45s**.
- **Opção:** Jogadores podem escolher **"Pular Vez"**, mas custa **1 dose** para descansar.
- **Ambientação:** Música lenta, blur na tela. > "Sobreviver cansa."

#### 💔 7. LUXÚRIA — PACTO PROIBIDO (Evento Social)

- **Efeito:** Jogador da vez escolhe 2 pessoas para formar um par.
- **Vínculo:** Até o fim do jogo, tudo que um sofre, o outro sofre metade (bebida/dano).
- **Traição:** Se um votar no outro ou usar habilidade contra, o vínculo quebra e **ambos bebem 2 doses**. ( Botão "Trair" Em análise 🟡)
- **Ambientação:** Corações com glitch, sussurros.

> A habilidade de **traição** foi corrigida e agora possui botão dedicado "Quebrar Pacto".

### Correções

- Outra coisa quando aparece os eventos do caos, os PowerUpActions aparecem, o que não pode acontecer.

- ✅ **GULA**: Não está mostrando a opção de escolher entre segurança e risco. Todos devem escolher imediatamente. Caso tenham escolhido segurança, todos bebem 1 dose. Caso tenham escolhido risco, todos jogam uma moeda(o resultado é exclusivo para quem jogou a sua moeda, ou seja, se der cara não bebe, se der coroa bebe 3 doses), que deve aparecer para todos os jogadores (vamos criar um sistema moeda para isso).

> Opção A (Segurança): Dividir o Pão 🍞
> Efeito: Ninguém bebe. Todos recuperam 5 HP. (Bom para diplomacia).
> Opção B (Risco): Banquete Tóxico 🤮
> Efeito: Todos perdem 10 HP (2 doses). _Você ganha 30 Pontos por ver o circo pegar fogo._, mas todos devem escolher imediatamente. Como uma pessoa ver o circo pegar fogo? Me explique direito essa parte.

> Como eu tinha dito alí nas Funcionalidades planejadas, fica a intender que podem ter as duas escolhas simultâneas, por exemplo, dos 5 jogadores 3 escolheram Segurança e 2 Risco, como tivemos maior quantidade de Segurança então todos bebem 1 dose. Caso contrario rola a moeda(idividualmente) se der cara não bebe nada, se der coroa a pessoa que girou a moeda bebe 3 doses. Então para finalizar, uma moeda deve aparecer para todos!

- ✅ **Luxúria:** Se um jogador for escolhido para ser o par, ele não pode ser escolhido novamente.

- ✅ O botão da luxúria está permanente na tela, mesmo depois de ter sido usado. Podendo votar novamente mesmo depois de ter sido usado.

- ✅ **Inveja:** Não esta sendo feita a troca de avatares e nomes. E nem está valendo nas 4 rodadas. -> Corrigido conflito de lógica.

- ⏳ **Ditador:** Ao aplicar a multa, o jogador está recebendo a penalidade da habilidade do personagem e não está recebendo a penalidade do evento.
- ⏳ **Luxúria:** Quando um jogador toma uma penalidade as mensagens de penalidade devem aparecer para os dois jogadores envolvidos. Atualmente está aparecendo apenas para o jogador que tomou a penalidade, e o outro não recebe a mensagem.
- Sobre a traição da luxúria, quais são os requisitos para que a traição seja possível? E onde ela aparece? Eu joguei e não vi a traição.

- **Ira:** A logica que passei que o jogador da vez escolhe 2 pessoas para formar um par deve ser mantida. Mas vamos adicionar uma condicional para quando só tiver 2 jogadores(contando o jogador da vez), ele deve se auto formar par com o outro jogador.

##### **Eventos Gerais:**

- 📢 Identidade Visual
  "Que evento é esse?": Vou adicionar um Badge/Etiqueta claro no topo da tela e no CardDisplay quando ele aparecer, indicando qual Evento do Caos está rolando agora, para ninguém ficar perdido.

- Temos que melhorar a logica dos eventos.

- Algumas vezes um evento por exemplo O Ditador está ativo e aparece um outro evento e acaba desativando os dois eventos.

- Os evenntos não estão tendo uma funcionalidade correta, por exemplo, quando um evento é sorteado os botões não são adaptados para o evento, o que mostra é a interatividade normal do jogo, só aparece um botão para o administrador dizer se completou ou não, mas esses eventos deveriam ter uma interatividade própria e principalmente ser adaptados para o evento específico. Alguns eventos precisam que o sorteado escolha uma pessoa ou varias, outros precisam que todos os jogadores votem, outros precisam que todos os jogadores bebam uma dose, etc. E isso precisa ser feito de forma correta e adaptada para cada evento.

- Então vamos melhorar a funcionalidade dos eventos, vamos fazer com que cada evento tenha uma interatividade própria e principalmente ser adaptados para o evento específico.

- ao surgir o evento O Ditador, o jogador da vez vira o Ditador e cria uma regra física absurda, mas essa regra não é aplicada corretamente, pois os outros jogadores não são obrigados a seguir a regra.
  Poderiamos ter algo para que o Ditador possa aplicar multas aos jogadores que não seguirem a regra.

- **Botões dos eventos:** (✅ Refeitos) Todos os botões dos eventos foram refeitos e centralizados no ChaosEventOverlay.

---

## 5. Engajamento Social

- ⏳ **Compartilhamento**: Botão para gerar uma imagem do resultado final para postar no Instagram/WhatsApp.

- ⏳ **Reações Rápidas**: Permitir que os outros jogadores mandem emojis (🔥, 🍻, 😱) que flutuam na tela durante a vez do outro.

## 6. Planejamento Técnico & Futuro

### Melhorias de Engajamento

- **Fim de Jogo Épico:** Tela de pódio com estatísticas ("Maior Bêbado", "Arregão").
- **Compartilhamento:** Gerar imagem do resultado para Instagram/Zap.
- **Reações flutuantes:** Emojis (🔥, 🍻, 😱) enviados por quem não é a vez.

### Correções

### Refatoração e Backend

- [ ] **Cloud Functions:** Mover lógica de sorteio e pontuação para o servidor (segurança) para evitar que usuários mal-intencionados manipulem o jogo pelo console do navegador.
- [ ] **Presença:** Melhorar detecção de offline (heartbeat).
- [ ] **Histórico:** Garantir que cartas não se repitam na mesma sessão.

### Correções

### Monetização (Ideias)

- **Itens Cosméticos:** Avatares exclusivos, skins de cartas.
- **Baralhos Premium:** Pacotes temáticos (ex: "Baralho da Ira Hardcore").
- **Efeitos Visuais:** Animações diferenciadas de vitória ou ações.

- **Avatar IA (Premium):** Criação de personagem via IA com foto do usuário. A IA gera um avatar estilizado, cria uma lore baseada no nome e define atributos/penalidades únicos, introduzindo o personagem no jogo ($).

> - Criar uma IA dentro do jogo com o comando pra quando o usuário for criar seu avatar, ele tem a opção prêmio de colocar sua foto lá por apenas 2 dólares, o usuário coloca sua foto lá e ele escolhe qual vai ser o nome do seu personagem. A IA vai gerar esse comando(que vamos criar um prompt para manter um padrão de estilo e qualidade) , alguém ela vai gerar pra ele ali toda estrutura de personagem, o poder do personagem conforme o nome em que ele colocou, a penalidade do personagem e vai introduzir esse personagem dentro do jogo particular da pessoa.

```javascript
// Estrutura das cartas dos Personagens

NOME_DO_PERSONAGEM: {
    id: "nome_do_personagem",
    name: "O Nome Do Personagem",
    icon: "icon_personagem",
    color: "text-blue-400",
    bg: "bg-blue-900/20",
    border: "border-blue-500/30",
    image: "/assets/characters/nome_do_personagem.png",
    description: "Historia dele",
    ability: {
      name: "Nome_da_habilidade",
      effect:
        "Efeito da habilidade",
      cost: "Custo da habilidade",
      cooldown: "Cooldown da habilidade",
    },
    lore: "",
  },
```

> Agora seria bom ter um controle para que os personagens Criados não sejam salvos no mesmo lugar que os personagens normais. Para garantir a privacidade e segurança dos jogadores. Eles não devem ter acesso aos personagens dos outros jogadores. Eles devem ter acesso apenas aos seus próprios personagens.

> Tecnicamente, quando formos implementar (provavelmente numa V3 ou expansão), usaremos:

- Geração de Imagem: Uma API (como OpenAI DALL-E 3 ou Stable Diffusion) para transformar a foto do usuário num estilo "apocalíptico/grunge".
- LLM (Texto): Para ler o nome + a "vibe" da foto e gerar a lore, o poder e a penalidade.

1. **Estrutura JSON:** Está 100% compatível com o nosso `src/constants/roles.js`.

- **Sugestão:** Apenas note que em `roles.js`, alguns personagens usam limit (uso único) e outros usam cooldown. O modelo da IA deve ser capaz de escolher qual dos dois usar dependendo se a habilidade for muito forte (limit) ou recorrente (cooldown).

2. **Segurança e Privacidade (Ponto crucial que você levantou):**
   > Não podemos misturar personagens gerados (que podem ser milhares) no arquivo global ou na lista pública.

- **Solução Arquitetural:** Quando implementarmos, criaremos uma sub-coleção no Firestore: users/{userId}/custom_characters.
- **Ao entrar numa sala, o jogo carregará:** Personagens Globais (Padrão) + Personagens do Usuário Logado. Assim, só você vê e pode escolher seu personagem exclusivo.

3. **Prompt Engineering:**

- A ideia de ter um prompt "template" é vital para que a IA não crie personagens que quebrem o jogo (ex: "Mata todos instantaneamente"). Teremos que definir limites no prompt, como: "A habilidade deve ter sempre um custo/penalidade equivalente ao benefício".

### Correções

## 7. Refatorações

- Landing Page: Acredito que ela tem informações desnecessarias, poderiamos refatorar ela para que ela seja mais simples e direta.

## 8. Best Practices

## 9. Performance

> Apenas comandos para eu não esquecer.

Execute a skill global de performance web e me traga a analise deste projeto
