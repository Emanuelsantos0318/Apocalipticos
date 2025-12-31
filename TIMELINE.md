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

## 🔄 Fase 9 – Lógica Avançada das Cartas Especiais

### 📍 Status: Em Andamento

🔄 Implementação da carta do tipo verdadeDesafio:

Jogador escolhe "Verdade" ou "Desafio" antes de mostrar a carta.

Firestore busca carta do subtipo correto.

🔄 Divisão por fases:

aguardando, escolhendoVD, exibindoCarta, etc.

## 📈 Próximos Passos – Planejamento

### 🧩 Fase 10 – Finalizar lógica de todas as categorias

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

## 🧪 Fase 13 – Testes, Ajustes e Polimento

### 📍 Previsão: Janeiro 2026

Tratamento de erros e bugs. Implementação de feedback visual e sonoro. 

Melhorias na interface e experiência do usuário.

Testes em dispositivos mobile e desktop.

Correções de bugs e travamentos.

Feedback de usuários beta.

## 🚀 Fase 14 – Lançamento e Portfólio

### 📍 Previsão: Fevereiro 2026

Deploy (Vercel ou Firebase Hosting).

Criação da página no seu portfólio.

Publicação no LinkedIn e GitHub.
