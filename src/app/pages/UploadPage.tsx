import { useState } from 'react';
import { useNavigate } from 'react-router';
import { NavBar } from '../components/NavBar';
import { FileDropZone } from '../components/FileDropZone';
import { motion } from 'motion/react';
import { FileImage, Music, FileText, AlertCircle, Film, X } from 'lucide-react';
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
    { icon: FileImage, title: 'Images', color: '#c9a84c', desc: 'EXIF, GPS, IPTC' },
    { icon: Music, title: 'Audio', color: '#22c55e', desc: 'ID3, Artiste, Album' },
    { icon: FileText, title: 'Documents', color: '#f59e0b', desc: 'Auteur, Titre, XMP' },
    { icon: Film, title: 'Video', color: '#8b5cf6', desc: 'Duree, Codec, GPS' },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      <NavBar />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p 
            className="text-[10px] tracking-[0.4em] text-[#c9a84c] mb-6"
            style={{ fontFamily: 'Bebas Neue, cursive' }}
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            EXCAVATION NUMERIQUE
          </motion.p>
          
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl text-[#f5f5f5] mb-6"
            style={{ fontFamily: 'Cinzel, serif' }}
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Revelez les couches
            <br />cachees de vos fichiers
          </motion.h1>
          
          <motion.p 
            className="max-w-lg mx-auto text-sm text-[#6b6b6b] leading-relaxed"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Chargez n'importe quel fichier et inspectez ou modifiez instantanement ses metadonnees.
          </motion.p>
        </div>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 mb-8 max-w-xl mx-auto bg-[#f43f5e]/5 border border-[#f43f5e]/20"
          >
            <AlertCircle className="w-4 h-4 text-[#f43f5e]" />
            <p className="text-xs text-[#f43f5e]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {error}
            </p>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4 text-[#f43f5e]" />
            </button>
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

        {/* File Types */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {fileTypes.map((item, index) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.7 + index * 0.08 }}
              className="p-5 bg-[#0a0a0a] border border-[#141414] hover:border-[#1c1c1c] transition-colors group"
            >
              <item.icon 
                className="w-6 h-6 mb-3 opacity-50 group-hover:opacity-100 transition-opacity" 
                style={{ color: item.color }} 
              />
              <p 
                className="text-xs mb-1"
                style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em', color: item.color }}
              >
                {item.title}
              </p>
              <p className="text-[10px] text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
