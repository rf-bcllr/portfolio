## Ajuste no Award "Cada um na Sua"

Atualmente o sticker e o texto estão lado a lado dentro do mesmo `Card`. O objetivo é separar visualmente os dois elementos: o card mantém apenas o conteúdo textual, enquanto o sticker "flutua" sobre o fundo cinza da página, levemente sobreposto ao card — como um sticker colado por cima.

### Mudanças em `src/pages/Certifications.tsx` (seção Awards)

1. **Wrapper relativo** ao redor do `Card` para permitir posicionar o sticker absolutamente em relação a ele.
2. **Card de texto puro**: remover o grid de duas colunas e a imagem de dentro do `Card`. Manter apenas o título, descrição e link "View on Behance". Adicionar padding à direita (ex.: `md:pr-48`) para reservar espaço visual e evitar que o sticker cubra o texto em telas maiores.
3. **Sticker como elemento sobreposto**:
   - Posicionado com `absolute` no canto superior-direito do wrapper, deslocado para fora do card (ex.: `-top-8 -right-6` em desktop; menor deslocamento em mobile).
   - Sem fundo, sem borda — apenas o PNG com `drop-shadow` para reforçar a sensação de adesivo.
   - Mantém a leve rotação (`-rotate-[4deg]`) e o hover sutil.
   - Continua envolto em `<a>` para o Behance.
4. **Responsivo**: em mobile, o sticker fica menor e posicionado no topo-direito sem cobrir texto crítico (ou pode ir acima do card centralizado, se preferir — confirmar se necessário).

Nenhuma outra seção é afetada.
