import { useEffect } from "react";
// Icons
import { UserCog, ShieldAlert, Lock, ShieldCheck } from "lucide-react";
// ui components
import SubmitButton from "../../ui/buttons/SubmitButton";
import DeleteButton from "../../ui/buttons/DeleteButton";
import FormSelect from "../../ui/inputs/FormSelect";
// react hook form & zod
import { useForm } from "react-hook-form";
import { updateMemberSchema, type UpdateMemberFormData } from "../../../schemas/member.schema";
import { zodResolver } from "@hookform/resolvers/zod";
// stores & hooks
import { useMemberStore } from "../../../store/useMemberStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useToast } from "../../../utils/hooks/useToast";
import { useProjectStore } from "../../../store/useProjectStore";
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useConfirmModal } from "../../../store/useConfirmModal";

interface UpdateMemberFormProps {
  projectId: string;
  memberId: string;
  currentRole: string;
  displayName: string;
}

export function UpdateMemberForm({ 
  projectId, 
  memberId, 
  currentRole, 
  displayName 
}: UpdateMemberFormProps) {
  const setUserRole = useProjectStore((state) => state.setUserRole);
  const userRole = useProjectStore((state) => state.userRole);
  
  const { updateMemberRole, removeMember } = useMemberStore();
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const { onOpen } = useConfirmModal();
  const { showPromiseToast } = useToast();

  const permissions = usePermissions(userRole);

  useEffect(() => {
    setUserRole(projectId);
  }, [projectId, setUserRole]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateMemberFormData>({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      newRole: currentRole as "editor" | "viewer",
    },
  });

  const onSubmit = async (data: UpdateMemberFormData) => {
    if (!permissions.canManageProject) return;

    const success = await showPromiseToast(
      updateMemberRole(projectId, memberId, data.newRole),
      {
        loading: "Updating member...",
        success: "Member permissions updated successfully! ✅",
        error: "An error occurred. Please try again.",
      }
    );

    if (success) clearSidebar();
  };

  // remove function + confirm modal + toast hook
  const handleRemoveMember = () => {
    if (!permissions.canManageProject) return;

    onOpen({
      title: "Removing Member",
      description: `Are you sure you want to remove ${displayName}? This action cannot be undone.`,
      confirmText: "Removing Member",
      onConfirm: async () => {
          const success = await showPromiseToast(removeMember(projectId, memberId), {
            loading: "Removing member...",
            success: "Member removed successfully! 🗑️",
            error: "Failed to remove member!",
          });

          if (success) clearSidebar();
      },
    });
  };


  return (
    <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${permissions.canManageProject ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
          {permissions.canManageProject ? (
            <UserCog size={24} />
          ) : (
            <ShieldAlert size={24} />
          )}
        </div>
        
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl text-(--primary-text) font-bold">
                    {permissions.canManageProject ? "Edit Member Permissions" : "Member Permissions"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    {permissions.canManageProject ? "Adjusting access for" : "Viewing access for"}{" "}
                    <span className="font-semibold text-slate-700">{displayName}</span>
                </p>
            </div>
            {!permissions.canManageProject && (
                <div className="bg-amber-50 text-amber-600 p-1.5 rounded-lg border border-amber-100 shadow-sm">
                    <Lock size={14} />
                </div>
            )}
        </div>
      </div>

      <form 
        id="update-member-form"
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6 flex-1"
      >

          {/* Member Role */}
          <FormSelect
            label="Member Role"
            icon={ShieldCheck}
            register={register("newRole")}
            error={errors.newRole?.message}
            disabled={isSubmitting || !permissions.canManageProject}
          >
            <option value="viewer">Viewer (Read Only)</option>
            <option value="editor">Editor (Edit Access)</option>
          </FormSelect>

        {/* Action Buttons - Only visible to Owner */}
        <div className="space-y-3 pt-4">
          {permissions.canManageProject ? (
            <>
              <SubmitButton isSubmitting={isSubmitting} form="update-member-form" text="Update Permissions" />
              <DeleteButton isSubmitting={isSubmitting} onClick={handleRemoveMember} text="Remove Member" />
            </>
          ) : (
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col items-center gap-3 shadow-sm italic">
              <ShieldAlert className="text-slate-400" size={20} />
              <p className="text-[11px] text-slate-500 text-center font-medium leading-relaxed uppercase tracking-wider">
                Only the <b>Project Owner</b> has the authority to modify roles or remove members. 
                Your current role is <b>{userRole}</b>.
              </p>
            </div>
          )}
        </div>
      </form>

      {/* Footer Info */}
      <div className="mt-auto pt-6 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          {permissions.canManageProject ? "Warning: Removing a member is permanent" : "Read-only access enabled"}
        </p>
      </div>
    </div>
  );
}