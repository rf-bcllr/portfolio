/**
 * FTD com Você · Perfis de aprendizagem (rebuilt from the product recording): the profiles that adapt
 * generated lesson plans and activities to students with shared needs.
 */
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useBeats, useTyped } from "../useBeats";
import "./lesson2.css";

const PROFILES = [
  ["Alunos com transtorno do déficit de atenção (TDAH)", "Necessita de apoio frente a desafios novos • Necessita de apoio para manter a atenção • Necessita de apoio visual e/ou concretos • Engaja-se melhor em atividades curtas"],
  ["Alunos com dislexia", "Necessita de apoio para manter a atenção • Necessita de apoio visual e/ou concretos • Beneficia-se de ambientes com menos estímulos"],
  ["Alunos com Transtorno do Espectro Autista (TEA)", "Necessita de organização, rotina e previsibilidade • Necessita de rotinas e combinados • Beneficia-se da antecipação de mudanças"],
];

/** The profile list: each profile is a named set of needs, editable and removable. */
export function LpProfiles() {
  const phase = useBeats([["rest", 2400], ["new", 2600]] as const, "rest");
  return (
    <div className="lp2 lp2-list" role="img" aria-label="Perfis de aprendizagem: TDAH, dislexia e TEA, cada um com as necessidades dos alunos, ações de editar e excluir, e o botão Novo perfil.">
      <div className="lp2-head">
        <div><b>Perfis de aprendizagem</b><p>Um perfil representa alunos com dificuldades comuns e que precisam de adaptações. Se houver alunos diferentes, crie perfis distintos.</p></div>
        <span className="lp2-btn" data-anchor="new"><Plus /> Novo perfil</span>
      </div>
      <div className="lp2-search"><Search /> Buscar</div>
      {(phase === "new" ? [["Perfil teste", "Necessita de apoio frente a desafios novos • Fragilidade para lidar com frustrações • Necessita de apoio para manter a atenção"], ...PROFILES.slice(0, 2)] : PROFILES).map(([t, d], i) => (
        <div key={t} className={`lp2-row ${phase === "new" && i === 0 ? "is-new" : ""}`} data-anchor={i === 0 ? "row" : undefined}>
          <small>20/05 às 17:46</small>
          <b>{t}</b>
          <p>{d}</p>
          <span className="lp2-acts"><Pencil /><Trash2 className="lp2-del" /></span>
        </div>
      ))}
    </div>
  );
}

const TRAITS = [
  "Necessita de apoio frente a desafios novos", "Fragilidade para lidar com frustrações",
  "Necessita de apoio para manter a atenção", "Necessita de organização, rotina e previsibilidade",
  "Necessita de apoio visual e/ou concretos", "Beneficia-se de ambientes com menos estímulos",
  "Engaja-se melhor em atividades curtas", "Necessita de apoio em atividades em grupo",
];

/** Creating a profile: a name and a checklist of observable needs, not a diagnosis field. */
export function LpCreate() {
  const phase = useBeats([["open", 1000], ["name", 1800], ["c1", 700], ["c2", 700], ["c3", 700], ["hold", 2200]] as const, "hold");
  const order = ["open", "name", "c1", "c2", "c3", "hold"];
  const step = order.indexOf(phase);
  const name = useTyped("Perfil teste", phase === "name", step > 1, 90);
  const checked = [0, 1, 3].slice(0, Math.max(0, step - 1));
  return (
    <div className="lp2 lp2-modal" role="img" aria-label="Criar perfil de aprendizagem: o professor nomeia o perfil e marca características como apoio frente a desafios novos, fragilidade para lidar com frustrações e organização, rotina e previsibilidade.">
      <header><b>Criar perfil de aprendizagem</b><X /></header>
      <p className="lp2-sub">Nomeie o perfil e marque as características que melhor representam esse aluno ou grupo</p>
      <p className="lp2-label">Nome do perfil*</p>
      <div className={`lp2-field ${step >= 1 ? "is-focus" : ""}`} data-anchor="name">{name || <span>Ex.: Alunos com TDAH, Turma do reforço, Alunos com dislexia</span>}</div>
      <p className="lp2-label">Características do perfil*</p>
      <div className="lp2-traits" data-anchor="traits">
        {TRAITS.map((t, i) => (
          <span key={t} className={checked.includes(i) ? "is-on" : ""}><i>{checked.includes(i) && <Check />}</i>{t}</span>
        ))}
      </div>
    </div>
  );
}
