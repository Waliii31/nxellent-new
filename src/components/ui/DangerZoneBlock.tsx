import { AlertTriangle, Trash2 } from "lucide-react";

export default function DangerZoneBlock() {
  return (
    <div className="col-span-full lg:col-span-2">
      <div className="relative rounded-2xl p-px bg-linear-to-br from-[#A855F780] via-[#8B5CF680] to-[#22D3EE80] shadow-[0_0_40px_0_rgba(168,85,247,0.55)]">
        <div className="rounded-2xl bg-[#0D0A2A] px-6 md:px-8 py-6 md:py-8">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-[#FF5C5C]" size={22} />
              <span className="urbanist text-[22px] md:text-[24px] font-anybody  font-semibold text-[#FF5C5C]">
                Danger Zone
              </span>
            </div>
            <p className="alexandria text-white/70 mt-1 font-alexandria">Irreversible and destructive actions</p>
          </div>

          <div className="relative mt-6 rounded-2xl bg-[#0B0A25] border border-[#2E2A55] px-5 md:px-6 py-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-white/70 mt-0.5 shrink-0" />
              <p className="alexandria text-[14px] text-white/80 font-alexandria">
                Deleting your project will permanently remove all scan history, reports, and team
                access. This action cannot be undone.
              </p>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-rrom-[#C084FC] via-[#98A2FF] to-[#22D3EE] opacity-60 rounded-b-2xl" />
          </div>

          <div className="mt-6 rounded-2xl border border-[#FF6B6B40] bg-linear-to-b from-[#2A0F19]/70 to-[#2A0F19]/30 px-5 md:px-6 py-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="alexandria text-[#FF6B6B] text-[18px] font-anybody ">Delete Project</p>
                <p className="alexandria text-white/70 text-sm font-alexandria">
                  Permanently delete this project and all associated data
                </p>
              </div>

              <button className="jakarta h-12 w-full md:w-auto px-5 md:px-6 rounded-full inline-flex items-center justify-center gap-2 text-white text-sm font-medium font-plus-jakarta-sans shrink-0 bg-linear-to-b from-[#F2533F] to-[#C7352B] shadow-[0_8px_24px_rgba(242,83,63,0.35)] hover:opacity-95 transition">
                <Trash2 size={18} className="text-white" />
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
