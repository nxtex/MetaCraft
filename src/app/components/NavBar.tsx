import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Upload, History, User, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { path: '/app', icon: Upload, label: 'Analyser' },
  { path: '/history', icon: History, label: 'Historique' },
  { path: '/profile', icon: User, label: 'Profil' },
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
    <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-[#c9a84c]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c9a84c]/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <span 
              className="hidden sm:inline text-xs tracking-[0.3em] text-[#c9a84c]"
              style={{ fontFamily: 'Bebas Neue, cursive' }}
            >
              METACRAFT
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {NAV.map(({ path, icon: Icon, label }) => {
              const active = location.pathname === path;
              return (
                <Link key={path} to={path}>
                  <motion.div 
                    className={`
                      flex items-center gap-2 px-4 py-2 text-xs tracking-[0.1em]
                      transition-all duration-200
                      ${active 
                        ? 'bg-[#c9a84c]/10 text-[#c9a84c]' 
                        : 'text-[#6b6b6b] hover:text-[#f5f5f5] hover:bg-[#0f0f0f]'
                      }
                    `}
                    style={{ fontFamily: 'Bebas Neue, cursive' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* User & Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <span 
                className="hidden md:inline text-xs text-[#6b6b6b] truncate max-w-[120px]"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {user.displayName ?? user.email}
              </span>
              <motion.button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#6b6b6b] border border-[#f43f5e]/20 hover:text-[#f43f5e] hover:border-[#f43f5e]/40 transition-colors"
                style={{ fontFamily: 'Bebas Neue, cursive' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
