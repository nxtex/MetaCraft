import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Brush, Upload, Search, Edit3, Shield, Zap, Globe, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Upload,
    color: '#C9A84C',
    title: 'Upload instantané',
    desc: 'Glissez n\'importe quel fichier — image, audio, PDF, vidéo. Stockage sécurisé sur Firebase Storage.',
  },
  {
    icon: Search,
    color: '#2AFC98',
    title: 'Extraction complète',
    desc: 'Lecture de toutes les couches : EXIF, GPS, ID3, XMP, PDF Info. Rien n\'est caché.',
  },
  {
    icon: Edit3,
    color: '#E8732A',
    title: 'Édition précise',
    desc: 'Modifiez les champs un par un et sauvegardez directement dans le fichier via ExifTool.',
  },
  {
    icon: Shield,
    color: '#A052C8',
    title: 'Données privées',
    desc: 'Chaque utilisateur ne voit que ses propres fichiers. Isolation totale via Firebase Auth.',
  },
  {
    icon: Zap,
    color: '#C9A84C',
    title: 'Temps réel',
    desc: 'Résultats en quelques secondes. Pas d\'attente, pas de queue.',
  },
  {
    icon: Globe,
    color: '#2AFC98',
    title: 'Accessible partout',
    desc: 'Application web, aucune installation. Fonctionne sur desktop et mobile.',
  },
];

const SUPPORTED = [
  { ext: 'JPEG / PNG / WebP / TIFF', tags: ['EXIF', 'GPS', 'IPTC', 'XMP'] },
  { ext: 'MP3 / FLAC / WAV / OGG',  tags: ['ID3v2', 'Artiste', 'Album', 'BPM'] },
  { ext: 'PDF',                      tags: ['Auteur', 'Titre', 'XMP', 'Pages'] },
  { ext: 'MP4 / MOV / AVI',         tags: ['Durée', 'Codec', 'Date', 'GPS'] },
];

