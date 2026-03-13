import { useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import { motion } from 'motion/react';
import { User, Mail, Database, TrendingUp, Award, Shield, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserFiles } from '../../lib/firestore';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [fileCount, setFileCount] = useState<number | null>(null);
  const [name, setName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      getUserFiles(user.uid).then(f => setFileCount(f.length)).catch(() => {});
    }
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      toast.success('Profil mis a jour');
    } catch {
      toast.error('Erreur de mise a jour');
    } finally {
      setSaving(false);
    }
  }

  const daysSince = user?.metadata.creationTime
    ? Math.floor((Date.now() - new Date(user.metadata.creationTime).getTime()) / 86400000)
    : 0;

  const level = (fileCount ?? 0) >= 50 ? 'Expert' : (fileCount ?? 0) >= 10 ? 'Intermediaire' : 'Debutant';

  const stats = [
    { label: 'Fichiers analyses', value: fileCount !== null ? String(fileCount) : '...', icon: Database, color: '#c9a84c' },
    { label: 'Jours actif', value: String(daysSince), icon: TrendingUp, color: '#22c55e' },
    { label: 'Niveau', value: level, icon: Award, color: '#f59e0b' },
    { label: 'Statut', value: 'Actif', icon: Shield, color: '#8b5cf6' },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <h1 className="text-2xl sm:text-3xl text-[#f5f5f5] mb-10" style={{ fontFamily: 'Cinzel, serif' }}>
          Profil
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.08 }}
              className="bg-[#0a0a0a] border border-[#141414] p-6"
            >
              <s.icon className="w-5 h-5 mb-3 opacity-60" style={{ color: s.color }} />
              <p className="text-xl mb-1" style={{ fontFamily: 'Cinzel, serif', color: s.color }}>
                {s.value}
              </p>
              <p 
                className="text-[10px] text-[#6b6b6b]"
                style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Edit Form */}
        <div className="bg-[#0a0a0a] border border-[#141414] p-8">
          <h2 className="text-lg text-[#f5f5f5] mb-8" style={{ fontFamily: 'Cinzel, serif' }}>
            Informations
          </h2>
          
          <form onSubmit={handleSave} className="space-y-6 max-w-md">
            <div>
              <label 
                className="block mb-2 text-[10px] text-[#c9a84c]"
                style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
              >
                NOM
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f3f]" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#050505] border border-[#1c1c1c] text-[#f5f5f5] text-sm focus:border-[#c9a84c]/30 focus:outline-none transition-colors"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }} 
                />
              </div>
            </div>
            
            <div>
              <label 
                className="block mb-2 text-[10px] text-[#c9a84c]"
                style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
              >
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f3f]" />
                <input 
                  type="email" 
                  value={user?.email ?? ''} 
                  disabled
                  className="w-full pl-12 pr-4 py-3.5 bg-[#050505] border border-[#1c1c1c]/50 text-[#6b6b6b] text-sm opacity-60 cursor-not-allowed"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }} 
                />
              </div>
            </div>
            
            <motion.button 
              type="submit" 
              disabled={saving}
              className="px-6 py-3 flex items-center gap-2 bg-[#c9a84c] text-[#050505] text-xs disabled:opacity-50"
              style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201, 168, 76, 0.2)' }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {saving ? 'SAUVEGARDE...' : 'SAUVEGARDER'}
            </motion.button>
          </form>
        </div>

        {/* Logout */}
        <motion.button 
          onClick={logout} 
          className="mt-6 px-5 py-2.5 text-xs border border-[#f43f5e]/20 text-[#f43f5e] hover:bg-[#f43f5e]/5 transition-colors"
          style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          DECONNEXION
        </motion.button>
      </div>
    </div>
  );
}
