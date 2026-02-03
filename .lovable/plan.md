

## Plano: Redesign Visual Elegante (Insany + Mares) - Com Azul Accent

### Objetivo
Aplicar a estética refinada e elegante dos sites Insany Design e Agência Mares ao portfólio, mantendo todo o conteúdo existente e utilizando o azul (primary) já definido como cor de destaque.

---

### Mudancas por Secao

#### 1. Sistema de Design (CSS Tokens)

**Arquivo: `src/index.css`**

Novos tokens de espaçamento e tipografia fluida:
```text
--section-gap-sm: 6rem;      /* 96px */
--section-gap-md: 8rem;      /* 128px */
--section-gap-lg: 10rem;     /* 160px */
--headline-xl: clamp(3rem, 8vw, 6rem);
--headline-lg: clamp(2.5rem, 6vw, 4.5rem);
```

- Manter paleta azul atual (220 100% 50%/60%)
- Aumentar espaçamento entre seções
- Tipografia com maior contraste de pesos

---

#### 2. Hero Section - Layout Assimetrico

**Arquivo: `src/pages/Index.tsx`**

Layout atual: Centralizado, simétrico
Layout proposto: Grid 2 colunas assimétrico em desktop

```text
Desktop:
+------------------+------------------+
|                  |                  |
|  "Product        |     [Foto]       |
|   Designer"      |                  |
|  (grande)        |                  |
|                  |                  |
|  [CTA azul]      |     Skills       |
|                  |     chips        |
+------------------+------------------+

Mobile: Mantém layout vertical atual
```

- Headline massiva ocupando 60% largura
- Foto posicionada lateralmente (desktop)
- Chips de skills integrados à coluna da foto
- CTA único proeminente com azul
- Mobile continua sem chips (como decidido anteriormente)

---

#### 3. Logos das Empresas - Marquee Infinito

**Arquivo: `src/components/CompanyLogos.tsx`**

Converter grid estático para marquee horizontal infinito:

```text
Antes:
[Logo] [Logo] [Logo]
[Logo] [Logo] [Logo]

Depois:
← [Logo] [Logo] [Logo] [Logo] [Logo] [Logo] → (scroll infinito)
```

- Label "Trusted by" em uppercase, tracking-widest
- Logos menores, mais espaçados
- Animação suave e contínua

---

#### 4. Grid de Projetos - Bento Assimetrico

**Arquivos: `src/pages/Index.tsx`, `src/components/ProjectCard.tsx`**

Layout atual: Grid uniforme 3 colunas
Layout proposto: Bento grid com tamanhos variados

```text
+--------+--------+--------+
|        |   B    |   C    |
|   A    +--------+--------+
| (2x2)  |        D        |
+--------+-----------------+
|   E    |   F    |   G    |
+--------+--------+--------+
```

- Projeto destaque (Cyberbrake) maior
- Informações sempre visíveis (não só hover)
- Cards com título + categoria abaixo da imagem
- Transições mais suaves no hover

---

#### 5. Design Process - Timeline Horizontal

**Arquivo: `src/pages/Index.tsx`**

Converter grid 2x2 para linha horizontal com números destaque:

```text
Antes:
+-------+ +-------+
|   1   | |   2   |
+-------+ +-------+
+-------+ +-------+
|   3   | |   4   |
+-------+ +-------+

Depois:
   01          02          03          04
   ──          ──          ──          ──
Strategize  Iterate     Launch     Measure
```

- Números grandes (01, 02, 03, 04) como destaque visual
- Layout horizontal em desktop
- Descrições mais curtas
- Linha conectando os steps

---

#### 6. About Section - Layout 60/40

**Arquivo: `src/pages/Index.tsx`**

- Texto ocupa maior proporção que foto
- Foto menor, mais como elemento de accent
- Skills integradas como lista inline
- Cards de hobbies/skills mais compactos

---

#### 7. Contact Footer - Impacto Visual

**Arquivo: `src/components/ContactFooter.tsx`**

```text
Antes:
    Let's talk?
    [descrição]
    [Botão] [Botão]

Depois:
    
    
    LET'S TALK
    
    
    [Botão Azul Grande]
    
    
```

- Headline massiva "LET'S TALK" em uppercase
- Espaçamento vertical muito generoso (py-32 ou mais)
- CTA único, grande, com azul vibrante
- Remover botão "Back to top" secundário

---

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/index.css` | Novos tokens de espaçamento e tipografia |
| `tailwind.config.ts` | Valores de espaçamento extended |
| `src/pages/Index.tsx` | Hero assimétrico, Bento grid, Process timeline, About 60/40 |
| `src/components/ProjectCard.tsx` | Info sempre visível, novo layout |
| `src/components/CompanyLogos.tsx` | Marquee infinito horizontal |
| `src/components/ContactFooter.tsx` | Headline massiva, layout simplificado |

---

### Detalhes de Implementacao

#### Cores (mantidas)
- Primary: `220 100% 50%` (light) / `220 100% 60%` (dark)
- Accent: Mesmo azul primary
- Text: Neutro (foreground)
- Backgrounds: Atuais

#### Tipografia
- Clash Display para headlines (mantido)
- Satoshi para body (mantido)
- Aumentar contraste de pesos
- Headlines maiores em seções chave

#### Espacamento
- Seções: `py-24 md:py-32 lg:py-40`
- Gaps maiores entre elementos
- Mais "respiro" visual

#### Animacoes
- Transições mais suaves (500-700ms)
- Reveals com clip-path
- Menos elementos flutuantes decorativos

---

### Fases de Implementacao

1. **Fase 1**: CSS tokens + tipografia (base)
2. **Fase 2**: Hero section redesign
3. **Fase 3**: Company logos marquee
4. **Fase 4**: Projects bento grid
5. **Fase 5**: Process timeline
6. **Fase 6**: About e Contact refinados
7. **Fase 7**: Testes e ajustes finais

