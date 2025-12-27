import { User } from "lucide-react";

export type RoleType = "Owner" | "Editor" | "Viewer";

type MemberRowProps = {
  name: string;
  email: string;
  role?: RoleType;
  avatarUrl?: string;
  onRemove?: () => void;
};

export default function MemberRow({ name, email, role = "Viewer", avatarUrl, onRemove }: MemberRowProps) {
  const isOwner = role === "Owner";
  return (
    <div className="relative my-3 rounded-2xl overflow-hidden bg-[#000027]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-4 sm:gap-2">
        <div className="flex items-center gap-4">
          <div className="p-0.5 rounded-full bg-linear-to-br from-fuchsia-400 via-pink-400 to-sky-400">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-[#000027] grid place-items-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                <User size={18} className="text-white/80" />
              )}
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <p className="alexandria text-white text-[16px] font-medium font-alexandria leading-tight truncate">{name}</p>
            <span className="urbanist text-white/60 text-sm font-urbanist leading-tight truncate">{email}</span>
          </div>
        </div>

        <div className="flex cursor-pointer items-center gap-3 shrink-0">
          <span className="urbanist inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold font-urbanist text-white shadow-[0_6px_24px_rgba(196,58,255,0.25)] bg-linear-to-r from-[#DF46F2] to-[#A501FF]">
            {role}
          </span>

          {!isOwner && onRemove && (
            <button
              onClick={onRemove}
              className="jakarta h-9 px-4 rounded-full text-sm cursor-pointer font-plus-jakarta-sans text-white/80 hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-[#FD7EFF]"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-fuchsia-400 via-white/50 to-sky-400 opacity-80" />
    </div>
  );
}
