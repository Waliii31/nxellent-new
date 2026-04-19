import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../components/sections/Navbar";
import CtaSection from "../components/sections/CtaSection";
import LeaderHero from "../components/sections/LeaderHero";
import SmartContracts from "../components/sections/SmartContracts";
import Footer from "../components/sections/Footer";

const Leaderboard = () => {
  return (
    <div className="bg-[#020C30] overflow-hidden w-full flex flex-col relative">
      {/* Ambient drifting background orbs */}
      <motion.div
        className="pointer-events-none fixed top-[100px] left-[-150px] w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(120,0,200,0.12) 0%, transparent 70%)", filter: "blur(70px)" }}
        animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none fixed top-[300px] right-[-120px] w-[300px] h-[300px] md:w[480px] md:h-[480px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(255,62,196,0.09) 0%, transparent 70%)", filter: "blur(65px)" }}
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="pointer-events-none fixed bottom-[100px] right-[50px] w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full z-0"
        style={{ background: "radial-gradient(circle, rgba(63,132,185,0.08) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ x: [0, 30, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Animated dot grid background */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: "radial-gradient(circle, rgba(140,80,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Navigation */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <LeaderHero />
      </div>

      {/* Animated divider glow line */}
      <motion.div
        className="w-full max-w-[1200px] mx-auto h-px opacity-30 relative z-10"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(220,10,250,0.6) 50%, transparent 100%)" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Smart Contracts / Leaderboard Section */}
      <div className="relative z-10">
        <SmartContracts />
      </div>

      {/* Animated divider glow line before CTA */}
      <motion.div
        className="w-full max-w-[1200px] mx-auto h-px opacity-30 relative z-10"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(220,10,250,0.6) 50%, transparent 100%)" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* CTA Section with fade-in animation */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <CtaSection
          heading={
            <>
              READY TO SEE <br /> WHERE YOU RANK?
            </>
          }
          primary={{
            label: "Submit Your Project",
            icon: <ArrowUpRight size={16} />,
            whereTo: "projects/my-projects",
          }}
        />
      </motion.div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Leaderboard;
