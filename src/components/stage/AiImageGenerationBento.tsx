import { useEffect, useState } from "react";
import { Check, ImageIcon, Info, LoaderCircle, MousePointer2, RotateCw, Sparkles, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
import "./ai-image.css";

const QUESTION = "3. Um terreno retangular possui 120 m de perímetro. Sabendo que o comprimento é o triplo da largura, determine as dimensões e a área desse terreno.";
const PROMPT = "um retângulo com os lados rotulados";

function Terrain({ variant = 0 }: { variant?: number }) {
  const dark = variant === 0;
  return (
    <svg className={`aig-terrain ${dark ? "aig-terrain-dark" : ""}`} viewBox="0 0 260 120" aria-hidden="true">
      {dark && (
        <g className="aig-grid">
          {Array.from({ length: 25 }, (_, i) => <path key={`v${i}`} d={`M${i * 11} 0V120`} />)}
          {Array.from({ length: 11 }, (_, i) => <path key={`h${i}`} d={`M0 ${i * 12}H260`} />)}
        </g>
      )}
      <g className="aig-diagram">
        <rect x="49" y="25" width="162" height="54" rx={variant === 1 ? 3 : 0} />
        {dark && <g className="aig-divisions"><path d="M103 25V79M157 25V79M49 52H211" /></g>}
        <text x="130" y="18" textAnchor="middle">3x</text>
        <text x="39" y="56" textAnchor="middle">x</text>
        <text x="221" y="56" textAnchor="middle">x</text>
        <text x="130" y="91" textAnchor="middle">3x</text>
        <text x="130" y="55" textAnchor="middle" className="aig-diagram-label">
          {dark ? "TERRENO" : variant === 1 ? "Área do Terreno" : variant === 3 ? "esboço do terreno" : ""}
        </text>
        {dark && <path className="aig-divider" d="M10 99H250" />}
        <text x="130" y="111" textAnchor="middle">Perímetro = 120 m</text>
      </g>
    </svg>
  );
}

function GenerateLabel() {
  return <span className="aig-outline-button"><ImageIcon />Gerar imagem com IA</span>;
}

export function AiImageGenerationBento() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (timer) clearInterval(timer);
      if (media.matches) { setTime(17000); return; }
      const origin = performance.now();
      setTime(0);
      timer = setInterval(() => setTime((performance.now() - origin) % 20000), 80);
    };
    start();
    media.addEventListener("change", start);
    return () => { if (timer) clearInterval(timer); media.removeEventListener("change", start); };
  }, []);

  const modal = time >= 3300 && time < 15100;
  const loading = time >= 7600 && time < 10400;
  const results = time >= 10400 && time < 15100;
  const inserted = time >= 15100;
  const typed = Math.min(PROMPT.length, Math.max(0, Math.floor((time - 4550) / 58)));
  const phase = inserted ? "inserted" : results ? (time > 13700 ? "inserting" : "results") : loading ? "loading" : modal ? (time > 6700 ? "generating" : "prompt") : "question";

  return (
    <div className="aig-bento" role="img" aria-label="FTD com Você: geração de imagens para uma questão de Matemática. O professor descreve um retângulo com os lados rotulados, recebe quatro opções e insere o diagrama na atividade.">
      <div className={`aig-hero aig-phase-${phase}`}>
        <div className="aig-workspace">
          <div className="aig-workspace-title">Atividade inclusiva de Matemática</div>
          <div className="aig-workspace-tab">Questões geradas</div>
          <div className={`aig-questions ${time > 1600 ? "aig-scrolled" : ""}`}>
            <div className="aig-previous-question">
              <p>2. Qual é a unidade padrão de medida de comprimento no Sistema Métrico Decimal? Além dela, cite duas unidades de medida de comprimento.</p>
              <div className="aig-answer">[Espaço para resposta]</div>
              <GenerateLabel />
            </div>
            <div className="aig-question">
              <p>{QUESTION}</p>
              {inserted && (
                <div className="aig-inserted-image">
                  <Terrain />
                  <div className="aig-image-tools"><span><RotateCw /></span><span><Trash2 /></span></div>
                </div>
              )}
              <div className="aig-answer">[Espaço para resposta]</div>
              {!inserted && <GenerateLabel />}
            </div>
          </div>
        </div>

        {modal && (
          <div className="aig-overlay">
            <div className={`aig-modal ${results ? "aig-modal-results" : ""}`}>
              <div className="aig-modal-heading"><strong>Gerar imagem com IA</strong>{!results && <span className="aig-beta">BETA</span>}</div>
              <div className="aig-selected-label">Questão selecionada</div>
              <p className="aig-selected-question">{QUESTION}</p>
              <div className="aig-tags"><span>Matemática</span><span>3º Ano - Ensino Fundamental</span></div>

              {!loading && !results && (
                <div className="aig-prompt-state">
                  <div className="aig-prompt-label">Descreva sua ideia para a geração da imagem<span className="aig-required">*</span><Info /></div>
                  <div className="aig-gradient-frame">
                    <div className="aig-textarea">
                      {typed ? <>{PROMPT.slice(0, typed)}{typed < PROMPT.length && <i className="aig-caret" />}</> : <span>Escreva suas ideias aqui</span>}
                    </div>
                  </div>
                  <div className="aig-disclaimer">A inteligência artificial pode cometer erros. Confira antes de levar para a sala de aula</div>
                  <div className="aig-actions">
                    <span className="aig-cancel">Cancelar</span>
                    <span className={`aig-primary ${!typed ? "aig-disabled" : ""}`}><Sparkles /> Gerar imagem</span>
                  </div>
                </div>
              )}

              {loading && (
                <div className="aig-gradient-frame aig-loading-frame">
                  <div className="aig-loading"><LoaderCircle />Gerando imagem com IA</div>
                </div>
              )}

              {results && (
                <div className="aig-result-state">
                  <div className="aig-options">
                    {[0, 1, 2, 3].map((v) => (
                      <div key={v} className={`aig-option ${v === 0 ? "aig-option-selected" : ""}`}>
                        <Terrain variant={v} />
                        <span className="aig-radio">{v === 0 && <i />}</span>
                      </div>
                    ))}
                  </div>
                  <div className="aig-feedback">O que você achou do resultado?<span><ThumbsUp /></span><span><ThumbsDown /></span></div>
                  <div className="aig-actions aig-result-actions">
                    <span className="aig-cancel">Cancelar</span>
                    <span className="aig-outline-button"><RotateCw /> Gerar novamente</span>
                    <span className="aig-primary"><Check /> Inserir imagem</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {time >= 10400 && time < 13200 && (
          <div className="aig-toast">
            <Check />
            <div><strong>Imagens geradas com sucesso!</strong><span>Você ainda pode gerar 4 vezes hoje</span></div>
            <X />
          </div>
        )}

        <MousePointer2 className="aig-cursor" aria-hidden="true" />
        <div className="aig-loop-veil" />
      </div>

      <div className="aig-support aig-subject">
        <span className="aig-support-label">Questão selecionada</span>
        <strong>Matemática</strong>
        <span className="aig-subject-year">3º Ano - Ensino Fundamental</span>
      </div>
      <div className="aig-support aig-export">
        <Info />
        <div>As questões não podem ser editadas aqui.<span>Exportar em .DOCX</span></div>
      </div>
    </div>
  );
}
