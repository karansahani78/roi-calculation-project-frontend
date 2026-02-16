import { useEffect, useState, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Loader2, Brain, ChevronDown, Share2 } from 'lucide-react';
import { fetchDecisionConfidence } from '@/lib/api';
import type { RoiCalculationRequest, DecisionConfidenceResponse } from '@/types/api';
import { AdSlot } from '@/components/ads/AdSlot';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Props {
  baseRequest: RoiCalculationRequest;
}

const LEVEL_STYLE = {
  VeryHigh: { label: 'Very High Confidence', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', emoji: '🚀' },
  High:     { label: 'High Confidence',      bg: 'bg-green-500/10',   text: 'text-green-400',   border: 'border-green-500/20',   emoji: '✅' },
  Moderate: { label: 'Moderate Confidence',   bg: 'bg-yellow-500/10',  text: 'text-yellow-400',  border: 'border-yellow-500/20',  emoji: '⚠️' },
  Low:      { label: 'Low Confidence',        bg: 'bg-orange-500/10',  text: 'text-orange-400',  border: 'border-orange-500/20',  emoji: '❗' },
  VeryLow:  { label: 'Very Low Confidence',   bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20',     emoji: '⛔' },
} as const;

/** Animated arc gauge with gradient stroke */
const ArcGauge = ({ score, levelText }: { score: number; levelText: string }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const ctrl = animate(0, score, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAnimated(v),
    });
    return () => ctrl.stop();
  }, [score]);

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
        <path
          d={`M ${x1} ${y1} A ${radius} ${radius} 0 1 0 ${tx2} ${ty2}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
          strokeLinecap="round"
        />
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
  const { toast } = useToast();

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

  const levelStyle = LEVEL_STYLE[data.confidenceLevel] ?? LEVEL_STYLE.Moderate;

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full bg-[#C77DFF] opacity-[0.04] blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid gap-10 md:grid-cols-2 items-center">
          {/* Left: gauge + badge */}
          <div className="flex flex-col items-center">
            <ArcGauge score={data.confidenceScore} levelText={levelStyle.text} />

            {/* Confidence badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className={`mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}
            >
              <span className="text-lg">{levelStyle.emoji}</span>
              {levelStyle.label}
            </motion.div>

            {/* Ad after gauge */}
            <AdSlot slot="in-content" className="mt-6 w-full max-w-xs" />
          </div>

          {/* Right: positives, risks, summary */}
          <div className="space-y-6">
            {/* Positives */}
            {data.positives.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">✅ Strengths</h4>
                <ul className="space-y-2.5">
                  {data.positives.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/70 leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ad between positives and risks */}
            <AdSlot slot="in-content" className="w-full" />

            {/* Risks */}
            {data.risks.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">⚠️ Considerations</h4>
                <ul className="space-y-2.5">
                  {data.risks.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-start gap-2.5"
                    >
                      <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/50 leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

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

            {/* Ad after summary */}
            <AdSlot slot="below-results" className="w-full" />
          </div>
        </div>
      </motion.div>

      {/* Engagement hooks */}
      <div className="mt-6 space-y-4">
        {/* Expandable explanation */}
        <Collapsible>
          <CollapsibleTrigger className="glass-card w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-white/60 hover:text-white/80 transition-colors">
            <span>Why this confidence score?</span>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="glass-card mt-1 px-6 py-4">
            <p className="text-sm text-white/50 leading-relaxed">
              Your Decision Confidence Score is calculated by our backend engine based on multiple factors including ROI strength, market demand for your major, cost-to-earnings ratio, and regional economic indicators. A score of <strong className="text-white/70">{data.confidenceScore}/100</strong> with <strong className={levelStyle.text}>{levelStyle.label}</strong> means the data supports this education investment at that level.
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Share & comparison CTAs */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06]"
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url).then(() => {
                toast({ title: 'Link copied!', description: 'Share your decision confidence score with others.' });
              });
            }}
          >
            <Share2 className="h-4 w-4" />
            Share your decision score
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06]"
            onClick={() => window.open('/compare', '_self')}
          >
            📊 See how others scored with similar choices
          </Button>
        </div>
      </div>
    </motion.section>
  );
};
