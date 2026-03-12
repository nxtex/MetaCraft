import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: { name: string; email: string }) => void;
}

export function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth({ name: formData.name || 'Explorer', email: formData.email });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(8, 10, 15, 0.95)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Animated particles in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: '#C9A84C',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.1, 0.5, 0.1],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md p-8"
              style={{
                backgroundColor: '#0E1219',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                boxShadow: '0 20px 60px rgba(201, 168, 76, 0.2), 0 0 0 1px rgba(201, 168, 76, 0.1)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Ambient glow effect */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, #C9A84C 0%, transparent 70%)',
                  clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                }}
              />

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 transition-colors"
                style={{ color: '#C9A84C' }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <span className="text-6xl">🔐</span>
                </motion.div>
                <h2
                  className="text-3xl mb-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
                >
                  {mode === 'login' ? 'Accès Sécurisé' : 'Nouvel Explorateur'}
                </h2>
                <p
                  className="text-sm"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                >
                  {mode === 'login' ? 'Authentification requise pour accéder aux archives' : 'Rejoignez l\'expédition archéologique'}
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label
                      className="block mb-2 text-xs"
                      style={{
                        fontFamily: 'Bebas Neue, cursive',
                        letterSpacing: '2px',
                        color: '#C9A84C',
                      }}
                    >
                      NOM D'EXPLORATEUR
                    </label>
                    <div className="relative group">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                        style={{ color: '#7A7060' }}
                      />
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 transition-all focus:border-opacity-100"
                        style={{
                          backgroundColor: '#141C2A',
                          border: '1px solid rgba(201, 168, 76, 0.3)',
                          color: '#EDE8DC',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                        placeholder="Votre nom"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: mode === 'signup' ? 0.3 : 0.2 }}
                >
                  <label
                    className="block mb-2 text-xs"
                    style={{
                      fontFamily: 'Bebas Neue, cursive',
                      letterSpacing: '2px',
                      color: '#C9A84C',
                    }}
                  >
                    ADRESSE ÉLECTRONIQUE
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: '#7A7060' }}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 transition-all focus:border-opacity-100"
                      style={{
                        backgroundColor: '#141C2A',
                        border: '1px solid rgba(201, 168, 76, 0.3)',
                        color: '#EDE8DC',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                      placeholder="explorateur@metacraft.io"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: mode === 'signup' ? 0.4 : 0.3 }}
                >
                  <label
                    className="block mb-2 text-xs"
                    style={{
                      fontFamily: 'Bebas Neue, cursive',
                      letterSpacing: '2px',
                      color: '#C9A84C',
                    }}
                  >
                    MOT DE PASSE CRYPTÉ
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: '#7A7060' }}
                    />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 transition-all focus:border-opacity-100"
                      style={{
                        backgroundColor: '#141C2A',
                        border: '1px solid rgba(201, 168, 76, 0.3)',
                        color: '#EDE8DC',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                      placeholder="••••••••"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: '#7A7060' }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201, 168, 76, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 mt-6 relative overflow-hidden group"
                  style={{
                    backgroundColor: '#C9A84C',
                    color: '#080A0F',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '3px',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ backgroundColor: '#E8732A' }}
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">
                    {mode === 'login' ? '🔓 DÉVERROUILLER L\'ACCÈS' : '🎖️ REJOINDRE L\'EXPÉDITION'}
                  </span>
                </motion.button>
              </form>

              {/* Toggle mode */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm transition-colors hover:underline"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                >
                  {mode === 'login' ? (
                    <>Pas encore membre? <span style={{ color: '#C9A84C' }}>Créer un compte</span></>
                  ) : (
                    <>Déjà membre? <span style={{ color: '#C9A84C' }}>Se connecter</span></>
                  )}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
