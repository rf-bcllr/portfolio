import "./stage.css";
import { Bell, ChevronRight, ChevronDown, GraduationCap, FileText, Home, MessageCircle, Calendar, CircleDollarSign, MoreHorizontal, MousePointer2 } from "lucide-react";

/** Recreates the Meu Arco app screens (demo content from the project video) as a bento. */
export function MeuArcoBento() {
  return (
    <div className="arco grid w-full max-w-[560px] grid-cols-2 gap-3 sm:grid-cols-3" role="img" aria-label="Recriação das telas do app Meu Arco">
      <div className="app-tile col-span-2 bg-[#f6f6f8] sm:row-span-2">
        <div className="flex items-center justify-between bg-white px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold"><span className="h-5 w-5 rounded-full border-[3px] border-[#3fae49]" /> Colégio COC <ChevronDown className="h-3 w-3" /></span>
          <span className="flex items-center gap-2"><Bell className="h-3.5 w-3.5" /><span className="h-5 w-5 rounded-full bg-[#7a4a35]" /></span>
        </div>
        <div className="bg-white px-3 pb-3">
          <p className="text-[13px] font-semibold">Boa tarde, Maria!</p>
          <div className="relative mt-2 overflow-hidden">
            <div className="arco-slide flex w-[190%] gap-2">
              {[{ I: GraduationCap, t: "Rematrícula 2025 está disponível", hi: true }, { I: FileText, t: "Revise seus contratos" }].map(({ I, t, hi }) => (
                <div key={t} className={`flex flex-1 items-center gap-2 rounded-xl p-2.5 ${hi ? "bg-[var(--arco-soft)]" : "bg-neutral-100"}`}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70"><I className="h-3 w-3" /></span>
                  <span className="flex-1 text-[10px] leading-tight">{t}</span><ChevronRight className="h-3 w-3" />
                </div>
              ))}
            </div>
            <MousePointer2 className="ca-cursor pointer-events-none absolute bottom-1 left-[40%] h-3.5 w-3.5 fill-white text-neutral-800" />
          </div>
        </div>
        <div className="mt-2 bg-white p-3">
          <div className="flex items-baseline justify-between"><p className="text-[15px] font-semibold">R$ 1.600,00</p><span className="flex items-center text-[9px]">Ver fatura <ChevronRight className="h-3 w-3" /></span></div>
          <p className="text-[9px] text-neutral-600">Sua próxima fatura vence dia 05 de novembro</p>
          <div className="mt-2 rounded-full bg-[var(--arco-blue)] py-1.5 text-center text-[10px] font-medium text-white">Pagar</div>
        </div>
      </div>

      <div className="app-tile p-3">
        <p className="text-[8px] text-neutral-500">Acompanhe suas solicitações</p>
        <div className="mt-2 rounded-xl border border-[var(--arco-line)] p-2">
          <p className="flex items-center justify-between text-[11px] font-semibold">Matrícula 2025 <ChevronRight className="h-3 w-3" /></p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[8px]"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Em andamento</span>
        </div>
      </div>

      <div className="app-tile flex flex-col justify-between p-3">
        <p className="flex items-center justify-between text-[11px] font-semibold">Mensagens <span className="flex items-center gap-1 text-[8px] font-normal"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> 6 não lidas</span></p>
        <div className="mt-3 flex items-center justify-between text-neutral-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--arco-soft)]"><Home className="h-3 w-3 fill-[var(--arco-blue)] text-[var(--arco-blue)]" /></span>
          {[MessageCircle, Calendar, CircleDollarSign, MoreHorizontal].map((I, i) => <I key={i} className="h-3.5 w-3.5" />)}
        </div>
      </div>
    </div>
  );
}
