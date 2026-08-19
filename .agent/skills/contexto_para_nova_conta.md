# 🧨 Documento de Transferência de Contexto — Apocalípticos

> **Gerado em:** 19/08/2026  
> **Finalidade:** Passar todo o contexto do projeto para uma nova conta do Google no Antigravity IDE.

---

## 1. 👤 Identidade do Projeto

| Campo             | Valor                                                          |
| :---------------- | :------------------------------------------------------------- |
| **Nome**          | Apocalípticos                                                  |
| **Tipo**          | Drinking Game Multiplayer Online (Party Game)                  |
| **Status**        | Em Desenvolvimento Ativo                                       |
| **Repositório**   | https://github.com/Emanuelsantos0318/Apocalipticos             |
| **Caminho Local** | `f:\produto\ver.2\Apocalipticos`                               |
| **Deploy**        | Vercel / Firebase Hosting (ainda não em produção)              |

### 👥 Autores
| Nome          | GitHub                                                 |
| :------------ | :----------------------------------------------------- |
| Mateus Sanfer | https://github.com/MateusSanfer                        |
| Emanuel Santos| https://github.com/Emanuelsantos0318                   |

---

## 2. 🏗️ Stack Tecnológica

| Tecnologia         | Versão   | Papel                                 |
| :----------------- | :------- | :------------------------------------ |
| **React**          | ^18.3.1  | UI (SPA)                              |
| **Vite**           | ^6.3.5   | Build Tool                            |
| **TailwindCSS**    | ^4.1.6   | Estilização                           |
| **Framer Motion**  | ^12.16.0 | Animações                             |
| **Firebase**       | ^11.7.1  | Firestore (BD) + Auth                 |
| **React Router**   | ^7.5.3   | Roteamento                            |
| **Lucide React**   | ^0.509.0 | Ícones                                |
| **React Hot Toast**| ^2.5.2   | Notificações                          |
| **DiceBear API**   | v7.x     | Avatares gerados proceduralmente      |

### Scripts disponíveis
```bash
npm run dev       # Dev server
npm run build     # Build de produção
npm run lint      # ESLint
npm run seed      # Popular banco de cartas no Firebase
```

---

## 3. 🏛️ Arquitetura

O projeto é uma **SPA Serverless**. Não há backend dedicado — o **Firebase Firestore** é a **Fonte da Verdade** e sincroniza dados em tempo real via `onSnapshot`.

### Estrutura de Diretórios

