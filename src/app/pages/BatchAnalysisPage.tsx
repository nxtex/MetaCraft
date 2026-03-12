import { useState, useEffect, useCallback } from 'react';
import { NavBar } from '../components/NavBar';
import { StratumCard } from '../components/StratumCard';
import { GoogleAdSpace } from '../components/GoogleAdSpace';
import { ParallaxGlyphs } from '../components/ParallaxGlyphs';
import { motion } from 'motion/react';
import { BarChart2, TrendingUp, HardDrive, MapPin, Play, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { files as filesApi, FileRecord, BatchAnalysisResponse, APIError } from '../lib/api';

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function BatchAnalysisPage() {
  const [historyFiles, setHistoryFiles] = useState<FileRecord[]>([]);
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());
  const [analysis, setAnalysis]         = useState<BatchAnalysisResponse['analysis'] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [analyzing, setAnalyzing]           = useState(false);
  const [error, setError]                   = useState('');

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const data = await filesApi.history();
      setHistoryFiles(data ?? []);
    } catch { /* ignore */ } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  function toggleAll() {
    if (selectedIds.size === historyFiles.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(historyFiles.map(f => f.id)));
  }

  async function runAnalysis() {
    if (!selectedIds.size) return;
    setAnalyzing(true);
    setError('');
    try {
      const result = await filesApi.batchAnalyze(Array.from(selectedIds));
      setAnalysis(result.analysis);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Analyse échouée');
    } finally {
      setAnalyzing(false);
    }
  }

  const kpis = analysis ? [
    { label: 'Fichiers analysés', value: analysis.total_files, icon: BarChart2, color: '#C9A84C' },
    { label: 'Taille totale',      value: formatSize(analysis.size_stats.total_bytes), icon: HardDrive, color: '#2AFC98' },
    { label: 'Période couverte',   value: analysis.period.from === analysis.period.to ? analysis.period.from : `${analysis.period.from}–${analysis.period.to}`, icon: TrendingUp, color: '#E8732A' },
    { label: 'Fichiers GPS',       value: analysis.gps_count, icon: MapPin, color: '#A052C8' },
  ] : [];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#080A0F' }}>
      <ParallaxGlyphs />
      <NavBar />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6 sm:py-8 relative z-10">
        <div className="flex justify-center mb-6"><GoogleAdSpace slot="batch-header" format="horizontal" /></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Analyse par lot</h1>
          <div className="flex gap-3">
            <motion.button onClick={loadHistory} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 flex items-center gap-2 text-sm"
              style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px' }}>
              <RefreshCw className="w-4 h-4" /> ACTUALISER
            </motion.button>
            <motion.button onClick={runAnalysis} disabled={!selectedIds.size || analyzing}
              whileHover={selectedIds.size && !analyzing ? { scale: 1.02, boxShadow: '0 0 20px rgba(201,168,76,0.3)' } : {}}
              whileTap={selectedIds.size && !analyzing ? { scale: 0.98 } : {}}
              className="px-6 py-2 flex items-center gap-2 text-sm"
              style={{
                backgroundColor: selectedIds.size && !analyzing ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                color: '#080A0F',
                fontFamily: 'Bebas Neue, cursive',
                letterSpacing: '2px',
                cursor: selectedIds.size && !analyzing ? 'pointer' : 'not-allowed',
              }}>
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {analyzing ? 'ANALYSE...' : `ANALYSER (${selectedIds.size})`}
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 mb-6"
            style={{ backgroundColor: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)' }}>
            <AlertCircle className="w-4 h-4" style={{ color: '#C0392B' }} />
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', color: '#C0392B' }}>{error}</p>
          </div>
        )}

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
          {/* File selector */}
          <div className="lg:col-span-4">
            <StratumCard className="overflow-hidden">
              <div className="px-4 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                <h2 className="text-base" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>
                  Sélection ({selectedIds.size}/{historyFiles.length})
                </h2>
                <button onClick={toggleAll}
                  className="text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C' }}>
                  {selectedIds.size === historyFiles.length ? 'TOUT DÉS.' : 'TOUT SÉL.'}
                </button>
              </div>
              {loadingHistory ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#C9A84C' }} />
                </div>
              ) : historyFiles.length === 0 ? (
                <p className="px-4 py-12 text-center text-sm"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
                  Aucun fichier dans l’historique.
                  <br />Uploadez d’abord des fichiers.
                </p>
              ) : (
                <div className="max-h-[500px] overflow-y-auto">
                  {historyFiles.map(file => (
                    <motion.div key={file.id}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}
                      whileHover={{ backgroundColor: 'rgba(201,168,76,0.05)' }}
                      onClick={() => setSelectedIds(prev => {
                        const next = new Set(prev);
                        next.has(file.id) ? next.delete(file.id) : next.add(file.id);
                        return next;
                      })}
                    >
                      <div className="w-4 h-4 border flex-shrink-0 flex items-center justify-center"
                        style={{ borderColor: selectedIds.has(file.id) ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                          backgroundColor: selectedIds.has(file.id) ? '#C9A84C' : 'transparent' }}>
                        {selectedIds.has(file.id) && <span style={{ color: '#080A0F', fontSize: '10px' }}>✓</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#EDE8DC' }}>
                          {file.original_name}
                        </p>
                        <p className="text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
                          {file.mime_type}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </StratumCard>
          </div>

          {/* Results */}
          <div className="lg:col-span-8 space-y-6">
            {!analysis ? (
              <StratumCard className="flex flex-col items-center justify-center py-24 gap-4">
                <BarChart2 className="w-16 h-16" style={{ color: '#C9A84C', opacity: 0.2 }} />
                <p style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px', color: '#7A7060', fontSize: '14px' }}>
                  SÉLECTIONNEZ DES FICHIERS ET LANCEZ L’ANALYSE
                </p>
              </StratumCard>
            ) : (
              <>
                {/* KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {kpis.map((kpi, i) => (
                    <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                      <StratumCard hover className="p-4">
                        <kpi.icon className="w-6 h-6 mb-2" style={{ color: kpi.color, opacity: 0.7 }} />
                        <p className="text-2xl sm:text-3xl mb-1" style={{ fontFamily: 'Cinzel, serif', color: kpi.color }}>{kpi.value}</p>
                        <p className="text-xs" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '1px', color: '#7A7060' }}>{kpi.label}</p>
                      </StratumCard>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Format distribution */}
                  <StratumCard className="p-4 sm:p-6">
                    <h3 className="text-base mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Distribution des formats</h3>
                    <div className="space-y-3">
                      {analysis.format_dist.map(({ ext, count }) => {
                        const pct = Math.round((count / analysis.total_files) * 100);
                        return (
                          <div key={ext}>
                            <div className="flex justify-between mb-1">
                              <span style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#C9A84C', fontSize: '12px' }}>{ext}</span>
                              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>{count} ({pct}%)</span>
                            </div>
                            <div className="h-2" style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
                              <motion.div className="h-full" style={{ backgroundColor: '#C9A84C' }}
                                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </StratumCard>

                  {/* Size stats */}
                  <StratumCard className="p-4 sm:p-6">
                    <h3 className="text-base mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Statistiques de taille</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Taille totale',   value: formatSize(analysis.size_stats.total_bytes) },
                        { label: 'Moyenne',          value: formatSize(analysis.size_stats.mean_bytes) },
                        { label: 'Médiane',          value: formatSize(analysis.size_stats.median_bytes) },
                        { label: 'Plus grand',       value: formatSize(analysis.size_stats.max_bytes) },
                        { label: 'Plus petit',       value: formatSize(analysis.size_stats.min_bytes) },
                      ].map(s => (
                        <div key={s.label} className="flex justify-between py-2"
                          style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: '#7A7060' }}>{s.label}</span>
                          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '16px', color: '#2AFC98' }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </StratumCard>
                </div>

                {/* Files by year */}
                {analysis.files_by_year.length > 0 && (
                  <StratumCard className="p-4 sm:p-6">
                    <h3 className="text-base mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>Fichiers par année</h3>
                    <div className="flex items-end gap-2 h-32">
                      {analysis.files_by_year.map(({ year, count }) => {
                        const maxCount = Math.max(...analysis.files_by_year.map(f => f.count));
                        const pct = (count / maxCount) * 100;
                        return (
                          <div key={year} className="flex-1 flex flex-col items-center gap-1">
                            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#7A7060' }}>{count}</span>
                            <motion.div className="w-full" style={{ backgroundColor: '#E8732A' }}
                              initial={{ height: 0 }} animate={{ height: `${pct}%` }} transition={{ duration: 0.8 }} />
                            <span style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '11px', color: '#C9A84C' }}>{year}</span>
                          </div>
                        );
                      })}
                    </div>
                  </StratumCard>
                )}
              </>
            )}
            <div className="flex justify-center"><GoogleAdSpace slot="batch-footer" format="horizontal" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
