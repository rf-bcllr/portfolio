Plano de implementação:

1. Remover a seção superior inteira da página /work
- Apagar o primeiro `<motion.section>` em `src/pages/Work.tsx`, incluindo:
  - badge “Selected work”
  - headline “Project cards shaped like a working board.”
  - texto editorial
  - botão “Resume”
- Remover imports que ficarem sem uso nessa página (`motion`, `ArrowRight`, `Sparkles`, `Button`).
- Ajustar o espaçamento do `<main>` para que a lista de cards comece de forma intencional, sem parecer que ficou um “buraco” onde a seção foi removida.

2. Expandir o sistema de cores dos cards
- Hoje os cards usam apenas `blue`, `green`, `amber` e `red`, mapeados para classes CSS como `project-card-blue`.
- Vou adicionar novos accents mais específicos para os projetos destacados:
  - `purple` para Meu Arco: roxo frio, moderno, não royal blue.
  - `teal` para Saúde e Ponto: verde-azulado mais fresco, com cara health/food tech.
  - `claudeOrange` para AI Writing Assistant: laranja quente inspirado no Claude, sem ficar amarelo demais.
  - `guavaRed` para AI Question Generator: vermelho mais rosado/guava, menos vermelho puro.
- Manterei os tons em HSL no `src/index.css`, seguindo o padrão atual do design system.

3. Aplicar as novas cores no data source dos projetos
- Atualizar `src/data/featuredProjects.ts` para trocar os accents:
  - Meu Arco: `purple`
  - Students Transportation: pode permanecer `blue`
  - Saúde e Ponto: `teal`
  - AI Writing Assistant: `claudeOrange`
  - AI Question Generator: `guavaRed`
- Ajustar o type `FeaturedProject["accent"]` para aceitar os novos nomes sem quebrar o componente.

4. Garantir consistência visual nos estados do card
- Atualizar `src/components/WorkProjectCard.tsx` para mapear os novos accents para as novas classes CSS.
- As novas cores serão usadas automaticamente em:
  - faixa lateral do card
  - chips/badges
  - borda no hover
  - fundo da área de mockup
  - card “Signal”
  - dots ativos do carrossel
- Vou manter o princípio da memória do projeto: royal blue continua reservado para estados interativos/glows, então os novos accents serão específicos e não vão disputar com o azul principal.

Arquivos a alterar após aprovação:
- `src/pages/Work.tsx`
- `src/data/featuredProjects.ts`
- `src/components/WorkProjectCard.tsx`
- `src/index.css`

Resultado esperado:
- A página `/work` começa diretamente nos cards, sem a seção superior selecionada.
- Cada projeto ganha uma identidade cromática mais precisa e menos genérica.
- Meu Arco fica com roxo frio; Saúde e Ponto com teal; AI Writing Assistant com laranja estilo Claude; AI Question Generator com vermelho guava/rosado.
- O sistema continua centralizado e reutilizável para futuros cards.