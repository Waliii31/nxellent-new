import Navbar from "./Navbar"
import PrimaryButton from "../ui/PrimaryButton"
import SecondaryButton from "../ui/SecondaryButton"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, rippleIn } from "../../animations"

const HeroSection = () => {
  return (
    <section
      // Keep your desktop height; only tweak for small screens
      className="relative w-full min-h-svh md:h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      {/* Dark overlay (a touch stronger on mobile for contrast) */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/10" />

      {/* Navbar (unchanged) */}
      <div className="relative z-30">
        <Navbar isFixed={true} />
      </div>

      {/* Hero Content */}
      <motion.div
        className="relative z-20 flex flex-col items-start justify-center w-full my-auto max-w-7xl mx-auto px-4 sm:px-6 text-white"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Add top padding only on small screens so text never overlaps navbar */}
        <div className="max-w-xl pt-24 md:pt-0 space-y-6">
          <motion.h1
            className="anybody font-medium font-anybody leading-tight text-4xl sm:text-5xl md:text-6xl"
            variants={rippleIn}
          >
            Instant cyber <br className="hidden md:block" />
            due diligence <br className="hidden md:block" />
            for your code
          </motion.h1>

          <motion.p
            className="alexandria text-white/80 text-base sm:text-lg"
            variants={fadeInUp}
          >
            Scan your code, get a risk score, and know exactly
            <br className="hidden md:block" /> where your vulnerabilities are
            before attackers find <br className="hidden md:block" /> them.
          </motion.p>

          {/* Buttons: stack on mobile, row on md+ */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <PrimaryButton
              icon={<ArrowUpRight size={16} />}
              whereTo="projects/my-projects"
            >
              Run Full Scan
            </PrimaryButton>

            <SecondaryButton whereTo="leaderboard">
              View Leaderboard
            </SecondaryButton>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
