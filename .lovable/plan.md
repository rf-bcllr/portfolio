## Objetivo

Elevar a acessibilidade do portfólio a WCAG 2.1 AA, cobrindo desktop e mobile, sem alterar o design visual nem a lógica de negócio.

## Escopo por área

### 1. Marcos e estrutura semântica

- Garantir exatamente um `<main>` por página. Hoje `ProjectDetail.tsx` e `NotFound.tsx` não usam `<main>` — adicionar.
- Trocar `min-h-screen` por `min-h-dvh` nas páginas (Index, Work, Resume, Certifications, ProjectDetail, NotFound) para eliminar o corte de conteúdo no mobile com barra de URL dinâmica.
- Adicionar link "Skip to content" no topo (visível ao focar) que pula direto para o `<main id="main">`, útil para teclado/leitores de tela em desktop e mobile.
- Confirmar hierarquia de headings sem pulos (h1 → h2 → h3) em Index, Work, Resume, ProjectDetail.

### 2. Botões e links

- `SiteNav`: botão de menu mobile já tem `aria-label`; adicionar `aria-controls` apontando ao painel mobile e `aria-current="page"` nos `NavLink` ativos.
- `ProjectCardStack`: os três botões (linhas 113, 132, 140) precisam de `aria-label` descritivo (ex.: "Ver projeto X", "Slide anterior", "Próximo slide") e `type="button"`.
- Rever todos os `<button>` sem texto visível/`aria-label` e adicionar rótulo.
- `ConnectButton` no `SiteNav`: adicionar `aria-label="Let's connect on LinkedIn (opens in new tab)"` já que abre em nova aba.
- Todos os `target="_blank"` externos: garantir `rel="noreferrer noopener"` e indicação de nova aba via `aria-label` ou ícone `sr-only`.

### 3. Imagens e mídia

- Auditar `alt` em `heroPortrait`, `avatar`, thumbnails de galeria e logos de empresas. Imagens decorativas recebem `alt=""`; imagens informativas recebem descrição real.
- `CompanyLogos`, `ToolsMarquee`: adicionar `role="list"` e `aria-label` no marquee; marcar cópias duplicadas (para loop infinito) como `aria-hidden="true"` para não repetir no leitor de tela; respeitar `prefers-reduced-motion` pausando a animação.
- `DrawingCanvas`: canvas já é `aria-hidden`, ok. Botão "Clear drawing" ok.
- `CustomCursor`: adicionar `aria-hidden="true"` no wrapper (é puramente decorativo).

### 4. Formulários e mídia interativa

- `MediaLightbox`: confirmar foco preso no diálogo, `aria-label` nos controles prev/next/close, fechar com Esc, restaurar foco ao trigger.
- `ProjectGallery` botões: já têm `aria-label` — validar que o texto usa o título real do item.

### 5. Contraste e estados de foco

- Adicionar `focus-visible:outline outline-2 outline-offset-2 outline-[hsl(var(--ring))]` (via classe utilitária global no `index.css`) para todo elemento interativo, incluindo links de nav e cards clicáveis. Nada de `outline-none` sem substituto.
- Revisar tokens `text-muted-foreground` sobre `bg-card/0.25` (nav glass) para garantir contraste ≥ 4.5:1 em light e dark.

### 6. Movimento e mídia sensível

- Envolver animações do `AnimatedBackground`, `Marquee`, `ToolsMarquee`, `framer-motion` (Index/hero) em `@media (prefers-reduced-motion: reduce)` para pausar/encurtar.
- `CustomCursor` e `DrawingCanvas` já se desativam fora de `pointer: fine` — manter.

### 7. Mobile específico

- Alvos de toque ≥ 44×44px: aumentar `size-8` do botão de menu e do `ConnectButton` mobile para `min-h-11 min-w-11` (mantendo aparência via padding interno).
- Garantir que o painel mobile do `SiteNav` recebe `role="dialog"` ou é um `<nav>` com foco gerenciado e fecha ao pressionar Esc / clicar fora.
- Verificar rolagem: `overflow-x` controlada em Index (hero wrap), Work list.

### 8. Idioma e metadados

- `index.html`: `<html lang="en">` está em inglês, mas título/descrição estão em PT-BR. Alinhar para `lang="pt-BR"` (o conteúdo do site é majoritariamente em inglês — decisão a confirmar). Ver pergunta abaixo.
- Adicionar `<meta name="theme-color">` para light/dark.

## Detalhes técnicos

- Arquivos alterados (previstos): `index.html`, `src/index.css`, `src/App.tsx` (skip link + wrapper), `src/components/SiteNav.tsx`, `src/components/CustomCursor.tsx`, `src/components/ProjectCardStack.tsx`, `src/components/ProjectGallery.tsx`, `src/components/MediaLightbox.tsx`, `src/components/CompanyLogos.tsx`, `src/components/ToolsMarquee.tsx`, `src/components/Marquee.tsx`, `src/components/AnimatedBackground.tsx`, `src/pages/Index.tsx`, `src/pages/Work.tsx`, `src/pages/Resume.tsx`, `src/pages/Certifications.tsx`, `src/pages/ProjectDetail.tsx`, `src/pages/NotFound.tsx`.
- Validação: build + inspeção manual de tab order em desktop e mobile via Playwright (screenshots do foco visível e do painel mobile aberto).

## Fora do escopo

- Redesenho visual, refatoração de cores da marca, i18n completo, mudanças em `src/components/ui/*` (shadcn já é acessível por padrão).

## Pergunta pendente

- Deixar `en` e traduzir o `<title>`/`<meta description>` para inglês.