import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Clock,
    Download,
    Shield,
    Search,
    Filter,
    CheckCircle2,
    Scan,
    Share2,
    Loader2,
    Link2,
} from "lucide-react";

import SecondaryButton from "../components/ui/SecondaryButton";
import Navbar from "../components/sections/Navbar";
import GlowCard from "../components/ui/GlowCard";
import SubtlePill from "../components/ui/SubtlePill";

import { useProject } from "../hooks/api/useProjects";
import { useLatestContractScanForProject } from "../hooks/api/useContractScans";
import { useLatestApplicationScanForProject } from "../hooks/api/useApplicationScans";
import { type ScanFindingDto } from "../types/scans";
import { generateProjectPdf } from "../services/scanService";

// -------------------------
// Sub-components
// -------------------------

const ScoreRing = ({ score, size = 120, strokeWidth = 8, className = "" }: { score: number; size?: number; strokeWidth?: number; className?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#383838"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="opacity-20"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#score-gradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
                <defs>
                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#BE0178" />
                        <stop offset="100%" stopColor="#E830E8" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

const ScoreBar = ({ label, score }: { label: string; score: number }) => {
    return (
        <div className="flex flex-col justify-center w-full items-center gap-2">
            <div className="flex w-full justify-between items-center text-xs sm:text-sm">
                <h1 className="text-white/80 inter">{label}</h1>
                <h1 className="font-semibold inter">{score}/100</h1>
            </div>
            <div className="w-full h-3 sm:h-4 rounded-full bg-[#383838]/20 border-gray-500/40 border">
                <div
                    className="h-full rounded-full bg-linear-to-r from-[#BE0178] to-[#E830E8]"
                    style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                />
            </div>
        </div>
    );
};

const ScoreGroup = ({
    title,
    score,
    items,
}: {
    title: string;
    score: number;
    items: { label: string; score: number }[];
}) => (
    <div className="flex-1 py-5 px-1 sm:px-2 w-full">
        <div className="flex justify-between mb-5 items-center gap-4">
            <h3 className="text-sm sm:text-base urbanist font-semibold">{title}</h3>
            <div className="relative flex justify-center items-center">
                <h1 className="absolute inter font-normal text-2xl sm:text-3xl text-center z-10">
                    {score}
                </h1>
                <ScoreRing score={score} size={80} strokeWidth={6} />
            </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-3">
            {items.map((item) => (
                <ScoreBar key={item.label} label={item.label} score={item.score} />
            ))}
        </div>
    </div>
);

const AttachScannerPlaceholder = ({
    type,
    projectId,
    projectName
}: {
    type: "contract" | "application";
    projectId: string;
    projectName: string;
}) => {
    const navigate = useNavigate();
    return (
        <div className="flex-1 py-5 px-5 w-full bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#FD7EFF]/10 flex items-center justify-center">
                <Shield className="text-[#FD7EFF]" size={32} />
            </div>
            <div>
                <h3 className="text-xl font-semibold urbanist mb-1 text-white">
                    Missing {type === "contract" ? "Contract" : "Application"} Scan
                </h3>
                <p className="text-sm text-white/50 max-w-[200px] mx-auto inter">
                    This project does not have {type === "contract" ? "smart contract" : "application"} security data found.
                </p>
            </div>
            <SecondaryButton
                onClick={() => navigate(`/scanner?attachToProjectId=${projectId}&attachToProjectName=${encodeURIComponent(projectName)}&scanType=${type}`)}
                icon={<Link2 size={16} />}
            >
                Attach {type === "contract" ? "Contract" : "App"} Scan
            </SecondaryButton>
        </div>
    );
};

const FindingRow = ({ finding }: { finding: ScanFindingDto }) => {
    const severityColor =
        finding.severity === "critical"
            ? "bg-red-600/20 text-red-400 border-red-500/40"
            : finding.severity === "high"
                ? "bg-orange-600/20 text-orange-400 border-orange-500/40"
                : finding.severity === "medium"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/40";

    return (
        <div className="p-4 rounded-2xl bg-[#000124] border border-white/5 hover:border-[#FD7EFF] transition-colors duration-200">
            <div className="flex items-center gap-2 mb-2">
                <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${severityColor} uppercase font-bold inter`}
                >
                    {finding.severity}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60 inter">
                    {finding.category}
                </span>
                {finding.pointsDeducted > 0 && (
                    <span className="text-[10px] text-red-400 ml-auto inter">
                        -{finding.pointsDeducted} pts
                    </span>
                )}
            </div>
            <h4 className="text-sm font-semibold text-white mb-1 inter">
                {finding.title}
            </h4>
            <p className="text-xs text-white/60 mb-3 inter">
                {finding.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-white/40 inter">
                <span
                    className={`px-2 py-0.5 rounded-full text-[10px] border ${finding.status === "open"
                        ? "border-red-500/40 text-red-400"
                        : "border-green-500/40 text-green-400"
                        }`}
                >
                    {finding.status}
                </span>
            </div>
        </div>
    );
};

// -------------------------
// Main Component
// -------------------------

const ProjectDetails: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { data: project, isLoading: isLoadingProject, isError } = useProject(projectId!);

    // DEBUG LOGS
    // React.useEffect(() => {
    //     if (project) {
    //         "DEBUG: Raw Project Data from useProject:", project);
    //         console.log("DEBUG: project.score:", (project as any).score);
    //         console.log("DEBUG: project.scoringDetails:", project.scoringDetails);
    //         console.log("DEBUG: project.currentScores:", (project as any).currentScores);
    //     }
    // }, [project]);

    // Fetch latest scans specifically to ensure we have full details
    const { data: latestContractScanData } = useLatestContractScanForProject(projectId);
    const { data: latestApplicationScanData } = useLatestApplicationScanForProject(projectId);

    // React.useEffect(() => {
    //     if (latestContractScanData) console.log("DEBUG: Latest Contract Scan Data:", latestContractScanData);
    //     if (latestApplicationScanData) console.log("DEBUG: Latest Application Scan Data:", latestApplicationScanData);
    // }, [latestContractScanData, latestApplicationScanData]);



    const isLoading = isLoadingProject;

    const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [severityFilter, setSeverityFilter] = React.useState<"all" | "critical" | "high" | "medium" | "low">("all");

    const shareReport = () => {
        // Navigate to the public shared card page
        navigate(`/project/${projectId}/card`);
    };

    const exportPdf = async () => {
        if (!projectId || !project) return;
        try {
            setIsGeneratingPdf(true);
            const blob = await generateProjectPdf(projectId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Security_Report_${project?.name || 'Project'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF report. Please try again later.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#00011d] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FD7EFF]" />
            </main>
        );
    }

    if (isError || !project) {
        return (
            <main className="min-h-screen bg-[#00011d] text-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold urbanist">Project not found</h1>
                <SecondaryButton onClick={() => navigate("/projects/my-projects")}>
                    Back to Projects
                </SecondaryButton>
            </main>
        );
    }

    // Determine which scan to show - prioritize specific scan hooks over project embedded data
    let latestScan = latestContractScanData || latestApplicationScanData || project.latestContractScan || project.latestApplicationScan;

    // Fallback: If no nested scan object, check if the project itself has scan data (flat structure)
    if (!latestScan && ((project as any).findings || (project as any).issueCounts || (project as any).contractScore || (project as any).applicationScore || (project as any).score)) {
        const p = project as any;
        latestScan = {
            createdAt: p.lastUpdated || p.updatedAt,
            findings: p.findings || [],
            issueCounts: p.issueCounts || {
                total: p.totalIssues || 0,
                critical: p.criticalIssues || 0,
                high: p.highIssues || 0,
                medium: p.mediumIssues || 0,
                low: p.lowIssues || 0
            },
            scores: p.scores || {
                overall: p.score || 0,
                contract: { overall: p.contractScore || 0 },
                application: { overall: p.applicationScore || 0 }
            },
            coverage: p.coverage || 0
        };
    }

    const hasScan = !!latestScan || !!project.scoringDetails?.overall || project.scoringDetails?.latestContractScanId || project.scoringDetails?.latestApplicationScanId;
    const isContract = !!project.latestContractScan || !!(project as any).contractScore || !!project.scoringDetails?.contractTrack;

    // Derived Data
    const lastScanDate = latestScan?.createdAt
        ? new Date(latestScan.createdAt).toLocaleString()
        : "Never";

    // overallScore and rankLabel moved below appScores calculation

    // Use scoringDetails as the source of truth (calculated by scoring engine) - per backend reference
    const scoringDetails = project.scoringDetails;
    const contractTrack = scoringDetails?.contractTrack;
    const applicationTrack = scoringDetails?.applicationTrack;

    // Contract Scores - use subscore and categories from scoringDetails
    const hasContractData = !!contractTrack;
    const contractScoreValue = contractTrack?.subscore ?? 0;

    // Extract contract category scores from scoringDetails.contractTrack.categories
    const contractCategories = contractTrack?.categories || {};
    const contractItems = hasContractData
        ? [
            { label: "Ownership", score: contractCategories.ownership?.score ?? 0 },
            { label: "CPI/Funds", score: contractCategories.cpiFunds?.score ?? 0 },
            { label: "Vulnerabilities", score: contractCategories.vulnerabilities?.score ?? 0 },
            { label: "Hygiene", score: contractCategories.hygiene?.score ?? 0 },
            { label: "Deploy History", score: contractCategories.deployHistory?.score ?? 0 },
            { label: "SPL Token", score: contractCategories.splToken?.score ?? 0 },
        ]
        : [];


    // Findings Aggregation - extract from scoringDetails.categories per backend reference
    const findings: ScanFindingDto[] = [];

    // Extract findings from contractTrack.categories
    if (contractCategories) {
        Object.entries(contractCategories).forEach(([category, data]) => {
            const categoryData = data as any;
            categoryData.findings?.forEach((finding: any) => {
                findings.push({
                    id: finding.id,
                    title: finding.title,
                    description: `Impact: ${Math.abs(finding.impact)} points`,
                    severity: (finding.severity?.toLowerCase() || 'low') as any,
                    category: category,
                    status: 'open',
                    pointsDeducted: Math.abs(finding.impact || 0),
                    evidence: '',
                    recommendation: ''
                });
            });
        });
    }

    // Extract findings from applicationTrack.categories
    const applicationCategories = applicationTrack?.categories || {};
    if (applicationCategories) {
        Object.entries(applicationCategories).forEach(([category, data]) => {
            const categoryData = data as any;
            categoryData.findings?.forEach((finding: any) => {
                findings.push({
                    id: finding.id,
                    title: finding.title,
                    description: `Impact: ${Math.abs(finding.impact)} points`,
                    severity: (finding.severity?.toLowerCase() || 'low') as any,
                    category: category,
                    status: 'open',
                    pointsDeducted: Math.abs(finding.impact || 0),
                    evidence: '',
                    recommendation: ''
                });
            });
        });
    }

    // Sort findings by severity
    const severityOrder = ['critical', 'high', 'medium', 'low'];
    findings.sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));

    // Filter findings based on search term and severity filter
    const filteredFindings = findings.filter((finding) => {
        const matchesSearch =
            searchTerm === "" ||
            finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            finding.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            finding.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity =
            severityFilter === "all" || finding.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    // Calculate issue counts from findings
    const issueCounts = findings.reduce((acc, f) => {
        const severity = f.severity.toLowerCase();
        if (['critical', 'high', 'medium', 'low'].includes(severity)) {
            acc[severity as keyof typeof acc]++;
            acc.total++;
        }
        return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0, total: 0 });

    // App Scores - use subscore and categories from scoringDetails
    const hasAppData = !!applicationTrack;
    const appScoreValue = applicationTrack?.subscore ?? 0;

    // Extract app category scores from scoringDetails.applicationTrack.categories
    const appItems = hasAppData
        ? [
            { label: "Auth", score: applicationCategories.auth?.score ?? 0 },
            { label: "Secrets", score: applicationCategories.secrets?.score ?? 0 },
            { label: "Dependencies", score: applicationCategories.dependencies?.score ?? 0 },
            { label: "Data Storage", score: applicationCategories.dataStorage?.score ?? 0 },
            { label: "API Surface", score: applicationCategories.apiSurface?.score ?? 0 },
            { label: "Web Hygiene", score: applicationCategories.webHygiene?.score ?? 0 },
        ]
        : [];

    // Use scoringDetails as source of truth for overall score
    const overallScore = scoringDetails?.overall ?? 0;
    const coverage = scoringDetails?.coverage ?? 0;

    // Rank label - prioritize backend shieldRank then fallback to score-based
    const backendRank = (project.scoringDetails?.shieldRank || latestScan?.shieldRank || "").toLowerCase();
    let rankLabel = "";
    if (backendRank.includes("platinum")) rankLabel = "Platinum Shield";
    else if (backendRank.includes("gold")) rankLabel = "Gold Shield";
    else if (backendRank.includes("silver")) rankLabel = "Silver Shield";
    else if (backendRank.includes("bronze")) rankLabel = "Bronze Shield";
    else {
        rankLabel =
            overallScore >= 90
                ? "Platinum Shield"
                : overallScore >= 75
                    ? "Gold Shield"
                    : overallScore >= 60
                        ? "Silver Shield"
                        : "Bronze Shield";
    }

    return (
        <main
            style={{
                background: "url(/auth-page.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            className="min-h-screen pb-20 text-white"
        >
            <Navbar />

            <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 lg:px-32 pt-8">
                {/* Header Section - Nexellent Theme */}
                <header className="flex flex-col md:flex-row justify-between gap-6 md:items-center mb-8">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {(() => {
                                const appFramework = latestApplicationScanData?.framework || project.latestApplicationScan?.framework;
                                const contractFramework = latestContractScanData?.framework || project.latestContractScan?.framework;

                                if (!appFramework && !contractFramework) {
                                    return (
                                        <SubtlePill className="uppercase text-[10px] tracking-wide">
                                            UNKNOWN PLATFORM
                                        </SubtlePill>
                                    );
                                }

                                return (
                                    <>
                                        {appFramework && (
                                            <SubtlePill className="uppercase text-[10px] tracking-wide">
                                                {appFramework}
                                            </SubtlePill>
                                        )}
                                        {contractFramework && (
                                            <SubtlePill className="uppercase text-[10px] tracking-wide">
                                                {contractFramework}
                                            </SubtlePill>
                                        )}
                                    </>
                                );
                            })()}

                            <SubtlePill className="uppercase text-[10px] tracking-wide bg-white/5 border-white/40 text-[#FD7EFF]">
                                {project.visibility}
                            </SubtlePill>

                            {hasScan && (
                                <span className="urbanist flex justify-center items-center gap-2 text-[10px] sm:text-xs text-[#FD7EFF] font-semibold px-3 sm:px-5 py-1 rounded-full border border-[#FD7EFF] bg-black/20">
                                    <Clock size={14} /> Last scan: {lastScanDate}
                                </span>
                            )}
                        </div>

                        <h1 className="anybody text-2xl sm:text-3xl lg:text-4xl font-bold">
                            {project.name}
                        </h1>
                        <p className="inter text-xs sm:text-sm text-white/70 max-w-2xl">
                            {project.description || "No description provided."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-end justify-start md:justify-end gap-2">
                        <SecondaryButton
                            icon={<Clock size={16} />}
                            iconPosition="left"
                            onClick={() => navigate("/scanner")}
                        >
                            Rescan
                        </SecondaryButton>
                        <SecondaryButton
                            icon={isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            iconPosition="left"
                            onClick={exportPdf}
                            disabled={isGeneratingPdf}
                        >
                            {isGeneratingPdf ? "Generating..." : "Export PDF"}
                        </SecondaryButton>
                        <SecondaryButton
                            icon={<Share2 size={16} />}
                            iconPosition="left"
                            onClick={shareReport}
                        >
                            Share Card
                        </SecondaryButton>
                    </div>
                </header>

                {/* No Scan State – themed */}
                {!hasScan ? (
                    <GlowCard className="flex flex-col items-center justify-center text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-[#FD7EFF]/10 border border-[#FD7EFF]/40 flex items-center justify-center mb-6">
                            <Scan className="w-10 h-10 text-[#FFC2C8]" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold urbanist mb-2">
                            No Scan Data Available
                        </h2>
                        <p className="inter text-xs sm:text-sm text-white/70 max-w-md mb-8">
                            This project hasn&apos;t been scanned yet. Run a scan to see live
                            NXELLENT scores, coverage, and detailed risk findings.
                        </p>
                        <SecondaryButton
                            onClick={() => navigate("/scanner")}
                            icon={<Scan size={16} />}
                            iconPosition="left"
                            moreClasses="bg-[#FD7EFF] text-[#090123] border-[#FD7EFF] hover:bg-[#FFC2C8]"
                        >
                            Start New Scan
                        </SecondaryButton>
                    </GlowCard>
                ) : (latestScan?.scanStatus?.status === 'pending' || latestScan?.scanStatus?.status === 'running') ? (
                    <GlowCard className="flex flex-col items-center justify-center text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-[#FD7EFF]/10 border border-[#FD7EFF]/40 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 rounded-full border-t-2 border-[#FD7EFF] animate-spin"></div>
                            <Clock className="w-10 h-10 text-[#FFC2C8]" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold urbanist mb-2">
                            Processing Scan...
                        </h2>
                        <p className="inter text-xs sm:text-sm text-white/70 max-w-md mb-8">
                            We are currently analyzing your codebase. This may take a few minutes depending on the project size. Results will update automatically.
                        </p>
                        <div className="flex items-center gap-2 text-[#FD7EFF] text-sm font-semibold animate-pulse">
                            <Loader2 size={16} className="animate-spin" />
                            Analyzing vulnerabilities
                        </div>
                    </GlowCard>
                ) : (
                    <>
                        {/* Score Summary Row */}
                        <section className="mt-4 flex flex-col lg:flex-row mx-auto gap-6 lg:gap-5 justify-center">
                            {/* Left: main score summary */}
                            <div className="w-full lg:flex-2 space-y-4">
                                <GlowCard className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-6 sm:gap-10 lg:gap-20">
                                    {/* Overall Score */}
                                    <div className="relative flex justify-center items-center min-h-20">
                                        <div className="absolute text-center z-10">
                                            <h1 className="inter font-normal text-4xl sm:text-5xl">
                                                {overallScore}
                                            </h1>
                                            <p className="inter font-normal text-[#8B5CF6] text-xs sm:text-sm mt-1">
                                                {rankLabel}
                                            </p>
                                        </div>
                                        <ScoreRing score={overallScore} size={160} strokeWidth={10} />
                                    </div>

                                    {/* Coverage */}
                                    <div>
                                        <h1 className="jakarta font-bold text-[#BE0178] text-3xl sm:text-4xl">
                                            {coverage}%
                                        </h1>
                                        <p className="inter font-medium text-white/80 text-xs sm:text-sm mt-2">
                                            Coverage
                                        </p>
                                        <p className="inter text-[11px] text-white/50 mt-1">
                                            Code analyzed in latest {isContract ? "contract" : "app"}{" "}
                                            scan.
                                        </p>
                                    </div>

                                    {/* Issues total */}
                                    <div>
                                        <h1 className="jakarta font-bold text-white text-3xl sm:text-4xl">
                                            {issueCounts.total}
                                        </h1>
                                        <p className="inter font-medium text-white/80 text-xs sm:text-sm mt-2">
                                            Total Issues
                                        </p>
                                        <p className="inter text-[11px] text-white/50 mt-1">
                                            Critical / high / medium / low findings combined.
                                        </p>
                                    </div>
                                </GlowCard>

                                {/* Score & Risk Categories */}
                                <GlowCard>
                                    <h1 className="inter font-medium text-xl sm:text-2xl">
                                        Score &amp; Risk Categories
                                    </h1>

                                    <div className="mt-4 flex flex-col xl:flex-row gap-6 justify-center items-stretch">
                                        {hasContractData ? (
                                            <ScoreGroup
                                                title="Contract Security"
                                                score={contractScoreValue}
                                                items={contractItems}
                                            />
                                        ) : (
                                            <AttachScannerPlaceholder
                                                type="contract"
                                                projectId={projectId!}
                                                projectName={project.name}
                                            />
                                        )}

                                        {hasAppData ? (
                                            <ScoreGroup
                                                title="Application Security"
                                                score={appScoreValue}
                                                items={appItems}
                                            />
                                        ) : (
                                            <AttachScannerPlaceholder
                                                type="application"
                                                projectId={projectId!}
                                                projectName={project.name}
                                            />
                                        )}
                                    </div>
                                </GlowCard>

                                {/* Findings Section */}
                                <GlowCard>
                                    <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-lg font-semibold text-white urbanist">
                                                Findings ({filteredFindings.length !== findings.length
                                                    ? `${filteredFindings.length} of ${findings.length}`
                                                    : findings.length})
                                            </h3>
                                            <p className="inter text-xs text-white/60">
                                                All normalized issues detected in the last scan.
                                            </p>
                                        </div>
                                        <div className="flex gap-3 flex-wrap">
                                            <div className="relative">
                                                <Search
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                                                    size={14}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Search findings"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="bg-black/30 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6] inter"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded-full text-xs text-white/70 inter">
                                                <Filter size={14} />
                                                <select
                                                    value={severityFilter}
                                                    onChange={(e) => setSeverityFilter(e.target.value as "all" | "critical" | "high" | "medium" | "low")}
                                                    className="bg-transparent text-xs focus:outline-none cursor-pointer"
                                                >
                                                    <option value="all">All Severity</option>
                                                    <option value="critical">Critical</option>
                                                    <option value="high">High</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="low">Low</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {filteredFindings.length > 0 ? (
                                            filteredFindings.map((finding) => (
                                                <FindingRow key={finding.id} finding={finding} />
                                            ))
                                        ) : findings.length > 0 ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-white/40">
                                                <Search
                                                    size={40}
                                                    className="mb-2 text-white/20"
                                                />
                                                <p className="inter text-sm">
                                                    No findings match your filters.
                                                </p>
                                                <button
                                                    onClick={() => { setSearchTerm(""); setSeverityFilter("all"); }}
                                                    className="mt-2 text-xs text-[#8B5CF6] hover:underline"
                                                >
                                                    Clear filters
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 text-white/40">
                                                <CheckCircle2
                                                    size={40}
                                                    className="mb-2 text-green-500/60"
                                                />
                                                <p className="inter text-sm">
                                                    No issues found. Great job!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </GlowCard>
                            </div>

                            {/* Right column */}
                            <div className="w-full lg:flex-[1.4] flex flex-col gap-6 text-white">
                                {/* Scan Summary */}
                                <GlowCard className="py-6 px-6 sm:px-7">
                                    <div className="flex gap-2 items-center mb-4">
                                        <Shield size={19} color="#EC4899" />
                                        <h1 className="text-base sm:text-lg inter font-medium">
                                            Scan Summary
                                        </h1>
                                    </div>
                                    <div className="space-y-3 text-xs sm:text-sm inter text-white/70">
                                        <p>
                                            This project was last scanned on{" "}
                                            <span className="text-white">{lastScanDate}</span>.
                                        </p>
                                        <p>
                                            A total of{" "}
                                            <span className="text-white font-semibold">
                                                {issueCounts.total} issues
                                            </span>{" "}
                                            were identified across{" "}
                                            {isContract ? "contract" : "application"} security checks.
                                        </p>
                                        <p>
                                            Overall security score:{" "}
                                            <span
                                                className={`font-bold ${overallScore >= 80
                                                    ? "text-green-400"
                                                    : overallScore >= 60
                                                        ? "text-yellow-400"
                                                        : "text-red-400"
                                                    }`}
                                            >
                                                {overallScore}/100
                                            </span>{" "}
                                            ({rankLabel}).
                                        </p>
                                    </div>
                                </GlowCard>

                                {/* Issue Breakdown */}
                                <GlowCard className="py-6 px-6 sm:px-7">
                                    <h2 className="inter font-medium text-base sm:text-lg mb-4">
                                        Issue Breakdown
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4 text-sm urbanist">
                                        <div>
                                            <p className="text-2xl font-bold text-red-400">
                                                {issueCounts.critical}
                                            </p>
                                            <p className="text-xs text-red-400/80 inter">Critical</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-orange-400">
                                                {issueCounts.high}
                                            </p>
                                            <p className="text-xs text-orange-400/80 inter">High</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-yellow-400">
                                                {issueCounts.medium}
                                            </p>
                                            <p className="text-xs text-yellow-400/80 inter">
                                                Medium
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-blue-400">
                                                {issueCounts.low}
                                            </p>
                                            <p className="text-xs text-blue-400/80 inter">Low</p>
                                        </div>
                                    </div>
                                </GlowCard>
                            </div>
                        </section>
                    </>
                )
                }
            </section >
        </main >
    );
};

export default ProjectDetails;
