
import React, { useState, useMemo } from 'react';
import { Card, Button, Input, Label } from '../components/UI';
import { IncomeEntry, UserSettings } from '../types';
import { Plus, Trash2, Calendar as CalendarIcon, Tag, Filter, X, Search } from 'lucide-react';
import { INCOME_FLAGS } from '../constants';

interface IncomeProps {
  income: IncomeEntry[];
  setIncome: React.Dispatch<React.SetStateAction<IncomeEntry[]>>;
  settings: UserSettings;
}

const Income: React.FC<IncomeProps> = ({ income, setIncome, settings }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [selectedFilterFlags, setSelectedFilterFlags] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    gross: '',
    tipOut: '',
    houseFee: '',
    notes: '',
    flags: [] as string[]
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const grossNum = Number(formData.gross);
    const tipOutNum = Number(formData.tipOut);
    const houseFeeNum = Number(formData.houseFee);
    const net = grossNum - tipOutNum - houseFeeNum;

    const newEntry: IncomeEntry = {
      id: Date.now().toString(),
      date: formData.date,
      gross: grossNum,
      tipOut: tipOutNum,
      houseFee: houseFeeNum,
      net: net,
      notes: formData.notes,
      flags: formData.flags,
      rulesApplied: []
    };

    setIncome(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setShowAdd(false);
    setFormData({ date: new Date().toISOString().split('T')[0], gross: '', tipOut: '', houseFee: '', notes: '', flags: [] });
  };

  const deleteEntry = (id: string) => {
    if (confirm('Delete this entry?')) {
      setIncome(prev => prev.filter(e => e.id !== id));
    }
  };

  const toggleFlag = (flag: string) => {
    setFormData(prev => ({
      ...prev,
      flags: prev.flags.includes(flag) 
        ? prev.flags.filter(f => f !== flag) 
        : [...prev.flags, flag]
    }));
  };

  const toggleFilterFlag = (flag: string) => {
    setSelectedFilterFlags(prev => 
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    );
  };

  const clearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setSelectedFilterFlags([]);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterStartDate) count++;
    if (filterEndDate) count++;
    if (selectedFilterFlags.length > 0) count++;
    return count;
  }, [filterStartDate, filterEndDate, selectedFilterFlags]);

  const filteredIncome = useMemo(() => {
    return income.filter(entry => {
      // Date Filter
      if (filterStartDate && entry.date < filterStartDate) return false;
      if (filterEndDate && entry.date > filterEndDate) return false;
      
      // Flags Filter
      if (selectedFilterFlags.length > 0) {
        const hasAllFlags = selectedFilterFlags.every(f => entry.flags.includes(f));
        if (!hasAllFlags) return false;
      }
      
      return true;
    });
  }, [income, filterStartDate, filterEndDate, selectedFilterFlags]);

  return (
    <div className="space-y-6">
      {!showAdd ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Earnings History</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border transition-all relative ${
                  showFilters || activeFilterCount > 0 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-secondary border-white/5 text-gray-400'
                }`}
              >
                <Filter size={20} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-background shadow-lg">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2 py-2">
                <Plus size={18} /> New Entry
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="animate-in slide-in-from-top-2 duration-300 border-primary/20 bg-secondary/80">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-primary" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter Controls</span>
                </div>
                <button onClick={clearFilters} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase">Clear All</button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>From</Label>
                    <Input 
                      type="date" 
                      className="text-xs py-2"
                      value={filterStartDate}
                      onChange={e => setFilterStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>To</Label>
                    <Input 
                      type="date" 
                      className="text-xs py-2"
                      value={filterEndDate}
                      onChange={e => setFilterEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Filter by Flags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {INCOME_FLAGS.map(flag => (
                      <button
                        key={flag}
                        onClick={() => toggleFilterFlag(flag)}
                        className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${
                          selectedFilterFlags.includes(flag)
                            ? 'bg-primary border-primary text-white neon-glow'
                            : 'bg-black/40 border-white/5 text-gray-500'
                        }`}
                      >
                        {flag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            {income.length === 0 ? (
              <Card className="text-center py-12 text-gray-500">
                No entries yet. Start tracking your hustle!
              </Card>
            ) : filteredIncome.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-500 text-sm">No entries match your filters.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-3 text-primary text-xs font-bold uppercase tracking-widest border-b border-primary"
                >
                  Clear all filters
                </button>
              </Card>
            ) : (
              filteredIncome.map(entry => (
                <Card key={entry.id} className="relative group hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <h3 className="text-xl font-bold text-white">${entry.net.toLocaleString()}</h3>
                    </div>
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="text-gray-600 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex gap-4 mb-3 text-[10px] text-gray-400 font-medium">
                    <span>Gross: <span className="text-gray-200">${entry.gross}</span></span>
                    <span>Fees: <span className="text-gray-200">${entry.houseFee}</span></span>
                    <span>Tips: <span className="text-gray-200">${entry.tipOut}</span></span>
                  </div>

                  {entry.flags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {entry.flags.map(f => (
                        <span key={f} className="bg-primary/10 text-primary text-[8px] uppercase font-bold px-2 py-0.5 rounded border border-primary/20">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.notes && (
                    <p className="mt-2 text-xs text-gray-400 border-t border-white/5 pt-2 italic line-clamp-2">"{entry.notes}"</p>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Log Nightly Income</h2>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 font-bold">Cancel</button>
          </div>

          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gross Made</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.gross}
                    onChange={e => setFormData({...formData, gross: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>House Fee</Label>
                  <Input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.houseFee}
                    onChange={e => setFormData({...formData, houseFee: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Tip Out / DJs / Floor</Label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.tipOut}
                  onChange={e => setFormData({...formData, tipOut: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>Flags</Label>
                <div className="flex flex-wrap gap-2">
                  {INCOME_FLAGS.map(flag => (
                    <button
                      key={flag}
                      type="button"
                      onClick={() => toggleFlag(flag)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                        formData.flags.includes(flag) 
                          ? 'bg-primary border-primary text-white' 
                          : 'bg-transparent border-white/10 text-gray-500'
                      }`}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <textarea 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                  rows={3}
                  placeholder="Any details about the night?"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-secondary/80 p-5 rounded-2xl border border-white/5 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Estimated Net</p>
              <p className="text-4xl font-bold text-primary neon-text">
                ${(Number(formData.gross) - Number(formData.houseFee) - Number(formData.tipOut) || 0).toLocaleString()}
              </p>
            </div>

            <Button type="submit" className="w-full">Save Entry</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Income;
