import { useState } from 'react';
import { NavBar } from '../components/NavBar';
import { StratumCard } from '../components/StratumCard';
import { EmptyState } from '../components/EmptyState';
import { Search, ExternalLink, Trash2 } from 'lucide-react';
import { ParallaxGlyphs } from '../components/ParallaxGlyphs';
import { GoogleAdSpace } from '../components/GoogleAdSpace';

interface HistoryEntry {
  ref: string;
  file: string;
  format: string;
  date: string;
  fragments: number;
  modified: number;
}

const mockHistory: HistoryEntry[] = [
  {
    ref: 'ART-1847',
    file: 'photo_paris.jpg',
    format: 'JPEG',
    date: 'Aujourd\'hui, 09h42',
    fragments: 24,
    modified: 3,
  },
  {
    ref: 'ART-1846',
    file: 'conference_audio.mp3',
    format: 'MP3',
    date: 'Hier, 14h20',
    fragments: 18,
    modified: 0,
  },
  {
    ref: 'ART-1845',
    file: 'rapport_final.pdf',
    format: 'PDF',
    date: '10 mars 2026, 16h35',
    fragments: 12,
    modified: 1,
  },
  {
    ref: 'ART-1844',
    file: 'vacation_video.mp4',
    format: 'MP4',
    date: '09 mars 2026, 11h15',
    fragments: 31,
    modified: 0,
  },
  {
    ref: 'ART-1843',
    file: 'document_scan.pdf',
    format: 'PDF',
    date: '08 mars 2026, 08h52',
    fragments: 15,
    modified: 5,
  },
];

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>(mockHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState<string>('all');

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteEntry = (ref: string) => {
    setHistory(history.filter((entry) => entry.ref !== ref));
  };

  const filteredHistory = history.filter((entry) => {
    const matchesSearch =
      searchTerm === '' ||
      entry.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat =
      formatFilter === 'all' || entry.format === formatFilter;
    return matchesSearch && matchesFormat;
  });

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#080A0F' }}>
      <ParallaxGlyphs />
      <NavBar />

      <div className="max-w-[1600px] mx-auto px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1
              className="mb-2"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '40px',
                color: '#EDE8DC',
              }}
            >
              Archives de fouilles
            </h1>
            <p
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '14px',
                color: '#7A7060',
              }}
            >
              Historique complet de vos excavations numériques
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-6 py-3 transition-all hover:bg-opacity-10"
              style={{
                border: '1.5px solid #C0392B',
                color: '#C0392B',
                fontFamily: 'Bebas Neue, cursive',
                letterSpacing: '2px',
                backgroundColor: 'transparent',
              }}
            >
              <Trash2 className="inline-block w-4 h-4 mr-2" />
              Effacer les archives
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <StratumCard className="p-12">
            <EmptyState
              title="Aucune fouille enregistrée"
              subtitle="Vos excavations passées apparaîtront ici."
            />
          </StratumCard>
        ) : (
          <>
            {/* Search & filters */}
            <StratumCard className="p-6 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: '#C9A84C' }}
                  />
                  <input
                    type="text"
                    placeholder="Rechercher dans les archives..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3"
                    style={{
                      backgroundColor: '#141C2A',
                      border: '1px solid rgba(201, 168, 76, 0.2)',
                      clipPath:
                        'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                      fontFamily: 'IBM Plex Mono, monospace',
                      color: '#EDE8DC',
                    }}
                  />
                </div>

                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="px-4 py-3"
                  style={{
                    backgroundColor: '#141C2A',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    clipPath:
                      'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '2px',
                    color: '#EDE8DC',
                  }}
                >
                  <option value="all">Format</option>
                  <option value="JPEG">JPEG</option>
                  <option value="MP3">MP3</option>
                  <option value="PDF">PDF</option>
                  <option value="MP4">MP4</option>
                </select>

                <select
                  className="px-4 py-3"
                  style={{
                    backgroundColor: '#141C2A',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    clipPath:
                      'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '2px',
                    color: '#EDE8DC',
                  }}
                >
                  <option>Date</option>
                  <option>Aujourd'hui</option>
                  <option>Cette semaine</option>
                  <option>Ce mois</option>
                </select>

                <select
                  className="px-4 py-3"
                  style={{
                    backgroundColor: '#141C2A',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    clipPath:
                      'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '2px',
                    color: '#EDE8DC',
                  }}
                >
                  <option>Statut</option>
                  <option>Modifié</option>
                  <option>Non modifié</option>
                </select>
              </div>
            </StratumCard>

            {/* Ad space */}
            <div className="flex justify-center mb-6">
              <GoogleAdSpace slot="history-middle" format="horizontal" />
            </div>

            {/* History table */}
            <StratumCard className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className="text-left text-xs"
                      style={{
                        fontFamily: 'Bebas Neue, cursive',
                        letterSpacing: '2px',
                        color: '#7A7060',
                        borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
                      }}
                    >
                      <th className="pb-3 px-3">Réf.</th>
                      <th className="pb-3 px-3">Fichier</th>
                      <th className="pb-3 px-3">Format</th>
                      <th className="pb-3 px-3">Traité le</th>
                      <th className="pb-3 px-3">Fragments lus</th>
                      <th className="pb-3 px-3">Modifiés</th>
                      <th className="pb-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((entry) => (
                      <tr
                        key={entry.ref}
                        className="group"
                        style={{
                          borderBottom: '1px dotted rgba(201, 168, 76, 0.1)',
                          borderLeft:
                            entry.modified > 0
                              ? '3px solid rgba(232, 115, 42, 0.5)'
                              : '3px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            'rgba(201, 168, 76, 0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td
                          className="py-3 px-3 text-xs"
                          style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
                        >
                          {entry.ref}
                        </td>
                        <td
                          className="py-3 px-3 text-sm"
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: '#EDE8DC',
                          }}
                        >
                          {entry.file}
                        </td>
                        <td
                          className="py-3 px-3 text-sm"
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: '#C9A84C',
                          }}
                        >
                          {entry.format}
                        </td>
                        <td
                          className="py-3 px-3 text-sm"
                          style={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            color: '#7A7060',
                          }}
                        >
                          {entry.date}
                        </td>
                        <td
                          className="py-3 px-3 text-sm text-center"
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: '#EDE8DC',
                          }}
                        >
                          {entry.fragments}
                        </td>
                        <td className="py-3 px-3 text-sm text-center">
                          {entry.modified > 0 ? (
                            <span
                              className="px-2 py-1 rounded"
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                backgroundColor: 'rgba(232, 115, 42, 0.15)',
                                color: '#E8732A',
                              }}
                            >
                              {entry.modified}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                color: '#7A7060',
                              }}
                            >
                              —
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="transition-all hover:scale-110"
                              style={{ color: '#C9A84C' }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEntry(entry.ref)}
                              className="transition-all hover:scale-110"
                              style={{ color: '#C0392B' }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </StratumCard>
          </>
        )}
      </div>
    </div>
  );
}