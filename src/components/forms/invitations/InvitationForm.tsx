// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {inviteMemberSchema, type InviteMemberFormData,} from "../../../schemas/invitation.schema";
// Icons
import { ShieldAlert, Mail, ShieldCheck } from "lucide-react";
// ui components
import SubmitButton from "../../ui/buttons/SubmitButton";
import FormInput from "../../ui/inputs/FormInput";
import FormSelect from "../../ui/inputs/FormSelect";
// stores & hooks
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useInvitationStore } from "../../../store/useInvitationStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useToast } from "../../../utils/hooks/useToast";



interface InviteMemberFormProps {
  projectId: string;
}

function InvitationForm({ projectId }: InviteMemberFormProps) {
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const inviteMember = useInvitationStore((state) => state.inviteMember);
  const getProjectById = useProjectStore((state) => state.getProjectById);
  const userRole = useProjectStore((state) => state.userRole);
  const { showPromiseToast } = useToast();

  const currentProject = getProjectById(projectId);
  
  const permissions = usePermissions(userRole, currentProject?.settings);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      inviteeEmail: "",
      role: "viewer",
    },
  });

  const onSubmit = async (data: InviteMemberFormData) => {
    const success = await showPromiseToast(
      inviteMember(data, projectId),
      {
        loading: "Sending invitation...",
        success: "Member invited successfully! 📧",
        error: "Failed to send invitation."
      }
    );

    if (success) {
      clearSidebar();
      reset();
    }
  };

  if (!permissions.canMemberInvite) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="p-4 bg-amber-50 rounded-full text-amber-500">
          <ShieldAlert size={40} />
        </div>
        <h3 className="font-black text-(--primary-text)  tracking-tight">Invitations Locked</h3>
        <p className="text-[11px] text-slate-500 leading-relaxed uppercase font-bold tracking-wider">
          Invitations are disabled for your role in this project.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500"
      onSubmit={handleSubmit(onSubmit)}
      id="add-invitation-form"
    >
      <div>
        <h3 className="text-xl font-black text-(--primary-text)  tracking-tight">
          Invite Member
        </h3>
        <div className="flex flex-col gap-1 mt-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Project: {currentProject?.name}
          </p>
          <span className="text-[9px] bg-blue-50 text-blue-500 w-fit px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
            Your Role: {userRole}
          </span>
        </div>
      </div>

      {/* Email Address */}
      <FormInput
        label="Email Address"
        icon={Mail}
        register={register("inviteeEmail")}
        error={errors.inviteeEmail?.message}
        placeholder="colleague@example.com"
        id="inviteeEmail"
        autoComplete="email"
        type="email"
      />

      <div className="bg-(--select-iunput-card-bg) rounded-4xl p-5 space-y-4 border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
          Access Permissions
        </p>

          {/* Member Role */}
          <FormSelect
            label="Member Role"
            icon={ShieldCheck}
            register={register("role")}
            error={errors.role?.message}
          >
            <option value="viewer">Viewer (Read Only)</option>
            <option value="editor">Editor (Edit Access)</option>
          </FormSelect>

      </div>

      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
        <p className="text-[10px] text-blue-600 leading-relaxed italic">
          <b>Pro Tip:</b> Invitations help you scale your project. 
          Editors can help you manage tasks, while Viewers can only monitor progress.
        </p>
      </div>

      <SubmitButton isSubmitting={isSubmitting} form="add-invitation-form" text="Send Invitation" />
    </form>
  );
};

export default InvitationForm;