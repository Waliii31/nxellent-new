import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";

// ─── Shared helpers ───────────────────────────────────────────────────
const gradientText = {
  background: "linear-gradient(90deg, rgba(255,200,87,1) 0%, rgba(255,62,196,1) 55%, rgba(140,80,255,1) 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, delay, ease: "easeOut" as const },
});

// ─── Animated counter ─────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(start);
    }, 18);
    return () => clearInterval(timer);
  }, [started, to]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.5 }}
    >
      {val.toLocaleString()}{suffix}
    </motion.span>
  );
}

// ─── Visual sub-components ────────────────────────────────────────────
function ConnectVisual() {
  return (
    <div
      className="rounded-2xl border border-[#ffffff0f] p-4 md:p-6 flex flex-col gap-4 w-full"
      style={{ background: "linear-gradient(145deg, rgba(4,4,30,0.97) 0%, rgba(2,0,40,0.97) 100%)" }}
    >
      {/* Source tabs */}
      <div className="flex gap-2 flex-wrap">
        {["Paste code", "GitHub", "Contract address"].map((t, i) => (
          <div
            key={t}
            className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-medium font-['Alexandria',Helvetica] cursor-pointer transition-all ${
              i === 0
                ? "bg-[#dc0afa22] border border-[#dc0afa55] text-[#dc0afa]"
                : "text-[#ffffff50] border border-[#ffffff12]"
            }`}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Code editor */}
      <div className="rounded-xl bg-[#020820] border border-[#ffffff08] p-3 md:p-4 font-mono text-[11px] md:text-[12px] leading-[18px] md:leading-[20px] overflow-x-auto">
        <div className="flex gap-2 mb-3">
          {["#fd0031","#ff9800","#4caf50"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}} />)}
          <span className="text-[#ffffff30] text-[11px] ml-2">VaultProtocol.sol</span>
        </div>
        <span className="text-[#c792ea]">pragma solidity</span>{" "}
        <span className="text-[#7fdbca]">^0.8.0;</span><br /><br />
        <span className="text-[#c792ea]">contract</span>{" "}
        <span className="text-[#82b1ff]">VaultProtocol</span>{" "}
        <span className="text-white">{"{"}</span><br />
        <span className="text-[#7fdbca] ml-4">address</span>{" "}
        <span className="text-[#ffffff80]">public</span>{" "}
        <span className="text-[#a6e22e]">owner</span>
        <span className="text-white">;</span><br />
        <span className="text-[#ffffff40] ml-4 text-[11px]">// paste more code…</span><br />
        <motion.span
          className="inline-block w-[7px] h-[14px] bg-[#dc0afa] rounded-sm ml-4 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.85, repeat: Infinity }}
        />
      </div>

      {/* Drop zone + CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 h-[42px] rounded-xl border border-dashed border-[#dc0afa44] flex items-center justify-center gap-2 text-[#ffffff50] text-xs font-['Alexandria',Helvetica]">
          <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
            <path d="M2 1h7l3 3v9a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="#dc0afa" strokeWidth="1.2" />
            <path d="M8 1v4h4" stroke="#dc0afa" strokeWidth="1.2" />
          </svg>
          Drop .sol file here
        </div>
        <motion.button
          className="h-[42px] px-6 rounded-xl text-sm font-semibold font-['Plus_Jakarta_Sans',Helvetica] bg-[linear-gradient(135deg,rgba(255,200,87,1),rgba(255,62,196,1))] text-[#333] border-0 cursor-pointer shrink-0"
        >
          Scan now →
        </motion.button>
      </div>
    </div>
  );
}

function ScanVisual() {
  return (
    <div
      className="rounded-2xl border border-[#ffffff0f] overflow-hidden w-full"
      style={{ background: "linear-gradient(145deg, rgba(4,4,30,0.97) 0%, rgba(2,0,40,0.97) 100%)" }}
    >
      {/* Terminal bar */}
      <div className="flex items-center gap-3 px-4 md:px-5 py-3 border-b border-[#ffffff08]">
        <div className="flex gap-1.5">
          {["#fd0031","#ff9800","#4caf50"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}} />)}
        </div>
        <span className="text-[#ffffff50] text-xs font-['Alexandria',Helvetica] ml-2 truncate">nxellent — VaultProtocol.sol</span>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <motion.div className="w-2 h-2 rounded-full bg-[#ff9800]"
            animate={{ opacity:[1,0.2,1] }} transition={{ duration:0.7,repeat:Infinity }} />
          <span className="text-[#ff9800] text-xs font-['Alexandria',Helvetica]">Scanning…</span>
        </div>
      </div>

      {/* Scan progress beam */}
      <motion.div
        className="h-[2px]"
        style={{ background:"linear-gradient(90deg,rgba(220,10,250,1),rgba(100,200,255,1))", boxShadow:"0 0 8px rgba(220,10,250,0.8)", transformOrigin:"left center" }}
        animate={{ scaleX:[0,1] }}
        transition={{ duration:2.5,repeat:Infinity,ease:"easeInOut",repeatDelay:1 }}
      />

      {/* Check rows */}
      <div className="p-4 md:p-5 flex flex-col gap-2.5">
        {[
          { label:"Reentrancy patterns", status:"fail" },
          { label:"Access control gates", status:"pass" },
          { label:"Integer arithmetic", status:"pass" },
          { label:"External call ordering", status:"fail" },
          { label:"Oracle dependencies", status:"running" },
          { label:"Flash loan vectors", status:"pending" },
        ].map((c, i) => (
          <motion.div key={i} className="flex items-center justify-between"
            initial={{opacity:0,x:-8}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
            transition={{delay:0.08+i*0.07}}>
            <span className="text-[#ffffffcc] text-[12px] md:text-[13px] font-['Alexandria',Helvetica] font-light">{c.label}</span>
            {c.status==="pass" && <span className="text-[10px] font-bold text-[#4caf50] tracking-widest">PASS</span>}
            {c.status==="fail" && <span className="text-[10px] font-bold text-[#fd0031] tracking-widest">FAIL</span>}
            {c.status==="running" && <motion.span className="text-[10px] font-bold text-[#ff9800] tracking-widest" animate={{opacity:[1,0.3,1]}} transition={{duration:0.7,repeat:Infinity}}>…</motion.span>}
            {c.status==="pending" && <span className="text-[10px] text-[#ffffff30] tracking-widest">—</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScoreVisual() {
  return (
    <div
      className="rounded-2xl border border-[#ffffff0f] p-4 md:p-6 flex flex-col gap-5 w-full"
      style={{ background:"linear-gradient(145deg,rgba(4,4,30,0.97) 0%,rgba(2,0,40,0.97) 100%)" }}
    >
      {/* Score ring + bars */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <motion.div
          className="w-[76px] h-[76px] md:w-[88px] md:h-[88px] rounded-full flex flex-col items-center justify-center shrink-0"
          style={{ background:"conic-gradient(from -90deg,rgba(220,10,250,1) 0%,rgba(100,180,255,1) 75%,rgba(220,10,250,0.2) 100%)", padding:"3px" }}
          animate={{ rotate:[0,360] }}
          transition={{ duration:12,repeat:Infinity,ease:"linear" }}
        >
          <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{background:"rgba(4,4,30,1)"}}>
            <span className="text-white font-bold text-xl md:text-2xl font-['Plus_Jakarta_Sans',Helvetica] leading-none">847</span>
            <span className="text-[9px] md:text-[10px] font-semibold tracking-widest" style={gradientText}>GOLD</span>
          </div>
        </motion.div>
        <div className="flex-1 w-full">
          <div className="text-[#ffffff80] text-xs font-['Alexandria',Helvetica] uppercase tracking-widest mb-2">Overall Score</div>
          <div className="flex flex-col gap-1.5">
            {[{label:"Security",pct:82},{label:"Logic",pct:91},{label:"Efficiency",pct:74}].map(b => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-[#ffffff60] text-[11px] w-16 font-['Alexandria',Helvetica]">{b.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#ffffff10]">
                  <motion.div className="h-full rounded-full" style={{background:"linear-gradient(90deg,rgba(220,10,250,1),rgba(100,200,255,1))"}}
                    initial={{width:0}} whileInView={{width:`${b.pct}%`}} viewport={{once:true}}
                    transition={{duration:0.9,ease:"easeOut",delay:0.2}} />
                </div>
                <span className="text-[#ffffff60] text-[11px] w-6 text-right font-['Alexandria',Helvetica]">{b.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="border-t border-[#ffffff08] pt-4 flex flex-col gap-2">
        <div className="text-[#ffffff50] text-[11px] uppercase tracking-widest font-['Alexandria',Helvetica] mb-1">Findings</div>
        {[
          {label:"Reentrancy in withdraw()",sev:"HIGH"},
          {label:"Unchecked external call",sev:"MED"},
          {label:"Access control: owner",sev:"PASS"},
        ].map((f,i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="text-[#ffffffcc] text-[12px] md:text-[13px] font-['Alexandria',Helvetica] min-w-0 truncate">
              {f.sev==="PASS"?"✓":"⚠"} {f.label}
            </span>
            <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded shrink-0 ${
              f.sev==="HIGH"?"text-[#fd0031] bg-[#fd003118]":f.sev==="MED"?"text-[#ff9800] bg-[#ff980018]":"text-[#4caf50] bg-[#4caf5018]"
            }`}>{f.sev}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 h-9 rounded-xl border border-[#dc0afa44] text-[#dc0afa] text-xs font-semibold font-['Plus_Jakarta_Sans',Helvetica] bg-[#dc0afa0a] cursor-pointer">Share report</button>
        <button className="flex-1 h-9 rounded-xl bg-[linear-gradient(135deg,rgba(255,200,87,1),rgba(255,62,196,1))] text-[#333] text-xs font-semibold font-['Plus_Jakarta_Sans',Helvetica] border-0 cursor-pointer">View full report →</button>
      </div>
    </div>
  );
}

// ─── FAQ item (custom toggle, no Lucide) ──────────────────────────────
function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      {...fadeUp(delay)}
      className="border border-[#ffffff0f] rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: open ? "rgba(220,10,250,0.05)" : "rgba(4,4,30,0.6)" }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between px-4 md:px-7 py-4 md:py-5 gap-3 md:gap-4">
        <span className="font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-white text-sm md:text-base leading-relaxed">{q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="shrink-0 w-5 h-5 relative flex items-center justify-center"
        >
          <div className="absolute w-4 h-[1.5px] rounded-full" style={{ background: open ? "#dc0afa" : "rgba(255,255,255,0.4)" }} />
          <div className="absolute w-[1.5px] h-4 rounded-full" style={{ background: open ? "#dc0afa" : "rgba(255,255,255,0.4)" }} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            transition={{duration:0.28,ease:"easeInOut"}} style={{overflow:"hidden"}}>
            <div className="px-4 md:px-7 pb-5 pt-4 font-['Alexandria',Helvetica] font-light text-[#ffffffb3] text-[13px] md:text-[15px] leading-relaxed border-t border-[#ffffff08]">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    label: "Connect",
    title: "Drop in your code. NXELLENT handles the rest.",
    description: "Paste Solidity, link a repo, or enter a deployed contract address. NXELLENT scans instantly — no config, no CLI, no setup.",
    bullets: ["Solidity, Rust & Move", "GitHub & GitLab repos", "Paste, upload or address", "Private repos stay private"],
    visual: <ConnectVisual />,
    flip: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="1" y="3" width="20" height="16" rx="2" stroke="#dc0afa" strokeWidth="1.5"/>
        <path d="M5 8l3 3-3 3" stroke="#dc0afa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 14h6" stroke="#dc0afa" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "02",
    label: "Analyze",
    title: "200+ checks. Under 3 minutes.",
    description: "Our engine runs static analysis, dynamic simulation, and an AI reasoning pass across reentrancy, access control, arithmetic flaws, and DeFi-specific attack vectors.",
    bullets: ["200+ vulnerability patterns", "Static + dynamic analysis", "AI-assisted logic review", "< 3 min for most contracts"],
    visual: <ScanVisual />,
    flip: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="#dc0afa" strokeWidth="1.5"/>
        <path d="M11 2v4M11 16v4M2 11h4M16 11h4" stroke="#dc0afa" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="11" cy="11" r="3" fill="rgba(220,10,250,0.25)" stroke="#dc0afa" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    number: "03",
    label: "Score",
    title: "A score, a badge, a shareable report.",
    description: "Get a 0–1000 security score, a Bronze-to-Platinum ranking, and a prioritized finding list with clear fix guidance — all in a shareable PDF.",
    bullets: ["0–1000 numeric score", "Bronze → Platinum badges", "Prioritised fix guidance", "One-click share & export"],
    visual: <ScoreVisual />,
    flip: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2l2.5 5.5H19l-4.5 3.5 1.5 6L11 14l-5 3 1.5-6L3 7.5h5.5L11 2z" stroke="#dc0afa" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const faqs = [
  { q:"Is my code kept private?", a:"Yes. We never store or share your source code. Scans run in an isolated ephemeral environment and are fully discarded after the report is generated. For maximum control, self-hosted deployment is available on the Syndicate plan." },
  { q:"What languages does NXELLENT support?", a:"Currently: Solidity (EVM), Rust (Solana / NEAR), and Move (Aptos / Sui). TypeScript smart-contract frameworks are coming in Q3. Reach out if you need a specific language prioritized." },
  { q:"How accurate is the scanner? Will I get false positives?", a:"Our false-positive rate sits under 8%, compared with 30–40% for traditional static analysers. Every high-severity finding includes a confidence score and a plain-English explanation." },
  { q:"How long does a scan take?", a:"Most contracts complete in under 3 minutes. Larger repos (10k+ lines) may take up to 10 minutes. You receive a notification the moment your report is ready." },
  { q:"Can I run NXELLENT before sending to a manual auditor?", a:"That's our most popular use case. Teams scan with NXELLENT first to resolve obvious issues, then send clean code to a manual firm — typically cutting audit time and cost by up to half." },
];

const coverageCategories = [
  { cat: "Reentrancy", count: "34 checks" },
  { cat: "Access Control", count: "28 checks" },
  { cat: "Integer Arithmetic", count: "22 checks" },
  { cat: "Flash Loan Vectors", count: "19 checks" },
  { cat: "Oracle Manipulation", count: "17 checks" },
  { cat: "Timestamp Dependence", count: "14 checks" },
  { cat: "Gas Optimisation", count: "31 checks" },
  { cat: "Logic / Invariants", count: "45 checks" },
];

// ─── Main page ────────────────────────────────────────────────────────
const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#020c30] w-full flex flex-col relative overflow-hidden">

      {/* Ambient orbs */}
      <motion.div className="pointer-events-none absolute top-[300px] left-[-100px] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full"
        style={{background:"radial-gradient(circle,rgba(120,0,200,0.1) 0%,transparent 70%)",filter:"blur(80px)"}}
        animate={{x:[0,30,0],y:[0,-20,0]}} transition={{duration:16,repeat:Infinity,ease:"easeInOut"}} />
      <motion.div className="pointer-events-none absolute top-[1200px] right-[-100px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full"
        style={{background:"radial-gradient(circle,rgba(255,62,196,0.08) 0%,transparent 70%)",filter:"blur(70px)"}}
        animate={{x:[0,-25,0],y:[0,30,0]}} transition={{duration:18,repeat:Infinity,ease:"easeInOut",delay:4}} />

      {/* Shared nav */}
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-5 sm:px-10 md:px-16 lg:px-[120px] pt-12 md:pt-20 pb-16 md:pb-28 gap-5 md:gap-6 overflow-hidden">

        {/* Animated dot-grid */}
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{backgroundImage:"radial-gradient(circle,rgba(140,80,255,0.13) 1px,transparent 1px)",backgroundSize:"38px 38px"}}
          animate={{opacity:[0.3,0.55,0.3]}} transition={{duration:6,repeat:Infinity,ease:"easeInOut"}} />

        {/* Horizontal scan beam */}
        <motion.div className="absolute top-0 left-0 w-full h-px pointer-events-none"
          style={{background:"linear-gradient(90deg,transparent 0%,rgba(220,10,250,0.25) 50%,transparent 100%)"}}
          animate={{top:["-1px","100%"]}} transition={{duration:5,repeat:Infinity,ease:"linear",repeatDelay:2}} />

        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff44] bg-[#dc0afa12]">
          <motion.span className="w-2 h-2 rounded-full bg-[#dc0afa]" animate={{opacity:[1,0.3,1]}} transition={{duration:1.4,repeat:Infinity}} />
          <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-xs sm:text-sm tracking-widest uppercase">How NXELLENT Works</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.08)} className="font-['Anybody',Helvetica] font-semibold text-white text-[32px] sm:text-[42px] md:text-[56px] lg:text-[68px] leading-[1.15] md:leading-[80px] tracking-[-1px] md:tracking-[-1.5px] max-w-[860px]">
          From code drop to<br />
          <span style={gradientText}>actionable security</span><br />
          in minutes.
        </motion.h1>

        <motion.p {...fadeUp(0.16)} className="font-['Alexandria',Helvetica] font-light text-[#ffffffb3] text-base md:text-xl max-w-[540px] leading-relaxed">
          No security expertise required. No setup. Just clear findings, fast.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.24)} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mt-2">
          <motion.div
            className="rounded-full"
            animate={{boxShadow:["0px 0px 24px rgba(255,120,40,0.35)","0px 0px 48px rgba(255,62,196,0.6)","0px 0px 24px rgba(255,120,40,0.35)"]}}
            transition={{duration:2.6,repeat:Infinity,ease:"easeInOut"}}
          >
            <div
              onClick={() => navigate("/auth/signup")}
              className="flex h-[48px] md:h-[52px] items-center gap-2.5 px-6 md:px-8 rounded-full bg-[linear-gradient(153deg,rgba(255,200,87,1)_0%,rgba(255,138,60,1)_35%,rgba(255,62,196,1)_80%)] cursor-pointer border-0"
            >
              <span className="font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-[#333] text-sm md:text-base">Scan now</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </motion.div>
          <Link to="/" className="h-[48px] md:h-[52px] px-6 md:px-8 rounded-full border border-[#fd7eff55] text-white font-['Plus_Jakarta_Sans',Helvetica] font-medium text-sm md:text-base flex items-center cursor-pointer hover:bg-[#dc0afa08] transition-colors no-underline">
            See a sample report
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div {...fadeUp(0.32)} className="flex items-center gap-6 sm:gap-8 md:gap-12 mt-4 md:mt-6 flex-wrap justify-center">
          {[
            { num: 12000, suffix: "+", label: "Contracts scanned" },
            { num: 94, suffix: "%", label: "Detection rate" },
            { num: 3, suffix: " min", label: "Avg scan time" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="font-['Anybody',Helvetica] font-semibold text-white text-xl sm:text-2xl md:text-[28px] tracking-[-0.5px]">
                <Counter to={s.num} suffix={s.suffix} />
              </span>
              <span className="font-['Alexandria',Helvetica] font-light text-[#ffffff55] text-[10px] md:text-xs uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Steps ── */}
      <div className="flex flex-col gap-0 relative z-10">
        {steps.map((step, i) => (
          <section
            key={step.number}
            className={`relative px-5 sm:px-10 md:px-16 lg:px-[120px] py-12 md:py-28 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${step.flip ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Section divider */}
            {i > 0 && (
              <motion.div className="absolute top-0 left-5 sm:left-10 md:left-16 lg:left-[120px] right-5 sm:right-10 md:right-16 lg:right-[120px] h-px"
                style={{background:"linear-gradient(90deg,transparent,rgba(220,10,250,0.2),transparent)"}}
                initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true,amount:0.5}}
                transition={{duration:1,ease:"easeInOut"}} />
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col gap-5 md:gap-7 items-center lg:items-start text-center lg:text-left min-w-0">
              {/* Step badge */}
              <motion.div {...fadeUp(0)} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#dc0afa18] border border-[#dc0afa33]">
                  {step.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-['Alexandria',Helvetica] text-[#dc0afa] text-xs font-light uppercase tracking-widest">Step {step.number}</span>
                  <span className="font-['Plus_Jakarta_Sans',Helvetica] font-bold text-[#ffffff50] text-sm uppercase tracking-[3px]">{step.label}</span>
                </div>
              </motion.div>

              {/* Large ghosted number */}
              <motion.div {...fadeUp(0.04)} className="relative">
                <div
                  className="absolute -left-4 -top-8 md:-top-10 font-['Anybody',Helvetica] font-semibold text-[80px] md:text-[120px] lg:text-[160px] leading-none select-none pointer-events-none"
                  style={{color:"rgba(220,10,250,0.04)",letterSpacing:"-8px"}}
                >
                  {step.number}
                </div>
                <h2 className="relative font-['Anybody',Helvetica] font-semibold text-white text-[26px] sm:text-[32px] md:text-[38px] lg:text-[42px] leading-[1.2] md:leading-[52px] tracking-[-0.6px] max-w-[480px]">
                  {step.title}
                </h2>
              </motion.div>

              <motion.p {...fadeUp(0.09)} className="font-['Alexandria',Helvetica] font-light text-[#ffffffb3] text-base md:text-lg leading-relaxed max-w-[440px]">
                {step.description}
              </motion.p>

              {/* Bullets */}
              <motion.ul {...fadeUp(0.14)} className="flex flex-col gap-3 items-start">
                {step.bullets.map((b, bi) => (
                  <motion.li key={bi} className="flex items-center gap-3 font-['Alexandria',Helvetica] font-light text-[#ffffffcc] text-sm md:text-base"
                    initial={{opacity:0,x:-12}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                    transition={{delay:0.18+bi*0.07,duration:0.45,ease:"easeOut"}}>
                    <div className="w-5 h-5 rounded-full bg-[#dc0afa22] border border-[#dc0afa44] flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#dc0afa]" />
                    </div>
                    {b}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Visual */}
            <motion.div
              className="flex-1 w-full lg:w-auto min-w-0"
              initial={{opacity:0,x:step.flip ? -40 : 40}}
              whileInView={{opacity:1,x:0}}
              viewport={{once:true,amount:0.25}}
              transition={{duration:0.75,delay:0.15,ease:"easeOut"}}
              whileHover={{y:-6,transition:{duration:0.3}}}
            >
              {step.visual}
            </motion.div>
          </section>
        ))}
      </div>

      {/* ── Coverage section ── */}
      <section className="px-5 sm:px-10 md:px-16 lg:px-[120px] py-12 md:py-24 relative z-10">
        <motion.div className="w-full h-px mb-10 md:mb-20"
          style={{background:"linear-gradient(90deg,transparent,rgba(220,10,250,0.2),transparent)"}}
          initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true,amount:0.5}}
          transition={{duration:1.1,ease:"easeInOut"}} />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-24 items-start">
          {/* Left heading */}
          <div className="w-full lg:w-[380px] shrink-0">
            <motion.div {...fadeUp(0)} className="flex flex-col gap-4 md:gap-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff33] bg-[#dc0afa0d] w-fit">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-[#dc0afa]" animate={{opacity:[1,0.3,1]}} transition={{duration:1.4,repeat:Infinity}} />
                <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-xs tracking-widest uppercase">Coverage</span>
              </div>
              <h2 className="font-['Anybody',Helvetica] font-semibold text-white text-[28px] sm:text-[32px] md:text-[38px] leading-[1.2] md:leading-[46px] tracking-[-0.5px]">
                200+ checks.<br />
                <span style={gradientText}>8 categories.</span>
              </h2>
              <p className="font-['Alexandria',Helvetica] font-light text-[#ffffff70] text-sm md:text-[15px] leading-relaxed">
                From classic reentrancy to DeFi-specific oracle manipulation — NXELLENT finds the issues that matter before they ship.
              </p>
              <div className="flex flex-col gap-3 mt-2 p-3 md:p-4 rounded-xl border border-[#ffffff08] bg-[#020820]">
                <div className="flex items-center justify-between">
                  <span className="font-['Alexandria',Helvetica] font-light text-[#ffffff50] text-xs">False-positive rate</span>
                  <span className="font-['Anybody',Helvetica] font-semibold text-white text-sm">&lt; 8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Alexandria',Helvetica] font-light text-[#ffffff50] text-xs">vs traditional tools</span>
                  <span className="font-['Anybody',Helvetica] font-semibold text-[#fd0031] text-sm">30–40%</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: terminal scan output */}
          <div className="flex-1 w-full min-w-0">
            <motion.div
              className="rounded-2xl border border-[#ffffff0a] overflow-hidden"
              style={{background:"rgba(2,8,32,0.9)"}}
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.2}}
              transition={{duration:0.6}}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-3 px-4 md:px-5 py-3 border-b border-[#ffffff08]">
                <div className="flex gap-1.5">
                  {["#fd0031","#ff9800","#4caf50"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}} />)}
                </div>
                <span className="text-[#ffffff40] text-xs font-['Alexandria',Helvetica] ml-2 truncate">nxellent — scan coverage report</span>
              </div>

              {/* Category rows */}
              <div className="p-3 md:p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#dc0afa] text-xs font-['Alexandria',Helvetica]">$</span>
                  <span className="text-[#ffffff60] text-xs font-['Alexandria',Helvetica] truncate">nxellent --list-categories --verbose</span>
                </div>
                {coverageCategories.map((cat, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between px-2 md:px-3 py-2 md:py-2.5 rounded-lg"
                    style={{background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"}}
                    initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                    transition={{delay:0.05+i*0.06,duration:0.4}}
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#dc0afa] shrink-0"
                        animate={{opacity:[0.4,1,0.4]}}
                        transition={{duration:2,delay:i*0.3,repeat:Infinity}}
                      />
                      <span className="font-['Alexandria',Helvetica] font-light text-[#ffffffcc] text-xs md:text-sm truncate">{cat.cat}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                      <span className="font-['Alexandria',Helvetica] font-light text-[#ffffff40] text-[10px] md:text-xs">{cat.count}</span>
                      <span className="text-[#4caf50] text-[9px] md:text-[10px] font-bold tracking-widest">ACTIVE</span>
                    </div>
                  </motion.div>
                ))}
                <div className="mt-3 px-2 md:px-3">
                  <span className="text-[#ffffff30] text-[10px] md:text-xs font-['Alexandria',Helvetica]">
                    Total: <span className="text-[#dc0afa]">210</span> active checks · Last updated: <span className="text-[#ffffff50]">Apr 2025</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 sm:px-10 md:px-16 lg:px-[120px] py-12 md:py-24 relative z-10">
        <motion.div className="w-full h-px mb-10 md:mb-20"
          style={{background:"linear-gradient(90deg,transparent,rgba(220,10,250,0.2),transparent)"}}
          initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true,amount:0.5}}
          transition={{duration:1.1,ease:"easeInOut"}} />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-24 items-start">
          <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-28">
            <motion.div {...fadeUp(0)} className="flex flex-col gap-4 md:gap-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff33] bg-[#dc0afa0d] w-fit">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-[#dc0afa]" animate={{opacity:[1,0.3,1]}} transition={{duration:1.4,repeat:Infinity}} />
                <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-xs tracking-widest uppercase">Why NXELLENT</span>
              </div>
              <h2 className="font-['Anybody',Helvetica] font-semibold text-white text-[28px] sm:text-[32px] md:text-[36px] leading-[1.2] md:leading-[44px] tracking-[-0.4px]">
                Common questions,<br />
                <span style={gradientText}>clear answers</span>
              </h2>
              <p className="font-['Alexandria',Helvetica] font-light text-[#ffffff70] text-sm md:text-[15px] leading-relaxed">
                Why teams choose NXELLENT before they audit.
              </p>
              <Link to="/" className="mt-2 inline-flex items-center gap-2 text-[#dc0afa] font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-sm hover:opacity-75 transition-opacity cursor-pointer no-underline">
                Still have questions? Contact us
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="#dc0afa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 flex flex-col gap-3 w-full">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 sm:px-10 md:px-16 lg:px-[120px] py-12 md:py-28 relative z-10">
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-2xl md:rounded-3xl border border-[#ffffff0f] overflow-hidden flex flex-col items-center text-center gap-6 md:gap-8 py-12 md:py-24 px-5 sm:px-8 md:px-16"
          style={{background:"linear-gradient(135deg,rgba(14,0,52,0.95) 0%,rgba(4,4,30,0.97) 100%)"}}
        >
          {/* Glow + scan beam */}
          <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at center,rgba(220,10,250,0.1) 0%,transparent 70%)"}} />
          <motion.div className="absolute left-0 w-full h-px pointer-events-none"
            style={{background:"linear-gradient(90deg,transparent,rgba(220,10,250,0.3),transparent)"}}
            animate={{top:["-1px","101%"]}} transition={{duration:4,repeat:Infinity,ease:"linear",repeatDelay:1.5}} />

          <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff44] bg-[#dc0afa12]">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-[#dc0afa]" animate={{opacity:[1,0.3,1]}} transition={{duration:1.4,repeat:Infinity}} />
                <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-xs tracking-widest uppercase">Ship with confidence</span>
              </div>
              <h2 className="font-['Anybody',Helvetica] font-semibold text-white text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-[1.15] md:leading-[62px] tracking-[-0.5px] md:tracking-[-1px]">
                Run your first scan<br />
                <span style={gradientText}>in under 3 minutes.</span>
              </h2>
              <p className="font-['Alexandria',Helvetica] font-light text-[#ffffffb3] text-base md:text-xl max-w-[460px] leading-relaxed">
                No credit card. No account required. Full report in under 3 minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
              <motion.div
                className="rounded-full"
                animate={{boxShadow:["0px 0px 30px rgba(255,120,40,0.4)","0px 0px 55px rgba(255,62,196,0.65)","0px 0px 30px rgba(255,120,40,0.4)"]}}
                transition={{duration:2.6,repeat:Infinity,ease:"easeInOut"}}
              >
                <div
                  onClick={() => navigate("/auth/signup")}
                  className="flex h-[48px] md:h-[56px] items-center gap-2.5 px-8 md:px-10 rounded-full bg-[linear-gradient(153deg,rgba(255,200,87,1)_0%,rgba(255,138,60,1)_35%,rgba(255,62,196,1)_80%,rgba(255,0,64,1)_100%)] cursor-pointer border-0"
                >
                  <span className="font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-[#333] text-sm md:text-base">Start scanning</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </motion.div>
              <Link to="/" className="h-[48px] md:h-[56px] px-6 md:px-8 rounded-full border border-[#fd7eff55] text-white font-['Plus_Jakarta_Sans',Helvetica] font-medium text-sm md:text-base flex items-center cursor-pointer hover:bg-[#dc0afa08] transition-colors no-underline">
                Back to home
              </Link>
            </div>

            {/* Trust micro-copy */}
            <p className="font-['Alexandria',Helvetica] font-light text-[#ffffff35] text-[10px] md:text-xs tracking-wide text-center">
              Trusted by 12,000+ audited contracts · 94% detection rate · &lt; 8% false positives
            </p>
          </div>
        </motion.div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default HowItWorks;
