
import React, { useState } from 'react';
import { Card, Button, Input, Label } from '../components/UI';
import { Maintenance } from '../types';
import { Plus, Trash2, Scissors, FileText, Check, X } from 'lucide-react';
import { MAINTENANCE_CATEGORIES } from '../constants';

interface MaintenanceProps {
  maintenance: Maintenance[];
  setMaintenance: React.Dispatch<React.SetStateAction<Maintenance[]>>;
}

const MaintenanceView: React.FC<MaintenanceProps> = ({ maintenance, setMaintenance }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    category: MAINTENANCE_CATEGORIES[0],
    amount: '',
    date: new Date().toISOString().split('T')[0],
    hasReceipt: false,
    description: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Maintenance = {
      id: Date.now().toString(),
      ...formData,
      amount: Number(formData.amount)
    };
    setMaintenance(prev => [newItem, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setShowAdd(false);
    setFormData({
      category: MAINTENANCE_CATEGORIES[0],
      amount: '',
      date: new Date().toISOString().split('T')[0],
      hasReceipt: false,
      description: ''
    });
  };

  const deleteItem = (id: string) => {
    if (confirm('Remove this write-off?')) {
      setMaintenance(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Write-Offs & Maintenance</h2>
        <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2 py-2">
          <Plus size={18} /> New Expense
        </Button>
      </div>

      {showAdd && (
        <Card className="animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {MAINTENANCE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Cost</Label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Input 
                placeholder="e.g. French tip refill"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="receipt"
                  checked={formData.hasReceipt}
                  onChange={e => setFormData({...formData, hasReceipt: e.target.checked})}
                  className="w-5 h-5 accent-primary rounded bg-black/40 border border-white/10"
                />
                <label htmlFor="receipt" className="text-sm text-gray-300">Have Receipt?</label>
              </div>
              <div className="w-1/2">
                <Input 
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">Log Expense</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {maintenance.length === 0 ? (
          <Card className="text-center py-12 text-gray-500">
            No maintenance logged. Invest in yourself! 💅
          </Card>
        ) : (
          maintenance.map(item => (
            <Card key={item.id}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Scissors size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.category}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${item.amount}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    {item.hasReceipt ? (
                      <span className="text-[8px] font-black text-green-500 border border-green-500/30 px-1 rounded uppercase">Receipted</span>
                    ) : (
                      <span className="text-[8px] font-black text-gray-600 border border-white/5 px-1 rounded uppercase">No Receipt</span>
                    )}
                    <button onClick={() => deleteItem(item.id)} className="text-gray-700 ml-2">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
              {item.description && (
                <p className="mt-2 text-xs text-gray-400 bg-black/20 p-2 rounded italic">"{item.description}"</p>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MaintenanceView;
