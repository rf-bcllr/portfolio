# Rehearsal notes · stageshow pieces

Built on the stageshow kit (`src/components/stage/kit`), filmed with `scripts/film.mjs --gate`
against `/lab/pieces?p=<id>`. Gold copied per piece is named below; sources are the real products.

## cq-system (Cheguei · one tap, two people)
- Gold: `device-pair` (two surfaces telling one event), motion from `subscriptions` (a chip flying into a row).
- Source: ClassApp recording (Aluno (Demo), Portaria Teste, Chegaram, Aceitar, A caminho, Confirmar entrega).
- Deliberate: two phones as a symmetric pair with equal 50px outer gutters; film reads each phone alone and
  reports "framing: runs off the bottom but sits off center". The pair is centered as a pair; the school's
  Aceitar must stay whole, so neither phone can bleed sideways.
- Not checked: compact (358) design; the canvas scales the wide design on phones.

## Gate results (all filmed at their canvas width with `--gate`)

| Piece | Width | Gold copied | Result |
|---|---|---|---|
| arco-system | 640 | `phone-touch` + `panel-annotation` (setting → what it changed) | rehearsal passed |
| cq-system | 700 | `device-pair`, `subscriptions` | one deliberate framing line (above) |
| ai-prompt | 560 | `form-error` (field fills, counter, button confirms on itself) | rehearsal passed |
| ai-options | 760 | `ai-cards` + `story` (connector, rolling count) | rehearsal passed |
| cal-system | 720 | `story` (connectors, items crossing to a second object) | rehearsal passed |
| writing-system | 740 | `ai-chat` (Thinking, stream with its height) + `story` | rehearsal passed |
| lesson-system | 780 | `subscriptions` (a chip flies into a field) | rehearsal passed |
| saude-system | 660 | `phone-touch` + `table-edit` (the total rolls a beat later) | rehearsal passed |

Fixes the gate forced: icons on even pixel sizes (15 → 16), satellites moved off content, calendar cells
widened so words never break, the AI prompt stage raised to 576 so Gerar imagem stays whole, nowrap on
toast and footer buttons, a min-width on the Calendar status tag.

## Not checked
- No `compact` (358) designs: on phones the canvas scales each wide stage down (checked at 375: every
  stage fits at 321px, no horizontal overflow), so small type gets small.
- Dark mode: the canvas is light only.
- Iônica and Quest frames are image crops hosted on Lovable; they load only on the deployed site.
