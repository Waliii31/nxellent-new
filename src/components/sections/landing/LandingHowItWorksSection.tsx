import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: (
      <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
        <motion.path
          d="M6 4h16l8 8v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
          stroke="#dc0afa"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
        />
        <motion.path
          d="M22 4v8h8"
          stroke="#dc0afa"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.9 }}
        />
        <motion.path
          d="M12 17h12"
          stroke="#a855f7"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.7, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
        />
        <motion.path
          d="M12 22h8"
          stroke="#a855f7"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 2.1, ease: "easeInOut", repeat: Infinity, repeatDelay: 4.1 }}
        />
      </svg>
    ),
    title: "Connect Your Code",
    description:
      "Link your GitHub repo or paste your smart contract address. We support Solidity, Rust, and more.",
  },
  {
    number: "02",
    icon: (
      <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
        <motion.circle
          cx="18"
          cy="18"
          r="13"
          stroke="#dc0afa"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
        />
        <motion.path
          d="M18 10v8l5 3"
          stroke="#dc0afa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.3 }}
        />
        <motion.circle
          cx="18"
          cy="18"
          r="2"
          fill="#dc0afa"
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ duration: 0.5, delay: 2, ease: "easeOut", repeat: Infinity, repeatDelay: 4 }}
        />
      </svg>
    ),
    title: "AI Scan Runs",
    description:
      "Our engine analyzes your code for vulnerabilities, logic flaws, and security anti-patterns in minutes.",
  },
  {
    number: "03",
    icon: (
      <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
        <motion.rect
          x="4"
          y="6"
          width="28"
          height="24"
          rx="3"
          stroke="#dc0afa"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
        />
        <motion.path
          d="M10 22l5-6 4 4 4-6 5 5"
          stroke="#dc0afa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.3, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.2 }}
        />
      </svg>
    ),
    title: "Get Your Score",
    description:
      "Receive a clear risk score, a ranked badge (Bronze to Platinum), and a detailed vulnerability breakdown.",
  },
];

