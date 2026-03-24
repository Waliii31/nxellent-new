import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import KPIStatsBar from "../components/ui/KPIStatsBar";
import ProjectsSearchFilters from "../components/ui/ProjectsSearchFilters";
import AuditScoreCard from "../components/ui/AuditScoreCard";
import InfoPanelMissions from "../components/ui/InfoPanelMissions";
import InfoPanelAlerts from "../components/ui/InfoPanelAlerts";
import InfoPanelTips from "../components/ui/InfoPanelTips";
import { useMyProjects } from "../hooks/api/useProjects";
import Navbar from "../components/sections/Navbar";
import { useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";

export default function MyProjects(): React.ReactElement {
  const { data: projects, isLoading, isError } = useMyProjects();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesType = (() => {
        if (typeFilter === "All") return true;

        const filterLower = typeFilter.toLowerCase();

        // Check filtering by checking explicit type usually stored in DB
        // 'contract' might be 'smart contract', 'application' might be 'app'
        if (filterLower === 'contract') {
          return (p.type && p.type.toLowerCase().includes('contract')) ||
            !!p.latestContractScan;
        }

        if (filterLower === 'application') {
          return (p.type && (p.type.toLowerCase().includes('application') || p.type.toLowerCase().includes('app'))) ||
            !!p.latestApplicationScan;
        }

        return p.type && p.type.toLowerCase().includes(filterLower);
      })();

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" ? p.isActive : !p.isActive);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [projects, search, statusFilter, typeFilter]);

  const cardsCount = filteredProjects.length || (isLoading ? 3 : 0);

  return (
    <main
      style={{
        background: "url(/auth-page.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen pb-20"
    >
      <Navbar />
      {/* <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} /> */}

      {/* HERO */}
      <section
        id="section-hero"
        className="bg-brand-dark text-white font-urbanist overflow-hidden"
      >
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 lg:px-32 pt-10">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="urbanist text-3xl font-bold text-white">
                My Projects
              </span>
              <span className="urbanist text-xl font-light text-brand-text-white">
                Track and improve your code security scores across all projects
              </span>
              {projects && (
                <span className="urbanist text-sm text-white/60 mt-1">
                  {projects.length === 0
                    ? "You don't have any projects yet."
                    : `${projects.length} project${projects.length > 1 ? "s" : ""
                    } in your workspace.`}
                </span>
              )}
            </div>

            {/* NEW SCAN BUTTON */}
            <button
              onClick={() => navigate("/scanner")}
              className="jakarta bg-[linear-gradient(90deg,#FFC857_0%,#FF8A3C_35%,#FF3EC4_80%,#FF0040_100%)] text-[#333333] hover:opacity-90 cursor-pointer font-semibold rounded-full px-10 py-4 flex items-center gap-2.5 whitespace-nowrap shadow-[0_0_10px_rgba(255,0,64,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <Plus size={18} />
              <span>New Scan</span>
            </button>
          </header>

          {/* KPI Bar */}
          <KPIStatsBar />
        </div>
      </section>

      {/* MAIN */}
      <section id="section-main" className="bg-brand-dark text-white inter">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-32 py-8">
          <ProjectsSearchFilters
            search={search}
            onSearch={setSearch}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading && (
              <div className="col-span-full flex justify-center py-20">
                <Loader />
              </div>
            )}

            {isError && (
              <p className="col-span-full text-sm text-red-300">
                Failed to load projects. Please try again.
              </p>
            )}

            {!isLoading && !isError && cardsCount === 0 && (
              <p className="col-span-full text-sm text-white/70">
                No projects yet. Start a new scan to see it appear here.
              </p>
            )}

            {!isLoading &&
              !isError &&
              filteredProjects.map((project) => (
                <AuditScoreCard
                  key={project.id}
                  projectId={project.id}
                  protocolName={project.name}
                  visibility={project.visibility}
                  latestContractScan={project.latestContractScan}
                  latestApplicationScan={project.latestApplicationScan}
                  scoringDetails={project.scoringDetails}
                />
              ))}
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InfoPanelMissions />
            <InfoPanelAlerts />
            <InfoPanelTips />
          </div>
        </div>
      </section>
    </main>
  );
}
