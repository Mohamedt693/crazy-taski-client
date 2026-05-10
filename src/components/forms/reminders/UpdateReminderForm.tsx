import { useEffect } from "react";
// react hook form & zod
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reminderSchema, type ReminderFormData } from "../../../schemas/reminder.schema";
// Icons
import {
    Type,
    CalendarClock,
    CheckCircle2,
    AlertCircle,
    Clock,
    Lock,
    BellRing
} from "lucide-react";
// ui components
import SubmitButton from "../../ui/buttons/SubmitButton";
import DeleteButton from "../../ui/buttons/DeleteButton";
import FormRadioInput from "../../ui/inputs/FormRadioInput";
import FormInput from "../../ui/inputs/FormInput";
import FormDateTime  from "../../ui/inputs/FormDateTime";
import Loader from "../../ui/Loader";
// helpers
import { formateISOToInput, getDefaultDateTime } from "../../../utils/functions/Date";
// stores & hooks
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useReminderStore } from "../../../store/useReminderStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useToast } from "../../../utils/hooks/useToast";
import { useConfirmModal } from "../../../store/useConfirmModal";

interface UpdateReminderFormProps {
    projectId: string;
    reminderId: string;
}

export default function UpdateReminderForm({ projectId, reminderId }: UpdateReminderFormProps) {
    const userRole = useProjectStore((state) => state.userRole);
    const getProjectById = useProjectStore((state) => state.getProjectById);
    const clearSidebar = useSidebarStore((state) => state.clearSidebar);
    const getReminderById = useReminderStore((state) => state.getReminderById);
    const updateReminder = useReminderStore((state) => state.updateReminder);
    const deleteReminder = useReminderStore((state) => state.deleteReminder);
    const { onOpen } = useConfirmModal();
    const { showPromiseToast } = useToast();

    const currentReminder = getReminderById(projectId, reminderId);
    const currentProject = getProjectById(projectId);

    const { canEditEntityDetails } = usePermissions(userRole, currentProject?.settings);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ReminderFormData>({
        resolver: zodResolver(reminderSchema),
        defaultValues: {
            title: currentReminder?.title || "",
            remindAt: currentReminder 
                ? formateISOToInput(currentReminder.remindAt) 
                : getDefaultDateTime(),
            status: currentReminder?.status || "pending",
        },
    });

    const currentStatusValue = useWatch({
        control,
        name: "status",
        defaultValue: "pending",
    });

    useEffect(() => {
        if (currentReminder) {
            reset({
                title: currentReminder.title,
                remindAt: formateISOToInput(currentReminder.remindAt),
                status: currentReminder.status,
            });
        }
    }, [currentReminder, reset]);

    const statusOptions = [
        { value: 'pending', label: 'Pending', icon: Clock, colorClass: 'text-blue-500' },
        { value: 'sent', label: 'Sent', icon: CheckCircle2, colorClass: 'text-emerald-500' },
        { value: 'cancelled', label: 'Cancelled', icon: AlertCircle, colorClass: 'text-red-500' },
    ];

    // delete function + confirm modal + toast hook
    const handleReminderDelete = () => {
        if (!canEditEntityDetails) return;
        onOpen({
            title: "Delete Reminder",
            description: `Are you sure you want to delete this reminder? This action cannot be undone.`,
            confirmText: "Delete Reminder",
            onConfirm: async () => {
                const success = await showPromiseToast(deleteReminder(projectId, reminderId), {
                    loading: "Deleting reminder...",
                    success: "Reminder deleted successfully! 🗑️",
                    error: "Failed to delete reminder!",
                });

                if (success) clearSidebar();
            },
        });
    };


    const onSubmit = async (data: ReminderFormData) => {
        if (!canEditEntityDetails) return;

        const payload = {
            ...data,
            remindAt: new Date(data.remindAt),
        };

        const success = await showPromiseToast(
            updateReminder(projectId, reminderId, payload),
            {
                loading: "Updating reminder...",
                success: "Reminder updated successfully! 🔔",
                error: "An error occurred. Please try again.",
            }
        );

        if (success) clearSidebar();
    };

    if (!currentReminder) return <Loader />;

    return (
        <form
            id="update-reminder-form"
            className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-(--primary-text)"
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-2xl">
                        <BellRing size={20} className="text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">
                            {canEditEntityDetails ? "Edit Reminder" : "Reminder Details"}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                            {canEditEntityDetails ? "Update your notification" : "Read-only view"}
                        </p>
                    </div>
                </div>
                {!canEditEntityDetails && (
                    <div className="bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100 flex items-center gap-1.5 shadow-sm">
                        <Lock size={12} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Locked</span>
                    </div>
                )}
            </div>

            {/* Form Fields Section */}
            <div className="space-y-5">
                <FormInput
                    label="Reminder Title"
                    icon={Type}
                    register={register("title")}
                    error={errors.title?.message}
                    disabled={!canEditEntityDetails}
                    placeholder="What's the reminder for?"
                />

                <FormDateTime
                    label="Schedule At"
                    icon={CalendarClock}
                    register={register("remindAt")}
                    error={errors.remindAt?.message}
                    disabled={!canEditEntityDetails}
                />

                <FormRadioInput
                    label="Current Status"
                    options={statusOptions}
                    register={register("status")}
                    currentValue={currentStatusValue}
                    disabled={!canEditEntityDetails}
                />
            </div>

            {/* Actions Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100/60">
                {canEditEntityDetails ? (
                    <>
                        <SubmitButton 
                            isSubmitting={isSubmitting} 
                            form="update-reminder-form" 
                            text="Save Changes" 
                        />
                        <DeleteButton 
                            isSubmitting={isSubmitting} 
                            onClick={handleReminderDelete} 
                            text="Remove Reminder" 
                        />
                    </>
                ) : (
                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            Modification Restricted
                        </p>
                    </div>
                )}
            </div>
        </form>
    );
}