export function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080A0F', color: '#EDE8DC' }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4"
        style={{ backgroundColor: 'rgba(8,10,15,0.95)', borderBottom: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2">
          <Brush className="w-5 h-5" style={{ color: '#C9A84C' }} />
          <span style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '2px', fontSize: '18px' }}>MetaCraft</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <motion.button className="px-4 py-2 text-sm" whileHover={{ color: '#C9A84C' }}
              style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#7A7060' }}>
              CONNEXION
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button className="px-5 py-2 text-sm"
              style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}
              whileHover={{ scale: 1.03, boxShadow: '0 0 16px rgba(201,168,76,0.4)' }}
              whileTap={{ scale: 0.97 }}>
              COMMENCER
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 sm:px-12 py-24 sm:py-40 text-center">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }} />

        <motion.div className="relative z-10 max-w-[860px] mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 mb-6"
            style={{ border: '1px solid rgba(201,168,76,0.4)', fontFamily: 'Bebas Neue, cursive', letterSpacing: '4px', color: '#C9A84C', fontSize: '11px' }}>
            OUTIL D’EXCAVATION NUMÉRIQUE
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6" style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(32px, 7vw, 72px)', lineHeight: 1.1, color: '#EDE8DC' }}>
            Révélez ce que{' '}
            <span style={{ color: '#C9A84C' }}>vos fichiers</span>{' '}cachent
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10 max-w-[580px] mx-auto"
            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 'clamp(14px, 2.5vw, 18px)', color: '#7A7060', lineHeight: 1.7 }}>
            MetaCraft extrait, affiche et modifie les métadonnées de vos images, audios,
            PDFs et vidéos — en quelques secondes, sans rien installer.
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <motion.button className="px-8 py-4 flex items-center gap-2 text-base"
                style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px' }}
                whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(201,168,76,0.5)' }}
                whileTap={{ scale: 0.97 }}>
                DÉMARRER GRATUITEMENT <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button className="px-8 py-4 text-base"
                style={{ border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C', fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px' }}
                whileHover={{ backgroundColor: 'rgba(201,168,76,0.08)' }}>
                SE CONNECTER
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section className="px-6 sm:px-12 py-20" style={{ backgroundColor: '#0C101A' }}>
        <div className="max-w-[1000px] mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="mb-3" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '4px', color: '#C9A84C', fontSize: '12px' }}>COMMENT ÇA FONCTIONNE</p>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px, 4vw, 40px)', color: '#EDE8DC' }}>3 étapes, c’est tout</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Uploadez', desc: 'Glissez votre fichier ou cliquez pour le sélectionner. Il est stocké de façon privée sur Firebase.', color: '#C9A84C' },
              { step: '02', title: 'Inspectez', desc: 'Toutes les métadonnées sont extraites automatiquement et affichées clairement, champ par champ.', color: '#2AFC98' },
              { step: '03', title: 'Modifiez', desc: 'Éditez les champs que vous voulez et sauvegardez. Le fichier est mis à jour immédiatement.', color: '#E8732A' },
            ].map((s, i) => (
              <motion.div key={s.step}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="p-6 relative"
                style={{ border: `1px solid ${s.color}22`, backgroundColor: '#141C2A' }}>
                <div className="text-6xl mb-4" style={{ fontFamily: 'Cinzel, serif', color: s.color, opacity: 0.3, lineHeight: 1 }}>{s.step}</div>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>{s.title}</h3>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', color: '#7A7060', lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-12 py-20">
        <div className="max-w-[1100px] mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="mb-3" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '4px', color: '#C9A84C', fontSize: '12px' }}>FONCTIONNALITÉS</p>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px, 4vw, 40px)', color: '#EDE8DC' }}>Tout ce dont vous avez besoin</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6" style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.1)' }}
                whileHover={{ borderColor: `${f.color}44`, backgroundColor: '#1A2235' }}>
                <f.icon className="w-8 h-8 mb-4" style={{ color: f.color }} />
                <h3 className="text-base mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>{f.title}</h3>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#7A7060', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supported formats ──────────────────────────────────── */}
      <section className="px-6 sm:px-12 py-20" style={{ backgroundColor: '#0C101A' }}>
        <div className="max-w-[900px] mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="mb-3" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '4px', color: '#C9A84C', fontSize: '12px' }}>COMPATIBILITÉ</p>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px, 4vw, 40px)', color: '#EDE8DC' }}>Formats supportés</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUPPORTED.map((s, i) => (
              <motion.div key={s.ext}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-5"
                style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.12)' }}>
                <div className="flex-1">
                  <p className="mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC', fontSize: '15px' }}>{s.ext}</p>
                  <div className="flex gap-2 flex-wrap">
                    {s.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 text-xs"
                        style={{ backgroundColor: 'rgba(201,168,76,0.12)', fontFamily: 'Bebas Neue, cursive', letterSpacing: '1px', color: '#C9A84C' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-12 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 max-w-[600px] mx-auto">
          <h2 className="mb-4" style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 52px)', color: '#EDE8DC', lineHeight: 1.2 }}>
            Prêt à explorer vos fichiers ?
          </h2>
          <p className="mb-8" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '16px', color: '#7A7060' }}>
            Gratuit. Aucune carte de crédit. Commencez en 30 secondes.
          </p>
          <Link to="/signup">
            <motion.button className="px-10 py-4 text-base"
              style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(201,168,76,0.5)' }}
              whileTap={{ scale: 0.97 }}>
              CRÉER UN COMPTE GRATUIT
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="flex items-center gap-2">
          <Brush className="w-4 h-4" style={{ color: '#C9A84C' }} />
          <span style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C', letterSpacing: '2px', fontSize: '14px' }}>MetaCraft</span>
        </div>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>
          © {new Date().getFullYear()} MetaCraft — Outil d’excavation numérique
        </p>
      </footer>
    </div>
  );
}
