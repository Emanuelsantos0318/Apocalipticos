# Arquitetura do Projeto - Apocalipticos

Este documento descreve como o projeto está estruturado e como os dados fluem entre os componentes.

## 🏗️ Visão Geral

O **Apocalipticos** é uma aplicação **Single Page Application (SPA)** construída com React. A lógica de jogo é descentralizada e sincronizada via **Firebase Firestore** em tempo real. Não há um servidor backend dedicado rodando lógica de jogo (Node.js, Python, etc); o "servidor" é o próprio Firestore agindo como fonte da verdade.

## 📂 Estrutura de Diretórios

```
src/
├── components/      # Componentes visuais (UI)
│   ├── game/        # Componentes específicos da tela de jogo (Timer, Cartas, Ações)
│   ├── lobby/       # Componentes do Lobby
│   └── ...
├── context/         # Gerenciamento de estado global
│   └── AuthContext  # Gerencia o usuário logado (anônimo)
├── firebase/        # Camada de integração com o Backend
│   ├── config.js    # Inicialização do Firebase
│   └── game.js      # Funções de lógica de jogo (sorteio, turnos, votos)
├── pages/           # Rotas da aplicação (Home, Jogo, Lobby)
└── constants/       # "Magic strings" e configurações globais
```

## 🔄 Fluxo de Dados (Game Loop)

1.  **Criação de Sala**: O ADM cria um documento em `salas/{codigo}`.
2.  **Entrada**: Jogadores são adicionados à subcoleção `salas/{codigo}/jogadores`.
3.  **Sincronização**: O componente `Jogo.jsx` usa `onSnapshot` para ouvir mudanças no documento da sala em tempo real.
4.  **Ações**:
    *   Quando um jogador clica em "Sortear Carta", uma função em `firebase/game.js` é chamada.
    *   Essa função atualiza o campo `cartaAtual` no Firestore.
    *   Todos os clientes recebem a atualização e renderizam a carta.
5.  **Votação (Amigos de Merda)**:
    *   Votos são salvos na subcoleção `salas/{codigo}/votos`.
    *   O cliente monitora essa coleção e calcula o resultado quando todos votam.

## 🔐 Segurança e Regras

*   **Autenticação**: Anônima via Firebase Auth. Cada sessão gera um UID único.
*   **Persistência**: O estado do usuário é persistido no LocalStorage para permitir reconexão (refresh da página).

## 🎨 Design System

*   Utilizamos **TailwindCSS** para estilização.
*   Animações são feitas com **Framer Motion**.
