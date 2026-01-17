# Arquitetura do Projeto - Apocalipticos

Este documento descreve como o projeto está estruturado e como os dados fluem entre os componentes.

## 🏗️ Visão Geral

O **Apocalipticos** é uma aplicação **Single Page Application (SPA)** construída com React. A lógica de jogo é descentralizada e sincronizada via **Firebase Firestore** em tempo real. Não há um servidor backend dedicado rodando lógica de jogo (Node.js, Python, etc); o "servidor" é o próprio Firestore agindo como fonte da verdade.

## 📂 Estrutura de Diretórios

```
src/
├── components/      # Componentes visuais (UI)
│   ├── game/        # Componentes específicos da tela de jogo (Timer, Cartas, Ações)
│   │   └── chaos/   # Overlay e Lógica Visual dos Eventos do Caos (ChaosEventOverlay)
│   ├── lobby/       # Componentes do Lobby
│   └── ...
├── context/         # Gerenciamento de estado global
│   └── AuthContext  # Gerencia o usuário logado (anônimo)
├── data/            # Dados estáticos (updates, regras)
├── hooks/           # Custom Hooks (Lógica reutilizável)
│   ├── game/        # Hooks de lógica de jogo (useGameRoom, useGameActions...)
│   └── useSounds.js # Gerenciador de Áudio
├── firebase/        # Camada de integração com o Backend
│   ├── config.js    # Inicialização do Firebase
│   └── game.js      # Funções de lógica de jogo (sorteio, turnos, votos)
├── pages/           # Rotas da aplicação (Home, Jogo, Lobby)
└── constants/       # "Magic strings" e configurações globais
```

## 🔄 Fluxo de Dados (Game Loop)

1.  **Criação de Sala**: O ADM cria um documento em `salas/{codigo}`.
2.  **Entrada**: Jogadores são adicionados à subcoleção `salas/{codigo}/jogadores`.
3.  **Sincronização**:
    - O hook **`useGameRoom`** estabelece listeners (`onSnapshot`) nos documentos da sala e subcoleção de jogadores.
    - Qualquer mudança no banco reflete instantaneamente no estado local.
4.  **Ações**:
    - Quando um jogador clica em "Sortear Carta", uma função em `firebase/game.js` é chamada.
    - Essa função atualiza o campo `cartaAtual` no Firestore.
    - Todos os clientes recebem a atualização e renderizam a carta.
5.  **Votação (Amigos de Merda)**:

    - Votos são salvos na subcoleção `salas/{codigo}/votos`.
    - O cliente monitora essa coleção e calcula o resultado quando todos votam.

6.  **Eventos do Caos (RPG)**:

    - Cartas do tipo "CAOS" ativam o `ChaosEventOverlay`.
    - Estados complexos (Votação, Moeda, Duelo) são persistidos no campo `activeEvents` da sala.
    - Mecânicas persistentes (ex: Luxúria, Orgulho) continuam ativas por N rodadas, modificando regras em `useGameActions`.

7.  **Botão Sair: No canto superior direito da tela do jogo, tem um ícone de "Sair".**
    - Confirmação: Ao clicar, o jogo pergunta "Tem certeza?".
    - Sucessão de Poder:
    - Se um jogador comum sair, ele só é removido.
    - Se o Admin (Host) sair, o sistema automaticamente promove o jogador mais antigo da sala para ser o novo Admin.
    - Se for o último jogador a sair, a sala é marcada como abandonada.

## 🔐 Segurança e Regras

- **Autenticação**: Gerenciada inteiramente pelo **Firebase Auth**.
  - **Anônima**: Padrão para entrada rápida.
  - **Google**: Vinculação opcional para persistência de dados e perfil.
- **Persistência**: Dados do usuário (nome, avatar, stats) salvos na coleção `users` no Firestore, vinculados ao UID.

## 🎨 Design System

- Utilizamos **TailwindCSS** para estilização.
- Animações são feitas com **Framer Motion**.
