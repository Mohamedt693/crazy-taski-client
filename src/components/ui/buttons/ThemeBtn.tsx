import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../../store/useThemeStore';
import { useEffect } from 'react';

function ThemeBtn() {
    const { isDarkMode, toggleTheme } = useThemeStore();

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    return (
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-2xl w-fit border border-slate-200 dark:border-zinc-700">
            {/*  Light Mode */}
            <button
            onClick={() => isDarkMode && toggleTheme()}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 
            ${!isDarkMode
                ? "bg-white text-orange-500 shadow-sm border border-slate-100"
                : "text-slate-400 hover:text-slate-600"
            }`}
            >
                <Sun size={18} />
            </button>

            {/* Dark Mode */}
            <button
            onClick={() => !isDarkMode && toggleTheme()}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 
            ${isDarkMode
                ? "bg-zinc-700 text-yellow-400 shadow-sm border border-zinc-600"
                : "text-slate-400 hover:text-slate-300"
            }`}
            >
                <Moon size={18} />
            </button>
        </div>
    );
}

export default ThemeBtn;