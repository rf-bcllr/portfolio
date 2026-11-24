import { Bold, Check, Italic, Link2, List, Paperclip, Send, Underline, X } from "lucide-react";
import { useBeats } from "./useBeats";
import "./writing.css";

/**
 * Faux isaac "Novo comunicado" editor with the AI writing assistant.
 * Story: the draft is checked before it reaches families: a typo is flagged, the fix is accepted,
 * the tone is set to Friendly, and the message is sent.
 */
const beats = [
  ["draft", 1800], ["scan", 1300], ["flag", 1700], ["fix", 1500], ["tone", 1700], ["send", 1400], ["sent", 2200],
] as const;
type Phase = (typeof beats)[number][0];

export function WritingBento() {
  const phase = useBeats(beats, "fix" as Phase);
  const at = (...p: Phase[]) => p.includes(phase);
  const fixed = at("fix", "tone", "send", "sent");
  const friendly = at("tone", "send", "sent");

  return (
    <div
      className="wr-bento"
      role="img"
      aria-label="isaac, novo comunicado: o assistente de escrita encontra o erro 'atuorização', sugere 'autorização', o tom muda para Amigável e o comunicado é enviado para 39 destinatários."
    >
      <div className="wr-win" aria-hidden="true">
        <header className="wr-top">
          <b className="wr-logo">isaac</b>
          <span>Novo comunicado</span>
          <i className="wr-x"><X /></i>
        </header>
        <div className="wr-body">
          <p className="wr-to">
            Destinatários <b>(39 selecionados)</b>
          </p>
          <div className="wr-chips">
            <span>1º Ano A</span>
            <span>1º Ano B</span>
          </div>
          <h4>Material disponível para a turma de Espanhol do 1º Ano</h4>
          <p className="wr-text">
            {friendly ? "Oi, famílias! Tudo bem?" : "Olá, tudo bem?"}
          </p>
          <p className="wr-text wr-muted">
            <span className="wr-bar" style={{ width: "92%" }} />
            <span className="wr-bar" style={{ width: "64%" }} />
          </p>
          <p className="wr-text">
            Apenas com{" "}
            <span className={`wr-word ${at("flag") ? "is-flag" : ""} ${fixed ? "is-fixed" : ""}`}>
              <span className="wr-old">atuorização</span>
              <span className="wr-new">autorização</span>
            </span>{" "}
            será permitido que um terceiro retire os materiais.
          </p>

          <div className={`wr-assist ${at("scan", "flag", "fix", "tone") ? "is-open" : ""}`}>
            <p className="wr-assist-h">
              <span className={`wr-pulse ${at("scan") ? "is-on" : ""}`} />
              {at("scan") ? "Revisando o texto…" : fixed ? "Texto revisado" : "1 correção sugerida"}
            </p>
            <div className={`wr-sug ${at("flag") ? "is-active" : ""} ${fixed ? "is-done" : ""}`}>
              <span>
                atuorização → <b>autorização</b>
              </span>
              <span className="wr-accept">{fixed ? <Check /> : "Aceitar"}</span>
            </div>
            <div className="wr-tone">
              <span>Tom</span>
              <span className={!friendly ? "is-on" : ""}>Formal</span>
              <span className={friendly ? "is-on" : ""}>Amigável</span>
            </div>
          </div>
        </div>
        <footer className="wr-foot">
          <span className="wr-tools">
            <span className="wr-attach"><Paperclip /> Anexos</span>
            <Bold /><Italic /><Underline /><List /><Link2 />
          </span>
          <span className={`wr-send ${at("send") ? "is-press" : ""} ${at("sent") ? "is-sent" : ""}`}>
            {at("sent") ? <><Check /> Enviado</> : <><Send /> Enviar</>}
          </span>
        </footer>
      </div>
    </div>
  );
}
