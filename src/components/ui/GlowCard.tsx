import React from "react";
import { GLOW_CARD_CLASS, GLOW_CARD_STYLE } from "./GlowCardStyles";

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
