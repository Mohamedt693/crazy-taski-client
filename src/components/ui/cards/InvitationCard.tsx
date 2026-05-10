import { Loader2, X } from "lucide-react";
import { useState } from "react";
import type { Invitation } from "../../../types/invitations.type";


interface InvitationCardProps {
  invite: Invitation;
  onAccept: (id: string) => Promise<boolean | void>;
  onDecline: (id: string) => Promise<boolean | void>;
}

function InvitationCard({ invite, onAccept, onDecline }: InvitationCardProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            await onAccept(invite._id);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDecline = async () => {
        setIsSubmitting(true);
        try {
            await onDecline(invite._id);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="group bg-(--card-bg) p-5 rounded-[2.2rem] flex items-center justify-between hover:border-blue-100 transition-all duration-500">
            <div className="flex items-center gap-5">
                <div className="relative">
                    <img 
                    src={
                        invite.inviter?.avatar 
                        || `https://ui-avatars.com/api/?name=${invite.inviter?.displayName}`
                    } 
                    className="w-14 h-14 rounded-[1.4rem] object-cover ring-4 ring-slate-50 transition-transform group-hover:scale-105"
                    alt={invite.inviter?.displayName}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {invite.role}
                        </span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                        <strong className="text-slate-900 font-bold">
                            {invite.inviter?.displayName}
                        </strong> invited you to
                    </p>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">
                        {invite.project?.name}
                    </h3>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button 
                disabled={isSubmitting}
                onClick={() => handleDecline()}
                className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                >
                    <X size={20} />
                </button>
            
                <button 
                disabled={isSubmitting}
                onClick={() => handleAccept()}
                className="h-12 px-8 bg-slate-900 text-white rounded-[1.2rem] font-bold 
                text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95 
                flex items-center justify-center min-w-30 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Accept"}
                </button>
            </div>
        </div>
    );
}

export default InvitationCard;