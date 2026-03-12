import { motion } from 'motion/react';

interface GoogleAdSpaceProps {
  slot: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export function GoogleAdSpace({ slot, format = 'horizontal', className = '' }: GoogleAdSpaceProps) {
  const dimensions = {
    horizontal: { width: '728px', height: '90px' },
    vertical: { width: '160px', height: '600px' },
    rectangle: { width: '300px', height: '250px' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden ${className}`}
      style={{
        maxWidth: dimensions[format].width,
        height: dimensions[format].height,
        backgroundColor: '#0E1219',
        border: '1px solid rgba(201, 168, 76, 0.15)',
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
      }}
    >
      {/* Animated border glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.3), transparent)',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />
      
      {/* Placeholder content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <p
          className="text-xs mb-1"
          style={{
            fontFamily: 'Bebas Neue, cursive',
            letterSpacing: '3px',
            color: '#7A7060',
          }}
        >
          ESPACE PUBLICITAIRE
        </p>
        <p
          className="text-[10px]"
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            color: '#7A7060',
            opacity: 0.5,
          }}
        >
          Google AdSense · Slot: {slot}
        </p>
        <div className="mt-2 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: '#C9A84C' }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner ornaments */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: 'rgba(201, 168, 76, 0.2)' }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2" style={{ borderColor: 'rgba(201, 168, 76, 0.2)' }} />
    </motion.div>
  );
}
