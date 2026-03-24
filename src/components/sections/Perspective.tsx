

const Perspective = () => {
    return (
        <section className="w-full font-anybody py-16 my-12 px-4 max-w-5xl mx-auto flex flex-col justify-center items-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white text-center mb-10">Two Perspectives. One Risk Model.</h1>
            <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-16 w-full">
                <div className="flex-1 w-full text-center md:text-left">
                    <h2 className="text-2xl font-semibold text-white mb-3">For Founders</h2>
                    <p className="text-[#A0AEC0]">Founders receive deep technical analysis, actionable fixes, and measurable score improvement paths.</p>
                </div>
                <div className="flex-1 w-full text-center md:text-left">
                    <h2 className="text-2xl font-semibold text-white mb-3">For Investors</h2>
                    <p className="text-[#A0AEC0]">Investors receive portfolio-level risk visibility, red-flag detection, and structured decision signals.</p>
                </div>
            </div>
        </section>
    )
}

export default Perspective