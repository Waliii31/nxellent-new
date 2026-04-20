import { ArrowUpRight } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import { motion } from "framer-motion";

const gradientText = {
  background: "linear-gradient(90deg, rgba(255,200,87,1) 0%, rgba(255,62,196,1) 55%, rgba(140,80,255,1) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const PricingHero = () => {
  const scrollToInvestors = () => {
    const el = document.getElementById("investor-plans");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center px-5 sm:px-10 md:px-16 lg:px-[120px] pt-12 pb-24 md:pt-20 md:pb-32 min-h-0 lg:min-h-[600px]">

      {/* Animated ambient orbs */}
      <motion.div className="pointer-events-none absolute top-[-100px] right-[-100px] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full z-0"
        style={{ background: "radial-gradient(circle,rgba(255,62,196,0.1) 0%,transparent 70%)", filter: "blur(80px)" }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div className="pointer-events-none absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full z-0"
        style={{ background: "radial-gradient(circle,rgba(120,0,200,0.15) 0%,transparent 70%)", filter: "blur(70px)" }}
        animate={{ x: [0, 25, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }} />

      {/* Animated dot-grid background */}
      <motion.div className="absolute inset-0 pointer-events-none z-0"
        style={{ backgroundImage: "radial-gradient(circle,rgba(140,80,255,0.13) 1px,transparent 1px)", backgroundSize: "38px 38px" }}
        animate={{ opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

      {/* Horizontal scan beam */}
      <motion.div className="absolute top-0 left-0 w-full h-px pointer-events-none z-0"
        style={{ background: "linear-gradient(90deg,transparent 0%,rgba(220,10,250,0.25) 50%,transparent 100%)" }}
        animate={{ top: ["-1px", "100%"] }} transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 1 }} />

      {/* Content Center */}
      <div className="relative z-10 flex flex-col items-center text-center flex-1 justify-center w-full min-w-0 pt-10">

        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff44] bg-[#dc0afa12] mb-5">
          <motion.span className="w-2 h-2 rounded-full bg-[#dc0afa]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-xs md:text-sm tracking-widest uppercase">Pricing Plans</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} className="font-['Anybody',Helvetica] font-semibold text-white text-[38px] sm:text-[48px] md:text-[58px] lg:text-[68px] leading-[1.1] md:leading-[1.15] tracking-[-1px] max-w-[800px]">
          Cyber Security you<br />
          <span style={gradientText}>can measure.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="font-['Alexandria',Helvetica] font-light text-[#ffffffb3] text-base md:text-xl mt-5 mb-8 max-w-[640px] leading-relaxed">
          Choose the plan that matches your risk. From founders to funds, NXELLENT is the standard for code security.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <PrimaryButton icon={<ArrowUpRight size={16} />} whereTo="projects/my-projects">
            Start Free Scan
          </PrimaryButton>
          <SecondaryButton onClick={scrollToInvestors}>
            View Investor Plans
          </SecondaryButton>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingHero;
