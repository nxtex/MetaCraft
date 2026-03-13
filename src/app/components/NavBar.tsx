import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Upload, History, User, Layers, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { path: '/app',     icon: Upload,  label: 'Analyser' },
  { path: '/history', icon: History, label: 'Historique' },
  { path: '/profile', icon: User,    label: 'Profil' },
];

export function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#d4af37]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center group-hover:bg-[#d4af37]/20 transition-colors">
            <Layers className="w-4 h-4 text-[#d4af37]" />
          </div>
          <span className="hidden sm:inline font-cinzel text-base tracking-[0.2em] text-[#d4af37]">
            METACRAFT
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {NAV.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}>
                <motion.div 
                  className={`
                    flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-sm
                    transition-all duration-200
                    ${active 
                      ? 'bg-[#d4af37]/10 text-[#d4af37]' 
                      : 'text-[#8a8a8a] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline font-bebas tracking-[0.1em]">{label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs text-[#8a8a8a] font-ibm-plex-mono truncate max-w-[150px]">
              {user.displayName ?? user.email}
            </span>
            <motion.button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-[#8a8a8a] border border-[#dc2626]/30 rounded-full hover:text-[#dc2626] hover:border-[#dc2626]/60 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-bebas tracking-[0.1em]">DECO</span>
            </motion.button>
          </div>
        )}
      </div>
    </nav>
  );
}
