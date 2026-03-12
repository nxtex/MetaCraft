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
    <motion.div className="flex items-start gap-3 py-3 px-4 group"
      style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}
      whileHover={{ backgroundColor: 'rgba(201,168,76,0.03)' }}>
      <ChevronRight className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: '#C9A84C', opacity: 0.5 }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-1" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>{label}</p>
        {editing ? (
          <div className="flex gap-2">
            <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
              className="flex-1 px-2 py-1 text-sm outline-none"
              style={{ backgroundColor: '#141C2A', border: '1px solid #C9A84C', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }} />
            <button onClick={() => { onEdit(label, draft); setEditing(false); }}
              className="px-3 py-1 text-xs"
              style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive' }}>OK</button>
            <button onClick={() => setEditing(false)}><X className="w-4 h-4" style={{ color: '#7A7060' }} /></button>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <p className="text-sm break-all flex-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }}>{display}</p>
            {editable && typeof value !== 'object' && (
              <button onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Edit3 className="w-3 h-3" style={{ color: '#C9A84C' }} />
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

    // Fake progress during extraction
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
      toast.success('Métadonnées sauvegardées — fichier prêt au téléchargement');
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
    if (!fileState || !confirm('Supprimer cet enregistrement ?')) return;
    await deleteFileRecord(fileState.firestoreId);
    reset();
    toast.success('Enregistrement supprimé');
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
    <div className="min-h-screen" style={{ backgroundColor: '#080A0F' }}>
      <NavBar />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 mb-6"
              style={{ backgroundColor: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#C0392B' }} />
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#C0392B' }}>{error}</p>
              <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" style={{ color: '#C0392B' }} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* IDLE */}
        {stage === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-10">
              <h1 className="mb-3" style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px, 5vw, 44px)', color: '#EDE8DC' }}>
                Analysez vos fichiers
              </h1>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '15px', color: '#7A7060' }}>
                Glissez un fichier ou cliquez pour le sélectionner
              </p>
            </div>

            <label onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              className="flex flex-col items-center justify-center gap-4 mx-auto cursor-pointer transition-colors"
              style={{ maxWidth: 560, height: 280, border: '2px dashed rgba(201,168,76,0.35)', backgroundColor: '#0C101A' }}
            >
              <Upload className="w-12 h-12" style={{ color: '#C9A84C', opacity: 0.5 }} />
              <div className="text-center">
                <p style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC', fontSize: '18px' }}>Déposez votre fichier ici</p>
                <p className="mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#7A7060' }}>JPEG, PNG, MP3, PDF, MP4…</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileInput}
                accept="image/*,audio/*,video/*,application/pdf" />
            </label>
          </motion.div>
        )}

        {/* LOADING */}
        {stage === 'uploading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="4" />
                <motion.circle cx="32" cy="32" r="28" fill="none" stroke="#C9A84C" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                  transition={{ duration: 0.3 }} />
              </svg>
              <Search className="absolute inset-0 m-auto w-6 h-6" style={{ color: '#C9A84C' }} />
            </div>
            <p style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '4px', color: '#C9A84C', fontSize: '14px' }}>
              EXTRACTION DES MÉTADONNÉES… {progress}%
            </p>
          </motion.div>
        )}

        {/* READY */}
        {stage === 'ready' && fileState && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>{fileState.file.name}</h2>
                <p className="text-xs mt-0.5" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
                  {flatEntries.length} champs • {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                  {fileState.editedBlob && <span style={{ color: '#2AFC98' }}> • ✓ modifié</span>}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <motion.button onClick={reset} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="px-4 py-2 flex items-center gap-2 text-sm"
                  style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
                  <RefreshCw className="w-4 h-4" /> NOUVEAU
                </motion.button>
                <motion.button onClick={handleDownload} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="px-4 py-2 flex items-center gap-2 text-sm"
                  style={{ border: '1px solid rgba(42,252,152,0.3)', color: '#2AFC98', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
                  <Download className="w-4 h-4" />
                  {fileState.editedBlob ? 'TÉL. MODIFIÉ' : 'TÉLÉCHARGER'}
                </motion.button>
                {Object.keys(edits).length > 0 && (
                  <motion.button onClick={handleSave} disabled={saving}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="px-4 py-2 flex items-center gap-2 text-sm"
                    style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'TRAITEMENT...' : `APPLIQUER (${Object.keys(edits).length})`}
                  </motion.button>
                )}
                <motion.button onClick={handleDelete} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="px-4 py-2 flex items-center gap-2 text-sm"
                  style={{ border: '1px solid rgba(192,57,43,0.4)', color: '#C0392B', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
                  <Trash2 className="w-4 h-4" /> SUPPRIMER
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3" style={{ backgroundColor: '#0C101A', border: '1px solid rgba(201,168,76,0.12)' }}>
                <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
                  <h3 style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC', fontSize: '16px' }}>Métadonnées</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {flatEntries.map(([key, value]) => (
                    <MetaRow key={key} label={key} value={value} onEdit={handleEdit} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div style={{ backgroundColor: '#0C101A', border: '1px solid rgba(201,168,76,0.12)', padding: '20px' }}>
                  <h3 className="mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC', fontSize: '15px' }}>Résumé</h3>
                  {[
                    { label: 'Champs',    value: flatEntries.length },
                    { label: 'Éditables', value: flatEntries.filter(([k]) => EDITABLE.has(k.toLowerCase().split('.').pop() ?? '')).length },
                    { label: 'Modifiés',  value: Object.keys(edits).length },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between py-2"
                      style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>{s.label}</span>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '20px', color: '#C9A84C' }}>{s.value}</span>
                    </div>
                  ))}
                </div>

                {fileState.editedBlob && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ backgroundColor: 'rgba(42,252,152,0.08)', border: '1px solid rgba(42,252,152,0.3)', padding: '16px' }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: '#2AFC98' }} />
                      <p style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#2AFC98', fontSize: '12px' }}>FICHIER PRÊT</p>
                    </div>
                    <p className="mt-2" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#7A7060' }}>
                      Cliquez « TÉL. MODIFIÉ » pour télécharger le fichier avec les nouvelles métadonnées
                    </p>
                  </motion.div>
                )}

                {Object.keys(edits).length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', padding: '16px' }}>
                    <p className="mb-2" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C', fontSize: '12px' }}>EN ATTENTE</p>
                    <div className="space-y-1">
                      {Object.entries(edits).map(([k, v]) => (
                        <p key={k} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#7A7060' }}>
                          <span style={{ color: '#C9A84C' }}>{k}</span>: {v}
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
