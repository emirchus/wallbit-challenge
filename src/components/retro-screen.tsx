import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const RetroScreen = ({ children, className }: Props) => {
  return (
    <div className={cn('relative min-h-svh w-full bg-background', className)}>
      <div
        className="pointer-events-none absolute inset-0 z-[100] bg-repeat"
        style={{
          backgroundImage: `linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)`,
          backgroundSize: '100% 4px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00ff9580] via-transparent to-transparent opacity-20" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 150px 20px #000000',
        }}
      />
      <div
        className="relative z-10 min-h-screen p-8 overflow-auto"
        style={{
          background: 'radial-gradient(circle at center, #00180030 0%, #001800 100%)',
          borderRadius: '40px',
          transform: 'perspective(1000px) rotateX(2deg)',
          boxShadow: 'inset 0 0 50px 10px rgba(0,0,0,0.9)',
        }}
      >
        <div
          className="relative text-xl"
          style={{
            textShadow: '0 0 5px rgba(0, 255, 149, 0.5)',
          }}
        >
          {children}
        </div>
        <div className="scanlines" />
      </div>
    </div>
  );
};
