## ✅ Fase 1 – Estrutura Inicial e Conceito

### 📍 Status: Concluído

🔹 Definição do conceito: drinking game interativo com estética apocalíptica.

🔹 Tecnologias escolhidas: React, TailwindCSS, Firebase (Auth e Firestore).

🔹 Projeto criado com Vite.

🔹 Firebase integrado ao front-end.

🔹 Estrutura de diretórios e contextos criada.

## ✅ Fase 2 – Tela Home e Autenticação

### 📍 Status: Concluído

🔹 Home.jsx com botões "Criar Sala" e "Entrar na Sala".

🔹 Modais de interação com verificação de idade.

🔹 Firebase Auth com autenticação anônima.

🔹 Salvamento do jogador no localStorage e Firestore.

## ✅ Fase 3 – Criação e Entrada em Sala

### 📍 Status: Concluído

🔹 Lógica para criar sala com código aleatório (generateRoomCode).

🔹 Seleção de modo (Normal, +18, Difícil) com validação de idade.

🔹 Armazenamento de dados no Firestore:

salas/{codigo}

salas/{codigo}/jogadores/{uid}

## ✅ Fase 4 – Lobby de Espera

### 📍 Status: Concluído

🔹 Exibição de jogadores conectados.

🔹 Sistema de “pronto” por jogador.

🔹 Permissão para ADM iniciar jogo apenas com todos prontos.

## ✅ Fase 5 – Início do Jogo e Tela Base

### 📍 Status: Concluído

🔹 Botão “Iniciar Jogo” altera o estado da sala para em_andamento.

🔹 Criação da rota /jogo/:codigo.

🔹 Estrutura do componente Jogo.jsx.

## ✅ Fase 6 – Sorteio de Cartas e Jogador Atual

### 📍 Status: Concluído

🔹 Sorteio de cartas com base nas categorias e dificuldade.

🔹 Exibição da carta sorteada ao jogador da vez.

🔹 Controle da vez baseado na ordem dos jogadores.

## ✅ Fase 7 – Temporizador, Recusar/Cumprir, Estatísticas

### 📍 Status: Concluído

🔹 Timer de 30s por rodada.

🔹 Botões "Cumprir" e "Recusar" aplicam penalidades ou pontos.

🔹 Estatísticas dos jogadores salvas em jogadores/{uid}/stats.

## 🔄 Fase 8 – Ranking em Tempo Real

### 📍 Status: Concluído

🔹 ✅ RankingJogadores.jsx exibe lista ordenada por pontuação.

🔹 Framer Motion adicionado para animações suaves.

🔹 Avatar e nome em destaque para o jogador local.

🔹 Botão "Sair do Jogo" fecha a sala e remove o jogador do Firestore.

## ✅ Fase 9 – Lógica Avançada das Cartas Especiais

### 📍 Status: Concluído

🔹 Implementação da carta do tipo verdadeDesafio.

🔹 Divisão por fases de jogo (aguardando, exibindoCarta).

## ✅ Fase 10 – Autenticação e Identidade

### 📍 Status: Concluído

🔹 Login com Google (Firebase Auth).

🔹 Persistência de Login Anônimo.

🔹 Vinculação de Contas (Anônimo -> Google).

🔹 Recuperação de dados do perfil (Nome/Foto) ao criar salas.

## 🔜 Fase 11 – Implementação RPG (Personagens e HP)

### 📍 Status: Planejado (Janeiro 2026)

🔹 Sistema de Vida (HP) e Modo Crítico.

🔹 Tela de Seleção de Personagens (Lobby).

🔹 Implementação das Habilidades de Classe (Médico, Assassino, etc).

🔹 Eventos do Caos (Cartas Especiais).

## 📈 Próximos Passos – Planejamento

### 🧩 Fase 12 – Finalizar Categorias Restantes

### 📍 Previsão: Dezembro 2025

Lógica de:

Verdade ou Desafio (escolha + carta)

Eu Nunca (ação + votação, Melhorar a logica e analisar se é nescessario o admin confirmar se o participante bebeu. para que ele possa confirmar se o usuario da vez compriu o desafio ou não)

Amigos de Merda (votação)

Decisões de Merda (ação + punição)

Adicionar lógica condicional ao sortearCarta.

## 🔊 Fase 11 – Efeitos Sonoros e Feedback Visual

### 📍 Previsão: Dezembro 2025

Hook de som (useSounds.js) com efeitos em:

Sorteio de carta

Final da rodada

Penalidade ou ponto

Animações com Framer Motion para entrada de carta, mudança de jogador etc.

## 🏁 Fase 12 – Fim de Jogo e Reinício

### 📍 Previsão: Dezembro 2025

Condição de fim (X rodadas ou pontuação máxima).

Tela de fim com:

Ranking final

Botão “Jogar Novamente”

Botão “Voltar à Home”

## Fase de Monetização

### 📍 Previsão: Janeiro 2026

🔹 Criação de personagens personalizados.

🔹 Loja com novas categorias de cartas e habilidades.

Loja:

Novas categorias de cartas

Novas habilidades

Novos personagens

Novos efeitos visuais

Novos efeitos sonoros

🔹 Sistema de pagamento.

## 🧪 Fase 13 – Testes Unitários, Ajustes e Polimento

### 📍 Previsão: Janeiro 2026

Tratamento de erros e bugs. Implementação de feedback visual e sonoro.

Testabilidade: Você pode criar testes unitários para testar se os turnos estão passando de forma correta, se a pontuação é calculada devidamente e se as punições do timer funcionam apenas testando a lógica dos Custom Hooks (useVoting, useGameActions).
Melhorias na interface e experiência do usuário.

Testes em dispositivos mobile e desktop.

Correções de bugs e travamentos.

Feedback de usuários beta.

## 🚀 Fase 14 – Lançamento e Portfólio

### 📍 Previsão: Fevereiro 2026

Deploy (Vercel ou Firebase Hosting).

Criação da página no seu portfólio.

Publicação no LinkedIn e GitHub.

## 🤖 Fase 15 (Expansão Futura) – Modo Solo & Bots com IA ("Boteco do Apocalipse")

### 📍 Status: Ideia / Planejamento Futuro

🔹 **Modo Solo:** Jogar sem depender de amigos conectados, enfrentando bots controlados por IA.

🔹 **Bots com Personalidades & Prompts:**
  - Tião (Tiozão das Piadas/Teorias do Zap)
  - Jéssica (Fofoqueira e Debochada)
  - Seu Osvaldo (Bêbado Filósofo)
  - Opção de criação de bots customizados pelo usuário.

🔹 **Ambientação Viva de Boteco:** NPCs de fundo (Seu Zé do Balcão, vizinhos), falas contextuais e efeitos sonoros imersivos.

🔹 **Modo Híbrido:** Adicionar bots para completar vagas em salas multiplayer.

🔹 **Integração Técnica com LLMs:** Conexão com modelos ultra-rápidos e de baixo custo (ex: Gemini Flash/Groq) com prompts otimizados e fallback para falas em cache.
