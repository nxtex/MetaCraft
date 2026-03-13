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
  'title','author','subject','creator','artist','album','genre',
  'date','copyright','comment','description','imagedescription'
]);

function MetaRow({ label, value, onEdit }: {
  label: string;
  value: unknown;
  onEdit: (key: string, val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(String(value ?? ''));
  const editable = EDITABLE.has(label.toLowerCase().split('.').pop() ?? '');
  const display  = typeof value === 'object' && value !== null
    ? JSON.stringify(value)
    : String(value ?? '—');

  return (
    <motion.div 
      className="flex items-start gap-3 py-4 px-5 group border-b border-[#1a1a1a] hover:bg-[#111111]/50 transition-colors"
      initial={false}
    >
      <ChevronRight className="w-3 h-3 mt-1.5 flex-shrink-0 text-[#d4af37]/40" />
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-1.5 font-bebas tracking-[0.15em] text-[#d4af37]">{label}</p>
        {editing ? (
          <div className="flex gap-2">
            <input 
              autoFocus 
              value={draft} 
              onChange={e => setDraft(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-[#0a0a0a] border border-[#d4af37]/50 text-[#f5f5f5] font-ibm-plex-mono focus:outline-none"
            />
            <button 
              onClick={() => { onEdit(label, draft); setEditing(false); }}
              className="px-4 py-2 text-xs bg-[#d4af37] text-[#0a0a0a] font-bebas tracking-wider"
            >
              OK
            </button>
            <button onClick={() => setEditing(false)}>
              <X className="w-4 h-4 text-[#8a8a8a] hover:text-[#f5f5f5]" />
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <p className="text-sm break-all flex-1 text-[#f5f5f5] font-ibm-plex-mono">{display}</p>
            {editable && typeof value !== 'object' && (
              <button 
                onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1 hover:bg-[#d4af37]/10 rounded"
              >
                <Edit3 className="w-3 h-3 text-[#d4af37]" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AppPage() {
  const { user } = useAuth();
  const [stage, setStage]         = useState<Stage>('idle');
  const [progress, setProgress]   = useState(0);
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [edits, setEdits]         = useState<Record<string, string>>({});
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

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
    const ticker = setInterval(() => { p = Math.min(p + 12, 88); setProgress(p); }, 150);

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
      toast.success('Metadonnees sauvegardees — fichier pret au telechargement');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    if (!fileState) return;
    const blob = fileState.editedBlob ?? fileState.file;
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 mb-8 bg-[#dc2626]/10 border border-[#dc2626]/30"
            >
              <AlertCircle className="w-4 h-4 text-[#dc2626]" />
              <p className="text-sm text-[#dc2626] font-ibm-plex-mono">{error}</p>
              <button onClick={() => setError('')} className="ml-auto">
                <X className="w-4 h-4 text-[#dc2626]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IDLE STATE */}
        {stage === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-12">
              <h1 className="font-cinzel text-4xl sm:text-5xl text-[#f5f5f5] mb-4">
                Analysez vos fichiers
              </h1>
              <p className="text-[#8a8a8a] font-ibm-plex-mono">
                Glissez un fichier ou cliquez pour le selectionner
              </p>
            </div>

            <label 
              onDrop={handleDrop} 
              onDragOver={e => e.preventDefault()}
              className="flex flex-col items-center justify-center gap-6 mx-auto cursor-pointer transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-[#111111]/50 group"
              style={{ maxWidth: 640, height: 320, border: '2px dashed #2a2a2a', backgroundColor: '#0d0d0d' }}
            >
              <div className="w-20 h-20 rounded-full bg-[#d4af37]/10 flex items-center justify-center group-hover:bg-[#d4af37]/20 transition-colors">
                <Upload className="w-8 h-8 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors" />
              </div>
              <div className="text-center">
                <p className="font-cinzel text-xl text-[#f5f5f5] mb-2">Deposez votre fichier ici</p>
                <p className="text-sm text-[#8a8a8a] font-ibm-plex-mono">JPEG, PNG, MP3, PDF, MP4...</p>
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

        {/* UPLOADING STATE */}
        {stage === 'uploading' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-8"
          >
            <div className="w-24 h-24 relative">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="none" stroke="#1a1a1a" strokeWidth="4" />
                <motion.circle 
                  cx="48" cy="48" r="42" fill="none" stroke="#d4af37" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  transition={{ duration: 0.3 }} 
                />
              </svg>
              <Search className="absolute inset-0 m-auto w-8 h-8 text-[#d4af37]" />
            </div>
            <div className="text-center">
              <p className="font-bebas tracking-[0.2em] text-[#d4af37] text-lg mb-2">
                EXTRACTION DES METADONNEES
              </p>
              <p className="text-3xl font-cinzel text-[#f5f5f5]">{progress}%</p>
            </div>
          </motion.div>
        )}

        {/* READY STATE */}
        {stage === 'ready' && fileState && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <h2 className="font-cinzel text-2xl text-[#f5f5f5] mb-1">{fileState.file.name}</h2>
                <p className="text-sm text-[#8a8a8a] font-ibm-plex-mono">
                  {flatEntries.length} champs • {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                  {fileState.editedBlob && <span className="text-[#10b981]"> • Modifie</span>}
                </p>
              </div>
              
              <div className="flex gap-3 flex-wrap">
                <motion.button 
                  onClick={reset} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 flex items-center gap-2 text-sm border border-[#2a2a2a] text-[#8a8a8a] hover:text-[#f5f5f5] hover:border-[#3a3a3a] font-bebas tracking-[0.1em] transition-colors rounded-full"
                >
                  <RefreshCw className="w-4 h-4" /> NOUVEAU
                </motion.button>
                
                <motion.button 
                  onClick={handleDownload} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 flex items-center gap-2 text-sm border border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/10 font-bebas tracking-[0.1em] transition-colors rounded-full"
                >
                  <Download className="w-4 h-4" />
                  {fileState.editedBlob ? 'TEL. MODIFIE' : 'TELECHARGER'}
                </motion.button>
                
                {Object.keys(edits).length > 0 && (
                  <motion.button 
                    onClick={handleSave} 
                    disabled={saving}
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 flex items-center gap-2 text-sm bg-[#d4af37] text-[#0a0a0a] font-bebas tracking-[0.1em] rounded-full disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'TRAITEMENT...' : `APPLIQUER (${Object.keys(edits).length})`}
                  </motion.button>
                )}
                
                <motion.button 
                  onClick={handleDelete} 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 flex items-center gap-2 text-sm border border-[#dc2626]/30 text-[#dc2626] hover:bg-[#dc2626]/10 font-bebas tracking-[0.1em] transition-colors rounded-full"
                >
                  <Trash2 className="w-4 h-4" /> SUPPRIMER
                </motion.button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Metadata Panel */}
              <div className="xl:col-span-3 bg-[#0d0d0d] border border-[#1a1a1a]">
                <div className="px-5 py-4 border-b border-[#1a1a1a]">
                  <h3 className="font-cinzel text-lg text-[#f5f5f5]">Metadonnees</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {flatEntries.map(([key, value]) => (
                    <MetaRow key={key} label={key} value={value} onEdit={handleEdit} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-6">
                  <h3 className="font-cinzel text-[#f5f5f5] mb-6">Resume</h3>
                  {[
                    { label: 'Champs',    value: flatEntries.length },
                    { label: 'Editables', value: flatEntries.filter(([k]) => EDITABLE.has(k.toLowerCase().split('.').pop() ?? '')).length },
                    { label: 'Modifies',  value: Object.keys(edits).length },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between py-3 border-b border-[#1a1a1a] last:border-0">
                      <span className="text-sm text-[#8a8a8a] font-ibm-plex-mono">{s.label}</span>
                      <span className="font-cinzel text-2xl text-[#d4af37]">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Modified File Ready */}
                {fileState.editedBlob && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="bg-[#10b981]/5 border border-[#10b981]/20 p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-[#10b981]" />
                      <p className="font-bebas tracking-[0.15em] text-[#10b981] text-sm">FICHIER PRET</p>
                    </div>
                    <p className="text-xs text-[#8a8a8a] font-ibm-plex-mono leading-relaxed">
                      Cliquez TEL. MODIFIE pour telecharger le fichier avec les nouvelles metadonnees
                    </p>
                  </motion.div>
                )}

                {/* Pending Edits */}
                {Object.keys(edits).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="bg-[#d4af37]/5 border border-[#d4af37]/20 p-5"
                  >
                    <p className="font-bebas tracking-[0.15em] text-[#d4af37] text-sm mb-3">EN ATTENTE</p>
                    <div className="space-y-2">
                      {Object.entries(edits).map(([k, v]) => (
                        <p key={k} className="text-xs text-[#8a8a8a] font-ibm-plex-mono">
                          <span className="text-[#d4af37]">{k}</span>: {v}
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
