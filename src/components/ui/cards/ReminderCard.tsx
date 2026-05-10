import React from 'react';
import { Bell, CalendarClock, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useSidebarStore } from "../../../store/useSidebarStore";
import UpdateReminderForm from "../../forms/reminders/UpdateReminderForm";
import type { Reminder } from '../../../types/reminder.type';
import { formatISOToReadableText } from '../../../utils/functions/Date';

interface ReminderCardProps {
  reminder: Reminder;
  projectId: string;
}

type StatusType = 'pending' | 'sent' | 'cancelled';

const statusConfig: Record<StatusType, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  pending: {
    color: "#5B8DEF",
    bg: "bg-blue-50",
    border: "border-blue-100",
    icon: <Clock size={12} />,
    label: "Upcoming"
  },
  sent: {
    color: "#10B981",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: <CheckCircle2 size={12} />,
    label: "Notified"
  },
  cancelled: {
    color: "#EF4444",
    bg: "bg-red-50",
    border: "border-red-100",
    icon: <AlertCircle size={12} />,
    label: "Cancelled"
  }
};

function ReminderCard({ reminder, projectId }: ReminderCardProps) {
  const setContent = useSidebarStore((state) => state.setContent);
  const fullFormattedDate = formatISOToReadableText(reminder.remindAt);
  const [datePart, timePart] = fullFormattedDate.split(', ');
  
  const currentStatus = reminder.status || 'pending';
  const status = statusConfig[currentStatus];

  return (
    <div
      onClick={() => setContent(<UpdateReminderForm projectId={projectId} reminderId={reminder._id} />)}
      className="group relative cursor-pointer overflow-hidden rounded-[28px] bg-(--card-bg) p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
    >
      {/* Top Row */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 transition-all group-hover:bg-opacity-10" style={{ color: status.color, borderColor: 'transparent' }}>
          <Bell size={22} className="group-hover:animate-bounce" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Reminder Schedule</span>
        </div>
        <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-slate-800 transition-colors group-hover:text-[#5B8DEF]">{reminder.title}</h3>
        
        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-slate-50/80 p-3 border border-slate-100">
          <div className="flex flex-col items-start border-r border-slate-200 pr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
            <span className="text-sm font-black text-slate-700">{datePart}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">At Time</span>
            <span className="text-sm font-black text-slate-700">{timePart}</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full border ${status.border} ${status.bg} px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide`} style={{ color: status.color }}>
            {status.icon} {status.label}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
            {reminder.status === 'pending' ? 'Active' : 'Archived'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50"><CalendarClock size={14} /></div>
            <div className="flex flex-col"><span className="text-[10px] font-medium uppercase tracking-wide text-slate-300">Notification</span><span className="text-xs font-semibold text-slate-500">Push/System</span></div>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-400 transition-all group-hover:bg-blue-50 group-hover:text-[#5B8DEF]">Details</div>
        </div>
      </div>
    </div>
  );
}

export default ReminderCard;