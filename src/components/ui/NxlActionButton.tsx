import React from "react"

type NxlActionButtonProps = {
  icon: React.ReactNode
  label: string
}

const NxlActionButton: React.FC<NxlActionButtonProps> = ({ icon, label }) => {
  return (
    <button
      type="button"
      className="
        w-full flex items-center justify-between
        rounded-full border border-[#F472B6]/60
        px-4 py-3 text-sm inter
        text-[#F9A8D4]
        bg-linear-to-r from-[#180624] via-[#0B0824] to-[#050816]
        shadow-[0_0_20px_rgba(236,72,153,0.45)]
        hover:opacity-90 transition
      "
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wide text-[#F9A8D4]/70">
        View
      </span>
    </button>
  )
}

export default NxlActionButton
