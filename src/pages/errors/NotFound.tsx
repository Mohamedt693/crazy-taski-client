import { useNavigate } from "react-router-dom";
import { MoveLeft, Ghost, Search } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      
      {/* Background Element - Huge 404 Text */}
      <h1 className="absolute text-[20rem] md:text-[30rem] font-black text-slate-50 select-none z-0">
        404
      </h1>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Icon */}
        <div className="w-24 h-24 bg-(--main-color) rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-[#F7E2B8]/50 mb-8 animate-bounce">
          <Ghost size={48} className="text-slate-900" />
        </div>

        {/* Text Content */}
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
          Task Lost in Space!
        </h2>
        <p className="text-slate-400 font-medium max-w-sm mb-10 leading-relaxed">
          It seems this page has gone <span className="text-slate-900 font-bold underline decoration-(--main-color) decoration-4">Crazy</span> and vanished from our task list.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200 cursor-pointer"
        >
          <MoveLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Minimalist Footer for the page */}
        <div className="mt-20 flex items-center gap-2 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em]">
          <Search size={12} />
          <span>Error Code: 0xCrazyTaski</span>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-(--main-color)/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-50 rounded-full blur-3xl" />
    </div>
  );
}

export default NotFound;