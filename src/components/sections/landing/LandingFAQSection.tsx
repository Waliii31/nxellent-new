import { motion, AnimatePresence } from "framer-motion";
import { useState, type JSX } from "react";

const faqs = [
  {
    q: "Is my code kept private?",
    a: "Yes. We never store or share your source code. Scans run in an isolated environment and are fully discarded after the report is generated. For maximum control, NXELLENT also supports self-hosted deployments.",
    tag: "Privacy",
  },
  {
    q: "What languages and chains does NXELLENT support?",
    a: "Currently: Solidity (EVM), Rust (Solana / NEAR), and Move (Aptos / Sui). TypeScript smart-contract frameworks are coming in Q3. Reach out if you need a specific language prioritised.",
    tag: "Coverage",
  },
  {
    q: "How accurate is the scanner? Will I get false positives?",
    a: "Accuracy is our top priority. Our AI layer filters noise before results reach you — our false-positive rate sits under 8%, compared with 30–40% for traditional static analysers. Every high-severity finding includes a confidence score and a plain-English explanation.",
    tag: "Accuracy",
  },
  {
    q: "How long does a full scan take?",
    a: "Most contracts complete in under 3 minutes. Larger repos (10k+ lines) may take up to 10 minutes. You'll receive a notification the moment your report is ready.",
    tag: "Speed",
  },
  {
    q: "Can I run NXELLENT before sending code to a manual auditor?",
    a: "That's our most popular use case. Teams run NXELLENT first to resolve the obvious issues, then send clean code to a manual firm. This typically cuts audit time — and cost — by up to half.",
    tag: "Workflow",
  },
  {
    q: "What does the security leaderboard show?",
    a: "The global leaderboard ranks audited contracts by score, updated in real time. Listing is fully opt-in — you decide whether your project appears. Teams use it to demonstrate security credibility to investors, users, and integration partners.",
    tag: "Leaderboard",
  },
];

