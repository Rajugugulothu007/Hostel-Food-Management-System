import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { attendanceApi } from "../../api/attendanceApi";

interface Props {
  studentId: number;
  size?: number;
}

export default function QrDisplay({ studentId, size = 220 }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;

    (async () => {
      try {
        const blob = await attendanceApi.getQrBlob(studentId);
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch {
        setError(true);
      }
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [studentId]);

  if (error) {
    return (
      <div className="flex flex-col items-center text-slate-400 py-8">
        <QrCode size={40} />
        <p className="text-sm mt-2">QR unavailable</p>
      </div>
    );
  }

  if (!url) {
    return (
      <div
        className="animate-pulse bg-slate-100 rounded-xl"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
      <img
        src={url}
        alt={`QR for student ${studentId}`}
        style={{ width: size, height: size }}
      />
    </div>
  );
}