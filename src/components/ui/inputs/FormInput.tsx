import type { LucideIcon } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
    error?: string;
    register: UseFormRegisterReturn;
}

function FormInput({ label, icon: Icon, error, register, className, ...props }: FormInputProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase ml-1 text-(--secondry-text) opacity-70">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7DAEF7] transition-colors">
                    <Icon size={18} />
                </div>
                <input
                {...register}
                {...props}
                className={`default-input pl-10 ${error ? "input-error" : ""} 
                ${props.disabled ? "bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-80" : ""} 
                ${className}`}
                />
            </div>
            {error && <p className="text-[10px] text-red-500 font-medium ml-2 mt-1">{error}</p>}
        </div>
    );
};

export default FormInput