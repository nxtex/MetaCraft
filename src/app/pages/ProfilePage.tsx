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
  const [name, setName]           = useState(user?.displayName ?? '');
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    if (user) getUserFiles(user.uid).then(f => setFileCount(f.length)).catch(() => {});
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      toast.success('Profil mis à jour');
    } catch { toast.error('Erreur de mise à jour'); }
    finally { setSaving(false); }
  }

  const daysSince = user?.metadata.creationTime
    ? Math.floor((Date.now() - new Date(user.metadata.creationTime).getTime()) / 86400000)
    : 0;

  const level = (fileCount ?? 0) >= 50 ? 'Expert' : (fileCount ?? 0) >= 10 ? 'Intermédiaire' : 'Débutant';

  const stats = [
    { label: 'Artefacts analysés', value: fileCount !== null ? String(fileCount) : '…', icon: Database,  color: '#C9A84C' },
    { label: 'Jours d’activité',    value: String(daysSince),                              icon: TrendingUp, color: '#2AFC98' },
    { label: 'Niveau',              value: level,                                          icon: Award,     color: '#E8732A' },
    { label: 'Statut compte',       value: 'Actif',                                        icon: Shield,    color: '#A052C8' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080A0F' }}>
      <NavBar />
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl mb-8" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Profil</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ backgroundColor: '#0C101A', border: '1px solid rgba(201,168,76,0.12)', padding: '20px' }}>
              <s.icon className="w-6 h-6 mb-2" style={{ color: s.color, opacity: 0.7 }} />
              <p className="text-2xl mb-1" style={{ fontFamily: 'Cinzel, serif', color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '1px', color: '#7A7060' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Edit profile */}
        <div style={{ backgroundColor: '#0C101A', border: '1px solid rgba(201,168,76,0.12)', padding: '28px' }}>
          <h2 className="text-xl mb-6" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Informations</h2>
          <form onSubmit={handleSave} className="space-y-4 max-w-[480px]">
            <div>
              <label className="block mb-1.5 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>NOM</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 outline-none"
                  style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.25)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }} />
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                <input type="email" value={user?.email ?? ''} disabled
                  className="w-full pl-10 pr-4 py-3 outline-none opacity-50"
                  style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.1)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }} />
              </div>
            </div>
            <motion.button type="submit" disabled={saving}
              className="px-8 py-3 flex items-center gap-2"
              style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201,168,76,0.4)' }}
              whileTap={{ scale: 0.98 }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {saving ? 'SAUVEGARDE...' : 'SAUVEGARDER'}
            </motion.button>
          </form>
        </div>

        <motion.button onClick={logout} className="mt-6 px-6 py-2 text-sm"
          style={{ border: '1px solid rgba(192,57,43,0.35)', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C0392B' }}
          whileHover={{ backgroundColor: 'rgba(192,57,43,0.1)' }}>
          DÉCONNEXION
        </motion.button>
      </div>
    </div>
  );
}
