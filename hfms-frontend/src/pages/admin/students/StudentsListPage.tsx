import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

import { userApi } from "../../../api/userApi";
import type { StudentDTO } from "../../../types/student";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import type { Column } from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import EmptyState from "../../../components/common/EmptyState";

export default function StudentsListPage() {
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await userApi.list();
      setStudents(data);
    } catch (err: any) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
    { header: "Room", accessor: (s) => s.roomNo || "—" },
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

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${students.length} total students`}
        action={
          <Button onClick={() => navigate("/admin/students/new")}>
            <Plus size={16} /> Add Student
          </Button>
        }
      />

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
            title={search ? "No results" : "No students yet"}
            description={
              search
                ? "Try a different search term"
                : "Add your first student to get started"
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