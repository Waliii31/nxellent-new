import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LandingNav } from "../components/sections/landing/LandingNav";
import { LandingHeroSection } from "../components/sections/landing/LandingHeroSection";
import { LandingHowItWorksSection } from "../components/sections/landing/LandingHowItWorksSection";
import { LandingValueAndLeaderboardSection } from "../components/sections/landing/LandingValueAndLeaderboardSection";
import { LandingFAQSection } from "../components/sections/landing/LandingFAQSection";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#020c30] overflow-hidden w-full flex flex-col relative">

      {/* Ambient drifting background orbs */}
      <motion.div
        className="pointer-events-none absolute top-[200px] left-[-120px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(120,0,200,0.11) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-[100px] right-[-80px] w-[260px] h-[260px] md:w-[420px] md:h-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,62,196,0.08) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="pointer-events-none absolute top-[1200px] right-[100px] w-[240px] h-[240px] md:w-[360px] md:h-[360px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(63,132,185,0.08) 0%, transparent 70%)", filter: "blur(50px)" }}
        animate={{ x: [0, 25, 0], y: [0, -35, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />

      {/* Navigation */}
      <LandingNav />

      {/* Hero — 2-col: copy left, animated code scan right */}
      <LandingHeroSection />

      {/* How It Works */}
      <div className="px-5 sm:px-10 md:px-16 lg:px-[120px] py-10 md:py-20">
        <LandingHowItWorksSection />
      </div>

      {/* Divider glow line */}
      <motion.div
        className="w-full max-w-[900px] mx-auto h-px opacity-30"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(220,10,250,0.8) 50%, transparent 100%)" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Value + Leaderboard */}
      <div className="px-5 sm:px-10 md:px-16 lg:px-[120px] pt-10 md:pt-[60px]">
        <LandingValueAndLeaderboardSection />
      </div>

      {/* FAQ */}
      <LandingFAQSection />

      {/* Footer */}
      <motion.footer
        className="flex flex-col md:flex-row w-full items-start justify-center px-5 sm:px-10 md:px-16 lg:px-[120px] py-10 md:py-[60px] gap-10 md:gap-0 relative bg-[linear-gradient(180deg,rgba(68,49,73,0.2)_0%,rgba(14,10,15,0)_100%)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9 }}
      >
        {/* Left: Brand info */}
        <div className="relative flex-1 flex flex-col gap-0">
          <div className="flex items-center">
            <img src="/Nxellent-logos/desktop_logo_SVG_160x50.svg" alt="Nxellent Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="mt-[24px] max-w-[452px] flex items-center font-['Alexandria',Helvetica] font-light text-white text-sm md:text-base tracking-[0] leading-[normal]">
            Instant cyber due diligence for your code. Security scoring for the audit-ready age.
          </div>
          <div className="mt-10 md:mt-[70px] flex items-center opacity-50 font-['Alexandria',Helvetica] font-light text-white text-xs md:text-base tracking-[0] leading-[normal]">
            © 2024 NXELLENT Platform. Built for teams who care about shipping secure code.
          </div>
        </div>

        {/* Right: Nav links */}
        <nav className="inline-flex flex-col items-start gap-6 md:gap-10 relative flex-[0_0_auto]">
          {[{ label: "Leaderboard", href: "/leaderboard" }, { label: "How It Works", href: "/how-it-works" }, { label: "Pricing", href: "/pricing" }].map((link, index) => (
            <motion.div
              key={index}
              className="inline-flex flex-col items-start justify-center gap-8 relative flex-[0_0_auto]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div
                  className="relative flex items-center w-fit -mt-px font-['Alexandria',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(link.href)}
                >
                  {link.label}
                </div>
                <img className="relative w-3 h-3" alt="Frame" src="/figmaAssets/frame.svg" />
              </div>
            </motion.div>
          ))}
        </nav>
      </motion.footer>
    </div>
  );
};

export default Home;
