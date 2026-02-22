# ⚙️ Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [Não Lançado] - 2026-02-06

### Corrigido (Bugs Críticos)

- **Ditador (Orgulho)**: Corrigido bug onde a habilidade "Multar" consumia recursos da classe original do jogador. Agora abre corretamente o menu exclusivo do Ditador.
- **Luxúria (Pacto)**: Implementado sistema de mensagens globais para garantir que o dano compartilhado seja visível para todos os jogadores na sala.

## [Não Lançado] - 2026-02-05

### Adicionado (SEO & Otimização)

- **Skill de Auditoria**: Implementada infraestrutura de auditoria automatizada para SEO e Performance.
- **SEO**:
  - Adicionada `meta description` e tags Open Graph (`og:image`, `og:url` corrigida para Netlify).
  - Melhorada semântica HTML da Home (hierarquia `h2/h3`, links `<a>` em vez de `divs clickáveis`).
- **Performance**:
  - Implementado **Code Splitting** com `React.lazy` para carregamento sob demanda das páginas (Home, Lobby, Jogo).

### Refatorado (Manutenibilidade)

- **Jogo.jsx**:
  - Extraído componente `RevengeSelectorModal` (Seleção de vingança).
  - Extraído componente `ActionStatusBoard` (Painel de confirmação do Admin).
  - Extraído componente `GameStartControls` (Botões de início de turno).
  - Extraído componente `DictatorControls` (Ações do evento Orgulho).
  - Redução significativa de linhas no componente principal.

## [Não Lançado] - 2026-02-04

### Refinado (Responsividade & UX)

- **Mobile First**:
  - **Navbar**: Logo redimensionada e texto oculto em mobile para evitar poluição visual.
  - **Hero Section**: Botões "Começar o Caos" e "Como Jogar" ajustados (`text-lg`) para caber em telas pequenas.
  - **Story Cards**: Padding interno otimizado para leitura em dispositivos móveis.
- **Navegação**:
  - Botão **"Como Jogar"** agora realiza scroll suave (smooth scroll) para o rodapé da página.
- **Correções Visuais**:
  - Aumentado espaçamento superior (`pt-40`) da Hero Section para evitar que o título fique atrás da Navbar fixa.
  - Corrigido typo "APOCALIÍPTICOS" -> "APOCALÍPTICOS".

## [Não Lançado] - 2026-02-03

### Adicionado (Landing Page)

- **Seção de História Expandida**:
  - Implementado layout de 5 cartões detalhando a Lore completa:
    1. **A Grande Traição** (Projeto Aurora).
    2. **Pós-Quarentena Rubra** (Isolamento em Bunkers).
    3. **O Bar Apocalíptico** (Zona Neutra).
    4. **Os Apocalípticos** (Resistência e Vício).
    5. **Protocolo de Sanidade** (Mecânica de Jogo).
  - Design responsivo com ícones e hover effects.
- **Identidade Visual**:
  - Atualizada a Navbar para usar a nova **Logo "Apocalípticos"** (Imagem) com efeitos de brilho e escala.
  - Refinada a tipografia da **Hero Section** para suportar frases de efeito mais longas sem quebrar o layout.
- **Personagens**:
  - Refatorada a seção de personagens para incluir Lore detalhada e seleção interativa.

### Corrigido

- **Hero Typography**: Ajustado tamanho de fonte (`text-4xl` a `text-6xl`) para evitar sobreposição de textos longos.
- **Navbar**: Substituído texto CSS por imagem de alta qualidade para garantir fidelidade à marca.

## [Não Lançado] - 2026-01-18

### Refinado (Eventos do Caos)

- **Ira (Duelo)**:
  - Implementada nova mecânica de Duelo: Seleção de 2 oponentes -> Duelo -> Punição Mútuo/Extra.
  - Interface dedicada "VS" com avatares grandes.
- **Luxúria (Traição)**:
  - Adicionado botão explícito "Trair (Quebrar Pacto)" para parceiros vinculados.
  - Implementada punição mútua (10 Dano) ao trair.
- **Visualização & UI**:
  - **Cartas do Caos**: Agora exibem Título e Ícone corretamente no cartão (antes só mostravam descrição).
  - **Header do Jogo**:
    - Lista de Eventos Ativos agora é compacta e rolável (horizontal scroll) para evitar poluição visual.
    - Avatares "Anterior" e "Próximo" agora visíveis no Mobile (versão compacta).
  - **Privacidade**: Interações do Caos agora aparecem estritamente para o jogador da vez.
  - **Power-Ups**: Ocultos durante Eventos do Caos para evitar conflitos.

