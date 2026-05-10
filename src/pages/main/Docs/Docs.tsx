import { 
  Book, 
  ChevronRight, 
  Layers, 
  CheckCircle2,
  ShieldCheck,
  Terminal,
  StickyNote,
  Bell,
  Calendar
} from "lucide-react";

export default function Docs() {
  const sections = [
    { id: "intro", title: "Introduction", icon: <Book size={18} /> },
    { id: "projects", title: "Project Structure", icon: <Layers size={18} /> },
    { id: "roles", title: "Roles & Permissions", icon: <ShieldCheck size={18} /> },
    { id: "tasks", title: "Task Management", icon: <CheckCircle2 size={18} /> },
    { id: "notes", title: "Smart Notes", icon: <StickyNote size={18} /> },
    { id: "reminders", title: "Reminders", icon: <Bell size={18} /> },
    { id: "events", title: "Timeline Events", icon: <Calendar size={18} /> },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 selection:bg-[#7DAEF7]/30">
      
      {/* Sidebar */}
      <aside className="w-72 sticky top-0 h-screen border-r border-slate-50 p-8 hidden lg:flex flex-col">
        <div className="mt-20 flex flex-col flex-1 overflow-hidden">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 ml-3">Contents</p>
          <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {sections.map((s) => (
              <a 
                key={s.id} 
                href={`#${s.id}`} 
                onClick={(e) => handleScroll(e, s.id)} 
                className="flex items-center justify-between group px-3 py-3 rounded-xl hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 group-hover:text-[#7DAEF7]">{s.icon}</span>
                  <span className="text-sm font-bold">{s.title}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300" />
              </a>
            ))}
          </nav>
          
          <div className="pt-6 mt-auto border-t border-slate-50">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-black text-[10px]">CT</div>
               <span className="font-black tracking-tighter text-sm uppercase">Crazy Taski</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Documentation v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-8 lg:px-24 py-20 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          
          {/* Section: Intro */}
          <section id="intro" className="mb-32 scroll-mt-24">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-8">Introduction</h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Crazy Taski is a high-end productivity engine built for those who value speed, minimalism, and architectural precision in their workflow.
            </p>
          </section>

          {/* Section: Project Structure */}
          <section id="projects" className="mb-32 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6 text-[#7DAEF7]">
              <Terminal size={20} />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Architecture</span>
            </div>
            <h2 className="text-4xl font-black mb-8 tracking-tight">Project Structure</h2>
            <div className="space-y-8">
              <p className="text-slate-600 text-lg leading-relaxed">
                Projects in Crazy Taski are isolated environments. Each project acts as a standalone workspace containing its own unique data ecosystem.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-4xl hover:border-[#7DAEF7] transition-all group">
                   <h4 className="font-bold text-lg mb-3 text-slate-800">Isolated Workspaces</h4>
                   <p className="text-sm text-slate-500 leading-relaxed">Every project has its own members, tasks, and settings. No data leaks between projects.</p>
                </div>
                <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-4xl hover:border-[#7DAEF7] transition-all group">
                   <h4 className="font-bold text-lg mb-3 text-slate-800">Visual Timeline</h4>
                   <p className="text-sm text-slate-500 leading-relaxed">Track project progress through a minimalist lifecycle from creation to completion.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Roles & Permissions */}
<section id="roles" className="mb-32 scroll-mt-24">
  <div className="flex items-center gap-3 mb-6 text-[#7DAEF7]">
    <ShieldCheck size={20} />
    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Collaboration Hierarchy</span>
  </div>
  <h2 className="text-4xl font-black mb-8 tracking-tight">Roles & Permissions</h2>
  
  <div className="border border-slate-100 rounded-4xl bg-white shadow-sm overflow-hidden">
    <table className="w-full text-left border-collapse table-fixed">
      <thead>
        <tr className="bg-slate-50/50">
          <th className="w-[40%] p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Action</th>
          <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 text-center">Owner</th>
          <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#7DAEF7] border-b border-slate-100 text-center">Editor</th>
          <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-600 border-b border-slate-100 text-center">Creator</th>
          <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">Viewer</th>
        </tr>
      </thead>
      <tbody className="text-[13px]">
        {[
          { action: "Project Control", owner: true, editor: false, creator: false, viewer: false },
          { action: "Manage Members", owner: true, editor: false, creator: false, viewer: false },
          { action: "Edit Settings", owner: true, editor: true, creator: false, viewer: false },
          { action: "Add Content", owner: true, editor: true, creator: true, viewer: false },
          { action: "Edit Own Work", owner: true, editor: true, creator: true, viewer: false },
          { action: "View & Access", owner: true, editor: true, creator: true, viewer: false },
        ].map((row, i) => (
          <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
            <td className="p-4 border-b border-slate-50 font-bold text-slate-700 truncate">
              {row.action}
            </td>
            
            {/* Owner */}
            <td className="p-4 border-b border-slate-50 text-center">
              <div className="flex justify-center text-green-500">
                {row.owner ? <CheckCircle2 size={16} strokeWidth={3} /> : <span className="text-slate-200">—</span>}
              </div>
            </td>

            {/* Editor */}
            <td className="p-4 border-b border-slate-50 text-center">
              <div className="flex justify-center">
                {row.editor ? <CheckCircle2 size={16} className="text-[#7DAEF7]" strokeWidth={3} /> : <span className="text-slate-200">—</span>}
              </div>
            </td>

            {/* Creator */}
            <td className="p-4 border-b border-slate-50 text-center">
              <div className="flex justify-center">
                {row.creator ? <CheckCircle2 size={16} className="text-slate-600" strokeWidth={3} /> : <span className="text-slate-200">—</span>}
              </div>
            </td>

            {/* Viewer */}
            <td className="p-4 border-b border-slate-50 text-center">
              <div className="flex justify-center">
                {row.viewer ? <CheckCircle2 size={16} className="text-slate-400" strokeWidth={3} /> : <span className="text-slate-200">—</span>}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="mt-6 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
    <p className="text-[11px] text-slate-500 leading-relaxed italic">
      <strong>Note:</strong> <span className="font-bold">Editors</span> have broad permissions within the project, while <span className="font-bold">Creators</span> only hold administrative rights over specific records they have initiated.
    </p>
  </div>
</section>

          {/* Section: Task Management */}
          <section id="tasks" className="mb-32 scroll-mt-24">
             <h2 className="text-4xl font-black mb-8 tracking-tight">Task Management</h2>
             <div className="grid gap-4">
               {[
                 { t: "Todo", d: "Tasks that are ready to be started." },
                 { t: "In progress", d: "Active tasks currently in progress." },
                 { t: "Review", d: "Completed tasks awaiting final quality check." },
                 { t: "Done", d: "Successfully archived and completed tasks." }
               ].map((status, i) => (
                 <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/40 border border-transparent hover:bg-white hover:border-slate-100 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-sm text-slate-400 group-hover:text-[#7DAEF7] transition-colors">0{i+1}</div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-lg">{status.t}</h5>
                        <p className="text-sm text-slate-500 font-medium">{status.d}</p>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </section>

          {/* Section: Smart Notes */}
          <section id="notes" className="mb-32 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6 text-[#7DAEF7]">
              <StickyNote size={20} />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Knowledge Base</span>
            </div>
            <h2 className="text-4xl font-black mb-8 tracking-tight">Smart Notes</h2>
            <div className="p-8 border border-slate-100 rounded-4xl bg-[#F8FAFF]">
              <ul className="space-y-4">
                {["Rich Text & Markdown support", "Real-time collaborative editing", "Direct task linking"].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-[#7DAEF7]/20 flex items-center justify-center text-[#7DAEF7]">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section: Reminders */}
          <section id="reminders" className="mb-32 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6 text-[#7DAEF7]">
              <Bell size={20} />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Focus</span>
            </div>
            <h2 className="text-4xl font-black mb-8 tracking-tight">Reminders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 border border-slate-100 rounded-3xl bg-white">
                <span className="text-[10px] font-black text-[#7DAEF7] uppercase tracking-widest block mb-2">Smart Alerts</span>
                <p className="text-sm text-slate-500">Intelligent notifications based on priority.</p>
              </div>
              <div className="p-6 border border-slate-100 rounded-3xl bg-white">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Custom Sounds</span>
                <p className="text-sm text-slate-500">Minimalist audio cues for deep focus.</p>
              </div>
            </div>
          </section>

          {/* Section: Timeline Events */}
          <section id="events" className="mb-32 scroll-mt-24">
            <div className="flex items-center gap-3 mb-6 text-[#7DAEF7]">
              <Calendar size={20} />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Planning</span>
            </div>
            <h2 className="text-4xl font-black mb-8 tracking-tight">Timeline Events</h2>
            <div className="relative pl-8 border-l-2 border-slate-50 space-y-12">
              <div className="relative">
                <div className="absolute -left-10.25 top-1 w-4 h-4 rounded-full bg-[#7DAEF7] border-4 border-white" />
                <h4 className="font-bold text-slate-800">Project Milestones</h4>
                <p className="text-sm text-slate-500">Significant achievements in the lifecycle.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-10.25top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white" />
                <h4 className="font-bold text-slate-800">System Logs</h4>
                <p className="text-sm text-slate-500">Automated tracking of system changes.</p>
              </div>
            </div>
          </section>

          <footer className="mt-40 pt-10 border-t border-slate-100 text-sm font-bold text-slate-400">
             Crazy Taski © 2026
          </footer>
        </div>
      </main>
    </div>
  );
}