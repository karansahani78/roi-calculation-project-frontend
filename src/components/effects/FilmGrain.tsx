import { useEffect, useRef } from 'react';

interface FilmGrainProps {
  opacity?: number;
  className?: string;
}

export function FilmGrain({ opacity = 0.03, className = '' }: FilmGrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Small fixed resolution for performance, CSS stretches it
    canvas.width = 256;
    canvas.height = 256;

    let frame = 0;
    const interval = setInterval(() => {
      const imageData = ctx.createImageData(256, 256);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      frame++;
    }, 100); // ~10fps is enough for grain

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-[1] h-full w-full ${className}`}
      style={{ opacity, mixBlendMode: 'overlay' }}
      aria-hidden="true"
    />
  );
}
