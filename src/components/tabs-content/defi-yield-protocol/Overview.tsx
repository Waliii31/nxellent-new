const Overview = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-stretch">

      {/* ITEM 1 */}
      <div className="flex-[0.33] w-full text-center flex flex-col justify-center items-center gap-2 py-6">
        <p className="inter font-normal text-white/80 text-xs">Overall Score</p>
        <p className="inter font-normal text-white/80 text-sm">Gold Shield Rank</p>

        <div className="relative flex justify-center items-center">
          <div className="absolute flex flex-col items-center">
            <h1 className="inter font-normal text-4xl sm:text-5xl">87</h1>
            <p className="inter font-normal text-[#8B5CF6] text-xs sm:text-sm mt-1">Gold</p>
          </div>
          <img src="/frame.svg" alt="frame" className="w-24 sm:w-auto" />
        </div>
      </div>

      {/* MIDDLE ITEM */}
      <div className="flex-[0.33] w-full text-center flex flex-col justify-center items-center gap-2 py-6 
                      border-t border-b sm:border-t-0 sm:border-b-0 sm:border-x border-white/5">
        <p className="inter font-normal text-white/80 text-xs">Coverage</p>
        <p className="inter font-normal text-white/80 text-sm">Code analyzed</p>

        <h1 className="font-semibold text-[#BE0178] urbanist text-4xl sm:text-5xl">94%</h1>
      </div>

      {/* ITEM 3 */}
      <div className="flex-[0.33] w-full text-center flex flex-col justify-center items-center gap-2 py-6">
        <p className="inter font-normal text-white/80 text-xs">Score Change</p>
        <p className="inter font-normal text-white/80 text-sm">Since last scan</p>

        <h1 className="font-semibold urbanist text-4xl sm:text-5xl text-[#34C759]">+5</h1>
      </div>

    </div>
  );
};

export default Overview;
