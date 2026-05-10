import { useEffect } from "react";
import { useParams } from "react-router-dom";

// icons & components
import { UpdateProjectForm } from "../../../components/forms/projects/UpdateProjectForm";
import AddButton from "../../../components/ui/buttons/AddButton";
import NoteCard from "../../../components/ui/cards/NoteCard";
import Loader from "../../../components/ui/Loader";
import Intro from "../../../components/ui/Intro";
import SearchInput from "../../../components/ui/SearchInput";

// stores & hooks
import { useNoteStore } from "../../../store/useNoteStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { useSidebarStore } from "../../../store/useSidebarStore";
import useSearch from "../../../utils/hooks/useSearch";


function Notes() {
  const { id } = useParams();

  const { notes, getProjectNotes, isLoading } = useNoteStore();
  const setContent = useSidebarStore((state) => state.setContent);
  const { getProjectById } = useProjectStore();

  const currentProject = getProjectById(id!);

  useEffect(() => {
    if (id) {
      getProjectNotes(id);
      setContent(<UpdateProjectForm projectId={id} />);
    }
  }, [id, getProjectNotes, setContent]);

  // note filtering logic depends on the current project id and search term
  const projectNotes = id ? notes[id] || [] : [];
  const { query, setQuery, filteredData } = useSearch(projectNotes, 'title');


  return (
    <div className="flex-1 min-h-screen p-8 overflow-y-auto custom-scrollbar">
      {/* Header  */}
      <header className="mb-10">
        {/* Intro */}
        <Intro 
        title={currentProject?.name || "Project Notes"}
        paragraph="Welcome back! Here's what's happening with your Notes today. Keep crushing those goals."
        />

        {/* Search & Controls */}
        <div className="w-full mt-8 flex items-center justify-between gap-4">
          <SearchInput value={query} onChange={setQuery} />
          <AddButton 
          projectId={id!}
          buttonType="note"
          />
        </div>
      </header>

      {/* 3. Notes Cards Grid */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 
        animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filteredData.map((note) => (
            <div key={note._id}>
              <NoteCard projectId={id!} note={note} />
            </div>
          ))}

          {/* Empty State */}
          {filteredData.length === 0 && !isLoading && (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-medium">
                No notes found matching your search.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notes;
