import { ArrowRight, Shield, AlertCircle, CheckCircle2, Clock, Scan } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLatestContractScanForProject } from "../../hooks/api/useContractScans";
import { useLatestApplicationScanForProject } from "../../hooks/api/useApplicationScans";

type AuditScoreCardProps = {
  protocolName?: string;
  visibility?: "private" | "public";
  projectId?: string;
  latestContractScan?: any | null;
  latestApplicationScan?: any | null;
  scoringDetails?: any;
  isLoading?: boolean;
};

const AuditScoreCard: React.FC<AuditScoreCardProps> = ({
  protocolName = "Unnamed Project",
  visibility = "private",
  projectId,
  latestContractScan,
  latestApplicationScan,
  scoringDetails,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Determine which scan to display (prefer contract, fallback to application)
  // const primaryScan = latestContractScan || latestApplicationScan; // MOVED DOWN
  const scanType = latestContractScan ? "Contract" : latestApplicationScan ? "Application" : "No Scan";


  // Conditionally poll if we have a project ID
  const { data: polledContractScan } = useLatestContractScanForProject(projectId);
  const { data: polledAppScan } = useLatestApplicationScanForProject(projectId);

  // Merge polled data if available, effectively allowing "auto-update"
  const currentContractScan = polledContractScan !== undefined ? polledContractScan : latestContractScan;
  const currentAppScan = polledAppScan !== undefined ? polledAppScan : latestApplicationScan;

  // Re-determine primary scan with potential new data
  const primaryScan = currentContractScan || currentAppScan;
  const scanStatus = primaryScan?.scanStatus?.status;

  // Note: we check 'pending' or 'running' on the *current* (potentially updated) scan
  const isScanPending = scanStatus === "pending" || scanStatus === "running";
  const isScanFailed = scanStatus === "failed";

  const hasRealData = !!(currentContractScan || currentAppScan || scoringDetails);
  const hasCompletedScan = hasRealData && !isScanPending && !isScanFailed;

  // Helper to get issue counts from scoringDetails if available
  const getScoringDetailsCounts = () => {
    if (!scoringDetails) return null;
    const contractCounts = scoringDetails.contractTrack?.findingsCount;
    const appCounts = scoringDetails.applicationTrack?.findingsCount;
    return contractCounts || appCounts || null;
  };

  const scoringCounts = getScoringDetailsCounts();

  const overallScore = hasCompletedScan
    ? (Number(primaryScan?.scores?.overall) || Number(scoringDetails?.overall) || 0)
    : 0;

  const criticalIssues = hasCompletedScan
    ? (primaryScan?.issueCounts?.critical ?? scoringCounts?.critical ?? 0)
    : isScanPending ? "..." : 0;

  const highIssues = hasCompletedScan
    ? (primaryScan?.issueCounts?.high ?? scoringCounts?.high ?? 0)
    : isScanPending ? "..." : 0;

  const mediumIssues = hasCompletedScan
    ? (primaryScan?.issueCounts?.medium ?? scoringCounts?.medium ?? 0)
    : isScanPending ? "..." : 0;

  const lowIssues = hasCompletedScan
    ? (primaryScan?.issueCounts?.low ?? scoringCounts?.low ?? 0)
    : isScanPending ? "..." : 0;

  const totalIssues = hasCompletedScan
    ? (primaryScan?.issueCounts?.total ?? scoringCounts?.total ?? 0)
    : isScanPending ? "..." : 0;

  const coverage = hasCompletedScan
    ? (Number(primaryScan?.coverage) || Number(scoringDetails?.coverage) || 0)
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
    if (overallScore >= 90) return { name: "Platinum", color: "from-[#E0E7FF] to-[#C7D2FE]" };
    if (overallScore >= 75) return { name: "Gold", color: "from-[#FDE68A] to-[#FCD34D]" };
    if (overallScore >= 60) return { name: "Silver", color: "from-[#E5E7EB] to-[#D1D5DB]" };
    return { name: "Bronze", color: "from-[#FDBA74] to-[#FB923C]" };
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
          <p className="text-white/60 text-xs mb-6 max-w-[240px] mx-auto">
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
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-[#FD7EFF]/10 border-2 border-[#FD7EFF]/30 flex items-center justify-center mb-4 relative">
            <Scan className="w-10 h-10 text-[#FFC2C8] animate-pulse" />
            {/* Animated pulse ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#FD7EFF] animate-ping opacity-75" />
          </div>
          <h3 className="anybody text-xl font-bold text-white mb-2">{protocolName}</h3>
          <p className="text-[#FFC2C8] text-sm font-semibold mb-1">Scan in Progress...</p>
          <p className="text-white/60 text-xs mb-4">
            {scanStatus === "pending" ? "Scan queued and waiting to start" : "Analyzing your code for security issues"}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Clock className="w-3.5 h-3.5" />
            <span>Started {timeAgo}</span>
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
        {/* Score Circle */}
        <div className="relative shrink-0">
          <svg className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(overallScore / 100) * 282} 282`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FD7EFF" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="anybody text-3xl font-bold text-white">
              {overallScore}
            </span>
            <span className={`text-xs font-semibold bg-linear-to-r ${scoreTier.color} bg-clip-text text-transparent`}>
              {scoreTier.name}
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
