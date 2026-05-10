import { CalendarDays, CheckCircle2, Circle, Flag, User2 } from "lucide-react";
import { UpdateTaskForm } from "../../forms/tasks/UpdateTaskForm";
import { useSidebarStore } from "../../../store/useSidebarStore";
import type { Task } from "../../../types/task.type";

interface TaskCardProps {
  task: Task;
  projectId: string;
}

const priorityStyles = {
  urgent: { dot: "bg-red-500", badge: "bg-red-50 text-red-600 border-red-100", label: "Urgent" },
  high: { dot: "bg-orange-500", badge: "bg-orange-50 text-orange-600 border-orange-100", label: "High" },
  medium: { dot: "bg-blue-500", badge: "bg-blue-50 text-blue-600 border-blue-100", label: "Medium" },
  low: { dot: "bg-slate-300", badge: "bg-slate-50 text-slate-500 border-slate-100", label: "Low" },
};

function TaskCard({ task, projectId }: TaskCardProps) {
  const setContent = useSidebarStore((state) => state.setContent);
  const user = typeof task.assignedTo === 'object' ? task.assignedTo : null;
  const priority = priorityStyles[task.priority] || priorityStyles.low;
  const isDone = task.status === "done";

  return (
    <div
      onClick={() => setContent(<UpdateTaskForm projectId={projectId} taskId={task._id} />)}
      className="group relative cursor-pointer overflow-hidden rounded-[28px] bg-(--card-bg) p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${isDone ? "border-emerald-100 bg-emerald-50 text-emerald-500" : "border-slate-100 bg-slate-50 text-slate-400"}`}>
          {isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </div>

        <div className="flex flex-col items-end">
          {user ? (
            <div className="group/avatar relative flex items-center gap-3 bg-slate-50/80 p-1.5 pr-3 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
              <div className="flex flex-col items-end leading-none">
                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 mb-1">Assigned</span>
                <span className="text-[11px] font-bold text-slate-700">{user.displayName.split(" ")[0]}</span>
              </div>
              <div className="h-9 w-9 overflow-hidden rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-200">
                {user.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-[#7DAEF7] text-[10px] font-black text-white">{user.displayName.substring(0, 2).toUpperCase()}</div>}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Unassigned</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-300 border border-slate-100"><User2 size={14} /></div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <div className="mb-3 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${priority.dot}`} />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Task Management</span>
        </div>
        <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-slate-800 group-hover:text-[#5B8DEF] transition-colors">{task.title}</h3>
        <p className="mt-2 line-clamp-3 min-h-15 text-sm leading-6 text-slate-500">{task.description || "No description provided."}</p>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase ${priority.badge}`}><Flag size={12} />{priority.label}</span>
          <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${isDone ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{isDone ? "Done" : task.status.replace("-", " ")}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50"><CalendarDays size={14} /></div>
            <div className="flex flex-col"><span className="text-[9px] font-medium uppercase text-slate-300">Created</span><span className="text-xs font-semibold text-slate-500">{new Date(task.createdAt).toLocaleDateString("en-GB")}</span></div>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-400 group-hover:bg-blue-50 group-hover:text-[#5B8DEF] transition-all">Details</div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;