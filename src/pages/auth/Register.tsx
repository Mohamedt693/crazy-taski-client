import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { RegisterForm } from "../../components/forms/auth/RegisterForm";

function Register() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F5] p-4 font-sans text-slate-900">
            <div className="w-full max-w-137.5 bg-white rounded-[40px] shadow-sm border border-black/5 p-8 md:p-12">
        
                <div className="text-center mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl
                    bg-[#7DAEF7]/20 text-[#7DAEF7] mb-4 shadow-sm">
                        <UserPlus size={28} />
                    </div>
                    <h1 className="text-2xl font-bold italic">Join the Workspace</h1>
                    <p className="text-slate-500 text-sm mt-2">Get started for free today</p>
                </div>

                <RegisterForm />

                <p className="text-center mt-8 text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="font-bold text-slate-800 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;