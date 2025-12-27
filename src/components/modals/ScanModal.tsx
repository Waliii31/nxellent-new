import React, { useState, useEffect } from "react";
import { X, Lock, Globe, Zap } from "lucide-react";

type ScanModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { projectName: string; description: string; visibility: "private" | "public" }) => void;
    isSubmitting?: boolean;
    initialProjectName?: string; // Auto-populated from ZIP/GitHub/Repo
};

const ScanModal: React.FC<ScanModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialProjectName = ""
}) => {
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<"private" | "public">("private");

    // Auto-populate project name when modal opens with initial value
    useEffect(() => {
        if (isOpen && initialProjectName) {
            setProjectName(initialProjectName);
        }
    }, [isOpen, initialProjectName]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;
        onSubmit({ projectName: projectName.trim(), description: description.trim(), visibility });
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setProjectName("");
            setDescription("");
            setVisibility("private");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="relative w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Card with Gradient Border */}
                <div className="rounded-3xl p-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)]">
                    <div className="rounded-3xl bg-[#07051A] px-6 py-8 shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)]">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={18} className="text-white/70" />
                        </button>

                        {/* Title */}
                        <h2 className="anybody text-2xl font-bold text-white mb-6">
                            Create New Project
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Project Name <span className="text-[#FD7EFF]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Your Project Name..."
                                    disabled={isSubmitting}
                                    className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-2xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-[#FD7EFF] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Description <span className="text-white/40">(optional)</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter project description"
                                    disabled={isSubmitting}
                                    rows={3}
                                    className="w-full bg-[#3838381A] border border-[#ffffff66] rounded-2xl px-4 py-3 text-white placeholder:text-[#A19DAF] focus:border-[#FD7EFF] focus:outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Visibility */}
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-3">
                                    Visibility
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Private Button */}
                                    <button
                                        type="button"
                                        onClick={() => setVisibility("private")}
                                        disabled={isSubmitting}
                                        className={[
                                            "relative rounded-2xl border transition-all p-4 text-left",
                                            visibility === "private"
                                                ? "bg-[#FD7EFF]/20 border-[#FD7EFF] shadow-[0_0_20px_0_#FD7EFF33]"
                                                : "bg-[#000124]/60 border-white/10 hover:border-[#FD7EFF]/50",
                                            isSubmitting && "opacity-50 cursor-not-allowed"
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Lock size={16} className={visibility === "private" ? "text-[#FFC2C8]" : "text-white/70"} />
                                            <span className={`urbanist font-semibold text-sm ${visibility === "private" ? "text-white" : "text-white/80"}`}>
                                                Private
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/60">
                                            Only visible to you and your team
                                        </p>
                                    </button>

                                    {/* Public Button */}
                                    <button
                                        type="button"
                                        onClick={() => setVisibility("public")}
                                        disabled={isSubmitting}
                                        className={[
                                            "relative rounded-2xl border transition-all p-4 text-left",
                                            visibility === "public"
                                                ? "bg-[#FD7EFF]/20 border-[#FD7EFF] shadow-[0_0_20px_0_#FD7EFF33]"
                                                : "bg-[#000124]/60 border-white/10 hover:border-[#FD7EFF]/50",
                                            isSubmitting && "opacity-50 cursor-not-allowed"
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Globe size={16} className={visibility === "public" ? "text-[#FFC2C8]" : "text-white/70"} />
                                            <span className={`urbanist font-semibold text-sm ${visibility === "public" ? "text-white" : "text-white/80"}`}>
                                                Public
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/60">
                                            Visible on leaderboard
                                        </p>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 rounded-full border border-white/20 text-white/80 font-semibold hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !projectName.trim()}
                                    className="flex-1 px-6 py-3 rounded-full bg-[#FFC2C8] text-[#1A1A1A] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_0_#FFC2C833]"
                                >
                                    {isSubmitting ? (
                                        "Starting..."
                                    ) : (
                                        <>
                                            <Zap size={16} />
                                            Create & Start Scan
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanModal;