```
f:\produto\ver.2\Apocalipticos\
├── src/
│   ├── App.jsx                    # Roteador principal
│   ├── main.jsx                   # Entry point com Lazy Loading
│   ├── index.css                  # Estilos globais
│   ├── components/
│   │   ├── game/                  # Componentes da tela de jogo
│   │   │   ├── chaos/
│   │   │   │   └── ChaosEventOverlay.jsx   # Overlay dos 7 Pecados
│   │   │   ├── ActionStatusBoard.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── CardDisplay.jsx
│   │   │   ├── ChoiceModal.jsx
│   │   │   ├── ClassAbilityModal.jsx
│   │   │   ├── DictatorControls.jsx
│   │   │   ├── GameHeader.jsx
│   │   │   ├── GameStartControls.jsx
│   │   │   ├── PlayerActions.jsx
│   │   │   ├── PlayerStatusGrid.jsx
│   │   │   ├── Podium.jsx
│   │   │   ├── PowerUpBar.jsx
│   │   │   ├── RevengeSelectorModal.jsx
│   │   │   ├── Timer.jsx
│   │   │   └── VotingArea.jsx
│   │   ├── lobby/
│   │   ├── modals/
│   │   │   ├── AuthModal.jsx
│   │   │   └── CreateRoomModal.jsx
│   │   ├── ranking/
│   │   ├── Header.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── MainButton.jsx
│   │   └── PageLayout.jsx
│   ├── constants/
│   │   ├── chaosEvents.js         # Definição dos 7 Eventos do Caos
│   │   ├── constants.js           # Magic strings e configs
│   │   ├── gameRules.js           # Regras de jogo
│   │   └── roles.js               # Definição das 6 Classes RPG
│   ├── context/
│   │   └── AuthContext            # Gerencia usuário logado
│   ├── data/                      # Dados estáticos
│   ├── firebase/
│   │   ├── config.js              # Inicialização Firebase
│   │   ├── game.js                # Lógica de sorteio/turnos/votos
│   │   ├── jogadores.js           # Funções de jogadores
│   │   ├── rooms.js               # Funções de sala
│   │   └── seedDatabase.js        # Script de seed do banco
│   ├── hooks/
│   │   ├── game/
│   │   │   ├── useGameActions.js  # Sorteio, pontuação, penalidades, turnos
│   │   │   ├── useGameRoom.js     # Subscriptions Firestore
│   │   │   ├── usePowerUpActions.js
│   │   │   ├── useRPG.js          # Lógica das habilidades das classes
│   │   │   └── useVoting.js       # Lógica de votação (Amigos de Merda)
│   │   └── useSounds.js           # Gerenciador de áudio
│   ├── pages/
│   │   ├── Home.jsx               # Tela principal com modais de sala
│   │   ├── Jogo.jsx               # Tela de jogo principal (22KB)
│   │   ├── Lobby.jsx              # Sala de espera
│   │   ├── AboutUs.jsx
│   │   ├── TermsOfUse.jsx
│   │   ├── ErrorPage.jsx
│   │   └── landing/
│   │       └── LandingPage.jsx    # Landing page do jogo
│   └── utils/
├── public/
├── docs/images/                   # Screenshots para README
├── obsidian/
│   └── FUNCIONALIDADES_PLANEJADAS.md  # Documento vivo de planejamento
├── ARCHITECTURE.md
├── BEST_PRACTICES.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── DOCUMENTACAO_DO_SISTEMA.md
├── LORE_DO_JOGO.md
├── README.md
├── SEO_REPORT.md
├── TIMELINE.md
├── WEB_PERFORMANCE_AUDIT.md
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env                           # Variáveis Firebase (NÃO comitar!)
```

---

## 4. 🔥 Firestore — Modelo de Dados

### Coleção `users`
```json
{
  "uid": "user_123_xyz",
  "nome": "Mateus",
  "email": "mateus@exemplo.com",
  "avatar": "https://api.dicebear.com/7.x/...",
  "criadoEm": "Timestamp"
}
```

### Coleção `salas`
```json
{
  "roomCode": "ZUMBI-1234",
  "estado": "esperando | em_andamento | finalizado",
  "modo": "normal",
  "jogadorAtual": "uid_do_jogador",
  "cartaAtual": { "id": "...", "texto": "...", "tipo": "..." },
  "activeEvents": [],
  "host": { "uid": "...", "nome": "Admin", "avatar": "☣️" },
  "config": { "tempoResposta": 30, "penalidade": "beber" },
  "criadoEm": "Timestamp",
  "atualizadoEm": "Timestamp"
}
```

### Subcoleção `salas/{roomCode}/jogadores`
```json
{
  "uid": "user_123",
  "nome": "Mateus",
  "avatar": "URL DiceBear",
  "isHost": false,
  "role": "medico",
  "hp": 30,
  "maxHp": 30,
  "isCritical": false,
  "stats": { "cumpriu": 2, "recusou": 1, "bebidas": 3 },
  "pronto": true
}
```

### Subcoleção `salas/{roomCode}/votos`
```json
{ "target": "uid_do_alvo", "timestamp": "Timestamp" }
```

### Coleção `cartas`
```json
{
  "texto": "Qual seu maior segredo?",
  "tipo": "verdade",
  "modo": "normal",
  "categoria": "verdadeDesafio",
  "intensidade": 1
}
```

---

## 5. 🎮 Mecânicas de Jogo

