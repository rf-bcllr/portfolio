# Hero mais limpa e tipográfica (referência gyanl.com)

Objetivo: uma Hero calma, editorial e de alta qualidade — uma coluna, texto grande como protagonista, muito respiro. Sem stickers, sem post-it, sem elementos flutuantes.

## O que muda

- **Uma coluna, alinhada à esquerda**, largura máxima confortável de leitura, centralizada na página. O card grande com moldura tracejada e sombra sai de cena.
- **Retrato continua, mas discreto**: uma foto pequena e redonda (56–64px) na mesma linha do nome, no topo. Preto e branco, ganha cor no hover.
- **Abertura tipográfica**: "Hello," continua como assinatura, porém em escala mais contida (nada de ocupar a tela inteira), seguido de uma frase de apresentação grande e legível — o mesmo texto de hoje, escrito como uma frase única e fluida:
  "I'm Rafael, a Senior Product Designer with 10+ years of experience creating digital products that connect people and solve real problems — from mobile apps to AI-powered tools."
  Os trechos-chave ("Senior Product Designer", "10+ years") ganham destaque leve, e o azul aparece só na pontuação e nos links, como já é a regra do site.
- **Tag de disponibilidade** fica logo acima do texto, com o pontinho verde pulsando, e o rótulo passa a: **"Available for full-time & freelance work"**.
- **Botões View Work e Resume** permanecem, com o mesmo estilo atual (preenchido + contorno com sombra deslocada), agora com mais espaço em volta.
- **Rodapé da Hero**: uma linha fina com "Based in Brazil · Open to remote worldwide" e os links LinkedIn / Email — informação de metadados, em letra pequena e maiúscula, como o resto do site. As especialidades (UX/UI Design, AI Tools, Design Systems, Research) viram uma linha discreta de texto no lugar dos quadradinhos.
- **Mobile**: mesma estrutura, escalas menores, frase encurtada como hoje; tudo em fluxo natural, sem sobreposições.
- **Entrada suave**: aparecimento em cascata (tag → título → frase → botões → rodapé), respeitando quem prefere menos animação. Nada de parallax.

## Fora de escopo

Nenhuma mudança nas outras seções da home ("At a glance", logos, contato) nem nas outras páginas.

## Detalhes técnicos

- Arquivo único: `src/pages/Index.tsx` (bloco `<section>` da Hero). Sem novos componentes, sem novas dependências, sem novos tokens.
- Tokens semânticos existentes (`foreground`, `muted-foreground`, `primary`, `card`) — nenhuma cor literal.
- Tipografia: Clash Display para "Hello," e nome; Satoshi para a frase, com `text-balance` para evitar linhas órfãs.
- Escalas propostas: título `clamp` até ~120px no desktop; frase 20–28px com `leading-[1.35]`.
- Reaproveita as classes de animação já existentes (`animate-headline-reveal`, `animate-text-reveal`, `stagger-*`) e o `animate-badge-pop`.
- Retrato: `hero-portrait.png` já importado, agora em `rounded-full` de 56–64px (única exceção arredondada, junto aos botões pill).
- Checagem final: contraste do texto ≥ 4.5:1 nos temas light e dark, foco visível nos links/botões, e revisão em 375 / 768 / 1024 / 1440px.
