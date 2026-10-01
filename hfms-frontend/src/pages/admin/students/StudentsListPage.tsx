import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Pencil, Trash2, Search, Home, Bus } from "lucide-react";
import toast from "react-hot-toast";

import { userApi } from "../../../api/userApi";
import type { StudentDTO, StudentType } from "../../../types/student";
import { STUDENT_TYPES } from "../../../types/student";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Table, { type Column } from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import EmptyState from "../../../components/common/EmptyState";

export default function StudentsListPage() {
  const [tab, setTab] = useState<StudentType>("HOSTELLER");
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [counts, setCounts] = useState<Record<StudentType, number>>({
    HOSTELLER: 0,
    DAY_SCHOLAR: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [hostellers, dayScholars] = await Promise.all([
        userApi.list("HOSTELLER"),
        userApi.list("DAY_SCHOLAR"),
      ]);

      setCounts({
        HOSTELLER: hostellers.length,
        DAY_SCHOLAR: dayScholars.length,
      });

      setStudents(tab === "HOSTELLER" ? hostellers : dayScholars);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete student "${name}"?`)) return;
    try {
      await userApi.delete(id);
      toast.success("Student deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<StudentDTO>[] = [
    { header: "Name", accessor: "name" },
    { header: "Roll No", accessor: "rollNo" },
    {
      header: "Room",
      accessor: (s) => (s.type === "DAY_SCHOLAR" ? "—" : s.roomNo || "—"),
    },
    { header: "Phone", accessor: (s) => s.phone || "—" },
    {
      header: "Status",
      accessor: (s) => (
        <Badge color={s.active ? "green" : "gray"}>
          {s.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: (s) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/students/${s.id}/edit`);
            }}
            className="p-1.5 rounded-lg hover:bg-teal/10 text-teal transition"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(s.id!, s.name);
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tabMeta: Record<
    StudentType,
    { label: string; icon: any; desc: string }
  > = {
    HOSTELLER: {
      label: "Hostellers",
      icon: Home,
      desc: "Students living in the hostel",
    },
    DAY_SCHOLAR: {
      label: "Day Scholars",
      icon: Bus,
      desc: "Students who come from home",
    },
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${counts.HOSTELLER} hostellers · ${counts.DAY_SCHOLAR} day scholars`}
        action={
          <Button onClick={() => navigate("/admin/students/new")}>
            <Plus size={16} /> Add Student
          </Button>
        }
      />

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {STUDENT_TYPES.map((t) => {
          const Icon = tabMeta[t].icon;
          const isActive = tab === t;

          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                isActive
                  ? "border-teal bg-teal/5 shadow-md shadow-teal/10"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isActive
                      ? "bg-teal text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`text-2xl font-bold ${
                    isActive ? "text-teal" : "text-slate-400"
                  }`}
                >
                  {counts[t]}
                </span>
              </div>
              <p
                className={`text-sm font-semibold ${
                  isActive ? "text-teal" : "text-slate-700"
                }`}
              >
                {tabMeta[t].label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{tabMeta[t].desc}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-xl bg-white border border-slate-200 w-full sm:w-80">
        <Search size={16} className="text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or roll no..."
          className="bg-transparent outline-none flex-1 text-sm"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            icon={Users}
            title={
              search ? "No results" : `No ${tabMeta[tab].label.toLowerCase()} yet`
            }
            description={
              search
                ? "Try a different search term"
                : "Add the first student to get started"
            }
            action={
              !search && (
                <Button onClick={() => navigate("/admin/students/new")}>
                  <Plus size={16} /> Add Student
                </Button>
              )
            }
          />
        </div>
      ) : (
        <Table columns={columns} data={filtered} />
      )}
    </div>
  );
}