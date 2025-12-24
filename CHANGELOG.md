# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.
## [Não Lançado] - 2025-12-24

### Adicionado

- **Feedback Visual de Saída**: Implementado Toast notification e animação de fade-out quando jogadores saem da sala.
- **Polimento Visual**:
  - Toasts customizados com tema Dark/Neon.
  - Animação de entrada e "flip" 3D para as cartas.
- **Efeitos Sonoros**: Integração inicial de sons para ações principais (Flip, Sucesso, Falha, Votação, Sair).
- **Tratamento de Empate**: No modo "Amigos de Merda", se houver empate, todos os mais votados recebem penalidade.

## [Não Lançado] - 2025-12-23

### Adicionado

- **Modo Amigos de Merda**:
  - Implementado sistema de votação secreta ("Quem é mais provável de...").
  - Tela de revelação do "vencedor" com destaque visual.
  - Penalidade automática (+1 bebida) para o mais votado.
  - Novas cartas adicionadas ao seed database.

### Corrigido

- **Lobby Responsivo**: Botões de "Sair" e "Expulsar" ajustados para telas pequenas (nomes longos são truncados).
- **Migração de Host**: O Host agora pode sair da sala pelo Lobby, transferindo a liderança automaticamente.
- **Renderização de Avatares**: Corrigido bug onde avatares apareciam como URLs de texto na votação.

## [Não Lançado] - 2025-12-16

### Corrigido

- **Ranking**: Corrigido bug que não atualizava o ranking dos jogadores com mais pontos.

### Refatorado

- **Ranking**: Refatorado para melhorar a performance e a experiência do usuário.

## [Não Lançado] - 2025-12-15

### Refatorado

- **Sistema de Som (`useSounds`)**:
  - Implementado controle genérico de música de fundo (`toggleMusic`).
  - Sincronização de estado entre componentes (`playingBgMusic`).
  - Botão de volume na tela de Jogo agora controla independentemente a música da partida.

  Guia de Refatoração do Controle de Som
Refatorei a lógica de controle de som para permitir a ativação/desativação genérica da música de fundo, possibilitando que a música do jogo seja controlada da mesma forma que a música da tela inicial.

Alterações
1. Refatorado o arquivo `useSounds.js`
Substituí o booleano simples `isMusicPlaying` por `playingBgMusic` (string) para rastrear qual faixa está sendo reproduzida.

Adicionada a função `toggleMusic(type)` para lidar com qualquer faixa de fundo.

Atualizadas as funções `playHome` / `playJogo` para sincronizar com o novo estado.

2. Atualizado o arquivo `Home.jsx`
Agora utiliza `toggleMusic("musicaTema")`

O botão de volume reflete o estado de musicaTema.

3. Atualizado o arquivo `Jogo.jsx`
Agora utiliza toggleMusic("musicaJogo")

O botão de volume reflete o estado de musicaJogo.

Resultados da verificação
Verificação manual

Música da tela inicial: Inicia ao carregar e alterna corretamente com o botão.

Música do jogo: Inicia ao carregar e alterna corretamente com o botão no jogo e no lobby.

Sincronização de estado: Alternar uma das opções atualiza o estado do ícone corretamente, sem necessidade de recarregar a página.

## [Não Lançado] - 2025-12-12

### Adicionado

- **Sistema de Avatares Dinâmicos (DiceBear)**: Substituída a seleção de emojis estáticos por avatares gerados proceduralmente.
  - Integração com API DiceBear v7.x.
  - 5 Estilos visuais: Robôs, Aventureiros, Cartoon, Pessoas e Emojis.
  - Funcionalidade de "Randomizar" para gerar faces únicas.
  - Persistência visual no Lobby e Ranking.
- **Admin Avatar**: O criador da sala agora também pode personalizar seu avatar durante a criação da sala.

## [Não Lançado] - 2025-11-27

### Adicionado

- **Confirmação do Admin**: O Host da sala agora precisa confirmar se o jogador cumpriu o desafio antes de os pontos serem atribuídos.
- **Sistema de Pontuação**:
  - Sucesso (Confirmado pelo Admin): +10 pontos.
  - Falha/Recusa: -5 pontos.
  - Pontuação mínima fixada em 0 (não fica negativa).
- **Penalidade por Tempo**: Se o tempo (30s) esgotar sem ação, o jogador recebe penalidade (-5 pontos) e a vez passa automaticamente.
- **Feedback Visual**: Toast notifications para ganho/perda de pontos.
- **Sair da Sala**: Botão para sair do jogo com confirmação.
- **Migração de Host**: Se o Admin sair, a liderança passa automaticamente para o jogador mais antigo da sala.
- **Modal Personalizado**: Confirmação de saída usa o design do sistema (`ConfirmModal`) em vez de alertas do navegador.

### Corrigido

