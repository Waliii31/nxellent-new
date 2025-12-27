import React, { useEffect, useState } from "react";
import { Save, Lock, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageHeaderBar from "../components/ui/PageHeaderBar";
import GlowCard from "../components/ui/GlowCard";
import FieldPill from "../components/ui/FieldPill";
import InviteInline from "../components/ui/InviteInline";
import TeamMemberRow from "../components/ui/TeamMemberRow";
import DangerZoneBlock from "../components/ui/DangerZoneBlock";
import { useProject, useUpdateProject, useAddTeamMember, useRemoveTeamMember } from "../hooks/api/useProjects";
import Navbar from "../components/sections/Navbar";

const THUMB_COLOR = "#00011D";

export default function ProjectSettings(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");

  const { data: project, isLoading, isError } = useProject(
    projectId ?? undefined
  );
  const updateMutation = useUpdateProject();
  const addTeamMemberMutation = useAddTeamMember();
  const removeTeamMemberMutation = useRemoveTeamMember();

  const [projectName, setProjectName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [scanFrequency, setScanFrequency] = useState<string>("weekly");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // hydrate local state when project loads
  useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
      setIsPublic(project.visibility === "public");
      // Set scan frequency from project data if available
      // For now, we'll keep it as local state since the backend doesn't store it yet
    }
  }, [project]);

  const handleSave = () => {
    setSaveError(null);
    setSaveSuccess(null);

    if (!projectId) {
      setSaveError("No project selected.");
      return;
    }

    updateMutation.mutate(
      {
        id: projectId,
        body: {
          name: projectName || project?.name,
          visibility: isPublic ? "public" : "private",
          // Note: scanFrequency would need to be added to the backend UpdateProjectDto
          // For now, it's only stored in local state
        },
      },
      {
        onSuccess: () => {
          setSaveSuccess("Changes saved.");
        },
        onError: (err: any) => {
          setSaveError(
            err?.response?.data?.message || "Failed to save changes."
          );
        },
      }
    );
  };

  const handleInvite = (email: string, role: string) => {
    if (!projectId) return;

    addTeamMemberMutation.mutate(
      {
        id: projectId,
        body: { email, role }, // Send email instead of userId - backend will resolve it
      },
      {
        onSuccess: () => {
          setSaveSuccess(`Invited ${email} as ${role}`);
        },
        onError: (err: any) => {

          const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to invite team member. The backend returned an error.";

          setSaveError(errorMessage);
        },
      }
    );
  };

  const handleRemoveMember = (userId: string) => {
    if (!projectId) return;

    removeTeamMemberMutation.mutate(
      {
        id: projectId,
        userId,
      },
      {
        onSuccess: () => {
          setSaveSuccess("Team member removed.");
        },
        onError: (err: any) => {
          setSaveError(
            err?.response?.data?.message || "Failed to remove team member."
          );
        },
      }
    );
  };

  // Calculate next scheduled scan
  const getNextScheduledScan = () => {
    if (!project) return "Not scheduled";

    // Get the latest scan date from either contract or application scans
    const contractScanDate = project.latestContractScan?.createdAt;
    const appScanDate = project.latestApplicationScan?.createdAt;

    let lastScanDate: Date | null = null;

    if (contractScanDate && appScanDate) {
      lastScanDate = new Date(Math.max(new Date(contractScanDate).getTime(), new Date(appScanDate).getTime()));
    } else if (contractScanDate) {
      lastScanDate = new Date(contractScanDate);
    } else if (appScanDate) {
      lastScanDate = new Date(appScanDate);
    }

    if (!lastScanDate) {
      return "No scans yet";
    }

    // Calculate next scan based on frequency
    const nextScan = new Date(lastScanDate);
    switch (scanFrequency) {
      case "daily":
        nextScan.setDate(nextScan.getDate() + 1);
        break;
      case "weekly":
        nextScan.setDate(nextScan.getDate() + 7);
        break;
      case "monthly":
        nextScan.setMonth(nextScan.getMonth() + 1);
        break;
    }

    // Calculate days until next scan
    const now = new Date();
    const diffTime = nextScan.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Overdue";
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `in ${diffDays} days`;
    }
  };

  const headerSubtitle =
    project?.name || (isLoading ? "Loading project…" : "Project Settings");

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
      <PageHeaderBar
        title="Project Settings"
        subtitle={headerSubtitle}
        ctaLabel={updateMutation.isPending ? "Saving…" : "Save Changes"}
        ctaIcon={<Save size={16} />}
        ctaOnClick={handleSave} // ✅ correct prop name
      />

      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        {/* General */}
        <GlowCard>
          <span className="urbanist text-2xl text-white font-medium font-anybody ">
            General
          </span>
          <p className="alexandria text-white/70 mt-3 font-light font-alexandria">
            Basic project information and settings
          </p>

          <FieldPill
            label="Project Name"
            placeholder="Defi Protocol"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <div className="mt-5 flex justify-between items-center gap-4">
            <div className="max-w-[70%] min-w-0">
              <p className="alexandria text-white text-lg font-light font-anybody  truncate">
                Visibility
              </p>
              <p className="alexandria text-white/70 text-sm font-light font-alexandria">
                Control who can see your project on the leaderboard.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative inline-block w-11 h-5">
                <input
                  checked={isPublic}
                  id="switch-component-1"
                  type="checkbox"
                  onChange={() => setIsPublic((v) => !v)}
                  className="peer jakarta appearance-none w-11 h-5 rounded-full cursor-pointer transition-colors duration-300 bg-gray-700 checked:bg-[#FD7EFF]"
                />
                <label
                  htmlFor="switch-component-1"
                  className={[
                    "absolute jakarta top-0 left-0 w-5 h-5 rounded-full shadow-sm transition-transform duration-300 cursor-pointer border",
                    isPublic ? "translate-x-6" : "",
                  ].join(" ")}
                  style={{
                    background: isPublic ? THUMB_COLOR : "#FFFFFF",
                    borderColor: isPublic ? THUMB_COLOR : "#9CA3AF",
                  }}
                />
              </div>
              <Lock
                size={20}
                strokeWidth={2}
                className={isPublic ? "text-white" : "text-white/40"}
              />
            </div>
          </div>

          {/* Loading / errors / success */}
          {isLoading && (
            <p className="mt-4 text-sm text-white/60">
              Loading project details…
            </p>
          )}
          {isError && (
            <p className="mt-4 text-sm text-red-300">
              Failed to load project. Make sure the URL contains a valid{" "}
              <code>?id=</code>.
            </p>
          )}
          {saveError && (
            <p className="mt-4 text-sm text-red-300">{saveError}</p>
          )}
          {saveSuccess && (
            <p className="mt-4 text-sm text-emerald-300">{saveSuccess}</p>
          )}
        </GlowCard>

        {/* Scanning Schedule – still local only */}
        <GlowCard>
          <span className="urbanist text-2xl text-white font-medium font-anybody ">
            Scanning Schedule
          </span>
          <p className="alexandria text-white/70 mt-3 font-light font-alexandria">
            Configure automated security scans
          </p>

          <div className="text-left mt-5">
            <label className="text-white jakarta text-[16px] font-medium font-plus-jakarta-sans">
              Scan Frequency
            </label>
            <div className="relative mt-3 flex rounded-full h-12 w-full items-center gap-3 bg-[#3838381A] border border-[#ffffff66] shadow-[0_0_6px_0_#00000026]">
              <select
                value={scanFrequency}
                onChange={(e) => setScanFrequency(e.target.value)}
                className="custom-select jakarta w-full outline-none rounded-full px-4 text-white text-[14px] bg-transparent font-plus-jakarta-sans appearance-none"
              >
                <option className="bg-[#000124] text-white" value="weekly">
                  Weekly
                </option>
                <option className="bg-[#000124] text-white" value="daily">
                  Daily
                </option>
                <option className="bg-[#000124] text-white" value="monthly">
                  Monthly
                </option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 text-white pointer-events-none"
              />
            </div>
          </div>

          <p className="alexandria text-white/70 text-sm mt-5 font-alexandria">
            Next scheduled scan: {getNextScheduledScan()}
          </p>
        </GlowCard>

        {/* Team Members – still demo data, backend hooks ready */}
        <GlowCard className="col-span-full lg:col-span-2">
          <span className="urbanist text-2xl text-white font-medium font-anybody ">
            Team Members
          </span>
          <p className="alexandria text-white/70 mt-3 font-light font-alexandria">
            Manage project access and permissions
          </p>

          <InviteInline onInvite={handleInvite} />

          <div className="mt-8">
            {project?.teamMembers && project.teamMembers.length > 0 ? (
              project.teamMembers.map((member) => {
                // Handle both populated user objects and string user IDs
                const userId = typeof member.user === 'string' ? member.user : member.user._id;
                const userKey = typeof member.user === 'string' ? member.user : member.user._id;

                return (
                  <TeamMemberRow
                    key={userKey}
                    userId={userId}
                    role={member.role}
                    populatedUser={typeof member.user === 'object' ? member.user : undefined}
                    onRemove={() => handleRemoveMember(userId)}
                  />
                );
              })
            ) : (
              <p className="text-white/60 text-sm">No team members yet. Invite someone to get started!</p>
            )}
          </div>
        </GlowCard>

        <DangerZoneBlock />
      </section>
    </main>
  );
}
