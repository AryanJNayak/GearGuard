import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Users, ArrowRight } from 'lucide-react';
import TeamMembersModal from '../components/TeamMembersModal';

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null); // Controls Modal
    const [loading, setLoading] = useState(true);

    // Fetch Teams
    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/teams');
            setTeams(data);
        } catch (error) {
            console.error("Error fetching teams", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    // Create Team
    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        try {
            await api.post('/teams/create', { team_name: newTeamName });
            setNewTeamName('');
            fetchTeams(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create team');
        }
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
                    <p className="text-gray-500 text-sm">Create maintenance teams and assign managers.</p>
                </div>
            </div>

            {/* Create Team Form */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <form onSubmit={handleCreateTeam} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Team Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Electrical Maintenance"
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                        <Plus size={18} /> Create Team
                    </button>
                </form>
            </div>

            {/* Teams Grid */}
            {loading ? <div>Loading teams...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map(team => (
                        <div key={team.team_id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                    <Users size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800">{team.team_name}</h3>
                            </div>

                            <button
                                onClick={() => setSelectedTeam(team)}
                                className="w-full py-2 px-4 bg-gray-50 text-blue-600 font-medium rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-300 flex justify-between items-center group"
                            >
                                Manage Members
                                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Managing Members */}
            {selectedTeam && (
                <TeamMembersModal
                    team={selectedTeam}
                    onClose={() => setSelectedTeam(null)}
                />
            )}
        </div>
    );
};

export default TeamsPage;