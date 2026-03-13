import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, FileImage, Music, FileText, Film, ChevronDown, Sparkles } from 'lucide-react';

const FEATURES = [
  { title: 'Extraction Instantanee', desc: 'Analysez EXIF, GPS, ID3, XMP et plus en quelques secondes.' },
  { title: 'Edition Precise', desc: 'Modifiez chaque champ individuellement et sauvegardez.' },
  { title: 'Stockage Prive', desc: 'Vos fichiers restent les votres. Aucun partage.' },
  { title: 'Multi-formats', desc: 'Images, audio, PDF, video — tout est supporte.' },
  { title: 'Interface Fluide', desc: 'Experience utilisateur raffinee et intuitive.' },
  { title: 'Sans Installation', desc: 'Application web complete. Rien a telecharger.' },
];

const FORMATS = [
  { icon: FileImage, label: 'Images', types: 'JPEG, PNG, WebP, TIFF, RAW', color: '#c9a84c' },
  { icon: Music, label: 'Audio', types: 'MP3, FLAC, WAV, AAC, OGG', color: '#22c55e' },
  { icon: FileText, label: 'Documents', types: 'PDF', color: '#f59e0b' },
  { icon: Film, label: 'Video', types: 'MP4, MOV, AVI, MKV', color: '#8b5cf6' },
];

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#f5f5f5] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 border-b border-[#c9a84c]/10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#c9a84c]/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#c9a84c]" />
              </div>
              <span className="text-sm tracking-[0.3em] text-[#c9a84c]" style={{ fontFamily: 'Bebas Neue, cursive' }}>
                METACRAFT
              </span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Link to="/login">
                <motion.button 
                  className="px-5 py-2.5 text-xs tracking-[0.2em] text-[#9a9a9a] hover:text-[#f5f5f5] transition-colors"
                  style={{ fontFamily: 'Bebas Neue, cursive' }}
                  whileHover={{ x: 2 }}
                >
                  CONNEXION
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button 
                  className="px-6 py-2.5 text-xs tracking-[0.2em] bg-[#c9a84c] text-[#050505]"
                  style={{ fontFamily: 'Bebas Neue, cursive' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  COMMENCER
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12">
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{
            backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} 
        />
        
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/[0.03] blur-[100px] pointer-events-none" />

        <motion.div 
          className="relative z-10 max-w-4xl mx-auto text-center pt-20"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.4em] text-[#c9a84c] mb-8"
            style={{ fontFamily: 'Bebas Neue, cursive' }}
          >
            EXCAVATION NUMERIQUE
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-8"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Revelez ce que vos
            <br />
            <span className="text-[#c9a84c]">fichiers cachent</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg text-[#6b6b6b] max-w-xl mx-auto mb-12 leading-relaxed"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          >
            MetaCraft extrait, affiche et modifie les metadonnees de vos images, 
            audios, PDFs et videos.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <motion.button 
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#c9a84c] text-[#050505] text-sm tracking-[0.15em]"
                style={{ fontFamily: 'Bebas Neue, cursive' }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(201, 168, 76, 0.25)' }}
                whileTap={{ scale: 0.98 }}
              >
                DEMARRER GRATUITEMENT
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 text-[#6b6b6b]"
          >
            <span className="text-[10px] tracking-[0.3em]" style={{ fontFamily: 'Bebas Neue, cursive' }}>SCROLL</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 lg:px-12 border-t border-[#c9a84c]/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <p className="text-[10px] tracking-[0.4em] text-[#c9a84c] mb-4" style={{ fontFamily: 'Bebas Neue, cursive' }}>
              PROCESSUS
            </p>
            <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: 'Cinzel, serif' }}>
              Trois etapes simples
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#c9a84c]/10">
            {[
              { num: '01', title: 'Uploadez', desc: 'Glissez votre fichier dans la zone de depot. Stockage securise et prive.' },
              { num: '02', title: 'Inspectez', desc: 'Toutes les metadonnees sont extraites et presentees clairement.' },
              { num: '03', title: 'Modifiez', desc: 'Editez les champs et telechargez le fichier mis a jour.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#050505] p-10 lg:p-14 group"
              >
                <span 
                  className="text-6xl lg:text-7xl text-[#1c1c1c] group-hover:text-[#c9a84c]/20 transition-colors duration-500"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {step.num}
                </span>
                <h3 className="text-xl mt-6 mb-4 text-[#f5f5f5]" style={{ fontFamily: 'Cinzel, serif' }}>
                  {step.title}
                </h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 lg:px-12 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <p className="text-[10px] tracking-[0.4em] text-[#c9a84c] mb-4" style={{ fontFamily: 'Bebas Neue, cursive' }}>
              FONCTIONNALITES
            </p>
            <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: 'Cinzel, serif' }}>
              Tout ce dont vous avez besoin
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-8 border border-[#1c1c1c] hover:border-[#c9a84c]/20 transition-colors duration-300"
              >
                <h3 className="text-base mb-3 text-[#f5f5f5]" style={{ fontFamily: 'Cinzel, serif' }}>
                  {f.title}
                </h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="py-32 px-6 lg:px-12 border-t border-[#c9a84c]/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <p className="text-[10px] tracking-[0.4em] text-[#c9a84c] mb-4" style={{ fontFamily: 'Bebas Neue, cursive' }}>
              COMPATIBILITE
            </p>
            <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: 'Cinzel, serif' }}>
              Formats supportes
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FORMATS.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 bg-[#0a0a0a] border border-[#1c1c1c] hover:border-[#c9a84c]/15 transition-colors group"
              >
                <f.icon className="w-8 h-8 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: f.color }} />
                <p className="text-sm mb-1" style={{ fontFamily: 'Cinzel, serif', color: f.color }}>{f.label}</p>
                <p className="text-xs text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{f.types}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 lg:px-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a84c]/[0.02] to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            Pret a explorer ?
          </h2>
          <p className="text-[#6b6b6b] mb-10" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            Gratuit. Aucune carte de credit requise.
          </p>
          <Link to="/signup">
            <motion.button 
              className="group inline-flex items-center gap-3 px-10 py-5 bg-[#c9a84c] text-[#050505] text-sm tracking-[0.15em]"
              style={{ fontFamily: 'Bebas Neue, cursive' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(201, 168, 76, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              CREER UN COMPTE
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 lg:px-12 border-t border-[#1c1c1c]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c9a84c]/60" />
            <span className="text-xs tracking-[0.2em] text-[#c9a84c]/60" style={{ fontFamily: 'Bebas Neue, cursive' }}>
              METACRAFT
            </span>
          </div>
          <p className="text-xs text-[#3f3f3f]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {new Date().getFullYear()} MetaCraft
          </p>
        </div>
      </footer>
    </div>
  );
}
