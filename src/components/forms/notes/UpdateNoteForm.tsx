import { useEffect } from "react";
// Icons
import { Type, AlignLeft, User2, ShieldAlert } from "lucide-react"; 
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, type NoteFormData } from "../../../schemas/note.schema";
// ui components
import SubmitButton from "../../ui/buttons/SubmitButton";
import DeleteButton from "../../ui/buttons/DeleteButton";
import Loader from "../../ui/Loader";
import FormInput from "../../ui/inputs/FormInput";
import FormTextarea from "../../ui/inputs/FormTextarea";
import FormSelect from "../../ui/inputs/FormSelect";
// stores & hooks
import { useMemberStore } from "../../../store/useMemberStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useNoteStore } from "../../../store/useNoteStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { useToast } from "../../../utils/hooks/useToast";
import { useConfirmModal } from "../../../store/useConfirmModal";

interface UpdateNoteFormProps {
  projectId: string;
  noteId: string;
}

export default function UpdateNoteForm({ projectId, noteId }: UpdateNoteFormProps) {
  const { user: currentUser } = useAuthStore();
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const setUserRole = useProjectStore((state) => state.setUserRole);
  const userRole = useProjectStore((state) => state.userRole);
  const getNoteById = useNoteStore((state) => state.getNoteById);
  const updateNote = useNoteStore((state) => state.updateNote);
  const deleteNote = useNoteStore((state) => state.deleteNote);
  const { projectMembers, getProjectMembers } = useMemberStore();
  const { onOpen } = useConfirmModal();
  const { showPromiseToast } = useToast();
  
  const projectData = projectMembers[projectId];
  const owner = projectData?.owner;
  const members = projectData?.list || [];
  const currentNote = getNoteById(projectId, noteId);

  const permissions = usePermissions(userRole);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: currentNote?.title || "",
      content: currentNote?.content || "",
      assignedTo: typeof currentNote?.assignedTo === 'object' 
        ? currentNote.assignedTo?._id 
        : currentNote?.assignedTo || "",
    },
  });

  useEffect(() => {
    if (currentNote && projectId) {
      reset({
        title: currentNote.title,
        content: currentNote.content || "",
        assignedTo: typeof currentNote.assignedTo === 'object' 
          ? currentNote.assignedTo?._id 
          : currentNote.assignedTo || "",
      });

      getProjectMembers(projectId);

      const assigneeId = typeof currentNote.assignedTo === 'object' 
        ? currentNote.assignedTo?._id 
        : currentNote.assignedTo;

      setUserRole(projectId, currentNote.creator._id, assigneeId);
    }
  }, [currentNote, projectId, reset, getProjectMembers, setUserRole]);

  const onSubmit = async (data: NoteFormData) => {
    const formattedData = {
      ...data,
      assignedTo: data.assignedTo === "" ? null : data.assignedTo,
    };

    const success = await showPromiseToast(
      updateNote(projectId, noteId, formattedData),
      {
        loading: "Updating note...",
        success: "Note updated successfully! 🎉",
        error: "Failed to update note",
      }
    );

    if (success) clearSidebar();
  };

  // remove function + confirm modal + toast hook
  const handleNoteDelete = () => {
    onOpen({
      title: "Delete Note",
      description: `Are you sure you want to delete this note? This action cannot be undone.`,
      confirmText: "Delete Note",
      onConfirm: async () => {
        const success = await showPromiseToast(deleteNote(projectId, noteId), {
          loading: "Deleting note...",
          success: "Note deleted!",
          error: "Failed to delete note!",
        });

        if (success) clearSidebar();
      },
    });
  };


  if (!currentNote) return <Loader />;

  return (
    <form
      id="update-note-form"
      className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-(--primary-text)"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black tracking-tight">
            {permissions.isReadOnly ? "Note Details" : "Edit Note"}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Role: {userRole || "Fetching..."}
            </span>
          </div>
        </div>
        {permissions.isReadOnly && (
          <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase flex items-center gap-1">
            <ShieldAlert size={12} /> Read Only
          </span>
        )}
      </div>

      {/* Note Title */}
      <FormInput
        label="Note Title"
        icon={Type}
        register={register("title")}
        error={errors.title?.message}
        disabled={!permissions.canEditEntityDetails}
        placeholder="Enter note title"
      />

      {/* Note Content */}
      <FormTextarea
        label="Content"
        icon={AlignLeft}
        register={register("content")}
        error={errors.content?.message}
        disabled={!permissions.hasAnyWriteAccess}
        rows={5}
        placeholder="Enter note content"
      />

      {/* Controls Container */}
      <div className="bg-(--select-iunput-card-bg) rounded-4xl p-5 space-y-4 border border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-widest px-1">
          Note Controls
        </p>

        {/* Assigned To */}
        <FormSelect
          label="Assign To"
          icon={User2}
          register={register("assignedTo")}
          disabled={!permissions.canEditEntityDetails}
        >
          {owner && (
            <option value={owner._id}>
              {owner._id === currentUser?._id ? "Assign to Me (Owner)" : `${owner.displayName} (Owner)`}
            </option>
          )}
          {members.map((member) => (
            <option key={member.user._id} value={member.user._id}>
              {member.user._id === currentUser?._id ? "Assign to Me" : member.user.displayName}
            </option>
          ))}
        </FormSelect>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {permissions.hasAnyWriteAccess ? (
          <>
            <SubmitButton isSubmitting={isSubmitting} form="update-note-form" text="Update Note" />
            {permissions.canEditEntityDetails && (
              <DeleteButton isSubmitting={isSubmitting} onClick={handleNoteDelete} text="Delete Note" />
            )}
          </>
        ) : (
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-center">
            <p className="text-[10px] text-blue-600 font-medium">Read-only access.</p>
          </div>
        )}
      </div>
    </form>
  );
}