import React from "react";

type ProjectRowProps = {
  rank: number;
  name: string;
  category: string;
  score: number;
  tier: string;
  timeAgo: string;
  change?: {
    value: number;
    arrowSrc: string;
    alt?: string;
  };
  // New detailed metrics
  contractScore?: number;
  applicationScore?: number;
  coverage?: number;
  totalIssues?: number;
  criticalIssues?: number;
  shieldRank?: string;
  hasContract?: boolean;
  hasApplication?: boolean;
};

const ProjectRow: React.FC<ProjectRowProps> = ({
  rank,
  name,
  category,
  score,
  tier,
  timeAgo,
  change,
  contractScore = 0,
  applicationScore = 0,
  coverage = 0,
  totalIssues = 0,
  criticalIssues = 0,
  shieldRank,
  hasContract,
  hasApplication,
}) => {
  const isProfit = typeof change?.value === "number" && change.value > 0;
  const isLoss = typeof change?.value === "number" && change.value < 0;

  return (
    <div className="relative w-full p-[2px] rounded-[20px] group transition-all duration-300">
      {/* Full Gradient border wrapper */}
      <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(63,132,185,1)_0%,rgba(212,103,185,1)_100%)] rounded-[20px] z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      
      <article
        className={[
          "relative flex flex-col gap-4",
          "lg:flex-row lg:items-center lg:gap-6",
          "rounded-[18px] px-4 sm:px-6 md:px-8 py-4 sm:py-6",
          "backdrop-blur-[97px] z-10 w-full h-full overflow-hidden",
        ].join(" ")}
        style={{
          background: "linear-gradient(180deg, rgba(0,0,39,1) 0%, rgba(1,0,34,1) 100%)",
        }}
      >

      {/* Left block: Rank + Name + Category */}
      <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto lg:min-w-[300px]">
        {/* Rank */}
        <div className="shrink-0 leading-none w-10 sm:w-12 text-center">
          <span className="text-[28px] sm:text-[32px] font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-[#A501FF]">
            #{rank}
          </span>
        </div>

        {/* Name + Category */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="truncate text-white text-[20px] font-semibold tracking-wide">
              {name}
            </h2>
            {shieldRank && (
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${shieldRank.toLowerCase() === 'gold' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                shieldRank.toLowerCase() === 'silver' ? 'border-slate-400/50 text-slate-300 bg-slate-400/10' :
                  'border-orange-700/50 text-orange-400 bg-orange-700/10'
                }`}>
                {shieldRank}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span>{category}</span>
            {(hasContract || hasApplication) && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <div className="flex gap-2">
                  {hasContract && <span className="text-emerald-400 text-xs">Contract</span>}
                  {hasApplication && <span className="text-blue-400 text-xs">App</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Middle Block: Detailed Stats Grid */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8 py-4 lg:py-0 border-t lg:border-t-0 lg:border-l border-white/5 lg:px-8">
        {/* Coverage */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Coverage</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-white">{coverage}%</span>
          </div>
        </div>

        {/* Issues */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Issues</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">{totalIssues}</span>
            {criticalIssues > 0 && (
              <span className="text-xs font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                {criticalIssues} Crit
              </span>
            )}
          </div>
        </div>

        {/* Contract Score */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Contract</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold ${contractScore >= 90 ? 'text-emerald-400' : contractScore >= 70 ? 'text-yellow-400' : 'text-white'}`}>
              {contractScore}
            </span>
            <span className="text-xs text-white/30">/100</span>
          </div>
        </div>

        {/* App Score */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">App Sec</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold ${applicationScore >= 90 ? 'text-blue-400' : applicationScore >= 70 ? 'text-yellow-400' : 'text-white'}`}>
              {applicationScore}
            </span>
            <span className="text-xs text-white/30">/100</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Change</span>
          <div className="flex items-baseline gap-1">
            {typeof change?.value === "number" && (
              <div className={`flex items-center gap-1 text-lg font-bold ${isProfit ? "text-emerald-400" : isLoss ? "text-red-400" : "text-white/40"}`}>
                <span>{change.value > 0 ? "+" : ""}{change.value}</span>
                {change.arrowSrc && <img src={change.arrowSrc} alt="" className="w-3 h-3" />}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right block: Overall Score & Gauge */}
      <div className="flex items-center justify-between lg:justify-end gap-6 lg:min-w-[200px]">
        {/* Score / Tier */}
        <div className="text-right flex items-center justify-end gap-3 sm:gap-6 lg:gap-8">
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-center">
               <div className="font-['Plus_Jakarta_Sans',Helvetica] font-bold text-white text-2xl sm:text-3xl md:text-[40px] leading-none mb-1 text-center">
                 {score}
               </div>
               <div className="text-[#ffffffcc] text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-center shrink-0">
                 {tier}
               </div>
             </div>
          </div>

          {/* Glowing Time Pill */}
          <div className="hidden sm:inline-flex items-center justify-center gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-[40px] bg-[linear-gradient(247deg,rgba(223,70,242,1)_0%,rgba(165,1,255,1)_100%)] whitespace-nowrap">
            <div className="inline-flex items-center gap-1.5 flex-[0_0_auto]">
              <img
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                alt="Time icon"
                src="/figmaAssets/ri-time-line.svg"
              />
              <div className="font-['Alexandria',Helvetica] font-light text-[#450146] text-xs md:text-sm tracking-tight">
                {timeAgo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
  );
};

export default ProjectRow;
