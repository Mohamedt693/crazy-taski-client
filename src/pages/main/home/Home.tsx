import { useEffect } from "react";
import AddButton from "../../../components/ui/buttons/AddButton";
import { useDashboardStore } from "../../../store/useDashboardStore";
import Loader from "../../../components/ui/Loader";

function Home() {
  const { data, fetchDashboardData, isLoading } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Loading State
  if (isLoading) return <Loader />


  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-6 md:px-10 py-6">
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-(--primary-text)">
              Workspace Overview
            </h1>
            <p className="mt-2 text-base text-slate-500">
              Track tasks, projects, reminders, notes, and your team in one calm place.
            </p>
          </div>
          <AddButton buttonType="project" text="New Project" />
        </div>

        {/* Stats Section - Dynamic */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mt-6">
          {data?.stats.map((item) => (
            <div
              key={item.title}
              className={`${item.color} bg-(--card-bg) rounded-3xl p-6 text-(--primary-text) shadow-sm transition hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <h3 className="mt-3 text-3xl font-bold">{item.value}</h3>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white/40"></div>
              </div>
              <p className="mt-6 text-sm">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-3 mt-6">
          
          {/* Left Column (Focus & Projects) */}
          <div className="space-y-6 xl:col-span-2">
            
            {/* Today's Focus */}
            <div className="rounded-3xl bg-(--card-bg) p-8 shadow-sm text-(--primary-text)">
              <h2 className="text-2xl font-semibold">Today’s Priority</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                {data?.focusTasks?.length ? (
                  data.focusTasks.map((task) => (
                    <div key={task._id} className="rounded-2xl bg-[#F8FAFC] p-6 border border-transparent hover:border-slate-200 transition">
                      <p className="text-xs font-medium text-slate-400">Task</p>
                      <h3 className="mt-2 font-semibold text-slate-800 line-clamp-2">{task.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 capitalize">{task.priority || 'Normal'} Priority</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-4 text-center text-slate-400 text-sm italic">No priority tasks today</div>
                )}
              </div>
            </div>

            {/* Recent Projects */}
            <div className="rounded-3xl bg-(--card-bg) p-8 shadow-sm text-(--primary-text)">
              <h2 className="text-2xl font-semibold">Recent Projects</h2>
              <div className="mt-6 space-y-4">
                {data?.recentProjects.map((project) => (
                  <div key={project._id} className="rounded-2xl border border-transparent hover:border-slate-100 bg-[#FCFCFD] p-5 transition">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">{project.name}</h3>
                        <p className="text-sm text-slate-500">{project.tasksCount} tasks</p>
                      </div>
                      <div className="w-full md:w-48">
                        <div className="mb-2 flex justify-between text-xs text-slate-500">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full bg-slate-900 transition-all duration-700" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Reminders & Notes) */}
          <div className="space-y-6">
            
            {/* Agenda / Reminders Section - UPDATED */}
            <div className="rounded-3xl bg-(--card-bg) p-6 shadow-sm text-(--primary-text)">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold">Upcoming Agenda</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pending</span>
              </div>
              <div className="space-y-4">
                {data?.reminders && data.reminders.length > 0 ? (
                  data.reminders.map((reminder) => (
                    <div key={reminder._id} className="flex items-start gap-3 rounded-2xl bg-[#F8FAFC] p-3 border border-transparent hover:border-slate-100 transition">
                      <div className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm whitespace-nowrap">
                        {new Date(reminder.remindAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 line-clamp-2">{reminder.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(reminder.remindAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs italic">No upcoming reminders</div>
                )}
              </div>
            </div>

            {/* Quick Notes */}
            <div className="rounded-3xl bg-(--card-bg) p-6 shadow-sm text-(--primary-text)">
              <h2 className="text-xl font-semibold mb-5">Quick Capture</h2>
              <div className="space-y-3">
                {data?.quickNotes.map((note) => (
                  <div key={note._id} className="rounded-2xl bg-[#F8FAFC] p-4 text-sm text-slate-600 hover:bg-[#f1f5f9] transition cursor-default">
                    {note.content}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;