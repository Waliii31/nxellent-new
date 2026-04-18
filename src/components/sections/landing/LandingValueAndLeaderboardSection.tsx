import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Feature cards data
const featureCards = [
  {
    bg: "bg-[linear-gradient(180deg,rgba(2,0,43,1)_0%,rgba(0,2,52,1)_100%)]",
    imageBg: "bg-[url(/figmaAssets/image-22.png)]",
    imageLabel: "SECURITY",
    imageLabelLeft: "left-[110px]",
    imageLabelTop: "top-[158px]",
    showRedDot: true,
    title: "Security First",
    description:
      "Easy to know how to cryptocurrency works and friendly to newbie.",
  },
  {
    bg: "bg-[linear-gradient(180deg,rgba(0,2,65,1)_0%,rgba(0,0,59,1)_100%)]",
    imageBg: "bg-[url(/figmaAssets/image-22-1.png)]",
    imageLabel: "CONFIDENCE",
    imageLabelLeft: "left-[97px]",
    imageLabelTop: "top-[157px]",
    showRedDot: false,
    title: "Compete & Flex",
    description:
      "Public leaderboards and shareable score cards for maximum flex .",
  },
  {
    bg: "bg-[linear-gradient(180deg,rgba(0,0,39,1)_0%,rgba(1,0,34,1)_100%)]",
    imageBg: "bg-[url(/figmaAssets/image-22-2.png)]",
    imageLabel: "SPEED",
    imageLabelLeft: "left-[131px]",
    imageLabelTop: "top-[157px]",
    showRedDot: false,
    title: "Instant Results",
    description: "Get your risk score in minutes, not hours",
  },
];

// Stats bar data
const statsData = [
  {
    icon: "/figmaAssets/container-3.svg",
    iconW: "w-[50px] md:w-[76.36px]",
    iconH: "h-[44px] md:h-[66.02px]",
    label: "Avg Score",
    value: "5.2",
    valueSize: "text-xl md:text-[29.7px]",
    hasBorder: true,
    flex: "flex-1 grow",
  },
  {
    icon: "/figmaAssets/container.svg",
    iconW: "w-[50px] md:w-[76.36px]",
    iconH: "h-[50px] md:h-[76.36px]",
    label: "% Gold / Platinum",
    value: "67%",
    valueSize: "text-xl md:text-[29.7px]",
    hasBorder: true,
    flex: "flex-1 grow",
  },
  {
    icon: "/figmaAssets/container-2.svg",
    iconW: "w-[50px] md:w-[76.36px]",
    iconH: "h-[50px] md:h-[76.36px]",
    label: "Biggest Riser",
    value: "DAO Governance (+15)",
    valueSize: "text-sm md:text-xl",
    hasBorder: true,
    flex: "flex-[0_0_auto]",
    extraPr: "pr-4 md:pr-10",
  },
  {
    icon: "/figmaAssets/container-1.svg",
    iconW: "w-[50px] md:w-[76.36px]",
    iconH: "h-[50px] md:h-[76.36px]",
    label: "New This Week",
    value: "2",
    valueSize: "text-xl md:text-[29.7px]",
    hasBorder: false,
    flex: "flex-1 grow",
  },
];

// Leaderboard rows data
const leaderboardRows = [
  {
    rank: "#1",
    rankW: "w-[40px] md:w-[53px]",
    name: "Uniswap v#",
    category: "Defi",
    score: "923",
    badge: "PLATINUM",
    time: "2h ago",
    image: "/figmaAssets/image-22-3.png",
  },
  {
    rank: "#2",
    rankW: "w-[40px] md:w-[61px]",
    name: "Uniswap v#",
    category: "Defi",
    score: "923",
    badge: "PLATINUM",
    time: "2h ago",
    image: "/figmaAssets/image-22-4.png",
  },
  {
    rank: "#3",
    rankW: "w-fit",
    name: "Uniswap v#",
    category: "Defi",
    score: "923",
    badge: "PLATINUM",
    time: "2h ago",
    image: "/figmaAssets/image-22-5.png",
  },
  {
    rank: "#4",
    rankW: "w-fit",
    name: "Uniswap v#",
    category: "Defi",
    score: "923",
    badge: "PLATINUM",
    time: "2h ago",
    image: "/figmaAssets/image-22-6.png",
  },
  {
    rank: "#5",
    rankW: "w-fit",
    name: "Uniswap v#",
    category: "Defi",
    score: "923",
    badge: "PLATINUM",
    time: "2h ago",
    image: "/figmaAssets/image-22-7.png",
  },
];