### Modos de Jogo
| Modo        | Faixa Etária | Jogadores | Penalidade           |
| :---------- | :----------- | :-------- | :------------------- |
| Normal      | 14+          | 8         | 1 dose               |
| Adulto +18  | 18+          | 10        | 2 doses              |
| Difícil     | 16+          | 6         | Bebida + Desafio Extra |

### Tipos de Cartas
| Tipo             | Nome                | Mecânica                                         |
| :--------------- | :------------------ | :----------------------------------------------- |
| `verdadeDesafio` | Verdade ou Desafio  | Escolha e depois sorteia carta                   |
| `decisoes`       | Decisões de Merda   | Situação absurda com prenda                      |
| `votacao`        | Amigos de Merda     | Votação secreta → mais votado bebe               |
| `euNunca`        | Eu Nunca            | Quem já fez, bebe                                |

### Sistema de Pontuação (RPG)
- **HP Inicial:** 30 PV
- **Sucesso (confirmado pelo Admin):** +10 pts
- **Falha/Recusa:** -5 pts
- **Modo Crítico:** 0 PV → penalidades x2
- **Classe Sobrevivente:** Trava em 1 PV (uso único)

### Power-Ups
- **Escudo** — Protege contra penalidade
- **Troca** — Troca a carta
- **Vingança** — Aplica penalidade a outro

---

## 6. 🧟 Sistema de Classes (RPG)

| Classe        | Habilidade              | Efeito                                           | Custo          |
| :------------ | :---------------------- | :----------------------------------------------- | :------------- |
| 🩺 Médico     | Tratamento de Risco     | Cura +1 PV (não pode curar o mesmo 2x seguidas)  | 1 dose + 1 (paciente) |
| 🔪 Assassino  | Roubo de Sangue         | Rouba 2 PV de alvo (uso único)                   | 2 doses        |
| 🧠 Estrategista| Plano de Contingência  | Altera ordem dos jogadores                       | 1 dose         |
| 🔥 Incendiária| Caos Controlado         | Força alguém a comprar desafio (recusa = x2)     | 2 doses        |
| ☠️ Sobrevivente| Último Fôlego          | Quando chegaria a 0 PV, permanece em 1 (1x/jogo) | 2 doses (auto) |
| 🍺 Barman     | A Saideira              | Força alguém a repetir último desafio (recusa=x2) | 1 dose + 1    |

**Estrutura JSON das Classes** (em `src/constants/roles.js`):
```javascript
NOME: {
  id, name, icon, color, bg, border, image, description,
  ability: { name, effect, cost, cooldown }
}
```

---

## 7. ☣️ Eventos do Caos (7 Pecados Capitais)

Cartas raras (20% de chance) com mecânicas especiais, armazenadas em `activeEvents` da sala.

| Pecado       | Nome                 | Mecânica Principal                                          | Status   |
| :----------- | :------------------- | :---------------------------------------------------------- | :------- |
| 👑 Orgulho   | Ditador Supremo      | Jogador vira Ditador por 3 rodadas, aplica multas           | ✅ Impl. |
| 💣 Ganância  | Modo Blitz           | Timer cai de 30s → 5-10s, penalidade triplicada             | ✅ Impl. |
| 🎭 Inveja    | Troca de Corpos      | Avatares e nomes embaralhados na tela por 4 rodadas         | ✅ Impl. |
| 🍔 Gula      | Banquete Tóxico      | Escolha: Segurança (1 dose) ou Risco (moeda: 0 ou 3 doses)  | ✅ Impl. |
| 😡 Ira       | Surto de Violência   | Escolhe 2 oponentes para duelo, define quem bebe extra      | ✅ Impl. |
| 😴 Preguiça  | Abrigo Adormecido    | Timer → 45s, pode pular vez por 1 dose                      | ✅ Impl. |
| 💔 Luxúria   | Pacto Proibido       | Vínculo entre 2 jogadores: dano compartilhado, traição c/ punição | ✅ Impl. |

---

## 8. 🔐 Autenticação

