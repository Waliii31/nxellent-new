import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

type FilterDropdownProps = {
  value: string
  options: string[]
  onChange: (val: string) => void
  menuWidthClass?: string // e.g. "w-44" / "w-48"
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  options,
  onChange,
  menuWidthClass = "w-44",
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          px-6 py-2.5 rounded-full
          bg-transparent
          border border-[#A855F7]
          text-xs sm:text-sm text-white
          flex items-center gap-2
        "
      >
        <span className="urbanist truncate max-w-[140px] sm:max-w-[180px]">
          {value}
        </span>
        <ChevronDown className="w-4 h-4 shrink-0" />
      </button>

      {open && (
        <div
          className={[
            "absolute right-0 mt-2 rounded-xl bg-[#040029] border border-[#2A2355] shadow-lg z-20 max-h-56 overflow-y-auto",
            menuWidthClass,
          ].join(" ")}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-xs sm:text-sm text-white/90 hover:bg-white/5 ${
                opt === value ? "text-[#A855F7]" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
