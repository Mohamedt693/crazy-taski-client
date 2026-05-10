import { Mail } from "lucide-react";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { UpdateMemberForm } from "../../forms/members/UpdateMemberForm";
import { UpdateInvitationForm } from "../../forms/invitations/UpdateInvitationForm";

interface MemberCardProps {
  displayName: string;
  email: string;
  avatar?: string;
  role: string;
  memberId: string;
  projectId: string;
  isEditable?: boolean; 
  type?: "member" | "invitation";  
}

export function MemberCard({
  displayName,
  email,
  avatar,
  role,
  memberId,
  projectId,
  isEditable = true, 
  type = "member"
}: MemberCardProps) {
  const setContent = useSidebarStore((state) => state.setContent);

const handleEdit = () => {
    if (!isEditable) return;

    if (type === "invitation") {
      setContent(
        <UpdateInvitationForm 
          projectId={projectId} 
          invitationId={memberId} 
        />
      );
    } else {
      setContent(
        <UpdateMemberForm 
          projectId={projectId} 
          memberId={memberId} 
          currentRole={role} 
          displayName={displayName} 
        />
      );
    }
  };

  return (
    <div
      onClick={handleEdit}
      className={`bg-(--card-bg) p-6 rounded-3xl border border-black/5 shadow-sm transition-all duration-300 
      relative overflow-hidden group 
      ${isEditable ? "hover:shadow-xl hover:border-blue-200 cursor-pointer" : "cursor-default"}`}
    >
      {/* Background Decor  */}
      {/* {isEditable && (
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
      )} */}

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="relative">
          <img
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=128`
            }
            alt={displayName}
            className={`w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50 transition-all
            ${isEditable ? "group-hover:ring-blue-50" : ""}`}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
        </div>

        <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase bg-slate-100 text-slate-500">
          {role || "Viewer"}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className={`font-black text-slate-800 text-lg transition-colors 
          ${isEditable ? "group-hover:text-blue-600" : ""}`}>
          {displayName}
        </h3>
        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1.5">
          <Mail
            size={14}
            className={isEditable ? "group-hover:text-blue-400 transition-colors" : ""}
          />
          <span className="truncate">{email}</span>
        </div>
      </div>
    </div>
  );
}