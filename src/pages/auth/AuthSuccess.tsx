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
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#7DAEF7] border-t-transparent"></div>
      <p className="text-slate-500 font-medium animate-pulse">
        Fetching your account information...
      </p>
    </div>
  );
}

export default AuthSuccess;