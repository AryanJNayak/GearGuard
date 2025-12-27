import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Box, X, Save, User, MapPin, Building2, Tag, Hash } from "lucide-react";

export default function EquipmentPage() {
    // --- State ---
    const [equipment, setEquipment] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]); // State for User dropdown

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        equipment_name: "",
        category_id: "",
        department: "",
        user_id: "", // Matches your controller
        serial_number: "",
        location: ""
    });

    const token = localStorage.getItem("token");

    // --- Effects ---
    useEffect(() => {
        fetchEquipment();
        fetchCategories();
        fetchUsers(); // Fetch users when page loads
    }, []);

    // --- API Handlers ---
    const fetchEquipment = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/equipment', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setEquipment(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/equipment/categories', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setCategories(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setUsers(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare payload to match your EXACT controller fields
        const payload = {
            equipment_name: formData.equipment_name,
            category_id: formData.category_id,
            department: formData.department,
            user_id: formData.user_id || null, // Send null if empty
            serial_number: formData.serial_number,
            location: formData.location
        };
        console.log(payload);

        try {
            const res = await fetch('http://localhost:3000/api/equipment/add', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setIsModalOpen(false);
                fetchEquipment(); // Refresh list
                // Reset form
                setFormData({
                    equipment_name: "", category_id: "", department: "",
                    user_id: "", serial_number: "", location: ""
                });
                alert("Equipment added successfully!");
            } else {
                alert(data.message || 'Error adding equipment');
            }
        } catch (e) { alert('Connection error'); }
        setLoading(false);
    };

    // --- Filter Logic ---
    const filteredEquipment = equipment.filter(item =>
        item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Equipment List</h1>
                    <p className="text-gray-500 mt-1">Manage and assign company assets.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Equipment</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, serial, or category..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Serial #</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEquipment.map((item) => (
                                <tr key={item.equipment_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Box size={18} />
                                            </div>
                                            <span className="font-semibold text-gray-900">{item.equipment_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.category_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {item.owner_name ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {item.owner_name}
                                            </span>
                                        ) : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.serial_number || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.location || '—'}</td>
                                </tr>
                            ))}
                            {filteredEquipment.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No equipment found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- ADD EQUIPMENT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-lg">Add New Equipment</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Equipment Name */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name *</label>
                                <div className="relative">
                                    <Box className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <input
                                        required
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        placeholder="e.g. Dell Latitude 5420"
                                        value={formData.equipment_name}
                                        onChange={e => setFormData({ ...formData, equipment_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Category Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <select
                                        required
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5"
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* User Select (Admin Selects User) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign User</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <select
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5"
                                        value={formData.user_id}
                                        onChange={e => setFormData({ ...formData, user_id: e.target.value })}
                                    >
                                        <option value="">-- Unassigned --</option>
                                        {users.map(u => (
                                            <option key={u.user_id} value={u.user_id}>{u.name} ({u.role || 'Emp'})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Serial Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <input
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        placeholder="SN-12345"
                                        value={formData.serial_number}
                                        onChange={e => setFormData({ ...formData, serial_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <input
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        placeholder="e.g. IT, HR"
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Location - Full Width */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <input
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        placeholder="e.g. Building A, Floor 2"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="col-span-2 pt-4 flex justify-end gap-3 border-t border-gray-100 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm shadow-indigo-500/20"
                                >
                                    {loading ? 'Saving...' : <><Save size={16} /> Save Equipment</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}