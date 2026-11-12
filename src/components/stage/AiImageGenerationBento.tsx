import "./stage.css";
import { ImageIcon, Info, X, MousePointer2, FileText } from "lucide-react";

/** Recreates the FTD com Você screens from the AI image generation GIF, as a bento of highlights. */
const ImgBtn = ({ className = "" }: { className?: string }) => (
  <span className={`ftd-btn ${className}`}><ImageIcon className="h-2.5 w-2.5" /> Gerar imagem com IA</span>
);

export function AiImageGenerationBento() {
  return (
    <div className="ftd grid w-full max-w-[560px] grid-cols-2 gap-3 sm:grid-cols-3" role="img" aria-label="Recriação da tela FTD com Você: questões com botão Gerar imagem com IA">
      {/* Hero: question list where the teacher generates an image */}
      <div className="ftd-tile col-span-2 p-3 sm:row-span-2">
        <div className="mb-3 flex items-start gap-2 rounded-md border border-[var(--ftd-blue)]/30 bg-[var(--ftd-info)] p-2 text-[9px] leading-tight">
          <Info className="mt-px h-3 w-3 shrink-0 text-[var(--ftd-blue)]" />
          <span className="flex-1">As questões não podem ser editadas aqui. <span className="text-[var(--ftd-blue)] underline">Exportar em .DOCX</span></span>
          <X className="h-3 w-3 text-[var(--ftd-muted)]" />
        </div>
        <p className="text-[10px] leading-snug">3. Um terreno retangular possui 120 m de perímetro. Sabendo que o comprimento é o triplo da largura, determine as dimensões.</p>
        <div className="ftd-field mt-2 px-2 py-1.5 text-[8px] text-[var(--ftd-muted)]">[Espaço para resposta]</div>
        <div className="relative mt-2 inline-block">
          <ImgBtn className="ftd-press" />
          <MousePointer2 className="ftd-cursor pointer-events-none absolute -bottom-3 left-16 h-3.5 w-3.5 fill-white text-[var(--ftd-ink)]" />
        </div>
        <div className="ftd-img mt-3 flex aspect-[16/7] items-center justify-center rounded-md border border-[var(--ftd-line)] bg-white">
          <svg viewBox="0 0 120 50" className="h-[70%]" aria-hidden>
            <rect x="20" y="10" width="80" height="30" fill="#e8f1e3" stroke="#5a8f4e" strokeWidth="1.5" />
            <text x="60" y="8" fontSize="6" textAnchor="middle" fill="#2b2b2b">3x</text>
            <text x="106" y="28" fontSize="6" fill="#2b2b2b">x</text>
          </svg>
        </div>
      </div>

      {/* Second question */}
      <div className="ftd-tile p-3">
        <p className="text-[9px] leading-snug">1. Cite três exemplos de grandezas que estudamos em Matemática.</p>
        <div className="ftd-field mt-2 h-4" />
        <ImgBtn className="mt-2" />
      </div>

      {/* Teacher sidebar card */}
      <div className="ftd-tile p-3">
        <p className="mb-2 flex items-center gap-1 text-[9px] text-[var(--ftd-muted)]"><FileText className="h-3 w-3" /> Meus Materiais</p>
        <div className="flex items-center gap-2 rounded-md bg-white p-2">
          <span className="h-5 w-5 shrink-0 rounded-full bg-[var(--ftd-avatar)]" />
          <div className="min-w-0">
            <p className="text-[9px] font-semibold">Professor(a)</p>
            <span className="ftd-bar mt-1 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
