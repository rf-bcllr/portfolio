# Correções do inimigo, carregamento, modais e FAB

## O que será alterado
- Renomear todo texto visível de “Literally Death” para “The Gravedigger”, preservando IDs e progresso salvo.
- Corrigir o prompt próximo ao inimigo: antes da primeira vitória, mostrar o nome/ação inicial; usar “Replay 2020” somente após a batalha concluída.
- Refinar a tela de carregamento do jogo e a cobertura de carregamento da página Play com a mesma linguagem visual: hierarquia mais clara, progresso legível, personagem bem enquadrado e dicas estáveis, sem animação excessiva.
- Padronizar todos os botões de fechar dos project cards como controles circulares com o mesmo tamanho, borda, foco e feedback de pressão.
- Melhorar a transição expandido/recolhido do FAB da IA com movimento interruptível, ícone estável e texto em fade/slide, mantendo a elevação quando “Clear drawing” aparece e respeitando movimento reduzido.

## Verificação
- Testar o inimigo antes e depois de `bossDone`, incluindo o texto do prompt e a abertura da batalha.
- Conferir o carregamento no desktop e no viewport móvel atual, com e sem `prefers-reduced-motion`.
- Abrir project cards pelos dois caminhos: modal do site e fallback interno do jogo; confirmar X redondo e acessível.
- Rolar Home, Resume e Certifications para validar o FAB expandido no topo/rodapé, recolhido no meio e sem sobreposição.
- Confirmar preview sem erros e checagem de tipos limpa.

## Detalhes técnicos
- Manter o jogo em JavaScript/Canvas sem refatoração estrutural.
- Reutilizar os tokens e a direção editorial/pixel-art existentes; azul royal continua sendo o único destaque.
- Aplicar os princípios de interface, layout, UI e movimento das skills ativas; não instalar código externo do repositório citado se a orientação puder ser aplicada com o sistema de movimento atual.
