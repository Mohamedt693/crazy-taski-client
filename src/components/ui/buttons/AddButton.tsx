// Icons
import { Plus } from "lucide-react";
// Forms
import AddNoteForm from "../../forms/notes/AddNoteFrom";
import AddEventForm from "../../forms/events/AddEventForm";
import AddTaskForm  from "../../forms/tasks/AddTaskForm";
import AddReminderForm from "../../forms/reminders/AddReminderForm";
import AddProjectForm  from "../../forms/projects/AddProjectForm";
import InvitationForm  from "../../forms/invitations/InvitationForm";
// stores & hooks
import { usePermissions } from "../../../utils/hooks/usePermissions";
import { useProjectStore } from "../../../store/useProjectStore";
import { useSidebarStore } from "../../../store/useSidebarStore";

type ButtonType = "note" | "event" | "task" | "reminder" | "project" | "member";

interface AddButtonProps {
  projectId?: string;
  buttonType: ButtonType;
  className?: string;
  text?: string;
}

function AddButton({ projectId, buttonType, className, text }: AddButtonProps) {
  const setContent = useSidebarStore((state) => state.setContent);
  
  const userRole = useProjectStore((state) => state.userRole);
  const getProjectById = useProjectStore((state) => state.getProjectById);
  
  const currentProject = projectId ? getProjectById(projectId) : null;
  
  const permissions = usePermissions(userRole, currentProject?.settings);


  const buttonConfig = {
    member: {
      label: text || "Invite Member",
      component: <InvitationForm projectId={projectId!} />,
      show: permissions.canMemberInvite, 
    },
    note: {
      label: text || "Create Note",
      component: <AddNoteForm projectId={projectId!} />,
      show: permissions.hasAnyWriteAccess, 
    },
    event: {
      label: text || "Add Event",
      component: <AddEventForm projectId={projectId!} />,
      show: permissions.hasAnyWriteAccess,
    },
    task: {
      label: text || "New Task",
      component: <AddTaskForm projectId={projectId!} />,
      show: permissions.hasAnyWriteAccess, 
    },
    reminder: {
      label: text || "Set Reminder",
      component: <AddReminderForm projectId={projectId!} />,
      show: permissions.hasAnyWriteAccess,
    },
    project: {
      label: text,
      component: <AddProjectForm />,
      show: true, 
    },
  };

  const currentConfig = buttonConfig[buttonType];

  if (!currentConfig || !currentConfig.show) return null;

  const defaultClassName = `flex items-center justify-center gap-2 bg-(--addBtn-bg) 
    hover:bg-(--addBtn-bg-hover) text-(--primary-text) px-6 py-3 rounded-2xl font-bold 
    transition-all shadow-md active:scale-95 shrink-0 cursor-pointer`;

  return (
    <button
      onClick={() => setContent(currentConfig.component)}
      className={className || defaultClassName}
    >
      <Plus className="cursor-pointer" size={20} />
      <span>{currentConfig.label}</span>
    </button>
  );
}

export default AddButton;