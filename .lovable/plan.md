## Otimização de carregamento das mídias do portfólio

### Diagnóstico

Inspecionei `src/assets/` e os componentes que renderizam mídias. Os principais problemas:

| Asset | Tamanho | Impacto |
|---|---|---|
| `ai-writing-assistant.gif` | **13 MB** | Carregado eagerly no grid da Home |
| `meu-arco-demo.gif` | **7,1 MB** | Carregado eagerly no grid da Home |
| `project-hero-bg.png` | 1,9 MB | Background pesado |
| `about-me-portrait.png` | 1,1 MB | Versão antiga (já existe `.jpg` de 128 KB em uso) |
| `hero-portrait.png` | 898 KB | Hero |

Além disso, `ProjectCard` e a maioria dos `<img>` **não usam `loading="lazy"`** nem `decoding="async"`, e não há `width`/`height` para evitar layout shift. Apenas `CompanyLogos` e o retrato "About me" já usam lazy.

Os 20 MB de GIFs são o gargalo dominante: GIFs não são streamáveis, bloqueiam decode na main thread e re-decodificam a cada repaint. A correção mais impactante é convertê-los em **MP4/WebM** (tipicamente reduzem 90–95% do tamanho mantendo qualidade) e renderizá-los via `<video autoplay loop muted playsinline>`.

---

### Plano de execução

#### 1. Converter GIFs pesados em MP4 + WebM (ganho ~95%)

Usar `ffmpeg` (via `nix run nixpkgs#ffmpeg`) para gerar:

- `src/assets/ai-writing-assistant.mp4` (~500–800 KB esperado, era 13 MB)
- `src/assets/ai-writing-assistant.webm` (fallback moderno)
- `src/assets/meu-arco-demo.mp4` (~300–500 KB esperado, era 7 MB)
- `src/assets/meu-arco-demo.webm`
- Também extrair **um poster `.jpg`** do primeiro frame de cada um (para `<video poster=...>`, evita "tela preta" antes do play)

Preset: `-vf "scale=1200:-2:flags=lanczos,fps=24" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -an` (sem áudio, mp4 web-otimizado).

Os `.gif` originais permanecem no repositório por enquanto como fallback de segurança (podem ser removidos numa segunda passada quando confirmarmos que tudo funciona).

#### 2. Criar componente `<MediaThumb>` reutilizável

Novo arquivo `src/components/MediaThumb.tsx`:

- Detecta a extensão do `src` (`.mp4`/`.webm` → `<video>`, senão `<img>`).
- Para vídeo: aceita `sources` (array) e `poster`, atributos `autoplay loop muted playsinline preload="metadata"`.
- Para imagem: define `loading="lazy"` e `decoding="async"` por padrão (com prop `priority` para opt-out — usado no hero).
- Aceita `width`/`height` (para reservar espaço e eliminar CLS) e `className`.

#### 3. Atualizar `ProjectCard`

Substituir o `<img>` interno por `<MediaThumb>`, suportando o caso de `src` ser um vídeo (Meu Arco e AI Writing Assistant). Manter o skeleton de loading e o hover scale.

#### 4. Atualizar referências dos dois projetos animados

Em `src/pages/Index.tsx`, `src/data/projects.ts` e `src/data/projectsStructured.ts`:

- Trocar `import meuArcoDemo from "@/assets/meu-arco-demo.gif"` por `import meuArcoDemoMp4 from "@/assets/meu-arco-demo.mp4"` (+ `.webm` + poster).
- Mesma troca para `aiWritingAssistant`.
- Onde hoje passamos uma string única, passar um objeto `{ mp4, webm, poster }` ou usar uma helper para o `MediaThumb`.

#### 5. Lazy-load nas demais imagens da Home

Adicionar `loading="lazy"` e `decoding="async"` nas `<img>` que ainda não têm:

- Avatares de recomendações (linha ~791 de `Index.tsx`).
- Imagens dentro de `ProjectGallery.tsx` (já têm `group-hover:scale-105`, falta `loading="lazy"`).
- Imagens da `MediaLightbox` ficam eager (só montam quando aberta — ok).

A imagem do **hero** (`heroPortrait`) e o **avatar do header** continuam **eager** (above the fold) com `fetchpriority="high"` no hero portrait.

#### 6. Remover asset duplicado não utilizado

`about-me-portrait.png` (1,1 MB) não é mais referenciado no código (uso atual é `about-me-portrait-new.jpg`). Confirmar com `rg` e deletar se zero referências, economizando download do bundle dev.

---

### Resultado esperado

- **Peso da Home cai de ~22 MB para ~2–3 MB** (redução de ~90%).
- **LCP e TTI** melhoram drasticamente, especialmente em conexões lentas/preview iframe.
- Sem **CLS** porque vamos definir aspect-ratio nos containers de vídeo.
- Sem mudança visual perceptível: vídeos `autoplay muted loop` reproduzem como GIFs.

### Fora do escopo (sugestões para depois)

- Converter `project-hero-bg.png` (1,9 MB) e portraits `.png` para `.webp` — ganho adicional de ~70%, mas exige ajustes em vários lugares; melhor numa PR separada.
- Implementar `srcset`/`sizes` responsivos para os thumbs (ganho marginal já que as imagens estáticas já são pequenas após a conversão dos GIFs).
- Adotar `react-intersection-observer` para pausar vídeos fora da viewport (economia de CPU em mobile).