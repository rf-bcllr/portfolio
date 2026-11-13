import { useEffect, useState } from "react";
import {
  CarFront, Check, CheckCheck, ChevronDown, Footprints,
  MapPin, MessageSquare, Navigation, Plus, Search,
  SlidersHorizontal, X,
} from "lucide-react";
import "./cheguei.css";

const beats = [
  ["idle", 2000], ["transport", 2300], ["vehicle", 1300], ["confirmTransport", 650],
  ["ready", 1400], ["tapArrival", 500], ["gate", 2300], ["submit", 650],
  ["requested", 2600], ["queue", 2200], ["opening", 600], ["details", 2600],
  ["filters", 700], ["queueAgain", 1500], ["acceptTap", 500], ["accepting", 650],
  ["accepted", 2400], ["guardianLoading", 700], ["onWay", 3600], ["staffReturn", 1600],
  ["reset", 600],
] as const;

type Phase = typeof beats[number][0];

function usePickupSequence(): Phase {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setIndex(v => (v + 1) % beats.length), beats[index][1]);
    return () => window.clearTimeout(timer);
  }, [index, reduced]);
  return reduced ? "onWay" : beats[index][0];
}

function Avatar({ amaya = false }: { amaya?: boolean }) {
  return <span className={`cq-avatar ${amaya ? "cq-avatar-green" : ""}`}>{amaya ? "A" : "A("}</span>;
}
function Tap() { return <span className="cq-tap" aria-hidden="true" />; }
function Progress({ delivered = false, requested = false }: { delivered?: boolean; requested?: boolean }) {
  return (
    <div className={`cq-progress ${delivered ? "is-delivered" : ""} ${requested ? "is-requested" : ""}`}>
      <span /><span /><span /><span />
    </div>
  );
}

const vehicles = [
  ["BCLLR270", "Tesla - Branco"],
  ["HJE213", "Renault Corsa - Prata"],
  ["ABACOONN", "Branco"],
  ["BCLLR123", "Fiat Palio - Vermelho"],
  ["BCLLR993", "Renault Kwid - Preto"],
];

