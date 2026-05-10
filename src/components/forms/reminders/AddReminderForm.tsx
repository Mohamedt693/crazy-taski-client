// Icons
import { Bell, Type, Calendar } from "lucide-react";
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reminderSchema, type ReminderFormData } from "../../../schemas/reminder.schema";
// ui components
import SubmitButton from "../../ui/buttons/SubmitButton";
import FormInput from "../../ui/inputs/FormInput";
import FormDateTime  from "../../ui/inputs/FormDateTime";
// helpers
import { formatTextToISO, getDefaultDateTime } from "../../../utils/functions/Date";
// stores & hooks
import { useReminderStore } from "../../../store/useReminderStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useToast } from "../../../utils/hooks/useToast";

interface AddReminderFormProps {
  projectId: string;
}

export default function AddReminderForm({ projectId }: AddReminderFormProps) {
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const addReminder = useReminderStore((state) => state.addReminder);
  const { showPromiseToast } = useToast();

  const defaultDateString = getDefaultDateTime();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      remindAt: defaultDateString,
      status: "pending",
    },
  });

  const onSubmit = async (data: ReminderFormData) => {
    const finalData = {
      ...data,
      remindAt: formatTextToISO(data.remindAt) || new Date().toISOString(),
    };

    const success = await showPromiseToast(
      addReminder(finalData, projectId),
      {
        loading: "Setting your reminder...",
        success: "Reminder set successfully! 🔔",
        error: "Failed to set reminder 😢",
      }
    );

    if (success) {
      clearSidebar();
      reset();
    }
  };

  return (
    <form
      id="add-reminder-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-(--primary-text)"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#5B8DEF]/10 rounded-2xl">
          <Bell size={20} className="text-[#5B8DEF]" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight leading-none">
            New Reminder
          </h3>
          <p className="text-[10px] font-bold mt-1.5 uppercase tracking-widest opacity-60">
            Schedule a notification
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Reminder Title */}
        <FormInput
          label="What should we remind you about?"
          icon={Type}
          register={register("title")}
          error={errors.title?.message}
          placeholder="e.g., Client Meeting, Deadline..."
        />

        {/* Remind At (Date & Time) */}
        <FormDateTime
          label="Date & Time"
          icon={Calendar}
          register={register("remindAt")}
          error={errors.remindAt?.message}
        />
      </div>

      {/* Footer / Submit */}
      <div className="pt-4 border-t border-slate-100/50">
        <SubmitButton 
          isSubmitting={isSubmitting} 
          form="add-reminder-form" 
          text="Set Reminder" 
        />
      </div>
    </form>
  );
}