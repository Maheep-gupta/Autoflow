'use client';

import React from 'react';

interface AnimatedGlowProps {
  children: React.ReactNode;
  variant?: 'card' | 'border' | 'full';
  color?: 'blue' | 'green' | 'purple';
  intensity?: 'low' | 'medium' | 'high';
}

const glowColors = {
  blue: 'shadow-blue-500/50',
  green: 'shadow-green-500/50',
  purple: 'shadow-purple-500/50',
};

const intensities = {
  low: 'shadow-lg',
  medium: 'shadow-xl',
  high: 'shadow-2xl',
};

export function AnimatedGlow({
  children,
  variant = 'border',
  color = 'blue',
  intensity = 'medium',
}: AnimatedGlowProps) {
  if (variant === 'border') {
    return (
      <div className={`relative group`}>
        <div className={`absolute inset-0 bg-linear-to-r from-${color}-500 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
        <div className="relative">{children}</div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`relative ${glowColors[color]} ${intensities[intensity]} transition-all duration-300 hover:shadow-2xl group`}>
        {children}
      </div>
    );
  }

  return <div>{children}</div>;
}
