import React, { useMemo, useState } from "react";
import { Download, X, ChevronDown, Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/sections/Navbar";
import GlowCard from "../components/ui/GlowCard";
import SecondaryButton from "../components/ui/SecondaryButton";
import { useMyProjects } from "../hooks/api/useProjects";
import { useContractScans } from "../hooks/api/useContractScans";
import { useApplicationScans } from "../hooks/api/useApplicationScans";
import { generateProjectPdf } from "../services/scanService";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "../hooks/api/useAuth";

// Access Denied component for non-investor users
function InvestorAccessDenied() {
  const navigate = useNavigate();

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
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-linear-to-br from-[#1a1145] to-[#0d0a2a] border border-[#3B2A5E] rounded-3xl p-8 shadow-[0_0_60px_0_#A855F730]">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center">
              <Lock size={36} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white urbanist mb-3">
              Investor Feature
            </h1>

            <p className="text-white/70 inter text-sm mb-6 leading-relaxed">
              The <span className="text-[#8B5CF6] font-medium">Compare Projects</span> feature is exclusively available to Investor accounts.
              Upgrade your account to unlock powerful comparison tools and make informed investment decisions.
            </p>

            <div className="space-y-3">
              <div className="w-full">
                <SecondaryButton
                  onClick={() => navigate("/pricing")}
                  icon={<Crown size={16} />}
                  iconPosition="left"
                >
                  View Pricing Plans
                </SecondaryButton>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="w-full py-2.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                Go Back
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-white/50 inter">
                Investor benefits include:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {["Project Comparison", "Portfolio Analytics", "Risk Heatmaps", "Priority Support"].map((benefit) => (
                  <span key={benefit} className="px-3 py-1 text-[10px] bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full border border-[#8B5CF6]/30">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: unknown }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // Error caught
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#00011d] text-white p-10">
          <div className="max-w-2xl w-full bg-white/5 border border-red-500/30 rounded-xl p-8">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <pre className="text-sm font-mono text-white/70 bg-black/50 p-4 rounded-lg overflow-auto max-h-[400px]">
              {typeof this.state.error === 'object' && this.state.error !== null ? (this.state.error as Error).toString() : String(this.state.error)}
              {typeof this.state.error === 'object' && this.state.error !== null ? (this.state.error as Error).stack : ''}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Pill({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 px-8 py-1 rounded-full text-sm text-white/90 bg-transparent border border-[#FD7EFF]">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="rounded-full p-0.5 hover:bg-white/10" aria-label="Remove">
          <X size={14} />
        </button>
      )}
    </span>
  );
}

function CheckCell({ value }: { value: number }) {
  const displayValue = isNaN(value) ? 0 : value;
  return (
    <div className="flex items-center gap-3">
      <img src="/tick.svg" alt="" />
      <div className="flex flex-col leading-tight">
        <span className="text-emerald-400 text-xl font-semibold">{displayValue}</span>
        <span className="text-white/60 text-xs">good</span>
      </div>
    </div>
  );
}

function Trend({ n }: { n: number }) {
  const val = isNaN(n) ? 0 : n;
  const up = val >= 0;
  return (
    <span className={`ml-2 text-sm inter flex justify-center items-center gap-2 ${up ? "text-[#4ADE80]" : "text-[#F87171]"}`}>
      <img src={up ? "/profit.svg" : "/loss.svg"} alt="" /> {up ? "+" : ""}
      {val}
    </span>
  );
}


function TierRing({ score, tier }: { score: number; tier: string }) {
  const safeScore = isNaN(score) ? 0 : score;
  const ring = tier === "Platinum" ? "#E777FF" : tier === "Gold" ? "#F6A94E" : "#8AA4FF";
  const radius = 48;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, safeScore / 100));
  const dash = progress * circumference;

  return (
    <div className="relative flex items-center justify-center h-32 w-32">
      <svg className="-rotate-90" width="128" height="128">
        <circle cx="64" cy="64" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle cx="64" cy="64" r={radius} stroke={ring} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${circumference - dash
          }`} fill="none" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <div className="text-3xl font-bold text-white">{safeScore}</div>
        <div className="text-xs text-white/70">{tier}</div>
      </div>
    </div>
  );
}

const tierFromScore = (score: number) => {
  if (score >= 90) return "Platinum";
  if (score >= 80) return "Gold";
  if (score >= 70) return "Silver";
  return "Bronze";
};

function CompareProjectsContent() {
  const { data: projects } = useMyProjects();
  const { data: contractScans } = useContractScans();
  const { data: appScans } = useApplicationScans();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  /* Removed auto-selection of projects */
  /* useEffect(() => {
    if (projects && projects.length && selectedIds.length === 0) {
     ...
  }, [projects, selectedIds.length]); */

  const allEnriched = useMemo(() => {
    if (!projects) return [];

    const validProjects = projects.filter((p) => !!(p.id || p._id));
    const scans = [...(contractScans || []), ...(appScans || [])];
    const latestByProject = new Map<string, typeof scans[number]>();
    const previousByProject = new Map<string, typeof scans[number]>();

    validProjects.forEach((p) => {
      const pId = (p.id || p._id) as string;
      const history = scans
        .filter((s) => {
          const scanProjectId = typeof s.project === 'object' ? (s.project as Record<string, unknown>)._id as string : s.project;
          return scanProjectId === pId;
        })
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });
      if (history.length) latestByProject.set(pId, history[0]);
      if (history.length > 1) previousByProject.set(pId, history[1]);
    });

    return validProjects.map((p) => {
      const pId = (p.id || p._id) as string;
      let latest = latestByProject.get(pId);
      const previous = previousByProject.get(pId);

      // Fallback to embedded latest scan if not found in list
      if (!latest) {
        if (String(p.type || "").toLowerCase().includes("app")) {
          latest = p.latestApplicationScan as typeof scans[number] | undefined;
        } else {
          latest = p.latestContractScan as typeof scans[number] | undefined;
        }
      }

      // Safely extract scores with fallback to project.currentScores
      let latestScores = latest?.scores as unknown;

      if (!latestScores && p.scoringDetails) {
        const typeStr = String(p.type || "").toLowerCase();
        if (typeStr.includes("app")) {
          latestScores = p.scoringDetails?.applicationTrack;
        } else {
          latestScores = p.scoringDetails?.contractTrack;
        }
        if (!latestScores) latestScores = { overall: p.scoringDetails?.overall };
      }

      if (!latestScores && p.currentScores) {
        const typeStr = String(p.type || "").toLowerCase();
        if (typeStr.includes("app")) {
          latestScores = p.currentScores.application;
        } else if (typeStr.includes("contract")) {
          latestScores = p.currentScores.contract;
        }

        // If still nothing, try overall
        if (!latestScores) latestScores = p.currentScores.overall;
      }

      const previousScores = previous?.scores as unknown;

      // Robust Score Extraction
      const score = Number((latestScores as Record<string, unknown>)?.overall) ||
        Number(p.score) ||
        Number(p.scoringDetails?.overall) ||
        Number((p.currentScores?.overall as Record<string, unknown>)?.score) ||
        Number(p.currentScores?.overall) ||
        0;

      const tier = tierFromScore(score);
      const trend = latest && previous ? (Number((latestScores as Record<string, unknown>)?.overall) || 0) - (Number((previousScores as Record<string, unknown>)?.overall) || 0) : 0;

      // Robust Metrics Extraction
      const getMetric = (keys: string[]) => {
        for (const key of keys) {
          if (latestScores && (latestScores as Record<string, unknown>)[key] !== undefined) return Number((latestScores as Record<string, unknown>)[key]);
          if (p.scoringDetails?.contractTrack && (p.scoringDetails.contractTrack as Record<string, unknown>)[key] !== undefined) return Number((p.scoringDetails.contractTrack as Record<string, unknown>)[key]);
          if (p.scoringDetails?.applicationTrack && (p.scoringDetails.applicationTrack as Record<string, unknown>)[key] !== undefined) return Number((p.scoringDetails.applicationTrack as Record<string, unknown>)[key]);
          if (p[key] !== undefined) return Number(p[key]);
        }
        return 0;
      };

      const metrics = {
        ownership: getMetric(['ownership']),
        fund: getMetric(['cpiFunds', 'auth', 'funds']),
        vulns: getMetric(['vulnerabilities', 'secrets', 'vulns']),
        compliance: getMetric(['hygiene', 'dataStorage', 'compliance']),
        performance: getMetric(['deployHistory', 'apiSurface', 'performance']),
      };

      let lastScanDate = "No scans yet";
      if (latest?.createdAt) {
        try {
          lastScanDate = new Date(latest.createdAt).toLocaleString();
        } catch {
          lastScanDate = "Invalid Date";
        }
      } else if (p.updatedAt && score > 0) {
        // If we have a score but no scan object, use project update time
        try {
          lastScanDate = new Date(p.updatedAt).toLocaleString();
        } catch {
          lastScanDate = "N/A";
        }
      }

      return {
        id: pId,
        name: p.name,
        score,
        tier,
        trend,
        metrics,
        lastScan: lastScanDate,
      };
    });
  }, [projects, contractScans, appScans]);

  const [selected, setSelected] = useState<typeof allEnriched>([]);
  useMemo(() => {
    setSelected(selectedIds.map((id) => allEnriched.find((p) => p.id === id)).filter(Boolean) as typeof allEnriched);
  }, [selectedIds, allEnriched]);

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const suggestions = useMemo(() => {
    let list = allEnriched.filter((p) => !selectedIds.includes(p.id));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    return list.slice(0, 10);
  }, [query, allEnriched, selectedIds]);

  const addProject = (id: string) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 3) return;
    setSelectedIds((prev) => [...prev, id]);
    setQuery("");
    setIsOpen(false);
  };

  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  const downloadProjectPdf = async (id: string, name: string) => {
    try {
      setGeneratingPdfId(id);
      const blob = await generateProjectPdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Security_Report_${name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report.");
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const removeProject = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const SearchBox = (
    <div className="relative mt-3 w-full" ref={wrapperRef}>
      <div className="flex items-center h-12 bg-[#0B0730] border border-[#3B2A5E] shadow-[0_0_10px_0_#A855F720] rounded-full px-4 gap-2 focus-within:ring-1 focus-within:ring-[#A855F7]">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search projects or select from list..."
          className="w-full bg-transparent outline-none text-[#A19DAF] placeholder:text-[#A19DAF] text-[14px] font-plus-jakarta-sans jakarta"
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#A19DAF] hover:text-white transition-colors p-1"
        >
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl overflow-hidden border border-[#3B2A5E] bg-[#0B0730] shadow-[0_0_20px_0_#A855F740] max-h-60 overflow-y-auto custom-scrollbar">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => addProject(s.id)}
              className="w-full text-left px-4 py-3 hover:bg-[#1A113A] text-[#A19DAF] text-sm flex justify-between items-center transition-colors border-b border-[#3B2A5E]/30 last:border-none"
            >
              <div className="flex flex-col">
                <span className="text-white/90 font-medium">{s.name}</span>
                {s.lastScan !== "No scans yet" && <span className="text-xs text-white/50">{s.lastScan}</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && suggestions.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-[#3B2A5E] bg-[#0B0730] shadow-[0_0_20px_0_#A855F740] p-4 text-center text-[#A19DAF] text-sm">
          No projects found
        </div>
      )}
    </div>
  );

  return (
    <main
      style={{ background: "url(/auth-page.png)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
      className="w-full min-h-svh"
    >
      <Navbar isFixed={false} />

      <header className="max-w-7xl px-6 py-6 mx-auto flex justify-between gap-4 flex-wrap items-center">
        <div>
          <h1 className="urbanist mb-2 font-bold text-white text-2xl">Compare Projects</h1>
          <p className="urbanist font-medium text-white/80 text-sm">Side-by-side analysis for investment decisions</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-5">
        <GlowCard className="pb-5 pt-3 overflow-visible!">
          <div className="flex flex-col gap-3">
            <div className="text-left">
              <label className="text-white jakarta text-[16px] font-medium font-plus-jakarta-sans">
                Add Project ({selectedIds.length}/3)
              </label>
              {SearchBox}
            </div>
          </div>
        </GlowCard>

        <GlowCard className="mt-5 hidden md:block">
          <div className="px-6 pt-6 pb-8">
            {/* Header Row: Projects */}
            <div className="grid gap-x-10 items-center border-b border-white/10 pb-4 mb-4" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80 font-medium">Projects</div>
              {selected.map((p) => (
                <div key={`pill-${p.id}`} className="flex items-center gap-3">
                  <Pill label={p.name} onRemove={() => removeProject(p.id)} />
                  <button
                    onClick={() => downloadProjectPdf(p.id, p.name)}
                    disabled={generatingPdfId === p.id}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50"
                    title="Download individual project report"
                  >
                    {generatingPdfId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  </button>
                </div>
              ))}
            </div>

            {/* Row: Overall Score */}
            <div className="grid gap-x-10 items-center py-4 border-b border-white/5" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80">Overall Score</div>
              {selected.map((p) => (
                <div key={`score-${p.id}`}>
                  <TierRing score={p.score} tier={p.tier} />
                </div>
              ))}
            </div>

            {/* Row: Trend */}
            <div className="grid gap-x-10 items-center py-4 border-b border-white/5" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80">Trend</div>
              {selected.map((p) => (
                <div key={`trend-${p.id}`} className="flex justify-start">
                  <Trend n={Math.round(p.trend)} />
                </div>
              ))}
            </div>

            {/* Row: Ownership */}
            <div className="grid gap-x-10 items-center py-4 border-b border-white/5" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80">Ownership</div>
              {selected.map((p) => (
                <div key={`owner-${p.id}`}>
                  <CheckCell value={Math.round(p.metrics.ownership)} />
                </div>
              ))}
            </div>

            {/* Row: Fund Safety */}
            <div className="grid gap-x-10 items-center py-4 border-b border-white/5" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80">Fund Safety</div>
              {selected.map((p) => (
                <div key={`fund-${p.id}`}>
                  <CheckCell value={Math.round(p.metrics.fund)} />
                </div>
              ))}
            </div>

            {/* Row: Vulnerabilities */}
            <div className="grid gap-x-10 items-center py-4 border-b border-white/5" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80">Vulnerabilities</div>
              {selected.map((p) => (
                <div key={`vuln-${p.id}`}>
                  <CheckCell value={Math.round(p.metrics.vulns)} />
                </div>
              ))}
            </div>

            {/* Row: Compliance */}
            <div className="grid gap-x-10 items-center py-4 border-b border-white/5" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80">Compliance</div>
              {selected.map((p) => (
                <div key={`comp-${p.id}`}>
                  <CheckCell value={Math.round(p.metrics.compliance)} />
                </div>
              ))}
            </div>

            {/* Row: Performance */}
            <div className="grid gap-x-10 items-center py-4 border-b border-white/5" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80">Performance</div>
              {selected.map((p) => (
                <div key={`perf-${p.id}`}>
                  <CheckCell value={Math.round(p.metrics.performance)} />
                </div>
              ))}
            </div>

            {/* Row: Last Scan */}
            <div className="grid gap-x-10 items-center py-4" style={{ gridTemplateColumns: `220px repeat(${selected.length}, minmax(260px,1fr))` }}>
              <div className="text-white/80">Last Scan</div>
              {selected.map((p) => (
                <div key={`scan-${p.id}`} className="text-white/70 text-sm">
                  {p.lastScan}
                </div>
              ))}
            </div>

          </div>
        </GlowCard>

        <GlowCard className="mt-5 md:hidden">
          <div className="space-y-4">
            {selected.map((p) => (
              <div key={`mobile-${p.id}`} className="border-b border-white/10 pb-4 last:border-none">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Pill label={p.name} onRemove={() => removeProject(p.id)} />
                    <button
                      onClick={() => downloadProjectPdf(p.id, p.name)}
                      disabled={generatingPdfId === p.id}
                      className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50"
                    >
                      {generatingPdfId === p.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <TierRing score={p.score} tier={p.tier} />
                  <Trend n={Math.round(p.trend)} />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-white/80">
                  <div>Ownership</div>
                  <div className="text-right">{Math.round(p.metrics.ownership)}</div>
                  <div>Fund Safety</div>
                  <div className="text-right">{Math.round(p.metrics.fund)}</div>
                  <div>Vulnerabilities</div>
                  <div className="text-right">{Math.round(p.metrics.vulns)}</div>
                  <div>Compliance</div>
                  <div className="text-right">{Math.round(p.metrics.compliance)}</div>
                  <div>Performance</div>
                  <div className="text-right">{Math.round(p.metrics.performance)}</div>
                  <div>Last Scan</div>
                  <div className="text-right">{p.lastScan}</div>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </section>
    </main>
  );
}

export default function CompareProjects() {
  const { data: user, isLoading } = useCurrentUser();

  // Show loading state while checking user
  if (isLoading) {
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={48} className="animate-spin text-[#8B5CF6]" />
        </div>
      </main>
    );
  }

  // Check if user is an investor - allow access for 'investor' role
  // Also allow access if user is not logged in (will be redirected by protected route)
  const isInvestor = user?.role === "investor";

  if (user && !isInvestor) {
    return <InvestorAccessDenied />;
  }

  return (
    <ErrorBoundary>
      <CompareProjectsContent />
    </ErrorBoundary>
  );
}
