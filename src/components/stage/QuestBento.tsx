import ufrb from "../../assets/quest/quest-ufrb.png.asset.json";
import uneb from "../../assets/quest/quest-uneb.png.asset.json";
import aracaju from "../../assets/quest/quest-aracaju.png.asset.json";
import imposter from "../../assets/quest/quest-imposter.png.asset.json";
import "./quest.css";

export function QuestBento() {
  return (
    <div className="quest-bento" role="img" aria-label="Quest for the Next Product: uma jornada de plataforma entre UFRB e UNEB, uma travessia em Aracaju e o confronto com The Imposter.">
      <div className="quest-tile quest-hero">
        <header><span>QUEST FOR THE</span><h3>Next Product</h3></header>
        <div className="quest-journey" aria-hidden="true">
          <img className="quest-campus" src={ufrb.url} alt="" draggable={false} />
          <img className="quest-campus quest-campus-next" src={uneb.url} alt="" draggable={false} />
        </div>
        <div className="quest-route" aria-hidden="true">
          <span>UFRB</span><span className="quest-route-track"><i /></span><span>UNEB</span>
        </div>
      </div>
      <div className="quest-tile quest-coast">
        <h3>Aracaju</h3>
        <div className="quest-scene"><img src={aracaju.url} alt="" draggable={false} loading="lazy" /></div>
      </div>
      <div className="quest-tile quest-boss">
        <h3>The Imposter</h3>
        <div className="quest-scene"><img src={imposter.url} alt="" draggable={false} loading="lazy" /></div>
      </div>
    </div>
  );
}
