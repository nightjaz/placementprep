'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-medium transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
