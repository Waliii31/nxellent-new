import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Github,
  Link2,
  Shield,
  Upload,
  Zap,
  ExternalLink,
  Loader2,
  ChevronDown,
  Search,
  Lock,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import { connectGithub } from "../services/authService";
import { useUploadZip, useInitiateScan } from "../hooks/api/useUploadsAndScans";

import { useGithubStatus, useGithubRepositories } from "../hooks/api/useGithub";
import Navbar from "../components/sections/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSubscriptionStatus } from "../hooks/api/useSubscription";
import ScanModal from "../components/modals/ScanModal";

const MAX_FILE_SIZE_MB = 10;



const ScanTypeToggle: React.FC<{
  value: "contract" | "application";
  onChange: (val: "contract" | "application") => void;
}> = ({ value, onChange }) => {
  const options = [
    {
      key: "contract" as const,
      title: "Smart Contract",
      subtitle: "Solana program security scan",
    },
    {
      key: "application" as const,
      title: "Application",
      subtitle: "Node.js/Next.js app scan",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((opt) => {
        const isActive = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={[
              "w-full text-left rounded-2xl border transition-all",
              "px-5 py-4 flex items-center gap-3",
              isActive
                ? "bg-[#000124] border-[#FD7EFF] shadow-[0_0_40px_0_#A855F733]"
                : "bg-[#000124]/60 border-white/10 hover:border-[#FD7EFF]/50",
            ].join(" ")}
          >
            <div
              className={[
                "w-11 h-11 rounded-full flex items-center justify-center",
                isActive ? "bg-[#FD7EFF]/20" : "bg-white/5",
              ].join(" ")}
            >
              <Shield
                className={isActive ? "text-[#FFC2C8]" : "text-white/80"}
                size={22}
              />
            </div>
            <div className="flex flex-col">
              <span className="urbanist font-semibold text-lg text-white">
                {opt.title}
              </span>
              <span className="text-sm text-white/70">{opt.subtitle}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const FeatureHighlights = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
    {[
      {
        icon: Zap,
        title: "Fast Results",
        desc: "Get your security report in minutes",
      },
      {
        icon: Shield,
        title: "Detailed Analysis",
        desc: "Comprehensive vulnerability assessment",
      },
      {
        icon: CheckCircle2,
        title: "Risk Score",
        desc: "0-100 score with actionable insights",
      },
    ].map(({ icon: Icon, title, desc }) => (
      <div
        key={title}
        className="rounded-2xl border border-white/10 bg-[#000124]/70 px-5 py-4 flex items-center gap-3"
      >
        <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center">
          <Icon className="text-[#FFC2C8]" size={22} />
        </div>
        <div className="flex flex-col">
          <span className="urbanist text-white font-semibold">{title}</span>
          <span className="text-sm text-white/70">{desc}</span>
        </div>
      </div>
    ))}
  </div>
);

const Scanner: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [scanType, setScanType] = useState<"contract" | "application">(
    "contract"
  );

  const [repoUrl, setRepoUrl] = useState("");
  const [uploadPath, setUploadPath] = useState<string | undefined>();
  const [uploadName, setUploadName] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showUpgradeButton, setShowUpgradeButton] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Dropdown state
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [repoSearchTerm, setRepoSearchTerm] = useState("");

  const uploadZip = useUploadZip();
  const initiateScan = useInitiateScan();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const attachToProjectId = searchParams.get("attachToProjectId");
  const attachToProjectName = searchParams.get("attachToProjectName");
  const initialScanType = searchParams.get("scanType");

  // Initialize scanType from URL or default
  useEffect(() => {
    if (initialScanType === "contract" || initialScanType === "application") {
      setScanType(initialScanType);
    }
  }, [initialScanType]);

  // Fetch subscription status
  const { data: subscriptionStatus, isLoading: isLoadingSubscription, refetch: refetchSubscription } = useSubscriptionStatus();

  // Handle successful scan purchase redirect
  React.useEffect(() => {
    const purchased = searchParams.get("scan_purchased");

    if (purchased === "true") {
      toast.success("Payment successful! Verifying credits...", {
        duration: 5000,
        style: {
          background: "#0B0B2A",
          color: "#fff",
          border: "1px solid #272744",
        }
      });

      // Force refetch immediate
      refetchSubscription();

      // Retry refetching a few times to handle webhook latency
      const timeouts = [
        setTimeout(() => refetchSubscription(), 2000),
        setTimeout(() => refetchSubscription(), 5000),
        setTimeout(() => {
          refetchSubscription();
          toast.success("Balance updated!", { id: "balance-update" });
        }, 8000),
      ];

      // Clean up URL
      searchParams.delete("scan_purchased");
      setSearchParams(searchParams);

      return () => timeouts.forEach(clearTimeout);
    }
  }, [searchParams, setSearchParams, refetchSubscription]);

  // Fetch GitHub status and repositories
  const { data: githubStatus } = useGithubStatus();
  const {
    data: repos,
    isLoading: isLoadingRepos,
    isError: reposError
  } = useGithubRepositories(!!githubStatus?.connected);

  const isSubmitting = useMemo(
    () => uploadZip.isPending || initiateScan.isPending,
    [uploadZip.isPending, initiateScan.isPending]
  );

  // Helper function to extract project name from ZIP filename or GitHub URL
  const getInitialProjectName = (): string => {
    // If using uploaded ZIP, extract filename without extension
    if (uploadName) {
      return uploadName.replace(/\.zip$/i, "").replace(/[_-]/g, " ");
    }

    // If using GitHub URL, extract repository name
    const trimmedUrl = repoUrl.trim();
    if (trimmedUrl && trimmedUrl !== "https://github.com/username/repository") {
      try {
        // Extract repo name from GitHub URL
        // Supports: https://github.com/user/repo, https://github.com/user/repo.git, github.com/user/repo
        const match = trimmedUrl.match(/github\.com\/[^\/]+\/([^\/\.]+)/);
        if (match && match[1]) {
          return match[1].replace(/[_-]/g, " ");
        }
      } catch (e) {
        // If parsing fails, return empty string
      }
    }

    return "";
  };

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    setError(undefined);
    setSuccess(undefined);

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError("Only ZIP files are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    uploadZip.mutate(file, {
      onSuccess: (res) => {
        // Backend returns 'extractPath'
        const path = res.extractPath || res.path;
        setUploadPath(path);
        setUploadName(res.filename);
        setRepoUrl("");
        setSuccess("Repository uploaded successfully.");
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Upload failed. Please try again.";
        setError(msg);
      },
    });
  };

  const handleDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const file = evt.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleScanStart = () => {
    setError(undefined);
    setSuccess(undefined);
    setShowUpgradeButton(false);

    // Client-side check removed to let backend handle validation
    // const plan = subscriptionStatus?.plan?.toLowerCase() || "";
    // const isUnlimited = ["pro", "investor-pro", "enterprise"].includes(plan);
    // if (subscriptionStatus && !isUnlimited && (subscriptionStatus.remainingScans ?? 0) <= 0) {
    //   setError("You have no remaining scans left. Please upgrade your plan to continue scanning.");
    //   setShowUpgradeButton(true);
    //   return;
    // }

    const trimmedUrl = repoUrl.trim();
    const useUpload = !!uploadPath;

    if (!useUpload && !trimmedUrl) {
      setError("Provide a repository URL or upload a ZIP file to continue.");
      return;
    }

    // If attaching to existing project, skip modal and initiate directly
    if (attachToProjectId) {
      const payload = {
        scanType: scanType,
        sourceType: useUpload ? ("upload" as const) : ("url" as const),
        repoUrl: useUpload ? undefined : trimmedUrl,
        uploadPath: uploadPath || undefined,
        projectId: attachToProjectId,
        // We don't need these validation fields for existing project likely, 
        // but let's pass generic ones if strict validation requires them
        projectName: attachToProjectName || "Existing Project",
        projectVisibility: "private" as const
      };

      initiateScan.mutate(payload, {
        onSuccess: () => {
          toast.success("Scan attached & initiated!", {
            style: { background: "#0B0B2A", color: "#fff", border: "1px solid #272744" }
          });
          setSuccess("Scan started for existing project. Redirecting...");
          setTimeout(() => navigate(`/projects/${attachToProjectId}`), 1500);
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message || error?.message || "Failed to initiate scan.";
          setError(msg);
          if (msg.toLowerCase().includes('scan') && (msg.toLowerCase().includes('upgrade') || msg.toLowerCase().includes('used all') || msg.toLowerCase().includes('no remaining'))) {
            setShowUpgradeButton(true);
          }
        }
      });
      return;
    }

    // Open modal to collect project details for NEW project
    setShowModal(true);
  };

  /* New logic with useInitiateScan */
  const handleModalSubmit = (data: { projectName: string; description: string; visibility: "private" | "public" }) => {
    const trimmedRepoUrl = repoUrl.trim();
    const useUpload = !!uploadPath;

    const payload = {
      scanType: scanType,

      sourceType: useUpload ? ("upload" as const) : ("url" as const),
      repoUrl: useUpload ? undefined : trimmedRepoUrl,
      uploadPath: uploadPath || undefined,
      projectName: data.projectName,
      projectDescription: data.description,
      projectVisibility: data.visibility
    };

    initiateScan.mutate(payload, {
      onSuccess: () => {
        toast.success("Scan initiated successfully", {
          style: {
            background: "#0B0B2A",
            color: "#fff",
            border: "1px solid #272744",
          }
        });
        setSuccess("Scan initiated successfully. Redirecting to projects...");
        setUploadPath(undefined);
        setUploadName(undefined);
        setRepoUrl("");
        setShowModal(false);
        // Small delay so user sees success message, then redirect
        setTimeout(() => {
          navigate("/projects/my-projects");
        }, 1500);
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || error?.message || "Failed to initiate scan.";
        setError(msg);
        setShowModal(false);
        // Show upgrade button if error is about scan limits
        if (msg.toLowerCase().includes('scan') &&
          (msg.toLowerCase().includes('upgrade') ||
            msg.toLowerCase().includes('used all') ||
            msg.toLowerCase().includes('no remaining'))) {
          setShowUpgradeButton(true);
        }
      }
    });
  };

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background: "url(/auth-page.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar isFixed={false} />
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16">
        {attachToProjectId && (
          <div className="mb-8 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/40 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Link2 size={20} className="text-[#FD7EFF]" />
                Attaching to Project: <span className="text-[#FD7EFF]">{attachToProjectName || "Unknown"}</span>
              </h2>
              <p className="text-white/60 text-sm">
                Running a <b>{scanType}</b> scan. Results will be added to this project.
              </p>
            </div>
            <button
              onClick={() => {
                searchParams.delete("attachToProjectId");
                searchParams.delete("attachToProjectName");
                searchParams.delete("scanType");
                setSearchParams(searchParams);
              }}
              className="text-xs text-white/50 hover:text-white underline"
            >
              Cancel Attachment
            </button>
          </div>
        )}

        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-[#FD7EFF] urbanist">
            Run a Security Scan
          </p>
          <h1 className="text-3xl md:text-4xl font-bold urbanist mt-2">
            Scan your repository for security vulnerabilities and get a comprehensive risk score
          </h1>
          <p className="text-white/70 max-w-3xl mx-auto mt-4 text-base">
            Choose a scan type, connect your repository, and start an automated analysis powered by Nxellent.
          </p>

          {/* Subscription Status & My Projects Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            {/* Subscription Status */}
            {isLoadingSubscription ? (
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                Loading subscription...
              </div>
            ) : subscriptionStatus ? (
              <div className="px-4 py-2 rounded-full bg-[#000124] border border-[#FD7EFF]/30 text-sm">
                <span className="text-white/70">Plan: </span>
                <span className="text-[#FFC2C8] font-semibold capitalize">
                  {subscriptionStatus.plan?.charAt(0).toUpperCase() + subscriptionStatus.plan?.slice(1).toLowerCase()} Plan
                </span>
                <span className="text-white/70 mx-2">•</span>
                <span className="text-white/70">Scans: </span>
                {["pro", "investor-pro", "enterprise"].includes(subscriptionStatus.plan?.toLowerCase() || "") ? (
                  <span className="text-emerald-300 font-semibold">Unlimited</span>
                ) : (
                  <>
                    <span className={(subscriptionStatus.remainingScans ?? 0) > 0 ? "text-emerald-300 font-semibold" : "text-white/70 font-semibold"}>
                      {subscriptionStatus.remainingScans ?? 0}
                    </span>
                    <span className="text-white/50 px-1">left of</span>
                    <span className="text-white/70">
                      {subscriptionStatus.totalScans || (subscriptionStatus.plan === 'starter' ? 3 : 1)}
                    </span>
                  </>
                )}
              </div>
            ) : null}

            {/* View My Projects Button */}
            <button
              onClick={() => navigate("/projects/my-projects")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 hover:border-[#FD7EFF]/30 transition-all duration-300"
            >
              <ExternalLink size={16} />
              View My Projects
            </button>
          </div>
        </div>

        <div className="bg-[#000124] border border-[#2A2355] rounded-3xl shadow-[0_0_40px_0_#A855F733] p-6 md:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <p className="text-white urbanist text-lg font-semibold">
                What would you like to scan?
              </p>
              <p className="text-white/60 text-sm">
                Pick a scan profile to tailor vulnerability checks.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/70">Online · Ready to scan</span>
            </div>
          </div>

          <ScanTypeToggle value={scanType} onChange={setScanType} />

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-white/70 flex items-center gap-2">
                <Link2 size={16} /> Repository URL
              </label>
              <input
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setUploadPath(undefined);
                  setUploadName(undefined);
                  setSuccess(undefined);
                }}
                placeholder="https://github.com/username/repository"
                className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-full px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-[#FD7EFF] focus:outline-none"
              />
              <p className="text-xs text-white/60">
                Paste a direct repository URL to scan the latest code.
              </p>
            </div>

            <div className="flex items-center gap-3 text-white/50 text-sm">
              <div className="flex-1 h-px bg-white/10" />
              <span>OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="rounded-2xl border border-dashed border-white/15 bg-[#000124]/50 p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FD7EFF]/20 flex items-center justify-center">
                    <Github className="text-[#FFC2C8]" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {githubStatus?.connected
                        ? `Connected as ${githubStatus.username}`
                        : "Connect GitHub to Select Repositories"}
                    </p>
                    <p className="text-sm text-white/60">
                      {githubStatus?.connected
                        ? "Select a repository from the list below"
                        : "Connect your GitHub account to easily select repositories"}
                    </p>
                  </div>
                </div>
                {!githubStatus?.connected && (
                  <button
                    type="button"
                    onClick={() => connectGithub()}
                    className="rounded-full bg-black/20 border border-[#FD7EFF] px-4 py-2 text-sm font-semibold hover:border-[#FD7EFF]/70 transition"
                  >
                    Connect GitHub
                  </button>
                )}
              </div>

              {githubStatus?.connected && (
                <div className="w-full relative">
                  {isLoadingRepos ? (
                    <div className="flex items-center gap-2 text-sm text-white/60 py-2">
                      <Loader2 size={14} className="animate-spin" />
                      Loading repositories...
                    </div>
                  ) : reposError ? (
                    <div className="text-sm text-red-400 py-2">
                      Failed to load repositories. Please try reconnecting.
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                        className={[
                          "w-full flex items-center justify-between",
                          "bg-[#3838381A] border border-[#ffffff66] rounded-xl px-4 py-3",
                          "text-white text-left transition-all",
                          "hover:border-[#FD7EFF]/50 focus:border-[#FD7EFF] focus:outline-none",
                        ].join(" ")}
                      >
                        <span className={repoUrl ? "text-white" : "text-white/50"}>
                          {repoUrl
                            ? repos?.find((r) => r.html_url === repoUrl)?.full_name || repoUrl
                            : "Select a repository..."}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-white/50 transition-transform ${isRepoDropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isRepoDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0A0A0A] border border-[#ffffff33] rounded-xl shadow-xl overflow-hidden max-h-[300px] flex flex-col backdrop-blur-xl">
                          {/* Search Input */}
                          <div className="p-3 border-b border-white/10 sticky top-0 bg-[#0A0A0A] z-10">
                            <div className="relative">
                              <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                              />
                              <input
                                autoFocus
                                type="text"
                                placeholder="Search repositories..."
                                value={repoSearchTerm}
                                onChange={(e) => setRepoSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FD7EFF]/50"
                              />
                            </div>
                          </div>

                          {/* Repository List */}
                          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
                            {repos
                              ?.filter((r) =>
                                r.full_name.toLowerCase().includes(repoSearchTerm.toLowerCase())
                              )
                              .map((repo) => (
                                <button
                                  key={repo.id}
                                  type="button"
                                  onClick={() => {
                                    setRepoUrl(repo.html_url);
                                    setUploadPath(undefined);
                                    setUploadName(undefined);
                                    setSuccess(undefined);
                                    setIsRepoDropdownOpen(false);
                                    setRepoSearchTerm("");
                                  }}
                                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 flex items-center justify-between group transition-colors"
                                >
                                  <span className="text-sm text-white/80 group-hover:text-white truncate mr-2">
                                    {repo.full_name}
                                  </span>
                                  {repo.private ? (
                                    <Lock size={12} className="text-white/40 shrink-0" />
                                  ) : (
                                    <Globe size={12} className="text-white/40 shrink-0" />
                                  )}
                                </button>
                              ))}
                            {repos?.filter((r) =>
                              r.full_name.toLowerCase().includes(repoSearchTerm.toLowerCase())
                            ).length === 0 && (
                                <div className="px-4 py-3 text-center text-sm text-white/40">
                                  No repositories found
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-white/50 text-sm">
              <div className="flex-1 h-px bg-white/10" />
              <span>OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-2xl border border-dashed border-white/15 bg-[#000124]/50 p-6 text-center cursor-pointer hover:border-[#FD7EFF]/50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Upload className="text-white" size={22} />
                </div>
                <p className="text-lg font-semibold">Upload Repository (.zip)</p>
                <p className="text-sm text-white/60">
                  Click to upload or drag and drop — ZIP files only (max {MAX_FILE_SIZE_MB}MB)
                </p>
                {uploadName && (
                  <div className="mt-2 text-sm text-emerald-300">
                    <p>{uploadName} uploaded and ready.</p>

                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border flex justify-between items-center border-red-400/40 bg-red-400/10 px-4 py-3">
                <p className="text-red-200 text-sm">{error}</p>
                {showUpgradeButton && (
                  <button
                    onClick={() => navigate("/pricing")}
                    className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[linear-gradient(90deg,#FFC857_0%,#FF8A3C_35%,#FF3EC4_80%,#FF0040_100%)] text-[#333333] text-sm font-semibold hover:opacity-90 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,64,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    View Pricing Plans
                  </button>
                )}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 text-emerald-100 px-4 py-3 text-sm">
                {success}
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleScanStart}
              className={[
                "w-full rounded-full px-6 py-3 font-semibold flex items-center justify-center gap-2",
                "bg-[linear-gradient(90deg,#FFC857_0%,#FF8A3C_35%,#FF3EC4_80%,#FF0040_100%)] text-[#333333]",
                "shadow-[0_0_10px_rgba(255,0,64,0.35)]",
                "transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
              ].join(" ")}
              style={{
                border: "1px solid",
                borderImage:
                  "linear-gradient(94.22deg, rgba(26,26,26,0.6) 1.22%, rgba(26,26,26,0.6) 1.22%, rgba(26,26,26,0) 90.07%, rgba(26,26,26,0) 90.07%) 1",
              }}
            >
              {isSubmitting ? "Processing..." : "Start Security Scan"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <FeatureHighlights />
      </section>

      {/* Scan Configuration Modal */}
      <ScanModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
        initialProjectName={getInitialProjectName()}
      />
    </main>
  );
};

export default Scanner;
