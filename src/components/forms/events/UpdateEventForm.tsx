import { useEffect } from "react";
// Icons
import { Type, AlignLeft, Calendar, Clock, Lock, Settings2 } from "lucide-react";
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormData } from "../../../schemas/event.schema";
// UI Components
import FormInput from "../../ui/inputs/FormInput";
import FormTextarea from "../../ui/inputs/FormTextarea";
import SubmitButton from "../../ui/buttons/SubmitButton";
import DeleteButton from "../../ui/buttons/DeleteButton";
import Loader from "../../ui/Loader";
// helpers
import { formateISOToInput, formatTextToISO } from "../../../utils/functions/Date";
// stores & hooks
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useEventStore } from "../../../store/useEventStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useToast } from "../../../utils/hooks/useToast";
import { useConfirmModal } from "../../../store/useConfirmModal";

interface UpdateEventFormProps {
  projectId: string;
  eventId: string;
}

export default function UpdateEventForm({ projectId, eventId }: UpdateEventFormProps) {
    const userRole = useProjectStore((state) => state.userRole);
    const clearSidebar = useSidebarStore((state) => state.clearSidebar);
    const getEventById = useEventStore((state) => state.getEventById);
    const updateEvent = useEventStore((state) => state.updateEvent);
    const deleteEvent = useEventStore((state) => state.deleteEvent);
    const { onOpen } = useConfirmModal();
    const { showPromiseToast } = useToast();

    const currentEvent = getEventById(projectId, eventId);
    const { canEditEntityDetails } = usePermissions(userRole);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: currentEvent?.title || "",
            description: currentEvent?.description || "",
            start: currentEvent ? formateISOToInput(currentEvent.start) : "",
            end: currentEvent ? formateISOToInput(currentEvent.end) : "",
        },
    });

    // Sync form with data if it changes
    useEffect(() => {
        if (currentEvent) {
            reset({
                title: currentEvent.title,
                description: currentEvent.description,
                start: formateISOToInput(currentEvent.start),
                end: formateISOToInput(currentEvent.end),
            });
        }
    }, [currentEvent, reset]);


    // delete function + confirm modal + toast hook
    const handleEventDelete = () => {
        if (!canEditEntityDetails) return;

        onOpen({
            title: "Delete Event",
            description: `Are you sure you want to delete "${currentEvent?.title}"? This action cannot be undone.`,
            confirmText: "Delete Event",
            onConfirm: async () => {
                const success = await showPromiseToast(deleteEvent(projectId, eventId), {
                    loading: "Deleting event...",
                    success: "Event deleted successfully! 🗑️",
                    error: "Failed to delete event!",
                });

                if (success) clearSidebar();
            },
        });
    };

    // submit function
    const onSubmit = async (data: EventFormData) => {
        if (!canEditEntityDetails) return;

        const payload = {
            ...data,
            start: formatTextToISO(data.start) ?? currentEvent?.start.toString(),
            end: formatTextToISO(data.end) ?? currentEvent?.end.toString(),
        };

        const success = await showPromiseToast(updateEvent(projectId, eventId, payload), {
            loading: "Updating your event...",
            success: "Event updated successfully! 📅",
            error: "An error occurred. Please try again.",
        });

        if (success) clearSidebar();
    };

    if (!currentEvent) return <Loader />;

    return (
        <form
        id="update-event-form"
        className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500"
        onSubmit={handleSubmit(onSubmit)}
        >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 rounded-2xl shadow-sm text-slate-500">
                        <Settings2 size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight leading-none text-slate-800">
                            {canEditEntityDetails ? "Event Settings" : "Event Details"}
                        </h3>
                        <p className="text-[10px] font-bold mt-1.5 uppercase tracking-widest opacity-60">
                            {canEditEntityDetails ? "Modify calendar record" : "Viewing protected record"}
                        </p>
                    </div>
                </div>

                {!canEditEntityDetails && (
                    <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-100 flex items-center gap-1.5 shadow-sm">
                        <Lock size={12} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Read Only</span>
                    </div>
                )}
            </div>

            {/* Main Fields Section */}
            <div className="space-y-5">
                <FormInput
                label="Event Title"
                icon={Type}
                register={register("title")}
                error={errors.title?.message}
                disabled={!canEditEntityDetails}
                placeholder="e.g. Design Sync"
                />

                <FormTextarea
                label="Event Description"
                icon={AlignLeft}
                register={register("description")}
                error={errors.description?.message}
                disabled={!canEditEntityDetails}
                placeholder="What's this event about?"
                rows={3}
                />
            </div>

            {/* Date & Time Section (Timeline Card) */}
            <div className="bg-slate-50/80 rounded-4xl p-5 space-y-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Timeline</p>
                
                <div className="grid grid-cols-1 gap-4">
                    <FormInput
                    label="Starts At"
                    type="datetime-local"
                    icon={Calendar}
                    register={register("start")}
                    error={errors.start?.message}
                    disabled={!canEditEntityDetails}
                    />

                    <FormInput
                    label="Ends At"
                    type="datetime-local"
                    icon={Clock}
                    register={register("end")}
                    error={errors.end?.message}
                    disabled={!canEditEntityDetails}
                    />
                </div>
            </div>

            {/* Actions Section */}
            <div className="pt-4 border-t border-slate-100/50 space-y-3">
                {canEditEntityDetails ? (
                    <>
                        <SubmitButton isSubmitting={isSubmitting} form="update-event-form" text="Save Changes" />
                        <DeleteButton isSubmitting={isSubmitting} onClick={handleEventDelete} text="Delete Event" />
                    </>
                ) : (
                    <div className="p-4 bg-slate-100/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center">
                        <p className="text-[10px] text-slate-400 text-center font-bold leading-relaxed uppercase tracking-tight">
                            Modification is disabled for your current role.
                        </p>
                    </div>
                )}
            </div>
        </form>
    );
}