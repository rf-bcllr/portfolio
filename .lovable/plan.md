Plano de implementação

Objetivo: aproximar o visual global do portfólio ao HTML de referência com bastante rigor, mas preservando exatamente o que você pediu: fontes atuais, dados/informações reais, imagens existentes e o design recém-refinado dos cards de projeto.

1. Preservar o que não deve mudar
- Manter Clash Display para headings e Satoshi para corpo.
- Manter todos os dados vindos dos arquivos atuais, sem inventar métricas ou alterar conteúdo essencial.
- Manter as imagens atuais do portfólio.
- Não alterar a estrutura interna nem o visual do `WorkProjectCard.tsx` e não desfazer as melhorias feitas nos cards de projeto.

2. Reaproximar o visual global do HTML de referência
- Ajustar o sistema visual em `src/index.css` para um canvas mais editorial/minimalista, com fundo claro, textura/dot-grid discreta, bordas suaves e sombras mais contidas.
- Remover excesso de sensação “app dashboard” fora dos cards, deixando a página respirar mais e os cards serem o foco visual.
- Manter o azul royal apenas em estados interativos/glows, respeitando a regra do projeto.

3. Refinar a Home sem perder informações
- Reorganizar `src/pages/Index.tsx` para uma composição mais parecida com a referência: hero textual forte, blocos editoriais simples, colunas/listas mais limpas e menos elementos decorativos pesados.
- Manter foto, CTAs, anos de experiência, capacidades, empresas/logos e informações principais.
- Trocar cards genéricos muito “componentizados” por blocos mais leves e alinhados ao estilo do HTML.

4. Refinar a página Work mantendo os cards exatamente como estão
- Ajustar apenas o entorno dos cards em `src/pages/Work.tsx`: cabeçalho, texto introdutório, espaçamento, largura, ritmo vertical e densidade editorial.
- Preservar `WorkProjectCard.tsx` como está, incluindo frames/mockups, espaçamentos internos, mídias e metadados.
- Garantir que os cards se integrem ao novo canvas sem competir visualmente com a introdução.

5. Ajustar navegação e footer para o mesmo idioma visual
- Refinar `src/components/SiteNav.tsx` para ficar mais minimalista, com menos peso visual, preservando links e avatar.
- Refinar `src/components/ContactFooter.tsx` para um encerramento mais editorial e limpo, mantendo CTA, LinkedIn e copyright.

Arquivos previstos
- `src/index.css`
- `src/pages/Index.tsx`
- `src/pages/Work.tsx`
- `src/components/SiteNav.tsx`
- `src/components/ContactFooter.tsx`

Critérios de aceite
- A aparência geral fica mais próxima do HTML de referência.
- Fontes atuais continuam as mesmas: Clash Display e Satoshi.
- Dados, informações e imagens permanecem reais e preservados.
- Cards de projeto permanecem exatamente com o design atual.
- O resultado final fica mais criterioso em espaçamento, hierarquia, respiro e consistência visual.