import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Monitor, MapPin, Search, Plus, Tag } from 'lucide-react';

const EquipmentPage = () => {
    const { user } = useContext(AuthContext);
    const [equipment, setEquipment] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        equipment_name: '',
        category_id: '',
        serial_number: '',
        location: '',
        department: ''
    });

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [eqRes, catRes] = await Promise.all([
                    api.get('/equipment'),
                    api.get('/equipment/categories') // Always fetch categories for the filter/form
                ]);
                setEquipment(eqRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error("Failed to load equipment data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/equipment/add', formData);
            alert('Equipment Added Successfully');
            // Reset Form
            setFormData({ equipment_name: '', category_id: '', serial_number: '', location: '', department: '' });
            // Refresh List
            const { data } = await api.get('/equipment');
            setEquipment(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding equipment');
        }
    };

    // Filter Logic: Search by Name OR Serial Number
    const filteredEquipment = equipment.filter(item =>
        item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.serial_number && item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">

            {/* HEADER & SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Equipment Assets</h1>
                    <p className="text-gray-500 text-sm">Manage physical inventory and asset locations.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search name or serial #..."
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-100 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* ADD EQUIPMENT FORM (ADMIN ONLY) */}
            {user?.is_admin && (
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-semibold mb-4 text-gray-700 flex items-center gap-2">
                        <Plus size={18} className="text-emerald-600" /> Register New Asset
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">

                        <div className="md:col-span-2">
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Asset Name *</label>
                            <input type="text" placeholder="e.g. Dell Latitude 5420" required
                                className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={formData.equipment_name} onChange={e => setFormData({ ...formData, equipment_name: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Category *</label>
                            <select required className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                <option value="">Select...</option>
                                {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Serial Number</label>
                            <input type="text" placeholder="SN-12345"
                                className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={formData.serial_number} onChange={e => setFormData({ ...formData, serial_number: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Location</label>
                            <input type="text" placeholder="Floor 2, Room 101"
                                className="w-full p-2 border rounded text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                                value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <button className="bg-emerald-600 text-white px-4 py-2 rounded text-sm hover:bg-emerald-700 font-medium h-[38px]">
                            Register
                        </button>
                    </form>
                </div>
            )}

            {/* ASSET TABLE */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 border-b">
                        <tr>
                            <th className="p-4 font-semibold">Asset Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Serial #</th>
                            <th className="p-4 font-semibold">Location</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {loading ? (
                            <tr><td colSpan="5" className="p-6 text-center text-gray-500">Loading assets...</td></tr>
                        ) : filteredEquipment.length === 0 ? (
                            <tr><td colSpan="5" className="p-6 text-center text-gray-500">No equipment found matching your search.</td></tr>
                        ) : (
                            filteredEquipment.map(item => (
                                <tr key={item.equipment_id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded text-gray-500">
                                            <Monitor size={16} />
                                        </div>
                                        {item.equipment_name}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            <Tag size={10} /> {item.category_name}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-gray-500 text-xs">{item.serial_number || 'N/A'}</td>
                                    <td className="p-4 text-gray-600 flex items-center gap-1">
                                        <MapPin size={14} className="text-gray-400" /> {item.location || 'Unknown'}
                                    </td>
                                    <td className="p-4">
                                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">Active</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EquipmentPage;