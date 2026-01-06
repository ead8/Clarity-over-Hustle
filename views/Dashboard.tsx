
import React, { useMemo } from 'react';
import { Card } from '../components/UI';
import { IncomeEntry, Bill, UserSettings } from '../types';
// Added CreditCard to the lucide-react imports
import { Target, TrendingUp, Calendar, ArrowRight, CreditCard } from 'lucide-react';

interface DashboardProps {
  income: IncomeEntry[];
  bills: Bill[];
  settings: UserSettings;
  onAddIncome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ income, bills, settings, onAddIncome }) => {
  // Current Week Income Calculation
  const weeklyTotal = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    return income
      .filter(entry => new Date(entry.date) >= startOfWeek)
      .reduce((sum, entry) => sum + entry.net, 0);
  }, [income]);

  // Upcoming Bills (Next 7 Days)
  const upcomingBills = useMemo(() => {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    return bills
      .filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return !bill.isPaid && dueDate >= now && dueDate <= sevenDaysLater;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [bills]);

  const nightsNeeded = Math.ceil(Math.max(0, settings.weeklyTarget - weeklyTotal) / settings.expectedNetPerNight);
  const progressPercent = Math.min(100, (weeklyTotal / settings.weeklyTarget) * 100);
  const randomAffirmation = useMemo(() => settings.affirmations[Math.floor(Math.random() * settings.affirmations.length)], [settings.affirmations]);

  return (
    <div className="space-y-6 pb-6">
      {/* Target Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Target className="text-primary" size={18} />
            <h2 className="font-bold text-gray-200">Weekly Target</h2>
          </div>
          <span className="text-primary font-bold text-lg">${weeklyTotal.toLocaleString()} <span className="text-gray-500 text-xs font-normal">/ ${settings.weeklyTarget.toLocaleString()}</span></span>
        </div>
        
        <Card className="relative overflow-hidden">
          <div className="h-3 w-full bg-black/50 rounded-full mb-4 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,0,127,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Remaining</p>
              <p className="text-xl font-bold text-white">${Math.max(0, settings.weeklyTarget - weeklyTotal).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Nights Needed</p>
              <p className="text-xl font-bold text-primary neon-text">{nightsNeeded}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Daily Quote/Affirmation */}
      <section>
        <div className="bg-gradient-to-br from-secondary/80 to-primary/10 border border-primary/20 p-5 rounded-2xl italic font-glam text-gray-200 text-lg leading-snug">
          "{randomAffirmation}"
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="Avg Net">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-green-400" />
            <span className="text-xl font-bold">${settings.expectedNetPerNight}</span>
          </div>
        </Card>
        <Card title="Safe Bet">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-primary" />
            <span className="text-xl font-bold">${settings.minNet}</span>
          </div>
        </Card>
      </div>

      {/* Upcoming Bills Snippet */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="text-primary" size={18} />
            <h2 className="font-bold text-gray-200">Next 7 Days</h2>
          </div>
          <button className="text-[10px] text-gray-500 font-bold uppercase hover:text-primary transition-colors">See All</button>
        </div>
        
        {upcomingBills.length > 0 ? (
          <div className="space-y-3">
            {upcomingBills.map(bill => (
              <Card key={bill.id} className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{bill.name}</h4>
                    <p className="text-[10px] text-gray-500">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">${bill.amount}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-gray-500 text-sm">No bills due this week. ✨</p>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
