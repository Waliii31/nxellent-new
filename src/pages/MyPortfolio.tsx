import { useMemo, useState } from "react";
import {
  Download,
  TriangleAlert,
  Trophy,
  Scale,
  Search,
  Eye,
  Star,
  TrendingUp,
  ChartArea,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/sections/Navbar";
import SecondaryButton from "../components/ui/SecondaryButton";
import MetricStatCard from "../components/ui/MetricStatCard";
import FilterDropdown from "../components/ui/FilterDropdown";
import CriticalIssueCard from "../components/ui/CriticalIssueCard";
import ActionPillButton from "../components/ui/ActionPillButton";
import { useMyProjects } from "../hooks/api/useProjects";
import { useContractScans } from "../hooks/api/useContractScans";
import { useApplicationScans } from "../hooks/api/useApplicationScans";
import { useNotifications } from "../hooks/api/useNotifications";

const TierRing = ({ score, tier }: { score: number; tier: string }) => {
  const ring = tier === "Platinum" ? "#E777FF" : tier === "Gold" ? "#F6A94E" : "#8AA4FF";
  const radius = 28;
  const stroke = 6;
  const size = 72;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, score / 100));
  const dash = progress * circumference;

  return (
    <div className="relative flex items-center justify-center h-20 w-20">
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          fill="none"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <div className="text-lg font-bold text-white">{score}</div>
        <div className="text-[8px] text-white/70">{tier}</div>
      </div>
    </div>
  );
};

const tierFromScore = (score: number) => {
  if (score >= 90) return "Platinum";
  if (score >= 80) return "Gold";
  if (score >= 70) return "Silver";
  return "Bronze";
};

const formatChange = (latest?: number, previous?: number) => {
  if (typeof latest !== "number" || typeof previous !== "number") return "0";
  const diff = latest - previous;
  return `${diff >= 0 ? "+" : ""}${diff.toFixed(0)}`;
};

