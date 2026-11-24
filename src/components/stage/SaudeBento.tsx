import { ChevronLeft, Heart, Leaf, Minus, Plus, ShoppingBag, Wheat } from "lucide-react";
import { useBeats } from "./useBeats";
import "./saude.css";

/**
 * Faux Saúde e Ponto product screen (health-first delivery concept).
 * Story: the nutrition tags are read before checkout, the quantity goes to two, the item is added,
 * the bag count rolls, and the healthy pick earns points.
 */
const beats = [
  ["look", 1600], ["tags", 1500], ["qty", 1100], ["add", 900], ["bag", 900], ["points", 2400],
] as const;
type Phase = (typeof beats)[number][0];
const order: Phase[] = ["look", "tags", "qty", "add", "bag", "points"];

export function SaudeBento() {
  const phase = useBeats(beats, "points" as Phase);
  const i = order.indexOf(phase);
  const qty = i >= 2 ? 2 : 1;
  const inBag = i >= 4 ? 2 : 0;

  return (
    <div
      className="sp-bento"
      role="img"
      aria-label="Saúde e Ponto: na tela da torrada integral, as etiquetas Integral, Rico em fibras e Sem açúcar aparecem antes do checkout; a quantidade vai para 2, o item entra na sacola e a compra saudável rende 13 pontos."
    >
      <div className="sp-phone" aria-hidden="true">
        <header className="sp-top">
          <ChevronLeft />
          <span className="sp-points">★ 120 pts</span>
          <span className="sp-bag">
            <ShoppingBag />
            <i className={inBag ? "is-on" : ""}>{inBag || ""}</i>
          </span>
        </header>
        <div className="sp-hero">
          <div className="sp-pack">
            <span>Torrada</span>
            <b>Integral</b>
          </div>
          <Heart className="sp-heart" />
        </div>
        <div className="sp-info">
          <h4>Torrada integral</h4>
          <p className="sp-meta">
            <span className="sp-bar" style={{ width: 92 }} />
            <span className="sp-rate">4,8 ★</span>
          </p>
          <div className={`sp-tags ${i >= 1 ? "is-lit" : ""}`}>
            <span><Wheat /> Integral</span>
            <span><Leaf /> Rico em fibras</span>
            <span>Sem açúcar</span>
          </div>
          <p className="sp-desc">
            <span className="sp-bar" style={{ width: "96%" }} />
            <span className="sp-bar" style={{ width: "78%" }} />
          </p>
          <div className="sp-buy">
            <span className="sp-qty">
              <Minus />
              <b key={qty} className="sp-roll">{qty}</b>
              <Plus className={phase === "qty" ? "is-press" : ""} />
            </span>
            <span className={`sp-add ${phase === "add" ? "is-press" : ""}`}>Adicionar</span>
          </div>
        </div>
        <div className={`sp-toast ${phase === "points" ? "is-on" : ""}`}>
          <span className="sp-coin">+13</span>
          <p>
            <b>Parabéns!</b> Você ganhou 13 pontos por uma escolha saudável.
          </p>
        </div>
      </div>
    </div>
  );
}
