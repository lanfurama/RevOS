
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, BarChart3, Building2, ChevronDown, Database, Activity, Menu, X, PanelLeftClose } from 'lucide-react';
import { ExecutiveScorecard } from './components/ExecutiveScorecard';
import { ChannelPerformance } from './components/ChannelPerformance';
import { DataManager } from './components/DataManager';
import { PropertyFilter } from './types';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/Toast';
import { getTrendDateRange } from './services/mockData';

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

const trendRange = getTrendDateRange();

function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<'scorecard' | 'performance' | 'data'>(() => getTabFromSearch() ?? 'scorecard');
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>(PropertyFilter.ALL);
  const [dateFrom, setDateFrom] = useState(trendRange.min);
  const [dateTo, setDateTo] = useState(trendRange.max);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobileMenuOpen = sidebarOpen; // alias for mobile overlay

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
    setSidebarOpen(false);
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
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Toggleable */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-gray-300 transform border-r border-slate-800
        md:w-56
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded">
               <Activity size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-widest text-white uppercase font-sans">RevOS</span>
          </div>
          {/* Close on mobile / Collapse on desktop */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1"
            aria-label="Close menu"
          >
            <X size={20} aria-hidden />
          </button>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="hidden md:flex text-gray-400 hover:text-white p-1 rounded hover:bg-slate-800"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={20} aria-hidden />
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
            <span>Dashboard 1</span>
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
            <span>Dashboard 2</span>
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
      <main className={`flex-1 flex flex-col min-w-0 h-screen ${sidebarOpen ? 'md:ml-56' : 'md:ml-0'}`}>
        
        {/* Top Header */}
        <header className="min-h-14 bg-white border-b border-gray-300 sticky top-0 z-20 flex items-center justify-between py-3 px-3 sm:px-4 md:px-6 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
             {!sidebarOpen && (
               <button 
                 onClick={() => setSidebarOpen(true)}
                 className="p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded touch-manipulation"
                 aria-label="Open sidebar"
               >
                 <Menu size={20} aria-hidden />
               </button>
             )}

             <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 min-w-0">
               <span className="font-semibold text-gray-900 hidden sm:inline">Dashboard</span>
               <span className="text-gray-400 hidden sm:inline">/</span>
               <span className="font-medium truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">{getPageTitle()}</span>
             </div>
          </div>
        </header>

        {/* Scrollable Content Area - fade transition on tab change */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6 overscroll-behavior-contain">
          <div key={activeTab} className="tab-fade-in space-y-4">
            {activeTab === 'scorecard' && (
              <>
                {/* Filter bar - inside main content, only for Dashboard 1 */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-sm border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-2 sm:py-1.5 rounded border border-gray-300 bg-gray-50/50 min-h-[40px] min-w-[140px] sm:min-w-[160px]">
                    <Building2 size={14} className="text-gray-500 flex-shrink-0" />
                    <select 
                      value={propertyFilter}
                      onChange={(e) => setPropertyFilter(e.target.value as PropertyFilter)}
                      className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer w-full min-h-[32px] touch-manipulation"
                      aria-label="Select property"
                    >
                      <option value={PropertyFilter.ALL}>All Properties</option>
                      <option value={PropertyFilter.P001}>Furama Resort Danang</option>
                      <option value={PropertyFilter.P002}>Furama Villas Danang</option>
                    </select>
                    <ChevronDown size={12} className="text-gray-400 flex-shrink-0 hidden sm:block" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 px-2 py-2 sm:py-1.5 rounded border border-gray-300 bg-gray-50/50 min-h-[40px]">
                    <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium whitespace-nowrap w-6 sm:w-auto">Từ</span>
                      <input
                        type="date"
                        value={dateFrom}
                        min={trendRange.min}
                        max={trendRange.max}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-gray-700 outline-none flex-1 min-w-0 min-h-[32px] touch-manipulation border-0 p-0"
                        aria-label="From date"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium whitespace-nowrap w-6 sm:w-auto">đến</span>
                      <input
                        type="date"
                        value={dateTo}
                        min={trendRange.min}
                        max={trendRange.max}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-gray-700 outline-none flex-1 min-w-0 min-h-[32px] touch-manipulation border-0 p-0"
                        aria-label="To date"
                      />
                    </div>
                  </div>
                </div>
                <ExecutiveScorecard 
                  filter={propertyFilter} 
                  dateRange={dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined} 
                />
              </>
            )}
            {activeTab === 'performance' && (
              <>
                {/* Filter bar - inside main content, for Dashboard 2 */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-sm border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-2 sm:py-1.5 rounded border border-gray-300 bg-gray-50/50 min-h-[40px] min-w-[140px] sm:min-w-[160px]">
                    <Building2 size={14} className="text-gray-500 flex-shrink-0" />
                    <select 
                      value={propertyFilter}
                      onChange={(e) => setPropertyFilter(e.target.value as PropertyFilter)}
                      className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer w-full min-h-[32px] touch-manipulation"
                      aria-label="Select property"
                    >
                      <option value={PropertyFilter.ALL}>All Properties</option>
                      <option value={PropertyFilter.P001}>Furama Resort Danang</option>
                      <option value={PropertyFilter.P002}>Furama Villas Danang</option>
                    </select>
                    <ChevronDown size={12} className="text-gray-400 flex-shrink-0 hidden sm:block" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 px-2 py-2 sm:py-1.5 rounded border border-gray-300 bg-gray-50/50 min-h-[40px]">
                    <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium whitespace-nowrap w-6 sm:w-auto">Từ</span>
                      <input
                        type="date"
                        value={dateFrom}
                        min={trendRange.min}
                        max={trendRange.max}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-gray-700 outline-none flex-1 min-w-0 min-h-[32px] touch-manipulation border-0 p-0"
                        aria-label="From date"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium whitespace-nowrap w-6 sm:w-auto">đến</span>
                      <input
                        type="date"
                        value={dateTo}
                        min={trendRange.min}
                        max={trendRange.max}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="bg-transparent text-xs font-semibold text-gray-700 outline-none flex-1 min-w-0 min-h-[32px] touch-manipulation border-0 p-0"
                        aria-label="To date"
                      />
                    </div>
                  </div>
                </div>
                <ChannelPerformance 
                  onNavigateToData={() => handleTabChange('data')} 
                  filter={propertyFilter} 
                  dateRange={dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined} 
                />
              </>
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
