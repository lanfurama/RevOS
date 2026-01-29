
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart3, Filter, Building2, ChevronDown, Database, Activity, Menu, X } from 'lucide-react';
import { ExecutiveScorecard } from './components/ExecutiveScorecard';
import { ChannelPerformance } from './components/ChannelPerformance';
import { DataManager } from './components/DataManager';
import { PropertyFilter } from './types';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/Toast';

type TabId = 'scorecard' | 'performance' | 'data';
const TAB_IDS: TabId[] = ['scorecard', 'performance', 'data'];

function getTabFromSearch(): TabId | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const t = params.get('tab');
  return TAB_IDS.includes(t as TabId) ? (t as TabId) : null;
}

function setTabInUrl(tab: TabId) {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', tab);
  window.history.replaceState({}, '', url.pathname + url.search);
}

function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<'scorecard' | 'performance' | 'data'>(() => getTabFromSearch() ?? 'scorecard');
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>(PropertyFilter.ALL);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => {
      const t = getTabFromSearch();
      if (t) setActiveTab(t);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleTabChange = (tab: 'scorecard' | 'performance' | 'data') => {
    setActiveTab(tab);
    setTabInUrl(tab);
    setIsMobileMenuOpen(false);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'scorecard': return 'Executive Overview';
      case 'performance': return 'Performance Analysis';
      case 'data': return 'Data Management';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-900 overflow-hidden">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-gray-300 transform transition-transform duration-300 ease-in-out border-r border-slate-800
        md:translate-x-0 md:w-56
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded">
               <Activity size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-widest text-white uppercase font-sans">RevOS</span>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 mt-2 overflow-y-auto" aria-label="Main navigation">
          <button 
            onClick={() => handleTabChange('scorecard')}
            aria-current={activeTab === 'scorecard' ? 'page' : undefined}
            className={`flex items-center gap-3 w-full px-3 py-3 md:py-2 rounded text-sm md:text-xs font-medium transition-colors ${
              activeTab === 'scorecard' 
              ? 'bg-blue-700 text-white' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} className="md:w-4 md:h-4" aria-hidden />
            <span>Executive Scorecard</span>
          </button>
          
          <button 
             onClick={() => handleTabChange('performance')}
             aria-current={activeTab === 'performance' ? 'page' : undefined}
             className={`flex items-center gap-3 w-full px-3 py-3 md:py-2 rounded text-sm md:text-xs font-medium transition-colors ${
              activeTab === 'performance' 
              ? 'bg-blue-700 text-white' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 size={18} className="md:w-4 md:h-4" aria-hidden />
            <span>Channel Performance</span>
          </button>

          <button 
             onClick={() => handleTabChange('data')}
             aria-current={activeTab === 'data' ? 'page' : undefined}
             className={`flex items-center gap-3 w-full px-3 py-3 md:py-2 rounded text-sm md:text-xs font-medium transition-colors ${
              activeTab === 'data' 
              ? 'bg-blue-700 text-white' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database size={18} className="md:w-4 md:h-4" aria-hidden />
            <span>Data Management</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider hidden md:block">
          RevOS v3.1 Mobile Ready
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-56 h-screen">
        
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-300 sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
             {/* Mobile Menu Button */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded"
               aria-label="Open menu"
             >
               <Menu size={20} aria-hidden />
             </button>

             <div className="flex items-center gap-2 text-sm text-gray-600">
               <span className="font-semibold text-gray-900 hidden sm:inline">Dashboard</span>
               <span className="text-gray-400 hidden sm:inline">/</span>
               <span className="font-medium truncate max-w-[150px] sm:max-w-none">{getPageTitle()}</span>
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded border border-gray-300 shadow-sm hover:border-blue-400 transition-colors max-w-[160px] md:max-w-none">
              <Building2 size={14} className="text-gray-500 flex-shrink-0" />
              <select 
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value as PropertyFilter)}
                className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer w-full md:min-w-[140px]"
                aria-label="Select property"
              >
                <option value={PropertyFilter.ALL}>All Properties</option>
                <option value={PropertyFilter.P001}>Seaside Da Nang</option>
                <option value={PropertyFilter.P002}>City Center Hotel</option>
              </select>
              <ChevronDown size={12} className="text-gray-400 flex-shrink-0 hidden sm:block" />
            </div>
            
            {activeTab !== 'data' && (
              <button className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-500 shadow-sm hidden sm:block" aria-label="Filter">
                <Filter size={14} aria-hidden />
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content Area - fade transition on tab change */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <div key={activeTab} className="tab-fade-in">
            {activeTab === 'scorecard' && (
              <ExecutiveScorecard filter={propertyFilter} />
            )}
            {activeTab === 'performance' && (
              <ChannelPerformance onNavigateToData={() => handleTabChange('data')} />
            )}
            {activeTab === 'data' && (
              <DataManager />
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <DashboardLayout />
        <ToastContainer />
      </ToastProvider>
    </DataProvider>
  );
}

export default App;
