import { useEffect, useState } from "react";
import { Plus, Leaf, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";

import { surplusApi } from "../../../api/surplusApi";
import { menuApi } from "../../../api/menuApi";
import type { SurplusLogDTO } from "../../../types/surplus";
import type { MenuItemDTO } from "../../../types/menu";
import { MEAL_TYPES } from "../../../types/menu";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Table, { type Column } from "../../../components/common/Table";
import Badge from "../../../components/common/Badge";

export default function SurplusLogPage() {
  const [items, setItems] = useState<SurplusLogDTO[]>([]);
  const [menu, setMenu] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<SurplusLogDTO>({
    mealId: "",
    mealType: "BREAKFAST",
    preparedQty: 0,
    servedQty: 0,
    surplusQty: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [today, m] = await Promise.all([surplusApi.today(), menuApi.list()]);
      setItems(today);
      setMenu(m);
    } catch {
      toast.error("Failed to load surplus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mealId) return toast.error("Select a meal");
    setSubmitting(true);
    try {
      await surplusApi.logSurplus(form);
      toast.success("Surplus logged");
      setShowForm(false);
      setForm({
        mealId: "",
        mealType: "BREAKFAST",
        preparedQty: 0,
        servedQty: 0,
        surplusQty: 0,
      });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Log failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMenu = menu.filter((m) => m.mealType === form.mealType);

  const columns: Column<SurplusLogDTO>[] = [
    { header: "Meal ID", accessor: "mealId" },
    {
      header: "Type",
      accessor: (s) => <Badge color="blue">{s.mealType}</Badge>,
    },
    { header: "Prepared", accessor: (s) => s.preparedQty ?? "—" },
    { header: "Served", accessor: (s) => s.servedQty ?? "—" },
    {
      header: "Surplus",
      accessor: (s) => (
        <span className="font-semibold text-amber-600">{s.surplusQty}</span>
      ),
    },
    {
      header: "Disposition",
      accessor: (s) => (
        <Badge color={s.disposition === "NGO" ? "green" : "amber"}>
          {s.disposition || "DAY_SCHOLAR"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Surplus Log"
        subtitle="Log leftovers after a meal is served"
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> {showForm ? "Cancel" : "Log Surplus"}
          </Button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type *
              </label>
              <select
                value={form.mealType}
                onChange={(e) =>
                  setForm({ ...form, mealType: e.target.value, mealId: "" })
                }
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
                value={form.mealId}
                onChange={(e) => setForm({ ...form, mealId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                required
              >
                <option value="">— Select —</option>
                {filteredMenu.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} — {m.itemName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Prepared Qty"
              type="number"
              value={form.preparedQty ?? 0}
              onChange={(e) =>
                setForm({ ...form, preparedQty: Number(e.target.value) })
              }
            />
            <Input
              label="Served Qty"
              type="number"
              value={form.servedQty ?? 0}
              onChange={(e) =>
                setForm({ ...form, servedQty: Number(e.target.value) })
              }
            />
            <Input
              label="Surplus Qty *"
              type="number"
              value={form.surplusQty}
              onChange={(e) =>
                setForm({ ...form, surplusQty: Number(e.target.value) })
              }
              required
            />
          </div>

          <Button type="submit" loading={submitting}>
            <Leaf size={16} /> Save
          </Button>
        </form>
      )}

      {loading ? (
        <div className="text-slate-400 py-8">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
          <UtensilsCrossed size={40} className="mx-auto mb-3" />
          No surplus logged today.
        </div>
      ) : (
        <Table columns={columns} data={items} />
      )}
    </div>
  );
}