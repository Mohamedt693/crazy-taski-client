import type { LucideIcon } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  register: UseFormRegisterReturn;
}

function FormTextarea({ label, icon: Icon, error, register, className, ...props }: FormTextareaProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase ml-1 text-(--secondry-text) opacity-70">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#7DAEF7] transition-colors">
                    <Icon size={18} />
                </div>
                <textarea
                    {...register}
                    {...props}
                    className={`default-input pl-10 pt-2.5 resize-none ${error ? "input-error" : ""} 
                    ${props.disabled ? "bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-80" : ""} 
                    ${className}`}
                />
            </div>
            {error && <p className="text-[10px] text-red-500 font-medium ml-2 mt-1">{error}</p>}
        </div>
    );
};

export default FormTextarea;