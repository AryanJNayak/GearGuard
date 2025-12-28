import { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, UserPlus, Shield, User } from 'lucide-react';

const TeamMembersModal = ({ team, onClose }) => {
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [isManager, setIsManager] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch Team Members & All Users (for dropdown)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [membersRes, usersRes] = await Promise.all([
                    api.get(`/teams/members/${team.team_id}`),
                    api.get('/users') // We created this endpoint in Phase 2
                ]);
                setMembers(membersRes.data);
                setAllUsers(usersRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [team.team_id]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            // Logic: Backend handles demotion if is_manager is true
            await api.post('/teams/add-member', {
                team_id: team.team_id,
                user_id: selectedUser,
                is_manager: isManager
            });

            // Refresh members list
            const res = await api.get(`/teams/members/${team.team_id}`);
            setMembers(res.data);
            setSelectedUser('');
            setIsManager(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add member');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Modal Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">
                        Manage Team: <span className="text-blue-600">{team.team_name}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* Add Member Form */}
                    <form onSubmit={handleAddMember} className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
                        <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                            <UserPlus size={16} /> Add New Member
                        </h4>
                        <div className="flex gap-3">
                            <select
                                className="flex-1 p-2 border rounded text-sm"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                required
                            >
                                <option value="">Select User...</option>
                                {allUsers.map(u => (
                                    <option key={u.user_id} value={u.user_id}>
                                        {u.name} ({u.email})
                                    </option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2 bg-white px-3 border rounded">
                                <input
                                    type="checkbox"
                                    id="managerCheck"
                                    checked={isManager}
                                    onChange={(e) => setIsManager(e.target.checked)}
                                />
                                <label htmlFor="managerCheck" className="text-sm text-gray-700 cursor-pointer">
                                    Manager
                                </label>
                            </div>

                            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                                Add
                            </button>
                        </div>
                        {isManager && (
                            <p className="text-xs text-orange-600">
                                Warning: Adding a new manager will demote the existing manager.
                            </p>
                        )}
                    </form>

                    {/* Members List */}
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Current Members</h4>
                        {loading ? <p>Loading...</p> : (
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {members.map(member => (
                                            <tr key={member.user_id} className="hover:bg-gray-50">
                                                <td className="p-3">{member.name}</td>
                                                <td className="p-3 text-gray-500">{member.email}</td>
                                                <td className="p-3">
                                                    {member.team_manager ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                                            <Shield size={12} /> Manager
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                            <User size={12} /> Technician
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {members.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="p-4 text-center text-gray-500">No members assigned yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamMembersModal;