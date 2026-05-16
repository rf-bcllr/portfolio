## Três ajustes — Hero mobile, dropdown mobile e desenho no fundo (desktop)

### 1. Encurtar o parágrafo abaixo do "Hello" no mobile

`src/pages/Index.tsx` — o parágrafo atual (`<p>` após `<h1>Hello,</h1>`) tem 3-4 linhas no mobile. Renderizar duas versões:

- **Mobile (`md:hidden`)** — versão curta, máx. 2 linhas. Sugestão:
  > Senior Product Designer com 8+ anos criando produtos digitais — de apps a ferramentas com IA.
- **Desktop (`hidden md:block`)** — mantém o texto longo atual sem alterações.

Nenhuma mudança no h1, botões ou cartão de localização.

### 2. Dropdown mobile do menu sobrepondo a página

`src/components/SiteNav.tsx` — hoje o painel mobile colapsável é renderizado em fluxo normal dentro do `<header sticky>`, então empurra o conteúdo da página para baixo quando aberto.

Alteração: posicionar o painel mobile como `absolute` em relação ao header, com `inset-x-4 top-full mt-2`, mantendo `z-50` (já herdado do header sticky). Assim ele flutua sobre o conteúdo e some sem reflow. Manter backdrop blur e estilo atuais. Nenhuma mudança no desktop.

### 3. Desenhar no fundo (desktop) com a cor do cursor

Novo comportamento exclusivo de desktop (`(pointer: fine)`), usando a mesma cor aleatória já gerada pelo `CustomCursor`.

**Abordagem técnica:**
- Extrair a paleta `CURSOR_COLORS` para um arquivo compartilhado (`src/lib/cursorColor.ts`) com a cor da sessão persistida em `sessionStorage` para que `CustomCursor` e o novo componente de desenho usem exatamente a mesma cor.
- Criar `src/components/DrawingCanvas.tsx`:
  - `<canvas>` posicionado `fixed inset-0` com `z-index` entre o fundo grid (`-z-20`) e o conteúdo (default `0`). Usar `-z-10` para ficar acima do grid e abaixo do conteúdo. `pointer-events-none` por padrão.
  - Ativar `pointer-events: auto` somente quando o usuário pressionar e segurar a tecla **Espaço** (ou alternativamente um toggle visual; ver pergunta abaixo). Enquanto ativo: cursor muda para indicar modo desenho, mouse down inicia traço, mouse move desenha linhas suaves com a cor da sessão, mouse up encerra.
  - Traços são canetinha estilo FigJam: `lineWidth ~3`, `lineCap: "round"`, `lineJoin: "round"`, leve opacidade.
  - Botão flutuante discreto no canto inferior-direito (apenas desktop) com tooltip "Segure espaço para desenhar" e opção "Limpar" para apagar os traços.
  - Canvas redimensiona com `window.resize`.
  - Desabilitado completamente em `(pointer: coarse)` (touch/mobile).
- Montar `<DrawingCanvas />` em `src/App.tsx` ao lado de `<AnimatedBackground />` e `<CustomCursor />`.

### Considerações

- Como o grid pontilhado fica em `-z-20` e o conteúdo principal não declara z-index, o canvas em `-z-10` aparece sobre o grid e abaixo de cartões/texto — exatamente o efeito de "desenhar no fundo".
- Persistência dos traços entre páginas: como `<DrawingCanvas />` vive no `App.tsx`, ele persiste em navegações client-side sem recarregar; o limpar fica manual.

### Pergunta para confirmar antes de implementar

Para o modo desenho no desktop: prefere **(a)** segurar a tecla espaço para ativar (mais "FigJam-like" e não polui a UI) ou **(b)** um botão flutuante de toggle no canto da tela (mais descoberto, mas visível o tempo todo)?

Sem essa resposta sigo com a opção (a) + um pequeno hint visual discreto no primeiro carregamento.
