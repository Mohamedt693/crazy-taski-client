import React, { useState } from 'react';
import api from '../../api/axios';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setIsSent(true);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
                <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center 
                animate-in fade-in duration-500">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-50 p-4 rounded-full">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h2>
                    <p className="text-gray-500 mb-8">
                        We've sent a recovery link to <br/>
                        <span className="font-semibold text-gray-800">{email}</span>
                    </p>
                    <button 
                        onClick={() => setIsSent(false)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        Didn't receive it? Send again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                
                {/* Back Link */}
                <div className="mb-8">
                    <a href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-gray-600 
                    transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </a>
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Forgot Password</h2>
                    <p className="text-gray-500 mt-2">Enter the email associated with your account.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
                                transition-all text-gray-900 placeholder:text-gray-400"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white 
                        rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;