### Corrigido

- **Botões "Fantasmas"**: Corrigido bug onde botões de admin/interação apareciam para observadores.

## [Não Lançado] - 2026-01-17

### Corrigido (Eventos do Caos)

- **Gula (Banquete)**:
  - Corrigido travamento por erro de leitura de lista de jogadores (`sala.jogadores` fix).
  - Implementada votação funcional (Safety vs Risk) e Coin Flip.
- **Luxúria (Pacto)**:
  - Corrigido bug onde o jogo travava após selecionar o parceiro (falta de `passarVez`).
  - Corrigido erro de "Habilidade Desconhecida" (`parceiro_luxuria`).
  - Criado evento dinamicamente caso não exista na lista de `activeEvents`.
- **Runtime Errors**:
  - Adicionadas proteções contra crashes em `GameHeader` (nome do evento) e `ChaosEventOverlay`.
- **Timer**:
  - Desativada penalidade padrão de tempo para eventos do Caos (evita "Aceitou Penalidade" indesejado).

## [Não Lançado] - 2026-01-14

### Adicionado

- **Sistema de Eventos do Caos (7 Pecados Capitais)**:
  - **Gula**: Botão "Servir Banquete" (Dano global).
  - **Ira**: Mecânica de Duelo com seleção de alvo.
  - **Luxúria**: Vínculo de Alma (Dano compartilhado).
  - **Preguiça**: Slow Mode (+Tempo) e opção de Pular turnos.
  - **Orgulho**: Ditador com poder de Multar.
  - **Ganância**: Blitz Mode (Timer reduzido).
  - **Inveja**: Mascaramento da UI (Ranking oculto).
- **Interatividade Específica**:
  - Removido fluxo genérico de "Admin Confirma" para eventos do Caos.
  - Jogador ativo (ou Host) agora controla botões específicos (ex: "Servir Banquete", "Desafiar para Duelo").

### Corrigido

- **Race Condition**: Corrigido bug onde novos eventos eram sobrescritos ao passar a vez (`useGameActions`).
- **Luxúria**: Corrigido bug que permitia auto-seleção de parceiro.
- **Reset de Jogo**: Caos agora é limpo corretamente ao reiniciar a partida.
- **UI**: Corrigido crash ao tentar renderizar botões de Caos sem evento ativo.

## [Não Lançado] - 2026-01-10

### Adicionado

- **Sistema de RPG Completo (Classes e Habilidades)**:
  - **Médico**: Habilidade "Tratamento de Risco" (Cura 1 PV, Custo 1+1).
  - **Assassino**: Habilidade "Roubo de Sangue" (Dano 2 PV, Custo 2, Uso Único).
  - **Estrategista**: Habilidade "Plano de Contingência" (Define o próximo jogador, ignorando sorteio).
  - **Incendiária**: Habilidade "Caos Controlado" (Força turno imediato com Dano Dobrado em caso de recusa).
  - **Sobrevivente**: Habilidade Passiva "Último Fôlego" (Trava em 1 HP ao morrer, uma vez por jogo).
  - **Interface**: Modal de Habilidades com seleção de alvos e custos claros.
  - **Feedback Visual**: Botão "Usar Habilidade" integrado à tela de jogo.

### Ajustado

- **GameHeader**: Layout reorganizado para destacar Jogador Atual, Anterior e Próximo.
- **Sobrevivente**: Modal adaptado para indicar "Habilidade Passiva" e bloquear acionamento manual.

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

## [Não Lançado] - 2026-01-06

### Adicionado

- **Seleção de Personagens (RPG Core)**:
  - Implementada tela de seleção de classes no Lobby.
  - 5 Classes Jogáveis: Médico, Assassino, Estrategista, Incendiária, Sobrevivente.
  - Exibição de ícones de classe e backgrounds personalizados na lista de jogadores.
- **Novas Cartas**:
  - Adicionadas categorias "Faz ou Bebe" e "Isso ou Aquilo".
  - Script de seed atualizado para popular o banco com 300+ novas cartas.

### Corrigido

- **Erro de Cartas**: Corrigido bug onde novas categorias não eram reconhecidas na criação da sala (`constants.js`).
- **Seed Database**: Corrigido caminho do arquivo CSV no script de seed.
- **Lobby**: Restaurados imports perdidos que causavam crash na tela de Lobby.

## [Não Lançado] - 2026-01-05

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
