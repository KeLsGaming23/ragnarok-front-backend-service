/**
 * KelsGaming RO - Main Application Root & Router
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DownloadsPage from './pages/DownloadsPage';
import ServerInfoPage from './pages/ServerInfoPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-ro-bg text-ro-text-primary selection:bg-ro-gold selection:text-black">
          {/* Main Top Navigation */}
          <Navbar />

          {/* Dynamic Route View */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/download" element={<DownloadsPage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
              <Route path="/server-info" element={<ServerInfoPage />} />
              
              {/* Authenticated Player Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Ragnarok Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
