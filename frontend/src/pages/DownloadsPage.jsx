/**
 * Game Client Downloads Page
 */
import React, { useState, useEffect } from 'react';
import { serverService } from '../services/serverService';
import DownloadHero from '../components/download/DownloadHero';
import InstallationSteps from '../components/download/InstallationSteps';
import SystemRequirements from '../components/download/SystemRequirements';
import Troubleshooting from '../components/download/Troubleshooting';

export default function DownloadsPage() {
  const [downloadData, setDownloadData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDownloads() {
      try {
        const data = await serverService.getDownloads();
        setDownloadData(data);
      } catch (err) {
        console.warn('Could not fetch download metadata:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDownloads();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Download Card & Mirrors */}
      <DownloadHero downloadData={downloadData} />

      {/* 4-Step Installation Guide */}
      <InstallationSteps />

      {/* System Requirements */}
      <SystemRequirements reqs={downloadData?.systemRequirements} />

      {/* Troubleshooting FAQs */}
      <Troubleshooting />
    </div>
  );
}
