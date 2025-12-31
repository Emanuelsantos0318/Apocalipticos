# 🏆 Guia de Boas Práticas e Engenharia de Software

Este documento serve como guia para manter a qualidade e o profissionalismo do código do projeto **Apocalipticos**. Ele abrange desde ferramentas técnicas até padrões de design.

---

## 1. ⚙️ Stack e Ferramentas Recomendadas

Para elevar o nível profissional do projeto, considere adotar as seguintes ferramentas:

### Testes
*   **Vitest**: (Já que usamos Vite) Para testes unitários rápidos. Teste funções lógicas puras primeiro (ex: `game.js`, helpers).
*   **React Testing Library**: Para testar componentes (`<PowerUpBar />`, `<Podium />`) focando na acessibilidade e comportamento do usuário.
*   **Cypress** ou **Playwright**: Para testes "End-to-End" (E2E). Eles simulam um usuário real clicando e navegando no jogo completo.

### Qualidade de Código (Linting & Formatting)
*   **ESLint**: Encontra erros de lógica e padrões ruins (ex: variáveis não usadas).
*   **Prettier**: Formata o código automaticamente (indentação, aspas, vírgulas) para garantir consistência.
*   **Husky + Lint-staged**: Roda o linting automaticamente antes de cada commit (`pre-commit`), impedindo que código "sujo" entre no repositório.

### Tipagem
*   **TypeScript**: Atualmente usamos JavaScript + PropTypes. Migrar para TS tornaria o código muito mais seguro, prevenindo erros como tentar acessar `usuario.nome` quando `usuario` é `undefined`.

---

## 2. 🏗️ Padrões de Arquitetura (Design Patterns)

### Container vs Presentational Components
*   **Presentational (Burros/Visuais)**: Só se preocupam com a aparência. Recebem dados via props e emitem eventos. Ex: `PowerUpBar`, `Podium`.
*   **Container (Inteligentes/Lógicos)**: Se preocupam com *como as coisas funcionam*. Buscam dados (Firebase), gerenciam estado e passam para os componentes visuais. Ex: `Jogo.jsx`.
    *   *Dica*: Se `Jogo.jsx` ficar muito grande, extraia lógicas para Hooks customizados (ex: `useGameLogic`, `usePowerUps`).

### Single Responsibility Principle (SRP)
Cada componente ou função deve fazer **uma única coisa bem feita**.
*   ❌ Ruim: Uma função `handleAction` que toca som, salva no banco, valida regras e mostra toast.
*   ✅ Bom: `playSound()`, `saveToDb()`, `validateRules()` chamadas em sequência.

---

## 3. 🧪 Estratégia de Testes

Não precisa testar tudo de uma vez. Siga a **Pirâmide de Testes**:

1.  **Testes Unitários (Muitos)**: Teste funções isoladas.
    *   Ex: *A função `calcularPontos(recusou)` retorna -5?*
2.  **Testes de Integração (Médio)**: Teste se componentes conversam bem.
    *   Ex: *Ao clicar no botão "Escudo", a função `onUse` do pai é chamada?*
3.  **End-to-End (Poucos)**: Simulam o jogo real.
    *   Ex: *Usuário consegue logar, criar sala e começar jogo?*

---

## 4. 📝 Convenções de Commit (Semantic Commits)

Mantenha o histórico do Git limpo e legível.

*   `feat: ...` : Nova funcionalidade (ex: `feat: implement powerups system`)
*   `fix: ...` : Correção de bug (ex: `fix: resolve restart loop bug`)
*   `refactor: ...` : Mudança de código que não altera funcionalidade (ex: `refactor: extract PowerUpBar component`)
*   `docs: ...` : Mudanças na documentação
*   `style: ...` : Formatação (espaços, ponto e vírgula)
*   `test: ...` : Adição de testes

---

## 5. 🛡️ Segurança (Firebase)

Como é um projeto "Serverless" (sem backend tradicional), as regras de segurança ficam no **Firestore Rules**.

*   **Validação de Dados**: Garanta que ninguém mande `pontos: 9999` via console do navegador.
*   **Autenticação**: Apenas o próprio usuário pode editar seu perfil.
*   **Atomicidade**: Use Transações ou Batches para operações críticas (ex: descontar powerup e passar a vez ao mesmo tempo).

---

## 6. 🚀 Próximos Passos Sugeridos

1.  Configurar **ESLint** e **Prettier** no VSCode.
2.  Escrever o primeiro teste unitário para `game.js`.
3.  Migrar prop-types para TypeScript (gradualmente).
