// Icons
import { CalendarPlus, Type, AlignLeft, Calendar, Clock } from "lucide-react";
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { type EventFormData, eventSchema } from '../../../schemas/event.schema';
// UI Components 
import FormInput from '../../ui/inputs/FormInput';
import FormTextarea from '../../ui/inputs/FormTextarea';
import SubmitButton from '../../ui/buttons/SubmitButton';
// helpers
import { formatTextToISO } from '../../../utils/functions/Date';
// stores & hooks
import { useEventStore } from '../../../store/useEventStore';
import { useSidebarStore } from '../../../store/useSidebarStore';
import { useToast } from '../../../utils/hooks/useToast';
import { useEventDefaultTimes } from '../../../utils/hooks/useEventDefaultTime';

interface AddEventFormProps {
  projectId: string;
  initialStart?: string; 
  initialEnd?: string;   
}

function AddEventForm({projectId, initialStart, initialEnd}: AddEventFormProps) {
  const addEvent = useEventStore((state) => state.addEvent)
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const { showPromiseToast } = useToast();

  const { start, end } = useEventDefaultTimes(initialStart, initialEnd)

  const { 
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      start: start,
      end: end
    }
  });

  const onSubmit = async (data: EventFormData) => {
    const payload = {
      ...data,
      start: formatTextToISO(data.start) || new Date().toISOString(),
      end: formatTextToISO(data.end) || new Date().toISOString(),
    };

    const success = await showPromiseToast(
      addEvent(payload, projectId),
      {
        loading: "Creating your event...",
        success: "Event added to calendar! 📅",
        error: "Failed to create event. Please try again.",
      }
    );

    if (success) {
      clearSidebar();
      reset();
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-800"
      id="add-event-form"
    >
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-indigo-50 rounded-2xl shadow-sm">
          <CalendarPlus size={22} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight leading-none">New Event</h3>
          <p className="text-[10px] font-bold mt-1.5 uppercase tracking-widest opacity-60">
            Schedule a meeting or task
          </p>
        </div>
      </div>

      {/* Main Fields Section */}
      <div className="space-y-5">
        <FormInput
          label="Event Title"
          icon={Type}
          register={register("title")}
          error={errors.title?.message}
          placeholder="e.g. Design Sync"
        />

        <FormTextarea
          label="Event Description"
          icon={AlignLeft}
          register={register("description")}
          error={errors.description?.message}
          placeholder="What's this event about?"
          rows={3}
        />
      </div>

      {/* Date & Time Section */}
      <div className="bg-slate-50/80 rounded-4xl p-5 space-y-4 border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Timeline</p>
        
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label="Starts At"
            type="datetime-local"
            icon={Calendar}
            register={register("start")}
            error={errors.start?.message}
          />

          <FormInput
            label="Ends At"
            type="datetime-local"
            icon={Clock}
            register={register("end")}
            error={errors.end?.message}
          />
        </div>
      </div>

      {/* Actions Section */}
      <div className="pt-4 border-t border-slate-100/50">
        <SubmitButton isSubmitting={isSubmitting} form="add-event-form" text="Add to Calendar" />
      </div>
    </form>
  )
}

export default AddEventForm;