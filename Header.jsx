import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useApp } from '../contexts/AppContext.jsx';
import { ProgramType } from '../types/index.js';
import { Megaphone, Users, Plus, Search } from 'lucide-react';

const Header = () => {
  const { 
    activeTab, 
    activeProgram, 
    actions: { setActiveTab, setActiveProgram, showJobForm, showProviderForm } 
  } = useApp();

  return (
    <header className="gradient-primary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Top section with logo and main navigation */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo and branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full">
              <Megaphone className="h-8 w-8 text-[#002147]" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl lg:text-3xl font-bold">Cheer Guru Connect</h1>
              <p className="text-sm opacity-90">Powered by Cheer Guru Nation</p>
            </div>
          </div>

          {/* Main navigation tabs */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setActiveTab('jobs')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'jobs' 
                  ? 'bg-white text-[#002147] shadow-lg' 
                  : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#002147]'
              }`}
            >
              <Search className="h-4 w-4 mr-2" />
              Find Jobs
            </Button>
            <Button
              onClick={() => setActiveTab('providers')}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'providers' 
                  ? 'bg-white text-[#002147] shadow-lg' 
                  : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#002147]'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Find Providers
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={showJobForm}
              className="bg-[#008080] hover:bg-[#20b2aa] text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
            <Button
              onClick={showProviderForm}
              className="bg-transparent text-white border-2 border-[#008080] hover:bg-[#008080] px-4 py-2 rounded-full font-semibold transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Join as Provider
            </Button>
          </div>
        </div>

        {/* Program type tabs */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex space-x-1">
            <button
              onClick={() => setActiveProgram(ProgramType.CHEERLEADING)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeProgram === ProgramType.CHEERLEADING
                  ? 'bg-white text-[#002147] shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              🏆 Cheerleading
            </button>
            <button
              onClick={() => setActiveProgram(ProgramType.DANCE_POM)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeProgram === ProgramType.DANCE_POM
                  ? 'bg-white text-[#002147] shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              💃 Dance/Pom
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

