import { useEffect, useState } from 'react';

export function GlobalTextures() {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate 50 random gold dust particles
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 14,
      duration: 8 + Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {/* Layer 1: Topographic contour lines */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.04 }}
      >
        <defs>
          <pattern id="topo" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path
              d="M 0 100 Q 50 80, 100 100 T 200 100"
              stroke="#C9A84C"
              fill="none"
              strokeWidth="1"
            />
            <path
              d="M 0 130 Q 50 110, 100 130 T 200 130"
              stroke="#C9A84C"
              fill="none"
              strokeWidth="0.5"
            />
            <path
              d="M 0 70 Q 50 50, 100 70 T 200 70"
              stroke="#C9A84C"
              fill="none"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo)" />
      </svg>

      {/* Layer 2: Film grain overlay */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          animation: 'filmGrain 8s steps(10) infinite',
        }}
      />

      {/* Layer 3: Sonar scan line */}
      <div
        className="fixed left-0 right-0 h-[1px] bg-[#2AFC98] pointer-events-none z-0"
        style={{
          opacity: 0.02,
          animation: 'sonarSweep 8s linear infinite',
        }}
      />

      {/* Layer 4: Ancient glyph watermarks */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.02 }}>
        <div className="absolute top-[15%] left-[10%] text-6xl" style={{ color: '#C9A84C' }}>ꓤ</div>
        <div className="absolute top-[25%] right-[15%] text-5xl" style={{ color: '#C9A84C' }}>ꔀ</div>
        <div className="absolute top-[45%] left-[20%] text-7xl" style={{ color: '#C9A84C' }}>꒐</div>
        <div className="absolute top-[65%] right-[25%] text-6xl" style={{ color: '#C9A84C' }}>ꓷ</div>
        <div className="absolute bottom-[20%] left-[30%] text-5xl" style={{ color: '#C9A84C' }}>꒲</div>
        <div className="absolute bottom-[35%] right-[12%] text-7xl" style={{ color: '#C9A84C' }}>ꓶ</div>
        <div className="absolute top-[55%] left-[75%] text-6xl" style={{ color: '#C9A84C' }}>ꔆ</div>
        <div className="absolute top-[80%] left-[50%] text-5xl" style={{ color: '#C9A84C' }}>ꓤ</div>
      </div>

      {/* Layer 5: Gold dust particles */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute w-[2px] h-[2px] rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: '#C9A84C',
              animation: `goldTwinkle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
