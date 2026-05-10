import { useEffect } from "react";
// Icons
import { Type, AlignLeft, User2 } from "lucide-react";
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, type NoteFormData } from "../../../schemas/note.schema";
// stores & hooks
import { useNoteStore } from "../../../store/useNoteStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useMemberStore } from "../../../store/useMemberStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useToast } from "../../../utils/hooks/useToast";
// ui components
import SubmitButton from "../../ui/buttons/SubmitButton";
import FormInput from "../../ui/inputs/FormInput";
import FormTextarea from "../../ui/inputs/FormTextarea";
import FormSelect from "../../ui/inputs/FormSelect";

interface AddNoteFormProps {
  projectId: string;
}

export default function AddNoteForm({ projectId }: AddNoteFormProps) {
  const { user: currentUser } = useAuthStore();
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const addNote = useNoteStore((state) => state.addNote);
  const { projectMembers, getProjectMembers } = useMemberStore();
  const { showPromiseToast } = useToast();

  const projectData = projectMembers[projectId];
  const owner = projectData?.owner;
  const members = projectData?.list || [];

  useEffect(() => {
    if (projectId) {
      getProjectMembers(projectId);
    }
  }, [projectId, getProjectMembers]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      assignedTo: "",
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    const success = await showPromiseToast(
      addNote(data, projectId),
      {
        loading: "Creating note...",
        success: "Note created successfully! 📝",
        error: "Failed to create note",
      }
    );

    if (success) {
      clearSidebar();
      reset();
    }
  };

  return (
    <form
      id="add-note-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-(--primary-text)"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-black tracking-tight">
          New Note
        </h3>
        <p className="text-[11px] font-medium mt-1 uppercase tracking-wider">
          Add a note to your project
        </p>
      </div>

      {/* Note Title */}
      <FormInput
        label="Title"
        icon={Type}
        register={register("title")}
        error={errors.title?.message}
        placeholder="Note title..."
      />

      {/* Note Content */}
      <FormTextarea
        label="Content"
        icon={AlignLeft}
        register={register("content")}
        error={errors.content?.message}
        placeholder="Write your note..."
        rows={4}
      />

      {/* Controls Container */}
      <div className="bg-(--select-iunput-card-bg) rounded-4xl p-5 space-y-4 border border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-widest px-1">
          Note Settings
        </p>

        {/* Assigned To */}
        <FormSelect
          label="Assign To (Optional)"
          icon={User2}
          register={register("assignedTo")}
          error={errors.assignedTo?.message}
        >
          <option value="">Unassigned</option>
          {owner && (
            <option value={owner._id}>
              {owner._id === currentUser?._id
                ? "Assign to Me (Owner)"
                : `${owner.displayName} (Owner)`}
            </option>
          )}
          {members.map((member) => {
            const isMe = member.user._id === currentUser?._id;
            if (isMe && owner?._id === currentUser?._id) return null;
            return (
              <option key={member.user._id} value={member.user._id}>
                {isMe ? "Assign to Me (Member)" : member.user.displayName}
              </option>
            );
          })}
        </FormSelect>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <SubmitButton isSubmitting={isSubmitting} form="add-note-form" />
      </div>
    </form>
  );
}