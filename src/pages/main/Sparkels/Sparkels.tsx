import { Sparkles, ArrowUpRight, BrainCircuit, Terminal, Activity, Zap } from 'lucide-react';

export default function SparklesPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between 
    overflow-x-hidden custom-scrollbar">
      
      {/* Background Glow - Architectural Elegance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
      w-75 md:w-200 h-75 md:h-150 bg-[#F7E2B8]/20 rounded-full blur-[100px] md:blur-[150px] 
      animate-pulse pointer-events-none" />

      {/* Top Navigation Teaser */}
      <nav className="relative z-10 w-full p-8 flex justify-between items-center max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-[#F7E2B8]" />
          </div>
          <span className="font-black text-slate-900 uppercase tracking-tighter">Crazy Taski</span>
        </div>
        <div className="hidden md:block text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Project Status: Phase 4 Implementation
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-5xl mx-auto text-center py-10">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 text-white 
        mb-10 animate-bounce shadow-xl">
          <BrainCircuit size={16} className="text-[#F7E2B8]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Neural Task Management Active
          </span>
        </div>

        {/* Main Heading */}
        <div className="space-y-6 mb-16">
          <h2 className="text-slate-400 font-medium text-xl tracking-[0.2em] uppercase">
            Evolution of Productivity
          </h2>
          <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 tracking-tighter leading-none">
            Sparkels<span className="text-[#F7E2B8]">.</span>
          </h1>
        </div>

        {/* Ad Copy */}
        <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-2xl font-medium leading-relaxed mb-16 px-4">
          Stop just "managing" tasks. Start <span className="text-slate-900 font-bold underline decoration-[#F7E2B8] decoration-8 underline-offset-4">evolving</span> them. 
          The AI engine built specifically for the Crazy Taski ecosystem.
        </p>

        {/* Interaction Placeholder */}
        <div className="max-w-xl mx-auto relative mb-32 px-4">
          <div className="group relative">
            <div className="absolute -inset-1 bg-linear-to-r from-[#F7E2B8] to-slate-200 rounded-[2.5rem] blur 
            opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex p-3 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl">
              <div className="flex-1 flex items-center px-6 text-slate-300 font-mono text-sm tracking-widest">
                <Terminal size={18} className="mr-3 text-slate-400" />
                awaiting_input...
              </div>
              <button className="bg-slate-900 text-white px-10 py-5 rounded-4xl font-black 
              text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all cursor-wait">
                Tease
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Ad Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto text-left px-8">
           <div className="space-y-4">
              <Activity size={24} className="text-slate-900" />
              <h3 className="font-black uppercase text-sm tracking-widest">Predictive Logic</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Sparkels anticipates your next move before you even open your dashboard.
                </p>
           </div>
           <div className="space-y-4">
              <Sparkles size={24} className="text-slate-900" />
              <h3 className="font-black uppercase text-sm tracking-widest">Auto-Refinement</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Polishing task descriptions and priorities using architectural precision.
                </p>
           </div>
           <div className="space-y-4">
              <Terminal size={24} className="text-slate-900" />
              <h3 className="font-black uppercase text-sm tracking-widest">CLI Core</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Deep integration with your Crazy Taski workflow via terminal commands.
                </p>
           </div>
        </div>
      </main>

      {/* Fixed Luxury Footer */}
      <footer className="w-full py-12 border-t border-slate-50 bg-slate-50/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
             <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-1 h-5 rounded-full bg-slate-900 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
             <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.5em]">Sparkels Intelligence v0.1-Alpha</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Coming to Crazy Taski • 2026
          </div>
        </div>
      </footer>
    </div>
  );
}