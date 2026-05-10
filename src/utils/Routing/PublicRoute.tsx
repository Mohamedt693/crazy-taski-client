import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import RouteLoader from "./RouteLoader";

const PublicRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <RouteLoader />;
  }

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
