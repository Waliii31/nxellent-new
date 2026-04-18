import { motion } from "framer-motion";
import { LandingNav } from "../components/sections/landing/LandingNav";
import { LandingHeroSection } from "../components/sections/landing/LandingHeroSection";
import { LandingHowItWorksSection } from "../components/sections/landing/LandingHowItWorksSection";
import { LandingValueAndLeaderboardSection } from "../components/sections/landing/LandingValueAndLeaderboardSection";
import { LandingFAQSection } from "../components/sections/landing/LandingFAQSection";
import Footer from "../components/sections/Footer";

const Home = () => {

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
      <Footer />
    </div>
  );
};

export default Home;
