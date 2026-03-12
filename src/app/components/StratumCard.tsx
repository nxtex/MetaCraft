import { ReactNode } from 'react';

interface StratumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function StratumCard({ children, className = '', hover = false }: StratumCardProps) {
  return (
    <div
      className={`relative transition-all ${hover ? 'hover:border-opacity-60' : ''} ${className}`}
      style={{
        backgroundColor: '#0E1219',
        border: '1px solid rgba(201, 168, 76, 0.25)',
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        ...(hover && {
          boxShadow: '0 0 0 0 rgba(201, 168, 76, 0.1)',
        }),
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.6)';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(201, 168, 76, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.25)';
          e.currentTarget.style.boxShadow = '0 0 0 0 rgba(201, 168, 76, 0.1)';
        }
      }}
    >
      {/* Patina effect on border */}
      <div
        className="absolute bottom-0 right-0 w-full h-full pointer-events-none"
        style={{
          background: 'linear-gradient(to top left, rgba(0,0,0,0.2) 0%, transparent 30%)',
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}
      />
      {children}
    </div>
  );
}
