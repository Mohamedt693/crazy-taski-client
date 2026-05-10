import type { LucideIcon } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface RadioOption {
    value: string;
    label: string;
    icon: LucideIcon;
    colorClass: string;
}

interface FormRadioInputProps {
    label: string;
    options: RadioOption[];
    register: UseFormRegisterReturn;
    currentValue: string;
    disabled?: boolean;
}

function FormRadioInput({ label, options, register, currentValue, disabled }: FormRadioInputProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase ml-1 text-(--secondry-text) opacity-70">
                {label}
            </label>
            <div className="grid grid-cols-3 gap-2">
                {options.map((option) => {
                    const isSelected = currentValue === option.value;
                    const Icon = option.icon;

                    return (
                        <label
                            key={option.value}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all
                            ${isSelected 
                                ? "bg-white border-[#7DAEF7] shadow-sm opacity-100" 
                                : "bg-slate-50/50 border-transparent opacity-60"}
                            ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:opacity-100 hover:border-slate-200"}`}
                        >
                            <input
                            type="radio"
                            {...register}
                            value={option.value}
                            disabled={disabled}
                            className="hidden"
                            />
                            <Icon size={16} className={option.colorClass} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                                {option.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default FormRadioInput;