- **Display do Jogador Atual**: Corrigido bug onde o UID era exibido no lugar do nome do jogador no cabeçalho.
- **Mensagem de Espera**: A mensagem "Aguardando carta..." agora mostra explicitamente o nome do jogador que deve jogar.
- **AuthContext**: Corrigido erro onde `user` era `undefined` no `Jogo.jsx`, impedindo o reconhecimento do jogador atual.
- **React Warnings**:
  - Removido prop `timeLeft` inválida de elemento DOM.
  - Corrigido `ReferenceError: React is not defined` em alguns componentes.
  - **Inicialização de Sala**: Corrigido bug onde novos jogos não sorteavam o primeiro jogador, travando o início.
  - **Ranking**: Corrigido bug onde a pontuação aparecia como 0 (erro de nome de propriedade `pontuacao` vs `pontos`).
  - **Contador de Bebidas**: Agora incrementa corretamente quando o jogador recusa ou recebe penalidade.
  - **Fluxo de Recusa**: Adicionada etapa de confirmação do Admin quando um jogador decide "Recusar" (beber).
- **Seed Database**: Corrigido script de seed para funcionar com variáveis de ambiente locais, permitindo popular cartas "Eu Nunca".

### Detalhes da versão

Correções Críticas:
- Inicialização de salas (jogadores não eram reconhecidos).
- Ranking (pontuação zerada).
- Script de Seed (cartas "Eu Nunca" sendo cadastradas novas com o tempo).

Novas Funcionalidades:
- Contador de Bebidas: Agora sabemos quem bebeu mais! 🍺
# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Não Lançado] - 2025-11-27

### Adicionado

- **Confirmação do Admin**: O Host da sala agora precisa confirmar se o jogador cumpriu o desafio antes de os pontos serem atribuídos.
- **Sistema de Pontuação**:
  - Sucesso (Confirmado pelo Admin): +10 pontos.
  - Falha/Recusa: -5 pontos.
  - Pontuação mínima fixada em 0 (não fica negativa).
- **Penalidade por Tempo**: Se o tempo (30s) esgotar sem ação, o jogador recebe penalidade (-5 pontos) e a vez passa automaticamente.
- **Feedback Visual**: Toast notifications para ganho/perda de pontos.
- **Sair da Sala**: Botão para sair do jogo com confirmação.
- **Migração de Host**: Se o Admin sair, a liderança passa automaticamente para o jogador mais antigo da sala.
- **Modal Personalizado**: Confirmação de saída usa o design do sistema (`ConfirmModal`) em vez de alertas do navegador.
- **Contador de Bebidas**: Agora sabemos quem bebeu mais! 🍺
- **Confirmação do Admin**: O Host tem controle total sobre quem cumpriu ou recusou desafios.
- **Sair da Sala & Sucessão**: Jogadores podem sair, e se o Admin sair, o jogo continua com um novo líder automaticamente.
- **UI Polida**:
  - Modal de saída personalizado com botões temáticos.
- **Modo Eu Nunca**:
  - Implementada lógica onde **todos os jogadores** interagem com a carta.
  - **Feedback em Tempo Real**: Grid de jogadores exibe quem bebeu (🍺) e quem se salvou (😇) instantaneamente.
  - **Animações**: Efeitos visuais ao selecionar uma opção.
  - **Sincronização**: Status de cada jogador é salvo no Firestore e replicado para todos na sala.

### Corrigido

- **Display do Jogador Atual**: Corrigido bug onde o UID era exibido no lugar do nome do jogador no cabeçalho.
- **Mensagem de Espera**: A mensagem "Aguardando carta..." agora mostra explicitamente o nome do jogador que deve jogar.
- **AuthContext**: Corrigido erro onde `user` era `undefined` no `Jogo.jsx`, impedindo o reconhecimento do jogador atual.
- **React Warnings**:
  - Removido prop `timeLeft` inválida de elemento DOM.
  - Corrigido `ReferenceError: React is not defined` em alguns componentes.
  - **Inicialização de Sala**: Corrigido bug onde novos jogos não sorteavam o primeiro jogador, travando o início.
  - **Ranking**: Corrigido bug onde a pontuação aparecia como 0 (erro de nome de propriedade `pontuacao` vs `pontos`).
  - **Contador de Bebidas**: Agora incrementa corretamente quando o jogador recusa ou recebe penalidade.
  - **Fluxo de Recusa**: Adicionada etapa de confirmação do Admin quando um jogador decide "Recusar" (beber).
- **Seed Database**: Corrigido script de seed para funcionar com variáveis de ambiente locais, permitindo popular cartas "Eu Nunca".

### Detalhes da versão

Correções Críticas:
- Inicialização de salas (jogadores não eram reconhecidos).
- Ranking (pontuação zerada).
- Script de Seed (cartas "Eu Nunca" sendo cadastradas novas com o tempo).