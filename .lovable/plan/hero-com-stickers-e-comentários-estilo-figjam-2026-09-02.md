# Hero com stickers e comentários estilo FigJam

Transformar a Hero em um "board" tipo FigJam: headline grande, um post-it com o resumo profissional e stickers espalhados que reagem ao hover e abrem um comentário ao clique — inspirado na simplicidade do gyanl.com.

## Stickers e comentários

| Sticker | Comentário ao clique |
| --- | --- |
| Amaya (cachorra) | "My main design companion, Amaya" |
| Lia (mascote estrela) | "Lia is a mascot I've designed for the AI in a digital platform called iônica" |
| Work Anywhere (laptop) | "I'm open to remote opportunities worldwide" |
| Based in Brazil | sem comentário — sticker decorativo, só hover |

## Componente de comentário

Novo `FigmaComment` (baseado no padrão do smoothui):

- Bolha fechada = pin circular com avatar (foto do Rafael) + borda preta 2px e sombra hard offset, seguindo o estilo editorial do site.
- Ao clicar, expande com spring (framer-motion, já instalado) revelando o texto do comentário; altura medida dinamicamente.
- Clique fora fecha; `Escape` também.
- Respeita `prefers-reduced-motion` (sem spring nem blur, resize instantâneo).
- Acessível: botão real com `aria-expanded`, avatar com `alt` e fallback com inicial.
- Cor de destaque do pin usa a cor aleatória do visitante (mesma lógica do cursor), mantendo a coerência FigJam.

## Stickers

- Cada sticker é um wrapper com leve rotação, hover: escala + rotação zerada + sombra, cursor "pointer".
- O pin de comentário fica ancorado no canto do sticker (aparece sempre; pulsa discretamente até o primeiro clique).
- Uploads vão para a CDN via pointers `.asset.json` (sem binários no repo).

## Post-it (CSS, sem imagem)

- Papel amarelo com leve rotação, sombra hard offset, canto dobrado, tipografia Satoshi.
- Texto: "Senior Product Designer with 10+ years of experience creating digital products that connect people and solve real problems — from mobile apps to AI-powered tools."
- Substitui o parágrafo atual com a barra azul à esquerda (ele será removido nas duas variantes, mobile e desktop).

## Layout da Hero

- Desktop: headline "Hello," + post-it na coluna esquerda; stickers posicionados em volta do card de perfil e nos espaços vazios (absolute, sem colidir com CTAs).
- Mobile: post-it em fluxo normal e stickers em uma faixa horizontal compacta abaixo dos CTAs, com tamanhos reduzidos; comentários abrem em overlay para não empurrar conteúdo.
- Sem alteração no card de perfil, badge de disponibilidade, CTAs ou bloco de Location.

## Detalhes técnicos

- Novos arquivos: `src/components/FigmaComment.tsx`, `src/components/HeroSticker.tsx`, `src/components/PostItNote.tsx`.
- Edição: `src/pages/Index.tsx` (remoção dos dois parágrafos, inclusão do post-it e dos stickers).
- Assets: `lovable-assets create` para os 3 stickers usados + Brazil, importados como pointer JSON.
- Nenhuma cor hardcoded: tokens semânticos do `index.css`; o amarelo do post-it entra como token novo (`--postit`) para funcionar em light e dark.
- A área dos stickers desativa a captura do `DrawingCanvas` (pointer events próprios), evitando riscos acidentais ao clicar num sticker.
