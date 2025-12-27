import React from "react"
import { AlertTriangle } from "lucide-react"

type AlertItemProps = {
  title: string
  description: string
}

const AlertItem: React.FC<AlertItemProps> = ({ title, description }) => {
  return (
    <div className="w-full rounded-2xl px-4 py-4 bg-linear-to-r from-[#301524] via-[#1B1030] to-[#111827] border border-[#F97316]/40 flex items-start gap-3">
      <div className="mt-0.5">
        <AlertTriangle size={18} className="text-[#F97316]" />
      </div>
      <div>
        <p className="inter text-sm text-white font-medium">{title}</p>
        <p className="inter text-xs text-[#FBBF24]/80 mt-1">
          {description}
        </p>
      </div>
    </div>
  )
}

export default AlertItem
