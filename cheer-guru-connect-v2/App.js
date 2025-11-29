import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import UserTypeSelector from './components/UserTypeSelector';
import FilterBar from './components/FilterBar';
import MainContent from './components/MainContent';
import JobForm from './components/JobForm';
import ProviderForm from './components/ProviderForm';
import BackendStatus from './components/BackendStatus';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />
        
        {/* Backend Status Banner */}
        <BackendStatus />
        
        {/* User Type Selector */}
        <UserTypeSelector />
        
        {/* Filter Bar */}
        <FilterBar />
        
        {/* Main Content */}
        <MainContent />
        
        {/* Modals */}
        <JobForm />
        <ProviderForm />
      </div>
    </AppProvider>
  );
}

export default App;
