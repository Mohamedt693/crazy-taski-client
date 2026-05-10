// Icons
import { Mail, Clock, AlertCircle, ShieldAlert } from "lucide-react";
// ui components
import SubmitButton from "../../ui/buttons/SubmitButton";
// stores & hooks
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useInvitationStore } from "../../../store/useInvitationStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useToast } from "../../../utils/hooks/useToast";
import { useConfirmModal } from "../../../store/useConfirmModal";

interface UpdateInvitationFormProps {
  projectId: string;
  invitationId: string;
}

export function UpdateInvitationForm({
  projectId,
  invitationId,
}: UpdateInvitationFormProps) {
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const cancelInvitation = useInvitationStore((state) => state.cancelInvitation);
  const isLoading = useInvitationStore((state) => state.isLoading);
  const { onOpen } = useConfirmModal();
  const { showPromiseToast } = useToast();

  const getProjectById = useProjectStore((state) => state.getProjectById);
  const userRole = useProjectStore((state) => state.userRole);
  const currentProject = getProjectById(projectId);
  
  const invitations = useInvitationStore((state) => state.projectInvitations[projectId] || []);
  const currentInvitation = invitations.find((inv) => inv._id === invitationId);


  const permissions = usePermissions(userRole, currentProject?.settings);


  // cancel function + confirm modal + toast hook
  const handleCancel = () => {
    onOpen({
      title: "Cancel Invitation",
      description: `Are you sure you want to cancel this invitation? This action cannot be undone.`,
      confirmText: "Cancel Invitation",
      onConfirm: async () => {
        const success = await showPromiseToast(cancelInvitation(projectId, invitationId), {
          loading: "Revoking invitation access...",
          success: "Invitation revoked successfully!",
          error: "Failed to revoke invitation. Please try again."
        });

        if (success) clearSidebar();
      },
    });
  };

  if (!currentInvitation) {
    return (
      <div className="p-10 text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="text-slate-300" size={48} />
        </div>
        <p className="text-slate-400 font-medium">Invitation not found or already processed.</p>
        <button onClick={clearSidebar} className="text-blue-500 text-sm font-bold uppercase tracking-widest">
          Close
        </button>
      </div>
    );
  }

  if (!permissions.canMemberInvite) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="p-4 bg-amber-50 rounded-full text-amber-500">
          <ShieldAlert size={40} />
        </div>
        <h3 className="font-black text-slate-800 tracking-tight italic">Access Denied</h3>
        <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-bold tracking-wider">
          You don't have the required permissions to manage invitations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black text-(--primary-text) tracking-tight italic">
            Manage Invitation
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Project ID: {projectId.slice(-6)}
            </span>
          </div>
        </div>
        <span className="text-[9px] bg-blue-50 text-blue-500 px-2 py-1 rounded font-bold uppercase tracking-tighter">
          Role: {userRole}
        </span>
      </div>

      {/* Info Card */}
      <div className="bg-(--select-iunput-card-bg) rounded-3xl p-5 space-y-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 border border-blue-50">
            <Mail size={22} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Sent to
            </p>
            <p className="text-sm font-bold text-slate-700 truncate">
              {currentInvitation.invitee.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500 border border-amber-50">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Assigned Role
            </p>
            <p className="text-sm font-bold text-slate-700 capitalize">
              {currentInvitation.role}
            </p>
          </div>
        </div>
      </div>

      {/* Warning Section */}
      <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
        <div className="flex gap-2 text-red-600 mb-1">
          <AlertCircle size={14} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Warning</span>
        </div>
        <p className="text-[11px] text-red-600/80 font-medium leading-relaxed">
          Revoking this invitation will immediately disable the link sent to the recipient. This action cannot be undone.
        </p>
      </div>

      <div className="pt-2">
        {/* Submit Button (Only shown/enabled if they can invite) */}
        <SubmitButton isSubmitting={isLoading} onClick={handleCancel} text="cancel Invitation"/>
      </div>
    </div>
  );
}