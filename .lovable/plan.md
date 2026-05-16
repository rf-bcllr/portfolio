## Garantir que o desenho não exista em smartphones / viewports pequenos

Hoje `DrawingCanvas` já é gated por `(pointer: fine)` e retorna `null` no mobile, mas:
- Alguns dispositivos híbridos (tablets com caneta/trackpad, modo desktop em mobile, Windows touch) reportam `pointer: fine` mesmo com tela pequena.
- Não há um cutoff explícito de largura.

### Mudança em `src/components/DrawingCanvas.tsx`

Combinar três condições e só ativar quando **todas** forem verdadeiras:

1. `(pointer: fine)` — já existe.
2. `(hover: hover)` — descarta touchscreens que emulam fine pointer.
3. `window.innerWidth >= 1024` — descarta tablets e viewports pequenos (alinhado com o breakpoint `lg` do Tailwind, acima do `md` 768px usado no resto do site).

Implementação:
- Substituir o único `matchMedia("(pointer: fine)")` por uma media query combinada `"(pointer: fine) and (hover: hover) and (min-width: 1024px)"`.
- Manter o listener `change` para reagir a resize/rotate; já desmonta canvas e remove os listeners de `pointerdown/move/up/selectstart/dragstart` via cleanup existente quando `isDesktop` vira `false`.
- Renomear nada — só endurece o gate. Comportamento desktop atual permanece idêntico.

### Por que não ajustar `App.tsx`

O componente já se auto-desmonta retornando `null`. Não há ganho em condicionar no `App.tsx`.

### Verificação

Após a mudança: no preview 390×844 (mobile), nenhum canvas, nenhum listener global, nenhum botão "Clear". Em ≥1024px com mouse, drawing continua funcionando como hoje.
