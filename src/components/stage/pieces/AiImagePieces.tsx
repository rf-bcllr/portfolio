/**
 * FTD com Você · Gerar imagem com IA (new experience, Figma file "Geração de imagens com IA - 08/2026").
 * Three strong points rebuilt on their own: the suggestion on the question, the prompt modal, the four options.
 */
import { Check, ImagePlus, Info, RotateCw, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useBeats, useTyped } from "../useBeats";
import "./aiimg.css";

/** The question card: a visual-support suggestion appears on the question that needs one. */
export function AiImgSuggestion() {
  const phase = useBeats([["plain", 1600], ["hint", 2600], ["hover", 1400]] as const, "hint");
  const on = phase !== "plain";
  return (
    <div className="ai-p ai-q-wrap" role="img" aria-label="Questão 3 de Matemática com o aviso: essa questão parece se beneficiar de um apoio visual, ao lado do botão Gerar imagem com IA.">
      <div className={`ai-q ${on ? "is-suggested" : ""}`}>
        <p>3. Um terreno retangular possui 120 m de perímetro. Sabendo que o comprimento é o triplo da largura, determine as dimensões e a área desse terreno.</p>
        <div className="ai-answer">[Espaço para resposta]</div>
        <div className="ai-q-foot">
          <span className={`ai-ghost ${phase === "hover" ? "is-hover" : ""}`} data-anchor="gen"><ImagePlus /> Gerar imagem com IA</span>
          <span className={`ai-hint ${on ? "is-on" : ""}`} data-anchor="hint"><Sparkles /> Essa questão parece se beneficiar de um apoio visual</span>
        </div>
      </div>
    </div>
  );
}

const TAGS = (
  <div className="ai-tags">
    <span>Matemática</span>
    <span>3º Ano - Ensino Fundamental</span>
    <span className="is-teal">Atividade inclusiva</span>
    <span className="is-ai" data-anchor="rec"><Sparkles /> Apoio visual recomendado</span>
  </div>
);

/** The prompt modal: the selected question, its tags, the idea typed into the AI field. */
export function AiImgPrompt() {
  const phase = useBeats([["empty", 1200], ["typing", 2600], ["ready", 1800], ["press", 900]] as const, "ready");
  const typed = useTyped("um retângulo com os lados rotulados", phase === "typing", phase === "ready" || phase === "press", 60);
  return (
    <div className="ai-p ai-modal" role="img" aria-label="Modal Gerar imagem com IA, beta: questão selecionada, etiquetas Matemática, 3º ano, Atividade inclusiva e Apoio visual recomendado; o professor descreve um retângulo com os lados rotulados e gera a imagem.">
      <header><b>Gerar imagem com IA</b><span className="ai-beta">BETA</span><Info className="ai-i" /><X className="ai-x" /></header>
      <p className="ai-lead">Descreva a imagem que você imagina. Vamos gerar 4 opções de imagem para você escolher a melhor.</p>
      <p className="ai-label">Questão selecionada</p>
      <div className="ai-selq">3. Um terreno retangular possui 120 m de perímetro. Sabendo que o comprimento é o triplo da largura, determine as dimensões e a área desse terreno.</div>
      {TAGS}
      <p className="ai-label">Descreva sua ideia para a geração da imagem<em>*</em></p>
      <div className={`ai-field ${phase !== "empty" ? "is-focus" : ""}`} data-anchor="field">
        {typed || <span className="ai-ph">Ex.: um retângulo com os lados identificados</span>}
        {phase === "typing" && <i className="ai-caret" />}
      </div>
      <p className="ai-meta"><span>{typed.length} / 300</span><span>A inteligência artificial pode cometer erros. Confira antes de levar para a sala de aula</span></p>
      <footer><span className="ai-link">Cancelar</span><span className={`ai-primary ${typed ? "" : "is-off"} ${phase === "press" ? "is-press" : ""}`} data-anchor="go"><Sparkles /> Gerar imagem</span></footer>
    </div>
  );
}

function Diagram({ v }: { v: 0 | 1 | 2 | 3 }) {
  return (
    <div className={`ai-dia ai-dia-${v}`}>
      <span className="t">3x</span><span className="l">x</span>
      <div className="box">{v === 0 ? "TERRENO" : v === 1 ? "Área do Terreno" : v === 3 ? "esboço do terreno" : ""}</div>
      <span className="r">x</span><span className="b">3x</span>
      <span className="p">Perímetro = 120 m</span>
    </div>
  );
}

/** The four options: one picked, feedback asked, then added to the question. */
export function AiImgOptions() {
  const phase = useBeats([["show", 1500], ["pick", 1500], ["like", 1500], ["add", 1100]] as const, "like");
  const picked = phase === "show" ? 0 : 1;
  return (
    <div className="ai-p ai-modal ai-results" role="img" aria-label="Quatro opções de diagrama do terreno: o professor escolhe uma, avalia com polegar para cima e adiciona a imagem à questão; Gerar novamente fica ao lado.">
      <header><b>Gerar imagem com IA</b><span className="ai-beta">BETA</span><X className="ai-x" /></header>
      <div className="ai-grid" data-anchor="grid">
        {([0, 1, 2, 3] as const).map((v) => (
          <div key={v} className={`ai-opt ${v === 0 ? "is-dark" : ""} ${picked === v ? "is-picked" : ""}`}>
            <span className="ai-radio" />
            <Diagram v={v} />
          </div>
        ))}
      </div>
      <div className="ai-fb" data-anchor="fb"><span>O que você achou do resultado?</span><i className={phase === "like" || phase === "add" ? "is-on" : ""}><ThumbsUp /></i><i><ThumbsDown /></i></div>
      <footer>
        <span className="ai-link">Cancelar</span>
        <span className="ai-outline" data-anchor="again"><RotateCw /> Gerar novamente</span>
        <span className={`ai-primary ${phase === "add" ? "is-press" : ""}`}><Check /> Adicionar imagem</span>
      </footer>
    </div>
  );
}
