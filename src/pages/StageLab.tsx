import { AiImageGenerationBento } from "@/components/stage/AiImageGenerationBento";
import { ChegueiBento } from "@/components/stage/ChegueiBento";
import { MeuArcoBento } from "@/components/stage/MeuArcoBento";
import aiGif from "@/assets/ai-image-generation.gif";
import arcoPoster from "@/assets/meu-arco-demo-poster.jpg";
import arcoMp4 from "@/assets/meu-arco-demo.mp4";
import chegueiPoster from "@/assets/cheguei-mobile-poster.jpg";
import chegueiMp4 from "@/assets/cheguei-mobile.mp4";

/** Hidden comparison page for the stageshow pilot (not linked anywhere). */
const rows = [
  { name: "Meu Arco", media: <video src={arcoMp4} poster={arcoPoster} autoPlay muted loop playsInline className="max-h-[420px] border-2 border-foreground" />, bento: <MeuArcoBento /> },
  { name: "Cheguei", media: <video src={chegueiMp4} poster={chegueiPoster} autoPlay muted loop playsInline className="max-h-[420px] border-2 border-foreground" />, bento: <ChegueiBento /> },
  { name: "Images for AI-Generated Questions", media: <img src={aiGif} alt="" className="w-full max-w-[560px] border-2 border-foreground" />, bento: <AiImageGenerationBento /> },
];

export default function StageLab() {
  return (
    <main className="container mx-auto px-4 py-24">
      <h1 className="mb-10 font-display text-3xl font-semibold">Stageshow pilot<span className="text-primary">.</span></h1>
      <div className="space-y-20">
        {rows.map((r) => (
          <section key={r.name}>
            <h2 className="mb-6 font-display text-xl font-semibold">{r.name}</h2>
            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div><p className="mb-3 font-display text-xs uppercase tracking-[0.14em] text-muted-foreground">Current media</p>{r.media}</div>
              <div><p className="mb-3 font-display text-xs uppercase tracking-[0.14em] text-muted-foreground">Bento highlights</p>{r.bento}</div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
