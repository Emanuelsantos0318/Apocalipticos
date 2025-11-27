# 🧨 Apocalípticos - Drinking Game Online

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Firebase](https://img.shields.io/badge/Firebase-9-orange)

**Apocalípticos** é um jogo interativo e insano para grupos de amigos (presencial ou remoto), inspirado em clássicos como *Amigos de Merda*, *Verdade ou Desafio* e *Eu Nunca*. Com foco em desafios, perguntas e decisões bizarras em tempo real, tudo embrulhado em uma estética "apocalíptica zoada". Ideal para animar qualquer rolê!

## 📸 Telas do Jogo

| Tela Inicial | Criando uma Sala | Entrando em uma Sala | Lobby |
| :---: | :---: | :---: | :---: |
| ![Tela inicial do jogo Apocalípticos](docs/images/home.png) | ![Modal para criar uma sala de jogo](docs/images/modal-criar-sala.png) | ![Modal para entrar em uma sala com código](docs/images/modal-entrar-sala.png) | ![Tela de lobby aguardando o início do jogo](docs/images/lobby.png) |

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Firebase (Firestore, Auth)
- **UI Components**: Shadcn/UI, Lucide Icons, Framer Motion (Animações)
- **Gerenciamento de Estado**: React Context API

---

## 🎮 Modos de Jogo

Os modos definem a intensidade e ousadia das cartas:

| Modo    | Descrição                                  |
|---------|---------------------------------------------|
| **Normal**  | Perguntas leves e desafios tranquilos. Ideal para começar a noite.      |
| **+18**     | Conteúdo adulto e provocante. Apenas para maiores de 18 anos.               |
| **Difícil** | Pesado, insano, para jogadores sem limites. Prepare o fígado.  |

---

## 🎲 Tipos de Cartas

Cada rodada traz um tipo de mini-jogo, com regras específicas:

| Tipo             | Nome             | Mecânica                                                                 |
|------------------|------------------|--------------------------------------------------------------------------|
| `verdadeDesafio` | **Verdade ou Desafio** | O clássico. ADM ou sistema escolhe o tipo antes da carta aparecer.                              |
| `decisoes`       | **Decisões de Merda** | Jogador da vez enfrenta uma situação absurda e deve cumprir uma prenda.                    |
| `votacao`        | **Amigos de Merda**   | Todos votam em alguém baseado na carta (ex: "Quem é mais provável de ser preso?"). O mais votado bebe.              |
| `euNunca`        | **Eu Nunca**          | Quem já fez o que está na carta, bebe.                                    |

---

## ✅ Status do Desenvolvimento

### Funcionalidades Implementadas
- [x] **Autenticação Anônima**: Jogadores entram sem cadastro complexo.
- [x] **Sistema de Salas**: Criação e entrada via código (ex: ZUMBI).
- [x] **Lobby em Tempo Real**: Visualização de avatares e status dos jogadores.
- [x] **Core do Jogo**:
    - Sorteio de jogador da vez.
    - Sorteio de cartas baseado no modo.
    - Timer de 30 segundos.
    - Sistema de pontuação e penalidades.
- [x] **Ranking**: Placar atualizado em tempo real.

### Em Desenvolvimento / Planejado
- [ ] **Lógica Avançada de Cartas**: Votação em tempo real para "Amigos de Merda".
- [ ] **Efeitos Sonoros**: Feedback auditivo para ações do jogo.
- [ ] **Fim de Jogo**: Tela de encerramento com pódio e estatísticas finais.
- [ ] **Histórico de Partidas**: Salvar resultados no perfil do usuário (futuro).

---

## 🛠️ Como rodar localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Emanuelsantos0318/Apocalipticos.git
   cd apocalipticos
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase**
   Crie um arquivo `.env.local` na raiz do projeto e adicione suas credenciais do Firebase:
   ```env
   VITE_API_KEY=sua_api_key
   VITE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   VITE_PROJECT_ID=seu_project_id
   VITE_STORAGE_BUCKET=seu_bucket.appspot.com
   VITE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_APP_ID=seu_app_id
   ```

4. **Rode o projeto**
   ```bash
   npm run dev
   ```

---

## 📦 Estrutura do Projeto

```
src/
├── components/      # Componentes reutilizáveis (Botões, Modais, Cards)
├── context/         # Contextos globais (Auth, GameState)
├── firebase/        # Configuração e funções do Firestore
├── hooks/           # Custom hooks (useGame, useAuth)
├── pages/           # Páginas principais (Home, Lobby, Jogo)
└── utils/           # Funções auxiliares
```

---

## 🍻 Contribuições

Ideias insanas de cartas? Pull requests? Bora! Sinta-se à vontade para contribuir com novas ideias de desafios ou melhorias no código.

---

## ⚠️ Aviso Legal

Este jogo é destinado a maiores de 18 anos. O consumo de álcool deve ser feito com responsabilidade. Os criadores não incentivam o consumo excessivo de álcool ou comportamentos perigosos.

---

## 🧙‍♂️ Autores

Feito com caos por:

| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/126841158?v=4" width=115><br><sub>Mateus Sanfer</sub>](https://github.com/MateusSanfer) | [<img loading="lazy" src="https://avatars.githubusercontent.com/u/128701097?v=4" width=115><br><sub>Emanuel Santos</sub>](https://github.com/Emanuelsantos0318) |
| :---: | :---: |
