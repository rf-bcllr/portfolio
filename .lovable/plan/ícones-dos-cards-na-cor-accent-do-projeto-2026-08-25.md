# Ícones dos cards na cor accent do projeto

## O que muda
Os ícones no canto superior direito da área de mídia de cada card de projeto passam a usar a cor accent do próprio card (roxo, laranja, teal, azul, etc.) em vez de seguir a cor de texto do tema. Assim eles ficam idênticos em light e dark mode, já que o fundo dessa área também não muda.

## Detalhes técnicos
- Arquivo: `src/components/WorkProjectCard.tsx`, bloco do ícone (`projectIconMap[project.slug]`) por volta da linha 233.
- Trocar `text-foreground` por `text-[hsl(var(--project-accent))]`, mantendo `opacity-80`, `strokeWidth={1.75}` e o posicionamento atual.
- Nenhuma mudança em dados, layout ou conteúdo.
