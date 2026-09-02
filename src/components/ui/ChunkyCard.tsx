'use client';

import React from 'react';

interface ChunkyCardProps {
  children: React.ReactNode;
  className?: string;
  shadowColor?: 'purple' | 'pink' | 'yellow' | 'green' | 'cyan' | 'dark';
  borderColor?: 'purple' | 'pink' | 'yellow' | 'green' | 'cyan' | 'default';
  onClick?: () => void;
}

export const ChunkyCard: React.FC<ChunkyCardProps> = ({
  children,
  className = '',
  shadowColor = 'purple',
  borderColor = 'default',
  onClick,
}) => {
  const shadows = {
    purple: 'shadow-chunky-purple',
    pink: 'shadow-chunky-pink',
    yellow: 'shadow-chunky-yellow',
    green: 'shadow-chunky-green',
    cyan: 'shadow-chunky-cyan',
    dark: 'shadow-chunky-dark',
  };

  const borders = {
    default: 'border-goon-surfaceBorder',
    purple: 'border-goon-purple/60',
    pink: 'border-goon-pink/60',
    yellow: 'border-goon-yellow/60',
    green: 'border-goon-green/60',
    cyan: 'border-goon-cyan/60',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl bg-goon-surface border-2 ${borders[borderColor]} ${shadows[shadowColor]} p-5 transition-transform duration-150 ${
        onClick ? 'cursor-pointer active:translate-y-1 hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
