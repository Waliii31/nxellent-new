const workData = [
  {
    image: "/work-1.png",
    number: "01",
    title: "Upload or Connect",
    description:
      "Connect your GitHub/GitLab or paste a contract address. NXELLENT fetches the code securely.",
  },
  {
    image: "/work-2.png",
    number: "02",
    title: "Automated Security Scans",
    description:
      "NXELLENT runs automated checks across smart contracts and apps. We detect vulnerabilities, unsafe configurations, and dependency risks.",
  },
  {
    image: "/work-3.png",
    number: "03",
    title: "Generate NXELLENT Score",
    description:
      "Your project receives a 0–100 NXELLENT Score with detailed subscores. Each issue is categorized and weighted by severity.",
  },
  {
    image: "/work-4.png",
    number: "04",
    title: "Share or Keep Private",
    description:
      "Choose to publish your score on the NXELLENT Leaderboard or keep it private. Export branded reports for investors.",
  },
]

const WorkStructure = () => {
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-[#020C30] text-white">
      <h1 className="anybody text-center text-3xl md:text-4xl font-semibold mb-16">
        How NXELLENT Works
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {workData.map((step) => (
          <div
            key={step.number}
            className="relative rounded-2xl text-left flex flex-col items-center p-5 md:p-6 h-full overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #000027 0%, #010022 100%)",
            }}
          >
            {/* Gradient border bottom */}
            <div
              className="absolute bottom-0 left-0 w-full h-[5px] rounded-b-2xl"
              style={{
                background:
                  "linear-gradient(270.12deg, #3F84B9 23.84%, #D467B9 99.89%)",
              }}
            ></div>

            {/* Icon / Image */}
            <div className="relative w-full mb-2 flex items-center justify-center">
              <img
                src={step.image}
                alt={step.title}
                className="object-contain w-full h-auto"
              />
            </div>

            {/* Text Content */}
            <div className="text-left">
              <span className="urbanist text-2xl font-semibold block">
                {step.number}. <br />
                {step.title}
              </span>

              <p className="alexandria text-sm mt-5 leading-relaxed text-gray-400">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WorkStructure
