import { useEffect, useState } from "react";
import { Bell, Info, CheckCircle, AlertCircle, Megaphone } from "lucide-react";
import { notificationApi } from "../../api/notificationApi";
import type { NotificationDTO } from "../../types/notification";

const typeIcon = (type: string) => {
  if (type.includes("REMINDER")) return AlertCircle;
  if (type.includes("OPEN")) return Megaphone;
  if (type.includes("READY")) return CheckCircle;
  return Info;
};

const typeColor = (type: string) => {
  if (type.includes("REMINDER")) return "text-red-500 bg-red-50";
  if (type.includes("OPEN")) return "text-teal bg-teal/10";
  if (type.includes("READY")) return "text-green-500 bg-green-50";
  return "text-blue-500 bg-blue-50";
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setItems(await notificationApi.getMyNotifications());
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
        <p className="text-xs text-slate-500 mt-1">
          Reminders and updates from the hostel
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <Bell size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No notifications yet</p>
          <p className="text-xs text-slate-400 mt-1">
            You'll see reminders here when voting opens or food is ready
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items
            .slice()
            .reverse()
            .map((n) => {
              const Icon = typeIcon(n.type);
              const colorClasses = typeColor(n.type);

              return (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-start gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${colorClasses} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {new Date(n.sentAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}