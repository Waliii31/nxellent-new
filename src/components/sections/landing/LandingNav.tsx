import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

export const LandingNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        className="flex w-full items-center justify-between px-5 sm:px-10 md:px-16 lg:px-[120px] py-5 bg-transparent rounded-xl relative z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Brand logo */}
        <Link
          to="/"
          className="cursor-pointer hover:opacity-90 transition-opacity flex items-center"
        >
          <img src="/Nxellent-logos/desktop_logo_SVG_160x50.svg" alt="Nxellent Logo" className="h-8 md:h-10 w-auto object-contain" />
        </Link>

        {/* Desktop: nav links + action buttons */}
        <div className="hidden lg:flex items-center justify-between gap-16">
          {/* Navigation links */}
          <nav className="flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: "easeOut" }}
              >
                <Link
                  to={link.href}
                  className={`font-['Plus_Jakarta_Sans',Helvetica] font-medium text-base tracking-[0] leading-[normal] transition-all cursor-pointer ${
                    location.pathname === link.href
                      ? "text-[#dc0afa]"
                      : "text-white hover:opacity-75"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Action buttons */}
          <motion.div
            className="flex items-center gap-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            {/* Leaderboard outline button */}
            <button
              onClick={() => navigate("/leaderboard")}
              className="inline-flex items-center justify-center px-7 py-4 bg-[#00000001] rounded-[48px] overflow-hidden border-[0.5px] border-solid border-[#fd7eff] shadow-[0px_0px_6px_#00000026,inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] backdrop-blur-[2.0px] backdrop-brightness-110 [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] cursor-pointer"
            >
              <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-base tracking-[0] leading-[normal]">
                Leaderboard
              </span>
            </button>

            {/* Get started gradient button */}
            <button
              onClick={() => navigate("/auth/signup")}
              className="relative flex w-[169px] h-[52px] items-center justify-center px-6 py-2.5 rounded-full overflow-hidden shadow-[0px_0px_24px_#ff8c3c8c] bg-[linear-gradient(153deg,rgba(255,200,87,1)_0%,rgba(255,138,60,1)_45%,rgba(255,62,196,1)_100%)] cursor-pointer border-0"
            >
              <span className="font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-[#333] text-base tracking-[0] leading-[normal]">
                Get started
              </span>
              <div className="absolute left-[calc(50.00%+138px)] -bottom-8 w-[120px] h-6 bg-[#fb00ff] rounded-[60px/12px] blur-[15px]" />
            </button>
          </motion.div>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 bg-transparent border-0 cursor-pointer z-50"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-6 h-[2px] bg-white rounded-full"
            animate={mobileOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-6 h-[2px] bg-white rounded-full"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block w-6 h-[2px] bg-white rounded-full"
            animate={mobileOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </motion.header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-[#020c30]/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <Link
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-2xl tracking-[0] leading-[normal] transition-all cursor-pointer ${
                    location.pathname === link.href
                      ? "text-[#dc0afa]"
                      : "text-white hover:opacity-75"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div className="flex flex-col items-center gap-4 mt-4">
              <button
                onClick={() => { navigate("/leaderboard"); setMobileOpen(false); }}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[#00000001] rounded-[48px] overflow-hidden border-[0.5px] border-solid border-[#fd7eff] cursor-pointer"
              >
                <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-base">
                  Leaderboard
                </span>
              </button>

              <button
                onClick={() => { navigate("/auth/signup"); setMobileOpen(false); }}
                className="relative flex w-[169px] h-[48px] items-center justify-center px-6 py-2.5 rounded-full overflow-hidden shadow-[0px_0px_24px_#ff8c3c8c] bg-[linear-gradient(153deg,rgba(255,200,87,1)_0%,rgba(255,138,60,1)_45%,rgba(255,62,196,1)_100%)] cursor-pointer border-0"
              >
                <span className="font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-[#333] text-base">
                  Get started
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
