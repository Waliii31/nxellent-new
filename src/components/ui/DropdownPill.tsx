"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  label: string;                  // e.g. "Type: All"
  options?: string[];             // dropdown options
  onSelect?: (value: string) => void;
  className?: string;
};

export default function DropdownPill({
  label,
  options = ["All", "Public", "Private"],
  onSelect,
  className = "",
}: Props): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(label);
  }, [label]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(`${label.split(":")[0]}: ${value}`);
    setOpen(false);
    if (onSelect) onSelect(value);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "rounded-full px-7 py-3 flex items-center gap-2 text-sm transition-all duration-200",
          "text-white/90 hover:text-white",
          "backdrop-blur-md",
          "border border-[#FD7EFF]/70",
          "shadow-[0_0_6px_0_#00000026]",
          "bg-black/10",
        ].join(" ")}
        style={{
          border: "0.5px solid #FD7EFF",
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      >
        <span>{selected}</span>
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute mt-2 right-0 min-w-[140px] bg-[#0A0018]/90 backdrop-blur-xl border border-[#FD7EFF]/40 rounded-xl shadow-[0_0_10px_#00000026] z-50 overflow-hidden"
          style={{ boxShadow: "0px 0px 6px 0px #00000026" }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-[#FD7EFF]/10 hover:text-white transition"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
