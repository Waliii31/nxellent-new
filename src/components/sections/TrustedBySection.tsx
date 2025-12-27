import { Shield, Users, Lock } from "lucide-react";
import React from "react";

/** ---------- Types ---------- */
type Stat = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

const stats: Stat[] = [
  {
    icon: (
      <Shield
        color="#EC4899"
        size={42}
        style={{
          filter: "drop-shadow(0 0 6px rgba(236,72,153,0.6)) drop-shadow(0 0 12px rgba(236,72,153,0.4))",
        }}
      />
    ),
    title: "Security First",
    subtitle: "Over 10,000 issues detected and fixed",
  },
  {
    icon: (
      <Lock
        color="#EC4899"
        size={42}
        style={{
          filter: "drop-shadow(0 0 6px rgba(236,72,153,0.6)) drop-shadow(0 0 12px rgba(236,72,153,0.4))",
        }}
      />
    ),
    title: "Compliance Ready",
    subtitle: "SOC2 + ISO27001 certified scanning",
  },
  {
    icon: (
      <Users
        color="#EC4899"
        size={42}
        style={{
          filter: "drop-shadow(0 0 6px rgba(236,72,153,0.6)) drop-shadow(0 0 12px rgba(236,72,153,0.4))",
        }}
      />
    ),
    title: "Trusted by 1000+",
    subtitle: "Projects scanned across ecosystems",
  },
];

const TrustedBySection: React.FC = () => {
  return (
    <section className="w-full text-white py-20 px-6 md:px-10 text-center">
      {/* Heading */}
      <h2 className="anybody  text-4xl md:text-5xl font-extrabold mb-16">
        Trusted by Security-First Teams
      </h2>

      {/* Middle quote box */}
      <div className="max-w-4xl mx-auto bg-[#000124] rounded-xl py-10 px-6 my-12 border border-white/5">
        <p className="alexandria text-lg italic text-white/90">
          "NXELLENT is the new due diligence standard for Web3."
        </p>
        <p className="alexandria mt-4 text-white/60 text-sm">— Leading Web3 VC</p>
      </div>

      {/* Bottom stats */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            {/* Glowing icon */}
            <div
              className="w-[110px] h-[110px] mb-0 rounded-full flex items-center justify-center"
            >
              {item.icon}
            </div>

            {/* Text */}
            <h2 className="anybody  text-xl font-semibold mb-2">{item.title}</h2>
            <p className="alexandria text-sm text-white/70">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedBySection;
