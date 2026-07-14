## Objetivo

Refinar o site para um visual mais clean e elegante limitando os pesos de fonte:

- **Títulos** (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`): mantêm os pesos atuais (Clash Display SemiBold em `h1/h2`; Satoshi Medium em `h3+`) — nenhuma mudança.
- **Todo o resto** (parágrafos, labels, chips, badges, botões, links, meta): apenas **Regular (400)** ou **Light (300)**. Sem `font-medium`, `font-semibold`, `font-bold`, `font-extrabold` no corpo do texto.
- **Exceção pontual** ("bom senso"): manter peso maior apenas quando informação exige destaque real — exemplos abaixo.

## Regras de aplicação

1. Substituir `font-semibold`/`font-bold`/`font-medium` em elementos não-título por `font-normal` (ou remover a classe).
2. Reduzir peso do link ativo da nav de `font-semibold` para `font-normal` e diferenciar apenas por cor/background (já usa `bg-foreground text-background`).
3. Botões (shadcn `Button`) — mudar variante default de `font-medium` para `font-normal`. Ícones e labels ficam Regular.
4. Chips, badges e tags — Regular. Meta labels em uppercase pequenas podem ficar Regular com `tracking-wider` para preservar leitura.
5. `<strong>` inline em parágrafos — trocar `font-semibold` por `font-normal` + `text-foreground` (o contraste de cor já dá o realce).
6. Números tabulares grandes (contadores) e a badge "Available for new projects" já são pequenos — Regular.

## Exceções permitidas (destaque justificado)

- Nome "Rafael Bacellar" no card de perfil (já é um mini-título) — permanece SemiBold.
- Selo de "Profile" no topo do card (letras minúsculas uppercase) — permanece SemiBold para funcionar como rótulo tipográfico.
- Metric cards com número principal (ex.: "10+ years") — se atuam como títulos `h2/h3`, já usam peso de heading, sem alteração.
- Nome do link ativo/atual na navbar continua diferenciado por background, não por peso.

## Arquivos afetados (varredura)

Alto volume:
- `src/pages/Index.tsx`, `src/pages/Resume.tsx`, `src/pages/Certifications.tsx`, `src/pages/ProjectDetail.tsx`, `src/pages/Experience.tsx`, `src/pages/NotFound.tsx`
- `src/components/SiteNav.tsx`, `src/components/WorkProjectCard.tsx`, `src/components/ProjectCardStack.tsx`, `src/components/ProcessTimeline.tsx`, `src/components/QuoteBlock.tsx`, `src/components/Marquee.tsx`, `src/components/ContactFooter.tsx`, `src/components/CertificationCard.tsx`, `src/components/CompanyLogos.tsx`, `src/components/MetricCard.tsx`, `src/components/SkillCard.tsx`, `src/components/ToolCard.tsx`, `src/components/FeatureCard.tsx`, `src/components/InsightCard.tsx`, `src/components/InteractiveHeadline.tsx`
- `src/components/ui/button.tsx` (variante default: `font-medium` → `font-normal`)

Preservados sem alteração:
- Componentes internos do shadcn (`table`, `menubar`, `sidebar`, etc.) — o peso ali é semântico do primitive, mantido.
- `src/index.css`: adicionar `font-weight: 300` ao carregamento do Satoshi Light já disponível (já está no `@import` do Fontshare) e garantir `body { font-weight: 400 }` (já está).

## Detalhes técnicos

- Nenhuma mudança em `tailwind.config.ts` — usar utilitários existentes (`font-light`, `font-normal`).
- Nenhuma mudança de cor ou spacing.
- Nenhuma mudança de fonte-family ou hierarquia de headings.
- Validação: build + inspeção visual das páginas Home, Work, Resume, Certifications e um ProjectDetail para confirmar hierarquia e legibilidade (headings ainda dominam, contraste OK).

## Fora do escopo

- Substituir fontes.
- Redistribuir spacing/layout.
- Modificar cores ou tokens do design system.
- Refatorar componentes shadcn base.
