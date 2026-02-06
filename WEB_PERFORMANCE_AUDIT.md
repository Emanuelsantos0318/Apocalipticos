### 🚀 Relatório de Auditoria de Desempenho

**Resumo Executivo:**
A pontuação de desempenho estática é **65/100**. O projeto possui uma boa base com React e Vite, mas falha em otimizações críticas de ativos (SVG de 800KB!) e estratégia de carregamento (sem Code Splitting). A complexidade do componente principal `Jogo.jsx` também sugere riscos de renderização.

---

### 🔴 Problemas Críticos (Alto Impacto)

_Problemas que irão degradar visivelmente a experiência do usuário ou causar a falha do aplicativo._

**1. SVG Gigante (Bloqueio de Renderização)**

- **Local:** `public/logo-apocalipticos.svg` (800KB)
- **O Problema:** Um arquivo SVG de 800KB é excessivamente grande e será baixado no carregamento inicial da Home, atrasando o LCP (Largest Contentful Paint). SVGs típicos de logo não devem passar de 10KB.
- **Correção:** Otimizar o SVG usando ferramentas como SVGOMG ou converter para WebP se for uma ilustração complexa.

**2. Ausência de Code Splitting (Bundle Size)**

- **Local:** `src/main.jsx`
- **O Problema:** Todas as rotas (`Home`, `Lobby`, `Jogo`) são importadas estaticamente. Isso significa que o usuário baixa o código do Jogo inteiro apenas para ver a Landing Page.
- **Correção:**

```javascript
// src/main.jsx
import React, { Suspense, lazy } from "react";
// ...
const Home = lazy(() => import("./pages/Home"));
const Lobby = lazy(() => import("./pages/Lobby"));
const Jogo = lazy(() => import("./pages/Jogo"));

// No router:
{ path: "jogo/:codigo", element: <Suspense fallback={<Loading />}><Jogo /></Suspense> },
```

**3. Complexidade Excessiva no Jogo (Renderização)**

- **Local:** `src/pages/Jogo.jsx` (693 linhas)
- **O Problema:** O componente excede o limite recomendado de 300 linhas. Ele gerencia lógica de timer, música, modais, e UI tudo em um arquivo. Qualquer atualização de estado (ex: timer) pode causar re-renderização de toda a árvore de componentes filhos se não estiver memoizada.
- **Correção:** Extrair lógicas para hooks menores e dividir a UI em subcomponentes mais isolados (ex: `GameModals`, `GameControls`).

---

### 🟡 Avisos e oportunidades de otimização (impacto médio)

_Problemas que aumentam o tempo de carregamento ou dívida técnica._

1. **Imagens sem formatos modernos**

- **Local:** `public/banner2.jpg` (127KB)
- **O Problema:** Uso de JPEG legado.
- **Correção:** Converter para WebP ou AVIF para reduzir tamanho em ~30%.

2. **Prop Drilling no componente Jogo**

- **Local:** `src/pages/Jogo.jsx` -> `GameHeader`, `CardDisplay`, `PlayerActions`
- **O Problema:** Muitos dados (`sala`, `jogadores`, `gameActions`) são passados via props para múltiplos níveis.
- **Correção:** Considerar usar o `GameContext` (já existente ou expandir o `RoomProvider`) para evitar passar tantas props manualmente.

3. **Falta de Compressão no Build**

- **Local:** `vite.config.js`
- **O Problema:** Configuração padrão não inclúi plugins de compressão (Gzip/Brotli) para os assets estáticos.
- **Correção:** Adicionar `vite-plugin-compression`.

---

### 🟢 Melhores práticas detectadas

- **Uso de Fontes:** As fontes do Google estão sendo carregadas com `preconnect`, o que acelera a conexão inicial.
- **Gerenciamento de Timer Local:** O uso de `setTimeout` local no `Jogo.jsx` para o timer visual (independente do servidor) é uma boa estratégia para evitar lag de rede na UI, embora exija sincronização cuidadosa.
- **Cleanups de Efeitos:** Os `useEffect` analisados (principalmente de música e timers) possuem funções de limpeza (`return () => clearTimeout(...)`) corretas.

---

### 🔮 Impacto previsto nas métricas

_Como não posso executar o Lighthouse, aqui está minha previsão de análise estática:_

**Risco de LCP:** [Alto]
Devido ao `logo-apocalipticos.svg` de 800KB na página inicial.

**Risco de CLS:** [Médio]
As imagens de background e logo podem causar shifts se não tiverem width/height explícitos no CSS/HTML antes do carregamento.

**Risco de tamanho do pacote:** [Alto]
Sem code splitting, o bundle inicial (`index.js`) será desnecessariamente grande.
