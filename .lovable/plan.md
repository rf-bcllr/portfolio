# Avaliar Stageshow para bento grids na página /work

## O que é a skill
Stageshow monta "interfaces de produto ilustradas" em React + CSS: telas simplificadas, celulares, dashboards e grids bento, como imagem parada ou animação curta com cursor. Não usa prints nem GIFs — tudo é desenhado em código.

## Viabilidade
- Encaixa bem: o site já é React e os cards de /work têm áreas de mídia (hoje GIFs e prints).
- Vantagens: carrega mais rápido que GIF, nítido em qualquer tela, respeita tema claro/escuro e "reduzir movimento".
- Riscos:
  - Cada projeto vira uma ilustração feita à mão; precisa refletir a interface real, sem inventar números (regra do portfólio).
  - Precisa seguir o estilo editorial: bordas pretas, cantos retos, sombra dura, azul como único destaque.
  - Mais trabalho por projeto do que trocar um GIF.

## Proposta: piloto antes de trocar tudo
1. Instalar a skill no projeto.
2. Escolher 1 projeto que hoje usa GIF (ex.: AI Image Generation ou Lesson Plan Tool) e montar um bento com 3–4 destaques reais dele, parado + versão animada no hover/ao aparecer.
3. Mostrar lado a lado com o GIF atual em desktop e celular para você decidir.
4. Se aprovar, aplicar aos demais projetos um por um, mantendo o GIF como alternativa até cada bento ficar pronto.

Nada muda nos outros cards durante o piloto.

## Detalhes técnicos
- Instalar via `npx skills add benjitaylor/skills --skill stageshow` em `.agents/skills`.
- Novo componente por projeto (ex.: `src/components/stage/<slug>Bento.tsx`) referenciado em `featuredProjects` como novo tipo de mídia `stage`, sem alterar os fatos em `projectsData`.
- Versão compacta para celular (~358px), `poster` estático para reduced motion.
