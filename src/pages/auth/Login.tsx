import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { LoginForm } from "../../components/forms/auth/LoginFrom";
import LoginWithGoogleBtn from "../../components/ui/buttons/LoginWithGoogleBtn";

function Login() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FAF8F5] p-4 font-sans text-slate-900 overflow-hidden">
      <div className="w-full max-w-100 bg-white rounded-4xl shadow-sm border border-black/5 px-8 py-7 md:py-9">
        
        <div className="text-center mb-5"> 
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7E2B8] text-slate-800 mb-3">
            <LogIn size={22} />
          </div>
          <h1 className="text-xl font-bold">Welcome Back</h1>
          <p className="text-slate-500 text-xs mt-1"> 
            Log in to your workspace
          </p>
        </div>

        <div className="space-y-4"> 
          <LoginWithGoogleBtn />

          <div className="relative py-2 text-center"> 
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Or
            </span>
          </div>

          <LoginForm />
        </div>

        <div className="flex justify-end mt-2 px-1">
          <Link
            to="/forgot-password"
            className="text-[11px] font-semibold text-[#7DAEF7] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500"> 
          New here?{" "}
          <Link
            to="/register"
            className="font-bold text-slate-800 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
