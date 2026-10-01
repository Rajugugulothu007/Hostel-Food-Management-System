import { useEffect, useState } from "react";
import {
  CheckSquare,
  Users,
  UtensilsCrossed,
  QrCode,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

import { attendanceApi } from "../../../api/attendanceApi";
import { userApi } from "../../../api/userApi";
import { menuApi } from "../../../api/menuApi";
import type { CheckInDTO, AttendanceSummaryDTO } from "../../../types/attendance";
import type { StudentDTO } from "../../../types/student";
import type { MenuItemDTO } from "../../../types/menu";
import { MEAL_TYPES } from "../../../types/menu";

import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Table, { type Column } from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import StatCard from "../../../components/common/StatCard";
import QrDisplay from "../../../components/qr/QrDisplay";

type Tab = "checkin" | "today" | "summary";

export default function AttendancePage() {
  const [tab, setTab] = useState<Tab>("checkin");
  const [checkIns, setCheckIns] = useState<CheckInDTO[]>([]);
  const [summary, setSummary] = useState<AttendanceSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [today, sum] = await Promise.all([
        attendanceApi.today(),
        attendanceApi.todaySummary(),
      ]);
      setCheckIns(today);
      setSummary(sum);
    } catch {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Track who checked in and how many meals were served"
      />

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {summary.map((s) => (
          <StatCard
            key={s.mealType}
            label={s.mealType.charAt(0) + s.mealType.slice(1).toLowerCase()}
            value={s.checkInCount}
            icon={UtensilsCrossed}
            color={
              s.mealType === "BREAKFAST"
                ? "amber"
                : s.mealType === "LUNCH"
                ? "blue"
                : "green"
            }
          />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "checkin" as Tab, label: "Check-In", icon: CheckSquare },
          { id: "today" as Tab, label: "Today's List", icon: Users },
          { id: "summary" as Tab, label: "Summary", icon: UtensilsCrossed },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t.id
                ? "bg-teal text-white shadow-md shadow-teal/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "checkin" && <CheckInTab onSuccess={loadAll} />}
      {tab === "today" && <TodayListTab checkIns={checkIns} loading={loading} />}
      {tab === "summary" && <SummaryTab summary={summary} />}
    </div>
  );
}

/* ---------------- CHECK-IN TAB ---------------- */

function CheckInTab({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"manual" | "qr">("manual");
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [menu, setMenu] = useState<MenuItemDTO[]>([]);
  const [studentId, setStudentId] = useState("");
  const [mealId, setMealId] = useState("");
  const [mealType, setMealType] = useState<string>("BREAKFAST");
  const [submitting, setSubmitting] = useState(false);
  const [qrStudentId, setQrStudentId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, m] = await Promise.all([userApi.list(), menuApi.list()]);
        setStudents(s);
        setMenu(m);
      } catch {
        /* silently ignore */
      }
    })();
  }, []);

  const filteredMenu = menu.filter((m) => m.mealType === mealType);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !mealId) {
      toast.error("Please select student and meal");
      return;
    }
    setSubmitting(true);
    try {
      await attendanceApi.checkIn({
        studentId: Number(studentId),
        mealId,
        mealType,
        counterId: 1,
      });
      toast.success("Check-in recorded!");
      setStudentId("");
      setMealId("");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Check-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            mode === "manual"
              ? "bg-teal text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setMode("qr")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            mode === "qr"
              ? "bg-teal text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          View QR
        </button>
      </div>

      {mode === "manual" ? (
        <form onSubmit={handleManualSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student *
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              required
            >
              <option value="">— Select student —</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Type *
            </label>
            <select
              value={mealType}
              onChange={(e) => {
                setMealType(e.target.value);
                setMealId("");
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
            >
              {MEAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menu Item *
            </label>
            <select
              value={mealId}
              onChange={(e) => setMealId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              required
            >
              <option value="">— Select item —</option>
              {filteredMenu.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.itemName}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" loading={submitting}>
            <CheckSquare size={16} /> Check In
          </Button>
        </form>
      ) : (
        <div className="space-y-4 max-w-lg">
          <p className="text-sm text-slate-500">
            Enter a student ID to view their personal QR code. In production
            (mobile app), the student shows this QR at the counter for scanning.
          </p>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Student ID"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQrStudentId(Number((e.target as HTMLInputElement).value));
                }
              }}
            />
            <Button
              onClick={(e) => {
                const input = (e.currentTarget.parentElement?.querySelector(
                  "input"
                ) as HTMLInputElement);
                if (input?.value) setQrStudentId(Number(input.value));
              }}
            >
              <QrCode size={16} /> Show
            </Button>
          </div>

          {qrStudentId && (
            <div className="flex flex-col items-center pt-4">
              <QrDisplay studentId={qrStudentId} size={260} />
              <p className="text-sm text-slate-500 mt-3">Student ID: {qrStudentId}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- TODAY LIST TAB ---------------- */

function TodayListTab({
  checkIns,
  loading,
}: {
  checkIns: CheckInDTO[];
  loading: boolean;
}) {
  const columns: Column<CheckInDTO>[] = [
    { header: "Student ID", accessor: "studentId" },
    { header: "Meal", accessor: "mealId" },
    {
      header: "Type",
      accessor: (c) => <Badge color="blue">{c.mealType}</Badge>,
    },
    {
      header: "Time",
      accessor: (c) =>
        new Date(c.checkInTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    { header: "Counter", accessor: (c) => c.counterId ?? "—" },
  ];

  if (loading) return <div className="text-slate-400 py-8">Loading...</div>;
  if (checkIns.length === 0)
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
        No check-ins yet today.
      </div>
    );

  return <Table columns={columns} data={checkIns} />;
}

/* ---------------- SUMMARY TAB ---------------- */

function SummaryTab({ summary }: { summary: AttendanceSummaryDTO[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Today's Summary</h3>
      <div className="space-y-4">
        {summary.map((s) => (
          <div
            key={s.mealType}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <UtensilsCrossed size={20} className="text-teal" />
              <span className="font-medium text-slate-800">
                {s.mealType.charAt(0) + s.mealType.slice(1).toLowerCase()}
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {s.checkInCount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}