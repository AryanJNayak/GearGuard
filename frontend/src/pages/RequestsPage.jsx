import React, { useEffect, useState } from 'react';
import {
    FileText, Wrench, Clock, User, CheckCircle,
    AlertCircle, Search, Loader, Inbox, Send, Archive
} from 'lucide-react';

export default function RequestsPage() {
    // --- 1. STATE & AUTH ---
    const [equipmentList, setEquipmentList] = useState([]);
    const [requests, setRequests] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('team_pending'); // Default tab

    // Form State
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [requestType, setRequestType] = useState('Corrective');
    const [scheduleDate, setScheduleDate] = useState('');
    const [duration, setDuration] = useState('0');

    // Equipment Form State
    const [equipmentId, setEquipmentId] = useState('');
    const [maintenanceFor, setMaintenanceFor] = useState('Equipment');
    const [categoryId, setCategoryId] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [technicianId, setTechnicianId] = useState(null);
    const [technicianName, setTechnicianName] = useState('');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const today = new Date().toISOString().slice(0, 10);

    // --- 2. PERMISSION LOGIC ---
    const canEditRequest = (request) => {
        // Rule 1: Admins can always edit
        if (user.is_admin) return true;
        // Rule 2: The ASSIGNED Technician can edit
        if (user.id === request.technician_id) return true;
        // Rule 3: Everyone else is Read-Only
        return false;
    };

    // --- 3. FETCH DATA ---
    useEffect(() => {
        if (!token) return;
        fetchEquipment();
        fetchRequests();
    }, [token]);

    const fetchEquipment = async () => {
        try {
            const res = await fetch('/api/equipment', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setEquipmentList(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            let url = '/api/requests';
            if (user && !user.is_admin) {
                url = `/api/requests/my-team/${user.id}`;
            }
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setRequests(await res.json());
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    // --- 4. HANDLERS ---
    const handleStatusUpdate = async (requestId, newStatus) => {
        setStatusLoading(requestId);

        try {
            const res = await fetch('/api/requests/status', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status: newStatus })
            });

            const d = await res.json();
            if (res.ok) {
                setRequests(prev => prev.map(r =>
                    r.request_id === requestId ? { ...r, status: newStatus } : r
                ));
            } else {
                alert(d.message || "Failed to update status");
            }
        } catch (error) { alert("Connection error"); }
        setStatusLoading(null);
    };

    const handleEquipmentChange = async (val) => {
        setEquipmentId(val);
        if (!val) {
            setCategoryId(null); setCategoryName(''); setTeamName('');
            setTechnicianId(null); setTechnicianName('');
            setTeamMembers([]);
            return;
        }
        try {
            const res = await fetch(`/api/equipment/${val}/autofill`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const data = await res.json();

            setCategoryId(data.category_id || null);
            setCategoryName(data.category_name || '');
            setTeamName(data.team_name || '');
            setTechnicianId(data.technician_id || null);
            setTechnicianName(data.technician_name || '');

            if (data.team_id) {
                const mRes = await fetch(`/api/teams/members/${data.team_id}`, { headers: { Authorization: `Bearer ${token}` } });
                if (mRes.ok) {
                    const members = await mRes.json();
                    setTeamMembers(members);
                    // If the equipment has a default tech, select them
                    if (data.technician_id) setTechnicianId(data.technician_id);
                }
            } else { setTeamMembers([]); }
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject) return alert('Subject is required');

        const payload = {
            equipment_id: maintenanceFor === 'Equipment' ? equipmentId : null,
            maintenance_for: maintenanceFor,
            category_id: categoryId,
            technician_id: technicianId,
            subject, description, priority, request_type: requestType,
            schedule_date: requestType === 'Preventive' ? scheduleDate : null,
            duration: parseFloat(duration) || 0
        };

        try {
            const res = await fetch('http://localhost:3000/api/requests/add', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSubject(''); setDescription('');
                fetchRequests();
                alert('Request created successfully');
            } else { alert('Error creating request'); }
        } catch (e) { alert('Connection error'); }
    };

    // --- 5. FILTERING ---
    const getFilteredRequests = () => {
        let filtered = requests.filter(r =>
            r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.equipment_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (activeTab === 'my_created') {
            return filtered.filter(r => r.created_by === user.id);
        }
        if (activeTab === 'team_pending') {
            return filtered.filter(r => ['New', 'In Progress'].includes(r.status));
        }
        if (activeTab === 'team_completed') {
            return filtered.filter(r => ['Repaired', 'Scrap'].includes(r.status));
        }
        return filtered;
    };

    const displayRequests = getFilteredRequests();

    // --- 6. STYLES ---
    const getStatusStyle = (s) => {
        switch (s) {
            case 'New': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'In Progress': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Repaired': return 'bg-green-50 text-green-700 border-green-200';
            case 'Scrap': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                    <FileText className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Maintenance Requests</h1>
                    <p className="text-gray-500 text-sm">Create and track maintenance tickets.</p>
                </div>
            </div>

            {/* --- COMPLETE FORM SECTION --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Wrench size={18} className="text-indigo-500" />
                        New Request
                    </h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 1. Maintenance Type */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Maintenance For</label>
                        <select
                            className="w-full rounded-lg border-gray-300 text-sm py-2 text-gray-900"
                            value={maintenanceFor}
                            onChange={e => setMaintenanceFor(e.target.value)}
                        >
                            <option value="Equipment">Equipment</option>
                            <option value="Workplace">Workplace</option>
                        </select>
                    </div>

                    {/* 2. Equipment Select */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Equipment</label>
                        <select
                            className="w-full rounded-lg border-gray-300 text-sm py-2 disabled:bg-gray-100 text-gray-900"
                            value={equipmentId}
                            onChange={e => handleEquipmentChange(e.target.value)}
                            disabled={maintenanceFor === 'Workplace'}
                        >
                            <option value="">Select Equipment</option>
                            {equipmentList.map(eq => (
                                <option key={eq.equipment_id} value={eq.equipment_id}>{eq.equipment_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Technician Select */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Technician</label>
                        {teamMembers.length > 0 ? (
                            <select
                                className="w-full rounded-lg border-gray-300 text-sm py-2 text-gray-900"
                                value={technicianId || ''}
                                onChange={e => setTechnicianId(e.target.value)}
                            >
                                <option value="">Select Technician</option>
                                {teamMembers.map(m => (
                                    <option key={m.user_id} value={m.user_id}>{m.name}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                className="w-full rounded-lg border-gray-300 text-sm text-gray-900"
                                placeholder="Technician Name"
                                value={technicianName || ''}
                                onChange={e => setTechnicianName(e.target.value)}
                            />
                        )}
                    </div>

                    {/* 4. Subject */}
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                        <input
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-900"
                            placeholder="e.g. Broken Screen"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                        />
                    </div>

                    {/* 5. Priority */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                        <select
                            className="w-full rounded-lg border-gray-300 text-sm py-2 text-gray-900"
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>

                    {/* 6. Description */}
                    <div className="col-span-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <textarea
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-900"
                            rows="2"
                            placeholder="Describe the issue..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Footer */}
                    <div className="col-span-3 flex justify-end pt-2 border-t border-gray-100">
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm transition-all">
                            Submit Ticket
                        </button>
                    </div>
                </form>
            </div>

            {/* --- LIST SECTION --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Tabs & Search */}
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="flex bg-gray-200/50 p-1 rounded-lg overflow-x-auto">
                        <button onClick={() => setActiveTab('my_created')} className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${activeTab === 'my_created' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            <Send size={16} /> My Created
                        </button>
                        <div className="w-px bg-gray-300 mx-1 h-6 self-center opacity-50"></div>
                        <button onClick={() => setActiveTab('team_pending')} className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${activeTab === 'team_pending' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            <Inbox size={16} /> Team Pending
                        </button>
                        <button onClick={() => setActiveTab('team_completed')} className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${activeTab === 'team_completed' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            <Archive size={16} /> Team Completed
                        </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase">Subject</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase">Priority</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase">Asset</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase">Tech</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase">Creator</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayRequests.map(r => (
                                <tr key={r.request_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-gray-900">{r.subject}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{r.team_name || 'No Team'}</p>
                                    </td>

                                    {/* STATUS COLUMN */}
                                    <td className="px-6 py-4">
                                        <div className="relative inline-block w-36">
                                            {statusLoading === r.request_id ? (
                                                <div className="flex items-center gap-2 text-xs text-gray-500"><Loader className="w-3 h-3 animate-spin" /> Updating...</div>
                                            ) : canEditRequest(r) ? (
                                                /* EDITABLE DROPDOWN (For Technician/Admin) */
                                                <select
                                                    value={r.status}
                                                    onChange={(e) => handleStatusUpdate(r.request_id, e.target.value)}
                                                    className={`w-full pl-2 pr-6 py-1 text-xs font-semibold rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusStyle(r.status)}`}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Repaired">Repaired</option>
                                                    <option value="Scrap">Scrap</option>
                                                </select>
                                            ) : (
                                                /* READ ONLY BADGE (For Everyone Else) */
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(r.status)}`}>
                                                    {r.status}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(r.priority)}`}>{r.priority}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{r.equipment_name || 'Workplace'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{r.technician_name || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {r.created_by_name}
                                        {r.created_by === user.id && <span className="ml-1 text-xs text-indigo-600 font-bold">(You)</span>}
                                    </td>
                                </tr>
                            ))}
                            {displayRequests.length === 0 && !loading && (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No requests found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}