
import { useInvitationStore } from '../../../store/useInvitationStore';
import { Bell } from 'lucide-react';

function NotificationsButton() {
  const { myInvitations } = useInvitationStore();
  const totalInvitations = myInvitations.length;

  return (
    <a 
    href="/notifications" 
    className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors">
      <Bell size={20} className="text-slate-600" />
      
      {totalInvitations > 0 && (
        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          
          <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center border-2 border-white">
            {totalInvitations > 9 ? "+9" : totalInvitations}
          </span>
        </span>
      )}
    </a>
  )
}

export default NotificationsButton
