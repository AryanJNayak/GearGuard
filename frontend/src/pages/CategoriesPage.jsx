import React, { useEffect, useState } from "react";
import { Layers, Plus, Users, Briefcase, Search, Tag } from "lucide-react";

export default function CategoriesPage() {
    // --- State ---
    const [categoryName, setCategoryName] = useState("");
    const [teamId, setTeamId] = useState("");
    const [technicianId, setTechnicianId] = useState("");

    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");

    // Auth
    const token = localStorage.getItem("token");

    // --- Effects ---
    useEffect(() => {
        fetchMeta();
        fetchCategories();
        // eslint-disable-next-line
    }, []);

    // --- API Handlers ---
    const fetchMeta = async () => {
        try {
            const [tRes, uRes] = await Promise.all([
                fetch("/api/teams", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            if (tRes.ok) setTeams(await tRes.json());
            if (uRes.ok) setUsers(await uRes.json());
        } catch (err) {
            console.error("Failed to load meta data", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/equipment/categories", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setCategories(await res.json());
        } catch (err) {
            console.error("Failed to load categories", err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!categoryName || !teamId) {
            alert("Category name and team are required");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/equipment/categories", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category_name: categoryName,
                    team_id: teamId,
                    technician_id: technicianId || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to add category");
            } else {
                setCategoryName("");
                setTeamId("");
                setTechnicianId("");
                fetchCategories();
            }
        } catch (err) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredCategories = categories.filter(c =>
        c.category_name.toLowerCase().includes(filter.toLowerCase()) ||
        c.team_name?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* 1. Page Header */}
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                    <Layers className="text-white w-6 h-6" />
                </div>
                <div>
                    {/* Explicit text-gray-900 to force black text */}
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Equipment Categories</h1>
                    <p className="text-gray-500 text-sm">Organize equipment by type and assign default teams.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 2. Add Category Form (Left Column) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                            <Plus size={18} className="text-indigo-600" />
                            Add Category
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">Create a new classification for your assets.</p>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    {/* Added text-gray-900 to input */}
                                    <input
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="e.g., Laptops, Heavy Machinery"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsible Team</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    {/* Added text-gray-900 to select */}
                                    <select
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 text-gray-900"
                                        value={teamId}
                                        onChange={(e) => setTeamId(e.target.value)}
                                    >
                                        <option value="">Select Team</option>
                                        {teams.map((t) => (
                                            <option key={t.team_id} value={t.team_id}>
                                                {t.team_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Default Technician <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    {/* Added text-gray-900 to select */}
                                    <select
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 text-gray-900"
                                        value={technicianId}
                                        onChange={(e) => setTechnicianId(e.target.value)}
                                    >
                                        <option value="">No specific technician</option>
                                        {users.map((u) => (
                                            <option key={u.user_id} value={u.user_id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all active:scale-95 flex justify-center items-center gap-2"
                            >
                                {loading ? "Saving..." : "Create Category"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 3. Categories List (Right Column - Takes up 2/3 space) */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <Search className="text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="flex-1 border-none focus:ring-0 text-sm text-gray-900 placeholder-gray-400"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        {/* Added text-gray-900 to Headers */}
                                        <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Category Name</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Assigned Team</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Technician</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCategories.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                                No categories found matching your search.
                                            </td>
                                        </tr>
                                    )}

                                    {filteredCategories.map((c) => (
                                        <tr key={c.category_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                        <Tag size={16} />
                                                    </div>
                                                    {/* Added text-gray-900 to Item Name */}
                                                    <span className="font-semibold text-gray-900">{c.category_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    {c.team_name || "—"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {c.technician_name ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                                            {c.technician_name.charAt(0)}
                                                        </div>
                                                        {c.technician_name}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Unassigned</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}