export function ChegueiBento() {
  const phase = usePickupSequence();
  const is = (...p: Phase[]) => p.includes(phase);
  const transportOpen = is("transport", "vehicle", "confirmTransport");
  const selectedVehicle = !is("idle", "transport", "reset");
  const gateOpen = is("gate", "submit");
  const accepted = is("accepted", "guardianLoading", "onWay", "staffReturn");
  const requested = is("requested", "queue", "opening", "details", "filters", "queueAgain", "acceptTap", "accepting");
  const staffActive = is("queue", "opening", "details", "filters", "queueAgain", "acceptTap", "accepting", "accepted", "staffReturn");
  const accepting = phase === "accepting";

  return (
    <div
      className={`cheguei-bento ${phase === "reset" ? "cq-reset" : ""}`}
      role="img"
      aria-label="Cheguei ClassApp: responsável muda de transporte, escolhe a portaria e solicita a retirada. A equipe abre e aceita o chamado. O responsável acompanha o status A caminho. Amaya tem uma retirada já entregue."
    >
      <section className="cq-tile cq-hero">
        <header className="cq-header"><Avatar /><strong>Aluno (Demo)</strong></header>
        <div className="cq-transport-bar">
          {selectedVehicle ? <CarFront /> : <Footprints />}
          <span>{selectedVehicle ? "[BCLLR993] Renault Kwid - Preto" : "A pé"}</span>
          <ChevronDown />
        </div>
        <div className="cq-school">COLÉGIO MMW <ChevronDown />{(requested || accepted) && <b>1</b>}</div>
        <div className="cq-student">
          <div className="cq-person">
            <Avatar />
            <div>
              <strong>Aluno (Demo)</strong>
              <small><MapPin /> {requested || accepted ? "Portaria Teste" : "Múltiplas portarias"}</small>
            </div>
          </div>
          {requested || accepted ? (
            <div className="cq-status" key={accepted ? "way" : "requested"}>
              <strong>{accepted ? <Check /> : <Navigation />}{accepted ? "A caminho" : "Solicitado"}</strong>
              <Progress requested={!accepted} />
              <small>{accepted ? "Estudante será entregue em instantes..." : "Aguardando confirmação da escola..."}</small>
              <span className={accepted ? "cq-link" : "cq-cancel"}>{accepted ? "Confirmar entrega" : "Cancelar chamado"}</span>
            </div>
          ) : (
            <div className={`cq-button ${phase === "tapArrival" ? "is-pressed" : ""}`}>
              <Navigation /> Cheguei{phase === "tapArrival" && <Tap />}
            </div>
          )}
        </div>
        <div className="cq-collapsed">ESCOLA CLASSAPP <ChevronDown /></div>
        <div className="cq-collapsed">CLASSAPP - TEMA NOVO <ChevronDown /></div>
        <div className="cq-collapsed">COLÉGIO WILLIAN FERREIRA <ChevronDown /></div>

        {phase === "guardianLoading" && <div className="cq-loading"><span className="cq-spinner" /></div>}
        {(transportOpen || gateOpen) && <div className="cq-scrim" />}

        {transportOpen && (
          <div className="cq-sheet cq-transport-sheet">
            <div className="cq-handle" />
            <p>Qual transporte você está utilizando?</p>
            {vehicles.map(([plate, name], index) => {
              const checked = index === 4 && phase !== "transport";
              return (
                <div className={`cq-option ${checked ? "is-selected" : ""}`} key={plate}>
                  <span className="cq-radio">{checked && <Check />}</span>
                  <CarFront />
                  <div>[{plate}]<small>{name}</small></div>
                  {checked && phase === "vehicle" && <Tap />}
                </div>
              );
            })}
            <div className={`cq-option ${phase === "transport" ? "is-selected" : ""}`}>
              <span className="cq-radio">{phase === "transport" && <Check />}</span>
              <Footprints /><span><em>Principal</em> A pé</span>
            </div>
            <div className="cq-outline"><Plus /> Adicionar veículo</div>
            <div className={`cq-button ${phase === "confirmTransport" ? "is-pressed" : ""}`}>
              Confirmar{phase === "confirmTransport" && <Tap />}
            </div>
          </div>
        )}

        {gateOpen && (
          <div className="cq-sheet cq-gate-sheet">
            <div className="cq-handle" />
            <p>Em qual portaria você está?</p>
            <div className="cq-option is-selected">
              <span className="cq-radio"><Check /></span>
              <div>Portaria Teste<small>Rua Napoleão Dórea, 200</small></div>
            </div>
            <div className="cq-group">Grupo teste Luana <span>+16</span></div>
            <div className="cq-option">
              <span className="cq-radio" />
              <div>Portaria Av. Um<small>Rua Açaí, 35, Dom Cabral</small></div>
            </div>
            <div className="cq-group cq-group-plain">Teste isaac <span>+1</span></div>
            <div className={`cq-button ${phase === "submit" ? "is-pressed" : ""}`}>
              <Navigation /> Cheguei{phase === "submit" && <Tap />}
            </div>
          </div>
        )}
      </section>

      <section className={`cq-tile cq-staff ${staffActive ? "is-active" : ""}`}>
        <header className="cq-header"><Avatar /><strong>Staff (Demo)</strong></header>
        <div className="cq-tabs"><span>Chegaram</span><span>Entregues</span></div>
        <div className="cq-search"><Search /> Buscar aluno... <SlidersHorizontal /></div>
        <div className="cq-arrival-row">
          <div className="cq-arrival-avatar">
            <Avatar />
            <span className="cq-timer">{accepted ? "01:09" : "00:34"}</span>
          </div>
          <div className="cq-arrival-info">
            <strong>Aluno (Demo)</strong>
            <span>1B <em>+3</em></span>
            <small><Navigation /> Rafael Bacellar · <MapPin /> Portaria Teste</small>
            <small><CarFront /> [BCLLR993] Renault Kwid - Preto</small>
          </div>
          <div className="cq-staff-actions">
            <div className={`cq-button ${accepted ? "cq-green-button" : ""} ${phase === "acceptTap" ? "is-pressed" : ""}`}>
              {accepting ? <span className="cq-spinner" /> : <><Check />{accepted ? "Concluir" : "Aceitar"}</>}
              {phase === "acceptTap" && <Tap />}
            </div>
            <span className="cq-message"><MessageSquare /></span>
          </div>
        </div>

        {phase === "opening" && <div className="cq-loading"><span className="cq-spinner" /></div>}

        {phase === "details" && (
          <>
            <div className="cq-scrim" />
            <div className="cq-sheet cq-detail-sheet">
              <div className="cq-handle" />
              <div className="cq-person"><Avatar /><strong>Aluno (Demo)</strong><span className="cq-timer">00:45</span></div>
              <small><Navigation /> Rafael Bacellar</small>
              <small><MapPin /> Portaria Teste</small>
              <small className="cq-address">Rua Napoleão Dórea, 200</small>
              <small><CarFront /> [BCLLR993] Renault Kwid - Preto</small>
              <strong className="cq-group-title">Grupos do Aluno</strong>
              <div className="cq-tags"><span>1B</span><span>Produto</span><span>Tech</span><span>Teste isaac</span></div>
              <div className="cq-button"><Check /> Aceitar chamado</div>
              <div className="cq-outline"><MessageSquare /> Contatar responsável</div>
            </div>
          </>
        )}

        {phase === "filters" && (
          <div className="cq-filter-screen">
            <strong><X /> Filtros de Pesquisa</strong>
            <span className="cq-spinner" />
            <div><span>Limpar filtros</span><span className="cq-button">Aplicar</span></div>
          </div>
        )}

        {phase === "accepted" && <div className="cq-toast">1 chamado(s) aceito(s) <span>Desfazer</span></div>}
      </section>

      <section className="cq-tile cq-transport-tile">
        <Footprints className="cq-feature-icon" />
        <div className="cq-mode"><span>A pé</span><ChevronDown /></div>
        <div className={`cq-vehicle-chip ${selectedVehicle ? "is-selected" : ""}`}>
          <CarFront /><span>Renault Kwid<small>Preto · BCLLR993</small></span>
          {selectedVehicle && <Check />}
        </div>
      </section>

      <section className="cq-tile cq-delivered-tile">
        <div className="cq-person"><Avatar amaya /><strong>Amaya</strong></div>
        <small><MapPin /> Portaria Av. Um</small>
        <div className="cq-delivered"><CheckCheck /> Entregue</div>
        <Progress delivered />
        <small className="cq-delivery-time">Entregue às 13:49</small>
      </section>
    </div>
  );
}
