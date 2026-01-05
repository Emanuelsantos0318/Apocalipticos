# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Não Lançado] - 2026-01-05

### Adicionado

- **Sistema de Autenticação Robusto**:
  - **Login Google**: Usuários podem vincular conta Google para salvar progresso.
  - **Identidade Persistente**: Login anônimo agora é salvo no dispositivo; dados não são perdidos ao fechar o navegador.
  - **Link de Contas**: Converter conta anônima para Google sem perder dados.
- **Melhorias de UX (Lobby)**:
  - **Preenchimento Automático**: Ao criar/entrar em salas, nome e foto são puxados do perfil do usuário logado.
  - **Logout**: Opção de sair da conta no menu principal.
- **Planejamento RPG (Documentação)**:
  - Definidas mecânicas de **HP (Vida)** e **Modo Crítico**.
  - Detalhadas 5 Classes: Médico, Assassino, Estrategista, Incendiária, Sobrevivente.
  - Criados "Eventos do Caos" baseados nos 7 Pecados Capitais.
- **Modo Amigos de Merda**:
  - Implementado sistema de votação secreta e penalidades.
- **Modal de Novidades (What's New)**:
  - Implementado modal automático que exibe o changelog para o usuário após uma atualização.
  - Sistema de versionamento via `localStorage` para garantir que o aviso apareça apenas uma vez por versão.
  - Arquivo de configuração `dates/updates.js` para fácil manutenção das notícias.

## [Não Lançado] - 2025-12-30

### Adicionado

- _Update_: Adicionado som de Vitória/Pódio (`vitoria.mp3`).
- **Fim de Jogo Épico (Pódio)**:
  - Implementada tela de Pódio com Top 3 e animações.
  - Premiações especiais: "O Cachaceiro", "O Arregão".
  - Opções de "Novo Jogo" (Reiniciar tudo) e "Voltar ao Lobby" (Nova sala).
- **Power-ups**:
  - Implementada Barra de Power-ups (Escudo, Troca, Vingança) na interface.
  - Lógica de consumo de itens e aplicação de efeitos (pular vez, trocar carta, penalizar outro).

### Refatorado

- **Arquitetura do Jogo**:
  - `Jogo.jsx` refatorado para utilizar **Custom Hooks** (`useGameRoom`, `useGameActions`, `useVoting`, `usePowerUpActions`).
  - Separação clara entre UI e Lógica de Negócio.
  - Remoção de código duplicado e props redundantes.

### Corrigido

- **Ranking Congelado**: Corrigido bug crítico de performance em `useSounds` (falta de memoização) que causava re-renderizações infinitas e desconexão do Firestore para não-admins.
- **Crash na Ação**: Corrigido `ReferenceError: onSnapshot is not defined` que quebrava o jogo ao tentar ouvir atualizações de ações.
- **Header**: Corrigido erro de props `onToggleMusic` não sendo passadas corretamente.
- **Ajuste de sincronia**: Status do Jogo e Lobby sincronizados para evitar loop de reinício.

## [Não Lançado] - 2025-12-24

### Adicionado

- **Feedback Visual de Saída**: Implementado Toast notification e animação de fade-out quando jogadores saem da sala.
- **Polimento Visual**:
  - Toasts customizados com tema Dark/Neon.
  - Animação de entrada e "flip" 3D para as cartas.
- **Efeitos Sonoros**: Integração inicial de sons para ações principais (Flip, Sucesso, Falha, Votação, Sair).
  - _Update_: Substituídos sons de Flip e Sucesso por versões mais sutis (`ding.mp3`, `genio-aparecendo.mp3`).
- **Tratamento de Empate**: No modo "Amigos de Merda", se houver empate, todos os mais votados recebem penalidade.
- **Lógica Verdade ou Desafio**:
  - Implementado `ChoiceModal` para forçar escolha entre "Verdade" 😇 e "Desafio" 😈 antes de revelar a carta.
  - Estratégia "Draw-First" para suportar Modos Mistos (ex: "Eu Nunca" não abre modal).
  - Corrigido bug onde seeds de "Verdade" faltavam no modo Normal.
- **Ferramentas**: Atualizado `seedDatabase.js` para sincronização inteligente (evita duplicatas) e adicionado guia de contribuição.

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
