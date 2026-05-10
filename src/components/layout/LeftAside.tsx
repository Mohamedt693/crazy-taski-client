import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import type { Project } from "../../types/project.type";

// Icons
import {
  House,
  FolderKanban,
  CalendarDays,
  Users,
  Sparkles,
  ListTodo,
  BellRing,
  NotebookPen,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  BookOpen
} from "lucide-react";

// components - ui
import LogoutBtn from "../ui/buttons/LogoutBtn";
import AddButton from "../ui/buttons/AddButton";
import NotificationsButton from "../ui/buttons/NotificationsButton";
import Loader from "../ui/Loader";

// stores
import { useProjectStore } from "../../store/useProjectStore";
import { useSidebarStore } from "../../store/useSidebarStore";
import { UpdateProjectForm } from "../forms/projects/UpdateProjectForm";

function LeftAside() {
  const { id } = useParams();
  const [isExpanded, setisExpanded] = useState(true);
  const { projects, getProjects, isLoading } = useProjectStore();
  const setContent = useSidebarStore((state) => state.setContent);
  const clearSidebar = useSidebarStore((state) => state.clearSidebar);
  
  const { ownedProjects, joinedProjects } = projects;

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  const workspaceViews = [
    { name: "Tasks", path: `/projects/${id}/tasks`, icon: ListTodo },
    { name: "Notes", path: `/projects/${id}/notes`, icon: NotebookPen },
    { name: "Reminders", path: `/projects/${id}/reminders`, icon: BellRing },
    { name: "Calendar", path: `/projects/${id}/events`, icon: CalendarDays },
    { name: "Members", path: `/projects/${id}/members`, icon: Users },
    { name: "Sparkles", path: `/projects/${id}/sparkles`, icon: Sparkles },
  ];

  const expandedWidth = "w-[230px]";
  const collapsedWidth = "w-[70px]";
  const dynamicTotalWidth = id
    ? "w-[300px]"
    : isExpanded
      ? "w-[230px]"
      : "w-[70px]";

  return (
    <aside
      className={`hidden lg:flex border-r border-black/5 bg-(--primary-color) h-screen 
        sticky top-0 shrink-0 transition-all duration-500 ease-in-out ${dynamicTotalWidth}`}
    >
      {/* Home & Projects */}
      <div
        className={`flex flex-col py-6 transition-all duration-300 ${id ? "border-r border-black/10 " : ""} 
        ${isExpanded ? expandedWidth : collapsedWidth}`}
      >
        {/* 1. Home Button */}
        <div className="px-3 mb-3 shrink-0">
          <NavLink
            to="/"
            title="Home"
            onClick={() => clearSidebar()}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-(--list-item-active) shadow-sm text-(--primary-text)"
                  : "text-(--secondry-text) hover:bg-(--list-item-hover)"
              } ${isExpanded ? "px-3 py-2.5" : "h-12 w-12 justify-center mx-auto"}`
            }
          >
            <House size={18} className="shrink-0" />
            {isExpanded && <span className="font-medium text-sm">Home</span>}
          </NavLink>
        </div>

        {/* 2. Divider */}
        {isExpanded ? (
          <div className="px-6 mb-6 shrink-0">
            <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />
          </div>
        ) : (
          <div className="flex justify-center mb-6 shrink-0">
            <div className="h-px w-6 bg-black/10" />
          </div>
        )}

        {/* 3. Projects Section */}
        <div className="flex flex-col px-3 overflow-y-auto custom-scrollbar flex-1 min-h-0 pr-1">
          {isLoading ? (
            <Loader />
          ) : isExpanded ? (
            <>
              <ProjectList
                list={ownedProjects}
                title="My Projects"
                showAdd={true}
                setContent={setContent}
              />

              {joinedProjects.length > 0 && (
                <ProjectList
                  list={joinedProjects}
                  title="Shared with me"
                  setContent={setContent}
                />
              )}
            </>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setisExpanded(true)}
                className="p-3 rounded-2xl bg-white/50 text-(--secondary-text) hover:bg-white transition-all shadow-sm"
              >
                <FolderKanban size={22} />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div
          className={`flex text-(--secondary-text) transition-all duration-300 pb-4 shrink-0 mt-auto
            ${isExpanded ? "flex-row justify-center gap-3 px-4" : "flex-col items-center gap-4"}`}
        >
          <NotificationsButton />
          <a href="/documentations" className="flex h-10 w-10 items-center justify-center rounded-2xl transition hover:bg-slate-100">
            <BookOpen size={18} className="text-slate-600"/>
          </a>
          <LogoutBtn />
        </div>
      </div>

      {id && (
        <>
          {/* switch button */}
          <div className="relative w-0 z-50">
            <button
              onClick={() => setisExpanded(!isExpanded)}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white 
              border border-black/15 rounded-2xl flex items-center justify-center shadow-md hover:scale-110 transition-all"
            >
              <ArrowLeft
                size={12}
                className={`transition-transform duration-500 text-(--secondary-text) ${!isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Workspace Views */}
          <div
            className={`flex flex-col py-6 transition-all duration-300 bg-black/2 ${!isExpanded ? expandedWidth : collapsedWidth}`}
          >
            <div className="flex flex-col gap-2 px-3">
              {workspaceViews.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    title={link.name}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2.5 rounded-xl transition-all 
                    ${
                      isActive
                        ? "bg-(--list-item-active) shadow-sm text-(--primary-text)"
                        : "text-(--secondry-text) hover:bg-(--list-item-hover)"
                    } 
                    ${isExpanded ? "justify-center" : ""}`
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    {!isExpanded && (
                      <span className="font-medium text-sm truncate">
                        {link.name}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

export default LeftAside;




const ProjectList = ({
  list,
  title,
  showAdd = false,
  setContent,
}: {
  list: Project[];
  title: string;
  showAdd?: boolean;
  setContent: (content: React.ReactNode) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4 shrink-0 overflow-hidden">
      <div
        className="w-full flex items-center justify-between px-2 mb-2 cursor-pointer group overflow-hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-(--primary-text) shrink-0">
            {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
          

          <div className="w-37.5 shrink-0"> 
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-(--primary-text) select-none whitespace-nowrap overflow-hidden text-ellipsis">
              {title} ({list.length})
            </h3>
          </div>
        </div>

        {showAdd && (
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <AddButton
              buttonType="project"
              text=""
              className="text-[10px] font-bold uppercase text-[#7DAEF7]"
            />
          </div>
        )}
      </div>

      <nav
        className={`flex flex-col gap-1.5 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {list.map((project) => (
          <NavLink
            key={project._id}
            to={`/projects/${project._id}`}
            onClick={() => setContent(<UpdateProjectForm projectId={project._id} />)}

            className={({ isActive }) => `
              flex items-center gap-3 p-2.5 rounded-xl transition-all overflow-hidden
              ${
                isActive
                  ? "bg-(--list-item-active) shadow-sm text-(--primary-text)"
                  : "text-(--secondry-text) hover:bg-(--list-item-hover)"
              }
            `}
          >

            <div className={`
              w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0
              bg-(--list-item-active)/20 text-(--secondary-text)
            `}>
              {project.name.charAt(0)}
            </div>
    
            <div className="w-37.5 shrink-0">
              <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block">
                {project.name}
              </span>
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};