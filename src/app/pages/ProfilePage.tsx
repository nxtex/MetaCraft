import { useState } from 'react';
import { NavBar } from '../components/NavBar';
import { StratumCard } from '../components/StratumCard';
import { GoogleAdSpace } from '../components/GoogleAdSpace';
import { motion } from 'motion/react';
import { User, Mail, Lock, Bell, Shield, Palette, Database, Award, TrendingUp } from 'lucide-react';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'stats'>('profile');

  const stats = [
    { label: 'Artefacts analysés', value: '247', icon: Database, color: '#C9A84C' },
    { label: 'Fragments modifiés', value: '1,893', icon: TrendingUp, color: '#2AFC98' },
    { label: 'Jours actifs', value: '42', icon: Award, color: '#E8732A' },
    { label: 'Niveau fouilleur', value: 'Expert', icon: Shield, color: '#A052C8' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080A0F' }}>
      <NavBar />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <StratumCard className="p-6">
              <motion.div
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #E8732A)' }}
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <User className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: '#080A0F' }} />
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              <h3 className="text-xl text-center mb-1" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Dr. Anas Mesri</h3>
              <p className="text-sm text-center mb-4" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>Archéologue Numérique</p>

              <div
                className="px-3 py-2 text-center text-xs mb-4"
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  letterSpacing: '2px',
                  background: 'linear-gradient(90deg, rgba(201, 168, 76, 0.1), rgba(232, 115, 42, 0.1))',
                  color: '#C9A84C',
                }}
              >
                ⭐ NIVEAU EXPERT
              </div>

              {/* Tab buttons: horizontal on mobile, vertical on desktop */}
              <div className="flex lg:flex-col gap-2">
                {(['profile', 'settings', 'stats'] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 lg:flex-none px-3 lg:px-4 py-2 lg:py-3 text-center lg:text-left transition-all text-sm"
                    style={{
                      backgroundColor: activeTab === tab ? 'rgba(201, 168, 76, 0.15)' : 'transparent',
                      borderLeft: activeTab === tab ? '3px solid #C9A84C' : '3px solid transparent',
                      fontFamily: 'Bebas Neue, cursive',
                      letterSpacing: '2px',
                      color: activeTab === tab ? '#C9A84C' : '#7A7060',
                    }}
                    whileHover={{ x: 4 }}
                  >
                    {tab === 'profile' && '👤 Profil'}
                    {tab === 'settings' && '⚙️ Paramètres'}
                    {tab === 'stats' && '📊 Stats'}
                  </motion.button>
                ))}
              </div>
            </StratumCard>

            {/* Sidebar ad — hidden on mobile */}
            <div className="hidden lg:block">
              <GoogleAdSpace slot="sidebar-1" format="vertical" />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top ad */}
            <div className="flex justify-center">
              <GoogleAdSpace slot="header-1" format="horizontal" />
            </div>

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <StratumCard className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl mb-6" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Informations personnelles</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block mb-2 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>Nom complet</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                        <input
                          type="text"
                          defaultValue="Dr. Anas Mesri"
                          className="w-full pl-10 pr-4 py-3"
                          style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201, 168, 76, 0.3)', fontFamily: 'JetBrains Mono, monospace', color: '#EDE8DC' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
                        <input
                          type="email"
                          defaultValue="anas@metacraft.io"
                          className="w-full pl-10 pr-4 py-3"
                          style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201, 168, 76, 0.3)', fontFamily: 'JetBrains Mono, monospace', color: '#EDE8DC' }}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block mb-2 text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>Bio</label>
                      <textarea
                        rows={4}
                        defaultValue="Passionné d'archéologie numérique et de métadonnées. Expert en excavation de données cachées."
                        className="w-full px-4 py-3"
                        style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201, 168, 76, 0.3)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', resize: 'none' }}
                      />
                    </div>
                  </div>

                  <motion.button
                    className="mt-6 w-full sm:w-auto px-8 py-3"
                    style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px' }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201, 168, 76, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sauvegarder les modifications
                  </motion.button>
                </StratumCard>

                <div className="flex justify-center">
                  <GoogleAdSpace slot="content-1" format="rectangle" />
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <StratumCard className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl mb-6" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Paramètres</h2>

                  <div className="space-y-8">
                    {/* Security */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5" style={{ color: '#C9A84C' }} />
                        <h3 className="text-lg" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Sécurité</h3>
                      </div>
                      <div className="space-y-4">
                        <motion.button
                          className="w-full px-4 py-3 text-left flex items-center justify-between"
                          style={{ border: '1px dashed rgba(201, 168, 76, 0.4)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '14px' }}
                          whileHover={{ borderStyle: 'solid', backgroundColor: 'rgba(201, 168, 76, 0.05)' }}
                        >
                          <span>Changer le mot de passe</span>
                          <Lock className="w-4 h-4" style={{ color: '#C9A84C' }} />
                        </motion.button>
                        <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#141C2A' }}>
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '14px' }}>Authentification à deux facteurs</span>
                          <label className="relative inline-block w-12 h-6 flex-shrink-0">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-full h-full rounded-full peer-checked:bg-[#2AFC98] bg-[#7A7060] transition-all" />
                            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-5 h-5" style={{ color: '#C9A84C' }} />
                        <h3 className="text-lg" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Notifications</h3>
                      </div>
                      <div className="space-y-3">
                        {['Nouveaux artefacts', 'Modifications sauvegardées', 'Analyses terminées'].map((item) => (
                          <div key={item} className="flex items-center justify-between p-4" style={{ backgroundColor: '#141C2A' }}>
                            <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '14px' }}>{item}</span>
                            <label className="relative inline-block w-12 h-6 flex-shrink-0">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-full h-full rounded-full peer-checked:bg-[#2AFC98] bg-[#7A7060] transition-all" />
                              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Appearance */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Palette className="w-5 h-5" style={{ color: '#C9A84C' }} />
                        <h3 className="text-lg" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Apparence</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        {['Sombre', 'Clair', 'Auto'].map((theme) => (
                          <motion.button
                            key={theme}
                            className="p-3 sm:p-4 text-center text-sm"
                            style={{
                              border: theme === 'Sombre' ? '2px solid #C9A84C' : '1px solid rgba(201, 168, 76, 0.3)',
                              backgroundColor: theme === 'Sombre' ? 'rgba(201, 168, 76, 0.1)' : '#141C2A',
                              fontFamily: 'Bebas Neue, cursive',
                              letterSpacing: '2px',
                              color: theme === 'Sombre' ? '#C9A84C' : '#7A7060',
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {theme}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </StratumCard>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {stats.map((stat, index) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                      <StratumCard hover className="p-4 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs mb-2" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#7A7060' }}>{stat.label}</p>
                            <motion.p
                              className="text-4xl sm:text-5xl"
                              style={{ fontFamily: 'Cinzel, serif', color: stat.color }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              {stat.value}
                            </motion.p>
                          </div>
                          <stat.icon className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: stat.color, opacity: 0.3 }} />
                        </div>
                      </StratumCard>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <GoogleAdSpace slot="stats-1" format="horizontal" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
