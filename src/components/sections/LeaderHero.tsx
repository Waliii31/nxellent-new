import { motion } from "framer-motion";
import SegmentedToggle from "../ui/SegmentedToggle";

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

function LeaderVisual() {
  return (
    <div
      className="relative w-full max-w-[480px] lg:max-w-none h-[340px] md:h-[420px] rounded-2xl border border-[#ffffff0f] flex flex-col items-center justify-end p-6 overflow-hidden mx-auto lg:mx-0"
      style={{ background: "linear-gradient(145deg, rgba(4,4,30,0.97) 0%, rgba(2,0,40,0.97) 100%)" }}
    >
      {/* Background radial for podium */}
      <div className="absolute bottom-0 w-[150%] h-[200px] bg-[radial-gradient(ellipse_at_top,rgba(220,10,250,0.15)_0%,transparent_70%)] blur-2xl pointer-events-none" />

      <div className="flex items-end gap-3 md:gap-5 h-full w-full justify-center relative z-10 pb-4">
        {/* Rank 2 */}
        <motion.div 
          className="w-[28%] flex flex-col items-center gap-3"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white font-bold text-sm shadow-xl backdrop-blur-sm">#2</div>
          <div className="w-full bg-[linear-gradient(180deg,rgba(100,200,255,0.8),rgba(100,200,255,0.1))] rounded-t-xl" style={{ height: "130px" }}></div>
        </motion.div>

        {/* Rank 1 */}
        <motion.div 
          className="w-[34%] flex flex-col items-center gap-3 relative"
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1, type: "spring", bounce: 0.4 }}
        >
          <motion.div 
            className="absolute -top-12 text-[#ffc857] text-3xl"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            👑
          </motion.div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#ffc857] shadow-[0_0_20px_rgba(255,200,87,0.4)]" style={{ background: "linear-gradient(135deg,rgba(255,200,87,1),rgba(255,138,60,1))" }}>
            <span className="text-[#333] font-bold text-xl">#1</span>
          </div>
          <div className="w-full bg-[linear-gradient(180deg,rgba(255,200,87,0.8),rgba(255,138,60,0.1))] rounded-t-xl" style={{ height: "190px" }}></div>
        </motion.div>

        {/* Rank 3 */}
        <motion.div 
          className="w-[28%] flex flex-col items-center gap-3"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
        >
           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white font-bold text-sm shadow-xl backdrop-blur-sm">#3</div>
          <div className="w-full bg-[linear-gradient(180deg,rgba(220,10,250,0.8),rgba(220,10,250,0.1))] rounded-t-xl" style={{ height: "100px" }}></div>
        </motion.div>
      </div>
      
      {/* Platform ground */}
      <div className="absolute bottom-0 w-full h-[2px] bg-[linear-gradient(90deg,transparent,rgba(220,10,250,1),transparent)] shadow-[0_0_15px_rgba(220,10,250,0.8)]" />
    </div>
  )
}

const LeaderHero = () => {
  return (
    <section className="relative w-full overflow-hidden flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-5 sm:px-10 md:px-16 lg:px-[120px] pt-12 pb-24 md:pt-20 md:pb-32 min-h-0 lg:min-h-[700px]">
      
      {/* Animated ambient orbs */}
      <motion.div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full z-0"
        style={{background:"radial-gradient(circle,rgba(120,0,200,0.15) 0%,transparent 70%)",filter:"blur(80px)"}}
        animate={{x:[0,30,0],y:[0,-20,0]}} transition={{duration:16,repeat:Infinity,ease:"easeInOut"}} />
      
      <motion.div className="pointer-events-none absolute top-[10%] right-[-100px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full z-0"
        style={{background:"radial-gradient(circle,rgba(255,62,196,0.1) 0%,transparent 70%)",filter:"blur(70px)"}}
        animate={{x:[0,-25,0],y:[0,30,0]}} transition={{duration:18,repeat:Infinity,ease:"easeInOut",delay:4}} />

      {/* Animated dot-grid background */}
      <motion.div className="absolute inset-0 pointer-events-none z-0"
        style={{backgroundImage:"radial-gradient(circle,rgba(140,80,255,0.13) 1px,transparent 1px)",backgroundSize:"38px 38px"}}
        animate={{opacity:[0.3,0.55,0.3]}} transition={{duration:6,repeat:Infinity,ease:"easeInOut"}} />

      {/* Horizontal scan beam */}
      <motion.div className="absolute top-0 left-0 w-full h-px pointer-events-none z-0"
        style={{background:"linear-gradient(90deg,transparent 0%,rgba(220,10,250,0.25) 50%,transparent 100%)"}}
        animate={{top:["-1px","100%"]}} transition={{duration:6,repeat:Infinity,ease:"linear"}} />

      {/* Content Left */}
      <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left flex-1 justify-center w-full min-w-0 pt-10">
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff44] bg-[#dc0afa12] mb-5">
          <motion.span className="w-2 h-2 rounded-full bg-[#dc0afa]" animate={{opacity:[1,0.3,1]}} transition={{duration:1.4,repeat:Infinity}} />
          <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-xs md:text-sm tracking-widest uppercase">Global Rank</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} className="font-['Anybody',Helvetica] font-semibold text-white text-[38px] sm:text-[48px] md:text-[58px] lg:text-[68px] leading-[1.1] md:leading-[1.15] tracking-[-1px] max-w-[600px]">
          See how the top <br />
          <span style={gradientText}>projects stack up.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="font-['Alexandria',Helvetica] font-light text-[#ffffffb3] text-base md:text-xl mt-5 mb-8 max-w-[540px] leading-relaxed">
          Get inspired. Get competitive. Explore the top tier projects and algorithms optimized for peak efficiency and security.
        </motion.p>
        
        <motion.div {...fadeUp(0.3)}>
          <SegmentedToggle />
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
        <LeaderVisual />
      </motion.div>
    </section>
  );
};

export default LeaderHero;
