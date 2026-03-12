import { useState } from 'react';
import { NavBar } from '../components/NavBar';
import { FileDropZone } from '../components/FileDropZone';
import { StratumCard } from '../components/StratumCard';
import { GoogleAdSpace } from '../components/GoogleAdSpace';
import { ParallaxGlyphs } from '../components/ParallaxGlyphs';
import { FileImage, Music, FileText, X, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface QueuedFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'audio' | 'pdf' | 'video';
}

const mockFiles: QueuedFile[] = [
  { id: '1', name: 'photo_paris.jpg', size: '3.2 MB', type: 'image' },
  { id: '2', name: 'conference.mp3', size: '12.8 MB', type: 'audio' },
  { id: '3', name: 'rapport_2024.pdf', size: '1.5 MB', type: 'pdf' },
  { id: '4', name: 'vacation_video.mp4', size: '24.1 MB', type: 'video' },
];

const formatData = [
  { name: 'JPEG', value: 5, color: '#C9A84C' },
  { name: 'MP3', value: 3, color: '#2AFC98' },
  { name: 'PDF', value: 4, color: '#E8732A' },
];

const yearData = [
  { year: '2021', count: 3 },
  { year: '2022', count: 7 },
  { year: '2023', count: 5 },
  { year: '2024', count: 9 },
];

const tableData = [
  { file: 'photo_paris.jpg', format: 'JPEG', size: '3.2 MB', date: '2024-03-15', gps: 'Oui', author: 'Canon EOS', status: 'COMPLET' },
  { file: 'conference.mp3', format: 'MP3', size: '12.8 MB', date: '2023-11-22', gps: 'Non', author: 'Zoom H4n', status: 'COMPLET' },
  { file: 'rapport_2024.pdf', format: 'PDF', size: '1.5 MB', date: '2024-01-08', gps: 'Non', author: 'Adobe', status: 'INCOMPLET' },
];

