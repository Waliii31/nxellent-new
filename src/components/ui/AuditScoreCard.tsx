import { ArrowRight, Shield, AlertCircle, CheckCircle2, Clock, Scan, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { LatestScanEmbedDto, ScoringDetailsDto } from "../../types/project";


type AuditScoreCardProps = {
  protocolName?: string;
  visibility?: "private" | "public";
  projectId?: string;
  latestContractScan?: LatestScanEmbedDto | null;
  latestApplicationScan?: LatestScanEmbedDto | null;
  scoringDetails?: ScoringDetailsDto;
  isLoading?: boolean;
  
  // Accept flat metrics explicitly from list API endpoints
  totalIssues?: number;
  criticalIssues?: number;
  highIssues?: number;
  mediumIssues?: number;
  lowIssues?: number;
  status?: string;
  projectCreatedAt?: string;
};

const AuditScoreCard: React.FC<AuditScoreCardProps> = ({
  protocolName = "Unnamed Project",
  visibility = "private",
  projectId,
  latestContractScan,
  latestApplicationScan,
  scoringDetails,
  isLoading = false,
  totalIssues: flatTotalIssues,
  criticalIssues: flatCriticalIssues,
  highIssues: flatHighIssues,
  mediumIssues: flatMediumIssues,
  lowIssues: flatLowIssues,
  status: projectStatus,
  projectCreatedAt,
}) => {
  const navigate = useNavigate();

  // Determine which scan to display (prefer contract, fallback to application)
  // const primaryScan = latestContractScan || latestApplicationScan; // MOVED DOWN
  const scanType = (latestContractScan && latestApplicationScan) ? "Full-Stack" : latestContractScan ? "Contract" : latestApplicationScan ? "Application" : "No Scan";


  // Use props directly instead of polling
  const currentContractScan = latestContractScan;
  const currentAppScan = latestApplicationScan;

  const primaryScan = currentContractScan || currentAppScan;
  
  // Handle various potential structures for the status from the backend
  const rawStatus = projectStatus || primaryScan?.scanStatus?.status || (primaryScan as any)?.status || (primaryScan as any)?.state || "";
  const normalizedStatus = typeof rawStatus === "string" ? rawStatus.toLowerCase() : "";

  // Note: we check 'pending' or 'running' on the *current* (potentially updated) scan
  const isRecent = (Date.now() - new Date(projectCreatedAt || 0).getTime()) < 5 * 60 * 1000;
  const hasNoScansAtAll = !primaryScan && !scoringDetails;
  
  const isScanPending = ["pending", "running", "processing", "in_progress", "scanning", "started", "queued", "evaluating"].includes(normalizedStatus) || (isRecent && hasNoScansAtAll);
  const isScanFailed = ["failed", "error", "cancelled", "timeout"].includes(normalizedStatus);

  const hasRealData = !!(primaryScan || scoringDetails || flatTotalIssues || flatCriticalIssues);
  const hasCompletedScan = hasRealData && !isScanPending && !isScanFailed;

  // Helper to get issue counts from scoringDetails if available
  const getScoringDetailsCounts = () => {
    if (!scoringDetails) return null;
    
    // Check if the backend gave us flat counts
    const contractCounts = scoringDetails.contractTrack?.findingsCount;
    const appCounts = scoringDetails.applicationTrack?.findingsCount;
    
    let critical = (contractCounts?.critical || 0) + (appCounts?.critical || 0);
    let high     = (contractCounts?.high || 0) + (appCounts?.high || 0);
    let medium   = (contractCounts?.medium || 0) + (appCounts?.medium || 0);
    let low      = (contractCounts?.low || 0) + (appCounts?.low || 0);
    let total    = (contractCounts?.total || 0) + (appCounts?.total || 0);

    // If counts are completely 0 but we have categories, we should aggregate manually
    if (total === 0) {
      const tallyCategories = (categories: Record<string, any> | undefined) => {
        if (!categories) return;
        Object.values(categories).forEach((cat: any) => {
          const findings = cat?.findings || [];
          findings.forEach((f: any) => {
            const sev = (f.severity || "low").toLowerCase();
            if (sev === "critical") critical++;
            else if (sev === "high") high++;
            else if (sev === "medium") medium++;
            else low++;
            total++;
          });
        });
      };
      
      tallyCategories(scoringDetails.contractTrack?.categories);
      tallyCategories(scoringDetails.applicationTrack?.categories);
    }

    return { critical, high, medium, low, total };
  };

  const scoringCounts = getScoringDetailsCounts();

  const overallScore = hasCompletedScan
    ? (Number(scoringDetails?.overall) || 
       Number(primaryScan?.scores?.overall) || 
       Number((primaryScan as any)?.overallScore) ||
       Number((primaryScan as any)?.overall_score) ||
       Number((primaryScan as any)?.score) ||
       0)
    : 0;

  // We rely on either the flat API props, primary scan blocks, or our manual aggregation
  // Using || instead of ?? to ensure we fall through if the preferred value is 0 or missing
  const criticalIssues = hasCompletedScan
    ? (flatCriticalIssues || 
       primaryScan?.issueCounts?.critical || 
       (primaryScan as any)?.critical_issues ||
       (primaryScan as any)?.criticalCount ||
       scoringCounts?.critical || 0)
    : isScanPending ? "..." : 0;

  const highIssues = hasCompletedScan
    ? (flatHighIssues || 
       primaryScan?.issueCounts?.high || 
       (primaryScan as any)?.high_issues ||
       scoringCounts?.high || 0)
    : isScanPending ? "..." : 0;

  const mediumIssues = hasCompletedScan
    ? (flatMediumIssues || 
       primaryScan?.issueCounts?.medium || 
       (primaryScan as any)?.medium_issues ||
       scoringCounts?.medium || 0)
    : isScanPending ? "..." : 0;

  const lowIssues = hasCompletedScan
    ? (flatLowIssues || 
       primaryScan?.issueCounts?.low || 
       (primaryScan as any)?.low_issues ||
       scoringCounts?.low || 0)
    : isScanPending ? "..." : 0;

  const totalIssues = hasCompletedScan
    ? (flatTotalIssues || 
       primaryScan?.issueCounts?.total || 
       (primaryScan as any)?.total_issues ||
       (primaryScan as any)?.vulnerabilityCount ||
       (primaryScan as any)?.vulnerability_count ||
       scoringCounts?.total || 0)
    : isScanPending ? "..." : 0;

  const coverage = hasCompletedScan
    ? (Number(scoringDetails?.coverage) || 
       Number(primaryScan?.coverage) || 
       Number((primaryScan as any)?.coverage_percent) ||
       0)
    : 0;

  // Calculate time ago
  const timeAgo = useMemo(() => {
    if (!primaryScan?.createdAt) return "Never scanned";
    const delta = Date.now() - new Date(primaryScan.createdAt).getTime();
    const minutes = Math.floor(delta / (1000 * 60));
    const hours = Math.floor(delta / (1000 * 60 * 60));
    const days = Math.floor(delta / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }, [primaryScan?.createdAt]);

  const scoreTier = useMemo(() => {
    if (overallScore >= 90)
      return {
        name: "Platinum",
        color: "from-[#E0E7FF] to-[#C7D2FE]",
        badge: "/platinium-badge.png",
        textColor: "#1A1B3A"
      };
    if (overallScore >= 75)
      return {
        name: "Gold",
        color: "from-[#FDE68A] to-[#FCD34D]",
        badge: "/gold-badge.png",
        textColor: "#422800"
      };
    if (overallScore >= 60)
      return {
        name: "Silver",
        color: "from-[#E5E7EB] to-[#D1D5DB]",
        badge: "/silver-badge.png",
        textColor: "#2D2D2D"
      };
    return {
      name: "Bronze",
      color: "from-[#FDBA74] to-[#FB923C]",
      badge: "/silver-badge.png", // Fallback for Bronze
      textColor: "#431407"
    };
  }, [overallScore]);

  const handleViewDetails = () => {
    if (!projectId) return;
    navigate(`/projects/${projectId}`);
  };

  const handleRescan = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/scanner");
  };

  // If scan is failed, show rescan UI
  if (isScanFailed) {
    return (
      <div
        className="w-full rounded-2xl border border-red-500/30 relative overflow-hidden p-6 bg-[#000124] transition-all duration-300 group flex flex-col justify-center text-center"
        style={{
          boxShadow: "rgba(239, 68, 68, 0.1) 0px 0px 40px 0px",
        }}
      >
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="anybody text-xl font-bold text-white mb-2">{protocolName}</h3>
          <p className="text-red-400 text-sm font-semibold mb-1">Scan Partially Failed or Cancelled</p>
          <p className="text-white/60 text-xs mb-6 max-w-60 mx-auto">
            The security analysis could not be completed for this project.
          </p>
          <button
            onClick={handleRescan}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-100 text-sm font-bold hover:bg-red-500/30 transition-all uppercase tracking-wider"
          >
            <Scan className="w-4 h-4" />
            <span>Rescan Project</span>
          </button>
        </div>
      </div>
    );
  }

  // If scan is pending or running, show "Scan in Progress" state
  if (isScanPending) {
    return (
      <div
        className="w-full rounded-2xl border border-[#2A2355] relative overflow-hidden p-6 bg-[#000124] hover:shadow-[0_0_50px_0_#A855F755] transition-all duration-300 cursor-pointer group flex flex-col justify-center"
        style={{
          borderTop: "1px solid rgba(168, 85, 247, 0.2)",
          boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
        }}
        onClick={handleViewDetails}
      >
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 rounded-full bg-[#FD7EFF]/10 border border-[#FD7EFF]/40 flex items-center justify-center mb-4 relative">
             <div className="absolute inset-0 rounded-full border-t-2 border-[#FD7EFF] animate-spin"></div>
             <Clock className="w-8 h-8 text-[#FFC2C8]" />
          </div>
          <h3 className="anybody text-xl font-bold text-white mb-2 truncate max-w-full px-4">{protocolName}</h3>
          <p className="urbanist text-[#FD7EFF] text-sm font-bold mb-1">Processing Scan...</p>
          <p className="inter text-white/60 text-[10px] sm:text-xs mb-4 text-center max-w-[220px]">
            Analyzing your repository for vulnerabilities. Results will update automatically.
          </p>
          <div className="flex items-center gap-2 text-[#FD7EFF] text-[10px] font-semibold animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Analyzing vulnerabilities</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="w-full rounded-2xl border border-[#2A2355] relative overflow-hidden p-6 bg-[#000124] flex flex-col"
        style={{
          borderTop: "1px solid rgba(168, 85, 247, 0.2)",
          boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
        }}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse mb-2" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-white/5 rounded-md animate-pulse" />
                <div className="h-4 w-16 bg-white/5 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-8 border-white/5 animate-pulse shrink-0" />
          <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          <div className="h-4 w-32 bg-white/5 rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-white/5 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  // Show completed scan results
  return (
    <div
      className="w-full rounded-2xl border border-[#2A2355] relative overflow-hidden p-6 bg-[#000124] hover:shadow-[0_0_50px_0_#A855F755] transition-all duration-300 cursor-pointer group flex flex-col"
      style={{
        borderTop: "1px solid rgba(168, 85, 247, 0.2)",
        boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
        background:
          "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
      }}
      onClick={handleViewDetails}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3 w-full">
          {/* Shield Icon */}
          <div className="w-12 h-12 shrink-0 rounded-xl bg-linear-to-br from-[#FD7EFF]/20 to-[#A855F7]/20 flex items-center justify-center border border-[#FD7EFF]/30">
            <Shield className="w-6 h-6 text-[#FFC2C8]" />
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <h3 className="anybody text-lg font-bold text-white truncate mb-1">
              {protocolName}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-[#FD7EFF]/10 border border-[#FD7EFF]/30 text-[#FFC2C8] text-xs font-medium">
                {scanType}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60 text-xs">
                {visibility}
              </span>
              {/* Time Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ml-auto sm:ml-0">
                <Clock className="w-3.5 h-3.5 text-white/60" />
                <span className="text-xs text-white/70">{timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Section */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Score Badge */}
        <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <img 
            src={scoreTier.badge} 
            alt={scoreTier.name} 
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div className="relative z-10 flex flex-col items-center justify-center text-center mt-1 sm:mt-2">
            <span 
              className="urbanist text-3xl sm:text-4xl font-bold leading-none text-white drop-shadow-sm"
            >
              {overallScore}
            </span>
            <span 
              className="font-medium text-[12px] sm:text-sm text-white/90 drop-shadow-sm mt-1 capitalize"
            >
              {scoreTier.name.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
          {/* Critical Issues */}
          <div className="p-2 sm:p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[10px] sm:text-xs text-red-300 font-medium">Critical</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-red-400">{criticalIssues}</p>
          </div>

          {/* Total Issues */}
          <div className="p-2 sm:p-3 rounded-xl bg-[#FD7EFF]/10 border border-[#FD7EFF]/30 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#FFC2C8]" />
              <span className="text-[10px] sm:text-xs text-[#FFC2C8] font-medium">Total</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalIssues}</p>
          </div>

          {/* Coverage */}
          <div className="p-2 sm:p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] sm:text-xs text-blue-300 font-medium">Coverage</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-400">{Math.round(coverage)}%</p>
          </div>

          {/* High Issues */}
          <div className="p-2 sm:p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[10px] sm:text-xs text-orange-300 font-medium">High</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-400">{highIssues}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-4 text-xs sm:text-sm text-white/60">
          <span>Medium: <span className="text-white font-medium">{mediumIssues}</span></span>
          <span>Low: <span className="text-white font-medium">{lowIssues}</span></span>
        </div>

        <button
          type="button"
          onClick={handleViewDetails}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#FFC2C8]/10 border border-[#FFC2C8]/30 text-[#FFC2C8] text-xs sm:text-sm font-semibold hover:bg-[#FFC2C8]/20 transition-all group-hover:gap-3"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default AuditScoreCard;
