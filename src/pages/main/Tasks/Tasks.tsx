import { useEffect} from "react";
import { useParams } from "react-router-dom";

// icons & components
import { UpdateProjectForm } from "../../../components/forms/projects/UpdateProjectForm";
import TaskCard from "../../../components/ui/cards/TaskCard";
import AddButton from "../../../components/ui/buttons/AddButton";
import Loader from "../../../components/ui/Loader";
import Intro from "../../../components/ui/Intro";
import SearchInput from "../../../components/ui/SearchInput";

// stores & hooks
import { useTaskStore } from "../../../store/useTaskStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import useSearch from "../../../utils/hooks/useSearch";


function Tasks() {
  const { id } = useParams();

  const { tasks, getProjectTasks, isLoading } = useTaskStore();
  const setContent = useSidebarStore((state) => state.setContent);
  const { getProjectById } = useProjectStore();

  const currentProject = getProjectById(id!);
  
  
  useEffect(() => {
    if (id) {
      getProjectTasks(id);
      setContent(<UpdateProjectForm projectId={id} />);
    }
  }, [id, getProjectTasks, setContent]);
  
  // task filtering logic depends on the current project id and search term
  const projectTasks = id ? tasks[id] || [] : [];
  const { query, setQuery, filteredData } = useSearch(projectTasks, 'title');


  return (
    <div className="flex-1 min-h-screen p-8 overflow-y-auto custom-scrollbar">
      {/* 1. Header */}
      <header className="mb-10">
        {/* Intro */}
        <Intro 
        title={currentProject?.name || "Project Tasks"}
        paragraph="Welcome back! Here's what's happening with your tasks today. Keep crushing those goals."
        />

        {/* Search & Controls */}
        <div className="w-full mt-8 flex items-center justify-between gap-4">
          <SearchInput value={query} onChange={setQuery} />
          <AddButton 
          projectId={id!}
          buttonType="task"
          />
        </div>
      </header>

      {/* 2. Tasks Cards Grid */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 
        animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filteredData.map((task) => (
            <div key={task._id}>
              <TaskCard projectId={id!} task={task} />
            </div>
          ))}

          {/* Empty State */}
          {filteredData.length === 0 && !isLoading && (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-medium">
                No tasks found matching your search.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Tasks;
