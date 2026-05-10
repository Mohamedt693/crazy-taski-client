import { Outlet } from "react-router-dom";
import LeftAside from "./LeftAside";
import RightAside from "./RightAside";
import { useEffect, useState } from "react";
import LogoutModal from "../ui/Modal";
import { useInvitationStore } from "../../store/useInvitationStore";
import Preloader from "../ui/PreLoader";

function MainLayout() {
  const getMyInvitations = useInvitationStore((state) => state.getMyInvitations);

  const [showLoader, setShowLoader] = useState(() => {
    return !sessionStorage.getItem("viewedPreloader");
  });

  useEffect(() => {
    getMyInvitations(); 
  }, [getMyInvitations]);

  const handleFinishLoading = () => {
    sessionStorage.setItem("viewedPreloader", "true");
    setShowLoader(false);
  };

  if (showLoader) {
    return <Preloader finishLoading={handleFinishLoading} />;
  }

  return (
    <div className="h-screen flex transition-colors ease-in-out bg-(--secondry-color) animate-in fade-in duration-700">
      <LeftAside />
      <main className="min-h-0 flex-1 flex min-w-0 flex-col overflow-hidden p-4 md:p-6">
        <Outlet />
      </main>
      <RightAside />
      <LogoutModal />
    </div>
  );
}

export default MainLayout;