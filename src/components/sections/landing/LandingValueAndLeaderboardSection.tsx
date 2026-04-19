import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useLeaderboardProjects, usePublicProjects } from "../../../hooks/api/useProjects";
import type { ProjectResponseDto } from "../../../types/project";
import ProjectRow from "../../ui/ProjectRow";

const tierFromScore = (score?: number) => {
  if (typeof score !== "number") return "Bronze";
  if (score >= 90) return "PLATINUM";
  if (score >= 80) return "GOLD";
  if (score >= 70) return "SILVER";
  return "BRONZE";
};

const timeAgoFrom = (iso?: string) => {
  if (!iso) return "No scans yet";
  const delta = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(delta / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

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

  const { data: projectsData, isLoading } = useLeaderboardProjects({
    page: 1,
    limit: 5,
    tab: "overall",
    period: "all",
    search: "",
  });

  const safeProjects: ProjectResponseDto[] = useMemo(() => {
    if (Array.isArray(projectsData)) return projectsData;
    if (projectsData && typeof projectsData === "object") {
      if (Array.isArray((projectsData as any).data)) return (projectsData as any).data;
      if (Array.isArray((projectsData as any).projects)) return (projectsData as any).projects;
    }
    return [];
  }, [projectsData]);

  const { data: publicProjects = [] } = usePublicProjects();

  const dynamicStatsData = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const validPublicProjects = Array.isArray(publicProjects) ? publicProjects : [];

    const newThisWeek = validPublicProjects.filter(
      (p: any) => new Date(p.createdAt || Date.now()) >= oneWeekAgo
    ).length;

    const getScore = (p: any) => Number(p.scoringDetails?.overall || p.currentScores?.overall?.overall || p.currentScores?.contract?.overall || 0);

    const projectsWithScores = validPublicProjects.filter((p: any) => getScore(p) > 0);

    let avgScore = "0.0";
    let goldPlatinumPercent = "0%";
    let topRated = "N/A";

    if (projectsWithScores.length > 0) {
      const totalScore = projectsWithScores.reduce((acc, p) => acc + getScore(p), 0);
      avgScore = (totalScore / projectsWithScores.length).toFixed(1);

      const highTierCount = projectsWithScores.filter((p) => getScore(p) >= 75).length;
      goldPlatinumPercent = Math.round((highTierCount / projectsWithScores.length) * 100) + "%";

      const topProject = projectsWithScores.reduce((prev, curr) => (getScore(prev) > getScore(curr) ? prev : curr));
      topRated = `${topProject.name} (${Math.round(getScore(topProject))})`;
    }

    return [
      {
        icon: "/figmaAssets/container-3.svg",
        iconW: "w-[50px] md:w-[76.36px]",
        iconH: "h-[44px] md:h-[66.02px]",
        label: "Avg Score",
        value: avgScore,
        valueSize: "text-xl md:text-[29.7px]",
        hasBorder: true,
        flex: "flex-1 grow",
      },
      {
        icon: "/figmaAssets/container.svg",
        iconW: "w-[50px] md:w-[76.36px]",
        iconH: "h-[50px] md:h-[76.36px]",
        label: "% Gold / Platinum",
        value: goldPlatinumPercent,
        valueSize: "text-xl md:text-[29.7px]",
        hasBorder: true,
        flex: "flex-1 grow",
      },
      {
        icon: "/figmaAssets/container-2.svg",
        iconW: "w-[50px] md:w-[76.36px]",
        iconH: "h-[50px] md:h-[76.36px]",
        label: "Top Rated",
        value: topRated,
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
        value: newThisWeek.toString(),
        valueSize: "text-xl md:text-[29.7px]",
        hasBorder: false,
        flex: "flex-1 grow",
      },
    ];
  }, [publicProjects]);

  const topProjects = useMemo(() => {
    return safeProjects
      .map((p: ProjectResponseDto) => {
        const score = Number(p.scoringDetails?.overall) ||
          Number(p.currentScores?.overall?.overall) ||
          Number(p.currentScores?.contract?.overall) ||
          Number(p.currentScores?.application?.overall) ||
          0;
        const shieldRank = p.scoringDetails?.shieldRank || "";
        const lastUpdated = p.updatedAt || p.createdAt;
        const contractScore = Number(p.scoringDetails?.contractTrack?.subscore) || 0;
        const applicationScore = Number(p.scoringDetails?.applicationTrack?.subscore) || 0;
        const coverage = Number(p.scoringDetails?.coverage) || 0;
        const contractIssues = p.latestContractScan?.issueCounts;
        const appIssues = p.latestApplicationScan?.issueCounts;
        const totalIssues = (contractIssues?.total || 0) + (appIssues?.total || 0);
        const criticalIssues = (contractIssues?.critical || 0) + (appIssues?.critical || 0);
        const hasContract = !!p.latestContractScan || !!p.scoringDetails?.contractTrack;
        const hasApplication = !!p.latestApplicationScan || !!p.scoringDetails?.applicationTrack;

        return {
          id: p._id || p.id,
          name: p.name || "Unnamed Project",
          category: String(p.type || "").toLowerCase().includes("app") ? "App" : "Defi",
          score,
          tier: shieldRank || tierFromScore(score),
          timeAgo: timeAgoFrom(lastUpdated),
          contractScore,
          applicationScore,
          coverage,
          totalIssues,
          criticalIssues,
          shieldRank: shieldRank || undefined,
          hasContract,
          hasApplication,
          change: { value: 0, arrowSrc: "/profit.svg" },
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((p, idx) => ({ ...p, rank: idx + 1 }));
  }, [safeProjects]);

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
              className="relative flex-1 w-full sm:w-auto max-w-[400px] sm:max-w-none h-auto sm:h-[480px] md:h-[543px] p-0.5 rounded-[20px]"
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
          {dynamicStatsData.map((stat, index) => (
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
        <div className="flex flex-col w-full max-w-[1220px] items-stretch justify-center gap-4 relative">
          {isLoading ? (
            <p className="text-white/70 text-sm text-center py-6">Loading leaderboard…</p>
          ) : topProjects.length === 0 ? (
            <p className="text-white/70 text-sm text-center py-6">No public scans in the leaderboard yet</p>
          ) : (
            topProjects.map((p, index) => (
              <motion.div
                key={p.id || index}
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.015, transition: { duration: 0.25 } }}
              >
                <ProjectRow
                  rank={p.rank}
                  name={p.name}
                  category={p.category}
                  score={p.score}
                  tier={p.tier}
                  timeAgo={p.timeAgo}
                  change={p.change}
                  contractScore={p.contractScore}
                  applicationScore={p.applicationScore}
                  coverage={p.coverage}
                  totalIssues={p.totalIssues}
                  criticalIssues={p.criticalIssues}
                  shieldRank={p.shieldRank}
                  hasContract={p.hasContract}
                  hasApplication={p.hasApplication}
                />
              </motion.div>
            ))
          )}
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
