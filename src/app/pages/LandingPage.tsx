import { Link } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { 
  Upload, Search, Edit3, Shield, Zap, Globe, 
  ArrowRight, Layers, FileImage, Music, FileText, Film,
  ChevronDown
} from 'lucide-react';

const FEATURES = [
  {
    icon: Upload,
    title: 'Upload instantane',
    desc: 'Glissez n\'importe quel fichier. Stockage securise et prive.',
  },
  {
    icon: Search,
    title: 'Extraction complete',
    desc: 'Lecture de toutes les couches : EXIF, GPS, ID3, XMP, PDF Info.',
  },
  {
    icon: Edit3,
    title: 'Edition precise',
    desc: 'Modifiez les champs un par un et sauvegardez directement.',
  },
  {
    icon: Shield,
    title: 'Donnees privees',
    desc: 'Chaque utilisateur ne voit que ses propres fichiers.',
  },
  {
    icon: Zap,
    title: 'Temps reel',
    desc: 'Resultats en quelques secondes. Pas d\'attente.',
  },
  {
    icon: Globe,
    title: 'Accessible partout',
    desc: 'Application web, aucune installation requise.',
  },
];

const FORMATS = [
  { icon: FileImage, label: 'Images', formats: 'JPEG, PNG, WebP, TIFF', tags: ['EXIF', 'GPS', 'IPTC', 'XMP'] },
  { icon: Music, label: 'Audio', formats: 'MP3, FLAC, WAV, OGG', tags: ['ID3v2', 'Artiste', 'Album'] },
  { icon: FileText, label: 'Documents', formats: 'PDF', tags: ['Auteur', 'Titre', 'XMP'] },
  { icon: Film, label: 'Video', formats: 'MP4, MOV, AVI', tags: ['Duree', 'Codec', 'GPS'] },
];

export function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between py-6 border-b border-[#d4af37]/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center group-hover:bg-[#d4af37]/20 transition-colors">
              <Layers className="w-4 h-4 text-[#d4af37]" />
            </div>
            <span className="font-cinzel text-lg tracking-[0.2em] text-[#d4af37]">METACRAFT</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <motion.button 
                className="px-6 py-2.5 text-sm tracking-[0.15em] text-[#8a8a8a] hover:text-[#f5f5f5] transition-colors font-bebas"
                whileHover={{ x: 2 }}
              >
                CONNEXION
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button 
                className="px-6 py-2.5 text-sm tracking-[0.15em] bg-[#d4af37] text-[#0a0a0a] font-bebas rounded-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                COMMENCER
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 pt-24">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} 
        />
        
        {/* Radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#d4af37]/5 blur-[120px]" />

        <motion.div 
          className="relative z-10 max-w-4xl mx-auto text-center"
          style={{ opacity, scale, y }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 text-xs tracking-[0.3em] text-[#d4af37] border border-[#d4af37]/20 rounded-full font-bebas">
              EXCAVATION NUMERIQUE
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-cinzel text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] mb-8 tracking-tight"
          >
            Revelez ce que{' '}
            <span className="text-[#d4af37]">vos fichiers</span>
            <br />cachent
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-[#8a8a8a] max-w-2xl mx-auto mb-12 leading-relaxed font-ibm-plex-mono"
          >
            MetaCraft extrait, affiche et modifie les metadonnees de vos images, 
            audios, PDFs et videos — en quelques secondes.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup">
              <motion.button 
                className="group flex items-center gap-3 px-8 py-4 bg-[#d4af37] text-[#0a0a0a] font-bebas text-lg tracking-[0.15em] rounded-full"
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                DEMARRER GRATUITEMENT
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button 
                className="px-8 py-4 text-[#d4af37] font-bebas text-lg tracking-[0.15em] border border-[#d4af37]/30 rounded-full hover:bg-[#d4af37]/5 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                SE CONNECTER
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-[#8a8a8a]"
          >
            <span className="text-xs tracking-[0.2em] font-bebas">DECOUVRIR</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs tracking-[0.3em] text-[#d4af37] font-bebas block mb-4">PROCESSUS</span>
            <h2 className="font-cinzel text-4xl sm:text-5xl">Trois etapes simples</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4">
            {[
              { num: '01', title: 'Uploadez', desc: 'Glissez votre fichier ou cliquez pour le selectionner. Stockage prive et securise.' },
              { num: '02', title: 'Inspectez', desc: 'Toutes les metadonnees sont extraites et affichees clairement, champ par champ.' },
              { num: '03', title: 'Modifiez', desc: 'Editez les champs que vous voulez et sauvegardez. Mise a jour immediate.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative group"
              >
                <div className="p-10 bg-[#111111] border border-[#222222] hover:border-[#d4af37]/30 transition-all duration-500 h-full">
                  <span className="font-cinzel text-6xl text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors duration-500">
                    {step.num}
                  </span>
                  <h3 className="font-cinzel text-2xl text-[#f5f5f5] mt-4 mb-4">{step.title}</h3>
                  <p className="text-[#8a8a8a] leading-relaxed font-ibm-plex-mono text-sm">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-[#d4af37]/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 sm:px-12 lg:px-20 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs tracking-[0.3em] text-[#d4af37] font-bebas block mb-4">FONCTIONNALITES</span>
            <h2 className="font-cinzel text-4xl sm:text-5xl">Tout ce dont vous avez besoin</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-8 bg-[#111111] border border-[#1a1a1a] hover:border-[#d4af37]/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-[#d4af37]" />
                </div>
                <h3 className="font-cinzel text-lg text-[#f5f5f5] mb-3">{feature.title}</h3>
                <p className="text-[#8a8a8a] text-sm leading-relaxed font-ibm-plex-mono">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-xs tracking-[0.3em] text-[#d4af37] font-bebas block mb-4">COMPATIBILITE</span>
            <h2 className="font-cinzel text-4xl sm:text-5xl">Formats supportes</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FORMATS.map((format, i) => (
              <motion.div
                key={format.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-[#111111] border border-[#1a1a1a] hover:border-[#d4af37]/20 transition-colors group"
              >
                <format.icon className="w-10 h-10 text-[#d4af37]/60 mb-4 group-hover:text-[#d4af37] transition-colors" />
                <h4 className="font-cinzel text-lg text-[#f5f5f5] mb-1">{format.label}</h4>
                <p className="text-[#8a8a8a] text-xs font-ibm-plex-mono mb-4">{format.formats}</p>
                <div className="flex flex-wrap gap-2">
                  {format.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 text-xs bg-[#d4af37]/10 text-[#d4af37] font-bebas tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 sm:px-12 lg:px-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/5 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h2 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl mb-6">
            Pret a explorer<br />vos fichiers ?
          </h2>
          <p className="text-[#8a8a8a] text-lg mb-10 font-ibm-plex-mono">
            Gratuit. Aucune carte de credit. Commencez en 30 secondes.
          </p>
          <Link to="/signup">
            <motion.button 
              className="group flex items-center gap-3 px-10 py-5 bg-[#d4af37] text-[#0a0a0a] font-bebas text-lg tracking-[0.15em] rounded-full mx-auto"
              whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(212, 175, 55, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              CREER UN COMPTE GRATUIT
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 lg:px-20 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
              <Layers className="w-3 h-3 text-[#d4af37]" />
            </div>
            <span className="font-cinzel text-sm tracking-[0.15em] text-[#d4af37]">METACRAFT</span>
          </div>
          <p className="text-[#8a8a8a] text-sm font-ibm-plex-mono">
            {new Date().getFullYear()} MetaCraft — Excavation numerique
          </p>
        </div>
      </footer>
    </div>
  );
}
