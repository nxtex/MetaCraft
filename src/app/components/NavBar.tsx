import { Link, useLocation } from 'react-router';
import { Brush, Github, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function NavBar() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Upload' },
    { path: '/batch', label: 'Batch Analysis' },
    { path: '/history', label: 'History' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: '#0E1219',
        borderBottomColor: 'rgba(201, 168, 76, 0.2)',
      }}
    >
      <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Brush className="w-6 h-6" style={{ color: '#C9A84C' }} />
          </motion.div>
          <span
            className="text-2xl tracking-wide group-hover:brightness-110 transition-all"
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#C9A84C',
            }}
          >
            MetaCraft
          </span>
        </Link>

        {/* Center navigation */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative px-1 py-2 transition-all group"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.875rem',
                letterSpacing: '2px',
                fontVariant: 'small-caps',
                color: isActive(link.path) ? '#C9A84C' : '#EDE8DC',
              }}
            >
              {link.label}
              {isActive(link.path) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    backgroundColor: '#C9A84C',
                    boxShadow: '0 0 8px rgba(201, 168, 76, 0.6)',
                  }}
                />
              )}
              {!isActive(link.path) && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: '#C9A84C',
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <motion.button
            className="p-2 rounded transition-all"
            style={{
              border: '1px solid #C9A84C',
              color: '#C9A84C',
            }}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <Github className="w-5 h-5" />
          </motion.button>
          <Link to="/profile">
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8732A)',
              }}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <User className="w-5 h-5" style={{ color: '#080A0F' }} />
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}