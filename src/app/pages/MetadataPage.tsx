import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { NavBar } from '../components/NavBar';
import { StratumCard } from '../components/StratumCard';
import { GoogleAdSpace } from '../components/GoogleAdSpace';
import { motion, AnimatePresence } from 'motion/react';
import {
  Save, Download, Trash2, ChevronRight, Edit3, X,
  AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import { files as filesApi, APIError } from '../lib/api';

type MetaValue = string | number | boolean | null | Record<string, unknown>;

function MetaRow({
  label, value, editable, onEdit
}: {
  label: string;
  value: MetaValue;
  editable: boolean;
  onEdit?: (key: string, value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ''));

  const displayValue = typeof value === 'object' && value !== null
    ? JSON.stringify(value, null, 2)
    : String(value ?? '—');

  return (
    <motion.div
      className="flex items-start gap-3 py-3 px-4 group"
      style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}
      whileHover={{ backgroundColor: 'rgba(201,168,76,0.04)' }}
    >
      <ChevronRight className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: '#C9A84C', opacity: 0.5 }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-1" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>
          {label}
        </p>
        {editing ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              className="flex-1 px-3 py-1 text-sm outline-none"
              style={{ backgroundColor: '#141C2A', border: '1px solid #C9A84C', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }}
            />
            <button onClick={() => { onEdit?.(label, draft); setEditing(false); }}
              className="px-3 py-1 text-xs" style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive' }}>
              OK
            </button>
            <button onClick={() => setEditing(false)}><X className="w-4 h-4" style={{ color: '#7A7060' }} /></button>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <p className="text-sm break-all flex-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }}>
              {displayValue}
            </p>
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

export function MetadataPage() {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState<Record<string, MetaValue>>({});
  const [pendingEdits, setPendingEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const load = useCallback(async () => {
    if (!fileId) return;
    setLoading(true);
    setError('');
    try {
      const data = await filesApi.getMetadata(fileId);
      setMetadata(data as Record<string, MetaValue>);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Impossible de charger les métadonnées');
    } finally {
      setLoading(false);
    }
  }, [fileId]);

  useEffect(() => { load(); }, [load]);

  function handleEdit(key: string, value: string) {
    setPendingEdits(prev => ({ ...prev, [key]: value }));
    setMetadata(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!fileId || !Object.keys(pendingEdits).length) return;
    setSaving(true);
    try {
      const updated = await filesApi.updateMetadata(fileId, pendingEdits);
      setMetadata(updated as Record<string, MetaValue>);
      setPendingEdits({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handleDownload() {
    if (!fileId) return;
    try {
      const { download_url } = await filesApi.getFile(fileId);
      window.open(download_url, '_blank');
    } catch { /* ignore */ }
  }

  async function handleDelete() {
    if (!fileId || !confirm('Supprimer ce fichier définitivement ?')) return;
    try {
      await filesApi.deleteFile(fileId);
      navigate('/history');
    } catch { /* ignore */ }
  }

  // Flatten nested metadata for display
  function flattenMeta(obj: Record<string, MetaValue>, prefix = ''): [string, MetaValue][] {
    return Object.entries(obj).flatMap(([k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'object' && v !== null && !Array.isArray(v))
        return flattenMeta(v as Record<string, MetaValue>, key);
      return [[key, v]];
    });
  }

  const editableKeys = new Set(['title', 'author', 'subject', 'creator', 'artist', 'album', 'genre', 'date', 'copyright', 'imagedescription']);
  const entries = flattenMeta(metadata);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080A0F' }}>
      <NavBar />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex justify-center mb-6"><GoogleAdSpace slot="meta-header" format="horizontal" /></div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Analyse des Métadonnées</h1>
            <p className="text-xs mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>ID : {fileId}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <motion.button onClick={load} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 flex items-center gap-2 text-sm"
              style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
              <RefreshCw className="w-4 h-4" /> ACTUALISER
            </motion.button>
            <motion.button onClick={handleDownload} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 flex items-center gap-2 text-sm"
              style={{ border: '1px solid rgba(42,252,152,0.3)', color: '#2AFC98', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
              <Download className="w-4 h-4" /> TÉLÉCHARGER
            </motion.button>
            {Object.keys(pendingEdits).length > 0 && (
              <motion.button onClick={handleSave} disabled={saving}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-4 py-2 flex items-center gap-2 text-sm"
                style={{ backgroundColor: '#C9A84C', color: '#080A0F', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'SAUVEGARDE...' : `SAUVEGARDER (${Object.keys(pendingEdits).length})`}
              </motion.button>
            )}
            <motion.button onClick={handleDelete} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 flex items-center gap-2 text-sm"
              style={{ border: '1px solid rgba(192,57,43,0.4)', color: '#C0392B', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
              <Trash2 className="w-4 h-4" /> SUPPRIMER
            </motion.button>
          </div>
        </div>

        {/* Error */}
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
          {saveSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 mb-6"
              style={{ backgroundColor: 'rgba(42,252,152,0.1)', border: '1px solid rgba(42,252,152,0.3)' }}>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#2AFC98' }}>
                ✓ Métadonnées sauvegardées avec succès
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <motion.div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#C9A84C', borderTopColor: 'transparent' }} />
            <p style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px', color: '#C9A84C', fontSize: '13px' }}>
              EXCAVATION EN COURS...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StratumCard className="overflow-hidden">
                <div className="px-4 sm:px-6 py-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                  <h2 className="text-lg" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>
                    Métadonnées ({entries.length} champs)
                  </h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  {entries.length === 0 ? (
                    <p className="p-8 text-center" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
                      Aucune métadonnée trouvée
                    </p>
                  ) : (
                    entries.map(([key, value]) => (
                      <MetaRow
                        key={key}
                        label={key}
                        value={value}
                        editable={editableKeys.has(key.toLowerCase().split('.').pop() ?? '')}
                        onEdit={handleEdit}
                      />
                    ))
                  )}
                </div>
              </StratumCard>
            </div>

            <div className="space-y-6">
              <StratumCard className="p-4 sm:p-6">
                <h3 className="text-base mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Résumé</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Champs totaux', value: entries.length },
                    { label: 'Éditables', value: entries.filter(([k]) => editableKeys.has(k.toLowerCase().split('.').pop() ?? '')).length },
                    { label: 'Modifiés', value: Object.keys(pendingEdits).length },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center py-2"
                      style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>{s.label}</span>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '18px', color: '#C9A84C' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </StratumCard>
              <GoogleAdSpace slot="meta-sidebar" format="rectangle" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
