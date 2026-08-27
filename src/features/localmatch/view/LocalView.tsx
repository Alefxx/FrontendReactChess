import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MonitorSmartphone, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';

export function LocalView() {
  const [guestName, setGuestName] = useState('');
  const navigate = useNavigate();
  const handleAvancar = () => navigate('/time', { state: { tipoPartida: 'local', guestName: guestName.trim() || 'Visitante' } });

  return (
    <div className="page-container flex min-h-[calc(100vh-2rem)] max-w-4xl flex-col py-2 sm:min-h-[calc(100vh-3rem)] sm:py-5">
      <header className="mb-7 flex items-start gap-3">
        <IconButton icon={<ArrowLeft size={20} />} onClick={() => navigate('/gamemode')} />
        <div><p className="mb-1 text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">Partida presencial</p><h1 className="text-2xl font-black text-white sm:text-3xl">Joguem no <span className="text-chess-green">mesmo aparelho</span></h1><p className="mt-1 text-sm text-slate-400">Prepare a mesa antes de escolher o relógio.</p></div>
      </header>
      <main className="mx-auto grid w-full max-w-3xl flex-1 items-center gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <section className="surface-card rounded-3xl p-6 sm:p-7">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-400/12 text-violet-300"><MonitorSmartphone size={25} /></span>
          <h2 className="mt-5 text-xl font-black text-white">Passe o aparelho.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">A partida mantém os nomes e relógios sempre legíveis. A perspectiva do tabuleiro pode ser virada manualmente a qualquer momento.</p>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-violet-300"><Users size={17} /> Dois jogadores, uma tela</div>
        </section>
        <section className="surface-card rounded-3xl p-5 sm:p-7">
          <label htmlFor="guestName" className="text-sm font-extrabold text-slate-200">Nome do adversário <span className="font-medium text-slate-500">(opcional)</span></label>
          <p className="mt-1 text-sm text-slate-400">Esse nome aparece no relógio e no tabuleiro.</p>
          <input id="guestName" type="text" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Ex.: Maria" maxLength={15} className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-analysis-blue focus:outline-none" />
          <p className="mt-3 text-xs leading-5 text-slate-500">Partidas presenciais não alteram o rating da sua conta.</p>
          <Button label="Escolher tempo" size="lg" className="mt-6 w-full" icon={<ArrowRight size={18} />} onClick={handleAvancar} />
        </section>
      </main>
    </div>
  );
}
