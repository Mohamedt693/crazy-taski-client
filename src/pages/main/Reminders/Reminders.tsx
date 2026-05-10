import { useEffect} from "react";
import { useParams } from "react-router-dom";

// icons & components
import { Bell } from "lucide-react"; 
import { UpdateProjectForm } from "../../../components/forms/projects/UpdateProjectForm";
import AddButton from "../../../components/ui/buttons/AddButton";
import ReminderCard from "../../../components/ui/cards/ReminderCard";
import Intro from "../../../components/ui/Intro";
import SearchInput from "../../../components/ui/SearchInput";
import Loader from "../../../components/ui/Loader";

// stores & hooks
import { useReminderStore } from "../../../store/useReminderStore"; 
import { useProjectStore } from "../../../store/useProjectStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import useSearch from "../../../utils/hooks/useSearch";


function Reminders() {
  const { id } = useParams();

  const { reminders, getProjectReminders, isLoading } = useReminderStore();
  const setContent = useSidebarStore((state) => state.setContent);
  const { getProjectById } = useProjectStore();

  const currentProject = getProjectById(id!);

  useEffect(() => {
    if (id) {
      getProjectReminders(id);
      setContent(<UpdateProjectForm projectId={id} />);
    }
  }, [id, getProjectReminders, setContent]);

  // reminders filtering logic depends on the current project id and search term
  const projectReminders = id ? reminders[id] || [] : [];
  const { query, setQuery, filteredData } = useSearch(projectReminders, 'title');

  return (
    <div className="flex-1 min-h-screen p-8 overflow-y-auto custom-scrollbar">
      {/* 1. Header  */}
      <header className="mb-10">
        {/* Intro */}
        <Intro 
        title={currentProject?.name ? `${currentProject.name} Reminders` : "Project Reminders"}
        paragraph="Don't miss a beat! Keep track of all your upcoming notifications and deadlines for this project."
        />

        {/* Search & Controls */}
        <div className="w-full mt-8 flex items-center justify-between gap-4">
          <SearchInput value={query} onChange={setQuery} />
          <AddButton 
          projectId={id!}
          buttonType="reminder"
          />
        </div>
      </header>

      {/* 2. Reminders Cards Grid */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filteredData.map((reminder) => (
            <div key={reminder._id}>
              <ReminderCard projectId={id!} reminder={reminder} />
            </div>
          ))}

          {/* Empty State */}
          {filteredData.length === 0 && !isLoading && (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-medium">
                No reminders set for this project yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reminders;
