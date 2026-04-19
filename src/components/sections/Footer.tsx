import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (href: string) => {
    if (href === "/#faq" && location.pathname === "/") {
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  return (
    <>
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
            <img src="/Nxellent-logos/desktop_logo_SVG_160x50.svg" alt="Nxellent Logo" className="h-5 md:h-7 w-auto object-contain" />
          </div>
          <div className="mt-[24px] max-w-[452px] flex items-center font-['Alexandria',Helvetica] font-light text-white text-sm md:text-base tracking-[0] leading-[normal]">
            Instant cyber due diligence for your code. Security scoring for the audit-ready age.
          </div>
          <div className="mt-10 md:mt-[70px] flex items-center opacity-50 font-['Alexandria',Helvetica] font-light text-white text-xs md:text-base tracking-[0] leading-[normal]">
            © 2026 NXELLENT Platform. Built for teams who care about shipping secure code.
          </div>
        </div>

        {/* Right: Nav links */}
        <nav className="inline-flex flex-col items-start gap-6 md:gap-10 relative flex-[0_0_auto]">
          {[{ label: "FAQ", href: "/#faq" }, { label: "How It Works", href: "/how-it-works" }, { label: "Pricing", href: "/pricing" }].map((link, index) => (
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
                  onClick={() => handleLinkClick(link.href)}
                >
                  {link.label}
                </div>
                <img className="relative w-3 h-3" alt="Frame" src="/figmaAssets/frame.svg" />
              </div>
            </motion.div>
          ))}
        </nav>
      </motion.footer>

    </>
  );
};

export default Footer;
