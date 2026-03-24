import { ChevronDown } from "lucide-react";
import { useState } from "react";

type InviteInlineProps = {
  onInvite?: (email: string, role: string) => void;
};

export default function InviteInline({ onInvite }: InviteInlineProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  const handleInvite = () => {
    if (email.trim() && onInvite) {
      onInvite(email.trim(), role);
      setEmail(""); // Clear input after invite
      setRole("viewer"); // Reset to default
    }
  };

  return (
    <div className="mt-5 w-full">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 w-full">
          <label className="text-white jakarta text-[16px] font-medium font-plus-jakarta-sans">Email</label>
          <div className="mt-3 rounded-full flex h-12 w-full items-center gap-3 bg-[#0B0730] border border-[#3B2A5E] shadow-[0_0_10px_0_#A855F720]">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              className="w-full jakarta bg-transparent rounded-full px-4 outline-none text-white placeholder:text-[#A19DAF] text-[14px] font-plus-jakarta-sans"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:items-end pb-0.5">
          <div className="relative shrink-0">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-12 jakarta w-[110px] sm:w-[130px] rounded-[72px] pl-4 pr-9 bg-[#0B0730] border border-[#FD7EFF] text-white text-[14px] font-plus-jakarta-sans outline-none appearance-none cursor-pointer"
            >
              <option className="bg-[#0B0730]" value="viewer">Viewer</option>
              <option className="bg-[#0B0730]" value="editor">Editor</option>
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/80" />
          </div>

          <button
            onClick={handleInvite}
            disabled={!email.trim()}
            className="jakarta h-12 rounded-[72px] px-6 sm:px-8 bg-[linear-gradient(90deg,#FFC857_0%,#FF8A3C_35%,#FF3EC4_80%,#FF0040_100%)] text-[#333333] text-sm font-medium font-plus-jakarta-sans shrink-0 transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_10px_rgba(255,0,64,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
}
