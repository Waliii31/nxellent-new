import React, { useEffect, useMemo, useState } from "react";
import { Search, Trophy, FileText, Code, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLeaderboardProjects } from "../../hooks/api/useProjects";
import type { ProjectResponseDto } from "../../types/project";

import ProjectRow from "../ui/ProjectRow";
import arrowUp from "/profit.svg";
import KPIStatsBar from "../ui/KPIStatsBar";



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

const SmartContracts: React.FC = () => {
  const [search, setSearch] = useState("");
  const [chain] = useState("All Chains");
  const [category, setCategory] = useState("All");
  const [region] = useState("Global");
  const [time, setTime] = useState("All Time");
  const [visibility] = useState("All");
  const [sortHighLow, setSortHighLow] = useState(true);
  const liveUpdates = false; // Live updates feature disabled

  // Pagination new states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [jumpTo, setJumpTo] = useState("");

  // Debounce search and reset pagination dynamically on filter shifts
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category, time]);

  const apiTab = category === "Defi" ? "contracts" : category === "App" ? "applications" : "overall";
  const apiPeriod = time === "24h" ? "1d" : time === "7d" ? "7d" : time === "30d" ? "1m" : "all";

  const {
    data: projectsData,
    isLoading: loadingProjects,
    isError: projectsError,
    refetch: refetchProjects,
  } = useLeaderboardProjects({
    page,
    limit,
    tab: apiTab,
    period: apiPeriod,
    search: debouncedSearch,
  });

  const safeProjects: ProjectResponseDto[] = useMemo(() => {
    if (Array.isArray(projectsData)) return projectsData;
    if (projectsData && typeof projectsData === "object") {
      if (Array.isArray((projectsData as any).data)) return (projectsData as any).data;
      if (Array.isArray((projectsData as any).projects)) return (projectsData as any).projects;
    }
    return [];
  }, [projectsData]);

  // If the backend returns flat arrays instead of pagination payloads, slice locally.
  // Extracted later to actualTotalPages after evaluating filtered list.

  useEffect(() => {
    if (!liveUpdates) return;
    const id = setInterval(() => {
      refetchProjects();
    }, 15000);
    return () => clearInterval(id);
  }, [liveUpdates, refetchProjects]);





  const allRows = useMemo(() => {
    if (!safeProjects) return [];

    return safeProjects
      .map((p: ProjectResponseDto) => {
        // Extract score from scoringDetails or currentScores
        const score = Number(p.scoringDetails?.overall) ||
          Number(p.currentScores?.overall?.overall) ||
          Number(p.currentScores?.contract?.overall) ||
          Number(p.currentScores?.application?.overall) ||
          0;

        // Determine shield rank from scoringDetails
        const shieldRank = p.scoringDetails?.shieldRank || "";

        // Use updatedAt or createdAt for last updated
        const lastUpdated = p.updatedAt || p.createdAt;

        // Contract/Application scores from scoringDetails tracks
        const contractScore = Number(p.scoringDetails?.contractTrack?.subscore) || 0;
        const applicationScore = Number(p.scoringDetails?.applicationTrack?.subscore) || 0;

        // Coverage from scoringDetails
        const coverage = Number(p.scoringDetails?.coverage) || 0;

        // Issue counts from latestContractScan or latestApplicationScan
        const contractIssues = p.latestContractScan?.issueCounts;
        const appIssues = p.latestApplicationScan?.issueCounts;
        const totalIssues = (contractIssues?.total || 0) + (appIssues?.total || 0);
        const criticalIssues = (contractIssues?.critical || 0) + (appIssues?.critical || 0);

        // Has contract/application based on scan presence
        const hasContract = !!p.latestContractScan || !!p.scoringDetails?.contractTrack;
        const hasApplication = !!p.latestApplicationScan || !!p.scoringDetails?.applicationTrack;

        return {
          id: p._id || p.id,
          name: p.name || "Unnamed Project",
          category: String(p.type || "").toLowerCase().includes("app") ? "App" : "Defi",
          chain: p.platform || "Unknown",
          region: "Global",
          visibility: p.visibility === "public" ? "Public" : "Private",
          score,
          tier: shieldRank || tierFromScore(score),
          timeAgo: timeAgoFrom(lastUpdated),
          timestamp: lastUpdated ? new Date(lastUpdated).getTime() : 0,

          // New metrics
          contractScore,
          applicationScore,
          coverage,
          totalIssues,
          criticalIssues,
          shieldRank: shieldRank || undefined,
          hasContract,
          hasApplication,

          change: {
            value: 0, // Trend data not yet available in this endpoint
            arrowSrc: arrowUp, // Default
          },
        };
      })
      .sort((a, b) => (sortHighLow ? b.score - a.score : a.score - b.score))
      .map((p, idx) => ({ ...p, rank: idx + 1 }));
  }, [safeProjects, sortHighLow]);

  const filteredProjects = useMemo(() => {
    let list = allRows;
    if (chain !== "All Chains") list = list.filter((p) => p.chain === chain);
    if (region !== "Global") list = list.filter((p) => p.region === region);
    if (visibility !== "All") list = list.filter((p) => p.visibility === visibility);
    return list;
  }, [allRows, chain, region, visibility]);

  const paginatedProjects = useMemo(() => {
    // Let backend pagination handle it, or slice locally if backend returned flat list
    if (projectsData?.meta?.page !== undefined && projectsData?.data?.length <= limit) {
      return filteredProjects; // It's already subset
    }
    return filteredProjects.slice((page - 1) * limit, page * limit);
  }, [filteredProjects, page, limit, projectsData]);

  const actualTotalPages = Math.max(1, projectsData?.meta?.totalPages || projectsData?.totalPages || Math.ceil(filteredProjects.length / limit));

  return (
    <section className="relative w-full text-white py-16 sm:py-20 md:py-24 px-5 sm:px-10 md:px-16 lg:px-[120px] overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ backgroundImage: "radial-gradient(circle, rgba(140,80,255,0.05) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header with animation */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            <span style={{
              background: "linear-gradient(90deg, rgba(255,200,87,1) 0%, rgba(255,62,196,1) 50%, rgba(140,80,255,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Top Rated Projects
            </span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base">Explore the most secure and audited projects</p>
        </motion.div>

        {/* Tabs with animations */}
        <motion.div
          className="flex z-10 items-center justify-center w-full py-6 md:py-8 px-2 sm:px-0 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex items-center w-full md:w-auto p-1.5 rounded-full bg-linear-to-r from-[#0B0B2A] to-[#1A1A3A] border border-[#7A49F2]/20 overflow-x-auto no-scrollbar shadow-lg shadow-[#7A49F2]/10">
            {[
              { id: "All", label: "Overall", icon: Trophy },
              { id: "Defi", label: "Smart Contracts", icon: FileText },
              { id: "App", label: "Applications", icon: Code },
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`flex items-center justify-center flex-1 md:flex-none whitespace-nowrap gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  category === tab.id
                    ? "bg-[linear-gradient(90deg,#FFC857_0%,#FF8A3C_35%,#FF3EC4_80%,#FF0040_100%)] text-[#333333] shadow-lg shadow-[#A501FF]/40"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label === "Smart Contracts" ? "Contracts" : tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          className="flex flex-col gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          {/* Search Bar */}
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl border border-[#7A49F2]/30 bg-linear-to-r from-[#0B0B2A]/50 to-[#1A1A3A]/50 text-sm shadow-lg shadow-[#7A49F2]/5 focus-within:ring-2 focus-within:ring-[#A501FF] focus-within:border-[#A501FF] transition-all duration-300 backdrop-blur-sm">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <Search size={18} className="text-[#A501FF]" />
              </motion.div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, IDs, repos..."
                className="w-full bg-transparent outline-none placeholder:text-white/50 text-white text-sm"
              />
            </div>
          </motion.div>

          {/* Time Filters and Sort */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start w-full">
              {["All Time", "24h", "7d", "30d"].map((t, idx) => (
                <motion.button
                  key={t}
                  onClick={() => setTime(t)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className={`px-4 sm:px-6 py-2.5 font-semibold rounded-full text-xs sm:text-sm transition-all border whitespace-nowrap ${
                    time === t
                      ? "bg-linear-to-r from-[#ffc857] to-[#ff7e2a] border-[#ffc857] text-[#020C30] shadow-lg shadow-[#ffc857]/30"
                      : "bg-[#0B0B2A] border-[#272744] text-white/80 hover:border-[#7A49F2] hover:bg-[#101040]"
                  }`}
                >
                  {t}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => setSortHighLow((s) => !s)}
              whileHover={{ scale: 1.05, y: -2 }}
              className="rounded-full px-6 py-2.5 text-xs sm:text-sm border border-[#ff3ec4]/50 bg-linear-to-r from-[#ff3ec4]/10 to-[#A501FF]/10 hover:from-[#ff3ec4]/20 hover:to-[#A501FF]/20 text-white font-semibold transition-all whitespace-nowrap shadow-lg shadow-[#ff3ec4]/20"
            >
              {sortHighLow ? "Score (High–Low)" : "Score (Low–High)"}
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Stats Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <KPIStatsBar />
        </motion.div>

        {/* Error Message */}
        {projectsError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mb-4 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Failed to load leaderboard. Please try again.
          </motion.p>
        )}

        {/* Projects List */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {loadingProjects && (
            <motion.div className="flex items-center justify-center py-12" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
              <p className="text-white/70 text-sm">Loading top projects…</p>
            </motion.div>
          )}
          {!loadingProjects && paginatedProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-white/70 text-sm">No projects match your filters yet.</p>
            </motion.div>
          )}
          {paginatedProjects.map((p, idx) => (
            <motion.div
              key={`${p.name}-${p.rank}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
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
          ))}
        </motion.div>

        {/* Load More & Pagination Section */}
        {filteredProjects.length > 0 && (
          <motion.div
            className="mt-12 flex flex-col items-center gap-8 w-full max-w-4xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            
            {/* Load More Projects */}
            {filteredProjects.length > limit && limit < 12 && (
              <motion.button
                onClick={() => setLimit((l) => l + 4)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#7A49F2]/50 bg-linear-to-r from-[#7A49F2]/10 to-[#A501FF]/10 hover:from-[#7A49F2]/20 hover:to-[#A501FF]/20 text-white/90 font-semibold hover:text-white transition-all shadow-lg shadow-[#7A49F2]/20"
              >
                Load More Projects
                <ChevronDown size={18} className="text-white/70" />
              </motion.button>
            )}

            {/* Pagination Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full p-4 rounded-3xl border border-[#7A49F2]/20 bg-linear-to-r from-[#05051E]/50 to-[#0B0B2A]/50 gap-4 backdrop-blur-sm shadow-lg shadow-[#7A49F2]/10">
              
              {/* Pages */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); setLimit(8); }}
                  disabled={page === 1}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#7A49F2]/40 bg-linear-to-br from-[#1A1A32] to-[#0B0B2A] text-white/70 hover:text-white hover:border-[#A501FF] hover:bg-linear-to-br hover:from-[#2A1A3A] hover:to-[#1A0B2A] disabled:opacity-50 transition-all font-semibold"
                >
                  <ChevronLeft size={18} />
                </motion.button>

                {(() => {
                  const getPageNumbers = () => {
                    const total = actualTotalPages;
                    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
                    if (page <= 3) return [1, 2, 3, "...", total];
                    if (page >= total - 2) return [1, "...", total - 2, total - 1, total];
                    return [1, "...", page, "...", total];
                  };

                  return getPageNumbers().map((pNum, index) => {
                    if (pNum === "...") {
                      return (
                        <span key={`ellipsis-${index}`} className="text-white/50 px-2 tracking-widest text-sm">
                          ...
                        </span>
                      );
                    }
                    const isActive = page === pNum;
                    return (
                      <motion.button
                        key={`page-${pNum}`}
                        onClick={() => { setPage(typeof pNum === "number" ? pNum : 1); setLimit(8); }}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.92 }}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold transition-all text-sm ${
                          isActive
                            ? "bg-linear-to-r from-[#A501FF] to-[#7A49F2] text-white shadow-lg shadow-[#A501FF]/50 border border-[#A501FF]"
                            : "border border-[#272744] bg-linear-to-br from-[#1A1A32] to-[#0B0B2A] text-white/70 hover:text-white hover:border-[#7A49F2] hover:bg-linear-to-br hover:from-[#2A1A3A] hover:to-[#1A0B2A]"
                        }`}
                      >
                        {pNum}
                      </motion.button>
                    );
                  });
                })()}

                <motion.button
                  onClick={() => { setPage((p) => Math.min(actualTotalPages, p + 1)); setLimit(8); }}
                  disabled={page === actualTotalPages}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#7A49F2]/40 bg-linear-to-br from-[#1A1A32] to-[#0B0B2A] text-white/70 hover:text-white hover:border-[#A501FF] hover:bg-linear-to-br hover:from-[#2A1A3A] hover:to-[#1A0B2A] disabled:opacity-50 transition-all font-semibold"
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>

              {/* Jump to position */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:ml-auto">
                <div className="w-full sm:w-px h-px sm:h-8 bg-[#272744]/50 hidden sm:block"></div>
                <span className="text-[#6A6A88] text-sm font-semibold whitespace-nowrap">
                  Jump to position
                </span>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    let val = parseInt(jumpTo);
                    if (!isNaN(val)) {
                      val = Math.max(1, val);
                      const targetPage = Math.ceil(val / 8);
                      setPage(Math.min(actualTotalPages, Math.max(1, targetPage)));
                      setLimit(8);
                      setJumpTo("");
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center h-10 px-3 rounded-lg border border-[#7A49F2]/40 bg-linear-to-r from-[#0B0B2A] to-[#1A1A3A] focus-within:border-[#A501FF] focus-within:shadow-lg focus-within:shadow-[#A501FF]/20 transition-all">
                    <span className="text-[#6A6A88] mr-2 text-sm font-semibold">#</span>
                    <input
                      type="number"
                      min="1"
                      value={jumpTo}
                      onChange={(e) => setJumpTo(e.target.value)}
                      className="w-14 bg-transparent outline-none text-white text-sm font-mono"
                      placeholder="100"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 px-6 rounded-lg border border-[#7A49F2]/50 bg-linear-to-r from-[#7A49F2]/20 to-[#A501FF]/20 hover:from-[#A501FF] hover:to-[#7A49F2] text-white font-semibold transition-all text-sm shadow-lg shadow-[#A501FF]/20 hover:shadow-[#A501FF]/40"
                  >
                    Go
                  </motion.button>
                </form>
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SmartContracts;
