import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const glyphs = ['ꓤ', 'ꔀ', '꒐', 'ꓷ', '꒲', 'ꓶ', 'ꔆ', '⊕', '☽', '◈'];

type GlyphPosition = {
  glyph: string;
  x: number;
  y: number;
  size: number;
  speed: number;
};

function GlyphItem({
  pos,
  index,
  scrollY,
}: {
  pos: GlyphPosition;
  index: number;
  scrollY: ReturnType<typeof useScroll>['scrollY'];
}) {
  const y = useTransform(scrollY, [0, 1000], [0, pos.speed * 200]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        fontSize: `${pos.size}px`,
        color: '#C9A84C',
        opacity: 0.03,
        y,
      }}
      animate={{
        rotate: [0, 360],
        opacity: [0.02, 0.05, 0.02],
      }}
      transition={{
        rotate: { duration: 20 + index * 2, repeat: Infinity, ease: 'linear' },
        opacity: { duration: 5 + index * 0.5, repeat: Infinity },
      }}
    >
      {pos.glyph}
    </motion.div>
  );
}

export function ParallaxGlyphs() {
  const { scrollY } = useScroll();
  const [glyphPositions, setGlyphPositions] = useState<GlyphPosition[]>([]);

  useEffect(() => {
    const positions = Array.from({ length: 20 }, () => ({
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 60,
      speed: 0.1 + Math.random() * 0.3,
    }));
    setGlyphPositions(positions);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {glyphPositions.map((pos, index) => (
        <GlyphItem key={index} pos={pos} index={index} scrollY={scrollY} />
      ))}
    </div>
  );
}
