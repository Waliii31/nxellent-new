import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Soft purple neon border/glow wrapper used around blocks */
export default function NeonGlowWrap({ children, className = "" }: Props) {
  return (
    <div
      className={[
        "rounded-2xl p-px",
        "bg-linear-to-br from-[#A855F780] via-[#8B5CF680] to-[#22D3EE80]",
        "shadow-[0_0_40px_0_rgba(168,85,247,0.55)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
