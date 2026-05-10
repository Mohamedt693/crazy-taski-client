import { LogOut } from "lucide-react";
import { useConfirmModal } from "../../../store/useConfirmModal"; 
import { useAuthStore } from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const { onOpen } = useConfirmModal(); 
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onOpen({
      title: "Confirm Logout",
      description: "Are you sure you want to log out? You will need to sign in again to access your projects.",
      confirmText: "Log Out",
      onConfirm: async () => {
        const { success, message } = await logout();
        if (!success) {
          alert(message); 
        }
        navigate("/login");
      },
    });
  };

  return (
    <button
      onClick={handleLogoutClick} 
      title="Logout"
      className="flex h-10 w-10 items-center justify-center rounded-2xl transition hover:bg-red-50 text-red-500/70 hover:text-red-600 active:scale-90"
    >
      <LogOut size={18} />
    </button>
  );
}

export default LogoutBtn;