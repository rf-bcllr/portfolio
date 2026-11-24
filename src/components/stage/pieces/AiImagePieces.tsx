/**
 * FTD com Você · Gerar imagem com IA, rebuilt from the v2.0 Figma (page 04 · Criar atividade,
 * frames 4, 5 and 6). Three strong points, each its own stage:
 *  1. the question that the AI marks as needing a visual,
 *  2. a suggestion that fills the prompt,
 *  3. four options, a pick, feedback, and the daily limit in the toast.
 * Real strings come from the Figma frames; everything else is a bar.
 */
import { Bar, Connector, Count, Meter, Stage, States, Stream, Text, type Act } from "../kit";
import { Check, Image as ImageIcon, Info, Maximize, RefreshCw, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import "./aiimg.css";

const Q = "1. Questão 1: qual das alternativas melhor representa “Frações no cotidiano: receitas e medidas”?";

/* ---------- 1 · The AI marks the question ---------- */

type S1 = { tag: boolean };

async function s1(a: Act<S1>) {
  await a.wait(900);
  a.mark("tag");
  a.put({ tag: true });
  await a.wait(1400);
  a.mark("open");
  await a.move({ at: "gen", x: 0.8, y: 0.62 });
  await a.wait(500);
  await a.click({ at: "gen", x: 0.8, y: 0.62 });
  await a.wait(2400);
  await a.move({ x: 300, y: 286 });
  a.put({ tag: false });
  await a.wait(700);
}

export function AiImgSuggestion() {
  return (
    <Stage width={560} height={300} initial={{ tag: false } as S1} poster={{ tag: true }} script={s1} cursor={{ at: { x: 300, y: 286 } }} className="ai1">
      {(s) => (
        <div className="ai-page">
          <div className="ai-q">
            <Text className="ai-qt">{Q}</Text>
            {[56, 48, 62].map((w, i) => (
              <div key={i} className="ai-alt"><span className="ai-alt-n">{i + 1}</span><Bar w={`${w}%`} h={7} r={3.5} tone={2} /></div>
            ))}
            <div className="ai-q-foot">
              <span className="ai-btn-o" data-target="gen" data-cursor="pointer"><ImageIcon size={16} strokeWidth={1.8} /> Gerar imagem com IA</span>
              <span className="ai-rec" data-on={s.tag || undefined}><Sparkles size={13} strokeWidth={1.8} /> Apoio visual recomendado</span>
            </div>
          </div>
          <div className="ai-q ai-q-next"><Bar w={420} h={9} r={4.5} tone={3} /></div>
        </div>
      )}
    </Stage>
  );
}

/* ---------- 2 · A suggestion fills the prompt ---------- */

const SUGGESTIONS = [
  "Xícaras medidoras de ½, ⅓ e ¼ lado a lado, com farinha, sobre um fundo claro.",
  "Pizza dividida em 8 fatias iguais, com 3 fatias destacadas em outra cor.",
  "Cartão de receita de bolo com as medidas em frações e os ingredientes desenhados.",
];
type S2 = { pick: number; words: number; go: boolean };
const FULL = SUGGESTIONS[0];
const WORDS = FULL.split(" ");
const charsAt = (n: number) => (n ? WORDS.slice(0, n).join(" ").length : 0);

async function s2(a: Act<S2>) {
  await a.wait(1100);
  a.mark("pick");
  await a.click({ at: "sug-0", x: 0.82, y: 0.78 });
  a.put({ pick: 0 });
  // The chosen idea fills the description word by word, every word already in its place
  for (let i = 1; i <= WORDS.length; i++) {
    a.put({ words: i });
    await a.wait(55);
  }
  await a.wait(1200);
  a.mark("go");
  await a.click({ at: "go", x: 0.7, y: 0.6 });
  a.put({ go: true });
  await a.wait(2600);
  await a.move({ x: 520, y: 556 });
  await a.snap({ pick: -1, words: 0, go: false });
  await a.wait(500);
}

export function AiImgPrompt() {
  return (
    <Stage width={560} height={576} initial={{ pick: -1, words: 0, go: false } as S2} poster={{ pick: 0, words: WORDS.length, go: false }} script={s2} cursor={{ at: { x: 520, y: 556 } }} className="ai2">
      {(s) => (
        <div className="ai-scrim">
          <div className="ai-modal">
            <div className="ai-m-head"><span className="ai-m-title">Gerar imagem com IA</span><span className="ai-beta">BETA</span><Info size={15} className="ai-ic" /><X size={18} className="ai-x" /></div>
            <Text className="ai-m-sub" wrap>Descreva a imagem que você quer. Vamos criar 4 opções para você escolher.</Text>
            <div className="ai-tags"><span>Matemática</span><span>4º ano</span><span className="is-rec"><Sparkles size={12} strokeWidth={1.8} /> Apoio visual recomendado</span></div>
            <div className="ai-sugs">
              <div className="ai-sugs-h"><Sparkles size={15} strokeWidth={1.8} /> Sugestões de imagem para esta questão</div>
              <div className="ai-sug-row">
                {SUGGESTIONS.map((t, i) => (
                  <div key={t} className="ai-sug" data-on={s.pick === i || undefined} data-target={`sug-${i}`} data-cursor="pointer"><Text wrap>{t}</Text></div>
                ))}
              </div>
            </div>
            <div className="ai-label">Descreva sua ideia para a geração da imagem <em>*</em></div>
            <div className="ai-area" data-focus={s.words ? true : undefined}><Stream text={FULL} count={s.words} /></div>
            <div className="ai-meta"><span>A inteligência artificial pode cometer erros.</span><span className="ai-count"><Count value={charsAt(s.words)} duration={300} />/300</span></div>
            <div className="ai-m-foot">
              <span className="ai-link">Cancelar</span>
              <span className="ai-btn" data-target="go" data-cursor="pointer" data-off={!s.words || undefined}>
                <States value={s.go ? "busy" : "idle"} states={{ idle: <span className="ai-btn-in"><Sparkles size={16} strokeWidth={1.8} /> Gerar imagem</span>, busy: <span className="ai-btn-in"><span className="ai-spin" /> Gerando imagens</span> }} />
              </span>
            </div>
          </div>
        </div>
      )}
    </Stage>
  );
}

/* ---------- 3 · Four options, a pick, feedback, the daily limit ---------- */

type S3 = { toast: boolean; left: number; pick: number; up: boolean; added: boolean };

async function s3(a: Act<S3>) {
  await a.wait(600);
  a.mark("toast");
  // The generation just spent one of today's three: the toast says it, the sidebar card counts it
  a.put({ toast: true, left: 2 });
  await a.wait(1500);
  a.mark("pick");
  await a.click({ at: "opt-1", x: 0.5, y: 0.7 });
  a.put({ pick: 1 });
  await a.wait(900);
  await a.click({ at: "up", x: 0.5, y: 0.5 });
  a.put({ up: true });
  await a.wait(900);
  a.mark("add");
  await a.click({ at: "add", x: 0.72, y: 0.6 });
  a.put({ added: true, toast: false });
  await a.wait(2400);
  await a.move({ x: 720, y: 476 });
  await a.snap({ pick: 0, up: false, added: false, left: 3 });
  await a.wait(400);
}

export function AiImgOptions() {
  return (
    <Stage width={760} height={500} initial={{ toast: false, left: 3, pick: 0, up: false, added: false } as S3} poster={{ toast: true, left: 2, pick: 1, up: true, added: false }} script={s3} cursor={{ at: { x: 720, y: 476 } }} className="ai3">
      {(s, rect) => (
        <div className="ai-scrim">
          <div className="ai-modal ai-modal-res">
            <div className="ai-m-head"><span className="ai-m-title">Gerar imagem com IA</span><span className="ai-beta">BETA</span><Info size={15} className="ai-ic" /><X size={18} className="ai-x" /></div>
            <div className="ai-tags"><span>Matemática</span><span>4º ano</span><span className="is-rec"><Sparkles size={12} strokeWidth={1.8} /> Apoio visual recomendado</span></div>
            <div className="ai-grid">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="ai-opt" data-on={s.pick === i || undefined} data-target={`opt-${i}`} data-cursor="pointer">
                  <span className="ai-radio" />
                  <ImageIcon size={26} strokeWidth={1.5} className="ai-opt-ic" />
                  <span className="ai-opt-t">Imagem gerada {i + 1}</span>
                  <Maximize size={14} className="ai-exp" />
                </div>
              ))}
            </div>
            <div className="ai-fb"><span>O que você achou do resultado?</span><span className="ai-thumb" data-on={s.up || undefined} data-target="up" data-cursor="pointer"><ThumbsUp size={17} strokeWidth={1.8} /></span><span className="ai-thumb"><ThumbsDown size={17} strokeWidth={1.8} /></span></div>
            <div className="ai-m-foot">
              <span className="ai-link">Cancelar</span>
              <span className="ai-btn-o"><RefreshCw size={16} strokeWidth={1.8} /> Gerar novamente</span>
              <span className="ai-btn" data-target="add" data-cursor="pointer" data-done={s.added || undefined}><Check size={16} strokeWidth={2} /> {s.added ? "Imagem adicionada" : "Adicionar imagem"}</span>
            </div>
          </div>
          <div className="ai-limits">
            <b>Limites de hoje</b>
            {[["Atividades", 3, 5], ["Planos de aula", 3, 5]].map(([l, v, m]) => (
              <div key={l as string} className="ai-lim"><span>{l}</span><span className="ai-lim-v">{v}/{m}</span><Meter value={(v as number) / (m as number)} /></div>
            ))}
            <div className="ai-lim is-img" data-target="lim-img"><span>Imagens com IA</span><span className="ai-lim-v"><Count value={s.left} duration={500} />/3</span><Meter value={s.left / 3} /></div>
          </div>
          <Connector show={s.toast} route="v" arrow label="−1" from={{ x: rect("toast").x + rect("toast").width / 2, y: rect("toast").y + rect("toast").height }} to={{ x: rect("toast").x + rect("toast").width / 2, y: rect("lim-img").y - 4 }} className="ai-link" />
          <div className="ai-toast" data-target="toast" data-on={s.toast || undefined}>
            <Check size={18} strokeWidth={2.2} className="ai-toast-ic" />
            <div><b>Imagens geradas com sucesso!</b><span>Restam 2 gerações de imagem hoje.</span></div>
          </div>
        </div>
      )}
    </Stage>
  );
}
