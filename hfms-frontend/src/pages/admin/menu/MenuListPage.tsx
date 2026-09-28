import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, UtensilsCrossed, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

import { menuApi } from "../../../api/menuApi";
import type { MenuItemDTO } from "../../../types/menu";
import { MEAL_TYPES } from "../../../types/menu";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import type { Column } from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";
import EmptyState from "../../../components/common/EmptyState";

const mealColor = {
  BREAKFAST: "amber",
  LUNCH: "blue",
  DINNER: "green",
} as const;

export default function MenuListPage() {
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      setItems(await menuApi.list());
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await menuApi.delete(id);
      toast.success("Item deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.id?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || item.mealType === filter;
    return matchesSearch && matchesFilter;
  });

  const columns: Column<MenuItemDTO>[] = [
    { header: "ID", accessor: "id", width: "100px" },
    { header: "Item Name", accessor: "itemName" },
    {
      header: "Meal",
      accessor: (item) => (
        <Badge color={mealColor[item.mealType as keyof typeof mealColor] || "gray"}>
          {item.mealType}
        </Badge>
      ),
    },
    { header: "Quantity", accessor: (item) => item.quantity || "—" },
    { header: "Dietary", accessor: (item) => item.dietaryTags || "—" },
    {
      header: "Actions",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/menu/${item.id}/edit`);
            }}
            className="p-1.5 rounded-lg hover:bg-teal/10 text-teal transition"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.id!, item.itemName);
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
        title="Menu Items"
        subtitle={`${items.length} items in the menu`}
        action={
          <Button onClick={() => navigate("/admin/menu/new")}>
            <Plus size={16} /> Add Item
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 flex-1 sm:max-w-xs">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>

        <div className="flex gap-2">
          {["ALL", ...MEAL_TYPES].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                filter === t
                  ? "bg-teal text-white shadow-md shadow-teal/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            icon={UtensilsCrossed}
            title={search || filter !== "ALL" ? "No results" : "No menu items yet"}
            description={
              search || filter !== "ALL"
                ? "Try adjusting your filters"
                : "Add your first meal item to get started"
            }
            action={
              !search && filter === "ALL" && (
                <Button onClick={() => navigate("/admin/menu/new")}>
                  <Plus size={16} /> Add Item
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