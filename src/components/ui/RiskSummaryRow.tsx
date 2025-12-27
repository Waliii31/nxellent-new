import React from "react"

type RiskSummaryRowProps = {
  label: string
  value: number | string
}

const RiskSummaryRow: React.FC<RiskSummaryRowProps> = ({ label, value }) => {
  return (
    <div className="w-full p-3.5 border border-[#EC489926] rounded-lg flex justify-between items-center">
      <h3 className="inter font-normal text-white">{label}</h3>
      <h1 className="inter font-normal text-[#90A1B9]">{value}</h1>
    </div>
  )
}

export default RiskSummaryRow
