# Visão Geral

Apocalípticos é um jogo de desafios e interações em grupo, onde os jogadores enfrentam cartas com perguntas, desafios e situações absurdas em um ambiente temático pós-apocalíptico. O jogo pode ser jogado online ou presencialmente, com diferentes níveis de dificuldade e categorias para adaptar-se ao público.

---

## 1. Estrutura e Navegação

### 📱 Tela Inicial (Home)

**Login & Identificação**

- **Login Persistente:** Funcionalidade para manter usuários logados (Google/Email) e evitar perda de sessão ao recarregar.
- **Modo Anônimo:** Permitir jogar sem cadastro, mas com limitações de histórico.

**Design e Funcionalidades**

- ✅ Logotipo "Apocalípticos" (estilo neon/grunge).
- ✅ Botões Principais: "Criar Sala", "Entrar na Sala".
- **Footer:** Sobre nós, redes sociais, licença de uso.

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
- **Seleção de Personagem:** Jogadores escolhem sua Classe/Papel aqui (veja seção RPG).

### Correções

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

**Funcionalidades de Sala**

- **Sair da Sala:** Botão para sair e retornar à Home.
- **Sucessão Automática:** Se o Admin sair, o próximo jogador mais antigo vira Admin.

### Correções

---

## 2. Modos de Jogo e Lógica

| Tipo                   | Fluxo                                                                 | Status          |
| :--------------------- | :-------------------------------------------------------------------- | :-------------- |
| **Verdade ou Desafio** | 1. ADM escolhe tipo. <br> 2. Sorteia carta.                           | ✅ Completo     |
| **Decisões de Merda**  | 1. Situação absurda. <br> 2. Jogador decide.                          | ✅ Implementado |
| **Amigos de Merda**    | 1. Pergunta polêmica. <br> 2. Votação secreta. <br> 3. Perdedor bebe. | ✅ Implementado |
| **Eu Nunca**           | 1. Afirmação. <br> 2. Voto (Já/Nunca). <br> 3. Feedback visual.       | ✅ Implementado |

### Correções

---

## 3. Universo e Mecânicas RPG (Lore & Rules)

> Uma **história narrativa coesa**, com **ambientação pós-apocalíptica**, e **5 personagens jogáveis**, cada um com **habilidades únicas** que **alteram o destino do jogo**, sempre mantendo o espírito de _drinking game_ (risco, sacrifício e escolhas difíceis).

### 🌍 História: O Mundo de Apocalípticos

O mundo acabou… mas a sede não.

Após o **Colapso Rubro**, uma série de explosões nucleares e epidemias dissolveram governos, cidades e qualquer vestígio de ordem. Os poucos sobreviventes se espalharam em **zonas mortas**, vivendo entre ruínas, fumaça e silêncio.

A humanidade não luta mais por dinheiro ou poder. Luta por **recursos**, **controle**… e **lucidez**.

Em meio ao caos, surgiram os **Apocalípticos** — grupos de sobreviventes que se reúnem em antigos abrigos, bares abandonados e bunkers para enfrentar desafios brutais. Cada rodada não é apenas um jogo: é um **teste de sanidade, coragem e sobrevivência**.

**Beber não é diversão. Beber é o preço para continuar vivo.**

---

### ❤️ Sistema de Vida (HP) e Modo Crítico

Todos começam com **30 Pontos de Vida (PV)**.
O objetivo é terminar o jogo com **mais PV** que os oponentes.

- **Dano e Cura:** Cartas e habilidades podem tirar ou restaurar PV.
- **Modo Crítico (0 PV):**
  - Se um jogador chegar a **0 PV**, ele **NÃO é eliminado**. Ele entra em **Modo Crítico**.
  - **Penalidade Dupla:** Enquanto estiver com 0 ou menos, qualquer punição (bebida ou perda de pontos) é **multiplicada por 2**.
  - **Recuperação:** É possível sair do modo crítico se for curado (ex: pelo Médico ou carta de recompensa).

---

### 🧟 Personagens e Habilidades

Cada jogador assume um papel que pode **mudar o rumo da partida**. As habilidades possuem **Custo em Doses** para serem ativadas.

#### 🩺 1. O MÉDICO DA ZONA MORTA

**História:** Antigo socorrista de guerra, o Médico aprendeu que salvar vidas sempre cobra um preço. Ele carrega seringas improvisadas e remédios instáveis, feitos com restos do velho mundo.

- **Habilidade: “Tratamento de Risco”**  
  Cura **+1 PV** de qualquer jogador (inclusive ele mesmo).
- **Custo:**  
  🍺 O Médico bebe **1 dose**.  
  🍺 O Paciente bebe **1 dose**.
- **Regra Extra:** Não pode curar o mesmo jogador duas rodadas seguidas.

> 🧠 _Narrativa:_ “Vai doer. Se não doer, não funciona.”

#### 🔪 2. O ASSASSINO DAS RUÍNAS

**História:** Ninguém sabe de onde ele veio. Apenas que sempre sobra alguém no chão depois que ele passa. No apocalipse, a violência virou moeda.

- **Habilidade: “Roubo de Sangue”**  
  Rouba **2 PV** de qualquer jogador alvo.
