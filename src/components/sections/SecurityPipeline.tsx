const SecurityPipeline = () => {
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-[#020C30] text-white text-center">
      <h1 className="anybody text-3xl md:text-4xl font-semibold mb-5">
        Security Pipeline
      </h1>

      <div className="flex justify-center">
        <img
          src="/security-pipeline.png"
          alt="Security Pipeline"
          className="w-full max-w-5xl h-auto object-contain"
          loading="lazy"
        />
      </div>
    </section>
  )
}

export default SecurityPipeline
