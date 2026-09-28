import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

import { menuApi } from "../../../api/menuApi";
import type { MenuItemDTO } from "../../../types/menu";
import { MEAL_TYPES } from "../../../types/menu";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

const empty: MenuItemDTO = {
  id: "",
  itemName: "",
  mealType: "BREAKFAST",
  quantity: "",
  dietaryTags: "",
  allergens: "",
  active: true,
};

export default function MenuItemFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<MenuItemDTO>(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setForm(await menuApi.getById(id!));
      } catch {
        toast.error("Item not found");
        navigate("/admin/menu");
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await menuApi.update(id!, form);
        toast.success("Item updated");
      } else {
        await menuApi.create(form);
        toast.success("Item created");
      }
      navigate("/admin/menu");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-slate-400">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={isEdit ? "Edit Menu Item" : "Add Menu Item"}
        subtitle={isEdit ? `Updating ${id}` : "Add a new meal to the menu"}
        action={
          <Button variant="secondary" onClick={() => navigate("/admin/menu")}>
            <ArrowLeft size={16} /> Back
          </Button>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Meal ID *"
            placeholder="MEAL001"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value.toUpperCase() })}
            disabled={isEdit}
            required
          />
          <div className="sm:col-span-2">
            <Input
              label="Item Name *"
              placeholder="Idli + Sambar + Chutney"
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meal Type *
          </label>
          <select
            value={form.mealType}
            onChange={(e) => setForm({ ...form, mealType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
            required
          >
            {MEAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Quantity"
          placeholder="4 pcs + 150ml + 50ml"
          value={form.quantity || ""}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Dietary Tags"
            placeholder="veg,gluten-free"
            value={form.dietaryTags || ""}
            onChange={(e) => setForm({ ...form, dietaryTags: e.target.value })}
          />
          <Input
            label="Allergens"
            placeholder="dairy,nuts"
            value={form.allergens || ""}
            onChange={(e) => setForm({ ...form, allergens: e.target.value })}
          />
        </div>

        {isEdit && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-teal"
            />
            <span className="text-sm text-slate-700">Active</span>
          </label>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={loading}>
            <Save size={16} /> {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/menu")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}