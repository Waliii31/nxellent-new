import React, { useEffect, useMemo, useState } from "react";
import { Search, Trophy, FileText, Code, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLeaderboardProjects } from "../../hooks/api/useProjects";
import type { ProjectResponseDto } from "../../types/project";

import ProjectRow from "../ui/ProjectRow";
import gauge from "/guage.png";
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

  const {
    data: projectsData,
    isLoading: loadingProjects,
    isError: projectsError,
    refetch: refetchProjects,
  } = useLeaderboardProjects(page, limit);

  const safeProjects: ProjectResponseDto[] = useMemo(() => {
    let result: any[] = [];
    if (Array.isArray(projectsData)) result = [...projectsData];
    else if (projectsData && typeof projectsData === "object") {
      if (Array.isArray((projectsData as any).data)) result = [...(projectsData as any).data];
      else if (Array.isArray((projectsData as any).projects)) result = [...(projectsData as any).projects];
    }

    // Populate demo project up to 50 items for testing
    if (!loadingProjects && result.length < 50) {
      if (result.length > 0) {
        const demoCount = 50 - result.length;
        const template = result[0];
        for (let i = 0; i < demoCount; i++) {
          result.push({
            ...template,
            id: `demo-${i}`,
            _id: `demo-${i}`,
            name: `${template.name || 'Demo Project'} (Demo ${i + 1})`,
          });
        }
      } else {
        for (let i = 0; i < 50; i++) {
          result.push({
            id: `demo-empty-${i}`,
            _id: `demo-empty-${i}`,
            name: `Simulated Project #${i + 1}`,
            type: i % 2 === 0 ? "app" : "defi",
            visibility: "public",
            score: 75 + (i % 20),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    return result as ProjectResponseDto[];
  }, [projectsData, loadingProjects]);

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
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => [p.name, p.category, p.chain, p.id].some((f) => f.toLowerCase().includes(q)));
    }
    if (chain !== "All Chains") list = list.filter((p) => p.chain === chain);
    if (category === "Defi") {
      list = list.filter((p) => p.hasContract);
    } else if (category === "App") {
      list = list.filter((p) => p.hasApplication);
    }
    if (region !== "Global") list = list.filter((p) => p.region === region);
    if (visibility !== "All") list = list.filter((p) => p.visibility === visibility);
    if (time !== "All Time") {
      const now = Date.now();
      const timeMap: Record<string, number> = {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      };
      const ms = timeMap[time];
      if (ms) {
        list = list.filter((p) => p.timestamp >= now - ms);
      }
    }
    return list;
  }, [allRows, chain, category, visibility, time, search, region]);

  const paginatedProjects = useMemo(() => {
    // Let backend pagination handle it, or slice locally if backend returned flat list
    if (projectsData?.meta?.page !== undefined && projectsData?.data?.length <= limit) {
      return filteredProjects; // It's already subset
    }
    return filteredProjects.slice((page - 1) * limit, page * limit);
  }, [filteredProjects, page, limit, projectsData]);

  const actualTotalPages = Math.max(1, projectsData?.meta?.totalPages || projectsData?.totalPages || Math.ceil(filteredProjects.length / limit));

  return (
    <section className="relative w-full text-white py-10 sm:py-14 md:py-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex z-10 items-center justify-center w-full py-6 md:py-10 px-2 sm:px-0">
          <div className="flex items-center w-full md:w-auto p-1 rounded-full bg-[#0B0B2A] border border-[#272744] overflow-x-auto no-scrollbar">
            {[
              { id: "All", label: "Overall", icon: Trophy },
              { id: "Defi", label: "Smart Contracts", icon: FileText },
              { id: "App", label: "Applications", icon: Code },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`flex items-center justify-center flex-1 md:flex-none whitespace-nowrap gap-2 px-3 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${category === tab.id
                  ? "bg-[#7A49F2] text-white shadow-lg shadow-[#7A49F2]/25"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label === "Smart Contracts" ? "Contracts" : tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6 mb-4 px-3 sm:px-0">
          <div
            className="flex items-center justify-center gap-2 w-full lg:max-w-md px-4 py-2.5 rounded-[40px] border border-[#272744] bg-[#0B0B2A] text-sm shadow-[0_0_6px_rgba(0,0,0,0.25)] focus-within:ring-2 focus-within:ring-[#A501FF]"
          >
            <Search size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, IDs, repos..."
              className="w-full jakarta bg-transparent outline-none placeholder:text-white/60 text-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center w-full lg:w-auto">
            {["All Time", "24h", "7d", "30d"].map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`px-4 sm:px-8 py-2 font-semibold rounded-full text-xs sm:text-sm transition-colors border whitespace-nowrap
                  ${time === t
                    ? "bg-[#7A49F2] border-[#A274FF] text-white"
                    : "bg-[#0B0B2A] border-[#272744] text-white/80 hover:bg-[#101040]"
                  }
                `}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => setSortHighLow((s) => !s)}
              className="rounded-full px-4 py-2 text-xs sm:text-sm border border-[#7A49F2] bg-[#05052A] hover:bg-[#0B0B3A] transition-colors whitespace-nowrap"
            >
              {sortHighLow ? "Score (High–Low)" : "Score (Low–High)"}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-4 px-3 sm:px-0">
          <KPIStatsBar />
        </div>

        {projectsError && (
          <p className="text-red-300 text-sm mb-4">Failed to load leaderboard. Please try again.</p>
        )}

        <div className="flex flex-col gap-4">
          {(loadingProjects) && (
            <p className="text-white/70 text-sm">Loading leaderboard…</p>
          )}
          {!loadingProjects && paginatedProjects.length === 0 && (
            <p className="text-white/70 text-sm">No projects match your filters yet.</p>
          )}
          {paginatedProjects.map((p) => (
            <ProjectRow
              key={`${p.name}-${p.rank}`}
              rank={p.rank}
              name={p.name}
              category={p.category}
              score={p.score}
              tier={p.tier}
              timeAgo={p.timeAgo}
              gaugeSrc={gauge}
              change={p.change}
              // Pass new metrics
              contractScore={p.contractScore}
              applicationScore={p.applicationScore}
              coverage={p.coverage}
              totalIssues={p.totalIssues}
              criticalIssues={p.criticalIssues}
              shieldRank={p.shieldRank}
              hasContract={p.hasContract}
              hasApplication={p.hasApplication}
            />
          ))}
        </div>

        {/* Load More & Pagination Section */}
        {filteredProjects.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-8 w-full max-w-4xl mx-auto px-2">
            
            {/* Load More Projects */}
            {filteredProjects.length > limit && limit < 12 && (
              <button
                onClick={() => setLimit((l) => l + 4)}
                className="flex items-center gap-2 px-8 py-3 rounded-full border border-[#272744] bg-[#0B0B2A] text-white/90 font-medium hover:bg-[#101040] hover:text-white transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]"
              >
                Load More Projects
                <ChevronDown size={16} className="text-white/60" />
              </button>
            )}

            {/* Pagination Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full p-2 sm:p-3 rounded-3xl border border-[#272744] bg-[#05051E] gap-4">
              
              {/* Pages */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); setLimit(8); }}
                  disabled={page === 1}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#272744] bg-transparent text-white/70 hover:bg-[#1A1A32] disabled:opacity-50 transition-all font-medium"
                >
                  <ChevronLeft size={16} />
                </button>

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
                        <span key={`ellipsis-${index}`} className="text-white/50 px-1 sm:px-2 tracking-widest text-sm">
                          ...
                        </span>
                      );
                    }
                    const isActive = page === pNum;
                    return (
                      <button
                        key={`page-${pNum}`}
                        onClick={() => { setPage(typeof pNum === "number" ? pNum : 1); setLimit(8); }}
                        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-medium transition-all text-sm ${
                          isActive
                            ? "bg-[#A501FF] text-white shadow-[0_0_12px_0_rgba(165,1,255,0.4)]"
                            : "border border-[#272744] bg-transparent text-white/70 hover:bg-[#1A1A32]"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  });
                })()}

                <button
                  onClick={() => { setPage((p) => Math.min(actualTotalPages, p + 1)); setLimit(8); }}
                  disabled={page === actualTotalPages}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#272744] bg-transparent text-white/70 hover:bg-[#1A1A32] disabled:opacity-50 transition-all font-medium"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Jump to position */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:ml-auto">
                <div className="w-px h-8 bg-[#272744] hidden md:block"></div>
                <span className="text-[#6A6A88] text-[13px] sm:text-sm font-medium whitespace-nowrap">
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
                  <div className="flex items-center h-9 sm:h-10 px-3 rounded-xl border border-[#272744] bg-[#0B0B2A] focus-within:border-[#6A6A88] transition-colors">
                    <span className="text-[#6A6A88] mr-2 text-sm font-mono">#</span>
                    <input
                      type="number"
                      min="1"
                      value={jumpTo}
                      onChange={(e) => setJumpTo(e.target.value)}
                      className="w-12 sm:w-16 bg-transparent outline-none text-white text-sm"
                      placeholder="100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-9 sm:h-10 px-5 sm:px-6 rounded-xl border border-[#272744] bg-[#1A1A32] hover:bg-[#272744] text-white font-medium transition-all text-[13px] sm:text-sm"
                  >
                    Go
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SmartContracts;
