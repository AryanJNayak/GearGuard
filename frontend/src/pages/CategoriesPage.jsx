import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Layers, Plus, User, Trash2 } from 'lucide-react';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        category_name: '',
        team_id: '',
        technician_id: ''
    });

    const [loading, setLoading] = useState(true);

    // 1. Initial Load: Get Categories and Teams
    useEffect(() => {
        fetchCategories();
        fetchTeams();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/equipment/categories');
            setCategories(data);
        } catch (err) { console.error("Failed to load categories", err); }
        finally { setLoading(false); }
    };

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/teams');
            setTeams(data);
        } catch (err) { console.error("Failed to load teams", err); }
    };

    // 2. Logic: When Team Changes, Fetch Members for the "Default Technician" Dropdown
    const handleTeamChange = async (e) => {
        const teamId = e.target.value;
        setFormData({ ...formData, team_id: teamId, technician_id: '' }); // Reset technician when team changes

        if (teamId) {
            try {
                const { data } = await api.get(`/teams/members/${teamId}`);
                setTeamMembers(data);
            } catch (err) { console.error("Failed to load team members", err); }
        } else {
            setTeamMembers([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/equipment/categories', formData);
            alert('Category Created Successfully');
            setFormData({ category_name: '', team_id: '', technician_id: '' });
            fetchCategories(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating category');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                    <p className="text-gray-500 text-sm">Define equipment types and assign default maintenance teams.</p>
                </div>
            </div>

            {/* CREATE CATEGORY FORM */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold mb-4 text-gray-700 flex items-center gap-2">
                    <Plus size={18} className="text-blue-600" /> Add New Category
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="e.g. HVAC, Laptops"
                            value={formData.category_name}
                            onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Team Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Team</label>
                        <select
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={formData.team_id}
                            onChange={handleTeamChange}
                            required
                        >
                            <option value="">Select Team...</option>
                            {teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
                        </select>
                    </div>

                    {/* Technician Dropdown (Filtered) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Technician</label>
                        <select
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                            value={formData.technician_id}
                            onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
                            required
                            disabled={!formData.team_id}
                        >
                            <option value="">{formData.team_id ? "Select Technician..." : "Select Team First"}</option>
                            {teamMembers.map(m => <option key={m.user_id} value={m.user_id}>{m.name}</option>)}
                        </select>
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition flex items-center justify-center gap-2">
                        Create
                    </button>
                </form>
            </div>

            {/* CATEGORIES LIST */}
            {loading ? <p>Loading categories...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => (
                        <div key={cat.category_id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <Layers size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{cat.category_name}</h4>
                                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                            {cat.team_name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-600">
                                <User size={14} className="text-gray-400" />
                                <span className="text-gray-400">Default Tech:</span>
                                <span className="font-medium text-gray-700">{cat.technician_name}</span>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && <p className="text-gray-500 col-span-3">No categories defined yet.</p>}
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;