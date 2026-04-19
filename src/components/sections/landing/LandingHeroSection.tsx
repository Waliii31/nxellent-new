import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";

// ── Code lines to display in the terminal ──────────────────────────────
const codeLines = [
  { code: "contract VaultProtocol {", color: "#c792ea", warn: false },
  { code: "  address public owner;", color: "#7fdbca", warn: false },
  { code: "  uint256 public totalFunds;", color: "#7fdbca", warn: false },
  { code: "", color: "", warn: false },
  { code: "  function withdraw(uint256 amount) external {", color: "#82b1ff", warn: false },
  { code: "    require(amount <= totalFunds);", color: "#a6e22e", warn: false },
  { code: "    (bool ok,) = msg.sender.call{", color: "#ff6b6b", warn: true },
  { code: '      value: amount}("");', color: "#ff6b6b", warn: true },
  { code: "    totalFunds -= amount;", color: "#e6db74", warn: false },
  { code: "  }", color: "#c792ea", warn: false },
  { code: "}", color: "#c792ea", warn: false },
];

const findings = [
  { label: "Reentrancy Attack", severity: "HIGH", icon: "⚠" },
  { label: "Unchecked Return Value", severity: "MED", icon: "⚠" },
  { label: "Access Control", severity: "PASS", icon: "✓" },
  { label: "Integer Overflow", severity: "PASS", icon: "✓" },
];

const severityColor: Record<string, string> = {
  HIGH: "text-[#fd0031] bg-[#fd003118]",
  MED: "text-[#ff9800] bg-[#ff980018]",
  PASS: "text-[#4caf50] bg-[#4caf5018]",
};

