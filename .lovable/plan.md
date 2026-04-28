Plano para refinar os cards de projetos em /work

1. Remover navegação para páginas individuais
- Trocar o wrapper atual do card de `Link` para um container/`article` não clicável.
- Remover o ícone/botão visual de seta no canto superior direito que sugeria abrir o projeto.
- Atualizar o texto introdutório da página Work para não dizer que o usuário pode abrir cada projeto para um deep dive.
- Manter o cursor/hover refinado apenas como feedback visual do card, sem ação de navegação.

2. Criar carousel de mídia dentro do card
- Expandir os dados de `featuredProjects` para suportar uma lista de mídias por projeto, não apenas um `poster`/`media` único.
- Usar as galerias reais de `projects.ts` e os vídeos otimizados de `animatedMedia.ts` como fonte.
- Para projetos com mais de uma mídia, adicionar setas discretas na área direita do card, sobre/ao lado do mockup.
- Ao trocar a mídia, o mockup também troca de formato conforme o item ativo:
  - vídeos mobile de Meu Arco e Cheguei em frame de celular;
  - imagens horizontais em frame browser;
  - imagens verticais em frame de celular ou frame vertical, conforme o caso do projeto;
  - Saúde e Ponto mantendo tratamento especial para imagem horizontal dentro de composição vertical quando fizer sentido.
- Exibir um pequeno indicador de posição quando houver múltiplas mídias, evitando poluir o visual.

3. Refinar fundo dos mockups e background geral
- Mover o grid pontilhado cinza para o background geral do site, usando o componente `AnimatedBackground`/classe `figjam-grid` como base visual global.
- Remover o grid pontilhado da área interna dos mockups/cards.
- Fazer a área de mídia dos cards usar uma versão clara da cor principal de cada card, via tokens já existentes:
  - azul: `--project-accent-bg`/variação leve;
  - verde: equivalente;
  - âmbar: equivalente;
  - vermelho: equivalente.
- Ajustar bordas, sombras e padding para o mockup parecer mais integrado ao card e menos “preview pequeno”.

4. Revisar dados e tom editorial dos projetos
- Atualizar `featuredProjects.ts` para puxar mais informações reais de `projects.ts`/`projectsStructured.ts`, evitando claims soltos ou inconsistentes.
- Corrigir Meu Arco para incluir o dado importante de rating do app, usando a versão real encontrada na base: `2.9 → 4.8★`.
- Remover frases ruins ou provisórias como “case study intentionally pending” e “impact not documented yet” do Question Generation.
- Reescrever os blocos de resumo, timeline/role/signal e highlights com tom editorial consistente, sem inventar métricas.
- Para projetos em desenvolvimento, usar linguagem honesta e mais premium, por exemplo “Concept validation in progress”, “AI workflow exploration” ou similar, sem parecer placeholder.

5. Ajustes visuais finos dos cards
- Refinar espaçamentos entre chips, título, resumo, metadados e highlights.
- Melhorar hierarquia dos blocos Timeline/Role/Signal para ficarem mais consistentes e menos densos.
- Garantir que setas do carousel não conflitem com o clique/hover do card.
- Validar responsividade: no desktop a área de mídia continua valorizada; no mobile o carousel continua utilizável sem quebrar os cards.

Arquivos principais a alterar
- `src/components/WorkProjectCard.tsx`
- `src/data/featuredProjects.ts`
- `src/pages/Work.tsx`
- `src/components/AnimatedBackground.tsx` e/ou `src/index.css` para o grid global e tokens de background

Notas técnicas
- A implementação deve continuar usando React/Vite/Tailwind existentes.
- O carousel será local ao card com estado React simples ou reaproveitando o componente `Carousel` existente se ele não criar complexidade visual desnecessária.
- A mídia seguirá usando `MediaThumb`, mantendo suporte para imagem, poster e vídeo otimizado.