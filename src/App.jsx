import React, { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { ContactsProvider } from './context/ContactsContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/Layout';
import { ThreeScene } from './components/ThreeScene';
import { ContactForm } from './components/ContactForm';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('visualization');

  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
}

export default App;
