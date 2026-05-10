import { useState } from "react";
// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../../schemas/auth.schema";
// Icons
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
// react router
import { useNavigate } from "react-router-dom";
// stores
import { useAuthStore } from "../../../store/useAuthStore";
// ui components
import FormInput from "../../ui/inputs/FormInput";
import SubmitButton from "../../ui/buttons/SubmitButton";


export function LoginForm() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        const { success, message } = await login(data);
        if (success) {
            navigate("/");
        } else {
            alert(message); 
        }
    };

    return (
        <form 
            id="login-form" 
            className="space-y-5 animate-in fade-in zoom-in-95 duration-500" 
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* Fields Section */}
            <div className="space-y-4">
                <FormInput
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    register={register("email")}
                    error={errors.email?.message}
                    placeholder="name@company.com"
                />

                <div className="relative">
                    <FormInput
                        label="Password"
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        register={register("password")}
                        error={errors.password?.message}
                        placeholder="••••••••"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-9.5 text-slate-400 hover:text-[#7DAEF7] transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* Actions Section */}
            <div className="pt-2">
                <SubmitButton 
                    isSubmitting={isSubmitting} 
                    form="login-form" 
                    text="Sign In" 
                />
            </div>
        </form>
    );
}