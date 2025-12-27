import React from "react";

type ProjectRowProps = {
  rank: number;
  name: string;
  category: string;
  score: number;
  tier: string;
  timeAgo: string;
  gaugeSrc: string;
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
    <article
      className={[
        "relative flex flex-col gap-4",
        "lg:flex-row lg:items-center lg:gap-6",
        "rounded-[20px] px-6 md:px-8 py-5",
        "backdrop-blur-[194px]",
        "border border-white/5 hover:border-white/10 transition-colors",
      ].join(" ")}
      style={{
        background: "linear-gradient(180deg, rgba(0, 0, 37, 0.8) 0%, rgba(0, 0, 37, 0.4) 100%)",
      }}
    >
      {/* Gradient bottom border */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full rounded-b-[20px] opacity-50"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #3F84B9 20%, #D467B9 80%, transparent 100%)",
        }}
      />

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
        <div className="text-right">
          <div className="text-white text-[32px] font-bold leading-none tracking-tight">
            {score}
          </div>
          <div className="mt-1 text-white/50 text-[11px] font-bold tracking-widest uppercase">
            {tier}
          </div>
        </div>

        {/* Time pill */}
        <div className="hidden xl:flex flex-col items-end gap-1 min-w-[80px]">
          <div className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <img src="/time.svg" alt="" className="w-3 h-3" />
            {timeAgo}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectRow;
