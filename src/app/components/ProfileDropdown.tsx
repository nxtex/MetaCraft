import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { User, Settings, LogOut, BarChart3, Clock, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileDropdownProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #C9A84C, #E8732A)',
          boxShadow: isOpen ? '0 0 20px rgba(201, 168, 76, 0.6)' : 'none',
        }}
      >
        <User className="w-5 h-5" style={{ color: '#080A0F' }} />
        
        {/* Rotating ring on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid #C9A84C',
            opacity: 0,
          }}
          animate={isOpen ? { opacity: 1, scale: 1.2, rotate: 360 } : { opacity: 0, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 overflow-hidden"
            style={{
              backgroundColor: '#0E1219',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(201, 168, 76, 0.2)',
              zIndex: 100,
            }}
          >
            {/* Header */}
            <div className="p-4 relative overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.1), rgba(232, 115, 42, 0.1))',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #E8732A)' }}
                  >
                    <User className="w-6 h-6" style={{ color: '#080A0F' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium"
                      style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}
                    >
                      {user.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { icon: BarChart3, label: 'Analyses', value: '127' },
                    { icon: Clock, label: 'Heures', value: '45' },
                    { icon: Award, label: 'Niveau', value: '12' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center p-2"
                      style={{
                        backgroundColor: 'rgba(201, 168, 76, 0.05)',
                        border: '1px solid rgba(201, 168, 76, 0.1)',
                      }}
                    >
                      <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: '#C9A84C' }} />
                      <p
                        className="text-lg font-bold"
                        style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="text-xs"
                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                      >
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(201, 168, 76, 0.2)' }} />

            {/* Menu items */}
            <div className="py-2">
              {[
                { icon: User, label: 'Mon Profil', path: '/profile', color: '#C9A84C' },
                { icon: Settings, label: 'Paramètres', path: '/settings', color: '#2AFC98' },
              ].map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 transition-all group"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.05)';
                      e.currentTarget.style.borderLeft = '3px solid ' + item.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderLeft = '3px solid transparent';
                    }}
                    style={{ borderLeft: '3px solid transparent' }}
                  >
                    <item.icon className="w-4 h-4 transition-colors" style={{ color: '#7A7060' }} />
                    <span
                      className="text-sm transition-colors"
                      style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(201, 168, 76, 0.2)' }} />

            {/* Logout */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 transition-all group"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(192, 57, 43, 0.1)';
                e.currentTarget.style.borderLeft = '3px solid #C0392B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderLeft = '3px solid transparent';
              }}
              style={{ borderLeft: '3px solid transparent' }}
            >
              <LogOut className="w-4 h-4" style={{ color: '#C0392B' }} />
              <span
                className="text-sm"
                style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#C0392B' }}
              >
                Déconnexion
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
