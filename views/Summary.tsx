
import React, { useMemo } from 'react';
import { Card } from '../components/UI';
import { IncomeEntry, Bill, Maintenance, UserSettings } from '../types';
import { PieChart, DollarSign, CreditCard, Scissors, Sparkles, TrendingUp, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface SummaryProps {
  income: IncomeEntry[];
  bills: Bill[];
  maintenance: Maintenance[];
  settings: UserSettings;
}

const Summary: React.FC<SummaryProps> = ({ income, bills, maintenance, settings }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const stats = useMemo(() => {
    const monthIncome = income
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.net, 0);

    const monthBills = bills
      .reduce((sum, b) => sum + b.amount, 0); // Projected monthly load

    const monthMaint = maintenance
      .filter(m => {
        const d = new Date(m.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, m) => sum + m.amount, 0);

    const profit = monthIncome - monthBills - monthMaint;
    
    return { income: monthIncome, bills: monthBills, maintenance: monthMaint, profit };
  }, [income, bills, maintenance, currentMonth, currentYear]);

  const monthName = new Date().toLocaleString('en-US', { month: 'long' });

  // Fixed sublabel property mismatch in type definition
  const SummaryItem = ({ icon: Icon, label, amount, color, sublabel }: { icon: any, label: string, amount: number, color: string, sublabel?: string }) => (
    <div className="flex items-center justify-between p-4 bg-secondary/40 rounded-2xl border border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 border ${color.replace('text-', 'border-')}/20`}>
          <Icon size={22} className={color} />
        </div>
        <div>
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest block">{label}</span>
          <span className="text-[10px] text-gray-600 font-medium">{sublabel || "Monthly Total"}</span>
        </div>
      </div>
      <span className="font-bold text-xl">${amount.toLocaleString()}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-glam italic text-white">{monthName}</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Financial Snapshot</p>
        </div>
        <div className="p-2 bg-secondary rounded-full border border-white/10">
          <PieChart className="text-primary" size={20} />
        </div>
      </header>

      {/* Hero Balance Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 group-hover:bg-primary/30 transition-all duration-500"></div>
        <Card className="bg-gradient-to-br from-secondary via-secondary to-primary/10 border-primary/30 py-10 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
            <Wallet size={200} />
          </div>
          <div className="text-center relative z-10">
            <p className="text-[10px] text-primary uppercase font-black tracking-[0.4em] mb-2">Projected Net Profit</p>
            <h3 className={`text-6xl font-black tracking-tighter ${stats.profit >= 0 ? 'text-white neon-text' : 'text-red-400'}`}>
              ${stats.profit.toLocaleString()}
            </h3>
            <div className="flex justify-center items-center gap-2 mt-4">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <p className="text-xs text-gray-400 font-medium tracking-wide">Clarity achieved for {monthName}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <SummaryItem icon={ArrowUpCircle} label="Earnings" amount={stats.income} color="text-green-400" />
        <SummaryItem icon={ArrowDownCircle} label="Bills" amount={stats.bills} color="text-primary" />
        <SummaryItem icon={Scissors} label="Maintenance" amount={stats.maintenance} color="text-accent" />
      </div>

      <section className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-gray-500" />
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency Metrics</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-black/20 border-white/5 py-6">
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Target Pace</p>
            <p className="text-2xl font-bold">{Math.round((stats.income / (settings.weeklyTarget * 4)) * 100)}%</p>
            <div className="w-full h-1 bg-white/5 rounded-full mt-2">
              <div 
                className="h-full bg-primary shadow-[0_0_8px_rgba(255,0,127,0.5)] transition-all duration-1000" 
                style={{ width: `${Math.min(100, (stats.income / (settings.weeklyTarget * 4)) * 100)}%` }}
              />
            </div>
          </Card>
          
          <Card className="bg-black/20 border-white/5 py-6">
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Expense Ratio</p>
            <p className="text-2xl font-bold">{Math.round(((stats.bills + stats.maintenance) / stats.income) * 100) || 0}%</p>
            <p className="text-[8px] text-gray-600 font-bold uppercase mt-2 tracking-tighter">Lower is better</p>
          </Card>
        </div>
      </section>

      <footer className="text-center pb-8 opacity-20">
        <p className="text-[8px] font-black uppercase tracking-widest italic">Always Clarity. Never Hustle.</p>
      </footer>
    </div>
  );
};

export default Summary;
