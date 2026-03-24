import { CodeXml, Smartphone } from "lucide-react";
import React, { useState } from "react";

type SegmentedToggleProps = {
  defaultValue?: "smart" | "vibe";
  onChange?: (v: "smart" | "vibe") => void;
};

const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  defaultValue = "smart",
  onChange,
}) => {
  const [value, setValue] = useState<"smart" | "vibe">(defaultValue);

  const handle = (v: "smart" | "vibe") => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <div
      role="tablist"
      className="
        relative inline-flex items-center
        rounded-[999px] p-1 my-7
        border border-[#FD7EFF]
        shadow-[0_0_6px_rgba(0,0,0,0.15)]
        overflow-hidden
        backdrop-blur-md
      "
      style={{ background: "linear-gradient(180deg,#3B0C7A 0%, #2B0B68 100%)" }}
    >
      {/* Sliding pink pill — no overflow on either side */}
      <div
        className={[
          "absolute inset-y-1 rounded-[999px] w-1/2",
          "bg-gradient-to-r from-[#FFC857] via-[#FF8A3C] to-[#FF0040]",
          "transition-all duration-300 ease-out",
          value === "smart" ? "left-1 right-auto" : "right-1 left-auto",
        ].join(" ")}
        style={{ willChange: "left,right" }}
      />

      {/* Smart Contracts */}
      <button
        role="tab"
        aria-selected={value === "smart"}
        onClick={() => handle("smart")}
        className="
          relative z-10 flex items-center justify-center
          px-5 sm:px-6 py-2.5 min-w-[170px] sm:min-w-[190px]
          rounded-[999px] transition-colors
        "
      >
        <span
          className={[
            "inline-flex items-center gap-2",
            "text-[15px] sm:text-[16px]",
            value === "smart"
              ? "text-[#090123] font-medium inter"
              : "text-white/80 font-medium font-['Plus Jakarta Sans']",
          ].join(" ")}
        >
          <CodeXml size={16} strokeWidth={2} />
          <span>Smart Contracts</span>
        </span>
      </button>

      {/* Vibe-Coded Apps */}
      <button
        role="tab"
        aria-selected={value === "vibe"}
        onClick={() => handle("vibe")}
        className="
          relative z-10 flex items-center justify-center
          px-5 sm:px-6 py-2.5 min-w-[170px] sm:min-w-[190px]
          rounded-[999px] transition-colors
        "
      >
        <span
          className={[
            "inline-flex items-center gap-2",
            "text-[15px] sm:text-[16px]",
            value === "vibe"
              ? "text-[#090123] font-medium inter"
              : "text-white/80 font-medium font-['Plus Jakarta Sans']",
          ].join(" ")}
        >
          <Smartphone size={16} strokeWidth={2} />
          <span>Vibe-Coded Apps</span>
        </span>
      </button>
    </div>
  );
};

export default SegmentedToggle;
