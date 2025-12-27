import React from "react"

type CriticalIssueCardProps = {
  title: string
  description: string
  colors?: string
}

const CriticalIssueCard: React.FC<CriticalIssueCardProps> = ({
  title,
  description,
  colors = "#EF4444"
}) => {
  return (
    <div className="w-full rounded-2xl py-5 px-5 overflow-hidden relative mt-3 first:mt-7 border border-[#EC489926]">
      <div className="absolute w-2 left-0 h-full top-0" style={{ backgroundColor: colors }} />
      <div className="flex justify-start items-start">
        <div>
          <h1 className="inter font-normal text-white text-md">{title}</h1>
          <p className="inter font-normal text-[#90A1B9] text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CriticalIssueCard
