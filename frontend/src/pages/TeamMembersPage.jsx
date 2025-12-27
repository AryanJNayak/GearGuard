import React, { useEffect, useState } from 'react';
import {
    Users,
    UserPlus,
    Briefcase,
    Shield,
    Search,
    User
} from 'lucide-react';

export default function TeamMembersPage() {
    // --- State ---
    const [teamId, setTeamId] = useState('');
    const [userId, setUserId] = useState('');
    const [isManager, setIsManager] = useState(false);

    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('token');

    // --- Effects ---
    useEffect(() => {
        fetchData();
        fetchMembers();
        // eslint-disable-next-line
    }, []);

    // --- API Handlers ---
    const fetchData = async () => {
        try {
            const [tRes, uRes] = await Promise.all([
                fetch('/api/teams', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (tRes.ok) setTeams(await tRes.json());
            if (uRes.ok) setUsers(await uRes.json());
        } catch (e) { console.error(e); }
    };

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/teams/members', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setMembers(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!teamId || !userId) return alert("Please select both a team and a user.");

        setLoading(true);
        try {
            const res = await fetch('/api/teams/add-member', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ team_id: teamId, user_id: userId, is_manager: isManager })
            });
            const d = await res.json();
            if (res.ok) {
                fetchMembers();
                setUserId(''); // Reset user but keep team for faster entry
                setIsManager(false);
            } else {
                alert(d.message || 'Error adding member');
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    // --- Filtering ---
    const filteredMembers = members.filter(m =>
        m.technician_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* 1. Page Header */}
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                    <Users className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team Assignments</h1>
                    <p className="text-gray-500 text-sm">Manage who belongs to which team and their roles.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 2. Add Member Form (Left Panel) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                            <UserPlus size={18} className="text-indigo-600" />
                            Assign Member
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">Add a user to a specific team.</p>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Team</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <select
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 text-gray-900"
                                        value={teamId}
                                        onChange={(e) => setTeamId(e.target.value)}
                                    >
                                        <option value="">-- Choose Team --</option>
                                        {teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <select
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 text-gray-900"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    >
                                        <option value="">-- Choose User --</option>
                                        {users.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-900 flex items-center gap-2 cursor-pointer">
                                    <Shield size={16} className="text-purple-600" />
                                    Manager Access
                                </label>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                    checked={isManager}
                                    onChange={(e) => setIsManager(e.target.checked)}
                                />
                            </div>

                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all active:scale-95 flex justify-center items-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Assigning...' : 'Add to Team'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 3. Members List (Right Panel) */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <Search className="text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or team..."
                            className="flex-1 border-none focus:ring-0 text-sm text-gray-900 placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Member Name</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Team</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredMembers.map((m, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {m.technician_name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{m.technician_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded-md">
                                                    {m.team_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {m.team_manager ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                        Manager
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        Technician
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {m.email}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredMembers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No members found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}