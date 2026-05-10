import { useEffect } from "react";
// icons
import { CheckCircle2, Flag, User2, ShieldAlert, Type, AlignLeft } from "lucide-react"; 
// react hooks from & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../../../schemas/task.schema";
// ui components
import FormInput  from "../../ui/inputs/FormInput";
import FormTextarea  from "../../ui/inputs/FormTextarea";
import FormSelect  from "../../ui/inputs/FormSelect";
import SubmitButton from "../../ui/buttons/SubmitButton";
import DeleteButton from "../../ui/buttons/DeleteButton";
import Loader from "../../ui/Loader";
// stores & hooks
import { useTaskStore } from "../../../store/useTaskStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { useMemberStore } from "../../../store/useMemberStore"; 
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useAuthStore } from "../../../store/useAuthStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { useToast } from "../../../utils/hooks/useToast";
import { useConfirmModal } from "../../../store/useConfirmModal";


interface UpdateTaskFormProps {
  projectId: string;
  taskId: string;
}


export function UpdateTaskForm({ projectId, taskId }: UpdateTaskFormProps) {
  const { user: currentUser } = useAuthStore();
  const setUserRole = useProjectStore((state) => state.setUserRole);
  const userRole = useProjectStore((state) => state.userRole);
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const { projectMembers, getProjectMembers } = useMemberStore();
  const { onOpen } = useConfirmModal();
  const { showPromiseToast } = useToast();

  const projectData = projectMembers[projectId];
  const owner = projectData?.owner;
  const members = projectData?.list || [];
  const currentTask = getTaskById(projectId, taskId);

  const permissions = usePermissions(userRole);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: currentTask?.title || "",
      description: currentTask?.description || "",
      status: currentTask?.status || "todo",
      priority: currentTask?.priority || "medium",
      assignedTo: typeof currentTask?.assignedTo === 'object' 
        ? currentTask.assignedTo?._id 
        : currentTask?.assignedTo || "",
    },
  });

  useEffect(() => {
    if (currentTask && projectId) {
      reset({
        title: currentTask.title,
        description: currentTask.description || "",
        status: currentTask.status,
        priority: currentTask.priority,
        assignedTo: typeof currentTask.assignedTo === 'object' 
          ? currentTask.assignedTo?._id 
          : currentTask.assignedTo || "",
      });

      getProjectMembers(projectId);

      const assigneeId = typeof currentTask.assignedTo === 'object' 
        ? currentTask.assignedTo?._id 
        : currentTask.assignedTo;

      setUserRole(projectId, currentTask.creator._id, assigneeId);
    }
  }, [currentTask, setUserRole, projectId, getProjectMembers, reset]);

  // onSubmit function
  const onSubmit = async (data: TaskFormData) => {
    const formattedData = {
      ...data,
      assignedTo: data.assignedTo === "" ? null : data.assignedTo,
    };

    const success = await showPromiseToast(
      updateTask(projectId, taskId, formattedData),
      {
        loading: "Updating task...",
        success: "Task updated successfully! 🎉",
        error: "Failed to update task",
      }
    );

    if (success) clearSidebar();
  };

  // delete function + confirm modal + toast hook
  const handleTaskDelete = () => {
    onOpen({
      title: "Delete Task",
      description: `Are you sure you want to delete this task? This action cannot be undone.`,
      confirmText: "Delete Task",
      onConfirm: async () => {
        const success = await showPromiseToast(deleteTask(projectId, taskId), {
          loading: "Deleting task...",
          success: "Task deleted!",
          error: "Failed to delete task!",
        });

        if (success) clearSidebar();
      },
    });
  };

  if (!currentTask) return <Loader />;

  return (
    <form
      id="update-task-form"
      className="space-y-6 p-2 animate-in fade-in slide-in-from-right-4 duration-500 text-(--primary-text)"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black tracking-tight">
            {permissions.isReadOnly ? "Task Details" : "Edit Task"}
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

      {/* Title */}
      <FormInput
        label="Task Title"
        icon={Type}
        register={register("title")}
        error={errors.title?.message}
        disabled={!permissions.canEditEntityDetails}
        placeholder="Enter task title"
      />

      {/* Description */}
      <FormTextarea
        label="Description"
        icon={AlignLeft}
        register={register("description")}
        error={errors.description?.message}
        disabled={!permissions.canEditEntityDetails}
        placeholder="Add details..."
        rows={3}
      />

      {/* Controls Container */}
      <div className="bg-(--select-iunput-card-bg) rounded-4xl p-5 space-y-4 border border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-widest px-1">Task Controls</p>

        <div className="space-y-4">

          {/* Status */}
          <FormSelect
            label="Status"
            icon={CheckCircle2}
            register={register("status")}
            disabled={!permissions.canUpdateStatus}
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
            disabled={!permissions.canEditEntityDetails}
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
      </div>

      <div className="space-y-3 pt-2">
        {permissions.hasAnyWriteAccess ? (
          <>
            <SubmitButton isSubmitting={isSubmitting} form="update-task-form" text="Save Changes" />
            {permissions.canEditEntityDetails && (
              <DeleteButton isSubmitting={isSubmitting} onClick={handleTaskDelete} text="Delete Task" />
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