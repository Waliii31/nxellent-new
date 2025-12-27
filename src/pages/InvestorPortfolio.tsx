import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Download } from "lucide-react";
import Navbar from "../components/sections/Navbar";
import GlowCard from "../components/ui/GlowCard";
import SecondaryButton from "../components/ui/SecondaryButton";
import { useMyProjects } from "../hooks/api/useProjects";

export default function InvestorPortfolio() {
    const navigate = useNavigate();
    const { data: projects, isLoading } = useMyProjects();

    const { stats, sortedProjects } = useMemo(() => {
        if (!projects) return { stats: [], sortedProjects: [] };

        const processedProjects = projects.map(p => {
            const primaryScan = p.latestContractScan || p.latestApplicationScan;
            // Use logic similar to AuditScoreCard
            const score = p.scoringDetails?.overall ?? primaryScan?.scores?.overall ?? 0;
            const lastScanDate = primaryScan?.createdAt
                ? new Date(primaryScan.createdAt).toLocaleDateString()
                : "Never";

            let rank = "BRONZE";
            if (score >= 90) rank = "PLATINUM";
            else if (score >= 75) rank = "GOLD";
            else if (score >= 60) rank = "SILVER";

            return {
                ...p,
                score,
                rank,
                lastScanDate,
                sub: p.type === "contract" ? "Smart Contract" : "Application"
            };
        });

        // Sort by score descending
        const sorted = [...processedProjects].sort((a, b) => b.score - a.score);

        // Calculate stats
        const totalProjects = processedProjects.length;
        const avgScore = totalProjects > 0
            ? Math.round(processedProjects.reduce((acc, p) => acc + p.score, 0) / totalProjects)
            : 0;
        const highRiskCount = processedProjects.filter(p => p.score < 60).length;
        const secureCount = processedProjects.filter(p => p.score >= 90).length;

        const calculatedStats = [
            {
                label: "Average Score",
                value: avgScore.toString(),
                subtext: "Portfolio Health",
                subtextClass: "text-[#4ADE80]",
                icon: Shield,
                iconColor: "text-[#A855F7]",
            },
            {
                label: "Total Projects",
                value: totalProjects.toString(),
                subtext: "Active in workspace",
                subtextClass: "text-white/60",
                icon: TrendingUp,
                iconColor: "text-[#3B82F6]",
            },
            {
                label: "High Risk",
                value: highRiskCount.toString(),
                subtext: "Projects require attention",
                subtextClass: "text-white/60",
                icon: AlertTriangle,
                iconColor: "text-[#EF4444]",
            },
            {
                label: "Secure (90+)",
                value: secureCount.toString(),
                valueClass: "text-3xl font-bold text-white mb-2",
                subtext: "Top performing projects",
                subtextClass: "text-white/60",
                icon: CheckCircle,
                iconColor: "text-[#10B981]",
            },
        ];

        return { stats: calculatedStats, sortedProjects: sorted };
    }, [projects]);

    return (
        <main
            style={{
                background: "url(/auth-page.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            className="min-h-screen w-full"
        >
            <Navbar isFixed={false} />

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="urbanist text-3xl font-bold text-white mb-2">Investor Portfolio</h1>
                        <p className="urbanist text-white/60 font-medium">
                            Overview of your portfolio's security posture.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <SecondaryButton onClick={() => window.print()} icon={<Download size={16} />}>
                            Export Report
                        </SecondaryButton>
                        <SecondaryButton onClick={() => navigate("/batch-scanner")}>
                            Batch Scan
                        </SecondaryButton>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <GlowCard children="" key={i} className="p-6 h-32 animate-pulse bg-white/5" />
                        ))
                    ) : (
                        stats.map((stat, i) => (
                            <GlowCard key={i} className="p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inter text-white/60 text-sm font-medium">{stat.label}</span>
                                    <div className={`p-2 rounded-lg bg-white/5 ${stat.iconColor}`}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                                <div className={stat.valueClass || "urbanist text-3xl font-bold text-white mb-2"}>
                                    {stat.value}
                                </div>
                                {stat.subtext && (
                                    <div className={`inter text-xs font-medium ${stat.subtextClass}`}>
                                        {stat.subtext}
                                    </div>
                                )}
                            </GlowCard>
                        ))
                    )}
                </div>

                {/* Projects Table */}
                <GlowCard className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="urbanist text-xl font-bold text-white">Top Performing Projects</h2>
                        <button
                            onClick={() => navigate("/projects/my-projects")}
                            className="text-[#A855F7] hover:text-[#C084FC] text-sm font-medium transition-colors"
                        >
                            View All Projects
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-white/60 text-sm inter">
                                    <th className="py-4 font-medium pl-4">Project Name</th>
                                    <th className="py-4 font-medium">Overall Score</th>
                                    <th className="py-4 font-medium">Shield Rank</th>
                                    <th className="py-4 font-medium">Last Scan</th>
                                    <th className="py-4 font-medium text-right pr-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="inter">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-white/60">Loading projects...</td>
                                    </tr>
                                ) : sortedProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-white/60">No projects found.</td>
                                    </tr>
                                ) : (
                                    sortedProjects.map((project) => (
                                        <tr key={project.id} className="border-b border-white/5 last:border-none hover:bg-white/5 transition-colors group">
                                            <td className="py-4 pl-4">
                                                <div className="text-white font-medium">{project.name}</div>
                                                <div className="text-white/40 text-xs">{project.sub}</div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`font-bold text-lg ${project.score >= 90 ? "text-[#4ADE80]" :
                                                        project.score >= 60 ? "text-[#F6A94E]" : "text-[#EF4444]"
                                                    }`}>
                                                    {project.score}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${project.rank === "PLATINUM" ? "bg-[#E0E7FF]/10 text-[#E0E7FF] border-[#E0E7FF]/20" :
                                                        project.rank === "GOLD" ? "bg-[#FDE68A]/10 text-[#FDE68A] border-[#FDE68A]/20" :
                                                            project.rank === "SILVER" ? "bg-[#E5E7EB]/10 text-[#E5E7EB] border-[#E5E7EB]/20" :
                                                                "bg-[#FDBA74]/10 text-[#FDBA74] border-[#FDBA74]/20"
                                                    }`}>
                                                    {project.rank}
                                                </span>
                                            </td>
                                            <td className="py-4 text-white/60 text-sm">
                                                {project.lastScanDate}
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <button
                                                    onClick={() => navigate(`/projects/settings?id=${project.id}`)}
                                                    className="text-white/40 group-hover:text-[#A855F7] hover:text-[#C084FC]! text-sm font-medium transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlowCard>
            </div>
        </main>
    );
}
