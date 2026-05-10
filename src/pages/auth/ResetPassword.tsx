import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>(); 
    const navigate = useNavigate();

    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.patch(`/auth/reset-password/${token}`, { password });
            setIsSuccess(true);
            
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error("Reset error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
                <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-50 p-4 rounded-full">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                    <p className="text-gray-500 mb-8">
                        Your password has been updated. <br/>
                        Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center">Set New Password</h2>
                    <p className="text-gray-500 mt-2 text-center">Type your new secure password below.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-center">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;