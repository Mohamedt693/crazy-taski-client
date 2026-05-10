import { FileText, CalendarDays, User2 } from "lucide-react";
import { useSidebarStore } from "../../../store/useSidebarStore";
import type { Note } from "../../../types/note.type";
import UpdateNoteForm from "../../forms/notes/UpdateNoteForm";

interface NoteCardProps {
  note: Note;
  projectId: string;
}

function NoteCard({ note, projectId }: NoteCardProps) {
  const setContent = useSidebarStore((state) => state.setContent);

  const user = note.assignedTo && typeof note.assignedTo === "object" && "displayName" in note.assignedTo ? note.assignedTo : null;

  return (
    <div
      onClick={() => setContent(<UpdateNoteForm projectId={projectId} noteId={note._id} />)}
      className="group relative cursor-pointer overflow-hidden rounded-[28px] bg-(--card-bg) p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
    >
      {/* Top Row */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 transition-all group-hover:bg-blue-50 group-hover:text-[#5B8DEF] group-hover:border-blue-100">
          <FileText size={22} />
        </div>

        <div className="flex flex-col items-end">
          {user ? (
            <div className="group/avatar relative flex items-center gap-3 bg-slate-50/80 p-1.5 pr-3 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 leading-none mb-1">Assigned To</span>
                <span className="text-[11px] font-bold text-slate-700 leading-tight">{user.displayName.split(" ")[0]}</span>
              </div>
              <div className="h-9 w-9 overflow-hidden rounded-xl border-2 border-white bg-white shadow-sm ring-1 ring-slate-200 transition-transform group-hover/avatar:scale-105">
                {user.avatar ? <img src={user.avatar} alt={user.displayName} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-[#7DAEF7] text-[10px] font-black text-white">{user.displayName.substring(0, 2).toUpperCase()}</div>}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Unassigned</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-300 shadow-sm border border-slate-100"><User2 size={14} /></div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#5B8DEF]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Project Note</span>
        </div>
        <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-slate-800 transition-colors group-hover:text-[#5B8DEF]">{note.title}</h3>
        <p className="wrap-break-word mt-2 line-clamp-4 min-h-15 whitespace-pre-wrap text-sm leading-6 text-slate-500">{note.content || "No content available for this note yet."}</p>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#5B8DEF]"><FileText size={12} />Note</span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500">Saved</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50"><CalendarDays size={14} /></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-300">Created</span>
              <span className="text-xs font-semibold text-slate-500">{note.createdAt ? new Date(note.createdAt).toLocaleDateString("en-GB") : "Recently"}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-400 transition-all group-hover:bg-blue-50 group-hover:text-[#5B8DEF]">Open details</div>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;