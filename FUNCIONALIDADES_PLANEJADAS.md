# Visão Geral

Apocalípticos é um jogo de desafios e interações em grupo, onde os jogadores enfrentam cartas com perguntas, desafios e situações absurdas em um ambiente temático pós-apocalíptico. O jogo pode ser jogado online ou presencialmente, com diferentes níveis de dificuldade e categorias para adaptar-se ao público.

## 📱 Tela Inicial (Home)

### Design e Funcionalidades

- ✅ Logotipo "Apocalípticos" (estilo neon/grunge).
- ✅ Botões Principais: "Criar Sala", "Entrar na Sala".

### Fluxo de Criação de Sala (Modal)

- ✅ Nome do Administrador (obrigatório).
- ✅ Data de Nascimento (para verificação de idade).
- ✅ Nome da Sala (opcional).
- ✅ Nível do Jogo (Normal, +18, Difícil).
- ✅ Validação de Idade (Bloqueio para menores em modos +18).
- ✅ Geração de código único (ex: ZUMBI).

### Fluxo de Entrar na Sala (Modal)

- ✅ Nome do Jogador.
- ✅ Data de Nascimento.
- ✅ Chave de Acesso.
- ✅ Validação de Idade para sala +18.

## 🛋️ Lobby (Sala de Espera)

### Funcionalidades

- ✅ Lista de Jogadores Conectados (com avatares).
- ⏳ Chat Simples (opcional).
- ✅ Botão "Iniciar Jogo" (apenas ADM).
- ✅ Contagem de Jogadores.

## 🎮 Tela de Jogo

### Fluxo Principal

- ✅ **Sorteio do Jogador da Vez**: Exibe nome e avatar.
- ✅ **Sorteio da Carta**: Baseado no modo e categorias.
- ✅ **Resolução da Carta**:
  - ✅ Timer de 30s.
  - ✅ Botões "Cumprir" e "Recusar" (penalidade).
  - ✅ Primeiro - O Usuario administrador deve confirmar se o usuario da vez compriu o desafio, isso vale para ele também caso seja sua vez.
  - ✅ Segundo - Deve ser contabilizado os pontos de ter comprido o desafio ou responder a pergunta. Caso contrario paga a penalidade e perde pontos.
  - ✅ Terceiro - Ao final do tempo, e o jogador da vez não tiver feito nenhuma ação, automaticamente sua vez é passada para outro e ele penalizado ou bebe.
    - ⏳Caso o jogador da vez não tenha feito nenhuma ação, automaticamente sua vez é passada para outro e ele penalizado ou bebe. (Ainda não implementado)
  - ✅ Observação: caso a pontuação seja 0, e ele perder pontos, não deve ter um valor negativo, continua com a pontuação zerada.
- ✅ **Atualização do Placar**: Pontuação e estatísticas. (🔄 Em Desenvolvimento)
- ✅ **Ranking em Tempo Real**: Lista ordenada. (🔄 Em Desenvolvimento)

- **Botão "Sair do Jogo" fecha a sala e remove o jogador do Firestore.**
- Observei que temos que ter um botão(funcionalidade) de sair do jogo e fechar a sala.
  - **Sucessão Automática:** Se o Admin sair, o jogo automaticamente promove o "vice-líder" (geralmente quem entrou na sala logo depois dele) para ser o novo Admin. É instantâneo e ninguém precisa fazer nada.
    * Criar o botão "Sair da Sala".
    * Implementar essa Troca de Admin Automática (baseada em quem está na sala há mais tempo).
    * Se o jogador da vez sair, o jogo já passa a vez para o próximo.

### Tipos de Jogos e Lógicas

| Tipo de Jogo           | Fluxo                                                                              | Status                                                  |
| :--------------------- | :--------------------------------------------------------------------------------- | :------------------------------------------------------ |
| **Verdade ou Desafio** | 1. ADM escolhe "Verdade" ou "Desafio". <br> 2. Sistema sorteia carta da categoria. | ✅ Completo (Modal de Escolha condicional)      |
| **Decisões de Merda**  | 1. Situação absurda + castigo. <br> 2. Apenas jogador da vez executa.              | ✅ Implementado (Cartas genéricas)                      |
| **Amigos de Merda**    | 1. Pergunta exibida. <br> 2. Votação secreta. <br> 3. Revelação do perdedor (bebe). | ✅ Implementado (Votação e Penalidade Automática)    |
| **Eu Nunca**           | 1. Afirmação exibida. <br> 2. Todos votam (Eu Já/Eu Nunca). <br> 3. Feedback visual em tempo real. <br> 4. Admin avança rodada. | ✅ Implementado (Com feedback visual e animações)       |

