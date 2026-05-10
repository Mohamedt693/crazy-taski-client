import { useParams } from "react-router-dom";
import { Clock, UserCheck, Crown } from "lucide-react"; // ضفنا أيقونة التاج
import AddButton from "../../../components/ui/buttons/AddButton";
import { MemberCard } from "../../../components/ui/cards/MemberCard";
import { useSidebarStore } from "../../../store/useSidebarStore";
import { UpdateProjectForm } from "../../../components/forms/projects/UpdateProjectForm";
import { useEffect } from "react";
import { useInvitationStore } from "../../../store/useInvitationStore";
import { useMemberStore } from "../../../store/useMemberStore";
import { useProjectStore } from "../../../store/useProjectStore";

function Members() {
  const { id } = useParams();
  const { setContent } = useSidebarStore();
  const { getProjectById } = useProjectStore();
  const { projectMembers, getProjectMembers } = useMemberStore();
  const { projectInvitations, getProjectInvitations } = useInvitationStore();

  const currentProject = getProjectById(id!);
  const Invitations = id ? projectInvitations[id] || [] : [];
  const MembersList = id ? projectMembers[id]?.list || [] : [];
  const Owner = id ? projectMembers[id]?.owner : null;


  useEffect(() => {
    if (id) {
      getProjectInvitations(id);
      getProjectMembers(id);
      setContent(<UpdateProjectForm projectId={id} />);
    }
  }, [id, getProjectInvitations, getProjectMembers, setContent]);

  return (
    <div className="flex-1 min-h-screen p-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-(--primary-text) tracking-tight">Project Team</h1>
          <p className="text-slate-400 font-medium mt-2">
            Manage your collaborators for <span className="text-blue-500 font-bold">#{currentProject?.name || "Loading..."}</span>
          </p>
        </div>
        <AddButton buttonType="member" projectId={id!} text="Invite Member" />
      </header>

      {/* 0. Project Owner Section */}
      {Owner && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6 px-2">
            <Crown size={18} className="text-amber-500 fill-amber-500/20" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Project Owner</h2>
          </div>
          <div className="max-w-md">
            <MemberCard
              key={Owner._id}
              memberId={Owner._id}
              projectId={id!}
              displayName={Owner.displayName || "Owner"}
              email={Owner.email || ""}
              avatar={Owner.avatar}
              role="owner" 
              isEditable={false} 
            />
          </div>
        </section>
      )}

      <hr className="mb-10 border-slate-100" />

      {/* 1. Active Members */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6 px-2">
          <UserCheck size={18} className="text-blue-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Active Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MembersList.length > 0 ? (
            MembersList.map((m) => (
              <MemberCard
                key={m._id}
                memberId={m.user._id}
                projectId={id!}
                displayName={m.user?.displayName || "Member"}
                email={m.user?.email || ""}
                avatar={m.user?.avatar}
                role={m.role}
              />
            ))
          ) : (
            <p className="text-slate-400 italic px-2 col-span-full">No active members yet.</p>
          )}
        </div>
      </section>

      {/* 2. Pending Invitations */}
      {Invitations.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 px-2">
            <Clock size={18} className="text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Pending Invitations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Invitations.map((inv) => (
              <MemberCard
                key={inv._id}
                memberId={inv._id}
                projectId={id!}
                displayName={inv.invitee.displayName}
                email={inv.invitee.email}
                avatar={inv.invitee.avatar}
                role={inv.role}
                type="invitation"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Members;