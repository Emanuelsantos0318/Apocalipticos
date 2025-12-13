# Documentação do Sistema - Apocalipticos

**Versão:** 2.0
**Data:** 01/12/2025
**Status:** Em Desenvolvimento

---

## 1. Introdução

### 1.1 Propósito
Este documento tem como objetivo detalhar a arquitetura, regras de negócio, funcionalidades e especificações técnicas do jogo **Apocalipticos**. Ele serve como referência para desenvolvedores, designers e stakeholders, garantindo alinhamento sobre o funcionamento do sistema e suas boas práticas.

### 1.2 Escopo
O **Apocalipticos** é um jogo multiplayer de festa (Party Game) desenvolvido como uma **Single Page Application (SPA)**. O jogo foca em interação social através de desafios, perguntas e votações, utilizando sincronização em tempo real para conectar jogadores em uma mesma sala virtual.

### 1.3 Público-Alvo
- Grupos de amigos em festas ou reuniões sociais.
- Jogadores casuais que buscam entretenimento rápido e interativo.
- Faixa etária: Variável conforme o modo de jogo (14+ para Normal, 18+ para Adulto).
- Pessoas que gostam de causar confusão e intrigas no grupo.

---

## 2. Visão Geral do Sistema

### 2.1 Arquitetura
O sistema segue uma arquitetura **Serverless** e **Decentralized Game Logic**, onde o cliente (Frontend) detém a lógica de apresentação e regras imediatas, enquanto o **Firebase Firestore** atua como a "Fonte da Verdade" (Source of Truth) e barramento de eventos em tempo real.

- **Frontend**: React (Vite), TailwindCSS, Framer Motion.
- **Backend / Database**: Firebase Firestore (NoSQL).
- **Autenticação**: Firebase Auth (Anônima).
- **Hospedagem**: Vercel / Firebase Hosting (Agnóstico).

### 2.2 Tecnologias Principais
| Tecnologia | Função | Justificativa |
| :--- | :--- | :--- |
| **React** | Biblioteca de UI | Componentização e reatividade eficiente. |
| **Vite** | Build Tool | Rapidez no desenvolvimento e build otimizado. |
| **Firebase Firestore** | Banco de Dados | Sincronização em tempo real (listeners) essencial para o jogo. |
| **TailwindCSS** | Estilização | Desenvolvimento rápido e design consistente. |
| **Framer Motion** | Animações | Feedback visual rico e micro-interações. |

---

## 3. Regras de Negócio e Mecânicas de Jogo

### 3.1 Modos de Jogo
O sistema suporta diferentes modos que alteram as regras e o conteúdo disponível:

| Modo | Faixa Etária | Jogadores (Máx) | Categorias Permitidas | Penalidade |
| :--- | :--- | :--- | :--- | :--- |
| **Normal** | 14+ | 8 | Verdade/Desafio, Eu Nunca | Beber (1 dose) |
| **Adulto (+18)** | 18+ | 10 | Todas | Beber (2 doses) |
| **Difícil** | 16+ | 6 | Verdade/Desafio, Decisões de Merda | Extrema (Bebida + Desafio Extra) |

### 3.2 Tipos de Cartas
As cartas são o motor do jogo e determinam a interação da rodada:
1.  **Verdade (Truth)**: Pergunta que o jogador deve responder honestamente.
2.  **Desafio (Dare)**: Ação física ou social que o jogador deve executar.
3.  **Eu Nunca (Never Have I Ever)**: Afirmação; quem já fez, sofre a penalidade.
4.  **Amigos de Merda (Shitty Friends)**: Votação em grupo para decidir quem melhor se encaixa na descrição.
5.  **Decisões de Merda**: Escolhas difíceis entre duas opções ruins.

### 3.3 Fluxo da Partida (Game Loop)
1.  **Lobby**:
    - Criação da sala pelo Host.
    - Entrada dos jogadores via Código da Sala.
    - Seleção de Avatar e Nome.
2.  **Início**:
    - O Host inicia a partida.
    - O sistema sorteia o primeiro jogador.
3.  **Rodada**:
    - **Sorteio**: O jogador da vez sorteia uma carta.
    - **Ação**:
        - Se for *Verdade/Desafio*: O jogador cumpre ou recusa (bebe).
        - Se for *Votação*: Todos votam em um alvo.
    - **Conclusão**: O estado é atualizado e a vez passa para o próximo.
4.  **Fim**:
    - O jogo pode ser encerrado manualmente ou por limite de rodadas (configurável).

