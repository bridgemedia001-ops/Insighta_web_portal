import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('rounded-lg border bg-white shadow-sm', className)}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
};
