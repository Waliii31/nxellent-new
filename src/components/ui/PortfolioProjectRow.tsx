import React from "react"
import { Eye, Star } from "lucide-react"
import TagPill from "./TagPill"

type PortfolioProjectRowProps = {
  project: string
  track: string
  chain: string
  score: number
  tier: string
  change: string
  lastScan: string
  flags: string[]
}

const PortfolioProjectRow: React.FC<PortfolioProjectRowProps> = ({
  project,
  track,
  chain,
  score,
  tier,
  change,
  lastScan,
  flags,
}) => {
  const isPositive = change.startsWith("+")

  return (
    <tr className="border-t border-white/5 hover:bg-white/5 transition">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <p className="inter text-sm text-white">{project}</p>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <TagPill label={track} variant="secondary" />
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <TagPill label={chain} variant="primary" />
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div
            className="
              relative flex items-center justify-center
              w-10 h-10 rounded-full
              bg-linear-to-tr from-[#FB37FF] via-[#F97316] to-[#22D3EE]
              shadow-[0_0_16px_rgba(248,113,113,0.7)]
            "
          >
            <div className="w-8 h-8 rounded-full bg-[#020617] flex items-center justify-center">
              <span className="urbanist text-xs text-white font-semibold">
                {score}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#9CA3AF] inter">Platinum</span>
            <span className="text-[10px] text-[#6B7280] inter">{tier}</span>
          </div>
        </div>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <span
          className={`inter text-sm ${
            isPositive ? "text-[#22C55E]" : "text-[#F97316]"
          }`}
        >
          {change}
        </span>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <span className="inter text-xs text-[#9CA3AF]">{lastScan}</span>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-2">
          {flags.map((flag) => (
            <TagPill key={flag} label={flag} variant="outline" />
          ))}
        </div>
      </td>

      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3 text-[#F9A8D4]">
          <button type="button" className="hover:text-white transition">
            <Eye size={16} />
          </button>
          <button type="button" className="hover:text-white transition">
            <Star size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default PortfolioProjectRow
