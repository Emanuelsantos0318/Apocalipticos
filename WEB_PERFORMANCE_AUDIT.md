### 🚀 Relatório de Auditoria de Desempenho

**Resumo Executivo:**
**Pontuação Estimada: 85/100**
O projeto está bem estruturado, com boas práticas modernas como **Code Splitting** (já implementado) e uso de bibliotecas leves (`lucide-react`). O principal ponto de atenção é a **estratégia de carregamento de imagens** para evitar CLS (Cumulative Layout Shift) e a otimização de recursos estáticos grandes.

---

### 🔴 Problemas Críticos (Alto Impacto)

_Nenhum problema crítico bloqueante foi encontrado na análise estática._

---

### 🟡 Avisos e oportunidades de otimização (impacto médio)

**1. Estabilidade Visual (CLS) em Imagens**

- **Local:** `src/pages/Home.jsx` e `src/pages/landing/LandingPage.jsx`
- **O Problema:** As imagens (logos, avatares) contam apenas com classes CSS para dimensionamento. Sem atributos `width` e `height` explícitos no HTML, o navegador não consegue reservar espaço antes do carregamento do CSS/Imagem, causando saltos de layout (CLS) em conexões lentas.
- **Correção:** Adicionar atributos `width` e `height` (proporcionais) nas tags `<img>`.

```jsx
// Exemplo em Home.jsx
<img
  src="/logo-apocalipticos.svg"
  width="256"
  height="256"
  className="w-40 sm:w-56..." // CSS sobrescreve, mas proporção é mantida
/>
```

**2. Background LCP (Largest Contentful Paint)**

- **Local:** `src/pages/Home.jsx`
- **O Problema:** A imagem de fundo `/bg-apocalipticos.jpg` é carregada via CSS (`backgroundImage`). Isso faz com que o navegador só descubra a imagem depois de baixar e analisar o CSS (ou componente), atrasando o LCP.
- **Correção:** Adicionar um `<link rel="preload">` no `index.html` ou usar um componente `img` com `object-fit: cover` posicionado absolutamente (mais amigável ao "Lazy Loading" nativo se não for LCP, ou "Eager" se for).

```html
<!-- No index.html -->
<link rel="preload" as="image" href="/bg-apocalipticos.jpg" />
```

**3. Otimização de Imagens (Formato Próxima Geração)**

- **Local:** Todo o projeto
- **O Problema:** Uso de formatos PNG/JPG padrão (`/assets/characters/medica_Itala.jpeg`).
- **Correção:** Converter assets estáticos para **WebP** ou **AVIF** para reduzir o tamanho do payload em até 30-50%.

---

### 🟢 Melhores práticas detectadas

1.  **Code Splitting (Divisão de Código):** Implementado corretamente no `main.jsx` usando `React.lazy`. Isso garante que o usuário só baixe o código da página que está acessando (Landing, Home, Lobby ou Jogo).
2.  **Tree Shaking de Ícones:** Importação correta da `lucide-react` (destructuring), permitindo que o bundler remova ícones não utilizados.
3.  **Meta Tags de SEO:** As tags Open Graph e Description adicionadas recentemente melhoram a performance de compartilhamento e descoberta.
4.  **Feedback de Carregamento:** Uso consistente de `Suspense` e telas de `Loading` evita telas brancas da morte durante a navegação.

---

### 🔮 Impacto previsto nas métricas

Risco de LCP: **Médio** (Devido à imagem de fundo via CSS).
Risco de CLS: **Médio** (Falta de dimensões explícitas nas imagens).
Risco de tamanho do pacote: **Baixo** (Graças ao Code Splitting e bibliotecas otimizadas).