- **Custo:**  
  🍺 O Assassino bebe **2 doses**.
- **Limitação:** Uso único por partida.

> 🧠 _Narrativa:_ “Não é pessoal. É sobrevivência.”

#### 🧠 3. O ESTRATEGISTA (O MENTOR)

**História:** Ex-líder de um abrigo subterrâneo. Sobreviveu aprendendo que decisões erradas matam mais do que radiação.

- **Habilidade: “Plano de Contingência”**  
  Pode **alterar a ordem dos jogadores** (inverte sentido ou pula).
- **Custo:**  
  🍺 O Estrategista bebe **1 dose**.
- **Efeito:** Pode salvar alguém de um desafio pesado ou colocar um rival na linha de fogo.

> 🧠 _Narrativa:_ “Quem controla a ordem, controla o caos.”

#### 🔥 4. A INCENDIÁRIA

**História:** Viveu entre gangues nômades. Ama ver tudo pegar fogo — inclusive o equilíbrio do grupo.

- **Habilidade: “Caos Controlado”**  
  Na sua vez, pode **Forçar um jogador** a comprar um desafio. Se o jogador negar, a penalidade (bebida e dano) é **dobrada**.
- **Custo:**  
  🍺 A Incendiária bebe **2 doses**.

> 🧠 _Narrativa:_ “Nada é mais justo do que duas péssimas opções.”

#### ☠️ 5. O SOBREVIVENTE (O IMORTAL)

**História:** Esteve presente em todos os colapsos. Já deveria estar morto. Ninguém sabe como ainda respira.

- **Habilidade: “Último Fôlego”**  
  Quando chegaria a **0 PV** (entraria em crítico), ele permanece com **1 PV**.
- **Custo:**  
  🍺 Bebe **2 doses** (Automático).
- **Regra:** Ativa **apenas uma vez por partida** automaticamente.

> 🧠 _Narrativa:_ “Ainda não acabou.”

---

### ☣️ Eventos do Caos (Os 7 Pecados)

_Cartas Raras (5% chance) que interrompem o fluxo do jogo._

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

- **Efeito:** Avatares e Nomes são **embaralhados** na tela. Você vê o nome de outro jogador no seu lugar.
- **Caos:** Votações e interações ficam confusas (você acha que vota em X, mas vota em Y).
- **Revelação:** Só no fim da rodada a tela "glitcha" e revela a verdade.
- **Penalidade:** Quem receber mais votos bebe **2 doses** (mesmo se foi por engano).

#### 🍔 4. GULA — BANQUETE TÓXICO (Evento Imediato)

- **Lore:** Um suprimento contaminado foi encontrado.
- **Decisão:** Todos devem escolher imediatamente:
  1.  **Segurança:** Beber 1 dose agora.
  2.  **Risco:** Rolar o Dado. (50% Nada / 50% Bebe 3 Doses).
- **Ambientação:** Sons de mastigação distorcidos, mesa radioativa.

#### 😡 5. IRA — SURTO DE VIOLÊNCIA (Evento Direcionado)

- **Efeito:** O jogador da vez perde o controle e escolhe **2 oponentes**.
- **Confronto:** Esses dois duelam (bebem 1 dose cada).
- **Finalização:** O jogador da vez escolhe qual dos dois bebe +1 dose extra.
- **Ambientação:** Tela tremendo, sons de metal e gritos.

#### 😴 6. PREGUIÇA — ABRIGO ADORMECIDO (Evento Global)

- **Efeito:** Tudo desacelera por 1 rodada.
- **Mecânica:** Timer aumenta para **45s**.
- **Opção:** Jogadores podem escolher **"Pular Vez"**, mas custa **1 dose** para descansar.
- **Ambientação:** Música lenta, blur na tela. > "Sobreviver cansa."

#### 💔 7. LUXÚRIA — PACTO PROIBIDO (Evento Social)

- **Efeito:** Jogador da vez escolhe 2 pessoas para formar um par.
- **Vínculo:** Até o fim do jogo, tudo que um sofre, o outro sofre metade (bebida/dano).
- **Traição:** Se um votar no outro ou usar habilidade contra, o vínculo quebra e **ambos bebem 2 doses**.
- **Ambientação:** Corações com glitch, sussurros.

### Correções

---

## 4. Planejamento Técnico & Futuro

### Melhorias de Engajamento

- **Fim de Jogo Épico:** Tela de pódio com estatísticas ("Maior Bêbado", "Arregão").
- **Compartilhamento:** Gerar imagem do resultado para Instagram/Zap.
- **Reações flutuantes:** Emojis (🔥, 🍻, 😱) enviados por quem não é a vez.

### Correções

### Refatoração e Backend

- [ ] **Cloud Functions:** Mover lógica de sorteio e pontuação para o servidor (segurança).
- [ ] **Presença:** Melhorar detecção de offline (heartbeat).
- [ ] **Histórico:** Garantir que cartas não se repitam na mesma sessão.

### Correções

### Monetização (Ideias)

- **Itens Cosméticos:** Avatares exclusivos, skins de cartas.
- **Baralhos Premium:** Pacotes temáticos (ex: "Baralho da Ira Hardcore").
- **Efeitos Visuais:** Animações diferenciadas de vitória ou ações.

### Correções
