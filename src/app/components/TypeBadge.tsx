type BadgeType = 'string' | 'date' | 'gps' | 'integer' | 'boolean' | 'readonly' | 'editable';

interface TypeBadgeProps {
  type: BadgeType;
}

const badgeConfig = {
  string: {
    label: 'TEXTE',
    bg: 'rgba(201, 168, 76, 0.1)',
    color: '#C9A84C',
    prefix: 'ꓤ',
  },
  date: {
    label: 'ÉPOQUE',
    bg: 'rgba(232, 115, 42, 0.1)',
    color: '#E8732A',
    prefix: '☽',
  },
  gps: {
    label: 'COORD.',
    bg: 'rgba(42, 252, 152, 0.1)',
    color: '#2AFC98',
    prefix: '⊕',
  },
  integer: {
    label: 'MESURE',
    bg: 'rgba(237, 232, 220, 0.1)',
    color: '#EDE8DC',
    prefix: '#',
  },
  boolean: {
    label: 'ÉTAT',
    bg: 'rgba(160, 82, 200, 0.1)',
    color: '#A052C8',
    prefix: '◈',
  },
  readonly: {
    label: 'SCELLÉ',
    bg: 'rgba(122, 112, 96, 0.15)',
    color: '#7A7060',
    prefix: '🔒',
  },
  editable: {
    label: 'OUVERT',
    bg: 'rgba(232, 115, 42, 0.1)',
    color: '#E8732A',
    prefix: '🔓',
  },
};

export function TypeBadge({ type }: TypeBadgeProps) {
  const config = badgeConfig[type];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
      style={{
        fontFamily: 'Bebas Neue, cursive',
        letterSpacing: '2px',
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      <span>{config.prefix}</span>
      <span>{config.label}</span>
    </span>
  );
}
