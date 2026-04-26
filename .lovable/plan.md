## Restaurar imagem do AI Writing Assistant

O GIF original foi recuperado e já copiado para `src/assets/ai-writing-assistant.gif`. Agora preciso substituir o placeholder (`projThumb1` / `proj-thumb-1.png`) pela referência correta.

### Arquivos a editar

**1. `src/pages/Index.tsx`**
- Adicionar import: `import aiWritingAssistant from "@/assets/ai-writing-assistant.gif";`
- Trocar `src: projThumb1` (no card "AI Writing Assistant", linha ~82) por `src: aiWritingAssistant`
- Remover import `projThumb1` se não houver mais uso

**2. `src/data/projects.ts`**
- Adicionar import do novo GIF
- Procurar referência ao projeto AI Writing Assistant e atualizar `heroImage` + entradas de `gallery` para usar o GIF

**3. `src/data/projectsStructured.ts`**
- Mesma atualização: import do GIF e troca de `projThumb1` no projeto AI Writing Assistant (heroImage + gallery)

### Observações
- O GIF agora fica versionado dentro de `src/assets/`, não depende mais de URL externa que pode quebrar
- O Meu Arco continua usando `meuArcoOgCover` (que é uma imagem real do projeto, não placeholder), então fica como está — a menos que você queira alterá-lo também