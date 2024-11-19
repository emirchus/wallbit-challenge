import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const RetroScreen = ({ children, className }: Props) => {
  return (
    <div className={cn('relative h-screen w-full bg-background', className)}>
      <div
        className="pointer-events-none absolute inset-0 bg-repeat z-[100]"
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
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          opacity: 0.02,
          animation: 'noise 0.2s infinite',
        }}
      />
      <div
        className="relative z-10 min-h-screen overflow-auto p-8"
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
        <div className='scanlines'/>
      </div>
    </div>
  );
};
