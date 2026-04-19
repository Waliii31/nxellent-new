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

function PricingVisual() {
  return (
    <div
      className="relative w-full max-w-[480px] lg:max-w-none h-[360px] md:h-[460px] rounded-2xl border border-[#ffffff0f] flex flex-col items-center justify-center p-6 overflow-hidden mx-auto lg:mx-0"
      style={{ background: "linear-gradient(145deg, rgba(4,4,30,0.97) 0%, rgba(2,0,40,0.97) 100%)" }}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,62,196,0.2) 0%, transparent 60%)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[280px] md:max-w-[320px] rounded-2xl border border-white/10 p-6 flex flex-col gap-5 shadow-2xl backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.03)" }}
        initial={{ y: 30, opacity: 0, rotateX: 20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.9, type: "spring", bounce: 0.3 }}
        whileHover={{ y: -6, scale: 1.02 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-white/50 text-xs font-['Alexandria',Helvetica] uppercase tracking-widest">Syndicate</span>
            <span className="text-white font-['Anybody',Helvetica] text-3xl md:text-4xl font-bold mt-1">$499<span className="text-sm font-light text-white/50">/mo</span></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,rgba(255,200,87,1),rgba(255,62,196,1))] flex items-center justify-center shadow-[0_0_15px_rgba(255,62,196,0.5)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 my-1" />

        <div className="flex flex-col gap-3">
          {[
            { label: "Unlimited API scans", active: true },
            { label: "Deep AI reasoning pass", active: true },
            { label: "Dedicated support channel", active: true },
            { label: "Custom rules engine", active: false }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${feature.active ? 'bg-[#dc0afa22] border border-[#dc0afa55]' : 'bg-white/5 border border-white/10'}`}>
                {feature.active && <div className="w-1.5 h-1.5 bg-[#dc0afa] rounded-full" />}
              </div>
              <span className={`text-[13px] font-['Alexandria',Helvetica] ${feature.active ? 'text-white/80' : 'text-white/30'}`}>{feature.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-3 w-full py-3 rounded-xl border border-[#dc0afa44] flex items-center justify-center text-[#dc0afa] text-sm font-semibold cursor-pointer"
        >
          Select plan
        </motion.div>
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-[10%] right-[10%] w-14 h-14 md:w-16 md:h-16 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center z-0"
        animate={{ y: [-15, 10, -15], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-2xl">🛡️</span>
      </motion.div>

      <motion.div
        className="absolute bottom-[10%] left-[8%] w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center z-0 shadow-lg"
        animate={{ y: [12, -15, 12], rotate: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <span className="text-xl">⚡</span>
      </motion.div>
    </div>
  )
}

const PricingHero = () => {
  const scrollToInvestors = () => {
    const el = document.getElementById("investor-plans");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative w-full overflow-hidden flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-5 sm:px-10 md:px-16 lg:px-[120px] pt-12 pb-24 md:pt-20 md:pb-32 min-h-0 lg:min-h-[700px]">

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

      {/* Content Left */}
      <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left flex-1 justify-center w-full min-w-0 pt-10">

        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff44] bg-[#dc0afa12] mb-5">
          <motion.span className="w-2 h-2 rounded-full bg-[#dc0afa]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-xs md:text-sm tracking-widest uppercase">Pricing Plans</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} className="font-['Anybody',Helvetica] font-semibold text-white text-[38px] sm:text-[48px] md:text-[58px] lg:text-[68px] leading-[1.1] md:leading-[1.15] tracking-[-1px] max-w-[600px]">
          Cyber Security you<br />
          <span style={gradientText}>can measure.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="font-['Alexandria',Helvetica] font-light text-[#ffffffb3] text-base md:text-xl mt-5 mb-8 max-w-[540px] leading-relaxed">
          Choose the plan that matches your risk. From founders to funds, NXELLENT is the standard for code security.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-start">
          <PrimaryButton icon={<ArrowUpRight size={16} />} whereTo="projects/my-projects">
            Start Free Scan
          </PrimaryButton>
          <SecondaryButton onClick={scrollToInvestors}>
            View Investor Plans
          </SecondaryButton>
        </motion.div>
      </div>

      {/* Visual Right */}
      <motion.div
        className="relative z-10 w-full lg:w-[48%] flex items-center justify-center lg:justify-end mt-4 lg:mt-0"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <PricingVisual />
      </motion.div>
    </section>
  );
};

export default PricingHero;
