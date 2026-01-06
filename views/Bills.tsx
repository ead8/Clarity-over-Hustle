
import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Input, Label } from '../components/UI';
import { Bill } from '../types';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Bell, 
  ArrowUpRight, 
  Edit2, 
  X, 
  Clock,
  BellRing,
  Check,
  History
} from 'lucide-react';

interface BillsProps {
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const getUrgency = (dueDateStr: string, isPaid: boolean) => {
  if (isPaid) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 3) return 'urgent';
  return null;
};

interface BillCardProps {
  bill: Bill;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (bill: Bill) => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onTogglePaid, onDelete, onEdit }) => {
  const urgency = getUrgency(bill.dueDate, bill.isPaid);
  const urgent = urgency === 'urgent' || urgency === 'overdue';
  
  return (
    <Card 
      className={`transition-all duration-500 relative overflow-hidden group ${
        bill.isPaid 
          ? 'opacity-40 grayscale-[0.9] scale-[0.97] bg-black/20' 
          : urgent 
            ? 'border-primary/40 shadow-[0_0_20px_rgba(255,0,127,0.1)] bg-primary/5' 
            : 'hover:border-white/20'
      }`}
    >
      {urgent && !bill.isPaid && (
        <div className="absolute top-0 right-0">
          <div className={`${urgency === 'overdue' ? 'bg-red-500' : 'bg-primary'} text-[8px] font-black text-white px-2 py-0.5 rounded-bl-lg uppercase tracking-widest flex items-center gap-1 shadow-lg animate-pulse`}>
            <AlertCircle size={8} /> {urgency === 'overdue' ? 'Overdue' : 'Due Soon'}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onTogglePaid(bill.id)}
          className={`flex-shrink-0 transition-all duration-300 transform active:scale-75 ${
            bill.isPaid 
              ? 'text-green-500 bg-green-500/10 p-2 rounded-full ring-4 ring-green-500/5' 
              : urgent 
                ? 'text-primary' 
                : 'text-gray-600 hover:text-white'
          }`}
        >
          {bill.isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className={`font-bold truncate transition-all ${bill.isPaid ? 'line-through text-gray-600' : 'text-white'}`}>
              {bill.name}
            </h3>
            <p className={`font-bold text-lg whitespace-nowrap transition-colors ${bill.isPaid ? 'text-gray-600' : 'text-primary'}`}>
              ${bill.amount.toLocaleString()}
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar size={10} className={urgent && !bill.isPaid ? 'text-primary' : 'text-gray-500'} />
                <p className={`text-[10px] uppercase font-bold tracking-widest ${urgent && !bill.isPaid ? 'text-primary' : 'text-gray-500'}`}>
                  {new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              {bill.reminderTime && !bill.isPaid && (
                <div className="flex items-center gap-1 text-[10px] text-accent font-medium">
                  <BellRing size={10} />
                  <span>{new Date(bill.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onEdit(bill)}
                className="text-gray-800 hover:text-primary transition-colors p-1"
                title="Edit or Backfill Date"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => onDelete(bill.id)}
                className="text-gray-800 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Bills: React.FC<BillsProps> = ({ bills, setBills }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [now, setNow] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    isPaid: false,
    reminderEnabled: false,
    reminderTime: ''
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }
    const permission = await Notification.requestPermission();
    setHasPermission(permission === "granted");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const billData = {
      name: formData.name,
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      isPaid: formData.isPaid,
      reminderTime: formData.reminderEnabled ? formData.reminderTime : undefined,
      reminderDismissed: false
    };

    if (editingBillId) {
      setBills(prev => prev.map(b => 
        b.id === editingBillId 
          ? { ...b, ...billData } 
          : b
      ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      setEditingBillId(null);
    } else {
      const newBill: Bill = {
        id: Date.now().toString(),
        ...billData
      };
      setBills(prev => [...prev, newBill].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      setShowAdd(false);
    }
    setFormData({ name: '', amount: '', dueDate: '', isPaid: false, reminderEnabled: false, reminderTime: '' });
  };

  const startEdit = (bill: Bill) => {
    setEditingBillId(bill.id);
    setFormData({
      name: bill.name,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate,
      isPaid: bill.isPaid,
      reminderEnabled: !!bill.reminderTime,
      reminderTime: bill.reminderTime || ''
    });
    setShowAdd(false);
  };

  const cancelEdit = () => {
    setEditingBillId(null);
    setShowAdd(false);
    setFormData({ name: '', amount: '', dueDate: '', isPaid: false, reminderEnabled: false, reminderTime: '' });
  };

  const togglePaid = (id: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: !b.isPaid, reminderDismissed: true } : b));
  };

  const dismissReminder = (id: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, reminderDismissed: true } : b));
  };

  const deleteBill = (id: string) => {
    if (confirm('Delete this bill?')) {
      setBills(prev => prev.filter(b => b.id !== id));
      if (editingBillId === id) setEditingBillId(null);
    }
  };

  const activeBills = useMemo(() => {
    return bills.filter(b => !b.isPaid).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [bills]);

  const settledBills = useMemo(() => {
    return bills.filter(b => b.isPaid).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }, [bills]);

  const urgentAlerts = useMemo(() => {
    return activeBills.filter(b => {
      const urgency = getUrgency(b.dueDate, false);
      return urgency === 'urgent' || urgency === 'overdue';
    });
  }, [activeBills]);

  const triggeredReminders = useMemo(() => {
    return bills.filter(b => 
      !b.isPaid && 
      !b.reminderDismissed && 
      b.reminderTime && 
      new Date(b.reminderTime) <= now
    );
  }, [bills, now]);

  const financialSummary = useMemo(() => {
    const total = bills.reduce((sum, b) => sum + b.amount, 0);
    const paid = settledBills.reduce((sum, b) => sum + b.amount, 0);
    const remaining = total - paid;
    return { total, paid, remaining, progress: total > 0 ? (paid / total) * 100 : 0 };
  }, [bills, settledBills]);

  const isDueSoon = useMemo(() => {
    if (!formData.dueDate) return false;
    const due = new Date(formData.dueDate);
    const diff = due.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }, [formData.dueDate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Financial Health</h2>
        <div className="flex gap-2">
          {!hasPermission && (
             <button 
              onClick={requestNotificationPermission}
              className="p-2 bg-secondary rounded-xl text-gray-400 hover:text-primary transition-colors border border-white/5"
              title="Enable Notifications"
            >
              <Bell size={20} />
            </button>
          )}
          {!showAdd && !editingBillId && (
            <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2 py-2 px-3">
              <Plus size={18} /> <span className="hidden sm:inline">Add Bill</span>
            </Button>
          )}
        </div>
      </div>

      {triggeredReminders.length > 0 && (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center gap-2 px-1">
            <BellRing className="text-accent animate-bounce" size={16} />
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Active Alerts</span>
          </div>
          {triggeredReminders.map(bill => (
            <Card key={`trigger-${bill.id}`} className="bg-accent/10 border-accent/30 shadow-[0_0_15px_rgba(255,77,166,0.2)]">
              <div className="flex items-center gap-4">
                <div className="bg-accent p-2 rounded-full text-white">
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-tight text-accent">Reminder Triggered</p>
                  <p className="text-sm font-black text-white">{bill.name} is due!</p>
                  <p className="text-[10px] text-gray-400">Set for {new Date(bill.reminderTime!).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => togglePaid(bill.id)}
                    className="p-2 bg-accent text-white rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg"
                    title="Mark Paid"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => dismissReminder(bill.id)}
                    className="p-2 bg-white/5 text-gray-400 rounded-lg hover:text-white transition-all"
                    title="Dismiss"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-r from-secondary to-primary/5 border-primary/20">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Monthly Burn</p>
            <h3 className="text-2xl font-black">${financialSummary.total.toLocaleString()}</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-1">Remaining to Pay</p>
            <h3 className="text-2xl font-black text-primary neon-text">${financialSummary.remaining.toLocaleString()}</h3>
          </div>
        </div>
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-primary shadow-[0_0_10px_rgba(255,0,127,0.5)] transition-all duration-1000"
            style={{ width: `${financialSummary.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
           <span className="text-[8px] font-bold text-gray-600 uppercase">0% Obligation</span>
           <span className="text-[8px] font-bold text-gray-400 uppercase">{Math.round(financialSummary.progress)}% Freed</span>
        </div>
      </Card>

      {urgentAlerts.length > 0 && !editingBillId && !showAdd && triggeredReminders.length === 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
          {urgentAlerts.map(bill => {
            const urgency = getUrgency(bill.dueDate, bill.isPaid);
            const isOverdue = urgency === 'overdue';
            return (
              <div 
                key={`alert-${bill.id}`} 
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${
                  isOverdue 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-primary/10 border-primary/20 text-primary'
                }`}
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-bold uppercase tracking-tight">{isOverdue ? 'Overdue: ' : 'Due Soon: '}</span>
                  {bill.name} is due {isOverdue ? 'was' : ''} on {new Date(bill.dueDate).toLocaleDateString()}.
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(showAdd || editingBillId) && (
        <Card className="animate-in fade-in zoom-in-95 duration-200 border-primary/30 ring-4 ring-primary/5">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-2">
              {editingBillId ? <Edit2 className="text-primary" size={16} /> : <ArrowUpRight className="text-primary" size={16} />}
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest">
                {editingBillId ? 'Edit Financial Boundary' : 'New Boundary Entry'}
              </h3>
            </div>
            <div>
              <Label>Bill Name</Label>
              <Input 
                placeholder="e.g. Studio Rent, Phone" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Due Date / Backfill</Label>
                <Input 
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={formData.isPaid ? 'text-green-500' : 'text-gray-600'} size={18} />
                <div>
                  <Label className="mb-0">Already Paid?</Label>
                  <p className="text-[9px] text-gray-500 uppercase">Mark as settled immediately</p>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={formData.isPaid}
                onChange={e => setFormData({...formData, isPaid: e.target.checked})}
                className="w-5 h-5 accent-green-500"
              />
            </div>

            <div className={`p-4 rounded-xl border transition-all duration-300 ${isDueSoon ? 'bg-accent/5 border-accent/20' : 'bg-black/20 border-white/5 opacity-50 grayscale'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className={isDueSoon ? 'text-accent' : 'text-gray-600'} size={16} />
                  <div>
                    <Label className="mb-0">Custom Reminder</Label>
                    <p className="text-[9px] text-gray-500 uppercase">Alert me at a specific time</p>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  disabled={!isDueSoon}
                  checked={formData.reminderEnabled}
                  onChange={e => setFormData({...formData, reminderEnabled: e.target.checked})}
                  className="w-5 h-5 accent-accent"
                />
              </div>
              {formData.reminderEnabled && isDueSoon && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <Input 
                    type="datetime-local"
                    value={formData.reminderTime}
                    onChange={e => setFormData({...formData, reminderTime: e.target.value})}
                    required={formData.reminderEnabled}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={cancelEdit} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">
                {editingBillId ? 'Update Record' : 'Add Record'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap">Unsettled</span>
            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          
          {activeBills.length === 0 ? (
            <div className="text-center py-10 opacity-40">
              <p className="text-xs font-bold uppercase tracking-widest">Everything is secured. ✨</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeBills.map(bill => (
                <BillCard 
                  key={bill.id} 
                  bill={bill} 
                  onTogglePaid={togglePaid} 
                  onDelete={deleteBill} 
                  onEdit={startEdit}
                />
              ))}
            </div>
          )}
        </div>

        {settledBills.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <div className="flex items-center gap-2">
                <History size={12} className="text-gray-600" />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] whitespace-nowrap">Settled History</span>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/5 to-transparent"></div>
            </div>
            
            <div className="grid gap-3">
              {settledBills.map(bill => (
                <BillCard 
                  key={bill.id} 
                  bill={bill} 
                  onTogglePaid={togglePaid} 
                  onDelete={deleteBill} 
                  onEdit={startEdit}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bills;
