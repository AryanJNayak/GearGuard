import React from 'react';
import { User, Mail, Shield, LogOut, Briefcase } from 'lucide-react';

export default function ProfilePage({ user, logout }) {
    if (!user) return null;
    console.log(user)

    return (
        <div className="max-w-2xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Decorative Header Background */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-800"></div>

                <div className="px-8 pb-8">
                    {/* Avatar / Icon */}
                    <div className="relative -mt-12 mb-6">
                        <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-md">
                            <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* User Info Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 border ${user.is_admin
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                            {user.is_admin ? 'Administrator' : 'Team Member'}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-4 mb-8">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                                <p className="text-gray-900 font-medium">{user.email || 'user@example.com'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">User ID</p>
                                <p className="text-gray-900 font-medium">{user.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Account Status</p>
                                <p className="text-green-600 font-medium flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Active
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Action */}
                    <div className="border-t border-gray-100 pt-6">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}