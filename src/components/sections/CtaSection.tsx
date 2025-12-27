import React from "react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import ScrollReveal from "../animations/ScrollReveal";

type CtaSectionProps = {
  heading?: React.ReactNode; // ✅ changed from string to React.ReactNode
  primary: {
    label: React.ReactNode;
    icon?: React.ReactNode;
    whereTo?: string;
    type?: "button" | "submit" | "reset";
  };
  secondary?: {
    label: React.ReactNode;
    icon?: React.ReactNode;
    whereTo?: string;
    type?: "button" | "submit" | "reset";
  };
  className?: string;
};


const CtaSection: React.FC<CtaSectionProps> = ({
  heading,
  primary,
  secondary,
  className,
}) => {
  return (
    <section className={["w-full py-10 sm:py-12 md:py-16", className || ""].join(" ")}>
      <ScrollReveal className="mx-auto max-w-7xl">
        {/* Panel with background image */}
        <div
          className="
            w-full rounded-[28px] sm:rounded-4xl overflow-hidden
            py-10 sm:py-12 md:py-36
            grid place-items-center
          "
          style={{
            backgroundImage: `url(/cta-bg.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Optional subtle overlay to improve contrast on any bg */}
          <div className="absolute inset-0 bg-[rgba(0,0,33,0.20)] pointer-events-none" />

          {/* Content */}
          <div className="flex flex-col items-center gap-6 sm:gap-7 md:gap-8 text-center">
            {/* Heading (Alexandria, uppercase, 54px @ md) */}
            <h2
              className="
                text-white uppercase
                text-[28px] sm:text-[36px] md:text-[54px]
                leading-[100%] tracking-[-0.02em] font-normal
              "
            >
              {heading}
            </h2>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <PrimaryButton
                whereTo={primary.whereTo}
                icon={primary.icon}
                type={primary.type}
              >
                {primary.label}
              </PrimaryButton>

              {/* Secondary button is optional */}
              {secondary && (
                <SecondaryButton
                  whereTo={secondary.whereTo}
                  icon={secondary.icon}
                  type={secondary.type}
                >
                  {secondary.label}
                </SecondaryButton>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default CtaSection;
