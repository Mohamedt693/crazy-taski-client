import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface InvitationPayload {
    invitationId: string;
    projectName: string;
    inviterName: string;
    role: 'editor' | 'viewer';
}

interface TaskUpdatedPayload {
    taskId: string;
    taskTitle: string;
    status: string;
}

type NotificationType = 
    | { type: 'INVITATION_RECEIVED'; message: string; payload: InvitationPayload }
    | { type: 'INVITATION_ACCEPTED'; message: string; payload: { userId: string; userName: string } }
    | { type: 'TASK_UPDATED'; message: string; payload: TaskUpdatedPayload };


interface SocketState {
    socket: Socket | null;
    notifications: NotificationType[];
    isConnected: boolean;
    connectSocket: (token: string) => void;
    disconnectSocket: () => void;
}


const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    notifications: [],
    isConnected: false,

    connectSocket: (token: string) => {
        if (get().socket?.connected) return;

        const socketInstance: Socket = io(import.meta.env.VITE_SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
        });

        socketInstance.on("connect", () => {
            console.log("✅ Socket Connected");
            set({ isConnected: true });
        });

        socketInstance.on("new_notification", (data: NotificationType) => {
            toast.info(data.message, { position: "bottom-right" });

            set((state) => ({
                notifications: [data, ...state.notifications]
            }));
        });

        socketInstance.on("notification_received", (data: NotificationType) => {
            toast.success(data.message);
            set((state) => ({
                notifications: [data, ...state.notifications]
            }));
        });

        socketInstance.on("connect_error", (err: Error) => {
            console.error("Socket Auth Error:", err.message);
        });

        socketInstance.on("disconnect", () => {
            set({ isConnected: false, socket: null });
        });

        set({ socket: socketInstance });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    }
}));

export default useSocketStore;