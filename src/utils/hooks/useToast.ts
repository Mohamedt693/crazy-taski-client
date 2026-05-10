import { toast } from "react-toastify";

export const useToast = () => {
    const showPromiseToast = async <T>(
        promise: Promise<T>,
        messages = {
            loading: "Processing...",
            success: "Action completed successfully! 🎉",
            error: "Something went wrong",
        }
    ) => {
        const toastId = toast.loading(messages.loading);

        try {
            const result = await promise;

            toast.update(toastId, {
                render: messages.success,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });

            return result ?? true; 
            
        } catch (error) {
            console.error(error);
            toast.update(toastId, {
                render: messages.error,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            return null;
        }
    };

    return { showPromiseToast };
};