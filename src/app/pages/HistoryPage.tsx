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
  if (mime.startsWith('image/')) return <FileImage className="w-4 h-4 text-[#c9a84c]" />;
  if (mime.startsWith('audio/')) return <Music className="w-4 h-4 text-[#22c55e]" />;
  if (mime === 'application/pdf') return <FileText className="w-4 h-4 text-[#f59e0b]" />;
  if (mime.startsWith('video/')) return <Film className="w-4 h-4 text-[#8b5cf6]" />;
  return <File className="w-4 h-4 text-[#6b6b6b]" />;
}

function fmtSize(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function fmtDate(ts: { seconds: number }) {
  return new Date(ts.seconds * 1000).toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
}

export function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      setFiles(await getUserFiles(user.uid));
    } catch {
      toast.error('Impossible de charger l\'historique');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [user]);

  async function handleDelete(f: FileRecord) {
    if (!confirm('Supprimer ce fichier definitivement ?')) return;
    setDeleting(f.id);
    try {
      await deleteStorageFile(f.storagePath);
      await deleteFileRecord(f.id);
      setFiles(prev => prev.filter(r => r.id !== f.id));
      toast.success('Supprime');
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  }

  const filtered = files.filter(f => f.originalName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#050505]">
      <NavBar />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#f5f5f5]" style={{ fontFamily: 'Cinzel, serif' }}>
              Historique
            </h1>
            <p className="text-xs text-[#6b6b6b] mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {files.length} fichier{files.length !== 1 ? 's' : ''} analyse{files.length !== 1 ? 's' : ''}
            </p>
          </div>
          <motion.button 
            onClick={load} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="self-start flex items-center gap-2 px-4 py-2.5 text-xs border border-[#c9a84c]/20 text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-colors"
            style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
          >
            <RefreshCw className="w-3.5 h-3.5" /> ACTUALISER
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3f3f3f]" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Rechercher..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-[#1c1c1c] text-[#f5f5f5] text-sm placeholder:text-[#262626] focus:border-[#c9a84c]/20 focus:outline-none transition-colors"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }} 
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#c9a84c]" />
          </div>
        ) : (
          <div className="bg-[#0a0a0a] border border-[#141414]">
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 500 }}>
                <thead>
                  <tr className="border-b border-[#1c1c1c]">
                    {['Fichier', 'Type', 'Taille', 'Date', ''].map(h => (
                      <th 
                        key={h} 
                        className="px-5 py-4 text-left text-[10px] text-[#c9a84c]"
                        style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.15em' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.length === 0 ? (
                      <tr>
                        <td 
                          colSpan={5} 
                          className="px-5 py-16 text-center text-sm text-[#3f3f3f]"
                          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                        >
                          {files.length === 0 ? 'Aucun fichier analyse' : 'Aucun resultat'}
                        </td>
                      </tr>
                    ) : filtered.map(f => (
                      <motion.tr 
                        key={f.id}
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="border-b border-[#141414] hover:bg-[#0f0f0f] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {mimeIcon(f.mimeType)}
                            <span 
                              className="text-sm text-[#d4d4d4] truncate max-w-[200px]"
                              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                            >
                              {f.originalName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span 
                            className="text-[10px] px-2 py-1 bg-[#c9a84c]/10 text-[#c9a84c]"
                            style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '0.1em' }}
                          >
                            {f.mimeType.split('/')[1]?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                            {fmtSize(f.sizeBytes)}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span className="text-xs text-[#6b6b6b]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                            {f.createdAt ? fmtDate(f.createdAt) : '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-3 justify-end">
                            <button 
                              onClick={() => navigate('/app')} 
                              title="Analyser"
                              className="p-1.5 hover:bg-[#c9a84c]/10 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 text-[#c9a84c]" />
                            </button>
                            <button 
                              onClick={() => handleDelete(f)} 
                              disabled={deleting === f.id}
                              className="p-1.5 hover:bg-[#f43f5e]/10 transition-colors"
                            >
                              {deleting === f.id
                                ? <Loader2 className="w-4 h-4 animate-spin text-[#f43f5e]" />
                                : <Trash2 className="w-4 h-4 text-[#f43f5e]" />
                              }
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
