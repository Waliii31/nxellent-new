import React, { useMemo } from "react";
import { Trophy } from "lucide-react";
import { useProjects } from "../../hooks/api/useProjects";

type KPI = {
  title: string;
  value: string;
  icon: React.ReactNode;
  large?: boolean;
};

export default function KPIStatsBar(): React.ReactElement {
  const { data: projects = [] } = useProjects();

  const stats = useMemo(() => {
    // 1. New This Week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newThisWeek = projects.filter(p =>
      new Date(p.createdAt) >= oneWeekAgo
    ).length;

    const projectScores = projects.map(p => {
      const score = Number(p.scoringDetails?.overall) ||
        Number(p.overallScore) ||
        Number((p as any).overall_score) ||
        Number(p.latestContractScan?.scores?.overall) ||
        Number(p.latestApplicationScan?.scores?.overall) ||
        Number((p as any).contractScore) ||
        Number((p as any).applicationScore) ||
        Number((p as any).score) ||
        0;
      return { name: p.name, score };
    }).filter(s => s.score > 0);

    if (projectScores.length === 0) {
      return {
        avgScore: "0.0",
        goldPlatinumPercent: "0%",
        topRated: "N/A",
        newThisWeek: newThisWeek.toString()
      };
    }

    // 3. Avg Score
    const totalScore = projectScores.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = (totalScore / projectScores.length).toFixed(1);

    // 4. % Gold / Platinum (Score >= 75)
    const highTierCount = projectScores.filter(p => p.score >= 75).length;
    const goldPlatinumPercent = Math.round((highTierCount / projectScores.length) * 100) + "%";

    // 5. Top Rated Project
    const topProject = projectScores.reduce((prev, current) =>
      (prev.score > current.score) ? prev : current
    );
    const topRated = `${topProject.name} (${Math.round(topProject.score)})`;

    return {
      avgScore,
      goldPlatinumPercent,
      topRated,
      newThisWeek: newThisWeek.toString()
    };
  }, [projects]);

  const KPIS: KPI[] = [
    { title: "Avg Score", value: stats.avgScore, icon: <img src="/Score.svg" alt="Avg Score" className="w-10 h-10" /> },
    { title: "% Gold / Platinum", value: stats.goldPlatinumPercent, icon: <img src="/badge.svg" alt="Gold/Platinum" className="w-10 h-10" /> },
    // Replaced "Biggest Riser" with "Top Rated Project"
    { title: "Top Rated Project", value: stats.topRated, icon: <Trophy size={35} strokeWidth={1.5} color="#EC4899" />, large: true },
    { title: "New This Week", value: stats.newThisWeek, icon: <img src="/star.svg" alt="New This Week" className="w-10 h-10" /> },
  ];

  return (
    <div
      className={[
        "mt-8 sm:mt-10",
        "w-full rounded-2xl border border-[#2A2355]",
        "bg-[#000124]",
        "shadow-[0_0_40px_0_#A855F733]",
        "relative",
      ].join(" ")}
      style={{
        borderTop: "1px solid #A855F733",
        boxShadow: "0px 0px 40px 0px #A855F733",
        background:
          "linear-gradient(174deg, rgba(0, 0, 0, 0.3) 10%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0.4) 100%)",
      }}
    >
      {/* content directly inside the single box (no inner bordered card) */}
      <div className="p-7">
        <div className="rounded-2xl px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 xl:divide-x divide-slate-700/50">
            {KPIS.map((k, i) => (
              <div key={i} className="flex items-center gap-5 p-4 xl:px-7">
                <div className="flex justify-center items-center rounded-md">{k.icon}</div>
                <div className="flex flex-col gap-1">
                  <p className="alexandria text-base font-medium text-white">{k.title}</p>
                  <p className={`font-medium text-white ${k.large ? "text-xl" : "text-3xl"}`}>{k.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