## 🔜 Próximos Passos

## Sugestões de Melhorias para o Apocalípticos

Aqui estão algumas ideias para elevar o nível do nosso projeto, focando em engajamento e polimento visual.

## 1. Experiência do Usuário (UX) e Visual

- **Animações de Cartas**: Use `Framer Motion` para fazer a carta "virar" (flip effect) ao ser sorteada, ou deslizar da tela. Isso dá uma sensação tátil muito boa.
  > Ainda não está muito bonito, mas é um começo. Vou pesquisar mais sobre isso. E colocamos um design de melhor qualidade.
  
- ⏳ **Feedback Visual de Dano/Cura**: Quando alguém perde pontos, a tela poderia piscar levemente em vermelho (vignette). Quando ganha, em verde ou dourado. (🔄 Em Desenvolvimento)
- ✅ **Feedback Visual de saida de jogador**: Quando alguém sai da sala, mostra uma animação de fade-out e remove da lista e uma mensagem de "jogador saiu da sala".
- **Temas Dinâmicos**: O fundo da tela poderia mudar sutilmente dependendo do modo de jogo (ex: mais sombrio no modo "Difícil", mais neon no "+18").
- ⏳ **Fontes**: Se você encontrar fontes mais adequadas para isso pode usar a vontade, essa que tem lá é apenas para testes. 
- ✅ Adicionar efeitos sonoros e animações avançadas.

### Correções
  -  Substituídos sons de Flip (`genio-aparecendo.mp3`) e Sucesso (`ding.mp3`) para opções mais agradáveis.

- ⏳ **Interface do Lobby**: Melhorar a interface do lobby para que seja mais agradável e bonita. Principalmente o RoomHeader.jsx, está bem simples e feio.

## 2. Mecânicas de Jogo

- **Poderes Especiais (Power-ups)**:
  - _Escudo_: O jogador pode pular uma vez sem penalidade.
  - _Vingança_: Se beber, pode escolher alguém para beber junto.
  - _Troca_: Trocar de carta uma vez por jogo.

  - **Futuramente**: Adicionar uma configuração para permitir ou não Poderes Especiais (ou/e outras coisas também). Isso deve ser feito na tela de configuração do jogo. 
  >**Aberto a sugestões**:

- **Sair da Sala**: Adicionar um botão para sair do jogor e ir para a Home.
- ⏳ **Rodadas Especiais**: A cada 5 rodadas, uma "Rodada do Caos" onde todos jogam ou as regras mudam (ex: vale o dobro de pontos).

# TODO: Decidir fazer alguma alterações no jogo.Por isso por enquanto ignore as funcionalidades abaixo do Eventos do Caos. Vou atualizar o documento mais tarde.

  - Vamos nos basear nos 7 pecados capitais (ou outra coisa). E mudar um pouco o foco do jogo, estamos criando uma historia de plano de fundo para que tudo seja implementado corretamente. Como estamos tentando monetizar o jogo podemos precisar deixar algumas cartas e modos de jogo pagos ou prêmio. Aceito sugestões de forma de ganhar dinheiro com o jogo. 
   - Aqui estão 3 sugestões de "Eventos do Caos" que podem acontecer aleatoriamente (tipo 5% de chance ao sacar uma carta) ou serem ativados pelo Admin:

    1. 👑 **O Ditador (Minha Favorita):**
    O que acontece: O jogador da vez vira o "Ditador Suprema" por 3 rodadas.
    Poder: Ele cria uma regra física (ex: "Ninguém pode mostrar os dentes" ou "Só pode falar miando").
    Mecânica: Adicionamos um botão de "Multar" no avatar dos outros. Se o Ditador ver alguém quebrando a regra, ele clica e a pessoa toma penalidade instantânea.
    2. 💣 **Modo Blitz (Pânico):**
    O que acontece: O timer cai de 30s para 5s nas próximas rodadas.
    Visual: A tela fica vermelha pulsando, música acelera (tipo Sonic se afogando). Quem não agir a tempo, perde pontos triplicados.
    3. 🎭 **Troca de Corpos (Confusão):**
    O que acontece: Embaralhamos os Avatares e Nomes na tela de todos.
    O Caos: Você vai votar no "Mateus" mas na verdade está votando na "Ana". Ninguém sabe quem é quem até a rodada acabar.

