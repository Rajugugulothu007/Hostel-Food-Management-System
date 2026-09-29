import { useAuthStore } from "../../store/authStore";
import QrDisplay from "../../components/qr/QrDisplay";
import { Info, Maximize2 } from "lucide-react";
import { useState } from "react";

export default function MyQrPage() {
  const { user } = useAuthStore();
  const [fullscreen, setFullscreen] = useState(false);

  // In MVP, studentId is derived from username hash (matches backend)
  // Real version would fetch student record by username
  const studentId = user?.username
    ? Math.abs(
        user.username.split("").reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)
      )
    : 1;

  const demoStudentId = 1; // For testing — use real one later

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-900">Your Mess QR</h2>
        <p className="text-xs text-slate-500 mt-1">
          Show this at the counter to check in
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <QrDisplay studentId={demoStudentId} size={260} />

        <button
          onClick={() => setFullscreen(true)}
          className="flex items-center gap-2 text-xs text-teal hover:underline"
        >
          <Maximize2 size={14} /> Show fullscreen
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-teal/5 border border-teal/20 flex items-start gap-3">
        <Info size={18} className="text-teal flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-teal-900">How it works</p>
          <p className="text-xs text-teal-800 mt-1">
            Show this QR at the mess counter. The admin scans it to record your
            meal. No QR = no meal counted.
          </p>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center p-6"
          onClick={() => setFullscreen(false)}
        >
          <div className="bg-white p-6 rounded-3xl">
            <QrDisplay studentId={demoStudentId} size={320} />
            <p className="text-center text-xs text-slate-500 mt-3">
              Tap anywhere to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}