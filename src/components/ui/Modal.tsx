import { useConfirmModal } from "../../store/useConfirmModal";

export default function ConfirmModal() {
    const { isOpen, onClose, title, description, confirmText, onConfirm } = useConfirmModal();

    if (!isOpen) return null;

    const handleConfirm = async () => {
        await onConfirm(); 
        onClose(); 
    };

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
                <div className="text-center">
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <p className="text-slate-500 mt-2 text-sm">{description}</p>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 px-4 rounded-2xl font-semibold text-slate-600 bg-slate-100">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} className="flex-1 py-3 px-4 rounded-2xl font-semibold text-white bg-red-500 shadow-lg">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}