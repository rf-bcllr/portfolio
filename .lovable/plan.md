

## Plano: Sistema de Layout Adaptativo para Hero Mobile

### Problema Identificado
O layout da Hero section em mobile apresenta desequilíbrio visual significativo:
1. **Espaço vazio excessivo** abaixo dos botões CTA (principalmente em telas mais altas como 844px)
2. **Distribuição fixa dos chips** que não se adapta à altura disponível
3. **Posicionamento absoluto** dos chips usa percentuais fixos que não escalam bem para diferentes alturas de viewport

---

### Solução Proposta: Sistema de "Viewport-Aware Spacing"

Implementar um sistema que ajusta dinamicamente o espaçamento vertical e posicionamento baseado na altura real do viewport, utilizando CSS clamp() e variáveis CSS customizadas.

---

### Alterações Técnicas

#### 1. Criar Hook de Detecção de Viewport Height

**Novo arquivo: `src/hooks/useViewportHeight.ts`**

Hook que detecta a altura do viewport e classifica em categorias:
- `short` (< 600px): iPhone SE, dispositivos compactos
- `medium` (600-750px): maioria dos Android
- `tall` (> 750px): iPhone Pro Max, dispositivos grandes

Atualiza variável CSS `--viewport-category` para uso global.

---

#### 2. Atualizar CSS com Sistema de Espaçamento Fluido

**Arquivo: `src/index.css`**

Adicionar variáveis CSS dinâmicas:
```text
:root {
  --hero-top-spacing: clamp(2rem, 8vh, 6rem);
  --hero-bottom-spacing: clamp(1.5rem, 6vh, 4rem);
  --chip-zone-height: clamp(15%, 20vh, 35%);
}
```

---

#### 3. Reestruturar Layout da Hero Section

**Arquivo: `src/pages/Index.tsx`**

```text
Antes:
+---------------------+
|   Chips (fixed %)   |
|                     |
|   Nome + Foto       |
|                     |
|   Botões            |
|                     |
|   [espaço vazio]    |
+---------------------+

Depois:
+---------------------+
|   Chips (top zone)  | <- Zona adaptativa
+---------------------+
|   Nome + Foto       | <- Centralizado
|   Descrição         |
+---------------------+
|   Botões            | <- Próximo ao fim
+---------------------+
```

Mudanças principais:
- Usar `justify-between` com gaps fluidos
- Chips terão posicionamento relativo à sua "zona" não ao viewport total
- Adicionar wrapper com padding fluido usando clamp()

---

#### 4. Chips: Zona Contida em vez de Viewport Absoluto

Alterar chips de posicionamento absoluto ao viewport para uma zona contida:

| Antes | Depois |
|-------|--------|
| `top: 8%` do viewport | `top: 20%` da zona de chips (60px max) |
| Espalha por 50% da tela | Contido em área proporcional ao conteúdo |
| Sobreposição com botões em telas curtas | Sempre acima do bloco de nome |

---

### Estrutura Final da Hero (Mobile)

```text
<section hero>
  │
  ├── <div chips-zone> (h: clamp, position: relative)
  │   ├── chip 1 (absolute dentro da zona)
  │   ├── chip 2
  │   ├── chip 3
  │   └── chip 4
  │
  ├── <div main-content> (flex-1, centered)
  │   ├── "Hi, my name is"
  │   ├── "Rafa" + Photo + "Bacellar"
  │   └── "Your next Product Designer"
  │
  └── <div cta-zone> (padding-bottom fluido)
      ├── Button LinkedIn
      └── Button Projects
</section>
```

---

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/hooks/useViewportHeight.ts` | **CRIAR** - Hook para detectar categoria de viewport |
| `src/index.css` | Adicionar variáveis CSS fluidas para Hero |
| `src/pages/Index.tsx` | Reestruturar layout da Hero section com zonas adaptativas |

---

### Benefícios

1. **Distribuição equilibrada** em qualquer altura de tela
2. **Sem espaço vazio** excessivo - conteúdo ocupa o viewport proporcionalmente
3. **Chips contidos** - nunca sobrepõem CTAs
4. **Performance** - CSS nativo com clamp() sem JavaScript adicional para recálculo
5. **Manutenível** - valores centralizados em variáveis CSS

