import { useEffect } from "react";
// Icons
import { Users, LogOut, Lock, LayoutGrid, AlignLeft, ShieldCheck } from "lucide-react";
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ProjectFormData, projectSchema } from "../../../schemas/project.schema";
// react router
import { useNavigate } from "react-router-dom";
// UI Components 
import FormInput from "../../ui/inputs/FormInput";
import FormTextarea from "../../ui/inputs/FormTextarea";
import FormSwitch from "../../ui/inputs/FormSwitch";
import SubmitButton from "../../ui/buttons/SubmitButton";
import DeleteButton from "../../ui/buttons/DeleteButton";
import Loader from "../../ui/Loader";
// Stores & Hooks
import { useProjectStore } from "../../../store/useProjectStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useMemberStore } from "../../../store/useMemberStore";
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useToast } from "../../../utils/hooks/useToast";
import { useConfirmModal } from "../../../store/useConfirmModal";


export function UpdateProjectForm({ projectId }: { projectId: string }) {
    const navigate = useNavigate();
    const { userRole, setUserRole, getProjectById, updateProject, deleteProject } = useProjectStore();
    const leaveProject = useMemberStore((state) => state.leaveProject);
    const setContent = useSidebarStore((state) => state.setContent);
    const { onOpen } = useConfirmModal();
    const { showPromiseToast } = useToast();

    const currentProject = getProjectById(projectId);
    const permissions = usePermissions(userRole);

    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { isSubmitting, errors } 
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: currentProject?.name || "",
            description: currentProject?.description || "",
            settings: { 
                canMembersInvite: currentProject?.settings?.canMembersInvite || false, 
            }
        }
    });

    useEffect(() => {
        if (currentProject) {
            reset({
                name: currentProject.name,
                description: currentProject.description,
                settings: currentProject.settings
            });
            setUserRole(projectId);
        }
    }, [currentProject, reset, projectId, setUserRole]);

    const onSubmit = async (data: ProjectFormData) => {
        const success = await showPromiseToast(updateProject(projectId, data), {
            loading: "Updating project settings...",
            success: "Project updated successfully! 🎉",
            error: "Failed to update project",
        });
        if (success) setContent(null);
    };

    // delete function + confirm modal + toast hook
    const handleProjectDelete = () => {
        onOpen({
            title: "Delete Project",
            description: `Are you sure you want to delete this project? This action cannot be undone.`,
            confirmText: "Delete Project",
            onConfirm: async () => {
                const success = await showPromiseToast(deleteProject(projectId), {
                    loading: "Deleting project...",
                    success: "Project deleted successfully!",
                    error: "Failed to delete project",
                });

                if(success) {
                    setContent(null);
                    navigate("/", { replace: true });
                }
            },
        });
    };

    // leave function + confirm modal + toast hook
    const handleLeaveProject = () => {
        onOpen({
            title: "Leave Project",
            description: `Are you sure you want to Leave this project? This action cannot be undone.`,
            confirmText: "Leave Project",
            onConfirm: async () => {
                const success = await showPromiseToast(leaveProject(projectId), {
                    loading: "Leaving project...",
                    success: "Left project successfully!",
                    error: "Failed to leave project",
                });

                if(success) {
                    setContent(null);
                    navigate("/", { replace: true });
                }
            },
        });
    };


    if (!currentProject) return <Loader />;

    return (
        <form 
            id="update-project-form" 
            className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-800" 
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-xl text-(--primary-text) font-black tracking-tight leading-none">
                        {permissions.canManageProject ? "Project Settings" : "Project Details"}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-[#7DAEF7] rounded-md border border-blue-100">
                            <ShieldCheck size={10} />
                            <span className="text-[9px] font-black uppercase tracking-wider">
                                {userRole || "Member"}
                            </span>
                        </div>
                    </div>
                </div>
                
                {!permissions.canManageProject && (
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2.5 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                        <Lock size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">View Only</span>
                    </div>
                )}
            </div>

            {/* Form Fields Section */}
            <div className="space-y-5">
                <FormInput
                    label="Project Name"
                    icon={LayoutGrid}
                    register={register("name")}
                    error={errors.name?.message}
                    disabled={!permissions.canManageProject}
                    placeholder="Project name"
                />

                <FormTextarea
                    label="Description"
                    icon={AlignLeft}
                    register={register("description")}
                    error={errors.description?.message}
                    disabled={!permissions.canManageProject}
                    placeholder="Project description..."
                    rows={3}
                />
            </div>

            {/* Configuration Section */}
            <div className="bg-(--select-iunput-card-bg) rounded-4xl p-5 space-y-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Settings</p>
                
                <FormSwitch
                    label="Members can invite"
                    description="Allow collaborators to add others"
                    icon={Users}
                    register={register("settings.canMembersInvite")}
                    disabled={!permissions.canManageProject}
                />
            </div>

            {/* Actions Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100/60">
                {permissions.canManageProject && (
                    <>
                        <SubmitButton isSubmitting={isSubmitting} form="update-project-form" text="Save Changes" />
                        <DeleteButton isSubmitting={isSubmitting} onClick={handleProjectDelete} text="Delete Project" />
                    </>
                )}

                {userRole !== "owner" && (
                    <button
                        type="button"
                        onClick={handleLeaveProject}
                        className="w-full flex items-center justify-center gap-2 bg-red-50/50 text-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-100/50 group"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Leave Project
                    </button>
                )}
            </div>
        </form>
    );
}