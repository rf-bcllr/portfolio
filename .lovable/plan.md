## Plano de mudanças

### 1. Adicionar logo da FTD na seção de empresas
- Copiar `user-uploads://logo_ftd_monocromatico_cmyk_branco_…png` para `src/assets/logo-ftd.png`.
- Em `src/components/CompanyLogos.tsx`:
  - Importar `logoFtd from "@/assets/logo-ftd.png"`.
  - Adicionar a entrada `{ name: "FTD Educação", logo: logoFtd, url: "https://www.ftd.com.br/" }` ao array `companies`.
- O grid já é `lg:grid-cols-6`; com 7 logos, a sétima quebrará para a próxima linha. Vou ajustar para `lg:grid-cols-7` (ou manter `grid-cols-6` e centralizar a sétima) — proposta: trocar para `lg:grid-cols-7` para manter todas alinhadas em telas largas, e em telas médias (`md`) deixar `md:grid-cols-4` para não ficar viúva.
- Como o logo é monocromático branco, o tratamento atual `brightness-0 dark:invert` continua funcionando (no light mode vira preto, no dark mode mantém-se branco).

### 2. Trocar a imagem principal do Students' Transportation (Cheguei) pelo GIF mobile
- Copiar `user-uploads://WhatsAppVideo2026-04-16at10.59.29AM-ezgif.com-video-to-gif-converter.gif` para `src/assets/cheguei-mobile.gif`.
- **Otimização (consistente com o trabalho recente)**: converter via `ffmpeg` para `cheguei-mobile.mp4` + `cheguei-mobile.webm` + poster `cheguei-mobile-poster.jpg`, deletando o GIF depois.
- Adicionar entrada em `src/data/animatedMedia.ts`:
  ```ts
  "students-transportation": {
    sources: [
      { src: chegueiMobileWebm, type: "video/webm" },
      { src: chegueiMobileMp4, type: "video/mp4" },
    ],
    poster: chegueiMobilePoster,
  }
  ```