// ── Animation phases: 0=typing 1=scanning 2=results ──────────────────
export const LandingHeroSection = () => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [scanPct, setScanPct] = useState(0);

  // Type lines in one by one
  useEffect(() => {
    if (visibleLines < codeLines.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 120);
      return () => clearTimeout(t);
    }
    // All lines shown → start scan after brief pause
    const t = setTimeout(() => setPhase(1), 400);
    return () => clearTimeout(t);
  }, [visibleLines]);

  // Animate scan bar progress
  useEffect(() => {
    if (phase !== 1) return;
    let p = 0;
    const id = setInterval(() => {
      p += 2;
      setScanPct(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => setPhase(2), 300);
      }
    }, 20);
    return () => clearInterval(id);
  }, [phase]);

  // Reset cycle every ~12 s
  useEffect(() => {
    if (phase !== 2) return;
    const t = setTimeout(() => {
      setPhase(0);
      setVisibleLines(0);
      setScanPct(0);
    }, 7000);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <section className="relative w-full overflow-hidden">

      {/* ── Background: dot-grid + circuit lines ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(140,80,255,0.15) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Scan beam sweeping top→bottom across the whole section */}
      <motion.div
        className="absolute left-0 w-full h-[3px] pointer-events-none z-2"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(220,10,250,0.0) 10%, rgba(220,10,250,0.5) 50%, rgba(100,200,255,0.5) 80%, transparent 100%)",
          boxShadow: "0 0 16px 4px rgba(220,10,250,0.3)",
        }}
        animate={{ top: ["-4px", "100%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
      />

      {/* Circuit line SVG overlay — hidden on small screens for performance */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-2 hidden md:block" viewBox="0 0 1440 780" fill="none" preserveAspectRatio="xMidYMid slice">
        <motion.path d="M 0 200 L 160 200 L 180 220 L 340 220" stroke="rgba(140,80,255,0.4)" strokeWidth="1.2" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 0.7, 0.5] }}
          transition={{ duration: 2.4, delay: 0.3, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }} />
        <motion.path d="M 0 520 L 200 520 L 220 500 L 420 500" stroke="rgba(220,10,250,0.3)" strokeWidth="1.2" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 0.5, 0.3] }}
          transition={{ duration: 2.8, delay: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 7 }} />
        {/* Corner brackets */}
        <motion.path d="M 60 60 L 60 30 L 90 30" stroke="rgba(220,10,250,0.5)" strokeWidth="1.5" strokeLinecap="round"
          animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4 }} />
        <motion.path d="M 1380 60 L 1380 30 L 1350 30" stroke="rgba(100,200,255,0.5)" strokeWidth="1.5" strokeLinecap="round"
          animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 1.6, delay: 0.5, repeat: Infinity, repeatDelay: 4 }} />
        <motion.path d="M 60 720 L 60 750 L 90 750" stroke="rgba(220,10,250,0.4)" strokeWidth="1.5" strokeLinecap="round"
          animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 1.6, delay: 1, repeat: Infinity, repeatDelay: 4 }} />
        <motion.path d="M 1380 720 L 1380 750 L 1350 750" stroke="rgba(100,200,255,0.4)" strokeWidth="1.5" strokeLinecap="round"
          animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 1.6, delay: 1.5, repeat: Infinity, repeatDelay: 4 }} />
      </svg>

      {/* ── Main 2-col layout ────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-5 sm:px-10 md:px-16 lg:px-[120px] pt-12 pb-24 md:pt-20 md:pb-40 min-h-0 lg:min-h-[800px]">

        {/* ── LEFT: copy + CTAs ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 md:gap-8 flex-1 min-w-0 items-center lg:items-start text-center lg:text-left">

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff44] bg-[#dc0afa12] w-fit"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#dc0afa]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-sm tracking-widest uppercase">
              Cyber Due Diligence
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-['Anybody',Helvetica] font-semibold text-white text-3xl sm:text-4xl md:text-[44px] lg:text-[52px] leading-tight md:leading-[64px] tracking-[-0.5px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          >
            Instant cyber<br />
            due diligence<br />
            <span
              style={{
                background: "linear-gradient(90deg, rgba(255,200,87,1) 0%, rgba(255,62,196,1) 60%, rgba(140,80,255,1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for your code
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="font-['Alexandria',Helvetica] font-normal text-[#ffffffcc] text-base md:text-xl tracking-[-0.4px] leading-relaxed max-w-[480px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          >
            Scan your code, get a risk score, and know exactly where your vulnerabilities are before attackers find them.
          </motion.p>

          {/* Stats row */}
          <motion.div
            className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap justify-center lg:justify-start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          >
            {[
              { value: "12 k+", label: "Contracts scanned" },
              { value: "67%", label: "Gold or above" },
              { value: "< 3 min", label: "Time to score" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span
                  className="font-['Plus_Jakarta_Sans',Helvetica] font-bold text-xl md:text-2xl"
                  style={{
                    background: "linear-gradient(270deg, rgba(252,245,250,1) 0%, rgba(220,10,250,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </span>
                <span className="font-['Alexandria',Helvetica] font-light text-[#ffffff80] text-xs md:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
          >
            <PrimaryButton
              whereTo="auth/signup"
              icon={<img className="w-4 h-4 ml-1" alt="" src="/figmaAssets/frame.svg" />}
              iconPosition="right"
              moreClasses="h-[48px] md:h-[52px] !px-6 md:!px-8 font-['Plus_Jakarta_Sans',Helvetica]"
            >
              Run Full Scan
            </PrimaryButton>

            <SecondaryButton
              whereTo="leaderboard"
              moreClasses="h-[48px] md:h-[52px] !px-6 md:!px-8 font-['Plus_Jakarta_Sans',Helvetica]"
            >
              View Leaderboard
            </SecondaryButton>
          </motion.div>
        </div>

        {/* ── RIGHT: animated code scan → score ──────────────────────────── */}
        <motion.div
          className="flex-1 min-w-0 w-full lg:w-auto flex flex-col gap-4 lg:-mt-20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
        >

          {/* ── Code terminal panel ── */}
          <div
            className="rounded-2xl overflow-hidden border border-[#ffffff12]"
            style={{
              background: "linear-gradient(145deg, rgba(4,4,30,0.95) 0%, rgba(2,0,40,0.95) 100%)",
              boxShadow: "0 0 60px rgba(140,80,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Terminal title bar */}
            <div className="flex items-center gap-3 px-4 md:px-5 py-3 border-b border-[#ffffff10]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#fd0031]" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff9800]" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#4caf50]" />
              </div>
              <span className="font-['Alexandria',Helvetica] font-light text-[#ffffff60] text-xs md:text-sm ml-2 truncate">
                VaultProtocol.sol
              </span>

              {/* Scan status indicator */}
              <div className="ml-auto flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {phase === 0 && (
                    <motion.span key="loading" className="font-['Alexandria',Helvetica] text-xs text-[#ffffff50]"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      loading…
                    </motion.span>
                  )}
                  {phase === 1 && (
                    <motion.div key="scanning" className="flex items-center gap-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.div className="w-2 h-2 rounded-full bg-[#ff9800]"
                        animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />
                      <span className="font-['Alexandria',Helvetica] text-xs text-[#ff9800]">Scanning…</span>
                    </motion.div>
                  )}
                  {phase === 2 && (
                    <motion.div key="done" className="flex items-center gap-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="w-2 h-2 rounded-full bg-[#4caf50]" />
                      <span className="font-['Alexandria',Helvetica] text-xs text-[#4caf50]">Scan complete</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Scan progress bar */}
            {phase === 1 && (
              <div className="h-[2px] w-full bg-[#ffffff08]">
                <motion.div
                  className="h-full"
                  style={{
                    width: `${scanPct}%`,
                    background: "linear-gradient(90deg, rgba(220,10,250,1), rgba(100,200,255,1))",
                    boxShadow: "0 0 8px rgba(220,10,250,0.8)",
                  }}
                />
              </div>
            )}

            {/* Code lines */}
            <div className="px-3 md:px-5 py-4 font-mono text-[11px] md:text-[13px] leading-[20px] md:leading-[22px] select-none min-h-[220px] md:min-h-[260px] overflow-x-auto">
              {codeLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 md:gap-3"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Line number */}
                  <span className="text-[#ffffff25] w-4 md:w-5 text-right text-[10px] md:text-[11px] shrink-0 select-none">
                    {i + 1}
                  </span>

                  {/* Code text with optional warning highlight */}
                  <span
                    className={`flex-1 transition-colors duration-500 whitespace-nowrap ${line.warn && phase >= 1
                        ? "bg-[#fd003118] rounded px-1 -mx-1"
                        : ""
                      }`}
                    style={{ color: line.color || "transparent" }}
                  >
                    {line.code || "\u00A0"}

                    {/* Warning tag on warn lines */}
                    {line.warn && phase >= 1 && i === 6 && (
                      <motion.span
                        className="ml-2 md:ml-3 text-[9px] md:text-[10px] font-bold tracking-wider text-[#fd0031] bg-[#fd003125] px-1.5 py-0.5 rounded"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        REENTRANCY
                      </motion.span>
                    )}
                  </span>
                </motion.div>
              ))}

              {/* Cursor blink */}
              {phase === 0 && visibleLines < codeLines.length && (
                <motion.span
                  className="inline-block w-[7px] h-[15px] bg-[#dc0afa] ml-1 rounded-sm"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </div>
          </div>

          {/* ── Score result card — appears after scan ── */}
          <AnimatePresence>
            {phase === 2 && (
              <motion.div
                className="rounded-2xl border border-[#ffffff12] overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(4,4,30,0.97) 0%, rgba(14,0,52,0.97) 100%)",
                  boxShadow: "0 0 50px rgba(220,10,250,0.15)",
                }}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-5">

                  {/* Score circle */}
                  <motion.div
                    className="relative flex flex-col items-center justify-center w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] rounded-full shrink-0"
                    style={{
                      background: "conic-gradient(from -90deg, rgba(220,10,250,1) 0%, rgba(100,180,255,1) 70%, rgba(220,10,250,0.2) 100%)",
                      padding: "3px",
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  >
                    <div
                      className="w-full h-full rounded-full flex flex-col items-center justify-center"
                      style={{ background: "rgba(4,4,30,1)" }}
                    >
                      <motion.span
                        className="font-['Plus_Jakarta_Sans',Helvetica] font-bold text-white text-xl sm:text-2xl leading-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        847
                      </motion.span>
                      <motion.span
                        className="text-[9px] sm:text-[10px] font-semibold tracking-[2px]"
                        style={{
                          background: "linear-gradient(270deg, rgba(252,245,250,0.9) 0%, rgba(220,10,250,0.9) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                      >
                        GOLD
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* Findings list */}
                  <div className="flex-1 flex flex-col gap-2 w-full">
                    <span className="font-['Alexandria',Helvetica] font-light text-[#ffffff60] text-xs uppercase tracking-widest mb-1">
                      Findings
                    </span>
                    {findings.map((f, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                      >
                        <span className="font-['Alexandria',Helvetica] text-[12px] sm:text-[13px] text-[#ffffffcc]">
                          {f.icon} {f.label}
                        </span>
                        <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest px-2 py-0.5 rounded ${severityColor[f.severity]}`}>
                          {f.severity}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Rank badge */}
                  <motion.div
                    className="flex flex-col items-center gap-1 shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  >
                    <div
                      className="px-4 py-2 rounded-full text-sm font-bold font-['Plus_Jakarta_Sans',Helvetica]"
                      style={{
                        background: "linear-gradient(135deg, rgba(220,10,250,0.25), rgba(100,180,255,0.15))",
                        border: "1px solid rgba(220,10,250,0.4)",
                        color: "#dc0afa",
                      }}
                    >
                      #14
                    </div>
                    <span className="text-[11px] text-[#ffffff50] font-['Alexandria',Helvetica]">Global Rank</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-[100px] pointer-events-none z-3"
        style={{ background: "linear-gradient(0deg, rgba(2,12,48,1) 0%, transparent 100%)" }}
      />
    </section>
  );
};
