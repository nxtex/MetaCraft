import { useState } from 'react';
import { useNavigate } from 'react-router';
import { NavBar } from '../components/NavBar';
import { FileDropZone } from '../components/FileDropZone';
import { StratumCard } from '../components/StratumCard';
import { GoogleAdSpace } from '../components/GoogleAdSpace';
import { ParallaxGlyphs } from '../components/ParallaxGlyphs';
import { motion } from 'motion/react';
import { FileImage, Music, FileText } from 'lucide-react';

export function UploadPage() {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setUploadState('loading');

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setUploadState('success');
          setTimeout(() => navigate('/metadata/1'), 2000);
        }
      }, 200);
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#080A0F' }}>
      <ParallaxGlyphs />
      <NavBar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 sm:py-16 relative z-10">
        {/* Top ad */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <GoogleAdSpace slot="upload-header" format="horizontal" />
        </div>

        {/* Hero section */}
        <div className="text-center mb-10 sm:mb-16">
          <motion.p
            className="mb-4 px-2"
            style={{
              fontFamily: 'Bebas Neue, cursive',
              letterSpacing: '4px',
              color: '#C9A84C',
              fontSize: '11px',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            METACRAFT — OUTIL D’EXCAVATION NUMÉRIQUE
          </motion.p>
          <motion.h1
            className="mb-6 px-4"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(26px, 6vw, 52px)',
              color: '#EDE8DC',
              lineHeight: 1.2,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Révélez les couches cachées de vos fichiers
          </motion.h1>
          <motion.p
            className="max-w-[560px] mx-auto px-4"
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 'clamp(13px, 2.5vw, 16px)',
              color: '#7A7060',
              lineHeight: 1.6,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Chargez n’importe quel fichier — image, audio, PDF, vidéo — et inspectez ou
            modifiez instantanément ses métadonnées.
          </motion.p>
        </div>

        {/* Drop zone */}
        <motion.div
          className="w-full max-w-[620px] mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FileDropZone
            onFileSelect={handleFileSelect}
            state={uploadState}
            progress={progress}
            fileName={selectedFile?.name}
            fileSize={selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} Mo` : undefined}
            fragmentCount={24}
          />
        </motion.div>

        {/* File type stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-[900px] mx-auto mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: FileImage, title: 'Images JPEG', color: '#C9A84C', desc: 'EXIF, GPS, Appareil' },
            { icon: Music, title: 'Fichiers MP3', color: '#2AFC98', desc: 'ID3, Artiste, Album, BPM' },
            { icon: FileText, title: 'Documents PDF', color: '#E8732A', desc: 'Auteur, Titre, XMP, Pages' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <StratumCard hover className="p-4 sm:p-6">
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon
                    className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0"
                    style={{ color: item.color, opacity: 0.6 }}
                  />
                  <div className="flex-1">
                    <h3
                      className="text-sm mb-1"
                      style={{
                        fontFamily: 'Bebas Neue, cursive',
                        letterSpacing: '2px',
                        color: item.color,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              </StratumCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom ad */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <GoogleAdSpace slot="upload-footer" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