// Reusable fade-up variant
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export const LandingValueAndLeaderboardSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-16 md:gap-[140px] w-full relative">

      {/* ── Why Nxellent Section ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-8 md:gap-10 relative self-stretch w-full">
        {/* Heading + Description */}
        <div className="flex flex-col md:flex-row items-start justify-center gap-4 md:gap-6 relative self-stretch w-full">
          <motion.div
            className="relative w-full md:w-[530px] -mt-px font-['Anybody',Helvetica] font-semibold text-white text-3xl sm:text-4xl md:text-5xl tracking-[0] leading-tight md:leading-[60px] text-center md:text-left"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Why <br />
            Nxellent
          </motion.div>
          <motion.div
            className="w-full md:w-[646px] -mt-px relative font-['Alexandria',Helvetica] font-normal text-[#ffffffcc] text-base md:text-xl tracking-[-0.40px] leading-[normal] text-center md:text-left"
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Scan your code, receive a clear risk score, and identify exactly
            where vulnerabilities exist across your smart contracts or
            applications. Understand severity levels and security gaps before
            attackers discover weaknesses, exploit them and compromise your
            system or user trust.
          </motion.div>
        </div>

        {/* Feature Cards — staggered slide-up, hover lift */}
        <div className="flex flex-col sm:flex-row w-full max-w-[1220px] items-center sm:items-stretch gap-6 md:gap-8 relative">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              className="relative flex-1 w-full sm:w-auto max-w-[400px] sm:max-w-none h-auto sm:h-[480px] md:h-[543px] p-[2px] rounded-[20px]"
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
            >
              {/* Gradient border wrapper */}
              <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(63,132,185,1)_0%,rgba(212,103,185,1)_100%)] rounded-[20px] z-0" />
              
              {/* Inner card with background */}
              <div className={`${card.bg} relative z-10 flex flex-col h-full items-center gap-6 md:gap-10 p-4 md:p-6 rounded-[18px] backdrop-blur-[97px] overflow-hidden`}>
                {/* Card image area */}
                <div
                  className={`relative w-full aspect-342/315 rounded-xl ${card.imageBg} bg-cover bg-center`}
                >
                <div
                  className={`absolute ${card.imageLabelTop} ${card.imageLabelLeft} h-[29px] flex items-center justify-center font-['Urbanist',Helvetica] font-bold text-white text-lg md:text-[24.3px] text-center tracking-[0] leading-[normal] whitespace-nowrap`}
                >
                  {card.imageLabel}
                </div>
                {card.showRedDot && (
                  <>
                    <div className="absolute top-[91px] left-[86px] w-[25px] h-[21px] bg-[#fd0031] rounded-[12.65px/10.63px]" />
                    <img
                      className="absolute top-[91px] left-[88px] w-[21px] h-[21px]"
                      alt="Image"
                      src="/figmaAssets/image-1.png"
                    />
                  </>
                )}
              </div>

              {/* Card text content */}
              <div className="flex flex-col items-start justify-center gap-2 md:gap-[11.89px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex items-center justify-center w-fit mt-[-1.49px] font-['Urbanist',Helvetica] font-medium text-white text-2xl md:text-[29.7px] text-center tracking-[0] leading-[normal]">
                  {card.title}
                </div>
                <div className="relative flex items-center self-stretch font-['Inter',Helvetica] font-medium text-white text-sm md:text-base tracking-[0] leading-[normal]">
                  {card.description}
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Top Projects / Leaderboard Section ──────────────────────────── */}
      <div className="flex flex-col items-center gap-6 md:gap-10 relative self-stretch w-full">
        {/* Section heading */}
        <motion.div
          className="flex items-start justify-center gap-6 relative self-stretch w-full"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="relative flex items-center w-fit -mt-px font-['Anybody',Helvetica] font-semibold text-white text-3xl sm:text-4xl md:text-5xl tracking-[0] leading-tight md:leading-[60px] whitespace-nowrap">
            Top Projects
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="relative w-full max-w-[646px] font-['Alexandria',Helvetica] font-normal text-[#ffffffcc] text-base md:text-xl text-center tracking-[-0.40px] leading-[normal] px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          See how the elite projects rank on security
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="flex flex-wrap w-full max-w-[1206px] items-start gap-2.5 p-4 md:p-7 relative rounded-2xl bg-[linear-gradient(135deg,rgba(0,0,0,0)_0%,rgba(168,85,247,0.15)_50%,rgba(0,0,0,0)_100%)]"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className={`flex h-auto md:h-[77.95px] items-center gap-3 md:gap-5 pl-2 md:pl-[25.98px] ${stat.extraPr ?? "pr-0"} py-2 md:py-0 relative ${stat.flex} min-w-[140px] ${stat.hasBorder ? "md:border-r-[1.08px] md:[border-right-style:solid] md:border-[#31415780]" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.img
                className={`relative ${stat.iconW} ${stat.iconH} ml-0 md:ml-[-22.18px]`}
                alt="Container"
                src={stat.icon}
                whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
              />
              <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                <div className="relative flex items-center w-fit mt-[-1.08px] opacity-80 font-['Inter',Helvetica] font-medium text-white text-xs md:text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  {stat.label}
                </div>
                <div
                  className={`relative flex items-center justify-center w-fit font-['Urbanist',Helvetica] font-medium text-white ${stat.valueSize} text-center tracking-[0] leading-[normal] whitespace-nowrap`}
                >
                  {stat.value}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Leaderboard Rows */}
        <div className="flex flex-col w-full max-w-[1220px] items-start justify-center gap-4 md:gap-8 relative">
          {leaderboardRows.map((row, index) => (
            <motion.div
              key={index}
              className="relative self-stretch w-full p-[2px] rounded-[16px] md:rounded-[20px]"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{
                scale: 1.015,
                boxShadow: "0 0 28px rgba(220,10,250,0.25)",
                transition: { duration: 0.25 },
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(63,132,185,1)_0%,rgba(212,103,185,1)_100%)] rounded-[16px] md:rounded-[20px] z-0" />
              
              <div className="flex items-center gap-3 sm:gap-5 md:gap-10 px-3 sm:px-4 md:px-6 py-2 relative z-10 w-full h-full rounded-[14px] md:rounded-[18px] backdrop-blur-[97px] bg-[linear-gradient(180deg,rgba(0,0,39,1)_0%,rgba(1,0,34,1)_100%)] overflow-hidden">
              {/* Rank number */}
              <div
                className={`${row.rankW} bg-[linear-gradient(270deg,rgba(252,245,250,1)_0%,rgba(220,10,250,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-['Plus_Jakarta_Sans',Helvetica] font-bold text-transparent text-2xl sm:text-3xl md:text-[40px] relative flex items-center justify-center text-center tracking-[0] leading-[normal] shrink-0`}
              >
                {row.rank}
              </div>

              {/* Project name + category */}
              <div className="flex flex-col items-start justify-center gap-1 md:gap-[11.89px] relative flex-1 grow min-w-0">
                <div className="relative flex items-center w-fit mt-[-1.49px] font-['Urbanist',Helvetica] font-medium text-white text-lg sm:text-2xl md:text-[29.7px] text-center tracking-[0] leading-[normal] truncate max-w-full">
                  {row.name}
                </div>
                <div className="relative flex items-center self-stretch font-['Inter',Helvetica] font-medium text-white text-xs md:text-base tracking-[0] leading-[normal]">
                  {row.category}
                </div>
              </div>

              {/* Score badge + time badge */}
              <div className="inline-flex items-center justify-end gap-2 sm:gap-4 md:gap-8 relative flex-[0_0_auto]">
                {/* Score */}
                <div className="inline-flex items-center relative flex-[0_0_auto]">
                  <img
                    className="relative w-[60px] h-[64px] sm:w-[80px] sm:h-[86px] md:w-[122px] md:h-[130px]"
                    alt="Image"
                    src={row.image}
                  />
                  <div className="inline-flex flex-col items-center gap-0.5 md:gap-1 relative flex-[0_0_auto]">
                    <div className="relative flex items-center justify-center w-fit mt-[-0.80px] font-['Plus_Jakarta_Sans',Helvetica] font-bold text-white text-lg sm:text-2xl md:text-[32px] text-center tracking-[0] leading-[normal]">
                      {row.score}
                    </div>
                    <div className="relative flex items-center justify-center w-fit font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-[#ffffffcc] text-[8px] sm:text-[10px] md:text-xs text-center tracking-[1.20px] leading-[normal]">
                      {row.badge}
                    </div>
                  </div>
                </div>

                {/* Time badge — hidden on very small screens */}
                <motion.div
                  className="hidden sm:inline-flex items-center justify-center gap-2 md:gap-6 px-3 md:px-5 py-1.5 md:py-2.5 relative flex-[0_0_auto] rounded-[40px] overflow-hidden bg-[linear-gradient(247deg,rgba(223,70,242,1)_0%,rgba(165,1,255,1)_100%)]"
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                >
                  <div className="inline-flex items-center gap-1.5 pt-0 pb-[0.59px] px-0 relative flex-[0_0_auto]">
                    <img
                      className="relative w-4 h-4 md:w-5 md:h-5"
                      alt="Ri time line"
                      src="/figmaAssets/ri-time-line.svg"
                    />
                    <div className="relative flex items-center w-fit -mt-px font-['Alexandria',Helvetica] font-light text-[#450146] text-xs md:text-sm tracking-[-0.32px] leading-[25.6px] whitespace-nowrap">
                      {row.time}
                    </div>
                  </div>
                </motion.div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Leaderboard Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px rgba(251,0,255,0)",
              "0 0 30px rgba(251,0,255,0.4)",
              "0 0 0px rgba(251,0,255,0)",
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[66.92px]"
        >
          <motion.button
            onClick={() => navigate("/leaderboard")}
            className="w-64 md:w-80 justify-center gap-2 px-6 md:px-10 py-3 md:py-4 h-auto rounded-full border-0 flex items-center relative overflow-hidden bg-[linear-gradient(153deg,rgba(255,200,87,1)_0%,rgba(255,138,60,1)_35%,rgba(255,62,196,1)_80%,rgba(255,0,64,1)_100%)] shadow-[0px_0px_30px_#ff7828a6] cursor-pointer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="absolute left-[calc(50%+160px)] -bottom-8 w-[120px] h-6 bg-[#fb00ff] rounded-[60px/12px] blur-[15px]" />
            <span className="relative flex items-center w-fit font-['Plus_Jakarta_Sans',Helvetica] font-semibold text-[#333] text-sm md:text-base tracking-[0] leading-[normal]">
              View Full Leaderboard
            </span>
            <img
              className="relative w-[18px] h-[18px]"
              alt="Frame"
              src="/figmaAssets/frame-2.svg"
            />
          </motion.button>
        </motion.div>
        </motion.div>
      </div>

    </div>
  );
};
