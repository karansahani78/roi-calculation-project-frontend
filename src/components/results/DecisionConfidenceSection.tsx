import { useEffect, useState, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Loader2, Brain } from 'lucide-react';
import { fetchDecisionConfidence } from '@/lib/api';
import type { RoiCalculationRequest, DecisionConfidenceResponse } from '@/types/api';

interface Props {
  baseRequest: RoiCalculationRequest;
}

const LEVEL_STYLE = {
  High: { bg: 'bg-[#4DD6C8]/12', text: 'text-[#4DD6C8]', border: 'border-[#4DD6C8]/20' },
  Moderate: { bg: 'bg-[#FF9F43]/12', text: 'text-[#FF9F43]', border: 'border-[#FF9F43]/20' },
  Low: { bg: 'bg-[#E89CA9]/12', text: 'text-[#E89CA9]', border: 'border-[#E89CA9]/20' },
} as const;

/** Animated arc gauge with gradient stroke */
const ArcGauge = ({ score }: { score: number }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const ctrl = animate(0, score, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAnimated(v),
    });
    return () => ctrl.stop();
  }, [score]);

  // Arc from 225° to -45° (270° sweep)
  const radius = 80;
  const cx = 100;
  const cy = 100;
  const startAngle = 225;
  const totalSweep = 270;
  const sweepAngle = (animated / 100) * totalSweep;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcEnd = startAngle - sweepAngle;

  const x1 = cx + radius * Math.cos(toRad(startAngle));
  const y1 = cy - radius * Math.sin(toRad(startAngle));
  const x2 = cx + radius * Math.cos(toRad(arcEnd));
  const y2 = cy - radius * Math.sin(toRad(arcEnd));

  const largeArc = sweepAngle > 180 ? 1 : 0;

  // Track path (full arc background)
  const trackEnd = startAngle - totalSweep;
  const tx2 = cx + radius * Math.cos(toRad(trackEnd));
  const ty2 = cy - radius * Math.sin(toRad(trackEnd));

  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4DD6C8" />
            <stop offset="50%" stopColor="#C77DFF" />
            <stop offset="100%" stopColor="#E89CA9" />
          </linearGradient>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 1 0 ${tx2} ${ty2}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Value arc */}
        {animated > 0.5 && (
          <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`}
            fill="none"
            stroke="url(#gauge-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#gauge-glow)"
          />
        )}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-5xl font-extrabold text-white tracking-tight">
          {Math.round(animated)}
        </span>
        <span className="text-xs text-white/30 font-medium tracking-wider mt-1">/ 100</span>
      </div>
    </div>
  );
};

export const DecisionConfidenceSection = ({ baseRequest }: Props) => {
  const [data, setData] = useState<DecisionConfidenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDecisionConfidence(baseRequest);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load confidence data');
    } finally {
      setLoading(false);
    }
  }, [baseRequest]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-white/20" />
        <span className="ml-3 text-sm text-white/30">Analyzing confidence…</span>
      </div>
    );
  }

  if (error || !data) return null;

  const level = LEVEL_STYLE[data.confidenceLevel];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 mb-14"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/40 mb-4">
          <Brain className="h-3.5 w-3.5" />
          Decision Intelligence
        </div>
        <h2 className="text-2xl font-extrabold text-white md:text-3xl tracking-tight">
          Decision <span className="text-gradient-purple">Confidence Score™</span>
        </h2>
        <p className="mt-2 text-sm text-white/40 max-w-md mx-auto">
          How strong is this education decision?
        </p>
      </motion.div>

      {/* Main glass card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3, boxShadow: '0 12px 48px rgba(199, 125, 255, 0.08)' }}
        className="glass-card p-8 md:p-10 relative overflow-hidden transition-all duration-300"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full bg-[#C77DFF] opacity-[0.04] blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid gap-10 md:grid-cols-2 items-center">
          {/* Left: gauge + badge */}
          <div className="flex flex-col items-center">
            <ArcGauge score={data.confidenceScore} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold ${level.bg} ${level.text} ${level.border}`}
            >
              {data.confidenceLevel} Confidence
            </motion.div>
          </div>

          {/* Right: positives, risks, summary */}
          <div className="space-y-6">
            {/* Positives */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Strengths</h4>
              <ul className="space-y-2.5">
                {data.positives.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#4DD6C8] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/70 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Considerations</h4>
              <ul className="space-y-2.5">
                {data.risks.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-2.5"
                  >
                    <AlertTriangle className="h-4 w-4 text-[#FF9F43] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/50 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="border-t border-white/[0.06] pt-5"
            >
              <p className="text-sm text-white/60 leading-relaxed">
                {data.summary}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};
