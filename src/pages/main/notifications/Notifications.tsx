import { useEffect } from 'react';
import { BellOff } from 'lucide-react'; 
// ui components
import InvitationCard from '../../../components/ui/cards/InvitationCard';
import AddButton from '../../../components/ui/buttons/AddButton';
import Loader from '../../../components/ui/Loader';
// stores & hook
import { useInvitationStore } from '../../../store/useInvitationStore';
import { useToast } from '../../../utils/hooks/useToast';

export default function Notifications() {
  const { 
    myInvitations, 
    isLoading, 
    getMyInvitations, 
    acceptInvitation, 
    declineInvitation 
  } = useInvitationStore();
  const { showPromiseToast } = useToast();
  

  useEffect(() => {
    getMyInvitations();
  }, [getMyInvitations]);

  const handleAccept = async (id: string) => {
    await showPromiseToast(
      acceptInvitation(id),
      {
        loading: "Joining project...",
        success: "Joined project successfully! 🎉",
        error: "Failed to join project.",
      }
    );
  };

  const handleDecline = async (id: string) => {
    await showPromiseToast(
      declineInvitation(id),
      {
        loading: "Decline project...",
        success: "Invitation declined.",
        error: "Failed to decline project invitation.",
      }
    );
  };

  return (
    <div className="overflow-y-auto custom-scrollbar text-slate-900 font-sans p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl text-(--primary-text) font-black tracking-tight">My Workspace</h1>
            <p className="text-slate-400 text-sm font-medium">Manage your architectural and tech projects</p>
          </div>
          <AddButton 
            buttonType="project" 
            text="New Project" 
          />
        </header>

        {/* --- CONTENT SECTION --- */}
        {isLoading && myInvitations.length === 0 ? (
          <Loader />
        ) : myInvitations.length > 0 ? (
          <section className="animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                Incoming Requests ({myInvitations.length})
              </h2>
            </div>

            <div className="grid gap-4">
              {myInvitations.map((invite) => (
                <InvitationCard 
                  key={invite._id} 
                  invite={invite} 
                  onAccept={handleAccept} 
                  onDecline={handleDecline} 
                />
              ))}
            </div>
          </section>
        ) : (
          /* --- EMPTY STATE --- */
          !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 px-6 rounded-[3rem] animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <BellOff size={32} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">All caught up!</h3>
              <p className="text-slate-400 text-sm font-medium mb-8 text-center max-w-xs">
                No pending invitations or requests. Your workspace is clean and organized.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}