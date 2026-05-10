

interface IntroProps {
  title: string;
  paragraph?: string;
}

function Intro({ title, paragraph }: IntroProps) {
    return (
        <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-(--primary-text) tracking-tight">
                        {title}
                    </h1>
                    {paragraph && (
                        <p className="text-slate-400 font-medium mt-2 max-w-xl">
                            {paragraph}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Intro;