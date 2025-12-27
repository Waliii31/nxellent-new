import { ArrowUpRight } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { fadeInUp, rippleIn, staggerContainer } from "../../animations";

const PricingHero = () => {
  const scrollToInvestors = () => {
    const el = document.getElementById("investor-plans");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative isolate w-full">
      {/* Navbar */}
      <div className="relative z-30">
        <Navbar isFixed={false} />
      </div>

      {/* Background image */}
      <img
        src="/all-hero.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <motion.div
        className="
          relative z-20
          mx-auto max-w-5xl
          px-4 sm:px-6 md:px-8 lg:px-10
          pt-24 sm:pt-28 md:pt-32
          pb-10 sm:pb-14 md:pb-20
          min-h-[70vh] sm:min-h-[72vh] md:min-h-[75vh]
          flex flex-col items-center justify-end text-center
        "
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="
            text-white font-semibold font-[anybody ]
            text-[28px] leading-tight
            sm:text-[36px] sm:leading-[1.15]
            md:text-[44px]
            lg:text-[52px]
            tracking-[-0.01em]
          "
          variants={rippleIn}
        >
          Cyber Security you can <br className="hidden sm:block" />
          measure — with NXELLENT.
        </motion.h1>

        <motion.p
          className="
            text-white/90 font-light mt-3 sm:mt-4 md:mt-5
            font-[Alexandria]
            text-[14px] sm:text-[16px] md:text-[18px]
            leading-relaxed tracking-[-0.02em]
            max-w-2xl
          "
          variants={fadeInUp}
        >
          Choose the plan that matches your risk. From founders to funds, NXELLENT is the
          standard for code security.
        </motion.p>

        <motion.div
          className="
            mt-5 flex flex-col items-stretch gap-3
            sm:flex-row sm:items-center sm:justify-center
          "
          variants={fadeInUp}
        >
          <PrimaryButton
            icon={<ArrowUpRight size={16} />}
            whereTo="projects/my-projects"
          >
            Start Free Scan
          </PrimaryButton>
          <SecondaryButton onClick={scrollToInvestors}>
            View Investor Plans
          </SecondaryButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PricingHero;
