# Ajustes de layout e consistência do portfólio jogável

## O que será alterado
- Reorganizar o HUD do jogo em dois grupos: os três botões de ação juntos e o inventário de power-ups em um card retangular arredondado separado.
- Mostrar as teclas `C` e `Esc` como pequenos keycaps nos respectivos botões, mantendo New Game no mesmo grupo.
- Mover o botão Play do cabeçalho para o final da lista principal de navegação, em desktop e celular.
- Posicionar o personagem da Home diretamente sobre a linha superior do rodapé da página.
- Fazer a fala do personagem substituir temporariamente a etiqueta “Visitor” do cursor, usando a mesma cor dinâmica; aplicar essa cor ao botão Play durante a sessão.
- Garantir que os logos de ferramentas do jogo preservem sua proporção no mapa e na Character Sheet.
- Estilizar o botão de fechar do card de projeto aberto sobre `/play` como o mesmo botão circular com X usado nos modais do jogo.

## Verificação
- Conferir desktop e largura estreita no navegador.
- Testar navegação por teclado, abertura/fechamento do card de projeto e interação do cursor com o personagem.
- Confirmar que não há logos deformados, sobreposições ou erros no preview.

## Detalhes técnicos
- Reutilizar os tokens e componentes existentes do portfólio.
- Manter a lógica do jogo intacta; as mudanças serão de marcação, apresentação e comunicação pontual entre personagem e cursor.
