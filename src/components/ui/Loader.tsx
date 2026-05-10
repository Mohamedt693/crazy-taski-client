import { Loader2 } from 'lucide-react'


function Loader() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-slate-200" size={40} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                Synchronizing Data
            </span>
        </div>
    )
}

export default Loader
