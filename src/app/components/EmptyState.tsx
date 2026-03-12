import { Brush } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Brush
        className="w-20 h-20 mb-6"
        style={{ color: '#C9A84C', opacity: 0.2 }}
      />
      <h3
        className="text-2xl mb-2"
        style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}
      >
        {title}
      </h3>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
      >
        {subtitle}
      </p>
      <div
        className="w-64 h-32 relative"
        style={{
          border: '2px dashed rgba(201, 168, 76, 0.2)',
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xs"
            style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
          >
            Parcelle d'excavation vide
          </span>
        </div>
      </div>
    </div>
  );
}
