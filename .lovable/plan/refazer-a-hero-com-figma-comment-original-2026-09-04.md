# Refazer a Hero com Figma Comment original

## Objetivo
Reconstruir somente a Hero para corrigir os comentários e criar uma composição orgânica inspirada na Hero de gyanl.com, preservando o conteúdo aprovado, CTAs, fundo pontilhado, fontes e temas atuais.

## O que será alterado
- Substituir o comentário atual por uma adaptação direta do código oficial `@smoothui/figma-comment`: bolha fechada de 32px com avatar, expansão a partir do canto inferior esquerdo, tipografia e sombras originais, medição responsiva de altura, spring, clique fora, Escape e redução de movimento.
- Não renderizar bolinha azul nem qualquer indicador adicional.
- Ancorar visualmente cada comentário sobre o sticker correspondente; o sticker inteiro continuará clicável e terá uma reação discreta ao hover.
- Refazer a Hero como um canvas editorial assimétrico: headline em um núcleo visual claro, stickers grandes distribuídos em profundidades e posições irregulares, sem formar linhas ou colunas rígidas.
- Tratar o post-it como o sétimo sticker, deslocado e levemente inclinado fora do centro, em vez de integrá-lo ao bloco de texto.
- Manter: “I'm Rafael Bacellar.”, “Your next product designer.”, tag de disponibilidade, View Work e Resume.
- Manter os seis stickers e respectivos comentários/link; “Based in Brazil” permanece decorativo.
- No mobile, usar uma composição compacta em canvas com tamanhos menores e posições intencionais, sem transformar os stickers em uma grade alinhada.

## Detalhes técnicos
- Reescrever `StickerComment.tsx` seguindo constantes, estrutura, animações e classes do componente oficial, adaptando apenas imports e suporte a link.
- Reorganizar apenas a Hero em `Index.tsx`; nenhuma outra seção será redesenhada.
- Ajustar `PostItNote.tsx` apenas se necessário para funcionar como elemento solto do canvas.
- Verificar 390px, tablet e desktop; testar abertura/fechamento, link do GitHub, foco, Escape, ausência de sobreposição e preferência por movimento reduzido.
