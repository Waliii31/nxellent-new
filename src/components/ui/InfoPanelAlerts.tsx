import React from "react";
import { Check, TriangleAlert } from "lucide-react";
import {
  useMarkNotificationRead,
  useNotifications,
} from "../../hooks/api/useNotifications";

const badgeColor: Record<string, string> = {
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  success: "#22C55E",
};

export default function InfoPanelAlerts(): React.ReactElement {
  const { data, isLoading, isError } = useNotifications({ limit: 3 });
  const markRead = useMarkNotificationRead();

  return (
    <div style={{ boxShadow: "0px 0px 40px 0px #A855F733" }} className="bg-[#000124] rounded-2xl p-7 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <TriangleAlert size={16} color="#F59E0B" />
        <h2 className="anybody  text-lg font-medium inter text-white">Recent Alerts</h2>
      </div>

      {isLoading && (
        <p className="text-sm text-white/70">Loading notifications…</p>
      )}
      {isError && (
        <p className="text-sm text-red-300">Failed to fetch alerts.</p>
      )}

      <div className="flex flex-col gap-3">
        {data?.notifications.map((notification) => {
          const color = badgeColor[notification.type] ?? "#3B82F6";
          return (
            <div
              key={notification.id}
              className="bg-[#010024] border border-[#EC489926] rounded-2xl flex items-stretch overflow-hidden"
            >
              <div
                className="w-1 shrink-0 opacity-60"
                style={{ backgroundColor: color, boxShadow: color }}
              ></div>
              <div className="p-3.5 flex items-start gap-2 flex-1">
                <TriangleAlert size={16} color={color} />
                <div className="flex-1">
                  <p className="alexandria inter text-sm text-white">{notification.title}</p>
                  <p className="alexandria text-xs text-[#90A1B9] mt-1">{notification.message}</p>
                  <p className="alexandria text-xs text-slate-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    type="button"
                    className="text-xs text-[#22C55E] hover:text-white flex items-center gap-1"
                    onClick={() => markRead.mutate(notification.id)}
                  >
                    <Check size={14} /> Mark read
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!isLoading && !isError && data?.notifications.length === 0 && (
          <p className="text-sm text-white/70">No alerts yet.</p>
        )}
      </div>
    </div>
  );
}
