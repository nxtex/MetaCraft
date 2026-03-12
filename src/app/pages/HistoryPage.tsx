import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { NavBar } from '../components/NavBar';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Trash2, ExternalLink, Loader2, FileImage, Music, FileText, Film, File, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserFiles, deleteFileRecord, FileRecord } from '../../lib/firestore';
import { deleteStorageFile } from '../../lib/storage';
import { toast } from 'sonner';

function mimeIcon(mime: string) {
  if (mime.startsWith('image/')) return <FileImage className="w-4 h-4" style={{ color: '#C9A84C' }} />;
  if (mime.startsWith('audio/')) return <Music className="w-4 h-4" style={{ color: '#2AFC98' }} />;
  if (mime === 'application/pdf') return <FileText className="w-4 h-4" style={{ color: '#E8732A' }} />;
  if (mime.startsWith('video/')) return <Film className="w-4 h-4" style={{ color: '#A052C8' }} />;
  return <File className="w-4 h-4" style={{ color: '#7A7060' }} />;
}

function fmtSize(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function fmtDate(ts: { seconds: number }) {
  return new Date(ts.seconds * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function HistoryPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [files, setFiles]     = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    if (!user) return;
    setLoading(true);
    try { setFiles(await getUserFiles(user.uid)); }
    catch { toast.error('Impossible de charger l\'historique'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [user]);

  async function handleDelete(f: FileRecord) {
    if (!confirm('Supprimer ce fichier définitivement ?')) return;
    setDeleting(f.id);
    try {
      await deleteStorageFile(f.storagePath);
      await deleteFileRecord(f.id);
      setFiles(prev => prev.filter(r => r.id !== f.id));
      toast.success('Supprimé');
    } catch { toast.error('Erreur lors de la suppression'); }
    finally { setDeleting(null); }
  }

  const filtered = files.filter(f => f.originalName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080A0F' }}>
      <NavBar />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Historique</h1>
            <p className="text-xs mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>{files.length} fichier{files.length !== 1 ? 's' : ''}</p>
          </div>
          <motion.button onClick={load} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 text-sm self-start"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
            <RefreshCw className="w-4 h-4" /> ACTUALISER
          </motion.button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#7A7060' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-3 outline-none"
            style={{ backgroundColor: '#141C2A', border: '1px solid rgba(201,168,76,0.2)', fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC', fontSize: '14px' }} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#C9A84C' }} />
          </div>
        ) : (
          <div style={{ backgroundColor: '#0C101A', border: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 480 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.18)' }}>
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
                        {files.length === 0 ? 'Aucun fichier analysé pour l’instant' : 'Aucun résultat'}
                      </td></tr>
                    ) : filtered.map(f => (
                      <motion.tr key={f.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}
                        whileHover={{ backgroundColor: 'rgba(201,168,76,0.04)' }}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {mimeIcon(f.mimeType)}
                            <span className="text-sm truncate max-w-[200px]"
                              style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }}>{f.originalName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span className="text-xs px-2 py-0.5"
                            style={{ backgroundColor: 'rgba(201,168,76,0.1)', fontFamily: 'Bebas Neue, cursive', letterSpacing: '1px', color: '#C9A84C' }}>
                            {f.mimeType.split('/')[1]?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>{fmtSize(f.sizeBytes)}</span>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>
                            {f.createdAt ? fmtDate(f.createdAt) : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => navigate('/app')} title="Analyser">
                              <ExternalLink className="w-4 h-4" style={{ color: '#C9A84C' }} />
                            </button>
                            <button onClick={() => handleDelete(f)} disabled={deleting === f.id}>
                              {deleting === f.id
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
          </div>
        )}
      </div>
    </div>
  );
}
