
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-secondary/50 rounded-2xl p-5 border border-white/5 backdrop-blur-sm ${className}`}>
    {title && <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">{title}</h3>}
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger',
  className?: string,
  disabled?: boolean,
  type?: 'button' | 'submit'
}> = ({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }) => {
  const variants = {
    primary: 'bg-primary text-white neon-glow',
    secondary: 'bg-white text-black',
    outline: 'border border-primary text-primary',
    danger: 'bg-red-500/20 text-red-500 border border-red-500/30'
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props}
    className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors ${props.className}`}
  />
);

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">{children}</label>
);
