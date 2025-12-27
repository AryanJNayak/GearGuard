import React from "react";
import { Link } from "react-router-dom";
import {
    Users,
    User,
    Layers,
    Box,
    FileText,
    LayoutDashboard,
    ChevronRight, // Added for better UX
} from "lucide-react";

export default function AdminDashboard() {
    const menuItems = [
        { title: "Teams", path: "/teams", icon: Users, color: "bg-blue-100 text-blue-600", border: "group-hover:border-blue-200" },
        { title: "Team Members", path: "/team-members", icon: User, color: "bg-emerald-100 text-emerald-600", border: "group-hover:border-emerald-200" },
        { title: "Categories", path: "/categories", icon: Layers, color: "bg-violet-100 text-violet-600", border: "group-hover:border-violet-200" },
        { title: "Equipment", path: "/equipment", icon: Box, color: "bg-amber-100 text-amber-600", border: "group-hover:border-amber-200" },
        { title: "Requests", path: "/requests", icon: FileText, color: "bg-rose-100 text-rose-600", border: "group-hover:border-rose-200" },
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50/50 p-6 flex flex-col items-center">
            <div className="w-full max-w-sm">

                {/* Header Section */}
                <div className="mb-8 pl-1">
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
                            <LayoutDashboard size={20} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            Admin Panel
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 font-medium ml-1">Manage your organization</p>
                </div>

                {/* Menu */}
                <div className="space-y-3">
                    {menuItems.map(({ title, path, icon: Icon, color, border }) => (
                        <Link
                            key={title}
                            to={path}
                            className={`
                                group relative flex items-center justify-between
                                bg-white p-3.5 rounded-2xl
                                border border-gray-100 ${border}
                                shadow-[0_2px_8px_rgba(0,0,0,0.04)] 
                                hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] 
                                hover:-translate-y-0.5
                                transition-all duration-300 ease-out
                            `}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon Container */}
                                <div className={`p-3 rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
                                    <Icon size={20} strokeWidth={2.5} />
                                </div>

                                {/* Text */}
                                <div>
                                    <span className="block text-[15px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                                        {title}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow Indicator (Subtle) */}
                            <ChevronRight
                                size={18}
                                className="text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all duration-300"
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}