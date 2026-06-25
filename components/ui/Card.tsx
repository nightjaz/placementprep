'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'danger' | 'success' | 'warning';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variants = {
    default: 'bg-zinc-900/50 border-zinc-800/50',
    danger: 'bg-red-950/20 border-red-900/30',
    success: 'bg-emerald-950/20 border-emerald-900/30',
    warning: 'bg-amber-950/20 border-amber-900/30',
  };

  return (
    <div className={`rounded-xl border p-5 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-600 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
