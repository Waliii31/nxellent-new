import GlowCard from "../../ui/GlowCard";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";

const Overview = () => {
  const score = 92;
  const badgeSrc =
    score >= 90
      ? "/platinium-badge.png"
      : score >= 70
      ? "/gold-badge.png"
      : "/silver-badge.png";

  return (
    <main
      className="
        p-4 sm:p-6 
        grid gap-4 md:gap-6
        grid-cols-1 md:grid-cols-6 
        auto-rows-auto md:auto-rows-[200px]
      "
    >
      {/* Top wide card */}
      <GlowCard className="md:col-span-4 md:row-span-2">
        <div
          className="
            flex flex-col md:flex-row 
            h-full gap-5 md:gap-8 
            justify-center md:justify-between 
            items-center md:items-center
          "
        >
          <div
            className="
              flex flex-col justify-between items-start 
              w-full md:min-w-[400px] h-full gap-4
            "
          >
            <div>
              <h1 className="font-medium text-white urbanist text-2xl sm:text-3xl">
                Security Score
              </h1>
              <p className="text-sm sm:text-base">Overall security assessment</p>
            </div>

            <div
              className="
                flex bg-[#040029] border-[#3F84B9] border-b-2 
                py-4 sm:py-7 px-3 sm:px-4 
                rounded-2xl w-full 
                justify-center items-center
              "
            >
              <div className="w-1/3 flex flex-col items-center justify-center">
                <h1 className="anybody text-3xl sm:text-5xl font-bold bg-linear-to-r from-[#FCF5FA] to-[#DC0AFA] bg-clip-text text-transparent">
                  1
                </h1>
                <p className="text-xs sm:text-sm">Critical</p>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center">
                <h1 className="anybody text-3xl sm:text-5xl font-bold bg-linear-to-r from-[#FCF5FA] to-[#0A6CDD] bg-clip-text text-transparent">
                  2
                </h1>
                <p className="text-xs sm:text-sm">High</p>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center">
                <h1 className="anybody text-3xl sm:text-5xl font-bold bg-linear-to-r from-[#FCF5FA] to-[#FBEB59] bg-clip-text text-transparent">
                  1
                </h1>
                <p className="text-xs sm:text-sm">Medium</p>
              </div>
            </div>
          </div>

          <div
            className="relative w-32 sm:w-40 md:w-44 lg:w-52 h-32 sm:h-40 md:h-44 lg:h-52 max-w-full rounded-2xl bg-center bg-contain bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: `url(${badgeSrc})` }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="anybody text-xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.7)]">
                {score}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white uppercase drop-shadow-[0_0_6px_rgba(0,0,0,0.7)]">
                {score >= 90 ? "Platinum" : score >= 70 ? "Gold" : "Silver"}
              </span>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Right side tall card */}
      <GlowCard className="md:col-span-2 md:row-span-3">
        <div className="w-full h-full flex flex-col">
          <h1 className="urbanist font-medium mb-1 text-xl sm:text-2xl flex gap-2 items-center">
            <img className="w-6 h-6" src="/trophy.svg" alt="" />
            Security Missions
          </h1>
          <p className="text-xs sm:text-sm inter font-medium text-white/80">
            Complete tasks to improve your code security score
          </p>

          <div
            className="
              flex my-4 sm:my-5 bg-[#040029] border-[#3F84B9] border-b-2 
              py-2 sm:py-3 px-2 sm:px-3 
              rounded-2xl w-full 
              justify-center items-center
            "
          >
            <div className="w-1/3 flex flex-col items-center justify-center">
              <h1 className="anybody text-xl sm:text-2xl font-bold text-[#22C55E]">
                0
              </h1>
              <p className="text-xs sm:text-sm inter font-medium text-white/80">
                Critical
              </p>
            </div>
            <div className="w-1/3 flex flex-col items-center justify-center">
              <h1 className="anybody text-xl sm:text-2xl font-bold text-[#3B82F6]">
                0
              </h1>
              <p className="text-xs sm:text-sm inter font-medium text-white/80">
                High
              </p>
            </div>
            <div className="w-1/3 flex flex-col items-center justify-center">
              <h1 className="anybody text-xl sm:text-2xl font-bold text-[#A19DAF]">
                2
              </h1>
              <p className="text-xs sm:text-sm inter font-medium text-white/80">
                Medium
              </p>
            </div>
          </div>

          <h1 className="inter mb-2 font-normal text-white text-base sm:text-lg">
            Available Missions
          </h1>

          <div className="mb-4 sm:mb-5 px-3 sm:px-4 bg-[#040029] border-[#3F84B9] border-b-2 py-2 rounded-2xl w-full">
            <div className="flex flex-wrap justify-start gap-2 items-center">
              <h1 className="font-medium inter text-[#F4F3F6] text-sm">
                Fix Buffer Overflow
              </h1>
              <span className="border-2 rounded-full text-xs sm:text-sm py-0.5 px-2 border-[#17025A] text-[#EF4444] inter font-semibold">
                Hard
              </span>
            </div>
            <p className="text-white/80 inter font-normal text-xs sm:text-sm my-2">
              Address the critical buffer overflow vulnerability
            </p>
            <div className="flex flex-wrap justify-start items-center gap-4 sm:gap-5">
              <h5 className="flex gap-2 items-center inter font-normal text-white/90 text-xs sm:text-sm">
                <img className="w-3" src="/star-yellow.svg" alt="" /> 150 XP
              </h5>
              <h5 className="flex gap-2 items-center inter font-normal text-white/90 text-xs sm:text-sm">
                <img className="w-3" src="/high-green.svg" alt="" /> +12 pts
              </h5>
            </div>
          </div>

          <div className="my-4 sm:my-5 px-3 sm:px-4 bg-[#040029] border-[#3F84B9] border-b-2 py-2 rounded-2xl w-full">
            <div className="flex flex-wrap justify-start gap-2 items-center">
              <h1 className="font-medium inter text-[#F4F3F6] text-sm">
                Add Input Validation
              </h1>
              <span className="border-2 rounded-full text-xs sm:text-sm py-0.5 px-2 border-[#17025A] text-[#EAB308] inter font-semibold">
                Medium
              </span>
            </div>
            <p className="text-white/80 inter font-normal text-xs sm:text-sm my-2">
              Implement comprehensive input validation
            </p>
            <div className="flex flex-wrap justify-start items-center gap-4 sm:gap-5">
              <h5 className="flex gap-2 items-center inter font-normal text-white/90 text-xs sm:text-sm">
                <img className="w-3" src="/star-yellow.svg" alt="" /> 80 XP
              </h5>
              <h5 className="flex gap-2 items-center inter font-normal text-white/90 text-xs sm:text-sm">
                <img className="w-3" src="/high-green.svg" alt="" /> +6 pts
              </h5>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Stats row */}
      <div
        className="
          md:col-span-4 md:row-span-1 
          flex flex-col sm:flex-row gap-4 sm:gap-6
        "
      >
        <GlowCard className="flex flex-col items-center justify-center py-4 sm:py-6">
          <img className="w-8 sm:w-10 mb-2 sm:mb-3" src="/pink-shield.svg" alt="" />
          <p className="jakarta text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#FCF5FA] to-[#DC0AFA] bg-clip-text text-transparent">
            87%
          </p>
          <p className="text-white/80 inter font-medium text-xs sm:text-sm mt-2">
            Security Coverage
          </p>
        </GlowCard>

        <GlowCard className="flex flex-col items-center justify-center py-4 sm:py-6">
          <img className="w-8 sm:w-10 mb-2 sm:mb-3" src="/circle-check.svg" alt="" />
          <p className="jakarta text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#FCF5FA] to-[#DC0AFA] bg-clip-text text-transparent">
            245
          </p>
          <p className="text-white/80 inter font-medium text-xs sm:text-sm mt-2">
            Checks Passed
          </p>
        </GlowCard>

        <GlowCard className="flex flex-col items-center justify-center py-4 sm:py-6">
          <img className="w-8 sm:w-10 mb-2 sm:mb-3" src="/pink-warning.svg" alt="" />
          <p className="jakarta text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#FCF5FA] to-[#DC0AFA] bg-clip-text text-transparent">
            4
          </p>
          <p className="text-white/80 inter font-medium text-xs sm:text-sm mt-2">
            Issues Found
          </p>
        </GlowCard>
      </div>

      {/* Bottom wide card */}
      <GlowCard className="md:col-span-6 md:row-span-2">
        <div
          className="
            flex flex-col md:flex-row 
            justify-center items-stretch md:items-center 
            gap-6 md:gap-10 w-full h-full
          "
        >
          <div className="flex-1 flex justify-center items-start flex-col h-full">
            <h1 className="anybody mb-1 font-semibold text-white text-2xl sm:text-3xl">
              Share Your Achievement
            </h1>
            <p className="inter font-medium text-sm sm:text-md text-white/80">
              Show off your security score
            </p>

            <div className="flex flex-col sm:flex-row gap-2 items-stretch mt-4 w-full">
              <SecondaryButton
                children="Twitter"
                moreClasses="flex-1 text-sm jakarta font-medium !py-3"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      "Check out my NXELLENT security score!"
                    )}&url=${encodeURIComponent(window.location.href)}`,
                    "_blank",
                    "noopener"
                  )
                }
              />
              <SecondaryButton
                children="LinkedIn"
                moreClasses="flex-1 text-sm jakarta font-medium !py-3"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank",
                    "noopener"
                  )
                }
              />
            </div>

            <PrimaryButton
              children="Copy Badge Code"
              moreClasses="w-full mt-4 text-sm jakarta font-medium !py-3"
              onClick={() =>
                navigator.clipboard
                  ?.writeText(
                    `<a href="${window.location.href}" rel="noopener" target="_blank">NXELLENT Security Badge</a>`
                  )
                  .catch(() => { })
              }
            />
          </div>

          <div className="flex-1 flex justify-center items-center px-2 sm:px-3 h-full">
            <div className="py-6 sm:py-10 px-4 bg-[#040029] border-2 border-[#FD7EFF] rounded-2xl w-full text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold mb-1 anybody text-white">
                NXELLENT Score: 92
              </h1>
              <p className="text-sm sm:text-md inter mb-2 text-white/80">
                Platinum Rank • Top 5%
              </p>
              <button className="text-[#090123] cursor-pointer bg-[#FD7EFF] py-2 px-4 font-semibold rounded-full text-xs sm:text-sm">
                Solana DeFi
              </button>
            </div>
          </div>
        </div>
      </GlowCard>
    </main>
  );
};

export default Overview;
