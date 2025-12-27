import React from "react"

type TagPillProps = {
  label: string
  variant?: "primary" | "secondary" | "outline"
}

const TagPill: React.FC<TagPillProps> = ({ label, variant = "primary" }) => {
  const base =
    "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium"

  const styles: Record<typeof variant, string> = {
    primary:
      "bg-linear-to-r from-[#FF4FD8] to-[#F97316] text-white shadow-[0_0_16px_rgba(248,113,113,0.6)]",
    secondary:
      "bg-[#0B1237] text-[#E5E7EB] border border-white/10 shadow-[0_0_10px_rgba(59,130,246,0.45)]",
    outline:
      "border border-[#4B5563] text-[#E5E7EB] bg-transparent",
  }

  return <span className={`${base} ${styles[variant]}`}>{label}</span>
}

export default TagPill
