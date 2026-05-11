import { useEffect } from "react";
// react router
import { useNavigate, useSearchParams } from "react-router-dom";
// stores
import { useAuthStore } from "../../store/useAuthStore";


const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const handleAuth = async () => {
      const { success } = await setUser(token);
      
      if (success) {
        navigate("/");
      } else {
        navigate("/login");
      }
    };

    handleAuth();
  }, [searchParams, setUser, navigate]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-(--primary-color)">
    </div>
  );
}

export default AuthSuccess;