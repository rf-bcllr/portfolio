Plano para corrigir os cards com validação automática e acabamento pixel-perfect:

1. Criar uma regra central de orientação de mídia
- Adicionar metadados de orientação em cada item de mídia dos cards: `horizontal`, `vertical` ou `square`.
- Implementar uma função única que escolhe automaticamente o mockup correto:
  - mídia vertical → frame de celular
  - mídia horizontal → frame de browser/desktop
  - mídia quadrada → frame neutro/browser compacto, se aparecer no futuro
- A função também definirá o aspect ratio, largura máxima e altura do palco, evitando mapeamentos manuais frágeis.

2. Corrigir os dados dos projetos com base nas dimensões reais
- Saúde e Ponto: as duas imagens reais são horizontais, então ambas devem usar mockup horizontal/browser. Manter carrossel porque existem duas imagens distintas, mas garantir que a troca seja visível.
- AI Writing Assistant: poster e vídeo/dashboard são horizontais, então ambos devem usar browser. Corrigir a mídia do segundo slide para usar poster/fonte correta do dashboard, evitando parecer que nada mudou.
- Meu Arco e Cheguei: vídeos/posters verticais devem permanecer em phone frame.
- AI Question Generator: vídeo e poster horizontais devem usar browser; como podem representar o mesmo asset visual, remover item redundante se a troca não agregar.

3. Corrigir o bug de carrossel que parece não mudar imagem
- Ajustar a construção de `mediaItems` em `featuredProjects.ts` para deduplicar por asset real e não apenas por comparação simples com poster.
- Para itens de vídeo vindos da galeria, renderizar como vídeo quando for `.mp4/.webm`, não como imagem quebrada/estática.
- Para o AI Writing Assistant, incluir explicitamente o vídeo/preview do dashboard com poster correto (`ai-comms-dashboard-poster.jpg`) para o segundo slide.
- Adicionar uma `key` no render do `MediaThumb` baseada no asset ativo para forçar troca limpa entre mídia anterior e próxima.

4. Refinar o componente visualmente
- Fazer o palco do mockup reagir ao frame ativo sem saltos bruscos.
- Preservar o fundo claro da cor principal do card.
- Ajustar `object-fit`: browser com imagens horizontais deve preencher com boa leitura, phone deve preservar proporção vertical sem crop agressivo.
- Manter setas e dots apenas quando houver mais de uma mídia realmente distinta.

Arquivos a alterar após aprovação:
- `src/data/featuredProjects.ts`
- `src/components/WorkProjectCard.tsx`
- Se necessário, `src/data/animatedMedia.ts` para expor o poster correto do dashboard do AI Writing Assistant.

Resultado esperado:
- Nenhuma imagem horizontal aparecerá em mockup vertical, nem imagem vertical em browser.
- Projetos com uma única mídia não mostrarão carrossel.
- Saúde e Ponto e AI Writing Assistant terão troca de mídia perceptível e correta.
- A regra ficará estrutural, reduzindo risco de novos mismatches quando novas mídias forem adicionadas.