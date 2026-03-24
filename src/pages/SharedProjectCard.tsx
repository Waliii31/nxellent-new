import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

import { usePublicProject, useProject } from "../hooks/api/useProjects";

const SharedProjectCard: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    // Strategy: For shared cards, try PUBLIC endpoint FIRST (no auth required), fallback to private if user is logged in
    const { data: publicProject, isError: isPublicError, isLoading: isLoadingPublic } = usePublicProject(projectId);
    const { data: privateProject, isLoading: isLoadingPrivate } = useProject(isPublicError ? projectId : undefined);

    const project = publicProject || privateProject;
    const isLoading = isLoadingPublic || (isPublicError && isLoadingPrivate);

    const [copied, setCopied] = React.useState(false);

    // Dynamic data extraction from scoringDetails
    const sd = project?.scoringDetails || {};
    const overallScore = Number(sd.overall) || Number(project?.score) || 0;

    // Track scores extraction - use 'subscore' from scoringDetails as per backend API
    const contractScore = Number(sd.contractTrack?.subscore) ||
        Number(project?.latestContractScan?.scores?.overall) ||
        Number(project?.contractScore) || 0;

    const applicationScore = Number(sd.applicationTrack?.subscore) ||
        Number(project?.latestApplicationScan?.scores?.overall) ||
        Number(project?.applicationScore) || 0;

    // Rank label extraction
    const backendRank = (sd.shieldRank || String(project?.shieldRank || "")).toLowerCase();
    let rankLabel = "";
    if (backendRank.includes("platinum")) rankLabel = "Platinum Shield";
    else if (backendRank.includes("gold")) rankLabel = "Gold Shield";
    else if (backendRank.includes("silver")) rankLabel = "Silver Shield";
    else if (backendRank.includes("bronze")) rankLabel = "Bronze Shield";
    else {
        rankLabel = overallScore >= 90 ? "Platinum Shield" :
            overallScore >= 75 ? "Gold Shield" :
                overallScore >= 60 ? "Silver Shield" : "Bronze Shield";
    }

    // Critical issues from findingsCount as per backend API
    const contractIssues = sd.contractTrack?.findingsCount || { total: 0, critical: 0 };
    const appIssues = sd.applicationTrack?.findingsCount || { total: 0, critical: 0 };
    const criticalIssues = (Number(contractIssues.critical) || 0) + (Number(appIssues.critical) || 0);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied");
        setTimeout(() => setCopied(false), 2000);
    };

    const ProgressBar = ({ value }: { value: number }) => (
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
                className="h-full bg-linear-to-r from-fuchsia-500 to-purple-500 transition-all duration-700"
                style={{ width: `${Math.min(100, value)}%` }}
            />
        </div>
    );

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#05050f] flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </main>
        );
    }

    if (!project && !isLoading) {
        return (
            <main className="min-h-screen bg-[#05050f] flex flex-col items-center justify-center text-white px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
                    <ArrowRight className="w-10 h-10 text-red-400 rotate-180" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
                <p className="text-white/60 max-w-sm mb-8">
                    This project might be private or the link is incorrect. If you are the owner, please ensure the project visibility is set to public.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold"
                >
                    Back to Home
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#05050f] flex flex-col items-center justify-center px-4">
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-linear-to-b from-[#1a1140]/80 to-[#0b0820]/90 backdrop-blur-xl shadow-2xl p-8">
                {/* Header with Project Info and Score Ring */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex gap-2 mb-3">
                            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 uppercase">
                                {project?.visibility || "PRIVATE"}
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded bg-white/5 border border-white/10 text-white/60 uppercase">
                                {project?.platform || "WEB3"}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white leading-tight">{project?.name}</h1>
                        <p className="text-xs text-white/50 mt-2 line-clamp-2">
                            {project?.description || "Security audit report for protocol security."}
                        </p>
                    </div>

                    <div className="relative shrink-0 flex flex-col items-center">
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <span className="text-xl font-bold text-white leading-none">{overallScore}</span>
                            <span className="text-[8px] text-white/40 uppercase font-bold mt-0.5">Score</span>
                        </div>
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="50%" cy="50%" r="40%" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                            <circle
                                cx="50%" cy="50%" r="40%"
                                stroke="url(#card-grad)"
                                strokeWidth="6" fill="none"
                                strokeDasharray={`${(overallScore / 100) * 125} 125`}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                            <defs>
                                <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#BE0178" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                <div className="mb-6 flex justify-center">
                    <span className="px-4 py-1.5 rounded-full bg-linear-to-r from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold tracking-widest uppercase">
                        {rankLabel}
                    </span>
                </div>

                {/* Scores */}
                <div className="space-y-4 mb-6">
                    <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>Contract Security</span>
                            <span>{contractScore}/100</span>
                        </div>
                        <ProgressBar value={contractScore} />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                            <span>Application Security</span>
                            <span>{applicationScore}/100</span>
                        </div>
                        <ProgressBar value={applicationScore} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <span
                            className={`w-2 h-2 rounded-full ${criticalIssues > 0 ? "bg-red-500" : "bg-white/20"
                                }`}
                        />
                        Critical: {criticalIssues}
                    </div>

                    <button
                        onClick={() => navigate(`/projects/${projectId}`)}
                        className="flex items-center gap-1 text-xs text-fuchsia-400 hover:text-fuchsia-300"
                    >
                        View report <ArrowRight size={12} />
                    </button>
                </div>
            </div>

            {/* Share */}
            <button
                onClick={handleCopyLink}
                className="mt-6 flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
            >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                {copied ? "Copied" : "Share report"}
            </button>

            {/* CTA */}
            <div className="mt-10 text-center">
                <p className="text-white/50 text-sm mb-4">
                    View the full NXELLENT security report
                </p>
                <div className="flex gap-3 justify-center text-center">
                    <button
                        onClick={() => navigate("/auth/login")}
                        className="px-6 py-2 rounded-full bg-fuchsia-500 text-black font-medium"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => navigate("/auth/signup")}
                        className="px-6 py-2 rounded-full border border-white/20 text-white"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </main>
    );
};

export default SharedProjectCard;