function FaqItem({
  q,
  a,
  tag,
  index,
}: {
  q: string;
  a: string;
  tag: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: "easeOut" }}
      className="relative group cursor-pointer"
      onClick={() => setOpen((o) => !o)}
    >
      {/* Animated left border */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
        animate={{
          background: open
            ? "linear-gradient(180deg, rgba(220,10,250,1) 0%, rgba(100,180,255,0.6) 100%)"
            : "linear-gradient(180deg, rgba(220,10,250,0.2) 0%, rgba(220,10,250,0.05) 100%)",
          boxShadow: open ? "0 0 12px rgba(220,10,250,0.7)" : "none",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Card body */}
      <motion.div
        className="ml-4 md:ml-6 rounded-r-2xl border-r border-t border-b overflow-hidden"
        animate={{
          borderColor: open ? "rgba(220,10,250,0.22)" : "rgba(255,255,255,0.07)",
          background: open
            ? "linear-gradient(135deg, rgba(220,10,250,0.06) 0%, rgba(4,4,30,0.9) 100%)"
            : "rgba(4,4,30,0.55)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 md:gap-6 px-4 md:px-7 py-4 md:py-5">
          <div className="flex items-start gap-2 md:gap-4 min-w-0">
            {/* Tag badge */}
            <span
              className="mt-0.5 shrink-0 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-semibold tracking-widest uppercase font-['Plus_Jakarta_Sans',Helvetica]"
              style={{
                color: open ? "#dc0afa" : "rgba(255,255,255,0.3)",
                background: open ? "rgba(220,10,250,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${open ? "rgba(220,10,250,0.35)" : "rgba(255,255,255,0.08)"}`,
                transition: "all 0.3s ease",
              }}
            >
              {tag}
            </span>

            {/* Question */}
            <span className="font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-white text-[13px] md:text-[15px] leading-relaxed">
              {q}
            </span>
          </div>

          {/* Toggle — custom + / − SVG */}
          <div className="shrink-0 mt-0.5">
            <motion.div
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-5 h-5 relative flex items-center justify-center"
            >
              <div
                className="absolute w-4 h-[1.5px] rounded-full transition-colors duration-300"
                style={{ background: open ? "#dc0afa" : "rgba(255,255,255,0.4)" }}
              />
              <div
                className="absolute w-[1.5px] h-4 rounded-full transition-colors duration-300"
                style={{ background: open ? "#dc0afa" : "rgba(255,255,255,0.4)" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Answer — animated height */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="px-4 md:px-7 pb-5 md:pb-6 pt-0">
                {/* Divider */}
                <div
                  className="w-full h-px mb-4"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(220,10,250,0.3) 0%, rgba(255,255,255,0.04) 100%)",
                  }}
                />
                <p className="font-['Alexandria',Helvetica] font-light text-[#ffffffaa] text-[13px] md:text-[14px] leading-[1.75]">
                  {a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export const LandingFAQSection = (): JSX.Element => {
  return (
    <section className="relative w-full px-5 sm:px-10 md:px-16 lg:px-[120px] py-12 md:py-24 overflow-hidden">

      {/* Subtle scan beam */}
      <motion.div
        className="absolute left-0 w-full h-px pointer-events-none z-1"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(220,10,250,0.18) 40%, rgba(100,200,255,0.15) 70%, transparent 100%)",
        }}
        animate={{ top: ["-1px", "100%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
      />

      {/* Ambient glow behind section */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[700px] h-[200px] md:h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(140,0,220,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top divider */}
      <motion.div
        className="w-full h-px mb-10 md:mb-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(220,10,250,0.25) 30%, rgba(100,180,255,0.2) 70%, transparent 100%)",
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-24 items-start">

        {/* ── Left: heading block ── */}
        <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-28">

          {/* Section label */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fd7eff33] bg-[#dc0afa0d] mb-4 md:mb-6"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#dc0afa]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="font-['Alexandria',Helvetica] font-light text-[#dc0afa] text-xs tracking-widest uppercase">
              FAQ
            </span>
          </motion.div>

          <motion.h2
            className="font-['Anybody',Helvetica] font-semibold text-white text-[28px] sm:text-[32px] md:text-[38px] leading-tight md:leading-[46px] tracking-[-0.5px] mb-4 md:mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.05, ease: "easeOut" }}
          >
            Questions we<br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,200,87,1) 0%, rgba(255,62,196,1) 60%, rgba(140,80,255,1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              get asked
            </span>
          </motion.h2>

          <motion.p
            className="font-['Alexandria',Helvetica] font-light text-[#ffffff70] text-sm md:text-[15px] leading-relaxed mb-6 md:mb-8"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          >
            Everything you need to know before your first scan. Can't find your answer?
          </motion.p>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="inline-block relative z-50"
          >
            <motion.a
              href="mailto:admin@nxellent.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-[48px] border border-[#fd7eff55] bg-[#dc0afa11] hover:bg-[#dc0afa22] text-white font-['Plus_Jakarta_Sans',Helvetica] font-medium text-sm cursor-pointer backdrop-blur-md transition-all no-underline"
              whileHover={{ borderColor: "rgba(220,10,250,0.8)" }}
              whileTap={{ scale: 0.97 }}
            >
              Contact us
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Decorative circuit lines */}
          <svg
            className="absolute -bottom-8 -left-8 opacity-20 pointer-events-none hidden lg:block"
            width="140"
            height="100"
            viewBox="0 0 140 100"
            fill="none"
          >
            <motion.path
              d="M0 80 L40 80 L60 60 L140 60"
              stroke="rgba(220,10,250,1)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.path
              d="M0 95 L25 95 L45 75 L90 75"
              stroke="rgba(100,180,255,0.7)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.6 }}
            />
          </svg>
        </div>

        {/* ── Right: accordion list ── */}
        <div className="flex-1 flex flex-col gap-3 w-full">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} tag={faq.tag} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
