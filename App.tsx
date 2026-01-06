
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  DollarSign, 
  CreditCard, 
  Scissors, 
  PieChart, 
  Settings as SettingsIcon,
  Plus
} from 'lucide-react';
import { View, IncomeEntry, Bill, Maintenance, UserSettings } from './types';
import { DEFAULT_AFFIRMATIONS } from './constants';

// --- Views ---
import Dashboard from './views/Dashboard';
import Income from './views/Income';
import Bills from './views/Bills';
import MaintenanceView from './views/Maintenance';
import Summary from './views/Summary';
import Settings from './views/Settings';
import Onboarding from './views/Onboarding';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [income, setIncome] = useState<IncomeEntry[]>(() => {
    const saved = localStorage.getItem('coh_income');
    return saved ? JSON.parse(saved) : [];
  });
  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('coh_bills');
    return saved ? JSON.parse(saved) : [];
  });
  const [maintenance, setMaintenance] = useState<Maintenance[]>(() => {
    const saved = localStorage.getItem('coh_maintenance');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('coh_settings');
    return saved ? JSON.parse(saved) : {
      weeklyTarget: 2500,
      expectedNetPerNight: 500,
      minNet: 300,
      bufferPercent: 20,
      onboardingComplete: false,
      affirmations: DEFAULT_AFFIRMATIONS
    };
  });

  useEffect(() => {
    localStorage.setItem('coh_income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem('coh_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('coh_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('coh_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!settings.onboardingComplete) {
      setActiveView('onboarding');
    }
  }, [settings.onboardingComplete]);

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-all active:scale-90 ${
        activeView === view ? 'text-primary' : 'text-gray-500'
      }`}
    >
      <Icon size={24} className={activeView === view ? 'neon-text drop-shadow-[0_0_8px_rgba(255,0,127,0.6)]' : ''} />
      <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );

  const renderView = () => {
    let content;
    switch (activeView) {
      case 'onboarding': content = <Onboarding onComplete={() => {
        setSettings({ ...settings, onboardingComplete: true });
        setActiveView('dashboard');
      }} />; break;
      case 'dashboard': content = <Dashboard income={income} bills={bills} settings={settings} onAddIncome={() => setActiveView('income')} />; break;
      case 'income': content = <Income income={income} setIncome={setIncome} settings={settings} />; break;
      case 'bills': content = <Bills bills={bills} setBills={setBills} />; break;
      case 'maintenance': content = <MaintenanceView maintenance={maintenance} setMaintenance={setMaintenance} />; break;
      case 'summary': content = <Summary income={income} bills={bills} maintenance={maintenance} settings={settings} />; break;
      case 'settings': content = <Settings settings={settings} setSettings={setSettings} onRestartOnboarding={() => setActiveView('onboarding')} />; break;
      default: content = <Dashboard income={income} bills={bills} settings={settings} onAddIncome={() => setActiveView('income')} />;
    }
    return <div key={activeView} className="view-transition">{content}</div>;
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background text-white shadow-2xl relative overflow-hidden">
      {activeView !== 'onboarding' && (
        <header className="px-6 pt-10 pb-4 flex justify-between items-end sticky top-0 bg-background/95 backdrop-blur-lg z-20">
          <div>
            <h1 className="text-3xl font-glam italic text-primary drop-shadow-[0_0_10px_rgba(255,0,127,0.4)] leading-none">Clarity</h1>
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mt-1">(over) Hustle</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Lucky Day</p>
            <p className="text-xs font-bold text-gray-200">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto px-6 pb-28 ${activeView === 'onboarding' ? 'p-0' : ''}`}>
        {renderView()}
      </main>

      {activeView !== 'onboarding' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-secondary/95 backdrop-blur-2xl border-t border-white/5 flex justify-around px-2 pb-safe z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
          <NavItem view="dashboard" icon={Home} label="Home" />
          <NavItem view="income" icon={DollarSign} label="Income" />
          <NavItem view="bills" icon={CreditCard} label="Bills" />
          <NavItem view="maintenance" icon={Scissors} label="Care" />
          <NavItem view="summary" icon={PieChart} label="Snapshot" />
          <NavItem view="settings" icon={SettingsIcon} label="Me" />
        </nav>
      )}

      {activeView === 'dashboard' && (
        <button 
          onClick={() => setActiveView('income')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center neon-glow hover:scale-110 active:scale-90 transition-all z-40"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
};

export default App;
