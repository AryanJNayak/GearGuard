import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { User, Mail, Lock, Save, Shield } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // Load current user data into form
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        // Basic Validation
        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password // Backend ignores this if empty
            };

            const { data } = await api.put('/users/profile', payload);

            // Update Global Context & LocalStorage
            updateUser(data.user);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); // Clear password fields
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="text-blue-600" /> Account Settings
            </h1>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">

                {/* User Badge Info */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Shield size={14} />
                            <span>{user?.is_admin ? 'Administrator' : 'Team Member'}</span>
                        </div>
                    </div>
                </div>

                {/* Feedback Message */}
                {message.text && (
                    <div className={`p-4 mb-6 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400"><User size={18} /></span>
                                <input
                                    type="text" name="name" required
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.name} onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-400"><Mail size={18} /></span>
                                <input
                                    type="email" name="email" required
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400"><Lock size={18} /></span>
                                    <input
                                        type="password" name="password"
                                        placeholder="Leave blank to keep current"
                                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                        value={formData.password} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400"><Lock size={18} /></span>
                                    <input
                                        type="password" name="confirmPassword"
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                        value={formData.confirmPassword} onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;