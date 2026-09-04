# Hero nova: calma e tipográfica (gyanl.com) com stickers e comentários

Base: uma Hero de uma coluna, muito respiro, texto grande como protagonista — como o gyanl.com. Sobre essa base calma entram os quatro stickers, cada um com um comentário estilo FigJam que abre ao clicar.

## Parte 1 — A base (o que realmente muda a qualidade)

- **Uma coluna, alinhada à esquerda**, largura de leitura confortável, centralizada na página. O card grande com moldura tracejada e sombra sai de cena.
- **Retrato discreto**: foto pequena e redonda (56–64px) na mesma linha do nome, no topo. Preto e branco, ganha cor no hover.
- **Abertura tipográfica**: "Hello," em escala contida (não ocupando a tela inteira), seguido do nome e de uma frase única e fluida de apresentação. O azul aparece só na pontuação, como já é a regra do site.
- **Tag de disponibilidade** logo acima do texto, pontinho verde pulsando, com o rótulo novo: **"Available for full-time & freelance work"**.
- **Botões View Work e Resume** permanecem exatamente com o estilo atual, com mais espaço em volta.
- **Rodapé da Hero**: uma linha fina com "Based in Brazil · Open to remote worldwide" e os links LinkedIn / Email, em letra pequena e maiúscula. As especialidades viram uma linha discreta de texto no lugar dos quadradinhos.

## Parte 2 — Post-it

O parágrafo longo sai do fluxo e vira um post-it em CSS (papel claro, leve rotação, sombra deslocada, canto dobrado), posicionado à direita do texto no desktop:

"Senior Product Designer with 10+ years of experience creating digital products that connect people and solve real problems — from mobile apps to AI-powered tools."

No mobile o post-it entra em fluxo normal, abaixo da frase de abertura, sem rotação exagerada.

## Parte 3 — Stickers com comentários

Quatro stickers já enviados: Amaya, Lia, Work Anywhere (remote) e Based in Brazil.

| Sticker | Comentário |
| --- | --- |
| Amaya | "My main design companion, Amaya" |
| Lia | "Lia is a mascot I've designed for the AI in a digital platform called iônica" |
| Work Anywhere | "I'm open to remote opportunities worldwide" |
| Based in Brazil | decorativo, sem comentário |

Comportamento:

- Hover: o sticker cresce um pouco, endireita a rotação e ganha sombra; o cursor indica que é clicável.
- Clique: abre uma bolha de comentário estilo FigJam — pin redondo com a sua foto, que se expande com mola revelando o texto. Fecha ao clicar fora ou apertar Esc. Um comentário aberto por vez.
- Respeita quem prefere menos animação (sem mola, sem blur, redimensiona direto).
- Acessível: botão real com `aria-expanded`, foto com texto alternativo e inicial como fallback.

Posicionamento e disciplina visual (o ponto onde as tentativas anteriores erraram):

- Máximo de **três stickers no desktop** (Amaya, Lia, Work Anywhere), pequenos (72–96px), ancorados nas margens vazias — nunca sobre o texto, os botões ou a foto, e nunca cortados pela borda da tela. O "Based in Brazil" acompanha a linha de localização, bem pequeno.
- No **tablet e mobile** os stickers não flutuam: aparecem em uma fileira compacta abaixo dos botões, e o comentário abre como uma bolha acima do sticker, sem empurrar o conteúdo.
- Nada de rotações fortes, sombras coloridas ou stickers gigantes. O clima é de mural discreto, não de bagunça.
- A área dos stickers não dispara a ferramenta de desenho do fundo.

## Fora de escopo

Nenhuma mudança nas outras seções da home ("At a glance", logos, contato) nem nas outras páginas.

## Detalhes técnicos

- Novos componentes: `src/components/FigmaComment.tsx` (bolha com spring via framer-motion, `useReducedMotion`, click-outside, medição de altura), `src/components/HeroSticker.tsx` (wrapper de hover + âncora do pin), `src/components/PostItNote.tsx` (CSS puro).
- Edição: `src/pages/Index.tsx` — apenas o bloco `<section>` da Hero.
- Stickers entram como pointers CDN (`lovable-assets create` a partir de `amaya-sticker.png`, `lia-sticker.png`, `remote_worker_sticker.png`, `brazil-sticker.png`), sem binários no repositório.
- Tokens semânticos existentes; um único token novo para o papel do post-it (`--postit`, com valores para light e dark). Nenhuma cor literal.
- Tipografia: Clash Display para "Hello,", nome e micro-labels; Satoshi no corpo, com `text-balance`. Título em `clamp` até ~120px; frase 20–28px, `leading-[1.35]`.
- Reaproveita `animate-headline-reveal`, `animate-text-reveal`, `stagger-*` e `animate-badge-pop`.
- Verificação antes de entregar: contraste ≥ 4.5:1 em light e dark, foco visível, alvo de toque ≥ 44px nos stickers, e revisão por captura de tela em 375 / 768 / 1024 / 1440px para confirmar que nada se sobrepõe ou é cortado.
