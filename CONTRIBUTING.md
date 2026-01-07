# Guia de Contribuição - Apocalipticos

Obrigado por querer contribuir com o caos! 🧨

## 🛠️ Padrões de Código

### Javascript / React

- **Componentes Funcionais**: Use sempre `function Componente() { ... }` ou `const Componente = () => { ... }`.
- **Hooks**: Mantenha a lógica de estado complexa em custom hooks (`useGame`, `useAuth`) sempre que possível.
- **Nomes de Arquivos**: PascalCase para componentes (`MeuComponente.jsx`) e camelCase para utilitários (`meuUtil.js`).

### CSS / Estilização

- **TailwindCSS**: Priorize o uso de classes utilitárias do Tailwind.
- Evite criar arquivos `.css` separados a menos que seja estritamente necessário para animações complexas não suportadas pelo Tailwind.

## 💾 Commits

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nova funcionalidade (ex: `feat: adicionar carta de amigos de merda`)
- `fix`: Correção de bug (ex: `fix: timer não reseta na nova rodada`)
- `docs`: Alterações na documentação
- `style`: Formatação, ponto e vírgula faltando, etc (sem mudança de lógica)
- `refactor`: Refatoração de código (sem mudança de funcionalidade)

## 🔄 Fluxo de Trabalho

1. Crie uma **branch** para sua feature: `git checkout -b feat/minha-nova-feature`
2. Desenvolva e teste localmente.
3. Abra um **Pull Request** descrevendo o que foi feito.

Para adicionar novas cartas ao jogo, siga estes passos:

1.  Abra o arquivo `src/firebase/seedDatabase.js`.
2.  Localize a lista `const cards = [...]`.
3.  Adicione seu novo objeto de carta no final da lista, seguindo o formato:

    ```javascript
    {
      texto: "Sua pergunta ou desafio aqui",
      tipo: CARD_TYPES.TRUTH, // ou DARE, NEVER, FRIENDS
      modo: GAME_MODES.NORMAL, // ou ADULTO, DIFICIL
      categoria: CATEGORIES.TRUTH_OR_DARE // ou outra correspondente
    }

    > node src/firebase/seedDatabase.js
    ```

4.  No terminal, execute o comando:
    ```bash
    node src/firebase/seedDatabase.js
    ```
5.  O script irá verificar automaticamente quais cartas são novas e adicionar apenas elas, sem duplicar as existentes. ✨
