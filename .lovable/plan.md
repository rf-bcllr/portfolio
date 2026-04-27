Plano para deixar o visual mais próximo do HTML anexado, preservando fontes, dados, imagens e os cards de projeto já refinados.

1. Ajustar o design system global
- Migrar o clima visual para uma base mais “app editorial”: fundo azul-claro/cinza frio, cards brancos, bordas suaves, sombras discretas e azul institucional profundo.
- Manter as fontes atuais do projeto: Clash Display nos títulos e Satoshi no corpo.
- Manter os dados reais, imagens e mídia já existentes.
- Adaptar os tokens de cor em `src/index.css` sem alterar a estrutura de conteúdo.

2. Recriar o background inspirado no HTML
- Substituir o grid/efeito atual por um fundo mais próximo do arquivo: superfície `#F0F4FA`, gradientes azul-marinho suaves e formas circulares grandes em baixa opacidade.
- Manter tudo em CSS, sem adicionar framer-motion ao background.
- Evitar excesso de glow azul em texto estático, usando azul principalmente em barras, badges, botões e estados interativos.

3. Refinar navegação e layout das páginas
- Ajustar a página `/work` para lembrar uma tela de produto/dashboard: container mais largo, top section em card branco, cabeçalho azul em gradiente e espaçamento mais compacto.
- Manter o texto e chamadas existentes, mas colocá-los em uma composição visual parecida com os blocos do HTML: cabeçalhos azul-escuros, corpos brancos, bordas finas e sombras leves.
- Aplicar refinamentos similares onde fizer sentido na home, sem substituir conteúdo.

4. Preservar e adaptar os cards de projeto
- Manter as mudanças recentes dos cards: mockups/frames por tipo de mídia, mídia centralizada, textos editoriais, chips, Timeline/Role/Signal e outcome highlights.
- Ajustar apenas a camada visual para aproximar do HTML: cards mais brancos, bordas menos orgânicas, cabeçalho/área de labels mais limpa, chips no estilo pill azul/claro, sombra mais contida e hover sutil.
- Manter os frames de mobile/browser e a lógica individual de cada projeto.

5. Ajustar componentes compartilhados essenciais
- Revisar `SiteNav`, botões/badges/cards e footer para harmonizar com o novo visual: azul profundo, branco, cinzas frios, bordas finas e cantos levemente mais institucionais, respeitando a regra dos botões pill.
- Não alterar fontes, dados, imagens ou informações dos projetos.

Arquivos previstos
- `src/index.css`
- `src/components/AnimatedBackground.tsx`
- `src/pages/Work.tsx`
- `src/components/WorkProjectCard.tsx`
- Possivelmente `src/components/SiteNav.tsx`, `src/components/ContactFooter.tsx` e componentes UI mínimos se necessário para consistência.

Validação
- Rodar build/typecheck ao final.
- Conferir visualmente a página de projetos em desktop e responsivo, principalmente se os mockups continuam valorizando as mídias horizontal/vertical sem cortes.