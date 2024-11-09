import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings as SettingsIcon,
  Menu,
  DollarSign,
} from 'lucide-react';
import { ImportData } from './components/import/ImportData';
import { ArtistList } from './components/artists/ArtistList';
import { SaleList } from './components/sales/SaleList';
import { SettingList } from './components/settings/SettingList';
import { FinancialSummary } from './components/reports/FinancialSummary';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'artists':
        return <ArtistList />;
      case 'sales':
        return <SaleList />;
      case 'settings':
        return <SettingList />;
      case 'reports':
        return <FinancialSummary />;
      case 'dashboard':
        return <ImportData />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Art Gallery Sales Management
            </h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } transition-all duration-300 ease-in-out bg-white shadow-sm min-h-[calc(100vh-4rem)]`}
        >
          <nav className="p-4 space-y-2">
            <NavItem
              icon={<LayoutDashboard />}
              label="Dashboard"
              onClick={() => setCurrentView('dashboard')}
              active={currentView === 'dashboard'}
            />
            <NavItem
              icon={<Users />}
              label="Artists"
              onClick={() => setCurrentView('artists')}
              active={currentView === 'artists'}
            />
            <NavItem
              icon={<ShoppingCart />}
              label="Sales"
              onClick={() => setCurrentView('sales')}
              active={currentView === 'sales'}
            />
            <NavItem
              icon={<DollarSign />}
              label="Reports"
              onClick={() => setCurrentView('reports')}
              active={currentView === 'reports'}
            />
            <NavItem
              icon={<SettingsIcon />}
              label="Settings"
              onClick={() => setCurrentView('settings')}
              active={currentView === 'settings'}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

function NavItem({ icon, label, onClick, active }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full p-3 rounded-md transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-600'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default App;