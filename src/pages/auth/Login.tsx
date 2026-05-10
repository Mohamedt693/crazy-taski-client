import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { LoginForm } from "../../components/forms/auth/LoginFrom";
import LoginWithGoogleBtn from "../../components/ui/buttons/LoginWithGoogleBtn";

function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F5] p-4 font-sans text-slate-900">
      <div className="w-full max-w-112.5 bg-white rounded-[40px] shadow-sm border border-black/5 p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F7E2B8] text-slate-800 mb-4 shadow-sm">
            <LogIn size={28} />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2">
            Log in to your workspace
          </p>
        </div>

        {/* Google Login Button */}
        <LoginWithGoogleBtn />

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative bg-white px-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Or use email
          </span>
        </div>

        <LoginForm />

        <div className="flex justify-end mt-4 px-1">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-[#7DAEF7] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-center mt-10 text-sm text-slate-500">
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
