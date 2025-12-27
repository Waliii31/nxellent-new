import React from "react";
import { Search } from "lucide-react";

type Props = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function SearchInput({
  placeholder = "Search projects, IDs, repos...",
  className = "",
  value,
  onChange,
}: Props): React.ReactElement {
  return (
    <div className={["relative w-full md:w-auto grow max-w-3xl", className].join(" ")}> 
      <Search
        size={18}
        className="absolute text-[#A19DAF] left-4 top-1/2 -translate-y-1/2 pointer-events-none"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full jakarta rounded-[40px] pl-10 pr-4 py-3 text-sm
          border border-[#272744] bg-[#0B0B2A]
          text-[#A19DAF] placeholder-[#A19DAF]
          shadow-[0_0_6px_rgba(0,0,0,0.25)]
          focus:ring-2 focus:ring-[#A501FF] focus:outline-none
          transition-all duration-200
        `}
      />
    </div>
  );
}
