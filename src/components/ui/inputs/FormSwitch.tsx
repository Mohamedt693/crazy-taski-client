import type { LucideIcon } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    description?: string;
    icon: LucideIcon;
    register: UseFormRegisterReturn;
}

function FormSwitch({ label, description, icon: Icon, register, className, ...props }: FormSwitchProps) {
    const isDisabled = props.disabled;

    return (
        <label className={`flex items-center justify-between py-1 transition-all 
            ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer group"} 
            ${className}`}
        >
            <div className="flex items-center gap-3">
                {/* Icon Container */}
                <div className={`p-2 bg-white rounded-xl shadow-sm text-slate-400 transition-all duration-300
                    ${!isDisabled && "group-hover:text-[#7DAEF7] group-hover:shadow-md"}
                `}>
                    <Icon size={16} />
                </div>
        
                {/* Text Container */}
                <div className="flex flex-col text-left">
                    <span className='text-xs font-bold transition-colors text-(--primary-text)'>
                        {label}
                    </span>
                    {description && (
                        <span className="text-[10px] text-slate-400 font-medium leading-tight">
                            {description}
                        </span>
                    )}
                </div>
            </div>

            {/* Switch Toggle */}
            <div className="relative">
                <input 
                    type="checkbox" 
                    {...register} 
                    {...props} 
                    className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full 
                    peer-checked:bg-[#7DAEF7] transition-all duration-300 
                    after:content-[''] after:absolute after:top-0.5 after:left-0.5 
                    after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all 
                    peer-checked:after:translate-x-4 shadow-inner
                    peer-disabled:bg-slate-100 peer-disabled:after:bg-slate-50 peer-disabled:opacity-50">
                </div>
            </div>
        </label>
    );
}

export default FormSwitch;