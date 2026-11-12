import "./stage.css";
import { Send, MapPin, Check, Car, Mail, MessageSquare, Heart, LayoutGrid, MousePointer2, Footprints, ChevronDown } from "lucide-react";

/** Recreates the ClassApp "Cheguei" screens from the project video as a bento. */
const Avatar = ({ t, c }: { t: string; c: string }) => (
  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: c }}>{t}</span>
);

export function ChegueiBento() {
  return (
    <div className="ca grid w-full max-w-[560px] grid-cols-2 gap-3 sm:grid-cols-3" role="img" aria-label="Recriação das telas do Cheguei no ClassApp">
      <div className="app-tile col-span-2 bg-[#f7f8fa] p-3 sm:row-span-2">
        <div className="mb-2 flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1 text-[var(--ca-blue)]"><Footprints className="h-3 w-3" /> A pé</span>
          <ChevronDown className="h-3 w-3 text-neutral-400" />
        </div>
        <p className="mb-2 text-[8px] font-semibold uppercase tracking-wide text-neutral-500">Colégio MMW</p>
        <div className="rounded-xl border border-[var(--ca-line)] bg-white p-3">
          <div className="flex items-center gap-2">
            <Avatar t="A(" c="var(--ca-red)" />
            <div><p className="text-[11px] font-semibold">Aluno (Demo)</p><p className="flex items-center gap-0.5 text-[8px] text-neutral-500"><MapPin className="h-2 w-2" /> Múltiplas portarias</p></div>
          </div>
          <div className="relative mt-3 h-8">
            <button tabIndex={-1} className="ca-a ca-press absolute inset-0 flex items-center justify-center gap-1 rounded-full bg-[var(--ca-blue)] text-[10px] font-medium text-white"><Send className="h-3 w-3" /> Cheguei</button>
            <div className="ca-b absolute inset-0 flex flex-col justify-center gap-1">
              <p className="flex items-center justify-center gap-1 text-[9px] font-medium text-[var(--ca-green)]"><Check className="h-2.5 w-2.5" /> Entregue</p>
              <div className="h-1 w-full rounded-full bg-neutral-200"><div className="ca-progress h-full rounded-full bg-[var(--ca-green)]" /></div>
            </div>
            <MousePointer2 className="ca-cursor pointer-events-none absolute -bottom-2 left-1/2 h-3.5 w-3.5 fill-white text-neutral-800" />
          </div>
        </div>
        <div className="mt-2 rounded-xl border border-[var(--ca-line)] bg-white p-3">
          <div className="flex items-center gap-2">
            <Avatar t="A" c="var(--ca-green)" />
            <div><p className="text-[11px] font-semibold">Amaya</p><p className="flex items-center gap-0.5 text-[8px] text-neutral-500"><MapPin className="h-2 w-2" /> Portaria Av. Um</p></div>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1 text-[9px] text-[var(--ca-green)]"><Check className="h-2.5 w-2.5" /> Entregue</p>
          <div className="mt-1 h-1 rounded-full bg-[var(--ca-green)]" />
          <p className="mt-1 text-center text-[7px] text-neutral-400">Entregue às 13:49</p>
        </div>
      </div>

      <div className="app-tile p-3">
        <div className="flex gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-semibold text-white">C</span>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold leading-tight">Cheguei: agilidade e segurança para buscar o seu filho!</p>
            <p className="mt-1 flex items-center gap-0.5 text-[8px] text-neutral-500"><Mail className="h-2 w-2" /> Cheguei · 13:44</p>
          </div>
        </div>
      </div>

      <div className="app-tile flex items-end p-3">
        <div className="flex w-full justify-between text-neutral-400">
          {[Mail, MessageSquare, Heart].map((I, i) => <I key={i} className="h-3.5 w-3.5" />)}
          <span className="flex flex-col items-center text-[var(--ca-blue)]"><Car className="h-3.5 w-3.5" /><span className="text-[7px] font-semibold">Cheguei</span></span>
          <LayoutGrid className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