// Floating particle component
const Particle = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full pointer-events-none"
    style={{
      left: x,
      top: y,
      background: "rgba(220,10,250,0.7)",
      boxShadow: "0 0 6px rgba(220,10,250,0.9)",
    }}
    animate={{
      y: [0, -18, 0],
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.5],
    }}
    transition={{
      duration: 2.4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const LandingHowItWorksSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full flex flex-col items-center gap-10 md:gap-16 py-10 overflow-hidden">

      {/* ── Background grid + scanlines ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(140,80,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(140,80,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Horizontal scanline sweep over grid */}
      <motion.div
        className="absolute left-0 w-full h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(220,10,250,0.25) 30%, rgba(100,180,255,0.3) 70%, transparent 100%)",
        }}
        animate={{ top: ["-2px", "100%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />

      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(140,0,220,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Heading ── */}
      <motion.div
        className="flex flex-col items-center gap-4 relative z-10 px-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Glitch-style heading */}
        <div className="relative">
          <div
            className="font-['Anybody',Helvetica] font-semibold text-white text-3xl sm:text-4xl md:text-5xl tracking-[0] leading-tight md:leading-[60px] text-center"
          >
            How It Works
          </div>
          {/* Glitch layer */}
          <motion.div
            className="absolute inset-0 font-['Anybody',Helvetica] font-semibold text-3xl sm:text-4xl md:text-5xl tracking-[0] leading-tight md:leading-[60px] text-center pointer-events-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(220,10,250,0.5)",
              clipPath: "inset(0 0 85% 0)",
            }}
            animate={{
              x: [0, -3, 2, 0],
              clipPath: [
                "inset(0 0 85% 0)",
                "inset(10% 0 75% 0)",
                "inset(80% 0 5% 0)",
                "inset(0 0 85% 0)",
              ],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{ duration: 0.15, delay: 3, repeat: Infinity, repeatDelay: 5 }}
          >
            How It Works
          </motion.div>
        </div>
        <div className="font-['Alexandria',Helvetica] font-normal text-[#ffffffcc] text-base md:text-xl tracking-[-0.40px] text-center max-w-[540px]">
          Three steps to know exactly where your code stands.
        </div>
      </motion.div>

      {/* ── Steps row ── */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-0 w-full max-w-[1100px] z-10 px-4">

        {/* Connecting line track — only on desktop */}
        <div
          className="absolute top-[52px] left-[calc(50%-290px)] h-[2px] w-[580px] rounded-full hidden md:block"
          style={{ background: "rgba(140,80,255,0.15)" }}
        />
        {/* Line draw animation */}
        <motion.div
          className="absolute top-[52px] left-[calc(50%-290px)] h-[2px] w-[580px] rounded-full hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(220,10,250,0.15) 0%, rgba(220,10,250,0.7) 50%, rgba(100,180,255,0.6) 100%)",
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
        />
        {/* Traveling orb along the line */}
        <motion.div
          className="absolute top-[44px] w-4 h-4 rounded-full z-20 hidden md:block"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(220,10,250,1) 50%, transparent 100%)",
            boxShadow: "0 0 16px 6px rgba(220,10,250,0.7)",
            left: "calc(50% - 290px)",
          }}
          animate={{
            x: [0, 580, 580],
            opacity: [0, 1, 0],
            scale: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2.8,
            delay: 1.8,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: "easeInOut",
          }}
        />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-4 md:gap-6 flex-1 px-4 md:px-8 relative z-10 max-w-[340px] md:max-w-none"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.2 + index * 0.22, ease: "easeOut" }}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
          >
            {/* Particles floating around the circle */}
            <div className="relative">
              <Particle x="8px"  y="10px"  delay={index * 0.5} />
              <Particle x="80px" y="5px"   delay={index * 0.5 + 0.6} />
              <Particle x="55px" y="85px"  delay={index * 0.5 + 1.1} />
              <Particle x="-5px" y="60px"  delay={index * 0.5 + 0.3} />

              {/* Step circle — pulsing glow + rotating gradient border */}
              <motion.div
                className="w-[80px] h-[80px] md:w-[104px] md:h-[104px] rounded-full flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, rgba(2,0,43,1) 0%, rgba(0,2,52,1) 100%)",
                  boxShadow: "0 0 30px rgba(220,10,250,0.18)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(220,10,250,0.18)",
                    "0 0 44px rgba(220,10,250,0.45)",
                    "0 0 20px rgba(220,10,250,0.18)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
              >
                {/* Rotating gradient ring */}
                <motion.div
                  className="absolute inset-[-2px] rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(220,10,250,0.9), rgba(100,180,255,0.7), rgba(220,10,250,0.1), rgba(220,10,250,0.9))",
                    WebkitMask:
                      "radial-gradient(circle at center, transparent calc(100% - 2px), white calc(100% - 2px))",
                    mask: "radial-gradient(circle at center, transparent calc(100% - 2px), white calc(100% - 2px))",
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                />
                {/* Inner dark fill */}
                <div
                  className="absolute inset-[2px] rounded-full"
                  style={{ background: "linear-gradient(135deg, rgba(2,0,43,1) 0%, rgba(0,2,52,1) 100%)" }}
                />
                {/* Icon */}
                <div className="relative z-10">{step.icon}</div>
              </motion.div>
            </div>

            {/* Step label */}
            <motion.div
              className="font-['Plus_Jakarta_Sans',Helvetica] font-bold text-[12px] md:text-[13px] tracking-[2.5px] uppercase"
              style={{
                background: "linear-gradient(270deg,rgba(252,245,250,0.7) 0%,rgba(220,10,250,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
            >
              STEP {step.number}
            </motion.div>

            {/* Title */}
            <div className="font-['Urbanist',Helvetica] font-semibold text-white text-xl md:text-2xl text-center tracking-[0] leading-[normal]">
              {step.title}
            </div>

            {/* Description */}
            <motion.div
              className="font-['Alexandria',Helvetica] font-light text-[#ffffffb3] text-sm md:text-base text-center leading-relaxed max-w-[280px]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, delay: 0.6 + index * 0.3 }}
            >
              {step.description}
            </motion.div>

            {/* Underline bar that fills in */}
            <motion.div
              className="h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(220,10,250,0.8) 0%, rgba(100,180,255,0.6) 100%)",
              }}
              initial={{ width: 0 }}
              whileInView={{ width: "60%" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.2, ease: "easeOut" }}
            />
          </motion.div>
        ))}
      </div>

      {/* ── CTA ── */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55, delay: 0.3 }}
      >
        {/* Glow pulse on wrapper */}
        <motion.div
          className="rounded-full"
          animate={{
            boxShadow: [
              "0px 0px 30px rgba(255,120,40,0.55)",
              "0px 0px 52px rgba(255,62,196,0.7)",
              "0px 0px 30px rgba(255,120,40,0.55)",
            ],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
        <motion.button
          onClick={() => navigate("/auth/signup")}
          className="w-[200px] md:w-[220px] h-[48px] md:h-[52px] gap-2 px-7 py-3 rounded-full shadow-[0px_0px_30px_#ff7828a6] bg-[linear-gradient(153deg,rgba(255,200,87,1)_0%,rgba(255,138,60,1)_35%,rgba(255,62,196,1)_80%,rgba(255,0,64,1)_100%)] flex items-center justify-center relative overflow-hidden cursor-pointer border-0"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          {/* Shine sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />
          <span className="relative font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-[#333] text-sm md:text-base tracking-[0] leading-[normal]">
            Start Your Scan
          </span>
          <img className="relative w-4 h-4 ml-1" alt="Arrow" src="/figmaAssets/frame.svg" />
        </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};
