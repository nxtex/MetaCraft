import { useState } from 'react';
import { useNavigate } from 'react-router';
import { NavBar } from '../components/NavBar';
import { FileDropZone } from '../components/FileDropZone';
import { motion } from 'motion/react';
import { FileImage, Music, FileText, AlertCircle, Film } from 'lucide-react';
import { files as filesApi, APIError } from '../lib/api';

export function UploadPage() {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = async (fileList: File[]) => {
    if (!fileList.length) return;
    const file = fileList[0];
    setSelectedFile(file);
    setUploadState('loading');
    setError('');

    let p = 0;
    const ticker = setInterval(() => {
      p = Math.min(p + 8, 85);
      setProgress(p);
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await filesApi.upload(formData);
      clearInterval(ticker);
      setProgress(100);
      setUploadState('success');
      setTimeout(() => navigate(`/metadata/${result.file_id}`), 1200);
    } catch (err) {
      clearInterval(ticker);
      setUploadState('idle');
      setProgress(0);
      setError(err instanceof APIError ? err.message : 'Erreur lors de l\'upload');
    }
  };

  const fileTypes = [
    { icon: FileImage, title: 'Images', color: '#d4af37', desc: 'EXIF, GPS, IPTC' },
    { icon: Music, title: 'Audio', color: '#10b981', desc: 'ID3, Artiste, Album' },
    { icon: FileText, title: 'Documents', color: '#f97316', desc: 'Auteur, Titre, XMP' },
    { icon: Film, title: 'Video', color: '#8b5cf6', desc: 'Duree, Codec, GPS' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <NavBar />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
            className="inline-block px-4 py-2 text-xs tracking-[0.3em] text-[#d4af37] border border-[#d4af37]/20 rounded-full font-bebas mb-6"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            EXCAVATION NUMERIQUE
          </motion.span>
          
          <motion.h1 
            className="font-cinzel text-4xl sm:text-5xl lg:text-6xl text-[#f5f5f5] mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Revelez les couches<br />cachees de vos fichiers
          </motion.h1>
          
          <motion.p 
            className="max-w-xl mx-auto text-[#8a8a8a] font-ibm-plex-mono leading-relaxed"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Chargez n'importe quel fichier — image, audio, PDF, video — et inspectez ou modifiez instantanement ses metadonnees.
          </motion.p>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 mb-8 max-w-xl mx-auto bg-[#dc2626]/10 border border-[#dc2626]/30"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#dc2626]" />
            <p className="text-sm text-[#dc2626] font-ibm-plex-mono">{error}</p>
          </motion.div>
        )}

        {/* Drop Zone */}
        <motion.div 
          className="w-full max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.4 }}
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

        {/* File Types Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {fileTypes.map((item, index) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-5 bg-[#111111] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors group"
            >
              <item.icon 
                className="w-8 h-8 mb-3 opacity-60 group-hover:opacity-100 transition-opacity" 
                style={{ color: item.color }} 
              />
              <h3 className="font-bebas tracking-[0.1em] text-sm mb-1" style={{ color: item.color }}>
                {item.title}
              </h3>
              <p className="text-xs text-[#8a8a8a] font-ibm-plex-mono">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