- **Anônima**: Padrão para entrada rápida (sem cadastro)
- **Google**: Login para persistência de dados/perfil
- **Vinculação**: Conta anônima pode ser convertida para Google sem perder dados
- **Variáveis de Ambiente** (`.env`):
  ```
  VITE_API_KEY=
  VITE_AUTH_DOMAIN=
  VITE_PROJECT_ID=
  VITE_STORAGE_BUCKET=
  VITE_MESSAGING_SENDER_ID=
  VITE_APP_ID=
  ```

---

## 9. 📊 Estado Atual do Desenvolvimento

### ✅ Implementado e Funcionando
- [x] Autenticação Anônima + Google + Vinculação de contas
- [x] Sistema de Salas (criar/entrar via código tipo ZUMBI-1234)
- [x] Lobby em tempo real com avatares DiceBear
- [x] Seleção de Personagem (6 classes RPG)
- [x] Core do jogo: sorteio, timer, pontuação, penalidades
- [x] Todos os 4 tipos de cartas funcionando
- [x] Sistema de HP (30 PV) + Modo Crítico
- [x] Habilidades de classe implementadas
- [x] Power-Ups (Escudo, Troca, Vingança)
- [x] Todos os 7 Eventos do Caos implementados
- [x] Pódio (tela de fim de jogo) com Top 3 e premiações
- [x] Efeitos Sonoros (useSounds.js)
- [x] Landing Page com Lore completa
- [x] Migração de Host (Admin sai → jogador mais antigo assume)
- [x] Sucessão de Admin automática
- [x] Code Splitting com React.lazy
- [x] SEO (meta tags, Open Graph, hierarquia de headings)
- [x] Modal "What's New" (novidades por versão)
- [x] Tela "Sobre Nós" e "Termos de Uso"

### ⏳ Pendente / Bugs Conhecidos
- [ ] **Repetição de Cartas**: Mesma carta sorteada várias vezes (falta histórico de cartas usadas na sessão)
- [ ] **Modo Crítico**: Bug visual — em telas pequenas aparece como 30 PV; também volta a 30 PV após algum tempo sem cura
- [ ] **Barman**: Habilidade não está funcionando corretamente
- [ ] **Ditador (Orgulho)**: Ao aplicar multa, recebe penalidade de habilidade de personagem em vez da penalidade do evento
- [ ] **Luxúria**: Mensagem de penalidade compartilhada não aparece para o segundo jogador vinculado
- [ ] **Decisões de Merda**: Admin não está confirmando se o jogador cumpriu a tarefa
- [ ] **PowerUps durante Eventos do Caos**: Aparecem quando não deveriam
- [ ] **Landing Page**: Delay grande ao trocar cards de personagens (possível lentidão Firebase)
- [ ] **Eventos sobrepostos**: Um evento pode desativar outro quando estão ambos ativos

### 🔜 Planejado (Futuro)
- [ ] Histórico de partidas
- [ ] Chat no Lobby
- [ ] Tela de Perfil completa (senha, email, DOB, gênero, privacidade)
- [ ] Cloud Functions (mover lógica de sorteio para servidor por segurança)
- [ ] Compartilhamento de resultado (imagem para Instagram/WhatsApp)
- [ ] Reações flutuantes (emojis que aparecem na tela)
- [ ] Refatorar LandingPage.jsx (>400 linhas)
- [ ] Monetização: Avatar IA Premium, Baralhos Premium, Cosméticos
- [ ] Custom Characters via IA (Fase V3)

---

## 10. 🕹️ Fluxo de Dados (Game Loop)

```
1. ADM cria sala → documento em salas/{codigo}
2. Jogadores entram → adicionados em salas/{codigo}/jogadores
3. useGameRoom estabelece onSnapshot → sincronização em tempo real
4. Jogador da vez sorteia carta → firebase/game.js atualiza cartaAtual
5. Todos recebem update → renderizam a carta
6. Votação → votos em salas/{codigo}/votos
7. Eventos do Caos → persistidos em activeEvents da sala
8. Habilidades persistentes (Luxúria, Orgulho) → modificam regras em useGameActions
```

