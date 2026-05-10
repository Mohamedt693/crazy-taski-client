import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProtectedRoute = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const loading = useAuthStore((state) => state.loading);

    if (loading) return null;

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;