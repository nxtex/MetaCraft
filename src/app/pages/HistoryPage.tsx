import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { NavBar } from '../components/NavBar';
import { StratumCard } from '../components/StratumCard';
import { GoogleAdSpace } from '../components/GoogleAdSpace';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, SlidersHorizontal, ExternalLink, Trash2,
  RefreshCw, AlertCircle, Loader2, FileImage, Music, FileText, Film, File
} from 'lucide-react';
import { files as filesApi, FileRecord, APIError } from '../lib/api';

function mimeIcon(mime: string) {
  if (mime.startsWith('image/')) return <FileImage className="w-4 h-4" style={{ color: '#C9A84C' }} />;
  if (mime.startsWith('audio/')) return <Music className="w-4 h-4" style={{ color: '#2AFC98' }} />;
  if (mime === 'application/pdf') return <FileText className="w-4 h-4" style={{ color: '#E8732A' }} />;
  if (mime.startsWith('video/')) return <Film className="w-4 h-4" style={{ color: '#A052C8' }} />;
  return <File className="w-4 h-4" style={{ color: '#7A7060' }} />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function HistoryPage() {
  const navigate = useNavigate();
  const [allFiles, setAllFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [mimeFilter, setMimeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await filesApi.history();
      setAllFiles(data ?? []);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Impossible de charger l\'historique');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce fichier définitivement ?')) return;
    setDeleting(id);
    try {
      await filesApi.deleteFile(id);
      setAllFiles(prev => prev.filter(f => f.id !== id));
    } catch { /* ignore */ } finally {
      setDeleting(null);
    }
  }

  const mimeTypes = ['all', ...Array.from(new Set(allFiles.map(f => f.mime_type)))];

  const filtered = allFiles.filter(f => {
    const matchSearch = f.original_name.toLowerCase().includes(search.toLowerCase());
    const matchMime   = mimeFilter === 'all' || f.mime_type === mimeFilter;
    return matchSearch && matchMime;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080A0F' }}>
      <NavBar />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex justify-center mb-6"><GoogleAdSpace slot="history-header" format="horizontal" /></div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Historique</h1>
            <p className="text-xs mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
              {allFiles.length} fichier{allFiles.length !== 1 ? 's' : ''}
            </p>
          </div>
          <motion.button onClick={load} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 self-start text-sm"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
            <RefreshCw className="w-4 h-4" /> ACTUALISER
          </motion.button>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un fichier..."
                className="w-full pl-10 pr-4 py-3 outline-none"
                style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '14px' }}
              />
            </div>
            <button onClick={() => setShowFilters(v => !v)}
              className="sm:hidden px-4 py-3 flex items-center gap-2"
              style={{ border: '1px solid rgba(201,168,76,0.2)', color: showFilters ? '#C9A84C' : '#7A7060' }}>
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <select value={mimeFilter} onChange={e => setMimeFilter(e.target.value)}
              className="hidden sm:block px-4 py-3 outline-none"
              style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '13px' }}>
              {mimeTypes.map(m => <option key={m} value={m}>{m === 'all' ? 'Tous les types' : m}</option>)}
            </select>
          </div>
          {showFilters && (
            <select value={mimeFilter} onChange={e => setMimeFilter(e.target.value)}
              className="sm:hidden w-full px-4 py-3 outline-none"
              style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '13px' }}>
              {mimeTypes.map(m => <option key={m} value={m}>{m === 'all' ? 'Tous les types' : m}</option>)}
            </select>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6"
            style={{ backgroundColor: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)' }}>
            <AlertCircle className="w-4 h-4" style={{ color: '#C0392B' }} />
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#C0392B' }}>{error}</p>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#C9A84C' }} />
            <p style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px', color: '#C9A84C', fontSize: '13px' }}>CHARGEMENT...</p>
          </div>
        ) : (
          <StratumCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: '480px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                    {['Fichier', 'Type', 'Taille', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-4 text-left text-xs"
                        style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-12 text-center"
                        style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060', fontSize: '14px' }}>
                        {allFiles.length === 0 ? 'Aucun fichier analysé pour l’instant' : 'Aucun résultat'}
                      </td></tr>
                    ) : filtered.map((file) => (
                      <motion.tr key={file.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}
                        whileHover={{ backgroundColor: 'rgba(201,168,76,0.04)' }}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {mimeIcon(file.mime_type)}
                            <span className="text-sm truncate max-w-[200px]"
                              style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }}>
                              {file.original_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span className="text-xs px-2 py-1"
                            style={{ backgroundColor: 'rgba(201,168,76,0.1)', fontFamily: 'Bebas Neue, cursive', letterSpacing: '1px', color: '#C9A84C' }}>
                            {file.mime_type.split('/')[1]?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>
                            {formatSize(file.size_bytes)}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>
                            {formatDate(file.created_at)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => navigate(`/metadata/${file.id}`)}
                              title="Voir les métadonnées">
                              <ExternalLink className="w-4 h-4" style={{ color: '#C9A84C' }} />
                            </button>
                            <button onClick={() => handleDelete(file.id)}
                              disabled={deleting === file.id} title="Supprimer">
                              {deleting === file.id
                                ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#C0392B' }} />
                                : <Trash2 className="w-4 h-4" style={{ color: '#C0392B' }} />}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </StratumCard>
        )}

        <div className="flex justify-center mt-8"><GoogleAdSpace slot="history-footer" format="horizontal" /></div>
      </div>
    </div>
  );
}
