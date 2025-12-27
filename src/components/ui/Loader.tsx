const Loader = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex justify-center items-center w-full min-h-[200px] ${className}`}>
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-white/10 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#FD7EFF] border-r-[#A855F7] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default Loader;