const MyPortfolio = () => {
  const navigate = useNavigate();
  const { data: projects } = useMyProjects();
  const { data: contractScans } = useContractScans();
  const { data: appScans } = useApplicationScans();
  const { data: notifications } = useNotifications({ limit: 3 });

  const [selectedTrack, setSelectedTrack] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState<Record<string, boolean>>({});
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const exportPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      // Use browser print with PDF styling
      window.print();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report. Please try again later.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const enriched = useMemo(() => {
    if (!projects) return [];
    const scans = [...(contractScans || []), ...(appScans || [])];

    return projects.map((p) => {
      const history = scans
        .filter((s) => s.project === p._id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = history[0];
      const previous = history[1];
      const score = Number(p.scoringDetails?.overall) ||
        Number(latest?.scores?.overall) ||
        Number(p.score) ||
        0;
      const tier = tierFromScore(score);
      const change = formatChange(latest?.scores?.overall, previous?.scores?.overall);

      // Determine last scan time
      let lastScan = "No scans yet";
      const lastScanDate = p.latestContractScan?.createdAt || p.latestApplicationScan?.createdAt || latest?.createdAt || p.scoringDetails?.calculatedAt;
      if (lastScanDate) {
        const hoursAgo = Math.round((Date.now() - new Date(lastScanDate).getTime()) / (1000 * 60 * 60));
        if (hoursAgo < 1) lastScan = "Just now";
        else if (hoursAgo < 24) lastScan = `${hoursAgo}h ago`;
        else lastScan = `${Math.round(hoursAgo / 24)}d ago`;
      }

      // Determine track type based on what scans exist
      let track = "Pending";
      if (p.latestContractScan && p.latestApplicationScan) track = "Both";
      else if (p.latestContractScan) track = "Contract";
      else if (p.latestApplicationScan) track = "Application";

      // Get chain/framework info
      const chain = p.latestContractScan?.blockchain || p.latestApplicationScan?.framework || "—";

      // Get scan status
      const scanStatus = p.latestContractScan?.scanStatus?.status || p.latestApplicationScan?.scanStatus?.status || "pending";
      const flags = [scanStatus === "completed" ? "Completed" : "Pending"];

      return {
        id: p.id || p._id || "",
        name: p.name,
        track,
        chain,
        score: Math.round(score),
        tier,
        change,
        lastScan,
        flags,
        visibility: p.visibility || "private",
      };
    });
  }, [projects, contractScans, appScans]);

  const trackOptions = useMemo(() => ["All Types", ...new Set(enriched.map((p) => p.track))], [enriched]);
  const statusOptions = useMemo(() => ["All Status", ...new Set(enriched.map((p) => p.flags[0]))], [enriched]);

  const filteredProjects = enriched.filter((p) => {
    const trackMatch = selectedTrack === "All Types" || p.track === selectedTrack;
    const statusMatch = selectedStatus === "All Status" || p.flags[0] === selectedStatus;
    const searchMatch = p.name.toLowerCase().includes(search.trim().toLowerCase());
    return trackMatch && statusMatch && searchMatch;
  });

  const averageScore = filteredProjects.length
    ? Math.round(filteredProjects.reduce((sum, p) => sum + p.score, 0) / filteredProjects.length)
    : 0;
  const highQuality = filteredProjects.filter((p) => p.score >= 80).length;
  const watchlistCount = Object.values(watchlist).filter(Boolean).length;

  return (
    <main
      style={{
        background: "url(/auth-page.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full min-h-svh"
    >
      <Navbar isFixed={false} />

      <header className="max-w-7xl px-4 sm:px-6 py-6 mx-auto flex justify-between gap-4 flex-wrap items-center">
        <div className="min-w-[200px]">
          <h1 className="urbanist mb-2 font-bold text-white text-xl sm:text-2xl">My Portfolio</h1>
          <p className="urbanist font-medium text-white/80 text-xs sm:text-sm max-w-md">Track and analyse your investment opportunities</p>
        </div>
        <SecondaryButton
          icon={isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          iconPosition="left"
          onClick={exportPdf}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? "Generating..." : "Export PDF"}
        </SecondaryButton>
      </header>

      <section className="w-full flex flex-col lg:flex-row max-w-7xl px-4 sm:px-6 pb-10 mx-auto items-start gap-6 lg:gap-8">
        <div className="w-full lg:w-[73%] space-y-10 min-w-0">
          <div
            className="w-full rounded-2xl border border-[#2A2355] bg-[#000124] shadow-[0_0_40px_0_#A855F733] relative"
            style={{
              borderTop: "1px solid #A855F733",
              boxShadow: "0px 0px 40px 0px #A855F733",
              background: "linear-gradient(174deg, rgba(0, 0, 0, 0.3) 10%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0.4) 100%)",
            }}
          >
            <div className="px-4 sm:px-6 py-5 sm:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2A2355]">
                <MetricStatCard label="Portfolio Avg" iconSrc="/Score.svg" value={averageScore.toString()} accentText="Overall score" />
                <MetricStatCard label="High Quality" iconSrc="/pink-profit.svg" value={highQuality.toString()} accentText="Score ≥80" />
                <MetricStatCard label="Watchlist" iconSrc="/single-star-pink.svg" value={watchlistCount.toString()} accentText="Projects" />
              </div>
            </div>
          </div>

          <div className="w-full px-1 sm:px-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="w-full sm:flex-1 sm:max-w-md flex flex-col gap-3">
                <h1 className="anybody text-lg sm:text-xl text-white">Portfolio Projects</h1>

                <div className="relative w-full rounded-[40px] bg-[#050827] border border-[#4C2199] px-4 sm:px-5 py-2.5 flex items-center gap-3">
                  <Search size={18} className="text-[#A19DAF] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-[#A19DAF]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                <FilterDropdown value={selectedTrack} options={trackOptions} onChange={setSelectedTrack} menuWidthClass="w-36" />
                <FilterDropdown value={selectedStatus} options={statusOptions} onChange={setSelectedStatus} menuWidthClass="w-36" />
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #A855F733",
                boxShadow: "0px 0px 40px 0px #A855F733",
                background: "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%)",
                backgroundColor: "#000124",
              }}
              className="mt-6 rounded-2xl bg-[#000124] shadow-[0_0_40px_0_#A855F733] border border-[#2A2355] overflow-hidden"
            >
              <div className="w-full">
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="text-[10px] sm:text-xs text-[#90A1B9] inter">
                      <th className="px-3 py-3 font-semibold w-[18%]">Project</th>
                      <th className="px-2 py-3 font-semibold w-[12%]">Type</th>
                      <th className="px-2 py-3 font-semibold w-[12%]">Framework</th>
                      <th className="px-2 py-3 font-semibold w-[12%]">Score</th>
                      <th className="px-2 py-3 font-semibold w-[10%]">Change</th>
                      <th className="px-2 py-3 font-semibold w-[12%]">Last Scan</th>
                      <th className="px-2 py-3 font-semibold w-[12%]">Status</th>
                      <th className="px-2 py-3 font-semibold w-[12%]">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3 text-white/60">
                            <Search size={40} className="opacity-30" />
                            <p className="inter text-sm">
                              {enriched.length === 0
                                ? "No projects yet. Start by scanning a project!"
                                : "No projects match your filters."}
                            </p>
                            {enriched.length > 0 && (
                              <button
                                onClick={() => { setSelectedTrack("All Types"); setSelectedStatus("All Status"); setSearch(""); }}
                                className="text-xs text-[#8B5CF6] hover:underline"
                              >
                                Clear filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                    {filteredProjects.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`text-sm text-white inter ${idx !== 0 ? "border-t border-white/5" : ""} hover:bg-white/5 transition`}
                      >
                        <td className="px-3 py-3">
                          <span className="block text-xs sm:text-sm truncate max-w-[120px]">{row.name}</span>
                        </td>

                        <td className="px-2 py-3">
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-linear-to-r from-[#8B5CF6] to-[#6366F1] text-[10px] text-white font-normal">
                            {row.track}
                          </span>
                        </td>

                        <td className="px-2 py-3">
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-linear-to-r from-[#DF46F2] to-[#A501FF] text-[10px] text-black font-semibold">
                            {row.chain}
                          </span>
                        </td>

                        <td className="px-2 py-3">
                          <div className="flex items-center">
                            <TierRing score={row.score} tier={row.tier} />
                          </div>
                        </td>

                        <td className="px-2 py-3">
                          <div className="flex items-center gap-1 text-[#22C55E] text-xs">
                            <TrendingUp size={14} />
                            <span>{row.change}</span>
                          </div>
                        </td>

                        <td className="px-2 py-3">
                          <span className="text-[10px] sm:text-xs text-[#9CA3AF]">{row.lastScan}</span>
                        </td>

                        <td className="px-2 py-3">
                          <div className="flex flex-wrap gap-1">
                            {row.flags.map((flag) => (
                              <span
                                key={flag}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10142E] text-[10px] text-[#E5E7EB] border border-[#6366F1]"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2 text-[#F472B6]">
                            <button type="button" className="hover:text-white transition" onClick={() => navigate(`/projects/${row.id}`)}>
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              className={`transition ${watchlist[row.id] ? "text-white" : "hover:text-white"}`}
                              onClick={() => setWatchlist((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
                            >
                              <Star size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[25%] lg:min-w-[280px] flex flex-col gap-6 text-white">
          <div className="bg-[#000124] w-full rounded-2xl py-5 px-5 sm:px-7 border-2 border-[#A855F733]/10">
            <div className="flex gap-2 items-center">
              <TriangleAlert color="#F59E0B" />
              <h1 className="text-lg inter font-medium">Alerts</h1>
            </div>

            {notifications?.notifications?.length ? (
              notifications.notifications.map((n) => (
                <CriticalIssueCard key={n.id} title={n.title} description={n.message} />
              ))
            ) : (
              <p className="text-sm text-white/70 mt-3">No recent alerts.</p>
            )}
          </div>

          <div className="bg-[#000124] w-full rounded-2xl py-5 px-5 sm:px-7 border-2 border-[#A855F733]/10">
            <div className="flex gap-2 items-center">
              <Trophy size={19} color="#EC4899" />
              <h1 className="text-lg inter font-medium">Actions</h1>
            </div>
            <p className="inter font-normal text-[#90A1B9] mt-3 text-xs sm:text-sm">Complete tasks to boost your scores</p>
            <div className="flex flex-col gap-3 mt-6">
              <ActionPillButton icon={<ChartArea color="#EC4899" size={17} />} label="Risk Analysis" onClick={() => navigate("/portfolio-risk-analysis")} />
              <ActionPillButton icon={<Scale color="#EC4899" size={17} />} label="Compare Top Risks" onClick={() => navigate("/compare-projects")} />
              <ActionPillButton icon={<ClipboardList color="#EC4899" size={17} />} label="Weekly Report" onClick={() => navigate("/defi-protocol-security-report")} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MyPortfolio;
