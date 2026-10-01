import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, UtensilsCrossed, Search, LayoutGrid, List } from "lucide-react";
import toast from "react-hot-toast";

import { menuApi } from "../../../api/menuApi";
import type { MenuItemDTO } from "../../../types/menu";
import { MEAL_TYPES } from "../../../types/menu";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import EmptyState from "../../../components/common/EmptyState";
import MenuItemCard from "../../../components/menu/MenuItemCard";

export default function MenuListPage() {
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [view, setView] = useState<"grid" | "list">("grid");
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

  const handleDelete = async (item: MenuItemDTO) => {
    if (!confirm(`Delete "${item.itemName}"?`)) return;
    try {
      await menuApi.delete(item.id!);
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

  const grouped = MEAL_TYPES.map((meal) => ({
    meal,
    items: filtered.filter((i) => i.mealType === meal),
  })).filter((g) => g.items.length > 0);

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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 flex-1 sm:max-w-xs">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["ALL", ...MEAL_TYPES].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                filter === t
                  ? "bg-teal text-white shadow-md shadow-teal/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 ml-auto">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-lg transition ${
              view === "grid"
                ? "bg-white shadow-sm text-teal"
                : "text-slate-500"
            }`}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-lg transition ${
              view === "list"
                ? "bg-white shadow-sm text-teal"
                : "text-slate-500"
            }`}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
            >
              <div className="h-40 bg-slate-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            icon={UtensilsCrossed}
            title={
              search || filter !== "ALL" ? "No results" : "No menu items yet"
            }
            description={
              search || filter !== "ALL"
                ? "Try adjusting your filters"
                : "Add your first meal item to get started"
            }
            action={
              !search &&
              filter === "ALL" && (
                <Button onClick={() => navigate("/admin/menu/new")}>
                  <Plus size={16} /> Add Item
                </Button>
              )
            }
          />
        </div>
      ) : view === "grid" ? (
        /* ---------- GRID VIEW ---------- */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={(i) => navigate(`/admin/menu/${i.id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* ---------- LIST VIEW (grouped by meal) ---------- */
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.meal}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-teal" />
                {group.meal.charAt(0) + group.meal.slice(1).toLowerCase()}
                <span className="text-xs text-slate-400 font-normal">
                  ({group.items.length})
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={(i) => navigate(`/admin/menu/${i.id}/edit`)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}