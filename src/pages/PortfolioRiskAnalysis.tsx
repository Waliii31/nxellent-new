import { useMemo, useState } from "react"
import {
  Download,
  Shield,
  TriangleAlert,
  Trophy,
  ClipboardClock,
  MailPlus,
  Scale,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/sections/Navbar"
import SecondaryButton from "../components/ui/SecondaryButton"
import GlowCard from "../components/ui/GlowCard"

import MetricStatCard from "../components/ui/MetricStatCard"
import FilterDropdown from "../components/ui/FilterDropdown"
import HeatmapTile from "../components/ui/HeatmapTile"
import ScoreDistributionRow from "../components/ui/ScoreDistributionRow"
import RiskSummaryRow from "../components/ui/RiskSummaryRow"
import CriticalIssueCard from "../components/ui/CriticalIssueCard"
import ActionPillButton from "../components/ui/ActionPillButton"
import { useMyProjects } from "../hooks/api/useProjects"

// Helper to determine risk level from score
const getRiskLevel = (score: number): "Low" | "Medium" | "High" | "Critical" => {
  if (score >= 80) return "Low"
  if (score >= 60) return "Medium"
  if (score >= 40) return "High"
  return "Critical"
}

// Helper to get colors based on risk level
const getRiskColors = (risk: string) => {
  switch (risk) {
    case "Low":
      return {
        bg: "linear-gradient(258.37deg, rgba(34, 197, 94, 0.6) -45.38%, rgba(16, 95, 45, 0.6) 123.62%)",
        color: "#28EBAA",
      }
    case "Medium":
      return {
        bg: "linear-gradient(257.64deg, rgba(234, 179, 8, 0.4) -4.07%, rgba(132, 101, 5, 0.4) 137.68%)",
        color: "#EAB308",
      }
    case "High":
      return {
        bg: "linear-gradient(257.12deg, rgba(249, 115, 22, 0.4) -34.63%, rgba(194, 65, 12, 0.4) 107.97%)",
        color: "#F97316",
      }
    case "Critical":
    default:
      return {
        bg: "linear-gradient(257.12deg, rgba(239, 68, 68, 0.4) -34.63%, rgba(137, 39, 39, 0.4) 107.97%)",
        color: "#EF4444",
      }
  }
}

// Determine project type/track from project data
const getProjectTrack = (project: unknown): string => {
  const p = project as Record<string, unknown>;
  if (p.latestContractScan && p.latestApplicationScan) return "Both"
  if (p.latestContractScan) return "Contract"
  if (p.latestApplicationScan) return "Application"
  return "Pending"
}

const PortfolioRiskAnalysis = () => {
  const navigate = useNavigate()
  const { data: projects, isLoading, isError } = useMyProjects()

  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedTrack, setSelectedTrack] = useState("All Tracks")
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  // Process projects into heatmap items
  const heatmapItems = useMemo(() => {
    if (!projects) return []

    return projects.map((p) => {
      const score = Number(p.scoringDetails?.overall) || 0
      const risk = getRiskLevel(score)
      const colors = getRiskColors(risk)
      const track = getProjectTrack(p)

      return {
        id: p.id || p._id || "",
        name: p.name,
        score: Math.round(score),
        status: risk,
        category: risk,
        track,
        bg: colors.bg,
        color: colors.color,
      }
    })
  }, [projects])

  // Get unique track options from actual data
  const trackOptions = useMemo(() => {
    const tracks = new Set(heatmapItems.map((item) => item.track))
    return ["All Tracks", ...Array.from(tracks)]
  }, [heatmapItems])

  const categoryOptions = ["All Categories", "Low", "Medium", "High", "Critical"]

  // Filter items based on selections
  const filteredItems = heatmapItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "All Categories" || item.category === selectedCategory
    const trackMatch =
      selectedTrack === "All Tracks" || item.track === selectedTrack
    return categoryMatch && trackMatch
  })

  // Calculate risk summary counts
  const riskSummary = useMemo(() => {
    return heatmapItems.reduce(
      (acc, item) => {
        acc[item.category as keyof typeof acc]++
        return acc
      },
      { Low: 0, Medium: 0, High: 0, Critical: 0 }
    )
  }, [heatmapItems])

  // Calculate score distribution
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { label: "90-100", min: 90, max: 100, gradient: "linear-gradient(90deg, #22C55E, #105F2D)" },
      { label: "80-89", min: 80, max: 89, gradient: "linear-gradient(90deg, #3B82F6, #1D4ED8)" },
      { label: "70-79", min: 70, max: 79, gradient: "linear-gradient(90deg, #EAB308, #854D0E)" },
      { label: "60-69", min: 60, max: 69, gradient: "linear-gradient(90deg, #F97316, #C2410C)" },
      { label: "0-59", min: 0, max: 59, gradient: "linear-gradient(90deg, #EF4444, #991B1B)" },
    ]

    const total = heatmapItems.length || 1

    return ranges.map((range) => {
      const count = heatmapItems.filter(
        (item) => item.score >= range.min && item.score <= range.max
      ).length
      const percent = total > 0 ? Math.round((count / total) * 100) : 0
      return {
        label: range.label,
        projects: count,
        percent: `${percent}%`,
        gradient: range.gradient,
      }
    })
  }, [heatmapItems])

  // Get critical issues (High and Critical risk projects)
  const criticalIssues = useMemo(() => {
    return heatmapItems
      .filter((item) => item.category === "Critical" || item.category === "High")
      .sort((a, b) => a.score - b.score)
      .slice(0, 5) // Show top 5 most critical
  }, [heatmapItems])

  // Calculate portfolio stats
  const portfolioStats = useMemo(() => {
    if (heatmapItems.length === 0) {
      return { avgScore: 0, highQualityPercent: 0, highRiskCount: 0 }
    }

    const totalScore = heatmapItems.reduce((sum, item) => sum + item.score, 0)
    const avgScore = Math.round(totalScore / heatmapItems.length)
    const highQualityCount = heatmapItems.filter((item) => item.score >= 80).length
    const highQualityPercent = Math.round((highQualityCount / heatmapItems.length) * 100)
    const highRiskCount = heatmapItems.filter(
      (item) => item.category === "High" || item.category === "Critical"
    ).length

    return { avgScore, highQualityPercent, highRiskCount }
  }, [heatmapItems])

  const exportPdf = async () => {
    try {
      setIsGeneratingPdf(true)
      window.print()
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF report. Please try again later.")
    } finally {
      setIsGeneratingPdf(false)
    }
  }

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
          <div className="flex flex-col items-center gap-4 text-white">
            <Loader2 size={48} className="animate-spin text-[#8B5CF6]" />
            <p className="inter text-sm text-white/70">Loading portfolio data...</p>
          </div>
        </div>
      </main>
    )
  }

  if (isError || !projects) {
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
          <div className="flex flex-col items-center gap-4 text-white">
            <AlertCircle size={48} className="text-red-500" />
            <p className="inter text-sm text-white/70">Failed to load portfolio data.</p>
            <SecondaryButton onClick={() => window.location.reload()}>
              Try Again
            </SecondaryButton>
          </div>
        </div>
      </main>
    )
  }

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

      {/* HEADER */}
      <header className="max-w-7xl px-4 sm:px-6 py-6 mx-auto flex justify-between gap-4 flex-wrap items-center">
        <div className="min-w-[200px]">
          <h1 className="urbanist mb-2 font-bold text-white text-xl sm:text-2xl">
            Portfolio Risk Analysis
          </h1>
          <p className="urbanist font-medium text-white/80 text-xs sm:text-sm max-w-md">
            High-level security overview of your investment portfolio
          </p>
        </div>
        <SecondaryButton
          iconPosition="left"
          icon={isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          onClick={exportPdf}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? "Generating..." : "Export PDF"}
        </SecondaryButton>
      </header>

      {/* MAIN CONTENT */}
      <section className="w-full flex flex-col lg:flex-row max-w-7xl px-4 sm:px-6 pb-10 mx-auto items-start gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[73%] space-y-10 min-w-0">
          {/* TOP STATS CARD */}
          <div
            className={[
              "w-full",
              "rounded-2xl border border-[#2A2355]",
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
            <div className="px-4 sm:px-6 py-5 sm:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#2A2355]">
                <MetricStatCard
                  label="Portfolio Avg"
                  iconSrc="/Score.svg"
                  value={portfolioStats.avgScore.toString()}
                  accentText="Overall score"
                  accentClassName="text-[#10B981] text-sm inter font-medium"
                />
                <MetricStatCard
                  label="High Quality"
                  iconSrc="/pink-profit.svg"
                  value={`${portfolioStats.highQualityPercent}%`}
                  accentText="Gold+ tier projects"
                />
                <MetricStatCard
                  label="High Risk"
                  iconSrc="/pink-star.svg"
                  value={portfolioStats.highRiskCount.toString()}
                  accentText="Projects need attention"
                />
              </div>
            </div>
          </div>

          {/* RISK HEATMAP */}
          <div className="w-full px-1 sm:px-2">
            {/* heading + filters */}
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <h1 className="anybody text-lg sm:text-xl text-white">
                Risk Heatmap
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <FilterDropdown
                  value={selectedCategory}
                  options={categoryOptions}
                  onChange={setSelectedCategory}
                  menuWidthClass="w-44"
                />
                <FilterDropdown
                  value={selectedTrack}
                  options={trackOptions}
                  onChange={setSelectedTrack}
                  menuWidthClass="w-48"
                />
              </div>
            </div>

            {/* grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <HeatmapTile
                    key={item.id}
                    name={item.name}
                    score={item.score}
                    status={item.status}
                    background={item.bg}
                    color={item.color}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-white/50">
                  <AlertCircle size={40} className="mb-3 opacity-50" />
                  <p className="inter text-sm">
                    {heatmapItems.length === 0
                      ? "No projects in your portfolio yet."
                      : "No projects match your filters."}
                  </p>
                  {heatmapItems.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory("All Categories")
                        setSelectedTrack("All Tracks")
                      }}
                      className="mt-2 text-xs text-[#8B5CF6] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SCORE DISTRIBUTION */}
          <GlowCard className="mt-6 sm:mt-10 p-5 sm:p-7">
            <h1 className="inter font-medium text-lg sm:text-xl text-white">
              Score Distribution
            </h1>

            <div className="mt-4 flex flex-col gap-4 sm:gap-6 w-full">
              {scoreDistribution.map((row) => (
                <ScoreDistributionRow
                  key={row.label}
                  label={row.label}
                  projects={row.projects}
                  percent={row.percent}
                  gradient={row.gradient}
                />
              ))}
            </div>
          </GlowCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[25%] lg:min-w-[280px] flex flex-col gap-6 text-white">
          {/* Risk Summary */}
          <div className="bg-[#000124] w-full rounded-2xl py-5 px-5 sm:px-7 border-2 border-[#A855F733]/10">
            <div className="flex gap-2 items-center">
              <Shield color="#3B82F6" />
              <h1 className="text-lg inter font-medium">️Risk Summary</h1>
            </div>
            <div className="flex flex-col mt-6 gap-3 sm:gap-4 justify-center items-stretch">
              <RiskSummaryRow label="Low" value={riskSummary.Low} />
              <RiskSummaryRow label="Medium" value={riskSummary.Medium} />
              <RiskSummaryRow label="High" value={riskSummary.High} />
              <RiskSummaryRow label="Critical" value={riskSummary.Critical} />
            </div>
          </div>

          {/* Critical Issues */}
          <div className="bg-[#000124] w-full rounded-2xl py-5 px-5 sm:px-7 border-2 border-[#A855F733]/10">
            <div className="flex gap-2 items-center">
              <TriangleAlert color="#F59E0B" />
              <h1 className="text-lg inter font-medium">Critical Issues</h1>
            </div>

            {criticalIssues.length > 0 ? (
              criticalIssues.map((issue) => (
                <CriticalIssueCard
                  key={issue.id}
                  title={issue.name}
                  description={`${issue.category} risk - Score: ${issue.score}`}
                />
              ))
            ) : (
              <p className="text-sm text-white/70 mt-4">
                No critical issues found. Great job!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="bg-[#000124] w-full rounded-2xl py-5 px-5 sm:px-7 border-2 border-[#A855F733]/10">
            <div className="flex gap-2 items-center">
              <Trophy size={19} color="#EC4899" />
              <h1 className="text-lg inter font-medium">Actions</h1>
            </div>
            <p className="inter font-normal text-[#90A1B9] mt-3 text-xs sm:text-sm">
              Complete tasks to boost your scores
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <ActionPillButton
                icon={<ClipboardClock color="#EC4899" size={17} />}
                label="Generate Report"
                onClick={exportPdf}
              />
              <ActionPillButton
                icon={<MailPlus color="#EC4899" size={17} />}
                label="My Portfolio"
                onClick={() => navigate("/my-portfolio")}
              />
              <ActionPillButton
                icon={<Scale color="#EC4899" size={17} />}
                label="Compare Projects"
                onClick={() => navigate("/compare-projects")}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PortfolioRiskAnalysis
