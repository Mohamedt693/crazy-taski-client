// react hook form & zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "../../../schemas/auth.schema";
// Icons
import { User, Mail, Lock } from "lucide-react";
// react router
import { useNavigate } from "react-router-dom";
// stores
import { useAuthStore } from "../../../store/useAuthStore";
// UI Components
import FormInput from "../../ui/inputs/FormInput";
import SubmitButton from "../../ui/buttons/SubmitButton";

export function RegisterForm() {
    const navigate = useNavigate();
    const registerUser = useAuthStore((state) => state.registerUser);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        const result = await registerUser(data);

        if (result.success) {
            alert("Account Created! Now login."); 
            navigate("/login");
        } else {
            alert(result.message);
        }
    };

    return (
        <form 
            id="register-form"
            className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500" 
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* Fields Section */}
            <div className="space-y-4">
                <FormInput
                    label="Full Name"
                    icon={User}
                    register={register("displayName")}
                    error={errors.displayName?.message}
                    placeholder="John Doe"
                />

                <FormInput
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    register={register("email")}
                    error={errors.email?.message}
                    placeholder="name@example.com"
                />

                <FormInput
                    label="Password"
                    icon={Lock}
                    type="password"
                    register={register("password")}
                    error={errors.password?.message}
                    placeholder="••••••••"
                />
            </div>

            {/* Actions Section */}
            <div className="pt-2">
                <SubmitButton 
                    isSubmitting={isSubmitting} 
                    form="register-form" 
                    text="Create Account" 
                />
            </div>
        </form>
    );
}