
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass-card transition-all duration-300 hover:shadow-xl", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassButton({ 
  children, 
  className, 
  ...props 
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      className={cn(
        "glass-button subtle-ring", 
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}
