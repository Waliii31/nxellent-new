import React from "react"

type ScoreDistributionRowProps = {
  label: string
  projects: number
  percent: string
  gradient: string
}

const ScoreDistributionRow: React.FC<ScoreDistributionRowProps> = ({
  label,
  projects,
  percent,
  gradient,
}) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 w-full">
      {/* range label */}
      <div className="w-16 sm:w-20 inter text-xs sm:text-sm text-white/90">
        {label}
      </div>

      {/* bar */}
      <div className="flex-1 relative h-6 rounded-full bg-[#383838]/10 border border-white/5 shadow-[0px_0px_6px_0px_#00000026] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: percent,
            background: gradient,
          }}
        />
        <span className="absolute inset-y-0 right-3 flex items-center inter text-[10px] sm:text-xs text-white/80">
          {projects} projects
        </span>
      </div>

      {/* percentage */}
      <div className="w-10 sm:w-12 inter text-xs sm:text-sm text-white/90 text-right">
        {percent}
      </div>
    </div>
  )
}

export default ScoreDistributionRow
