import { useState, useEffect } from "react";
import { Trash2, Plus, Play, Github, ChevronDown, Search, Lock, Globe, Loader2 } from "lucide-react";
import Navbar from "../components/sections/Navbar";
import GlowCard from "../components/ui/GlowCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useGithubStatus, useGithubRepositories } from "../hooks/api/useGithub";
import { connectGithub } from "../services/authService";
import { useInitiateBatchScan } from "../hooks/api/useBatchScans";
import type { BatchScanItemDto } from "../types/batch";
import { useNavigate } from "react-router-dom";

type ScanType = "Contract Scan" | "App Scan";

interface BatchItem {
    id: number;
    url: string;
    type: ScanType;
    isOpen?: boolean; // For dropdown state
}

export default function BatchScanner() {
    const [items, setItems] = useState<BatchItem[]>([
        { id: 1, url: "", type: "Contract Scan", isOpen: false },
    ]);
    const [repoSearchTerm, setRepoSearchTerm] = useState("");

    // GitHub Integration
    const { data: githubStatus } = useGithubStatus();
    const { data: repos, isLoading: isLoadingRepos } = useGithubRepositories(!!githubStatus?.connected);

    const initiateBatchScan = useInitiateBatchScan();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setItems(prev => prev.map(i => ({ ...i, isOpen: false })));
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            { id: Math.max(...prev.map((i) => i.id), 0) + 1, url: "", type: "Contract Scan", isOpen: false },
        ]);
    };

    const removeItem = (id: number) => {
        if (items.length === 1) return;
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateItem = (id: number, field: keyof BatchItem, value: unknown) => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
        );
    };

    const toggleDropdown = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setItems(prev => prev.map(i => ({ ...i, isOpen: i.id === id ? !i.isOpen : false })));
    };

    const handleScan = async () => {
        setError(undefined);
        setSuccess(undefined);

        // Validate items
        const validItems = items.filter(i => i.url.trim() !== "");
        if (validItems.length === 0) {
            setError("Please add at least one repository URL.");
            return;
        }

        setIsSubmitting(true);

        try {
            const batchPayload: BatchScanItemDto[] = validItems.map(item => {
                const trimmedUrl = item.url.trim();

                // Extract project name from URL
                let projectName = "Batch Project";
                const match = trimmedUrl.match(new RegExp("github\\.com/[^/]+/([^/.]+)"));
                if (match && match[1]) {
                    projectName = match[1].replace(/[_-]/g, " ");
                }

                const isContract = item.type === "Contract Scan";

                return {
                    scanType: (isContract ? "contract" : "application") as "contract" | "application",
                    repoUrl: trimmedUrl,
                    // sourceType: "url", // Removed based on backend validation error
                    projectName,
                    projectDescription: "Batch scan import",
                    // projectVisibility: "private", // Removed based on backend validation error
                };
            });

            // Use the batch API
            await initiateBatchScan.mutateAsync({ scans: batchPayload });

            setSuccess(`Successfully initiated batch scans for ${validItems.length} repositories.`);
            setTimeout(() => {
                navigate("/projects/my-projects");
            }, 2000);

        } catch (e: unknown) {
            const err = e as { response?: { data?: { message?: string } }; message?: string };
            setError(err?.response?.data?.message || err.message || "An unexpected error occurred during batch processing.");
            setIsSubmitting(false);
        }
    };

    const filteredRepos = repos?.filter(r =>
        r.full_name.toLowerCase().includes(repoSearchTerm.toLowerCase())
    );

    return (
        <main
            className="min-h-screen w-full"
            style={{
                background: "url(/auth-page.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Navbar isFixed={false} />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="urbanist text-3xl font-bold text-white mb-2">Batch Scanner</h1>
                    <p className="inter text-white/60">
                        Queue multiple scans at once for efficient processing.
                    </p>
                    {error && (
                        <div className="mt-4 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-red-200 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-emerald-100 text-sm">
                            {success}
                        </div>
                    )}
                </div>

                <GlowCard className="p-8 overflow-visible!">
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <span className="text-white/40 w-6 text-right font-mono hidden md:block">{index + 1}.</span>

                                {/* Repo Input / Selector */}
                                <div className="flex-1 w-full relative">
                                    <div className="flex items-center gap-2 bg-[#0B0730] border border-[#3B2A5E] rounded-lg px-3 h-12 focus-within:border-[#A855F7] transition-colors w-full relative z-10">
                                        {githubStatus?.connected && (
                                            <button
                                                type="button"
                                                onClick={(e) => toggleDropdown(e, item.id)}
                                                className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors z-20 relative"
                                                title="Select from GitHub"
                                            >
                                                <Github size={18} />
                                            </button>
                                        )}
                                        <input
                                            type="text"
                                            value={item.url}
                                            onChange={(e) => updateItem(item.id, "url", e.target.value)}
                                            placeholder="https://github.com/username/repo"
                                            className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/20 text-sm z-10"
                                        />
                                        {githubStatus?.connected && (
                                            <button
                                                type="button"
                                                onClick={(e) => toggleDropdown(e, item.id)}
                                                className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer z-20 relative"
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform ${item.isOpen ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdown */}
                                    {item.isOpen && githubStatus?.connected && (
                                        <div
                                            className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0A0A0A] border border-[#ffffff33] rounded-xl shadow-xl overflow-hidden max-h-[300px] flex flex-col backdrop-blur-xl"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="p-3 border-b border-white/10 sticky top-0 bg-[#0A0A0A] z-10">
                                                <div className="relative">
                                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
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
                                            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
                                                {isLoadingRepos ? (
                                                    <div className="flex items-center justify-center py-4 text-white/60 gap-2">
                                                        <Loader2 size={16} className="animate-spin" />
                                                        <span className="text-sm">Loading...</span>
                                                    </div>
                                                ) : (
                                                    filteredRepos?.map(repo => (
                                                        <button
                                                            key={repo.id}
                                                            onClick={() => {
                                                                updateItem(item.id, "url", repo.html_url);
                                                                updateItem(item.id, "isOpen", false);
                                                                setRepoSearchTerm("");
                                                            }}
                                                            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 flex items-center justify-between group transition-colors"
                                                        >
                                                            <span className="text-sm text-white/80 group-hover:text-white truncate mr-2">
                                                                {repo.full_name}
                                                            </span>
                                                            {repo.private ? <Lock size={12} className="text-white/40" /> : <Globe size={12} className="text-white/40" />}
                                                        </button>
                                                    ))
                                                )}
                                                {filteredRepos?.length === 0 && !isLoadingRepos && (
                                                    <div className="px-4 py-3 text-center text-sm text-white/40">No repositories found</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Type Selector */}
                                <div className="relative w-full md:w-auto">
                                    <select
                                        value={item.type}
                                        onChange={(e) => updateItem(item.id, "type", e.target.value as ScanType)}
                                        className="w-full md:w-auto appearance-none bg-[#0B0730] border border-[#3B2A5E] text-white px-4 py-3 pr-10 rounded-lg outline-none focus:border-[#A855F7] cursor-pointer min-w-40 text-sm"
                                    >
                                        <option value="Contract Scan">Contract Scan</option>
                                        <option value="App Scan">App Scan</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown size={14} className="text-white/60" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-3 text-white/40 hover:text-red-400 transition-colors bg-[#0B0730] border border-[#3B2A5E] rounded-lg hover:border-red-400/30"
                                    disabled={items.length === 1}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-white/10 gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={addItem}
                                className="flex items-center gap-2 text-[#A855F7] hover:text-[#C084FC] transition-colors font-medium text-sm"
                            >
                                <Plus size={18} />
                                Add another repository
                            </button>
                            {!githubStatus?.connected && (
                                <button
                                    onClick={() => connectGithub()}
                                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                                >
                                    <Github size={16} />
                                    Connect GitHub
                                </button>
                            )}
                        </div>

                        <PrimaryButton
                            onClick={handleScan}
                            moreClasses="!w-full md:!w-auto px-8"
                            disabled={isSubmitting}
                        >
                            <div className="flex items-center gap-2">
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                                {isSubmitting ? "Processing..." : "Start Batch Scan"}
                            </div>
                        </PrimaryButton>
                    </div>
                </GlowCard>
            </div>
        </main>
    );
}
