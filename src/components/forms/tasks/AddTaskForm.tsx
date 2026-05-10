import { useEffect } from "react";
// Icons 
import { AlignLeft, CheckCircle2, Flag, Type, User2 } from "lucide-react";
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../../../schemas/task.schema";
// stores & hooks
import { useTaskStore } from "../../../store/useTaskStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useMemberStore } from "../../../store/useMemberStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useToast } from "../../../utils/hooks/useToast";
// ui components
import SubmitButton from "../../ui/buttons/SubmitButton";
import FormInput  from "../../ui/inputs/FormInput";
import FormTextarea  from "../../ui/inputs/FormTextarea";
import FormSelect  from "../../ui/inputs/FormSelect";


interface AddTaskFormProps {
  projectId: string;
}

function AddTaskForm({ projectId }: AddTaskFormProps) {
  const { user: currentUser } = useAuthStore();
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const addTask = useTaskStore((state) => state.addTask);
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
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: "", 
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    const formattedData = {
      ...data,
      assignedTo: data.assignedTo === "" ? null : data.assignedTo,
      project: projectId,
    };

    const success = await showPromiseToast(
      addTask(formattedData, projectId),
      {
        loading: "Creating task...",
        success: "Task created successfully! 🎉",
        error: "Failed to create task",
      }
    );

    if (success) {
      clearSidebar();
      reset();
    }
  };

  return (
    <form
      id="add-task-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-(--primary-text)"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-black tracking-tight">
          Create New Task
        </h3>
        <p className="text-[11px] font-medium mt-1 uppercase tracking-wider">
          Add a new task to your project
        </p>
      </div>

      {/* Title */}
      <FormInput
        label="Task Title"
        icon={Type}
        register={register("title")}
        error={errors.title?.message}
        placeholder="What needs to be done?"
      />

      {/* Description */}
      <FormTextarea
        label="Description"
        icon={AlignLeft}
        register={register("description")}
        error={errors.description?.message}
        placeholder="Add more details (optional)..."
        rows={3}
      />


      {/* Controls Container */}
      <div className="bg-(--select-iunput-card-bg) rounded-4xl p-5 space-y-4 border border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-widest px-1">
          Task Configuration
        </p>

        <div className="space-y-4">

          {/* Status */}
          <FormSelect
            label="Status"
            icon={CheckCircle2}
            register={register("status")}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </FormSelect>

         {/* priority */}
          <FormSelect
            label="priority"
            icon={Flag}
            register={register("priority")}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </FormSelect>

         {/* assignedTo */}
          <FormSelect
            label="Assign To"
            icon={User2}
            register={register("assignedTo")}
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
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <SubmitButton isSubmitting={isSubmitting} form="add-task-form" />
      </div>
    </form>
  );
};

export default AddTaskForm;