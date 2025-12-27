import React from "react"

type MetricStatCardProps = {
  label: string
  iconSrc: string
  value: string
  accentText: string
  accentClassName?: string
}

const MetricStatCard: React.FC<MetricStatCardProps> = ({
  label,
  iconSrc,
  value,
  accentText,
  accentClassName = "text-white/70",
}) => {
  return (
    <div className="flex flex-col gap-3 px-6 py-4">
      <p className="text-sm text-white/80 inter">{label}</p>
      <div className="flex items-center gap-3">
        <img src={iconSrc} className="w-7 h-7" alt={label} />
        <p className="text-3xl font-semibold urbanist text-transparent bg-clip-text bg-linear-to-r from-[#BE0178] to-[#E830E8]">
          {value}
        </p>
      </div>
      <p className={`text-sm inter font-medium ${accentClassName}`}>
        {accentText}
      </p>
    </div>
  )
}

export default MetricStatCard