export function BatchAnalysisPage() {
  const [files, setFiles] = useState<QueuedFile[]>(mockFiles);

  const handleFileSelect = (newFiles: File[]) => {
    console.log('Files selected:', newFiles);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return FileImage;
      case 'audio': return Music;
      case 'pdf': return FileText;
      default: return FileImage;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'image': return '#C9A84C';
      case 'audio': return '#2AFC98';
      case 'pdf': return '#E8732A';
      default: return '#C9A84C';
    }
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#080A0F' }}>
      <ParallaxGlyphs />
      <NavBar />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p
            className="mb-2"
            style={{
              fontFamily: 'Bebas Neue, cursive',
              letterSpacing: '5px',
              color: '#2AFC98',
              fontSize: '12px',
            }}
          >
            MODULE R — ANALYSE DE CORPUS
          </p>
          <h1
            className="mb-3"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(26px, 5vw, 42px)',
              color: '#EDE8DC',
            }}
          >
            Analyse en profondeur
          </h1>
          <p
            className="max-w-[700px]"
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '14px',
              color: '#7A7060',
            }}
          >
            Déposez plusieurs artefacts et laissez le moteur R révéler les patterns cachés.
          </p>
        </div>

        {/* Drop zone */}
        <div className="mb-6">
          <FileDropZone onFileSelect={handleFileSelect} multiple />
        </div>

        {/* File queue */}
        {files.length > 0 && (
          <StratumCard className="p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {files.map((file) => {
                const Icon = getFileIcon(file.type);
                const color = getFileColor(file.type);
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 group"
                    style={{
                      backgroundColor: '#141C2A',
                      borderLeft: `3px solid ${color}`,
                      clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />
                    <span
                      className="flex-1 text-sm truncate"
                      style={{ fontFamily: 'JetBrains Mono, monospace', color: '#EDE8DC' }}
                    >
                      {file.name}
                    </span>
                    <span
                      className="text-xs hidden sm:inline"
                      style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
                    >
                      {file.size}
                    </span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <X className="w-4 h-4" style={{ color: '#C0392B' }} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 mt-4"
              style={{ borderTop: '1px solid rgba(201, 168, 76, 0.2)' }}
            >
              <span
                className="text-sm"
                style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
              >
                Total: {files.length} fichiers — 41.6 Mo
              </span>
              <button
                className="w-full sm:w-auto px-6 py-2 transition-all hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: '#C9A84C',
                  color: '#080A0F',
                  fontFamily: 'Bebas Neue, cursive',
                  letterSpacing: '3px',
                }}
              >
                Déposer tous les artefacts
              </button>
            </div>
          </StratumCard>
        )}

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StratumCard hover className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs mb-2" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#7A7060' }}>ARTEFACTS</p>
                <p className="text-3xl sm:text-4xl" style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}>12</p>
              </div>
              <FileImage className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C9A84C', opacity: 0.3 }} />
            </div>
          </StratumCard>

          <StratumCard hover className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs mb-2" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#7A7060' }}>FORMATS</p>
                <p className="text-3xl sm:text-4xl mb-1" style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}>3</p>
                <p className="text-xs hidden sm:block" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>JPEG · MP3 · PDF</p>
              </div>
            </div>
          </StratumCard>

          <StratumCard hover className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs mb-2" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#7A7060' }}>PÉRIODE</p>
                <p className="text-2xl sm:text-4xl" style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}>2021–24</p>
              </div>
              <span className="text-2xl sm:text-3xl" style={{ color: '#C9A84C', opacity: 0.3 }}>ӷ</span>
            </div>
          </StratumCard>

          <StratumCard hover className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs mb-2" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#7A7060' }}>DONNÉES GPS</p>
                <p className="text-3xl sm:text-4xl" style={{ fontFamily: 'Cinzel, serif', color: '#2AFC98' }}>8/12</p>
              </div>
              <span className="text-2xl sm:text-3xl" style={{ color: '#2AFC98', opacity: 0.3 }}>⊕</span>
            </div>
          </StratumCard>
        </div>

        {/* Ad space */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <GoogleAdSpace slot="batch-middle" format="horizontal" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <StratumCard className="p-4 sm:p-6">
            <h3 className="mb-6" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px', color: '#EDE8DC', fontSize: '14px' }}>
              RÉPARTITION DES FORMATS
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={formatData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {formatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 sm:gap-6 mt-4 flex-wrap">
              {formatData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: item.color }} />
                  <span className="text-xs" style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </StratumCard>

          <StratumCard className="p-4 sm:p-6">
            <h3 className="mb-6" style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px', color: '#EDE8DC', fontSize: '14px' }}>
              FICHIERS PAR ANNÉE
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 168, 76, 0.1)" />
                <XAxis dataKey="year" stroke="#7A7060" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px' }} />
                <YAxis stroke="#7A7060" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px' }} />
                <Bar dataKey="count" fill="url(#goldGradient)" />
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" />
                    <stop offset="100%" stopColor="#E8732A" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </StratumCard>
        </div>

        {/* Results table */}
        <StratumCard className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '3px', color: '#EDE8DC', fontSize: '16px' }}>CATALOGUE COMPLET</h3>
            <button
              className="w-full sm:w-auto px-4 py-2"
              style={{
                border: '1.5px dashed rgba(201, 168, 76, 0.5)',
                color: '#EDE8DC',
                fontFamily: 'Bebas Neue, cursive',
                letterSpacing: '2px',
                backgroundColor: 'transparent',
              }}
            >
              <Download className="inline-block w-4 h-4 mr-2" />
              Exporter CSV
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr
                  className="text-left text-xs"
                  style={{ fontFamily: 'Bebas Neue, cursive', letterSpacing: '2px', color: '#7A7060', borderBottom: '1px solid rgba(201, 168, 76, 0.2)' }}
                >
                  <th className="pb-3 px-3">Fichier</th>
                  <th className="pb-3 px-3">Format</th>
                  <th className="pb-3 px-3">Taille</th>
                  <th className="pb-3 px-3 hidden sm:table-cell">Date</th>
                  <th className="pb-3 px-3">GPS</th>
                  <th className="pb-3 px-3 hidden sm:table-cell">Auteur</th>
                  <th className="pb-3 px-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    style={{ borderBottom: '1px dotted rgba(201, 168, 76, 0.1)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td className="py-3 px-3 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#EDE8DC' }}>{row.file}</td>
                    <td className="py-3 px-3 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#C9A84C' }}>{row.format}</td>
                    <td className="py-3 px-3 text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>{row.size}</td>
                    <td className="py-3 px-3 text-sm hidden sm:table-cell" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>{row.date}</td>
                    <td className="py-3 px-3 text-sm"><span style={{ color: row.gps === 'Oui' ? '#2AFC98' : '#7A7060' }}>{row.gps}</span></td>
                    <td className="py-3 px-3 text-sm hidden sm:table-cell" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>{row.author}</td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          fontFamily: 'Bebas Neue, cursive',
                          letterSpacing: '1px',
                          backgroundColor: row.status === 'COMPLET' ? 'rgba(42, 252, 152, 0.1)' : 'rgba(232, 115, 42, 0.1)',
                          color: row.status === 'COMPLET' ? '#2AFC98' : '#E8732A',
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StratumCard>
      </div>
    </div>
  );
}
