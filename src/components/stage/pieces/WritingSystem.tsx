/**
 * isaac · AI writing assistant, told as a loop: the writer asks for the rewrite on their own
 * selection, sees it in place, rates it, and the rating feeds the usage dashboard the school
 * team reads. Strings from the product recording (Novo comunicado, Melhorar texto com IA,
 * Texto melhorado com sucesso, Amei / Quero ajustar / Tente novamente).
 */
import { Bar, Stage, Stream, type Act } from "../kit";
import { Check, Plus, RefreshCw, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import "./writing-system.css";

const AFTER = "Prezados pais e responsáveis, informamos que o material escolar das turmas de Espanhol do 1º ano já está disponível para retirada. Para agilizar, pedimos que levem um documento de identificação e o nome completo do(a) aluno(a).";
const WORDS = AFTER.split(" ").length;

type S = { sel: boolean; menu: boolean; loading: boolean; words: number; toast: boolean; love: boolean };
const START: S = { sel: false, menu: false, loading: false, words: 0, toast: false, love: false };

async function script(a: Act<S>) {
  await a.wait(1000);
  a.mark("select");
  await a.key("cmd+a");
  a.put({ sel: true });
  await a.wait(300);
  a.put({ menu: true });
  await a.wait(600);
  await a.click({ at: "improve", x: 0.75, y: 0.5 });
  a.put({ menu: false, sel: false, loading: true });
  await a.wait(1300);
  a.mark("rewrite");
  a.put({ loading: false });
  for (let i = 1; i <= WORDS; i++) {
    a.put({ words: i });
    await a.wait(40);
  }
  await a.wait(300);
  a.put({ toast: true });
  await a.wait(1000);
  a.mark("rate");
  await a.click({ at: "love", x: 0.6, y: 0.5 });
  a.put({ love: true });
  await a.wait(2600);
  // Closing the toast hands the screen back; the draft goes back to the original for the next take
  await a.click({ at: "close", x: 0.5, y: 0.5 });
  a.put({ toast: false });
  await a.wait(500);
  await a.snap({ words: 0, love: false });
  await a.move({ x: 700, y: 480 });
}

export function WritingSystem() {
  return (
    <Stage width={740} height={500} initial={START} poster={{ ...START, words: WORDS, toast: true, love: true }} script={script} keys="bottom-left" cursor={{ at: { x: 700, y: 480 } }} className="wrs">
      {(s) => (
        <>
          <div className="wrs-win">
            <div className="wrs-top"><b className="wrs-logo">isaac</b><span>Novo comunicado</span><X size={16} className="wrs-x" /></div>
            <div className="wrs-body">
              <p className="wrs-to"><b>Destinatários (39 selecionados)</b> <span>Remover todos</span></p>
              <div className="wrs-chips"><span className="wrs-add"><Plus size={14} /> Adicionar destinatários</span><span className="wrs-chip">1º Ano A</span><span className="wrs-chip">1º Ano B</span></div>
              <div className="wrs-title">Material disponível para a turma de Espanhol do 1º Ano</div>
              <div className="wrs-text">
                <div className="wrs-layer" data-on={!s.loading && s.words === 0 ? true : undefined}>
                  <p><mark data-on={s.sel || undefined}>Olá, tudo bem?</mark></p>
                  <p><mark data-on={s.sel || undefined}>O material escolar das turmas de Espanhol do 1º ano já está disponível para retirada. Para agilizar o processo, pedimos que levem um documento de identificação e o nome completo do(a) aluno(a).</mark></p>
                  <p><mark data-on={s.sel || undefined}>Apenas com atuorização será permitido que um terceiro retire os materiais.</mark></p>
                </div>
                <div className="wrs-layer wrs-skel" data-on={s.loading || undefined}>
                  <Bar w="28%" h={9} r={4.5} tone={2} /><Bar w="96%" h={9} r={4.5} tone={2} /><Bar w="80%" h={9} r={4.5} tone={2} /><Bar w="62%" h={9} r={4.5} tone={2} />
                </div>
                <div className="wrs-layer" data-on={s.words > 0 || undefined}><p><Stream text={AFTER} count={s.words} /></p></div>
              </div>
              <span className="wrs-menu" data-on={s.menu || undefined} data-target="improve" data-cursor="pointer"><Sparkles size={14} /> Melhorar texto com IA</span>
            </div>
            <div className="wrs-toast" data-on={s.toast || undefined}>
              <p className="wrs-t1"><Check size={16} className="wrs-ok" /> Texto melhorado com sucesso <span className="wrs-close" data-target="close" data-cursor="pointer"><X size={14} /></span></p>
              <p className="wrs-t2">O que você achou do resultado?</p>
              <div className="wrs-opts">
                <span data-on={s.love || undefined} data-target="love" data-cursor="pointer"><ThumbsUp size={14} /> Amei</span>
                <span><ThumbsDown size={14} /> Quero ajustar</span>
                <span><RefreshCw size={14} /> Tente novamente</span>
              </div>
            </div>
          </div>

          {/* What the school team sees: every rating lands in the assistant's usage view */}
          <div className="wrs-dash">
            <p className="wrs-d-h">Assistente de escrita</p>
            <p className="wrs-d-s">Avaliações dos textos melhorados</p>
            <div className="wrs-split">
              <i className="is-love" style={{ flexGrow: s.love ? 7 : 6 }} />
              <i className="is-adjust" style={{ flexGrow: 2 }} />
              <i className="is-retry" style={{ flexGrow: 1 }} />
            </div>
            <ul className="wrs-legend"><li><i className="is-love" />Amei</li><li><i className="is-adjust" />Quero ajustar</li><li><i className="is-retry" />Tente novamente</li></ul>
          </div>
        </>
      )}
    </Stage>
  );
}
