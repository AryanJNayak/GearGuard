import React, { useEffect, useState } from 'react';
import { Users, Plus, Search, Briefcase, Building2 } from 'lucide-react';

export default function TeamsPage() {
    // --- State ---
    const [name, setName] = useState('');
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('token');

    // --- Effects ---
    useEffect(() => {
        fetchTeams();
        // eslint-disable-next-line
    }, []);

    // --- API Handlers ---
    const fetchTeams = async () => {
        try {
            const res = await fetch('/api/teams', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                setTeams(data);
            }
        } catch (e) {
            console.error("Failed to fetch teams", e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ team_name: name })
            });
            const d = await res.json();
            if (res.ok) {
                setName('');
                fetchTeams();
            } else {
                alert(d.message || 'Error creating team');
            }
        } catch (e) {
            alert('Connection error');
        } finally {
            setLoading(false);
        }
    };

    // --- Filter Logic ---
    const filteredTeams = teams.filter(t =>
        t.team_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* 1. Page Header */}
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                    <Users className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Teams</h1>
                    <p className="text-gray-500 text-sm">Manage departments and operational groups.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 2. Create Team Form (Left Column) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                            <Plus size={18} className="text-indigo-600" />
                            Create Team
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">Add a new department to your organization.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                    <input
                                        className="w-full pl-9 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                                        placeholder="e.g. Engineering, Logistics"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all active:scale-95 flex justify-center items-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Add Team'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 3. Team List (Right Column) */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <Search className="text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            className="flex-1 border-none focus:ring-0 text-sm text-gray-900 placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTeams.map(t => (
                            <div key={t.team_id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group cursor-default">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{t.team_name}</h3>
                                            <p className="text-xs text-gray-500">Active Team</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredTeams.length === 0 && (
                            <div className="col-span-full bg-white rounded-xl border border-gray-100 border-dashed p-10 text-center">
                                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <Search className="text-gray-400 w-6 h-6" />
                                </div>
                                <h3 className="text-gray-900 font-medium">No teams found</h3>
                                <p className="text-gray-500 text-sm mt-1">Try creating a new one or adjust your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}