------------------------------
- ⏳ **Repetição de Cartas**: Varias vezes a mesma carta pode ser sorteada. Por exemplo no Eu Nunca estava recebendo a mesma carta varias vezes. Sei que tem poucas cartas salvas ainda, mas acho que a lógica de sorteio precisa ser melhorada.  
- ⏳ **Repetição de Cartas**: Implementar lógica para evitar que a mesma carta seja sorteada repetidamente na mesma sessão.
  - [ ] Criar histórico de cartas usadas na sessão (Sala).
  - [ ] Filtrar cartas já usadas no sorteio.
  - [ ] Resetar histórico quando todas as cartas do deck forem usadas.

- ✅ **Fim de Jogo Épico**: Uma tela de pódio mostrando não só o vencedor, mas estatísticas engraçadas como "O Maior Bêbado" e "O Arregão".

-  **Correções**:
  - Caso tenha acontecido um empate, o pôdio deve mostrar todos os jogadores que empataram. Ou algo do tipo.
  - Sobre a música de fundo, quando o jogo termina, a música para. E retorna apenas quando o jogo for reiniciado. Mas, caso o jogador tenha silenciado a música, ela não deve retornar. Apenas se ele deselecionar a opção de silenciar a música. Isso está de acordo ou estou fazendo besteira? 

## Correções

- ✅ **Botão de Sair da Sala e Expulsar Jogador**: O botão para sair do lobby ou expulsar um jogador não está aparecendo em telas pequenas.


## 3. Engajamento Social

- ⏳ **Compartilhamento**: Botão para gerar uma imagem do resultado final para postar no Instagram/WhatsApp.
  - ⏳ **Reações Rápidas**: Permitir que os outros jogadores mandem emojis (🔥, 🍻, 😱) que flutuam na tela durante a vez do outro.

## 5. Novos Rumos (Tema & Monetização) 💰
> **Nota do Usuário (30/12/2025)**:
> - **Novo Tema**: Basear o jogo nos **7 Pecados Capitais** (ou similar) e criar uma lore/história de fundo para dar profundidade.
> - **Monetização**: O jogo terá itens/modos pagos ou premium.
>   - *Ideias*: Avatares exclusivos, Baralhos temáticos (ex: "Baralho da Luxúria" +18 pesado, "Baralho da Ira" hardcore), Efeitos visuais de power-ups.
> - **Eventos do Caos** (Sugestões):
>     1. 👑 **O Ditador**: Jogador cria regra física por 3 rodadas e multa quem quebrar.
>     2. 💣 **Modo Blitz**: Timer reduz para 5s. Tela vermelha pulsando.
>     3. 🎭 **Troca de Corpos**: Avatares e nomes embaralhados visualmente.


## 4. Técnico

- ⏳ **Cloud Functions**: Mover a lógica crítica (sorteio, pontuação, passar vez) para o backend (Firebase Functions) para evitar que usuários mal-intencionados manipulem o jogo pelo console do navegador.
- ⏳ **Presença Online**: Melhorar o sistema de "Online/Offline" para remover jogadores que fecharam a aba mais rapidamente.


- Criar logica para caso um jogador não votar ainda o administrador não pode avançar a rodada. Ou dever confirmar se quer avançar a rodada mesmo sem todos os votos. (Modos Eu nunca e amigos de merda)

## Refatorações

- Jogo.jsx parece está muito grande e complexo. Podemos refatorar para melhorar a legibilidade e manutenção do código.
- Outras refatorações que possam ser necessárias:
  - 
## Status das Implementações Recentes

- ✅ Implementar lógica de votação para "Amigos de Merda". (Travas de Segurança Adicionadas)
- ✅ Refinar fluxo de "Verdade ou Desafio" (escolha prévia e modal).
- ✅ Adicionar efeitos sonoros e animações avançadas.
- ✅ Sair da Sala e Sucessão de Host.
- ⏳ Implementar poderes especiais (escudo, vingança, troca).
- ⏳ Adicionar rodadas especiais (rodada do caos).
- ✅ Tela de Fim de Jogo Épico (Pódio e Estatísticas).