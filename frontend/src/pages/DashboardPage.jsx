/**
 * Player Dashboard Page
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountService } from '../services/accountService';
import AccountSummary from '../components/dashboard/AccountSummary';
import CharacterRoster from '../components/dashboard/CharacterRoster';
import SecuritySettings from '../components/dashboard/SecuritySettings';
import InventoryViewerModal from '../components/dashboard/InventoryViewerModal';
import ServerStatusWidget from '../components/home/ServerStatusWidget';
import Alert from '../components/common/Alert';
import { Shield, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedCharForInventory, setSelectedCharForInventory] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await accountService.getProfile();
      setProfileData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load player account details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
          <p className="text-ro-text-secondary text-sm font-medium animate-pulse">
            Loading adventurer profile and character roster...
          </p>
        </div>
      ) : (
        <>
          {/* Account Profile Header */}
          <AccountSummary
            account={profileData?.account || user}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
            onLogout={handleLogout}
          />

          {/* Character Roster */}
          <CharacterRoster
            characters={profileData?.characters || []}
            onViewInventory={(char) => setSelectedCharForInventory(char)}
          />

          {/* Live Server Status Section */}
          <div className="pt-6">
            <ServerStatusWidget />
          </div>

          {/* Character Inventory & Storage Modal */}
          <InventoryViewerModal
            character={selectedCharForInventory}
            isOpen={Boolean(selectedCharForInventory)}
            onClose={() => setSelectedCharForInventory(null)}
          />

          {/* Password Change Modal */}
          <SecuritySettings
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
          />
        </>
      )}

    </div>
  );
}
