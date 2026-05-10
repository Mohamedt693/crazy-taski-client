import type { LucideIcon } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  register: UseFormRegisterReturn;
  children: React.ReactNode;
}

function FormSelect({ label, icon: Icon, error, register, children, className, ...props }: FormSelectProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase ml-1 text-(--secondry-text) opacity-70">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7DAEF7] transition-colors pointer-events-none">
                    <Icon size={18} />
                </div>
                <select
                    {...register}
                    {...props}
                    className={`default-input pl-10 appearance-none cursor-pointer ${error ? "input-error" : ""} 
                    ${props.disabled ? "opacity-70 cursor-not-allowed" : ""} 
                    ${className}`}
                >
                    {children}
                </select>
            </div>
            {error && <p className="text-[10px] text-red-500 font-medium ml-2 mt-1">{error}</p>}
        </div>
    );
};

export default FormSelect;