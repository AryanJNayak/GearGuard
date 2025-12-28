import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Signup from './pages/Signup';
import ProfilePage from './pages/ProfilePage';
import EquipmentPage from './pages/EquipmentPage';
import CategoriesPage from './pages/CategoriesPage';

import TeamsPage from './pages/TeamsPage';
import RequestsPage from './pages/RequestsPage';
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Layout */}
        <Route element={<Layout />}>
          {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}

          {/* 2. UPDATE EQUIPMENT ROUTE */}
          <Route path="/equipment" element={
            <ProtectedRoute>
              <EquipmentPage />  {/* <-- Replaces placeholder */}
            </ProtectedRoute>
          } />


          {/* 3. UPDATE CATEGORIES ROUTE */}
          <Route path="/categories" element={
            <ProtectedRoute adminOnly={true}>
              <CategoriesPage /> {/* <-- Replaces placeholder */}
            </ProtectedRoute>
          } />
          {/* Routes accessible to ALL logged-in users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <RequestsPage />  {/* <-- REPLACED PLACEHOLDER */}
            </ProtectedRoute>
          } />
          <Route path="/teams" element={
            <ProtectedRoute adminOnly={true}>
              <TeamsPage /> {/* Update this line */}
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute>
              <div className="p-4">Requests Page (Coming Soon)</div>
            </ProtectedRoute>
          } />
          <Route path="/equipment" element={
            <ProtectedRoute>
              <div className="p-4">Equipment Page (Coming Soon)</div>
            </ProtectedRoute>
          } />

          {/* Routes accessible ONLY to Admins */}
          <Route path="/teams" element={
            <ProtectedRoute adminOnly={true}>
              <div className="p-4">Teams Management (Coming Soon)</div>
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute adminOnly={true}>
              <div className="p-4">Categories Management (Coming Soon)</div>
            </ProtectedRoute>
          } />

        </Route>

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;