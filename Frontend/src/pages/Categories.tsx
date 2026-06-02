import React, { useState, useEffect } from "react";
import {
  FolderTree,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Layers,
  Info,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks/reduxHooks";
import type { RootState } from "@/redux/app/store";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/redux/features/category/categorySlice";
import type { Category } from "@/redux/features/category/categoryType";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Categories: React.FC = () => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const { token } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state: RootState) => state.categories);
  const API_URL = `${API_BASE_URL}/categories`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          dispatch(setCategories(res.data.categories));
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };
    if (token) fetchCategories();
  }, [token, dispatch]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    try {
      const res = await axios.post(
        API_URL,
        { name, icon },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        dispatch(addCategory(res.data.category));
        toast.success("Category created successfully");
        setName("");
        setIcon("");
      }
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        dispatch(deleteCategory(id));
        toast.success("Category deleted");
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditIcon(category.icon || "");
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editName.trim()) return toast.error("Name is required");

    try {
      const res = await axios.put(
        `${API_URL}/${id}`,
        {
          name: editName,
          icon: editIcon,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        dispatch(updateCategory(res.data.category));
        toast.success("Category updated");
        setEditingId(null);
      }
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans antialiased pb-12 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Interactive Data Grid Layer */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#05FF9B 1px, transparent 1px), linear-gradient(90deg, #05FF9B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Decorative Ambient Orbs */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none z-0" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-8">
        {/* Upper Heading Contextual Bar */}
        <section className="pb-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Manage your{" "}
            <span className="text-emerald-400 font-mono tracking-normal">
              Categories
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Divide your transactions using your own categories
          </p>
        </section>

        {/* Responsive Dual Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT AREA: Add Category Form Panel */}
          <section className="lg:col-span-5 bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Create Category
              </h2>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Transport, Subscriptions"
                  className="block w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Icon (optional)
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g., car, coffee"
                  className="block w-full px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition duration-200 text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-zinc-950 rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.99] transition-all duration-150 shadow-[0_4px_20px_0_rgba(5,255,155,0.15)] flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3px]" /> Add Category
              </button>
            </form>
          </section>

          {/* RIGHT AREA: Interactive Categories Matrix Table/List */}
          <section className="lg:col-span-7 bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Registered Categories
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Active categories for your transactions
                </p>
              </div>
              <span className="text-[10px] font-bold font-mono bg-white/5 px-2.5 py-1 rounded-md border border-white/5 text-zinc-400">
                {categories.length} Categories
              </span>
            </div>

            {/* List Array Stack */}
            <div className="space-y-4">
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-xl bg-black/20">
                  <FolderTree className="w-8 h-8 text-zinc-600 mb-2" />
                  <p className="text-xs font-medium text-zinc-500">
                    No categories added yet.
                  </p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
                  >
                    {editingId === category.id ? (
                      /* INLINE UPDATE FORM VIEW MODE */
                      <div className="space-y-3 animate-fadeIn">
                        <div className="grid grid-cols-1 gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                          />
                          <input
                            type="text"
                            value={editIcon}
                            onChange={(e) => setEditIcon(e.target.value)}
                            placeholder="Icon"
                            className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-[11px] font-medium border border-white/5 flex items-center gap-1 transition"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateCategory(category.id)}
                            className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1 transition"
                          >
                            <Check className="w-3 h-3" /> Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* STANDARD CARD VIEW MODE */
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-xs font-bold text-white tracking-wide">
                              {category.name}
                            </h4>
                            {category.icon && (
                              <span className="text-[9px] font-mono font-bold bg-zinc-900 text-zinc-400 border border-white/5 px-2 py-0.5 rounded-md flex items-center justify-center gap-1">
                                <Info className="w-2.5 h-2.5 text-cyan-400" />{" "}
                                {category.icon}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Control Trigger Cluster */}
                        <div className="flex items-center justify-end gap-1.5 self-end sm:self-center shrink-0 border-t border-white/[0.02] sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                          <button
                            onClick={() => startEditing(category)}
                            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-lg border border-white/5 transition flex items-center justify-center"
                            title="Update Category Parameters"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {/* Dynamic Deletion Confirmation Dialog Panel */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm bg-zinc-950 border border-white/10 text-white">
                              <DialogHeader>
                                <DialogTitle className="text-white">
                                  Delete Category
                                </DialogTitle>
                                <DialogDescription className="text-zinc-400 text-xs">
                                  Are you sure you want to delete{" "}
                                  <span className="text-white font-semibold">
                                    "{category.name}"
                                  </span>
                                  ? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="mt-4 gap-2 sm:gap-0">
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className="border-white/10 bg-black mr-3 text-white text-xs h-9"
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  onClick={() =>
                                    handleDeleteCategory(category.id)
                                  }
                                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-9"
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Categories;
