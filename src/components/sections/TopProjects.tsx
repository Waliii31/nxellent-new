import React from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import ProjectRow from "../ui/ProjectRow";
import ScrollReveal from "../animations/ScrollReveal";
import { useLeaderboardProjects } from "../../hooks/api/useProjects";

// Assets
import gauge from "/guage.png";
import PrimaryButton from "../ui/PrimaryButton";

// Helper to calculate time ago
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

// Helper to determine tier based on score
const getTier = (score: number) => {
  if (score >= 900) return "PLATINUM";
  if (score >= 800) return "GOLD";
  if (score >= 700) return "SILVER";
  return "BRONZE";
};

const TopProjects: React.FC = () => {
  const { data: projects, isLoading, isError } = useLeaderboardProjects();

  // Sort by score descending and take top 5
  const topProjects = React.useMemo(() => {
    if (!projects) return [];

    // Handle potentially wrapped response
    const projectList = Array.isArray(projects)
      ? projects
      : (projects as Record<string, unknown>).data || (projects as Record<string, unknown>).projects || (projects as Record<string, unknown>).leaderboard || [];

    if (!Array.isArray(projectList)) {
      console.warn("TopProjects: Expected array but got:", projects);
      return [];
    }

    return [...projectList]
      .sort((a, b) => {
        const scoreA = (a.score as number) || (a.scoringDetails?.overall as number) || (a.currentScores?.overall?.score as number) || 0;
        const scoreB = (b.score as number) || (b.scoringDetails?.overall as number) || (b.currentScores?.overall?.score as number) || 0;
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }, [projects]);

  return (
    <section className="relative w-full">
      <ScrollReveal className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <h2 className="anybody text-center text-white text-[28px] sm:text-[32px] md:text-[40px] font-semibold mb-6 sm:mb-8">
          Top Projects
        </h2>

        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#FFC2C8] animate-spin mb-4" />
              <p className="text-white/60 urbanist">Loading top projects...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-400 urbanist">Failed to load projects</p>
            </div>
          ) : topProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 urbanist">No projects found</p>
            </div>
          ) : (
            topProjects.map((p, index) => {
              // Handle both flat structure (leaderboard) and nested structure (standard project)
              const score = (p.score as number) || (p.scoringDetails?.overall as number) || (p.currentScores?.overall?.score as number) || 0;
              const contractScore = (p.contractScore as number) || (p.scoringDetails?.contractTrack?.overall as number) || (p.currentScores?.contract?.score as number) || 0;
              const applicationScore = (p.applicationScore as number) || (p.scoringDetails?.applicationTrack?.overall as number) || (p.currentScores?.application?.score as number) || 0;
              const timeAgoDate = p.lastUpdated || p.updatedAt || p.scoringDetails?.calculatedAt || new Date().toISOString();

              return (
                <ProjectRow
                  key={p.id || p._id}
                  rank={index + 1}
                  name={p.name}
                  category={p.type || "Protocol"} // or p.platform if preferred
                  score={score}
                  tier={getTier(score)}
                  timeAgo={getTimeAgo(timeAgoDate)}
                  gaugeSrc={gauge}
                  contractScore={contractScore}
                  applicationScore={applicationScore}
                  coverage={p.coverage || p.scoringDetails?.coverage || 0}
                  totalIssues={p.totalIssues || 0}
                  criticalIssues={p.criticalIssues || 0}
                  shieldRank={p.shieldRank || p.scoringDetails?.shieldRank}
                  hasContract={p.hasContract || !!p.scoringDetails?.contractTrack}
                  hasApplication={p.hasApplication || !!p.scoringDetails?.applicationTrack}
                />
              );
            })
          )}
        </div>

        <div className="mt-8 sm:mt-10 flex justify-center">
          <PrimaryButton type="button" whereTo="leaderboard" icon={<ArrowUpRight size={16} />}>
            View Full Leaderboard
          </PrimaryButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default TopProjects;
