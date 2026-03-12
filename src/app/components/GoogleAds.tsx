import { useEffect, useRef } from 'react';

interface GoogleAdsProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
}

export function GoogleAds({ slot, format = 'auto', className = '' }: GoogleAdsProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('Ad loading error:', err);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Ad container with archaeological styling */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: '#0E1219',
          border: '1px solid rgba(201, 168, 76, 0.15)',
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}
      >
        {/* "Sponsored Excavation" label */}
        <div
          className="absolute top-2 right-2 px-2 py-1 text-xs z-10"
          style={{
            fontFamily: 'Bebas Neue, cursive',
            letterSpacing: '2px',
            backgroundColor: 'rgba(122, 112, 96, 0.2)',
            color: '#7A7060',
            fontSize: '9px',
          }}
        >
          SPONSORED EXCAVATION
        </div>

        {/* Placeholder for Google Ad */}
        <div ref={adRef} className="min-h-[250px] flex items-center justify-center p-4">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXX"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
          
          {/* Fallback placeholder */}
          <div className="text-center">
            <div
              className="text-xs mb-2"
              style={{
                fontFamily: 'Bebas Neue, cursive',
                letterSpacing: '3px',
                color: '#7A7060',
              }}
            >
              Advertisement Space
            </div>
            <div
              className="text-xs"
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                color: '#7A7060',
                opacity: 0.5,
              }}
            >
              Google AdSense
            </div>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div
          className="absolute top-0 left-0 w-8 h-8 border-t border-l"
          style={{ borderColor: 'rgba(201, 168, 76, 0.1)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-8 h-8 border-b border-r"
          style={{ borderColor: 'rgba(201, 168, 76, 0.1)' }}
        />
      </div>
    </div>
  );
}
