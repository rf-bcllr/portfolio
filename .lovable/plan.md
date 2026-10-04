# Controles móveis e identidade do jogo

## Resultado
- Tornar o jogo totalmente jogável por toque, mantendo teclado e mouse intactos.
- Otimizar a HUD para celular em modo paisagem, respeitando áreas seguras e evitando cobrir o jogo.
- Exibir somente “Quest for the Next Product” como nome do jogo.
- Atualizar o personagem da Home com camisa azul e as 12 novas falas fornecidas.

## Implementação
1. Trocar os controles móveis por botões semânticos de toque para esquerda, direita, pulo e interação, com alvos de pelo menos 48 px, feedback visual e cancelamento seguro ao soltar ou interromper o toque.
2. Criar uma composição compacta da HUD móvel: manter contexto e coletáveis legíveis, reunir ações secundárias sem sobreposição e posicionar os controles de movimento dentro das áreas seguras.
3. Remover “Rafael Bacellar” dos títulos visíveis e metadados específicos da página Play onde ele compõe o nome do jogo, preservando o conteúdo biográfico dentro da experiência.
4. Criar uma variante azul do sprite existente sem alterar suas proporções ou animação e usá-la somente no personagem da Home.
5. Substituir a lista de falas do personagem pelas 12 frases fornecidas, mantendo a troca da etiqueta do cursor e a navegação para o jogo.

## Verificação
- Testar o início e os quatro comandos por toque em viewport móvel horizontal.
- Conferir HUD sem sobreposição em telefone pequeno, telefone maior e tablet.
- Conferir teclado no desktop, título do jogo, sprite azul, todas as falas e navegação para `/play`.
- Validar o console, a compilação e o comportamento com movimento reduzido.

## Detalhes técnicos
- O jogo continua vanilla JS/Canvas dentro do iframe; os controles usarão Pointer Events para unificar toque, caneta e mouse e evitar estados presos.
- A arte azul será derivada do spritesheet atual, preservando transparência, dimensões e coordenadas dos frames.
- Nenhum link público para páginas de detalhe de projetos será adicionado.
