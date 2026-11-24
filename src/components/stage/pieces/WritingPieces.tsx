/**
 * isaac · Novo comunicado with "Melhorar texto com IA" (rebuilt from the product recording).
 * Strong points on their own: the improve-with-AI moment on selected text, and the feedback toast that follows.
 */
import { Check, Plus, Sparkles, ThumbsDown, ThumbsUp, RotateCw, X } from "lucide-react";
import { useBeats } from "../useBeats";
import "./writing2.css";

/** Recipients: classes as chips with the selected count. */
export function WrRecipients() {
  const phase = useBeats([["one", 1600], ["two", 2800]] as const, "two");
  return (
    <div className="wr-p wr-rec" role="img" aria-label="Destinatários do comunicado: 39 selecionados, nas turmas 1º Ano A e 1º Ano B, com Remover todos.">
      <p><b>Destinatários ({phase === "two" ? 39 : 20} selecionados)</b> <span className="wr-a">Remover todos</span></p>
      <div className="wr-row">
        <span className="wr-add"><Plus /> Adicionar destinatários</span>
        <span className="wr-chip">1º Ano A <X /></span>
        <span className={`wr-chip wr-chip-in ${phase === "two" ? "is-on" : ""}`} data-anchor="chip">1º Ano B <X /></span>
      </div>
    </div>
  );
}

const BEFORE = [
  "Olá, tudo bem?",
  "O material escolar das turmas de Espanhol do 1º ano já está disponível para retirada. Para agilizar o processo, pedimos que levem um documento de identificação e o nome completo do(a) aluno(a).",
  "Apenas com atuorização será permitido que um terceiro retire os materiais.",
];

/** Select the text, ask the AI to improve it, watch it rewrite in place. */
export function WrImprove() {
  const phase = useBeats([["draft", 1400], ["select", 1100], ["menu", 1400], ["loading", 1500], ["done", 3200]] as const, "done");
  const selected = phase === "select" || phase === "menu";
  return (
    <div className="wr-p wr-editor" role="img" aria-label="Novo comunicado: o texto é selecionado, o menu Melhorar texto com IA aparece, o texto vira um esqueleto enquanto a IA trabalha e volta reescrito, com saudação aos pais e a lista do que levar.">
      <h4>Material disponível para a turma de Espanhol do 1º Ano</h4>
      {phase === "loading" ? (
        <div className="wr-skel" data-anchor="body">
          <i style={{ width: "26%" }} /><i style={{ width: "92%" }} /><i style={{ width: "40%" }} /><i style={{ width: "54%" }} />
          <span className="wr-pill"><Sparkles /> Melhorando texto com IA</span>
        </div>
      ) : phase === "done" ? (
        <div className="wr-body is-new" data-anchor="body">
          <p>Prezados pais e responsáveis,</p>
          <p>Informamos que o material escolar das turmas de Espanhol do 1º ano já está disponível para retirada.</p>
          <p>Para agilizar o processo, pedimos que levem:</p>
          <ul><li>um documento de identificação</li><li>nome completo do(a) aluno(a).</li></ul>
        </div>
      ) : (
        <div className={`wr-body ${selected ? "is-sel" : ""}`} data-anchor="body">
          {BEFORE.map((t) => <p key={t}><mark>{t}</mark></p>)}
        </div>
      )}
      <span className={`wr-menu ${phase === "menu" ? "is-on" : ""}`} data-anchor="menu"><Sparkles /> Melhorar texto com IA</span>
    </div>
  );
}

/** After the rewrite: a toast asks how it went, while the draft saves itself. */
export function WrFeedback() {
  const phase = useBeats([["in", 2200], ["love", 2600]] as const, "in");
  return (
    <div className="wr-p wr-fb-wrap" role="img" aria-label="Toast Texto melhorado com sucesso com a pergunta O que você achou do resultado e as opções Amei, Quero ajustar e Tente novamente; o rascunho é salvo enquanto isso.">
      <div className="wr-toast" data-anchor="toast">
        <p className="wr-t1"><Check /> Texto melhorado com sucesso<X className="wr-tx" /></p>
        <p className="wr-t2">O que você achou do resultado?</p>
        <div className="wr-opts">
          <span className={phase !== "in" ? "is-on" : ""}><ThumbsUp /> Amei</span>
          <span><ThumbsDown /> Quero ajustar</span>
          <span><RotateCw /> Tente novamente</span>
        </div>
      </div>
      <div className="wr-foot"><span className="wr-saving" data-anchor="save">Salvando rascunho…</span><span className="wr-send">Enviar</span></div>
    </div>
  );
}
