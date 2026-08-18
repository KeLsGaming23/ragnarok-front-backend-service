/**
 * KelsGaming RO - Main Application Root & Router
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DownloadsPage from './pages/DownloadsPage';
import ServerInfoPage from './pages/ServerInfoPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPlayersPage from './pages/admin/AdminPlayersPage';
import AdminAccountsPage from './pages/admin/AdminAccountsPage';
import AdminCharactersPage from './pages/admin/AdminCharactersPage';
import AdminGuildsPage from './pages/admin/AdminGuildsPage';
import AdminItemDispatchPage from './pages/admin/AdminItemDispatchPage';
import AdminItemDbPage from './pages/admin/AdminItemDbPage';
import PublicItemDbPage from './pages/PublicItemDbPage';
import PublicBuildStudioPage from './pages/PublicBuildStudioPage';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-ro-bg text-ro-text-primary selection:bg-ro-gold selection:text-black">
      {/* Render Main Navigation only on standard player pages */}
      {!isAdminPath && <Navbar />}

      {/* Dynamic Route View */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/download" element={<DownloadsPage />} />
          <Route path="/server-info" element={<ServerInfoPage />} />
          <Route path="/database/items" element={<PublicItemDbPage />} />
          <Route path="/database" element={<PublicItemDbPage />} />
          <Route path="/items" element={<PublicItemDbPage />} />
          <Route path="/build-studio" element={<PublicBuildStudioPage />} />
          <Route path="/builds/create" element={<PublicBuildStudioPage />} />
          <Route path="/builder" element={<PublicBuildStudioPage />} />
          
          {/* Authenticated Player Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Administrator Control Portal */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/players"
            element={
              <AdminRoute>
                <AdminPlayersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/accounts"
            element={
              <AdminRoute>
                <AdminAccountsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/characters"
            element={
              <AdminRoute>
                <AdminCharactersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/guilds"
            element={
              <AdminRoute>
                <AdminGuildsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/items"
            element={
              <AdminRoute>
                <AdminItemDbPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/item-database"
            element={
              <AdminRoute>
                <AdminItemDbPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dispatch"
            element={
              <AdminRoute>
                <AdminItemDispatchPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/item-dispatch"
            element={
              <AdminRoute>
                <AdminItemDispatchPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Render Main Footer only on standard player pages */}
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
