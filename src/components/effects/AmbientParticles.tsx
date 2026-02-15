import { useEffect, useRef } from 'react';

interface AmbientParticlesProps {
  count?: number;
  color?: string;
  maxOpacity?: number;
  className?: string;
}

export function AmbientParticles({
  count = 50,
  color = '#C77DFF',
  maxOpacity = 0.4,
  className = '',
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const rect = canvas.parentElement?.getBoundingClientRect() ?? { width: 800, height: 600 };

    // Two layers: sharp foreground + blurred background for depth
    const particles = Array.from({ length: count }, (_, i) => {
      const isBackground = i < count * 0.4; // 40% background particles
      return {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        radius: isBackground ? Math.random() * 1.2 + 0.3 : Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * (isBackground ? 0.08 : 0.18),
        vy: (Math.random() - 0.5) * (isBackground ? 0.06 : 0.14),
        opacity: isBackground
          ? Math.random() * maxOpacity * 0.3 + maxOpacity * 0.1
          : Math.random() * maxOpacity * 0.7 + maxOpacity * 0.2,
        phase: Math.random() * Math.PI * 2,
        isBackground,
        glowRadius: isBackground ? 0 : Math.random() * 6 + 2,
      };
    });

    const draw = (time: number) => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const pulse = Math.sin(time * 0.0006 + p.phase) * 0.35 + 0.65;
        const alpha = p.opacity * pulse;

        // Soft glow for foreground particles
        if (p.glowRadius > 0) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count, color, maxOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
