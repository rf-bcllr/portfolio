

## Correção: Espaçamento uniforme no Marquee de Tools

### Problema
O marquee usa dois `div` flex separados lado a lado. O `gap-12` funciona apenas **dentro** de cada div, mas entre o último item do primeiro div e o primeiro item do segundo div não há gap -- eles ficam "colados".

### Solução
Adicionar `padding-right: 3rem` (equivalente ao `gap-12` = 48px) em cada div do marquee, garantindo que o espaço entre o último e o primeiro item seja idêntico ao espaço entre todos os outros.

Alternativa mais limpa: usar `margin-left` ou `gap` no container pai flex. Porém, como o container pai já usa `flex` sem gap, a forma mais direta é adicionar `pr-12` (padding-right de 48px) em cada div interno, igualando o `gap-12`.

### Arquivo a editar

**`src/components/ToolsMarquee.tsx`**

- Linha 35: adicionar `pr-12` ao className do primeiro div animado
- Linha 59: adicionar `pr-12` ao className do segundo div animado (duplicado)

Isso garante que o espaço visual entre a última ferramenta e a primeira da próxima iteração seja exatamente igual ao espaço entre quaisquer duas ferramentas consecutivas.

### Impacto
- Apenas o componente ToolsMarquee é alterado
- Nenhum efeito colateral em outros componentes ou páginas
- O Marquee genérico (`Marquee.tsx`) tem o mesmo problema mas não foi solicitado ajuste

