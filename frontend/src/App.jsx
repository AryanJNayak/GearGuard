import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useLocation
} from "react-router-dom";
import { Shield, ChevronRight } from "lucide-react"; // Removed LogOut/Bell imports

// Components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import TeamsPage from "./pages/TeamsPage";
import TeamMembersPage from "./pages/TeamMembersPage";
import CategoriesPage from "./pages/CategoriesPage";
import EquipmentPage from "./pages/EquipmentPage";
import RequestsPage from "./pages/RequestsPage";
import ProfilePage from "./pages/ProfilePage"; // Import the new page
import ProtectedRoute from "./components/ProtectedRoute";

/* ---------- 1. DASHBOARD LAYOUT (Updated Header) ---------- */
const DashboardLayout = ({ user }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* SIDEBAR - Only for Admins */}
      {user?.is_admin && (
        <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col overflow-y-auto z-20">
          <AdminDashboard />
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* STICKY HEADER */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg md:hidden">
              <Shield className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight md:hidden">GearGuard</h1>

            {/* Desktop Greeting */}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-700">
                Hello, <span className="text-indigo-600">{user?.name || 'User'}</span>
              </h1>
            </div>
          </div>

          {/* Header Actions - CLEANED UP */}
          <div className="flex items-center gap-4">
            {/* User Profile Link - Replaces Logout/Bell */}
            <Link
              to="/profile"
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.is_admin ? 'Administrator' : 'Employee'}</p>
              </div>

              {/* Avatar Circle */}
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

/* ---------- 2. WELCOME PAGE ---------- */
const WelcomePage = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center py-20">
      <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Shield className="w-10 h-10 text-indigo-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GearGuard</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        The centralized platform for managing team equipment, tracking requests, and maintaining operational readiness.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/requests" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 font-medium">
          View Requests
        </Link>
        <Link to="/equipment" className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium">
          Browse Equipment
        </Link>
      </div>
    </div>
  );
}

/* ---------- 3. MAIN APP ---------- */
function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute>
            {/* Passed User, but NOT logout (logout is now inside ProfilePage) */}
            <DashboardLayout user={user} />
          </ProtectedRoute>
        }>
          <Route path="/Welcome" element={<WelcomePage />} />

          {/* NEW PROFILE ROUTE */}
          <Route path="/profile" element={<ProfilePage user={user} logout={logout} />} />

          {/* Admin Routes */}
          <Route path="/teams" element={<ProtectedRoute requiredAdmin><TeamsPage /></ProtectedRoute>} />
          <Route path="/team-members" element={<ProtectedRoute requiredAdmin><TeamMembersPage /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute requiredAdmin><CategoriesPage /></ProtectedRoute>} />

          {/* General Routes */}
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/requests" element={<RequestsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;