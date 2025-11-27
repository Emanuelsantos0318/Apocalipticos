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
