
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label } from '../components/UI';
import { UserSettings } from '../types';
import { RefreshCw, Heart, Target, Sparkles, LogOut, Bell, BellOff } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onRestartOnboarding: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, onRestartOnboarding }) => {
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleClearData = () => {
    if (confirm('CRITICAL: This will delete ALL tracked data. This cannot be undone. Proceed?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-2xl font-bold">Profile & Targets</h2>
        <p className="text-sm text-gray-500">Customize your boundaries and goals.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Target className="text-primary" size={18} />
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Configuration</h3>
        </div>
        
        <Card className="space-y-5">
          <div>
            <Label>Weekly Income Goal ($)</Label>
            <Input 
              type="number" 
              value={settings.weeklyTarget}
              onChange={e => updateSetting('weeklyTarget', Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Expected Net Per Night ($)</Label>
            <Input 
              type="number" 
              value={settings.expectedNetPerNight}
              onChange={e => updateSetting('expectedNetPerNight', Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Minimum Net To Stay ($)</Label>
            <Input 
              type="number" 
              value={settings.minNet}
              onChange={e => updateSetting('minNet', Number(e.target.value))}
            />
            <p className="text-[10px] text-gray-500 mt-1 italic">When you hit this, your fees are covered.</p>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="text-primary" size={18} />
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Alerts & Notifications</h3>
        </div>
        
        <Card className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">Browser Notifications</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">For urgent bill reminders</p>
            </div>
            {notifPermission === 'granted' ? (
              <div className="flex items-center gap-2 text-green-500">
                <span className="text-[10px] font-bold">ACTIVE</span>
                <Bell size={18} />
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="py-2 text-[10px]" 
                onClick={requestPermission}
                disabled={notifPermission === 'denied'}
              >
                {notifPermission === 'denied' ? 'Blocked' : 'Enable'}
              </Button>
            )}
          </div>
          {notifPermission === 'denied' && (
            <p className="text-[10px] text-red-400 italic">Please enable notifications in your browser settings to receive alerts.</p>
          )}
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="text-primary" size={18} />
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Mindset & Affirmations</h3>
        </div>
        
        <Card className="space-y-4">
          <p className="text-xs text-gray-400 mb-2">These appear randomly on your dashboard to keep your energy high.</p>
          {settings.affirmations.map((aff, idx) => (
            <div key={idx} className="relative">
              <Input 
                value={aff}
                onChange={e => {
                  const newAffs = [...settings.affirmations];
                  newAffs[idx] = e.target.value;
                  updateSetting('affirmations', newAffs);
                }}
              />
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full py-2 text-xs"
            onClick={() => updateSetting('affirmations', [...settings.affirmations, 'New custom affirmation...'])}
          >
            Add Custom Affirmation
          </Button>
        </Card>
      </section>

      <section className="space-y-4">
        <Button 
          variant="secondary" 
          className="w-full flex items-center justify-center gap-2"
          onClick={onRestartOnboarding}
        >
          <Sparkles size={18} /> Replay Onboarding
        </Button>

        <Button 
          variant="danger" 
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 border-red-500/30 text-red-500"
          onClick={handleClearData}
        >
          <LogOut size={18} /> Clear All Data
        </Button>
      </section>

      <div className="text-center opacity-30 pt-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Clarity (over) Hustle v1.0.0</p>
        <p className="text-[8px] mt-1 italic">Empowering your financial freedom.</p>
      </div>
    </div>
  );
};

export default Settings;
