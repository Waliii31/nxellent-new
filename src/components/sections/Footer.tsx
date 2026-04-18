import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {

  return (
    <>
      <footer className="w-full bg-[#130D2D] py-10 sm:py-12 md:py-16 mt-16">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-start justify-between gap-10 md:gap-0">
          {/* Left Section */}
          <div className="flex flex-col gap-4 max-w-xl">
            {/* Logo / Brand Name */}
            <img src="/Nxellent-logos/desktop_logo_SVG_160x50.svg" alt="Nxellent Logo" className="h-10 sm:h-[46px] w-auto object-contain" />

            {/* Description */}
            <p className="alexandria text-white/80 text-[15px] sm:text-[17px] leading-[150%] max-w-md">
              Instant cyber due diligence for your code. Security scoring for the
              cyberpunk age.
            </p>
          </div>

          {/* Right Section (Links) */}
          <div className="flex flex-col items-start md:items-end gap-6 text-right">
            <Link
              to="/leaderboard"
              className="group flex items-center gap-2 text-white font-medium text-[15px] sm:text-[16px] transition-all duration-200 hover:opacity-80"
            >
              Leaderboard
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              to="/how-it-works"
              className="group flex items-center gap-2 text-white font-medium text-[15px] sm:text-[16px] transition-all duration-200 hover:opacity-80"
            >
              How It Works
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              to="/pricing"
              className="group flex items-center gap-2 text-white font-medium text-[15px] sm:text-[16px] transition-all duration-200 hover:opacity-80"
            >
              Pricing
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
        <p className="alexandria text-center text-white/80 text-[15px] sm:text-[17px] leading-[150%] w-full mx-auto mt-10">© 2024 NXELLENT Platform. Built for builders who care about security.</p>
      </footer>

    </>
  );
};

export default Footer;
