import { useState, useCallback } from 'react';
import { NavBar } from '../components/NavBar';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Search, Edit3, Save, Download, Trash2,
  ChevronRight, X, AlertCircle, Loader2, CheckCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { metadataApi } from '../../lib/api';
import { saveFileRecord, deleteFileRecord } from '../../lib/firestore';
import { toast } from 'sonner';

type Stage = 'idle' | 'uploading' | 'ready';

interface FileState {
  file: File;
  firestoreId: string;
  metadata: Record<string, unknown>;
  editedBlob: Blob | null;
}

const EDITABLE = new Set([
  'title', 'author', 'subject', 'creator', 'artist', 'album', 'genre',
  'date', 'copyright', 'comment', 'description', 'imagedescription'
]);

function MetaRow({ label, value, onEdit }: {
  label: string;
  value: unknown;
  onEdit: (key: string, val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ''));
  const editable = EDITABLE.has(label.toLowerCase().split('.').pop() ?? '');
  const display = typeof value === 'object' && value !== null
    ? JSON.stringify(value)
    : String(value ?? '—');

  return (
    <div className="flex items-start gap-3 py-4 px-5 group border-b border-[#141414] hover:bg-[#0a0a0a] transition-colors">
      <ChevronRight className="w-3 h-3 mt-1.5 flex-shrink-0 text-[#c9a84c]/30" />
      <div className="flex-1 min-w-0">
        <p 
          className="text-[10px] mb-1.5 text-[#c9a84c]"
          style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
        >
          {label}
        </p>
        {editing ? (
          <div className="flex gap-2">
            <input 
              autoFocus 
              value={draft} 
              onChange={e => setDraft(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-[#050505] border border-[#c9a84c]/30 text-[#f5f5f5] focus:outline-none"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            />
            <button 
              onClick={() => { onEdit(label, draft); setEditing(false); }}
              className="px-4 py-2 text-xs bg-[#c9a84c] text-[#050505]"
              style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
            >
              OK
            </button>
            <button onClick={() => setEditing(false)} className="px-2">
              <X className="w-4 h-4 text-[#6b6b6b] hover:text-[#f5f5f5]" />
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <p 
              className="text-sm break-all flex-1 text-[#d4d4d4]"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            >
              {display}
            </p>
            {editable && typeof value !== 'object' && (
              <button 
                onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1.5 hover:bg-[#c9a84c]/10"
              >
                <Edit3 className="w-3 h-3 text-[#c9a84c]" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AppPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  }, [user]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
    e.target.value = '';
  }, [user]);

  async function processFile(file: File) {
    if (!user) return;
    setError('');
    setEdits({});
    setFileState(null);
    setStage('uploading');

    let p = 0;
    const ticker = setInterval(() => { p = Math.min(p + 10, 90); setProgress(p); }, 120);

    try {
      const metadata = await metadataApi.extract(file);
      clearInterval(ticker);
      setProgress(100);

      const firestoreId = await saveFileRecord(user.uid, {
        userId: user.uid,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        metadata,
      });

      setFileState({ file, firestoreId, metadata, editedBlob: null });
      setStage('ready');
    } catch (err) {
      clearInterval(ticker);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'extraction');
      setStage('idle');
    }
  }

  function handleEdit(key: string, value: string) {
    setEdits(prev => ({ ...prev, [key]: value }));
    setFileState(prev => prev
      ? { ...prev, metadata: { ...prev.metadata, [key]: value } }
      : prev
    );
  }

  async function handleSave() {
    if (!fileState || !Object.keys(edits).length) return;
    setSaving(true);
    try {
      const { metadata, blob } = await metadataApi.edit(fileState.file, edits);
      setFileState(prev => prev ? { ...prev, metadata, editedBlob: blob } : prev);
      setEdits({});
      toast.success('Metadonnees sauvegardees');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    if (!fileState) return;
    const blob = fileState.editedBlob ?? fileState.file;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileState.file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete() {
    if (!fileState || !confirm('Supprimer cet enregistrement ?')) return;
    await deleteFileRecord(fileState.firestoreId);
    reset();
    toast.success('Enregistrement supprime');
  }

  function reset() {
    setFileState(null);
    setEdits({});
    setStage('idle');
    setProgress(0);
    setError('');
  }

  const flatEntries: [string, unknown][] = fileState
    ? Object.entries(fileState.metadata).flatMap(function flat([k, v]): [string, unknown][] {
        if (typeof v === 'object' && v !== null && !Array.isArray(v))
          return Object.entries(v as Record<string, unknown>).flatMap(([sk, sv]) => flat([`${k}.${sk}`, sv]));
        return [[k, v]];
      })
    : [];

  return (
    <div className="min-h-screen bg-[#050505]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 mb-8 bg-[#f43f5e]/5 border border-[#f43f5e]/20"
            >
              <AlertCircle className="w-4 h-4 text-[#f43f5e]" />
              <p className="text-sm text-[#f43f5e]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{error}</p>
              <button onClick={() => setError('')} className="ml-auto">
                <X className="w-4 h-4 text-[#f43f5e]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IDLE */}
        {stage === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl text-[#f5f5f5] mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                Analysez vos fichiers
              </h1>
              <p className="text-sm text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                Glissez un fichier ou cliquez pour le selectionner
              </p>
            </div>

            <label 
              onDrop={handleDrop} 
              onDragOver={e => e.preventDefault()}
              className="flex flex-col items-center justify-center gap-6 mx-auto cursor-pointer transition-all duration-300 hover:border-[#c9a84c]/30 group"
              style={{ 
                maxWidth: 560, 
                height: 280, 
                border: '1px dashed #1c1c1c', 
                backgroundColor: '#0a0a0a' 
              }}
            >
              <div className="w-16 h-16 bg-[#c9a84c]/5 flex items-center justify-center group-hover:bg-[#c9a84c]/10 transition-colors">
                <Upload className="w-6 h-6 text-[#c9a84c]/50 group-hover:text-[#c9a84c] transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-lg text-[#f5f5f5] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  Deposez votre fichier
                </p>
                <p className="text-xs text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  JPEG, PNG, MP3, PDF, MP4...
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileInput}
                accept="image/*,audio/*,video/*,application/pdf" 
              />
            </label>
          </motion.div>
        )}

        {/* UPLOADING */}
        {stage === 'uploading' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-8"
          >
            <div className="w-24 h-24 relative">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="none" stroke="#141414" strokeWidth="3" />
                <motion.circle 
                  cx="48" cy="48" r="42" fill="none" stroke="#c9a84c" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  transition={{ duration: 0.3 }} 
                />
              </svg>
              <Search className="absolute inset-0 m-auto w-7 h-7 text-[#c9a84c]" />
            </div>
            <div className="text-center">
              <p 
                className="text-xs text-[#c9a84c] mb-3"
                style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.2em' }}
              >
                EXTRACTION EN COURS
              </p>
              <p className="text-3xl text-[#f5f5f5]" style={{ fontFamily: 'Cinzel, serif' }}>
                {progress}%
              </p>
            </div>
          </motion.div>
        )}

        {/* READY */}
        {stage === 'ready' && fileState && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <h2 className="text-xl text-[#f5f5f5] mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                  {fileState.file.name}
                </h2>
                <p className="text-xs text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  {flatEntries.length} champs &middot; {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                  {fileState.editedBlob && <span className="text-[#22c55e]"> &middot; Modifie</span>}
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <motion.button 
                  onClick={reset} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 flex items-center gap-2 text-xs border border-[#1c1c1c] text-[#6b6b6b] hover:text-[#f5f5f5] hover:border-[#262626] transition-colors"
                  style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> NOUVEAU
                </motion.button>
                
                <motion.button 
                  onClick={handleDownload} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 flex items-center gap-2 text-xs border border-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/5 transition-colors"
                  style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
                >
                  <Download className="w-3.5 h-3.5" />
                  {fileState.editedBlob ? 'TELECHARGER MODIFIE' : 'TELECHARGER'}
                </motion.button>
                
                {Object.keys(edits).length > 0 && (
                  <motion.button 
                    onClick={handleSave} 
                    disabled={saving}
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2.5 flex items-center gap-2 text-xs bg-[#c9a84c] text-[#050505] disabled:opacity-50"
                    style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {saving ? 'SAUVEGARDE...' : `APPLIQUER (${Object.keys(edits).length})`}
                  </motion.button>
                )}
                
                <motion.button 
                  onClick={handleDelete} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 flex items-center gap-2 text-xs border border-[#f43f5e]/20 text-[#f43f5e] hover:bg-[#f43f5e]/5 transition-colors"
                  style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Metadata */}
              <div className="xl:col-span-3 bg-[#0a0a0a] border border-[#141414]">
                <div className="px-5 py-4 border-b border-[#141414]">
                  <h3 className="text-base text-[#f5f5f5]" style={{ fontFamily: 'Cinzel, serif' }}>
                    Metadonnees
                  </h3>
                </div>
                <div className="max-h-[550px] overflow-y-auto">
                  {flatEntries.map(([key, value]) => (
                    <MetaRow key={key} label={key} value={value} onEdit={handleEdit} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-[#0a0a0a] border border-[#141414] p-6">
                  <h3 className="text-sm text-[#f5f5f5] mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                    Resume
                  </h3>
                  {[
                    { label: 'Champs', value: flatEntries.length },
                    { label: 'Editables', value: flatEntries.filter(([k]) => EDITABLE.has(k.toLowerCase().split('.').pop() ?? '')).length },
                    { label: 'Modifies', value: Object.keys(edits).length },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between py-3 border-b border-[#141414] last:border-0">
                      <span className="text-xs text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                        {s.label}
                      </span>
                      <span className="text-lg text-[#c9a84c]" style={{ fontFamily: 'Cinzel, serif' }}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Ready */}
                {fileState.editedBlob && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="bg-[#22c55e]/5 border border-[#22c55e]/15 p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                      <p 
                        className="text-xs text-[#22c55e]"
                        style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
                      >
                        FICHIER PRET
                      </p>
                    </div>
                    <p className="text-[10px] text-[#6b6b6b] leading-relaxed" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                      Cliquez sur Telecharger pour obtenir le fichier avec les nouvelles metadonnees.
                    </p>
                  </motion.div>
                )}

                {/* Pending */}
                {Object.keys(edits).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="bg-[#c9a84c]/5 border border-[#c9a84c]/15 p-5"
                  >
                    <p 
                      className="text-xs text-[#c9a84c] mb-3"
                      style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
                    >
                      EN ATTENTE
                    </p>
                    <div className="space-y-2">
                      {Object.entries(edits).map(([k, v]) => (
                        <p key={k} className="text-[10px] text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                          <span className="text-[#c9a84c]">{k}</span>: {v}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
