
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import HomePage from './pages/HomePage.tsx'; // Import new HomePage
import DashboardPage from './pages/DashboardPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import DiscoverPage from './pages/DiscoverPage.tsx';
import AnalyticsPage from './pages/AnalyticsPage.tsx';
import ComparePage from './pages/ComparePage.tsx';
import SavedInfluencersPage from './pages/SavedInfluencersPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import HelpPage from './pages/HelpPage.tsx'; // Reverted import path to relative
import { Toaster } from './components/Toaster.tsx'; 

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen bg-transparent overflow-hidden"> {/* Changed background to transparent */}
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light dark:bg-neutral-darker p-6 transition-colors duration-300"> {/* Adjusted main background */}
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} /> {/* Default to home */}
              <Route path="/home" element={<HomePage />} /> {/* New home route */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/analytics/:influencerId" element={<AnalyticsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/saved" element={<SavedInfluencersPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </HashRouter>
  );
};

export default App;