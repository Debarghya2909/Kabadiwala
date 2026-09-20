import React, { useState, useEffect } from 'react';
import { EnterpriseHeader } from './components/EnterpriseHeader';
import { EnterpriseFooter } from './components/EnterpriseFooter';
import { LoginView } from './components/LoginView';
import { HouseholdPortal } from './components/HouseholdPortal';
import { CollectorPortal } from './components/CollectorPortal';
import { ImpactDashboard } from './components/ImpactDashboard';
import {
  AppView,
  AuthUser,
  HouseholdTab,
  CollectorTab,
  Pickup,
  Language,
} from './types';
import {
  readPickupsFromStorage,
  savePickupsToStorage,
  readAuthUserFromStorage,
  saveAuthUserToStorage,
  readLanguageFromStorage,
  saveLanguageToStorage,
  defaultHouseholdUser,
  defaultCollectorUser,
  UPDATE_EVENT_PICKUPS,
  UPDATE_EVENT_AUTH,
} from './data/mockData';

export function App() {
  // Language State
  const [language, setLanguage] = useState<Language>(() => {
    return readLanguageFromStorage();
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    saveLanguageToStorage(lang);
  };

  // Authentication state
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = readAuthUserFromStorage();
    return saved || null;
  });

  // Current view
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedUser = readAuthUserFromStorage();
    if (!savedUser) return 'login';
    return savedUser.role === 'collector' ? 'collector' : 'household';
  });

  // Data state
  const [pickups, setPickups] = useState<Pickup[]>(readPickupsFromStorage);

  // Sub-tabs
  const [householdTab, setHouseholdTab] = useState<HouseholdTab>('schedule');
  const [collectorTab, setCollectorTab] = useState<CollectorTab>('queue');
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  // Synchronize across browser tabs and events
  useEffect(() => {
    const syncAll = () => {
      setPickups(readPickupsFromStorage());
      const user = readAuthUserFromStorage();
      if (user) {
        setAuthUser(user);
      }
    };

    window.addEventListener('storage', syncAll);
    window.addEventListener(UPDATE_EVENT_PICKUPS, syncAll);
    window.addEventListener(UPDATE_EVENT_AUTH, syncAll);

    return () => {
      window.removeEventListener('storage', syncAll);
      window.removeEventListener(UPDATE_EVENT_PICKUPS, syncAll);
      window.removeEventListener(UPDATE_EVENT_AUTH, syncAll);
    };
  }, []);

  // Update pickups wrapper
  const handleUpdatePickups = (next: Pickup[]) => {
    setPickups(next);
    savePickupsToStorage(next);
  };

  // Login handler
  const handleLogin = (user: AuthUser, initialView: AppView) => {
    setAuthUser(user);
    saveAuthUserToStorage(user);
    setCurrentView(initialView);
    if (initialView === 'household') {
      setHouseholdTab('schedule');
    } else if (initialView === 'collector') {
      setCollectorTab('queue');
    }
  };

  // Explicit Sign Out button: returns cleanly to the login selection screen
  const handleSignOut = () => {
    setAuthUser(null);
    saveAuthUserToStorage(null);
    setCurrentView('login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100/70 text-slate-800 antialiased font-sans">
      {/* Enterprise Navigation Header with subtle backdrop-blur and thin bottom border */}
      <EnterpriseHeader
        authUser={authUser}
        onSignOut={handleSignOut}
        language={language}
        onLanguageChange={handleLanguageChange}
        currentView={currentView}
        onNavigateView={setCurrentView}
      />

      {/* Main Viewport */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {currentView === 'login' && (
          <LoginView
            onLogin={handleLogin}
            onExploreESG={() => setCurrentView('impact')}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {currentView === 'household' && (
          <HouseholdPortal
            pickups={pickups}
            onUpdatePickups={handleUpdatePickups}
            authUser={authUser || defaultHouseholdUser}
            tab={householdTab}
            onSelectTab={setHouseholdTab}
            activeTrackingId={activeTrackingId}
            onSelectTrackingId={setActiveTrackingId}
            language={language}
          />
        )}

        {currentView === 'collector' && (
          <CollectorPortal
            pickups={pickups}
            onUpdatePickups={handleUpdatePickups}
            authUser={authUser || defaultCollectorUser}
            tab={collectorTab}
            onSelectTab={setCollectorTab}
            language={language}
          />
        )}

        {currentView === 'impact' && (
          <ImpactDashboard
            pickups={pickups}
            onBack={() => {
              if (authUser) {
                setCurrentView(authUser.role === 'collector' ? 'collector' : 'household');
              } else {
                setCurrentView('login');
              }
            }}
            language={language}
            onNavigateView={setCurrentView}
          />
        )}
      </main>

      {/* Clean Minimal Enterprise Footer */}
      <EnterpriseFooter />
    </div>
  );
}

export default App;
