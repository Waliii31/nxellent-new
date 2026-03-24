import React from "react";

type PageHeaderBarProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaIcon: React.ReactNode;
  ctaOnClick?: () => void;
  backHref?: string;
};

export default function PageHeaderBar({
  title,
  subtitle,
  ctaLabel,
  ctaIcon,
  ctaOnClick,
}: PageHeaderBarProps) {
  return (
    <>
      <header className="max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center py-10 mx-auto px-4 gap-4">
        <div>
          <span className="urbanist text-white font-bold text-3xl font-anybody ">{title}</span>
          <div className="text-white/70 font-normal text-lg font-urbanist">{subtitle}</div>
        </div>

        <button
          onClick={ctaOnClick}
          className="cursor-pointer relative px-6 md:px-10 py-3 md:py-4 rounded-[58px] bg-[linear-gradient(90deg,#FFC857_0%,#FF8A3C_35%,#FF3EC4_80%,#FF0040_100%)] text-[#333333] text-sm md:text-md font-medium flex items-center justify-center gap-2.5 transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_10px_rgba(255,0,64,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-plus-jakarta-sans w-full sm:w-auto"
        >
          {ctaIcon}
          <span>{ctaLabel}</span>
        </button>
      </header>
    </>
  );
}
