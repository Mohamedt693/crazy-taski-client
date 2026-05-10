import { Sun } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useSidebarStore } from "../../store/useSidebarStore";
import LoginBtn from "../ui/buttons/LoginBtn";
import ThemeBtn from "../ui/buttons/ThemeBtn";

function RightAside() {
  const user = useAuthStore((state) => state.user);
  const content = useSidebarStore((state) => state.content);

  return (
    <aside className="hidden w-[320px] border-l border-black/5 rounded-l-3xl bg-(--main-color) xl:flex xl:flex-col h-screen sticky top-0">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
        <ThemeBtn />

        {/* Profile OR Login Button */}
        {user ? (
          <div className="flex items-center gap-3 animate-in fade-in duration-500">
            <div className="text-right hidden md:block">
              <p className="text-[13px] font-bold text-(--primary-text) leading-tight">
                {user.displayName}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F7D36A] text-sm font-bold text-slate-800 shadow-sm overflow-hidden border border-slate-100">
              {user.avatar ? (
                <img
                  src={user.avatar.replace("http://", "https://")}
                  referrerPolicy="no-referrer"
                  alt={user.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{user.displayName?.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
        ) : (
          <LoginBtn />
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar">
        {content ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {content}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale mt-20">
            <div className="mb-4 p-4 bg-slate-50 rounded-full">
              <Sun size={40} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Select an activity or <br /> click "+" to add new project!
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default RightAside;
