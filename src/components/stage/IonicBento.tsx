import lia from "../../assets/ionic/lia-characters.png.asset.json";
import ion from "../../assets/ionic/ion-characters.png.asset.json";
import liaMood from "../../assets/ionic/lia-moodboard.png.asset.json";
import ionMood from "../../assets/ionic/ion-moodboard.png.asset.json";
import processArt from "../../assets/ionic/process.png.asset.json";
import "./ionic.css";

type CropProps = { url: string; sourceWidth: number; box: [number, number, number, number]; className?: string };

function Crop({ url, sourceWidth, box, className = "" }: CropProps) {
  const [x, y, width, height] = box;
  return (
    <div className={`ionic-crop ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <img src={url} alt="" draggable={false}
        style={{ width: `${(sourceWidth / width) * 100}%`, left: `${(-x / width) * 100}%`, top: `${(-y / height) * 100}%` }} />
    </div>
  );
}

export function IonicBento() {
  return (
    <div className="ionic-bento" role="img" aria-label="Iônica: Lia, a companheira de descobertas, e Íon, a inteligência que transforma. Poses, referências visuais e processo de criação.">
      <div className="ionic-tile ionic-hero">
        <header><span>IÔNICA</span><h3>Companhia para descobrir.</h3></header>
        <div className="ionic-duo" aria-hidden="true">
          <div className="ionic-lia">
            <div className="ionic-expression ionic-expression-first"><Crop url={lia.url} sourceWidth={1660} box={[485, 500, 180, 360]} /></div>
            <div className="ionic-expression ionic-expression-second"><Crop url={lia.url} sourceWidth={1660} box={[675, 500, 180, 360]} /></div>
          </div>
          <Crop className="ionic-ion" url={ion.url} sourceWidth={1658} box={[40, 220, 370, 350]} />
        </div>
        <footer><strong>Lia</strong><strong>Íon</strong></footer>
      </div>
      <div className="ionic-tile ionic-reference">
        <h3>Universo de Lia</h3>
        <Crop url={liaMood.url} sourceWidth={1662} box={[465, 120, 1150, 730]} />
      </div>
      <div className="ionic-tile ionic-reference ionic-warm">
        <h3>Universo de Íon</h3>
        <Crop url={ionMood.url} sourceWidth={1660} box={[465, 120, 1150, 730]} />
      </div>
      <div className="ionic-tile ionic-process">
        <h3>Da ideia à identidade</h3>
        <img src={processArt.url} alt="" draggable={false} loading="lazy" />
      </div>
    </div>
  );
}
