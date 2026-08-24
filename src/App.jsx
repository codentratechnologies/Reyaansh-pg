import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import PgManagement from './pages/pg/PgManagement';
import AddPg from './pages/pg/AddPg';
import ViewPg from './pages/pg/ViewPg';
import EditPg from './pages/pg/EditPg';
import MemberManagement from './pages/members/MemberManagement';
import MemberRegistration from './pages/public/MemberRegistration';
import ViewMember from './pages/members/ViewMember';
import EditMember from './pages/members/EditMember';
import Checkout from './pages/checkout/Checkout';
import Profile from './pages/profile/Profile';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><AuthLayout><ForgotPassword /></AuthLayout></PublicRoute>} />
        
        {/* Public Routes */}
        <Route path="/checkout" element={<Checkout />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/pg-management" element={<ProtectedRoute><DashboardLayout><PgManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/pg-management/add" element={<ProtectedRoute><DashboardLayout><AddPg /></DashboardLayout></ProtectedRoute>} />
        <Route path="/pg-management/view/:id" element={<ProtectedRoute><DashboardLayout><ViewPg /></DashboardLayout></ProtectedRoute>} />
        <Route path="/pg-management/edit/:id" element={<ProtectedRoute><DashboardLayout><EditPg /></DashboardLayout></ProtectedRoute>} />
        <Route path="/member-management" element={<ProtectedRoute><DashboardLayout><MemberManagement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/register" element={<MemberRegistration />} />
        <Route path="/member-management/view/:id" element={<ProtectedRoute><DashboardLayout><ViewMember /></DashboardLayout></ProtectedRoute>} />
        <Route path="/member-management/edit/:id" element={<ProtectedRoute><DashboardLayout><EditMember /></DashboardLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
