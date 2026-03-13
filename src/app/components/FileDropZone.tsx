import { useCallback, useState } from 'react';
import { Layers, FileImage, FileAudio, FileText, Film, CheckCircle2, XCircle, Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface FileDropZoneProps {
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
  state?: 'idle' | 'hover' | 'dragover' | 'invalid' | 'loading' | 'success';
  progress?: number;
  fileName?: string;
  fileSize?: string;
  fragmentCount?: number;
}

export function FileDropZone({
  onFileSelect,
  multiple = false,
  state = 'idle',
  progress = 0,
  fileName,
  fileSize,
  fragmentCount,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const acceptedFormats = ['image/jpeg', 'image/png', 'audio/mpeg', 'video/mp4', 'application/pdf'];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const items = Array.from(e.dataTransfer.items);
    const hasValidFile = items.some((item) => {
      return item.kind === 'file' && acceptedFormats.some(format => item.type === format);
    });

    if (hasValidFile) {
      setIsDragging(true);
      setIsInvalid(false);
    } else {
      setIsDragging(false);
      setIsInvalid(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsInvalid(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsInvalid(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => acceptedFormats.includes(file.type));

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileSelect(files);
    }
  }, [onFileSelect]);

  const currentState = state !== 'idle' ? state : (isDragging ? 'dragover' : (isInvalid ? 'invalid' : 'idle'));

  const getBorderStyle = () => {
    switch (currentState) {
      case 'dragover': return '2px solid #d4af37';
      case 'invalid': return '2px solid #dc2626';
      case 'success': return '2px solid #10b981';
      case 'loading': return '2px solid #d4af37';
      case 'hover': return '2px solid rgba(212, 175, 55, 0.5)';
      default: return '2px dashed #2a2a2a';
    }
  };

  const getBackgroundStyle = () => {
    switch (currentState) {
      case 'dragover': return '#111111';
      case 'invalid': return 'rgba(220, 38, 38, 0.05)';
      case 'success': return 'rgba(16, 185, 129, 0.05)';
      case 'hover': return '#111111';
      default: return '#0d0d0d';
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple={multiple}
        accept=".jpg,.jpeg,.png,.mp3,.mp4,.pdf"
        onChange={handleFileInput}
      />
      
      <label
        htmlFor="file-upload"
        className="block cursor-pointer transition-all duration-300"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          backgroundColor: getBackgroundStyle(),
          border: getBorderStyle(),
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-8 min-h-[280px]">
          {/* LOADING STATE */}
          {currentState === 'loading' && (
            <>
              <motion.div
                className="w-16 h-16 mb-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Layers className="w-8 h-8 text-[#d4af37]" />
              </motion.div>
              <p className="font-ibm-plex-mono text-[#f5f5f5] mb-1">
                {fileName}
              </p>
              <p className="text-sm font-ibm-plex-mono text-[#8a8a8a] mb-6">
                {fileSize}
              </p>
              <div className="w-full max-w-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-ibm-plex-mono text-[#8a8a8a]">
                    Extraction en cours...
                  </span>
                  <span className="text-xs font-ibm-plex-mono text-[#d4af37]">
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-1 bg-[#1a1a1a] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#d4af37]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </>
          )}

          {/* SUCCESS STATE */}
          {currentState === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mb-6 rounded-full bg-[#10b981]/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-8 h-8 text-[#10b981]" />
              </motion.div>
              <p className="font-cinzel text-xl text-[#f5f5f5] mb-2">
                {fileName}
              </p>
              <p className="text-sm font-ibm-plex-mono text-[#10b981] mb-6">
                Analyse terminee — {fragmentCount} champs extraits
              </p>
              <div className="flex gap-4">
                <button
                  className="px-6 py-3 bg-[#d4af37] text-[#0a0a0a] font-bebas tracking-[0.15em] rounded-full hover:scale-[1.02] transition-transform"
                >
                  EXPLORER
                </button>
                <button
                  className="px-6 py-3 border border-[#2a2a2a] text-[#f5f5f5] font-bebas tracking-[0.15em] rounded-full hover:border-[#3a3a3a] transition-colors"
                >
                  NOUVEAU FICHIER
                </button>
              </div>
            </>
          )}

          {/* INVALID STATE */}
          {currentState === 'invalid' && (
            <>
              <motion.div
                animate={{ x: [-3, 3, -3, 3, 0] }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 mb-6 rounded-full bg-[#dc2626]/10 flex items-center justify-center"
              >
                <XCircle className="w-8 h-8 text-[#dc2626]" />
              </motion.div>
              <p className="font-cinzel text-lg text-[#dc2626] mb-2">
                Format non reconnu
              </p>
              <p className="text-sm font-ibm-plex-mono text-[#8a8a8a]">
                Formats acceptes: JPG, PNG, MP3, MP4, PDF
              </p>
            </>
          )}

          {/* IDLE / HOVER / DRAGOVER STATE */}
          {(currentState === 'idle' || currentState === 'hover' || currentState === 'dragover') && (
            <>
              <motion.div
                animate={currentState === 'dragover' ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-20 h-20 mb-6 rounded-full bg-[#d4af37]/10 flex items-center justify-center"
              >
                <Upload 
                  className={`${currentState === 'dragover' ? 'w-10 h-10' : 'w-8 h-8'} text-[#d4af37] transition-all`}
                />
              </motion.div>

              {currentState === 'dragover' && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-24 h-24 rounded-full border border-[#d4af37]"
                      style={{
                        top: '50%',
                        left: '50%',
                        marginLeft: '-48px',
                        marginTop: '-48px',
                      }}
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </>
              )}

              <p className={`font-cinzel text-xl mb-2 ${currentState === 'dragover' ? 'text-[#d4af37]' : 'text-[#f5f5f5]'}`}>
                {currentState === 'dragover'
                  ? 'Deposez pour analyser'
                  : 'Deposez votre fichier ici'}
              </p>
              
              {currentState !== 'dragover' && (
                <>
                  <p className="text-sm font-ibm-plex-mono text-[#8a8a8a] mb-8">
                    ou{' '}
                    <span className="text-[#d4af37] underline underline-offset-2">cliquez</span>{' '}
                    pour parcourir
                  </p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {[
                      { icon: FileImage, label: 'JPEG' },
                      { icon: FileImage, label: 'PNG' },
                      { icon: FileAudio, label: 'MP3' },
                      { icon: Film, label: 'MP4' },
                      { icon: FileText, label: 'PDF' },
                    ].map((format) => (
                      <span
                        key={format.label}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bebas tracking-wider text-[#d4af37] border border-[#d4af37]/30 rounded-full"
                      >
                        <format.icon className="w-3 h-3" />
                        {format.label}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </label>
    </div>
  );
}
