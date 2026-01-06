
export interface IncomeEntry {
  id: string;
  date: string;
  gross: number;
  tipOut: number;
  houseFee: number;
  net: number;
  notes: string;
  flags: string[];
  rulesApplied: string[];
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  reminderTime?: string; // ISO string for the specific time to alert
  reminderDismissed?: boolean;
}

export interface Maintenance {
  id: string;
  category: string;
  amount: number;
  date: string;
  hasReceipt: boolean;
  description: string;
}

export interface UserSettings {
  weeklyTarget: number;
  expectedNetPerNight: number;
  minNet: number;
  bufferPercent: number;
  onboardingComplete: boolean;
  affirmations: string[];
}

export type View = 'dashboard' | 'income' | 'bills' | 'maintenance' | 'summary' | 'settings' | 'onboarding';
