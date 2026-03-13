import { useCallback, useState } from 'react';
import { FileImage, FileAudio, FileText, Film, CheckCircle2, XCircle, Upload } from 'lucide-react';
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
      case 'dragover': return '1px solid #c9a84c';
      case 'invalid': return '1px solid #f43f5e';
      case 'success': return '1px solid #22c55e';
      case 'loading': return '1px solid #c9a84c';
      case 'hover': return '1px solid rgba(201, 168, 76, 0.3)';
      default: return '1px dashed #1c1c1c';
    }
  };

  const getBackgroundStyle = () => {
    switch (currentState) {
      case 'dragover': return '#0f0f0f';
      case 'invalid': return 'rgba(244, 63, 94, 0.02)';
      case 'success': return 'rgba(34, 197, 94, 0.02)';
      case 'hover': return '#0a0a0a';
      default: return '#0a0a0a';
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
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-8 min-h-[260px]">
          {/* LOADING */}
          {currentState === 'loading' && (
            <>
              <motion.div
                className="w-14 h-14 mb-6 bg-[#c9a84c]/10 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Upload className="w-6 h-6 text-[#c9a84c]" />
              </motion.div>
              <p className="text-sm text-[#f5f5f5] mb-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {fileName}
              </p>
              <p className="text-xs text-[#6b6b6b] mb-6" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {fileSize}
              </p>
              <div className="w-full max-w-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    Extraction...
                  </span>
                  <span className="text-[10px] text-[#c9a84c]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-0.5 bg-[#141414] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#c9a84c]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </>
          )}

          {/* SUCCESS */}
          {currentState === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-14 h-14 mb-6 bg-[#22c55e]/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-6 h-6 text-[#22c55e]" />
              </motion.div>
              <p className="text-lg text-[#f5f5f5] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                {fileName}
              </p>
              <p className="text-xs text-[#22c55e] mb-6" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                Analyse terminee — {fragmentCount} champs
              </p>
              <div className="flex gap-3">
                <button
                  className="px-5 py-2.5 bg-[#c9a84c] text-[#050505] text-xs"
                  style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
                >
                  EXPLORER
                </button>
                <button
                  className="px-5 py-2.5 border border-[#1c1c1c] text-[#f5f5f5] text-xs hover:border-[#262626] transition-colors"
                  style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
                >
                  NOUVEAU
                </button>
              </div>
            </>
          )}

          {/* INVALID */}
          {currentState === 'invalid' && (
            <>
              <motion.div
                animate={{ x: [-3, 3, -3, 3, 0] }}
                transition={{ duration: 0.3 }}
                className="w-14 h-14 mb-6 bg-[#f43f5e]/10 flex items-center justify-center"
              >
                <XCircle className="w-6 h-6 text-[#f43f5e]" />
              </motion.div>
              <p className="text-base text-[#f43f5e] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                Format non reconnu
              </p>
              <p className="text-xs text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                Formats: JPG, PNG, MP3, MP4, PDF
              </p>
            </>
          )}

          {/* IDLE / HOVER / DRAGOVER */}
          {(currentState === 'idle' || currentState === 'hover' || currentState === 'dragover') && (
            <>
              <motion.div
                animate={currentState === 'dragover' ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 mb-6 bg-[#c9a84c]/5 flex items-center justify-center"
              >
                <Upload 
                  className={`${currentState === 'dragover' ? 'w-8 h-8' : 'w-6 h-6'} text-[#c9a84c]/60 transition-all`}
                  style={{ color: currentState === 'dragover' ? '#c9a84c' : undefined }}
                />
              </motion.div>

              {currentState === 'dragover' && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-20 h-20 border border-[#c9a84c]/30"
                      style={{
                        top: '50%',
                        left: '50%',
                        marginLeft: '-40px',
                        marginTop: '-40px',
                      }}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </>
              )}

              <p 
                className={`text-lg mb-2 ${currentState === 'dragover' ? 'text-[#c9a84c]' : 'text-[#f5f5f5]'}`}
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {currentState === 'dragover' ? 'Deposez pour analyser' : 'Deposez votre fichier'}
              </p>
              
              {currentState !== 'dragover' && (
                <>
                  <p className="text-xs text-[#6b6b6b] mb-8" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    ou{' '}
                    <span className="text-[#c9a84c] underline underline-offset-2">cliquez</span>
                    {' '}pour parcourir
                  </p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {[
                      { icon: FileImage, label: 'JPG' },
                      { icon: FileImage, label: 'PNG' },
                      { icon: FileAudio, label: 'MP3' },
                      { icon: Film, label: 'MP4' },
                      { icon: FileText, label: 'PDF' },
                    ].map((format) => (
                      <span
                        key={format.label}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-[#c9a84c]/70 border border-[#c9a84c]/15"
                        style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
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
