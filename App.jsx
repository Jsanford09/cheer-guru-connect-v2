import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext.jsx';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import MainContent from './components/MainContent.jsx';
import JobForm from './components/JobForm.jsx';
import ServiceProviderForm from './components/ServiceProviderForm.jsx';
import { initializeSampleData } from './data/sampleData.js';
import './App.css';

// Main App Content Component
const AppContent = () => {
  const { actions } = useApp();

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData(actions);
  }, [actions]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <Header />
      
      {/* Filter bar */}
      <FilterBar />
      
      {/* Main content area */}
      <MainContent />
      
      {/* Modal forms */}
      <JobForm />
      <ServiceProviderForm />
      
      {/* Footer */}
      <footer className="bg-[#002147] text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand section */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Cheer Guru Connect</h3>
              <p className="text-gray-300 mb-4">
                Connecting cheerleading and dance professionals with teams and organizations nationwide. 
                Powered by Cheer Guru Nation, your trusted partner in building championship programs.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-[#008080] font-semibold">Powered by Cheer Guru Nation</span>
              </div>
            </div>
            
            {/* Quick links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#008080] transition-colors">Find Jobs</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">Find Providers</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">Join as Provider</a></li>
              </ul>
            </div>
            
            {/* Contact info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-[#008080] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 Cheer Guru Connect. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#008080] transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-[#008080] transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-[#008080] transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-[#008080] transition-colors">
                <span className="sr-only">YouTube</span>
                📺
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component with Provider
const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

