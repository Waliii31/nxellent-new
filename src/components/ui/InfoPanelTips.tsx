import React from "react";
import { Shield } from "lucide-react";
import { useHealthStatus } from "../../hooks/api/useHealth";

export default function InfoPanelTips(): React.ReactElement {
  const { data, isLoading, isError } = useHealthStatus();

  return (
    <div style={{ boxShadow: "0px 0px 40px 0px #A855F733" }} className="bg-[#000124] rounded-2xl p-7 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Shield size={16} color="#3B82F6" />
        <h2 className="anybody  text-lg font-medium inter text-white">Security Tips</h2>
      </div>

      {isLoading && <p className="text-sm text-white/70">Checking system health…</p>}
      {isError && <p className="text-sm text-red-300">Unable to reach health API.</p>}

      <div className="flex flex-col gap-3">
        {data && (
          <div className="bg-[#010024] border border-[#EC489926] rounded-2xl p-3.5">
            <p className="alexandria inter text-sm text-white">Environment</p>
            <p className="alexandria text-xs text-[#90A1B9] mt-1">
              {data.environment} • Uptime: {Math.round(data.uptime / 3600)}h • DB: {data.database}
            </p>
          </div>
        )}

        <div className="bg-[#010024] border border-[#EC489926] rounded-2xl p-3.5">
          <p className="alexandria inter text-sm text-white">Regular Scanning</p>
          <p className="alexandria text-xs text-[#90A1B9] mt-1">Schedule scans based on your uptime window to avoid traffic spikes.</p>
        </div>
        <div className="bg-[#010024] border border-[#EC489926] rounded-2xl p-3.5">
          <p className="alexandria inter text-sm text-white">Public vs Private</p>
          <p className="alexandria text-xs text-[#90A1B9] mt-1">Public projects help build trust with investors and users.</p>
        </div>
        <div className="bg-[#010024] border border-[#EC489926] rounded-2xl p-3.5">
          <p className="alexandria inter text-sm text-white">Score Tracking</p>
          <p className="alexandria text-xs text-[#90A1B9] mt-1">Monitor score changes to identify security regressions.</p>
        </div>
      </div>
    </div>
  );
}