- Em `src/pages/Index.tsx`:
  - Atualizar `projectMedia[3]` (Students' Transportation) para usar `...animatedProjectMedia["students-transportation"]` em vez de `projectThumbNew2`.
  - Atualizar a `ProjectCard` correspondente (índice 3 na Coluna 1) para passar `sources`/`poster` em vez de `src`.
- Em `src/data/projects.ts` e `src/data/projectsStructured.ts`:
  - Trocar `heroImage` do projeto `students-transportation` para o novo poster.
  - Atualizar a entrada da `gallery` para `{ src: chegueiMobilePoster, title: "Cheguei mobile experience" }` (a `MediaLightbox` atualmente só lida com imagens/vídeos via URL — vou verificar se faz sentido passar o `.mp4` direto para que o lightbox abra como vídeo; pelo que vi em `MediaLightbox.tsx` já existe a checagem `isVideo` por extensão, então passarei o `.mp4` na galeria).

### 3. Adicionar `comms-dashboard.gif` à galeria do AI Writing Assistant + texto sobre o dashboard
- Copiar `user-uploads://comms-dashboard.gif` para `src/assets/ai-comms-dashboard.gif` e converter via `ffmpeg` para `ai-comms-dashboard.mp4` + `.webm` + poster (`ai-comms-dashboard-poster.jpg`); deletar o GIF original.
- Em `src/data/projectsStructured.ts` (`aiWritingAssistantStructured`):
  - Adicionar segundo item na `gallery`:
    ```ts
    { src: aiCommsDashboardMp4, title: "Communications dashboard tracking AI assistant usage" }
    ```
  - Adicionar uma nova `SolutionFeature` ao final do array `features` mencionando o dashboard:
    ```ts
    {
      icon: "BarChart3",
      title: "Usage Dashboard",
      description: "A dedicated dashboard tracks AI assistant adoption, message volume, NPS, and response-time metrics so school admins can monitor impact in real time."
    }
    ```
  - Acrescentar uma frase no campo `solution.summary` indicando o dashboard.
  - Atualizar uma das `learnings` (ou adicionar nova) referenciando "measuring adoption from day one with a dedicated dashboard".
- Em `src/data/projects.ts` (`ai-writing-assistant`):
  - Adicionar 1–2 frases ao final do campo `solution` mencionando: "Para acompanhar adoção e impacto, criamos um dashboard de Comunicação que mostra comunicados enviados/recebidos, NPS dos pais e tempo médio de resposta."
  - Acrescentar a galeria (atualmente esse projeto não tem `gallery` no `projects.ts`) para incluir o poster do dashboard.

### 4. Criar novo projeto "AI Question Generation Tool" (estado de obra, padrão Cyberbrake)
- Copiar `user-uploads://Gravando2026-03-30115621-…gif` para `src/assets/ai-question-generator.gif` e converter para `.mp4` + `.webm` + poster (`ai-question-generator-poster.jpg`); deletar o GIF.
- Adicionar entrada em `src/data/animatedMedia.ts`:
  ```ts
  "ai-question-generator": {
    sources: [
      { src: aiQuestionGeneratorWebm, type: "video/webm" },
      { src: aiQuestionGeneratorMp4, type: "video/mp4" },
    ],
    poster: aiQuestionGeneratorPoster,
  }
  ```
- Em `src/data/projects.ts` adicionar novo item ao final do array `projectsData`, espelhando o formato Cyberbrake:
  ```ts
  {
    id: "ai-question-generator",
    slug: "ai-question-generator",
    title: "AI Question Generation Tool",
    subtitle: "Page under construction",
    year: 2025,
    company: "FTD Educação",
    heroImage: aiQuestionGeneratorPoster,
    coverType: "horizontal",
    overview: {
      role: "Product Designer",
      team: "TBD",
      duration: "TBD",
      tools: ["TBD"],
      impact: ["Page under construction"]
    },
    challenge: "🚧 This case study is currently under construction. Check back soon for the full story!",
    process: "🚧 Under construction...",
    solution: "🚧 Under construction...",
    impact: "TBD",
    gallery: [
      { src: aiQuestionGeneratorMp4, title: "AI Question Generator inside the FTD reader" },
      { src: aiQuestionGeneratorPoster, title: "AI Question Generator – preview" }
    ]
  }
  ```
- Em `src/pages/ProjectDetail.tsx`: a lógica especial "Cyberbrake" (`project.slug === "cyberbrake"`) que renderiza Gallery à esquerda + UnderConstructionState à direita precisa ser estendida para também aceitar `"ai-question-generator"`. Vou trocar por `["cyberbrake", "ai-question-generator"].includes(project.slug)`.
- Em `src/pages/Index.tsx`:
  - Adicionar o novo projeto ao array `projectMedia` (vídeo, similar ao Meu Arco/AI Writing Assistant).
  - **Decisão de layout do grid de projetos** (atualmente 4 / 2 / 2 = 8 cards):
    - Opção mais limpa: adicionar à Coluna 3 como terceiro card → fica 4 / 2 / 3 (9 cards). Ainda assimétrico mas menos visível em telas grandes.
    - Vou seguir essa abordagem.
  - Adicionar `<ProjectCard>` correspondente na Coluna 3 usando `sources`/`poster`.

### 5. Resumo dos arquivos afetados
- **Criados**: `src/assets/logo-ftd.png`, `src/assets/cheguei-mobile.{mp4,webm}` + poster, `src/assets/ai-comms-dashboard.{mp4,webm}` + poster, `src/assets/ai-question-generator.{mp4,webm}` + poster.
- **Editados**: `src/components/CompanyLogos.tsx`, `src/data/animatedMedia.ts`, `src/data/projects.ts`, `src/data/projectsStructured.ts`, `src/pages/Index.tsx`, `src/pages/ProjectDetail.tsx`.

### Observações / pontos para confirmar
- A FTD será adicionada como sétima logo. Se preferir, posso reordenar para que ela apareça em uma posição específica (ex.: depois do Arco) — me avise; por padrão vou colocar no final.
- O texto novo sobre o dashboard será adicionado tanto no campo legado (`solution` em `projects.ts`) quanto na versão estruturada (`features` + `summary` em `projectsStructured.ts`) para que apareça de fato na página renderizada (a página usa a versão estruturada quando existe).
