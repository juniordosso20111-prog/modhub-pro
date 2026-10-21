import React, { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Vanilla (Sans Mod)',
  afterLabel = 'Avec Mod (Ultra HD / ReShade)',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    let position = (x / width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-xl border border-slate-700/80 shadow-2xl group cursor-ew-resize ${className}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background) */}
      <img
        src={afterUrl}
        alt={afterLabel}
        className="w-full h-full object-cover pointer-events-none block"
      />

      {/* Before Image (Clipped Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeUrl}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
          }}
        />
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-neon-cyan shadow-[0_0_12px_#00f0ff] pointer-events-none"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-dark-900 border-2 border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.7)] flex items-center justify-center text-neon-cyan pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
          <SlidersHorizontal className="w-4 h-4 rotate-90" />
        </div>
      </div>

      {/* Badges / Labels */}
      <div className="absolute top-4 left-4 pointer-events-none z-10">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-dark-950/80 text-slate-300 border border-slate-700 backdrop-blur-md shadow-lg">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none z-10">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md bg-cyan-950/80 text-neon-cyan border border-neon-cyan/40 backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.3)]">
          {afterLabel}
        </span>
      </div>

      {/* Hint footer */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 opacity-75 group-hover:opacity-100 transition-opacity">
        <span className="px-3 py-1 text-[11px] font-mono tracking-wide rounded-full bg-dark-950/70 border border-slate-800 text-slate-300 backdrop-blur-md">
          Glissez pour comparer l'effet graphique
        </span>
      </div>
    </div>
  );
};

