import { useState } from 'react';
import { NavBar } from '../components/NavBar';
import { StratumCard } from '../components/StratumCard';
import { TypeBadge } from '../components/TypeBadge';
import { GoogleAdSpace } from '../components/GoogleAdSpace';
import { ParallaxGlyphs } from '../components/ParallaxGlyphs';
import { Download, Edit2, Lock, Check, X, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface MetadataField {
  id: string;
  name: string;
  value: string;
  type: 'string' | 'date' | 'gps' | 'integer' | 'boolean';
  editable: boolean;
}

const mockMetadata: MetadataField[] = [
  { id: 'ART-0001', name: 'Make', value: 'Canon EOS R5', type: 'string', editable: true },
  { id: 'ART-0002', name: 'DateTime', value: '2024-03-15 14:32:00', type: 'date', editable: true },
  { id: 'ART-0003', name: 'GPSLatitude', value: '48.8566° N', type: 'gps', editable: true },
  { id: 'ART-0004', name: 'ImageWidth', value: '4032', type: 'integer', editable: false },
  { id: 'ART-0005', name: 'Software', value: 'Adobe Lightroom 7.0', type: 'string', editable: true },
  { id: 'ART-0006', name: 'FocalLength', value: '85mm', type: 'string', editable: false },
  { id: 'ART-0007', name: 'ISO', value: '400', type: 'integer', editable: true },
  { id: 'ART-0008', name: 'Copyright', value: '© Anas Mesri 2024', type: 'string', editable: true },
  { id: 'ART-0009', name: 'GPSLongitude', value: '2.3522° E', type: 'gps', editable: true },
  { id: 'ART-0010', name: 'Aperture', value: 'f/2.8', type: 'string', editable: false },
  { id: 'ART-0011', name: 'ShutterSpeed', value: '1/250', type: 'string', editable: false },
  { id: 'ART-0012', name: 'ColorSpace', value: 'sRGB', type: 'string', editable: true },
];

export function MetadataPage() {
  const [metadata, setMetadata] = useState(mockMetadata);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'editable' | 'readonly'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (field: MetadataField) => {
    setEditingId(field.id);
    setEditValue(field.value);
  };

  const handleSave = (id: string) => {
    setMetadata((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value: editValue } : field))
    );
    setModifiedIds((prev) => new Set(prev).add(id));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleReset = () => {
    setMetadata(mockMetadata);
    setModifiedIds(new Set());
  };

  const filteredMetadata = metadata.filter((field) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'editable' && field.editable) ||
      (filter === 'readonly' && !field.editable);
    const matchesSearch =
      searchTerm === '' ||
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.value.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#080A0F' }}>
      <ParallaxGlyphs />
      <NavBar />

      <div className="max-w-[1800px] mx-auto px-8 py-8 relative z-10">
        {/* Top ad */}
        <div className="flex justify-center mb-6">
          <GoogleAdSpace slot="metadata-header" format="horizontal" />
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left panel */}
          <div className="col-span-4 space-y-6">
            <StratumCard className="p-6">
              {/* File preview */}
              <div
                className="w-full aspect-video mb-4 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #E8732A)',
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <span style={{ fontFamily: 'Cinzel, serif', color: '#080A0F', fontSize: '14px' }}>
                  IMAGE PREVIEW
                </span>
              </div>

              <h3
                className="text-lg mb-2"
                style={{ fontFamily: 'Cinzel, serif', color: '#EDE8DC', fontWeight: 600 }}
              >
                photo_vacances.jpg
              </h3>

              <p
                className="text-xs mb-4"
                style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}
              >
                Format: JPEG • Taille: 3.4 Mo • Modifié: 15 mars 2024
              </p>

              <div
                className="mb-4 py-2"
                style={{ borderTop: '1px dotted rgba(201, 168, 76, 0.2)' }}
              >
                {Array.from({ length: 15 }).map((_, i) => (
                  <span
                    key={i}
                    className="inline-block mx-1"
                    style={{ color: 'rgba(201, 168, 76, 0.3)' }}
                  >
                    ·
                  </span>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <button
                  className="w-full px-4 py-3 transition-all hover:border-opacity-100"
                  style={{
                    border: '1.5px dashed rgba(201, 168, 76, 0.5)',
                    color: '#EDE8DC',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '2px',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Download className="inline-block w-4 h-4 mr-2" />
                  Télécharger l'original
                </button>
                <button
                  className="w-full px-4 py-3 transition-all hover:brightness-110 active:scale-95"
                  style={{
                    backgroundColor: modifiedIds.size > 0 ? '#C9A84C' : 'rgba(201, 168, 76, 0.2)',
                    color: modifiedIds.size > 0 ? '#080A0F' : '#7A7060',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '2px',
                    cursor: modifiedIds.size > 0 ? 'pointer' : 'not-allowed',
                  }}
                  disabled={modifiedIds.size === 0}
                >
                  <Download className="inline-block w-4 h-4 mr-2" />
                  Télécharger modifié
                </button>
              </div>

              {modifiedIds.size === 0 ? (
                <div
                  className="px-3 py-2 text-center text-xs"
                  style={{
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '2px',
                    backgroundColor: 'rgba(122, 112, 96, 0.15)',
                    color: '#7A7060',
                  }}
                >
                  [ AUCUNE MODIFICATION ]
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-2 text-center text-xs"
                  style={{
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '2px',
                    backgroundColor: 'rgba(232, 115, 42, 0.1)',
                    color: '#E8732A',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  [ {modifiedIds.size} FRAGMENTS MODIFIÉS ]
                </motion.div>
              )}
            </StratumCard>

            <StratumCard className="p-6">
              <h4
                className="text-xs mb-4"
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  letterSpacing: '4px',
                  color: '#C9A84C',
                }}
              >
                PROVENANCE
              </h4>
              <div className="space-y-2 text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#7A7060' }}>
                <div>Format détecté: <span style={{ color: '#EDE8DC' }}>JPEG / EXIF 2.31</span></div>
                <div>Parsé par: <span style={{ color: '#EDE8DC' }}>Go · ExifAdapter v1</span></div>
                <div>Analysé à: <span style={{ color: '#EDE8DC' }}>Aujourd'hui, 09h42</span></div>
              </div>
            </StratumCard>
          </div>

          {/* Right panel */}
          <div className="col-span-8">
            <StratumCard className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', color: '#EDE8DC' }}>
                    REGISTRE DES FRAGMENTS
                  </h2>
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      fontFamily: 'Bebas Neue, cursive',
                      letterSpacing: '2px',
                      backgroundColor: 'rgba(201, 168, 76, 0.15)',
                      color: '#C9A84C',
                    }}
                  >
                    {metadata.length} FRAGMENTS
                  </span>
                </div>

                <div className="flex gap-4">
                  {(['all', 'editable', 'readonly'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="relative px-2 py-1 transition-all"
                      style={{
                        fontFamily: 'Bebas Neue, cursive',
                        letterSpacing: '2px',
                        fontSize: '13px',
                        color: filter === f ? '#C9A84C' : '#7A7060',
                      }}
                    >
                      {f === 'all' ? 'TOUS' : f === 'editable' ? 'ÉDITABLES' : 'SCELLÉS'}
                      {filter === f && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-[2px]"
                          style={{
                            backgroundColor: '#C9A84C',
                            boxShadow: '0 0 8px rgba(201, 168, 76, 0.6)',
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search bar */}
              <div className="mb-6 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: '#C9A84C' }}
                />
                <input
                  type="text"
                  placeholder="Rechercher un fragment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3"
                  style={{
                    backgroundColor: '#141C2A',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    color: '#EDE8DC',
                  }}
                />
              </div>

              {/* Metadata table */}
              <div className="space-y-0">
                {filteredMetadata.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="relative group"
                    style={{
                      borderLeft: modifiedIds.has(field.id) ? '3px solid #C9A84C' : editingId === field.id ? '3px solid #C9A84C' : '3px solid transparent',
                      backgroundColor: editingId === field.id ? 'rgba(232, 115, 42, 0.05)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (editingId !== field.id) {
                        e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.04)';
                        e.currentTarget.style.borderLeftColor = 'rgba(201, 168, 76, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (editingId !== field.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderLeftColor = modifiedIds.has(field.id) ? '#C9A84C' : 'transparent';
                      }
                    }}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center py-4 px-4">
                      <div className="col-span-1">
                        {modifiedIds.has(field.id) && (
                          <div className="w-[6px] h-[6px] rounded-full inline-block mr-2" style={{ backgroundColor: '#E8732A' }} />
                        )}
                        <span
                          className="text-xs"
                          style={{ fontFamily: 'Cinzel, serif', color: '#C9A84C' }}
                        >
                          {field.id}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span
                          className="text-sm"
                          style={{ fontFamily: 'JetBrains Mono, monospace', color: '#EDE8DC' }}
                        >
                          {field.name}
                        </span>
                      </div>
                      <div className="col-span-4">
                        {editingId === field.id ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3 py-2 text-sm"
                            style={{
                              backgroundColor: '#141C2A',
                              border: '1px solid #C9A84C',
                              fontFamily: 'JetBrains Mono, monospace',
                              color: '#EDE8DC',
                            }}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="text-sm"
                            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#EDE8DC' }}
                          >
                            {field.value}
                          </span>
                        )}
                      </div>
                      <div className="col-span-2">
                        <TypeBadge type={field.type} />
                      </div>
                      <div className="col-span-2 flex justify-end gap-2">
                        {editingId === field.id ? (
                          <>
                            <button
                              onClick={() => handleSave(field.id)}
                              className="p-1 transition-all hover:scale-110"
                            >
                              <Check className="w-4 h-4" style={{ color: '#2AFC98' }} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 transition-all hover:scale-110"
                            >
                              <X className="w-4 h-4" style={{ color: '#C0392B' }} />
                            </button>
                          </>
                        ) : field.editable ? (
                          <button
                            onClick={() => handleEdit(field)}
                            className="p-1 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                          >
                            <Edit2 className="w-4 h-4" style={{ color: '#C9A84C' }} />
                          </button>
                        ) : (
                          <Lock className="w-4 h-4" style={{ color: '#7A7060' }} />
                        )}
                      </div>
                    </div>

                    {/* Row separator */}
                    <div className="px-4">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <span
                          key={i}
                          className="inline-block mx-1"
                          style={{ color: 'rgba(201, 168, 76, 0.15)', fontSize: '10px' }}
                        >
                          ·
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom action bar */}
              <div
                className="sticky bottom-0 flex justify-between items-center pt-6 mt-6"
                style={{ borderTop: '1px solid rgba(201, 168, 76, 0.2)' }}
              >
                <button
                  onClick={handleReset}
                  className="px-6 py-3 transition-all hover:bg-opacity-10"
                  style={{
                    border: '1.5px solid #C0392B',
                    color: '#C0392B',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '2px',
                    backgroundColor: 'transparent',
                  }}
                  disabled={modifiedIds.size === 0}
                >
                  RÉINITIALISER TOUT
                </button>
                <button
                  className="px-8 py-3 transition-all hover:brightness-110 active:scale-95 flex items-center gap-2"
                  style={{
                    backgroundColor: modifiedIds.size > 0 ? '#C9A84C' : 'rgba(201, 168, 76, 0.2)',
                    color: modifiedIds.size > 0 ? '#080A0F' : '#7A7060',
                    fontFamily: 'Bebas Neue, cursive',
                    letterSpacing: '3px',
                    cursor: modifiedIds.size > 0 ? 'pointer' : 'not-allowed',
                  }}
                  disabled={modifiedIds.size === 0}
                >
                  <span>🔒</span>
                  SCELLER LES MODIFICATIONS
                </button>
              </div>
            </StratumCard>
          </div>
        </div>
      </div>
    </div>
  );
}