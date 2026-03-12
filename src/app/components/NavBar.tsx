import { Link, useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Upload, History, User, Brush, LogOut } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4"
      style={{ backgroundColor: 'rgba(8,10,15,0.95)', borderBottom: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(12px)' }}>
      <Link to="/" className="flex items-center gap-2 no-underline">
        <Brush className="w-5 h-5" style={{ color: '#C9A84C' }} />
        <span className="hidden sm:inline" style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '2px', fontSize: '18px' }}>MetaCraft</span>
      </Link>

      <div className="flex items-center gap-1">
        {NAV.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}>
              <motion.div className="flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs"
                style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: active ? '#C9A84C' : '#7A7060', borderBottom: active ? '2px solid #C9A84C' : '2px solid transparent' }}
                whileHover={{ color: '#C9A84C' }}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
            {user.displayName ?? user.email}
          </span>
          <motion.button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs"
            style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#7A7060', border: '1px solid rgba(192,57,43,0.3)' }}
            whileHover={{ color: '#C0392B', borderColor: 'rgba(192,57,43,0.7)' }}
            whileTap={{ scale: 0.95 }}>
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">DÉCO</span>
          </motion.button>
        </div>
      )}
    </nav>
  );
}
