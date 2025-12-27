import React from "react";
import { CheckCircle2, Trophy } from "lucide-react";
import {
  useMarkNotificationRead,
  useNotifications,
} from "../../hooks/api/useNotifications";

export default function InfoPanelMissions(): React.ReactElement {
  const { data, isLoading } = useNotifications({ category: "mission", limit: 3 });
  const markRead = useMarkNotificationRead();

  return (
    <div style={{ boxShadow: "0px 0px 40px 0px #A855F733" }} className="bg-[#000124] rounded-2xl p-7 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Trophy size={16} color="#EC4899" />
        <h2 className="anybody  text-lg inter font-medium text-white">Active Missions</h2>
      </div>
      <p className="alexandria text-xs text-[#90A1B9] -mt-3">Complete tasks to boost your scores</p>

      <div className="flex flex-col gap-3">
        {isLoading && <p className="text-sm text-white/70">Loading…</p>}
        {data?.notifications.map((m) => (
          <div key={m.id} className="bg-[#010024] border border-[#EC489926] rounded-2xl p-3.5 flex flex-col gap-2">
            <p className="alexandria inter text-sm text-white">{m.title}</p>
            <p className="alexandria text-xs text-[#90A1B9]">{m.message}</p>
            <div className="flex justify-between items-center">
              <button
                className="jakarta bg-linear-to-br from-violet-500 to-indigo-500 text-white text-xs px-2 py-1 cursor-pointer rounded shadow-[0px_0px_18.77px_0px_#8B5CF6A6] whitespace-nowrap"
                onClick={() => markRead.mutate(m.id)}
              >
                Mark done
              </button>
              <span className="urbanist text-xs text-[#10B981] flex items-center gap-1">
                <CheckCircle2 size={14} />
                {m.read ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        ))}

        {!isLoading && data?.notifications.length === 0 && (
          <p className="text-sm text-white/70">No missions assigned.</p>
        )}
      </div>
    </div>
  );
}
