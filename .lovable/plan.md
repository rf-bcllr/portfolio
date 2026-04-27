Plano de implementação

1. Reestruturar a navegação principal

- Criar um menu fixo/flutuante no estilo FigJam com as páginas: Home, Work, Resume e Certifications.
- Manter a identidade “Rafa Bacellar / rfbcllr.”, LinkedIn e ações principais sem transformar o portfólio em template genérico.
- Configurar rotas dedicadas:
  - `/` para Home
  - `/work` para lista de projetos
  - `/resume` para currículo/experiência
  - `/certifications` para certificados, prêmios e recomendações
  - `/project/:slug` para detalhes dos projetos

2. Aplicar nova direção visual “FigJam editorial”

- Trocar a estética atual dark/glassmorphism por uma base clara/off-white com grid pontilhado, cartões brancos, bordas suaves, labels coloridos e elementos tipo sticky note/canvas.
- Preservar Clash Display para títulos e Satoshi para corpo.
- Usar azul royal apenas em estados interativos/glows, respeitando a memória do projeto.
- Substituir o background animado atual por um background CSS leve, com aparência de canvas/board.
- Ajustar botões para pill-shape e cards para `rounded-[24px]`, mantendo consistência já definida.

3. Reorganizar a Home

- Transformar a Home em uma entrada mais parecida com um portfolio editorial/canvas:
  - Hero com apresentação curta de Rafa Bacellar
  - Blocos visuais de skills, disponibilidade e foco profissional
  - Prévia curta dos projetos principais
  - Logos de empresas em um bloco mais clean
  - CTA para Work e Resume
- Reduzir a quantidade de seções longas na Home para que ela funcione como landing page principal.

4. Criar/ajustar a página Work

- Focar exclusivamente nestes projetos:
  - Meu Arco
  - Students’ Transportation Feature / Cheguei
  - Saúde e Ponto
  - AI Writing Assistant
  - AI Question Generation Tool
- Remover da experiência principal os projetos antigos/irrelevantes como Cyberbrake, Mural, Digital Signature etc. da listagem de Work.
- Criar uma grade/lista de projetos inspirada no site de referência, mas com visual FigJam: cards horizontais, labels, tags e media previews otimizados.
- Manter os assets MP4/WebM/posters já otimizados e o componente `MediaThumb`.

5. Adaptar páginas de detalhe dos projetos

- Atualizar o layout de case study para o novo visual de canvas:
  - Header editorial do projeto
  - Meta informações em pequenos cartões/labels
  - Galeria visual mais forte
  - Seções Mission, Process, Solution, Impact e Takeaways em cards/blocos de quadro
- Manter conteúdo real vindo de `projects.ts` e `projectsStructured.ts`.
- Manter o estado “under construction” para AI Question Generation Tool, igual ao padrão já usado para projetos incompletos.

6. Criar página Resume

- Migrar a página atual `/experience` para a nova rota `/resume` ou criar uma nova página baseada nela.
- Manter experiência profissional, educação, skills, ferramentas, idiomas e botão de download do PDF.
- Adaptar visualmente para o estilo FigJam, com blocos tipo canvas, timelines e chips.
- Manter compatibilidade temporária de `/experience` redirecionando ou renderizando a mesma página, para não quebrar links existentes.

7. Criar página Certifications

- Separar certificados, prêmios e recomendações da Home.
- Reaproveitar `CertificationCard`, mas adaptando o visual para a nova linguagem.
- Incluir as recomendações já existentes na mesma página.
- Preparar uma seção de “Awards” mesmo que inicialmente tenha poucos itens ou esteja vazia/placeholder controlado, sem inventar dados.

8. Limpar dados e componentes usados na Home antiga

- Remover imports e blocos visuais que não serão mais exibidos na nova estrutura.
- Centralizar a lista dos quatro projetos principais para evitar inconsistência entre Home e Work.
- Preservar os dados reais e não fabricar métricas novas.

Detalhes técnicos

- Arquivos principais a alterar/criar:
  - `src/App.tsx` para novas rotas
  - `src/pages/Index.tsx` para nova Home
  - `src/pages/Work.tsx` nova página Work
  - `src/pages/Resume.tsx` nova página Resume, baseada em `Experience.tsx`
  - `src/pages/Certifications.tsx` nova página Certifications
  - `src/pages/ProjectDetail.tsx` para adaptar case studies ao novo visual
  - `src/index.css` e/ou componentes compartilhados para tokens e background FigJam
  - componentes de navegação/cards compartilhados, se necessário
- Não vou trocar o stack nem adicionar backend.
- Depois da implementação, rodarei type-check/build para validar que as rotas, imports e componentes estão corretos.