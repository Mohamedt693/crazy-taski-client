const RouteLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-slate-700 animate-spin"></div>
                <p className="text-sm text-slate-500 font-medium">Loading...</p>
            </div>
        </div>
    );
};

export default RouteLoader;