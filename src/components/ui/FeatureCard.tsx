import React from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  imgSrc: string;
  alt?: string;
  className?: string;
  background?: string; // custom gradient background per card
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  imgSrc,
  alt,
  className,
  background = "linear-gradient(180deg, #02002B 0%, #000234 100%)",
}) => {
  return (
    <article
      className={[
        "relative flex flex-col justify-start rounded-[20px]",
        // "min-h-[520px] sm:min-h-[560px] md:min-h-[580px]",
        "p-6 sm:p-8 lg:p-10",
        "backdrop-blur-[194px]",
        "transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(63,132,185,0.25)]",
        className || "",
      ].join(" ")}
      style={{ background }}
    >
      {/* Gradient bottom border */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[5px] w-full rounded-b-[20px]"
        style={{
          background:
            "linear-gradient(270.12deg, #3F84B9 23.84%, #D467B9 99.89%)",
        }}
      />

      {/* ===== Image Section ===== */}
      <div className="mb-8 sm:mb-10 grid place-items-center">
        <div className="w-full">
          <img
            src={imgSrc}
            alt={alt || title}
            className="w-full object-contain select-none"
            loading="lazy"
          />
        </div>
      </div>

      {/* ===== Text Content ===== */}
      <div className="flex flex-col items-start text-left md:items-start md:text-left gap-3 sm:gap-4">
        <h2 className="anybody  text-white text-[20px] sm:text-[22px] md:text-[24px] font-normal tracking-[-0.01em]">
          {title}
        </h2>

        <p className="alexandria text-white/80 font-normal text-[15px] sm:text-[13px] md:text-[14px] leading-[160%] tracking-[-0.01em]  max-w-[90%] md:max-w-[95%]">
          {description}
        </p>
      </div>
    </article>
  );
};

export default FeatureCard;
