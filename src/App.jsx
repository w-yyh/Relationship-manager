import React, { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { ContactsProvider } from './context/ContactsContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ThreeScene } from './components/ThreeScene';
import { ContactForm } from './components/ContactForm';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Register } from './components/Register';

function AuthenticatedApp() {
  const [activeTab, setActiveTab] = useState('visualization');
  const { user } = useAuth();

  return (
    <SettingsProvider>
      <ContactsProvider>
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'visualization' && <ThreeScene />}
          {activeTab === 'contacts' && <ContactForm />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'settings' && <Settings />}
        </Layout>
      </ContactsProvider>
    </SettingsProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  if (!user) {
    return isRegistering 
      ? <Register onSwitch={() => setIsRegistering(false)} />
      : <Login onSwitch={() => setIsRegistering(true)} />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