### 3.4 Gestão de Sala
- **Sucessão de Host**: Se o criador da sala sair, o sistema promove automaticamente o jogador mais antigo como novo Admin.
- **Abandono**: Se todos saírem, a sala é marcada como `ABORTED` ou excluída.
- **Validação**: O sistema impede a entrada em salas cheias ou inexistentes.

---

## 4. Modelo de Dados (Firestore Schema)

A estrutura do banco de dados é NoSQL, otimizada para leituras em tempo real.

### Coleção `salas` (Documento da Sala)
Representa o estado global de uma partida.
```json
{
  "roomCode": "ZUMBI-1234",
  "estado": "esperando | em_andamento | finalizado",
  "modo": "normal",
  "jogadorAtual": "uid_do_jogador",
  "cartaAtual": { "id": "...", "texto": "...", "tipo": "..." },
  "host": {
    "uid": "...",
    "nome": "Admin",
    "avatar": "☣️"
  },
  "config": {
    "tempoResposta": 30,
    "penalidade": "beber"
  },
  "criadoEm": "Timestamp",
  "atualizadoEm": "Timestamp"
}
```

### Subcoleção `salas/{roomCode}/jogadores`
Armazena os participantes daquela sala específica.
```json
{
  "uid": "user_123",
  "nome": "Mateus",
  "avatar": "💀",
  "isHost": false,
  "stats": {
    "cumpriu": 2,
    "recusou": 1,
    "bebidas": 3
  },
  "pronto": true
}
```

### Subcoleção `salas/{roomCode}/votos`
Utilizada temporariamente durante rodadas de votação.
```json
{
  "target": "uid_do_alvo",
  "timestamp": "Timestamp"
}
```

### Avatares
O sistema utiliza a API pública **DiceBear (v7.x)** para geração de avatares. NÃO armazenamos as imagens, apenas a URL gerada, garantindo leveza no banco de dados.
- **Formato**: SVG (escalável e leve).
- **Estilos**: `bottts`, `adventurer`, `lorelei`, `avataaars`, `fun-emoji`.
- **URL Padrão**: `https://api.dicebear.com/7.x/[estilo]/svg?seed=[seed]`

### Coleção `cartas`
Banco de dados de conteúdo do jogo.
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

## 5. Requisitos Não Funcionais

### 5.1 Desempenho e Latência
- **Sincronização**: O delay entre a ação de um jogador e a atualização na tela dos outros deve ser inferior a 1 segundo (dependente da rede).
- **Otimização**: Uso de `onSnapshot` apenas nos documentos necessários para evitar leituras excessivas no Firestore.

### 5.2 Usabilidade e UX
- **Mobile First**: Interface projetada primariamente para telas verticais (celulares).
- **Feedback Visual**: Todas as ações (cliques, sorteios, votos) devem ter feedback imediato (animações, toasts).
- **Acessibilidade**: Contraste adequado e tamanhos de fonte legíveis.

### 5.3 Segurança
- **Regras de Segurança (Firestore Rules)**:
    - Apenas jogadores na sala podem ler/escrever na subcoleção `jogadores`.
    - Apenas o Host pode alterar configurações da sala (`estado`, `modo`).
    - Ninguém pode alterar o histórico de votos passados.

---

## 6. Guia de Estilo (Design System)

O projeto utiliza um sistema de design consistente baseado em **TailwindCSS**.

### Cores Principais
- **Background**: Tons escuros (`bg-gray-900`, `bg-black`) para imersão.
- **Acentos**: Cores vibrantes para ações (Roxo Neon, Verde Tóxico, Laranja Alerta).
- **Texto**: Branco ou Cinza Claro para legibilidade em fundo escuro.

### Tipografia
- Fonte Sans-serif moderna (Inter ou Roboto) para clareza em dispositivos móveis.

### Componentes Chave
- **Botões**: Grandes, com áreas de toque acessíveis (>44px).
- **Modais**: Usados para confirmações críticas (Sair do Jogo, Confirmar Voto).
- **Cartas**: Elemento central da UI, com animações de "virada" (flip).

---

## 7. Conclusão

O **Apocalipticos** é um sistema robusto que combina simplicidade de uso com uma arquitetura resiliente. A escolha do Firebase permite escalabilidade horizontal sem preocupação com infraestrutura de servidores, enquanto o React garante uma experiência de usuário fluida e moderna.

Para futuras implementações, recomenda-se seguir este padrão de documentação e manter os diagramas e regras atualizados conforme o jogo evolui.
