import { useEffect, useState } from "react";

const Preloader = ({ finishLoading }: { finishLoading: () => void }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWidth((prev) => {
            if (prev >= 100) {
                clearInterval(interval);
                setTimeout(finishLoading, 500); 
                return 100;
            }
            return prev + Math.random() * 15;
        });
        }, 200);

        return () => clearInterval(interval);
    }, [finishLoading]);

    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-(--primary-color)">
            <div className="relative flex flex-col items-center w-64">
        
                <img 
                    src="/logo.png"  
                    alt="Logo" 
                    className="w-20 h-20 mb-8 animate-pulse"
                />

                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                    <div 
                    className="h-full bg-(--primary-text) transition-all duration-300 ease-out"
                    style={{ width: `${width}%` }}
                    />
                </div>

                <span className="mt-4 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold">
                    Loading
                </span>
            </div>
        </div>
    );
};

export default Preloader;