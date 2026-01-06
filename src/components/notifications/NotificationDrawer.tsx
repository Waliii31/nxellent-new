import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  X,
  Bell,
  CheckCheck,
  Loader2,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useUnreadCount,
  useDeleteAllNotifications,
  useDeleteNotification,

  notificationsKey,
  unreadCountKey,
} from "../../hooks/api/useNotifications";
import { createNotificationsStream } from "../../utils/notificationsStream";
import { useQueryClient } from "@tanstack/react-query";
import {
  drawerOverlay,
  drawerPanel,
  staggerContainer,
  fadeInUp,
} from "../../animations";

type Props = {
  open: boolean;
  onClose: () => void;
};

const NOTIF_PARAMS = { limit: 20 } as const;

export default function NotificationDrawer({ open, onClose }: Props) {
  const token = useSelector((s: RootState) => s.auth.token);
  const qc = useQueryClient();

  // exact list key used by this drawer
  const listKey = notificationsKey(NOTIF_PARAMS);

  // Main notifications list
  const {
    data,
    isLoading,
    isError,
  } = useNotifications(NOTIF_PARAMS, {
    enabled: open && !!token,
    refetchInterval: false, // no polling, SSE will trigger refetch
    staleTime: 0,
    refetchOnMount: true,
  });

  // Unread count
  const {
    data: unreadData,
    isLoading: unreadLoading,
    isError: unreadError,
  } = useUnreadCount({ enabled: open && !!token });

  // Mutations
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteAll = useDeleteAllNotifications();
  const deleteOne = useDeleteNotification();


  useEffect(() => {
    if (!token) return;

    /**
     * SSE: whenever a notification arrives, just invalidate and refetch
     * the notifications list + unread count. No manual merging.
     */
    const es = createNotificationsStream(token, (newItem: any) => {
      // Show toast
      // Handle potential nested structures or direct object
      const notif = newItem?.data || newItem?.payload || newItem?.notification || newItem;

      if (notif && (notif.title || notif.message)) {
        toast((t) => (
          <div className="relative w-80 rounded-2xl bg-[#07051A]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden p-4 flex gap-4">
            {/* Gradient background effect */}
            <div className="absolute inset-0 bg-linear-to-br from-[#7A49F2]/10 via-transparent to-[#FD7EFF]/5 pointer-events-none" />

            {/* Left accent border */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-[#7A49F2] to-[#5FA8FF]" />

            {/* Icon */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-[#7A49F2] to-[#5FA8FF] p-px">
              <div className="w-full h-full rounded-xl bg-[#0B0B2A] flex items-center justify-center">
                <Bell size={18} className="text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 z-10 pt-0.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-white font-bold text-sm tracking-wide leading-tight">{notif.title || "New Notification"}</h4>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="shrink-0 text-white/40 hover:text-white transition-colors p-1 -mt-1 -mr-1 rounded-full hover:bg-white/10"
                >
                  <X size={14} />
                </button>
              </div>
              {notif.message && (
                <p className="text-white/70 text-xs mt-1.5 leading-relaxed font-medium">
                  {notif.message}
                </p>
              )}
            </div>
          </div>
        ));
      }

      // Refetch list
      qc.invalidateQueries({ queryKey: listKey, refetchType: "active" });

      // Refetch unread count
      qc.invalidateQueries({
        queryKey: unreadCountKey,
        refetchType: "active",
      });
    });

    return () => es.close();
  }, [token, qc, listKey]);

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleMarkAll = () => {
    if (!data?.notifications?.length) return;
    markAllRead.mutate();
  };

  const handleDelete = (id: string) => {
    deleteOne.mutate(id);
  };

  const handleDeleteAll = () => {
    if (!data?.notifications?.length) return;
    deleteAll.mutate();
  };



  const unreadCount = unreadData?.count ?? 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="notif-overlay"
          className="fixed inset-0 z-120000"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={drawerOverlay}
          onClick={onClose}
        >
          <motion.aside
            key="notif-panel"
            className="absolute top-0 right-0 h-full w-full max-w-md bg-[#07051A] text-white shadow-2xl"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerPanel}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Border Left Edge */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-linear-to-brom-[#D467B9] via-[#5FA8FF] to-[#D467B9]" />

            {/* Header */}
            <div className="relative px-6 py-6 border-b border-white/10">
              {/* Close Button - Top Right */}
              <button
                aria-label="Close notifications"
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:border-[#FD7EFF]/50"
              >
                <X size={20} />
              </button>

              {/* Title Section */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-linear-to-br from-[#D467B9]/20 to-[#5FA8FF]/20 border border-[#FD7EFF]/30">
                  <Bell size={24} className="text-[#FFC2C8]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold anybody">Notifications</h2>
                  <p className="text-sm text-white/60 urbanist">
                    Stay updated with your activity
                  </p>
                </div>
              </div>

              {/* Unread Count Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                {unreadLoading ? (
                  <span className="flex items-center gap-2 text-sm text-white/70">
                    <Loader2 size={14} className="animate-spin" />
                    Loading...
                  </span>
                ) : unreadError ? (
                  <span className="text-sm text-red-400">
                    Error loading count
                  </span>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#FFC2C8] animate-pulse" />
                    <span className="text-sm font-medium urbanist">
                      {unreadCount} unread notification
                      {unreadCount !== 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleMarkAll}
                  disabled={!data?.notifications?.length}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 hover:border-[#FD7EFF]/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
                >
                  <CheckCheck size={16} />
                  Mark all read
                </button>

                <button
                  onClick={handleDeleteAll}
                  disabled={!data?.notifications?.length}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/80 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
                >
                  <Trash2 size={16} />
                  Clear all
                </button>
              </div>
            </div>

            {/* Body */}
            <motion.div
              className="px-6 py-4 space-y-4 overflow-y-auto h-[calc(100%-280px)]"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Status Info */}
              <motion.div
                className="flex items-center justify-between text-xs text-white/50 urbanist"
                variants={fadeInUp}
              >
                <p>
                  {isLoading
                    ? "Fetching your latest notifications..."
                    : isError
                      ? "Error loading notifications"
                      : data?.total
                        ? `Showing ${data.notifications.length} of ${data.total} notifications`
                        : "No notifications yet"}
                </p>
              </motion.div>

              {/* Loading state */}
              {isLoading && !isError && (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 gap-3"
                  variants={fadeInUp}
                >
                  <Loader2 size={32} className="animate-spin text-[#FFC2C8]" />
                  <p className="text-sm text-white/60">
                    Loading notifications...
                  </p>
                </motion.div>
              )}

              {/* Error state */}
              {isError && (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 gap-3"
                  variants={fadeInUp}
                >
                  <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30">
                    <X size={32} className="text-red-400" />
                  </div>
                  <p className="text-sm text-red-400 font-medium">
                    Failed to load notifications
                  </p>
                  <p className="text-xs text-white/50">
                    Please try again later
                  </p>
                </motion.div>
              )}

              {/* Empty state */}
              {!isLoading &&
                !isError &&
                data?.notifications.length === 0 && (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12 gap-4"
                    variants={fadeInUp}
                  >
                    <div className="p-5 rounded-2xl bg-linear-to-br from-[#D467B9]/10 to-[#5FA8FF]/10 border border-white/10">
                      <Bell size={48} className="text-white/30" />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-semibold text-white/80 mb-1">
                        All caught up!
                      </p>
                      <p className="text-sm text-white/50">
                        No new notifications right now
                      </p>
                    </div>
                  </motion.div>
                )}

              {/* Notification List */}
              {!isError &&
                data?.notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    className="relative group"
                    variants={fadeInUp}
                    layout
                  >
                    {/* Gradient Border Wrapper */}
                    <div
                      className={`rounded - 2xl p - px transition - all duration - 300 ${n.read
                        ? "bg-white/10"
                        : "bg-linear-to-br from-[#D467B9]/50 via-[#5FA8FF]/50 to-[#D467B9]/50"
                        } `}
                    >
                      <div
                        className={`rounded - 2xl p - 4 bg - [#0d0b1d] backdrop - blur - sm flex flex - col gap - 3 transition - all duration - 300 ${n.read ? "opacity-60" : ""
                          } `}
                      >
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-[#FFC2C8]" />
                              )}
                              <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold urbanist">
                                {n.category ?? "general"}
                              </p>
                            </div>
                            <p className="font-bold text-base text-white anybody">
                              {n.title}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(n.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 transition-all duration-300"
                            aria-label="Delete notification"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Message */}
                        <p className="text-sm text-white/70 leading-relaxed urbanist">
                          {n.message}
                        </p>

                        {/* Mark Read Button */}
                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className="self-start px-4 py-2 rounded-lg bg-white/5 border border-[#FD7EFF]/30 text-xs font-medium text-[#FFC2C8] hover:bg-[#FD7EFF]/10 hover:border-[#FD7EFF]/50 transition-all duration-300"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </motion.aside >
        </motion.div >
      )}
    </AnimatePresence >
  );
}
