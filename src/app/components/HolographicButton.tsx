import { ReactNode, useState } from 'react';
import { motion } from 'motion/react';

interface HolographicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export function HolographicButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: HolographicButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: '#C9A84C',
          text: '#080A0F',
          glow: 'rgba(201, 168, 76, 0.5)',
          border: '#E8732A',
        };
      case 'secondary':
        return {
          bg: 'transparent',
          text: '#EDE8DC',
          glow: 'rgba(201, 168, 76, 0.3)',
          border: '#C9A84C',
        };
      case 'danger':
        return {
          bg: 'transparent',
          text: '#C0392B',
          glow: 'rgba(192, 57, 43, 0.3)',
          border: '#C0392B',
        };
    }
  };

  const colors = getColors();

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        backgroundColor: variant === 'primary' ? colors.bg : 'transparent',
        border: variant !== 'primary' ? `1.5px solid ${colors.border}` : 'none',
        color: colors.text,
        fontFamily: 'Bebas Neue, cursive',
        letterSpacing: '3px',
        padding: '12px 32px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
      }}
    >
      {/* Holographic shine effect */}
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${colors.glow}, transparent 60%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Scan line effect */}
      {isHovered && !disabled && (
        <motion.div
          className="absolute left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
          }}
          initial={{ top: '-2px' }}
          animate={{ top: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-2 h-2 border-t border-l transition-all duration-300"
        style={{
          borderColor: isHovered && !disabled ? colors.border : 'transparent',
          opacity: isHovered && !disabled ? 1 : 0,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-all duration-300"
        style={{
          borderColor: isHovered && !disabled ? colors.border : 'transparent',
          opacity: isHovered && !disabled ? 1 : 0,
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
