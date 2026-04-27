Plano para refinar a página de projetos

1. Corrigir o tipo de frame por projeto
- Meu Arco: tratar como mídia vertical/mobile, usando frame de smartphone alto, já que o vídeo/poster real é 1200x2880.
- Cheguei: tratar como mídia vertical/mobile, usando frame de smartphone alto, já que o vídeo/poster real é 720x1458.
- Saúde e Ponto: tratar como mídia horizontal/desktop-canvas, porque a imagem real é 1920x1031 e hoje está herdando `coverType: vertical` do projeto.
- AI Writing Assistant e AI Question Generator: manter frames horizontais/laptop ou browser, pois as mídias são horizontais.

2. Adicionar configuração visual individual por projeto
- Expandir `FeaturedProject` com um campo de apresentação de mídia, por exemplo `mediaPresentation`, separado do `coverType` do case study.
- Esse campo controlará: tipo de frame, tamanho máximo, alinhamento, pequenas rotações/offsets, tratamento de background e proporção interna.
- Isso evita o erro atual de usar automaticamente `project.coverType`, que não representa corretamente a mídia destacada do card.

3. Recriar a área visual dos cards para valorizar as interfaces
- Substituir o preview pequeno central por uma “stage area” maior, com mockup adequado:
  - Smartphone frame para mobile: borda arredondada, notch/ilha, inner screen 9:19 ou 9:18, sombra neutra e mídia com `object-contain`.
  - Browser/laptop/canvas frame para horizontal: barra superior discreta, tela ampla 16:10 ou proporção custom, mídia ocupando boa parte do card sem cortes.
- A mídia ficará sempre centralizada dentro da área direita, mas com escala maior e respiro suficiente.
- Remover ou reduzir elementos decorativos que competem com a interface, mantendo apenas detalhes sutis de “working board”.

4. Refinar layout, espaçamentos e hierarquia dos cards
- Ajustar grid desktop para dar mais presença à coluna visual sem esmagar o texto.
- Aumentar altura mínima dos cards de projetos com mídia vertical para permitir que o mockup apareça de forma digna.
- Melhorar padding interno, gap entre chips/título/resumo/metadados e alinhamento do botão/ícone de navegação.
- Manter a leve irregularidade/rotação dos cards, mas de forma mais controlada para não prejudicar leitura.

5. Melhorar resumo e outcomes sem inventar dados
- Reescrever summaries e outcomes usando apenas dados reais já existentes em `projects.ts`.
- Transformar outcomes pobres em blocos mais escaneáveis, usando métricas reais quando disponíveis:
  - Meu Arco: 10k+ usuários, 45% menos tickets, 62% aumento de engajamento, 20 min/dia economizados etc.
  - Cheguei: dados reais presentes no projeto, sem extrapolar.
  - Saúde e Ponto: 92% task completion, 8.7/10 satisfação, 35% checkout mais rápido, 2.500+ views no Behance.
  - AI projects: manter honestidade quando impacto real ainda estiver pendente.
- Se necessário, trocar o campo `outcome` simples por uma lista curta de highlights para cada card.

6. Ajustar a página Work ao novo padrão
- Refinar a intro para combinar com cards mais editoriais e menos “thumbnail grid”.
- Garantir consistência visual com as regras do projeto: Clash Display/Satoshi, cards rounded-[24px], cores neutras em texto estático e azul reservado para interações/glows.

Validação
- Rodar build de produção após a implementação.
- Revisar visualmente a rota `/work` em desktop e mobile para confirmar:
  - Meu Arco e Cheguei aparecem em mockup mobile vertical.
  - Saúde e Ponto aparece em frame horizontal.
  - Nenhuma mídia está cortada desnecessariamente.
  - Os cards têm espaçamento, hierarquia e tamanho de mídia melhores.