---

## 11. 🎨 Design System

- **Background**: Tons escuros (preto/cinza-900) — estética apocalíptica
- **Acentos**: Roxo neon, verde tóxico, laranja alerta
- **Fonte**: Bebas Neue (configurada) + Inter/Roboto (corpo)
- **Animações**: Framer Motion (flip de cartas, entrada de elementos, pódio)
- **Avatares**: DiceBear v7.x — estilos: `bottts`, `adventurer`, `lorelei`, `avataaars`, `fun-emoji`
- **Mobile First**: Interface projetada primariamente para celulares (portrait)

---

## 12. 🔄 Commits Recentes (últimos 20)

```
647c7cc fix: corrige comportamento do botao voltar nas telas sobre e termos
a8356c5 feat: adiciona pagina sobre os autores e integra nos rodapes
0c2474a feat: adiciona termos de uso e checkbox de aceite obrigatorio nos modais
3545ba9 fix: remove pacotes obsoletos e resolve vulnerabilidades de seguranca
660160e feat: implement home page with auth integration and room management features
8447630 feat: implementa estrutura inicial do jogo com novas páginas, lógica de RPG, personagens e corrige bugs críticos de habilidades
8b14c23 docs: atualiza changelog com melhorias de seo e refatoracao
99a7acc docs: atualiza lista de bugs conhecidos e melhorias planejadas
8642ac7 refactor(game): extrai componentes visuais do Jogo.jsx para manutenibilidade
cd7dacf fix(seo): adiciona meta tags, corrige hierarquia e atualiza url do og
525e359 feat: adiciona skills de auditoria, relatorios e implementa code splitting
bb28c6a fix: resolve Chaos Events (Envy, Dictator) and Navigation (Exit Room) issues
059331d fix(landing): improve responsiveness, fix nav overlap, and adjust mobile UI
f5edd3c feat(ui): configure Bebas Neue font
3b32943 feat(landing): refactor lore section, update characters, and enhance navbar logo
7565744 fix(ui): enhance game header density, card titles and privacy
e00a458 feat(chaos): refine wrath duel and lust betrayal mechanics
```

---

## 13. 📐 Convenções e Boas Práticas Adotadas

1. **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `test:`
2. **Commits atômicos**: Commit só ao finalizar uma Task completa (confirmação antes)
3. **Custom Hooks**: Lógica de negócio separada da UI (Container vs Presentational)
4. **Componentes "Burros"**: Só recebem props, não acessam Firebase diretamente
5. **Firebase Firestore**: Única fonte da verdade (sem backend próprio)
6. **Variáveis de ambiente**: Credenciais Firebase nunca comitadas (`.env` no `.gitignore`)
7. **Lazy Loading**: Páginas carregadas sob demanda com `React.lazy`

---

## 14. 🛠️ Skills do Projeto (`.agent/skills/`)

- **seo-audit**: Skill de auditoria de SEO do projeto (configurada localmente)

---

## 15. 🚀 Como Retomar o Projeto

1. Abrir o workspace em `f:\produto\ver.2\Apocalipticos`
2. O modelo de preferência é **Claude Sonnet (Thinking)**
3. Idioma de conversa: **Português BR**
4. Commits seguem **Conventional Commits em PT-BR**
5. **Não commitar** a cada interação — só ao finalizar uma Task completa
6. Perguntar confirmação antes de commitar: _"Posso realizar o commit desta Task?"_
7. Arquivos de documentação-chave para contexto:
   - `CHANGELOG.md` — histórico completo de implementações
   - `obsidian/FUNCIONALIDADES_PLANEJADAS.md` — bugs e features detalhados
   - `ARCHITECTURE.md` — visão geral da arquitetura
   - `DOCUMENTACAO_DO_SISTEMA.md` — regras de negócio detalhadas
