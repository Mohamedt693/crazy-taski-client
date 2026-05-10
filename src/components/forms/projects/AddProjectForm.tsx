// Icons
import { LayoutGrid, AlignLeft, Users, FolderPlus } from "lucide-react";
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ProjectFormData, projectSchema } from "../../../schemas/project.schema";
// Stores & Hooks
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { useToast } from "../../../utils/hooks/useToast";
// UI Components
import SubmitButton from "../../ui/buttons/SubmitButton";
import FormInput from "../../ui/inputs/FormInput";
import FormTextarea from "../../ui/inputs/FormTextarea";
import FormSwitch from "../../ui/inputs/FormSwitch";

function AddProjectForm() {
    const clearSidebar = useSidebarStore((state) => state.clearSidebar);
    const addProject = useProjectStore((state) => state.addProject);
    const getProjects = useProjectStore((state) => state.getProjects);
    const { showPromiseToast } = useToast();

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        reset
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
            settings: { canMembersInvite: false, isPublic: false }
        }
    });

    const onSubmit = async (data: ProjectFormData) => {
        const success = await showPromiseToast(
            (async () => {
                await addProject(data);
                await getProjects();
                return true; 
            })(),
            {
                loading: "Launching project...",
                success: "Project created successfully! 🚀",
                error: "Failed to create project 😢",
            }
        );

        if (success) {
            clearSidebar();
            reset();
        }
    };

    return (
        <form 
        id="add-project-form" 
        className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-800" 
        onSubmit={handleSubmit(onSubmit)}
        >
            {/* Header Section */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-2xl">
                    <FolderPlus size={20} className="text-[#7DAEF7]" />
                </div>
                <div>
                    <h3 className="text-xl text-(--primary-text) font-black tracking-tight leading-none">New Project</h3>
                    <p className="text-[10px] text-(--primary-text) font-bold mt-1.5 uppercase tracking-widest opacity-60">
                        Start a new collaboration
                    </p>
                </div>
            </div>

            {/* Form Fields Section */}
            <div className="space-y-5">
                <FormInput
                label="Project Name"
                icon={LayoutGrid}
                register={register("name")}
                error={errors.name?.message}
                placeholder="e.g. Gym Tracker"
                />

                <FormTextarea
                label="Description"
                icon={AlignLeft}
                register={register("description")}
                error={errors.description?.message}
                placeholder="Optional details..."
                rows={3}
                />
            </div>

            {/* Settings Section */}
            <div className="bg-(--select-iunput-card-bg) rounded-3xl p-5 space-y-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Settings</p>

                <FormSwitch
                label="Members can invite"
                description="Allow team members to add others"
                icon={Users}
                register={register("settings.canMembersInvite")}
                />
            </div>

            {/* Actions Section */}
            <div className="pt-4 border-t border-slate-100/50">
                <SubmitButton isSubmitting={isSubmitting} form="add-project-form" text="Create Project" />
            </div>
        </form>
    );
}

export default AddProjectForm;