import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
    isSubmitting: boolean;
    text?: string; 
    onClick?: () => void; 
}

function DeleteButton({ isSubmitting, text, onClick }: DeleteButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isSubmitting}
            className="w-full bg-red-500 text-white font-bold py-3 
            rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 
            text-[11px] uppercase tracking-wider border border-red-100 cursor-pointer"
        >
            <Trash2 size={14} />
            {text || "Delete"}
        </button>
    )
}

export default DeleteButton
