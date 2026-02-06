# Relatório de Auditoria SEO - Apocalipticos

**Data da análise**: 05/02/2026
**URL/Arquivo analisado**: Local Project (`f:\produto\ver.2\Apocalipticos`)

---

## 📊 Score Geral: 75/100

### Resumo Executivo

- ✅ **Pontos fortes**: 4 itens
- 🔴 **Problemas críticos**: 2 itens
- 🟡 **Problemas importantes**: 3 itens
- 🟢 **Melhorias menores**: 2 itens

---

## 1. SEO Técnico

### 1.1 Meta Tags

**Status**: Atenção Necessária

- **Title Tag**:
  - Status: ✅
  - Detalhes: "Apocallípticos" presente em `index.html`.
  - Recomendação: Verificar se a grafia "Apocallípticos" (com dois 'l') é intencional. Caso contrário, corrigir para "Apocalipticos".

- **Meta Description**:
  - Status: ❌
  - Detalhes: Ausente no `index.html`.
  - Recomendação: Adicionar `<meta name="description" content="Breve descrição do jogo...">`.

### 1.2 Canonical e Robots

- **Canonical**: ❌ Ausente. Recomendado adicionar `<link rel="canonical" href="https://seusite.com/" />`.
- **Robots**: Padrão (permitido). Adicionar `robots.txt` se for um site público.

---

## 2. Estrutura de Conteúdo

### 2.1 Headings (H1-H6)

- **H1**: 1 encontrado ("Apocallípticos" em `Home.jsx`). ✅
- **H2**: 0 encontrados. ❌
- **H3**: 3 encontrados ("Multijogador", "3 Modos", "Jogo de bebida").
- **Hierarquia**: Pula de H1 direto para H3.
- **Recomendações**: Adicionar um H2 introdutório ou converter os cards principais para H2 se fizer sentido semântico.

### 2.2 Conteúdo Textual

- Conteúdo principal focado em cards e botões. Pouco texto para indexação (típico de Web App/Game).
- **Legibilidade**: Boa, com contraste adequado (texto branco em fundo escuro com overlay).

---

## 3. Otimização de Imagens

- **Total de imagens analisadas**: 3 principais
- **Com alt text**: 2 (100% das tags `<img>`)
- **Backgrounds**: 1 (`bg-apocalipticos.jpg`)
- **Formatos**:
  - `logo-apocalipticos.svg`: Ótimo (Vetorial). ✅
  - `banner2.jpg`: Formato legado. 🟡
  - `bg-apocalipticos.jpg`: Formato legado. 🟡

**Problemas encontrados**:

- Uso de JPG para imagens grandes de fundo. Recomendado converter para WebP ou AVIF.

---

## 4. Links

### 4.1 Links Internos

- Navegação feita via React Router (`useNavigate`, remove links rastreáveis por crawlers tradicionais se não houver `<a>` tags).
- Botões "Criar Sala" e "Entrar na Sala" são `button` com `onClick`. Para SEO, links de navegação devem ser `<a>` (tags âncora).

---

## 5. Mobile e Performance

- **Meta viewport**: ✅ Presente.
- **Design responsivo**: ✅ Uso de Tailwind (`sm:`, `md:`) implementado corretamente.

---

## 🔴 PROBLEMAS CRÍTICOS (Corrigir Imediatamente)

1. **Meta Description Ausente**
   - **Impacto**: Alto - Reduz CTR nos resultados de busca.
   - **Como corrigir**:

```html
<!-- index.html -->
<meta
  name="description"
  content="Apocalipticos: O jogo de sobrevivência e desafios mais insano para jogar com amigos. Crie sua sala e divirta-se!"
/>
```

2. **Navegação Principal sem Links Semânticos**
   - **Impacto**: Médio/Alto - Crawlers não seguem `onClick` functions facilmente.
   - **Como corrigir**: Se "Criar Sala" e "Entrar na Sala" levam a rotas URL, considere usar `<Link to="...">` do React Router estilizado como botão.

---

## 🟡 PROBLEMAS IMPORTANTES (Corrigir em Breve)

1. **Formatos de Imagem**
   - **Impacto**: Médio (Performance/LCP)
   - **Como corrigir**: Converter `bg-apocalipticos.jpg` e `banner2.jpg` para `.webp`.

2. **Hierarquia de Headings**
   - **Impacto**: Médio (Semântica)
   - **Como corrigir**: Garantir fluxo H1 -> H2 -> H3.

---

## 🟢 MELHORIAS MENORES (Nice to Have)

1. **Canonical Tag**
   - **Benefício**: Evita conteúdo duplicado.
2. **Revisão de Typos**
   - Verificar grafia "Apocallípticos" vs "Apocalípticos".
