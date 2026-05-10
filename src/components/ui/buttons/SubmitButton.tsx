import { Loader2, Save, type LucideIcon } from "lucide-react";

interface SubmitButtonProps {
    isSubmitting: boolean;
    form?: string; 
    text?: string; 
    onClick?: () => void; 
    icon?: LucideIcon;  
}

function SubmitButton({ 
    isSubmitting = false, 
    form, 
    text = "Submit", 
    onClick,
    icon: Icon = Save
}: SubmitButtonProps) {
    return (
        <button
        form={form}
        type={form ? "submit" : "button"} 
        onClick={onClick}
        disabled={isSubmitting}
        className="w-full bg-(--submitBtn-bg) hover:bg-(--submitBtn-bg-hover) text-(--primary-text) font-bold py-4 
        rounded-2xl transition-all flex items-center justify-center gap-2 
        active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm"
        >
            {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <>
                    <Icon size={18} />
                    <span>{text}</span>
                </>
            )}
        </button>
    );
}

export default SubmitButton;