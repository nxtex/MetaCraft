import { useCallback, useState } from 'react';
import { Brush, FileImage, FileAudio, FileText, Film, CheckCircle2, XCircle } from 'lucide-react';
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
          backgroundColor: currentState === 'dragover' ? 'rgba(201, 168, 76, 0.07)' :
                          currentState === 'invalid' ? 'rgba(192, 57, 43, 0.06)' :
                          currentState === 'success' ? 'rgba(42, 252, 152, 0.04)' :
                          currentState === 'hover' ? 'rgba(201, 168, 76, 0.03)' :
                          '#0E1219',
          border: currentState === 'dragover' ? '2px solid #C9A84C' :
                  currentState === 'invalid' ? '2px solid #C0392B' :
                  currentState === 'success' ? '2px solid #2AFC98' :
                  currentState === 'loading' ? '2px solid #C9A84C' :
                  currentState === 'hover' ? '2px solid #C9A84C' :
                  '2px dashed rgba(201, 168, 76, 0.35)',
          clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          boxShadow: currentState === 'dragover' ? '0 0 32px rgba(201, 168, 76, 0.25)' :
                     currentState === 'invalid' ? '0 0 24px rgba(192, 57, 43, 0.2)' :
                     currentState === 'success' ? '0 0 20px rgba(42, 252, 152, 0.15)' :
                     currentState === 'hover' ? '0 0 0 4px rgba(201, 168, 76, 0.12)' :
                     'none',
        }}
      >
        {/* Grid overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            opacity: currentState === 'dragover' ? 0.12 : 
                    currentState === 'invalid' ? 0.08 : 0.06,
            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          }}
        >
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={currentState === 'invalid' ? '#C0392B' : '#C9A84C'}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center py-12 px-8 min-h-[220px]">
          {currentState === 'loading' && (
            <>
              <motion.div
                className="w-12 h-12 mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Brush className="w-12 h-12" style={{ color: '#C9A84C' }} />
              </motion.div>
              <p
                className="text-base mb-2"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#EDE8DC' }}
              >
                {fileName}
              </p>
              <p
                className="text-sm mb-4"
                style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
              >
                {fileSize}
              </p>
              <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className="text-xs"
                    style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                  >
                    Excavation en cours...
                  </span>
                  <span
                    className="text-xs"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#C9A84C' }}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  className="w-full h-[3px] overflow-hidden"
                  style={{ backgroundColor: 'rgba(201, 168, 76, 0.15)' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #C9A84C, #E8732A)',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {currentState === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle2 className="w-12 h-12 mb-4" style={{ color: '#2AFC98' }} />
              </motion.div>
              <p
                className="text-lg mb-2"
                style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC', fontWeight: 600 }}
              >
                {fileName}
              </p>
              <p
                className="text-sm mb-6"
                style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#2AFC98' }}
              >
                Artefact analysé — {fragmentCount} fragments identifiés
              </p>
              <div className="flex gap-4">
                <button
                  className="px-6 py-2 transition-all hover:brightness-110 active:scale-95"
                  style={{
                    backgroundColor: '#C9A84C',
                    color: '#080A0F',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '3px',
                  }}
                >
                  Explorer les métadonnées
                </button>
                <button
                  className="px-6 py-2 transition-all hover:border-opacity-100"
                  style={{
                    border: '1.5px dashed rgba(201, 168, 76, 0.5)',
                    color: '#EDE8DC',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '3px',
                    backgroundColor: 'transparent',
                  }}
                >
                  Déposer un autre fichier
                </button>
              </div>
            </>
          )}

          {currentState === 'invalid' && (
            <>
              <motion.div
                animate={{ x: [-4, 4, -4, 4, 0] }}
                transition={{ duration: 0.3 }}
              >
                <XCircle className="w-12 h-12 mb-4" style={{ color: '#C0392B' }} />
              </motion.div>
              <p
                className="text-lg mb-2"
                style={{ fontFamily: 'Cinzel, serif', color: '#C0392B' }}
              >
                Format non reconnu
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
              >
                Formats acceptés: JPG, PNG, MP3, MP4, PDF
              </p>
            </>
          )}

          {(currentState === 'idle' || currentState === 'hover' || currentState === 'dragover') && currentState !== 'loading' && currentState !== 'success' && (
            <>
              <motion.div
                animate={currentState === 'dragover' ? { scale: 1.25 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Brush
                  className={currentState === 'dragover' ? 'w-[60px] h-[60px] mb-4' : 'w-12 h-12 mb-4'}
                  style={{ color: '#C9A84C' }}
                />
              </motion.div>

              {currentState === 'dragover' && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-24 h-24 rounded-full border-2"
                      style={{
                        borderColor: '#C9A84C',
                        top: '50%',
                        left: '50%',
                        marginLeft: '-48px',
                        marginTop: '-48px',
                      }}
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                      }}
                    />
                  ))}
                </>
              )}

              <p
                className="text-lg mb-2"
                style={{
                  fontFamily: 'Cinzel, serif',
                  color: currentState === 'dragover' ? '#C9A84C' : '#EDE8DC',
                }}
              >
                {currentState === 'dragover'
                  ? 'Libérez pour déposer l\'artefact'
                  : 'Déposez votre artefact numérique'}
              </p>
              {currentState !== 'dragover' && (
                <p
                  className="text-sm mb-6"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                >
                  ou{' '}
                  <span className="underline" style={{ color: '#C9A84C' }}>
                    cliquez
                  </span>{' '}
                  pour parcourir vos fichiers
                </p>
              )}
              {currentState !== 'dragover' && (
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
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                      style={{
                        border: '1px solid #C9A84C',
                        color: '#C9A84C',
                        fontFamily: 'Bebas Neue, cursive',
                        letterSpacing: '1px',
                      }}
                    >
                      <format.icon className="w-3 h-3" />
                      {format.label}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </label>
    </div>
  );
}
