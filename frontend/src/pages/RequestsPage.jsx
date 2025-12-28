import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FileText, Tag, User, Briefcase, Wrench } from 'lucide-react';

const RequestsPage = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [activeTab, setActiveTab] = useState('my_created');

    const [formData, setFormData] = useState({
        equipment_id: '', category_id: '', technician_id: '',
        subject: '', description: '', priority: 'Medium', request_type: 'Corrective'
    });

    // Stores the data fetched from the backend to display to the user
    const [autoFillInfo, setAutoFillInfo] = useState(null);

    useEffect(() => {
        fetchRequests();
        fetchEquipment();
    }, [activeTab]);

    const fetchRequests = async () => {
        try {
            let endpoint = user.is_admin ? '/requests' : '/requests/my-team';
            const { data } = await api.get(endpoint);
            setRequests(data);
        } catch (err) { console.error(err); }
    };

    const fetchEquipment = async () => {
        try {
            const { data } = await api.get('/equipment');
            setEquipmentList(data);
        } catch (err) { console.error(err); }
    };

    const handleEquipmentChange = async (e) => {
        const equipId = e.target.value;
        setFormData(prev => ({ ...prev, equipment_id: equipId }));

        if (equipId) {
            try {
                const { data } = await api.get(`/equipment/${equipId}/autofill`);

                // Update form data (hidden fields)
                setFormData(prev => ({
                    ...prev, category_id: data.category_id, technician_id: data.technician_id
                }));

                // Update Visual Display
                setAutoFillInfo({
                    category: data.category_name, // <--- We already had this
                    team: data.team_name,
                    tech: data.technician_name
                });

            } catch (error) { console.error("Auto-fill failed", error); }
        } else { setAutoFillInfo(null); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests/add', formData);
            alert('Request Created Successfully');
            setFormData({
                equipment_id: '', category_id: '', technician_id: '',
                subject: '', description: '', priority: 'Medium', request_type: 'Corrective'
            });
            setAutoFillInfo(null);
            fetchRequests();
            setActiveTab('my_created');
        } catch (error) { alert('Failed to create request'); }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            await api.post('/requests/status', { requestId, status: newStatus });
            fetchRequests();
        } catch (error) { alert(error.response?.data?.message || 'Update failed'); }
    };

    const filteredRequests = requests.filter(req => {
        if (activeTab === 'my_created') return req.created_by === user.id;
        if (activeTab === 'team_pending') return req.viewer_is_team_member === 1 && ['New', 'In Progress'].includes(req.status);
        if (activeTab === 'team_completed') return req.viewer_is_team_member === 1 && ['Repaired', 'Scrap'].includes(req.status);
        return false;
    });

    const canEditStatus = (req) => user.is_admin || req.viewer_is_manager === 1;

    return (
        <div className="space-y-8">

            {/* CREATE FORM */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="text-blue-600" /> Create New Request
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Equipment</label>
                            <select className="w-full p-2.5 border rounded-lg" value={formData.equipment_id} onChange={handleEquipmentChange} required>
                                <option value="">-- Choose Asset --</option>
                                {equipmentList.map(e => (
                                    <option key={e.equipment_id} value={e.equipment_id}>{e.equipment_name} (SN: {e.serial_number})</option>
                                ))}
                            </select>
                        </div>

                        {/* --- UPDATED AUTO-FILL BOX --- */}
                        {autoFillInfo && (
                            <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2 border border-blue-100 animate-fade-in">
                                {/* ADDED CATEGORY LINE HERE */}
                                <p className="flex items-center gap-2">
                                    <Tag size={16} className="text-blue-600" />
                                    <span className="font-semibold text-blue-800">Category:</span> {autoFillInfo.category}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Briefcase size={16} className="text-blue-600" />
                                    <span className="font-semibold text-blue-800">Team:</span> {autoFillInfo.team}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Wrench size={16} className="text-blue-600" />
                                    <span className="font-semibold text-blue-800">Assigned Tech:</span> {autoFillInfo.tech}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700">Subject</label><input type="text" required className="w-full p-2 border rounded" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} /></div>
                        <textarea placeholder="Description..." className="w-full p-2 border rounded h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">Submit Request</button>
                    </div>
                </form>
            </div>

            {/* TABS */}
            <div>
                <div className="flex border-b border-gray-200 mb-4">
                    <button onClick={() => setActiveTab('my_created')} className={`px-4 py-2 font-medium text-sm border-b-2 transition ${activeTab === 'my_created' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>My Requests</button>
                    <button onClick={() => setActiveTab('team_pending')} className={`px-4 py-2 font-medium text-sm border-b-2 transition ${activeTab === 'team_pending' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Team Pending</button>
                    <button onClick={() => setActiveTab('team_completed')} className={`px-4 py-2 font-medium text-sm border-b-2 transition ${activeTab === 'team_completed' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Team Completed</button>
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {filteredRequests.map(req => (
                        <div key={req.request_id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${req.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{req.priority}</span>
                                    <span className="text-gray-400 text-xs">#{req.request_id} • {new Date(req.created_at).toLocaleDateString()}</span>
                                    {req.viewer_is_manager === 1 && <span className="text-xs bg-purple-100 text-purple-700 px-2 rounded-full font-semibold">Manager Access</span>}
                                </div>
                                <h3 className="font-bold text-gray-800">{req.subject}</h3>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-1" title="Asset"><Tag size={14} /> {req.equipment_name}</span>
                                    <span className="flex items-center gap-1" title="Team"><Briefcase size={14} /> {req.team_name}</span>
                                    <span className="flex items-center gap-1 text-blue-700 font-medium bg-blue-50 px-2 rounded" title="Assigned Technician"><Wrench size={14} /> {req.technician_name}</span>
                                    <span className="flex items-center gap-1" title="Requester"><User size={14} /> Created by: {req.created_by_name}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {canEditStatus(req) ? (
                                    <select
                                        className={`p-2 rounded text-sm font-medium border-none ring-1 ring-inset cursor-pointer ${req.status === 'New' ? 'bg-blue-50 text-blue-700 ring-blue-200' :
                                            req.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 ring-yellow-200' :
                                                'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                            }`}
                                        value={req.status}
                                        onChange={(e) => handleStatusUpdate(req.request_id, e.target.value)}
                                    >
                                        <option value="New">New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Repaired">Repaired</option>
                                        <option value="Scrap">Scrap</option>
                                    </select>
                                ) : (
                                    <span className={`px-3 py-1 rounded text-sm font-medium ${req.status === 'Repaired' ? 'bg-emerald-100 text-emerald-700' :
                                        req.status === 'Scrap' ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {req.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredRequests.length === 0 && (
                        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                            No requests found in this tab.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestsPage;