import React from "react";

export const GLOW_CARD_CLASS = [
  "w-full rounded-2xl border border-[#2A2355]",
  "bg-[#000124]",
  "shadow-[0_0_40px_0_#A855F733]",
  "relative overflow-hidden",
  "p-8 md:p-12",
].join(" ");

export const GLOW_CARD_STYLE: React.CSSProperties = {
  borderTop: "1px solid #A855F733",
  boxShadow: "0px 0px 40px 0px #A855F733",
  background:
    "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%)",
  backgroundColor: "#000124",
};

type GlowCardProps = {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function GlowCard({ className = "", children, style }: GlowCardProps) {
  return (
    <div className={[GLOW_CARD_CLASS, className].join(" ")} style={{ ...GLOW_CARD_STYLE, ...style }}>
      {children}
    </div>
  );
}
