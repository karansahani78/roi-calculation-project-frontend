import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Clock, DollarSign, Briefcase, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';
import { fetchDegreeWorthIt } from '@/lib/api';
import type { DegreeWorthItResponse } from '@/types/api';
import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

/* ── Verdict styling ── */
const VERDICT_STYLE = {
  'Worth It':     { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', emoji: '🟢' },
  'Depends':      { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   emoji: '🟡' },
  'Not Worth It': { bg: 'bg-red-500/15',      text: 'text-red-400',     border: 'border-red-500/30',     emoji: '🔴' },
} as const;

const getVerdictStyle = (verdict?: string) => {
  if (verdict && verdict in VERDICT_STYLE) return VERDICT_STYLE[verdict as keyof typeof VERDICT_STYLE];
  return VERDICT_STYLE['Depends'];
};

/* ── Confidence level styling ── */
const CONFIDENCE_STYLE: Record<string, { color: string; trackColor: string; label: string }> = {
  VeryHigh: { color: '#34d399', trackColor: 'rgba(52,211,153,0.15)', label: 'Very High' },
  High:     { color: '#4ade80', trackColor: 'rgba(74,222,128,0.15)', label: 'High' },
  Moderate: { color: '#fbbf24', trackColor: 'rgba(251,191,36,0.15)', label: 'Moderate' },
  Low:      { color: '#fb923c', trackColor: 'rgba(251,146,60,0.15)', label: 'Low' },
  VeryLow:  { color: '#f87171', trackColor: 'rgba(248,113,113,0.15)', label: 'Very Low' },
};

const getConfidenceStyle = (level?: string) => {
  if (level && level in CONFIDENCE_STYLE) return CONFIDENCE_STYLE[level];
  return CONFIDENCE_STYLE['Moderate'];
};

/* ── Count-up hook ── */
const useCountUp = (target: number, decimals = 0, duration = 1.4) => {
  const [val, setVal] = useState('0');
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [target, decimals, duration]);
  return val;
};

/* ── Confidence Gauge ── */
const ConfidenceGauge = ({ score, level }: { score: number; level?: string }) => {
  const style = getConfidenceStyle(level);
  const circumference = 2 * Math.PI * 54;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 300);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={style.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-white">{score}</span>
        <span className="text-xs font-medium text-white/40">{style.label}</span>
      </div>
    </div>
  );
};

/* ── Section wrapper ── */
const Section = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ── ROI Card ── */
const RoiCard = ({ label, value, variant }: { label: string; value: number; variant: 'conservative' | 'expected' | 'optimistic' }) => {
  const display = useCountUp(value, 1);
  const isMain = variant === 'expected';
  const gradients = {
    conservative: 'from-orange-500/10 to-transparent border-orange-500/20',
    expected: 'from-emerald-500/15 to-transparent border-emerald-500/30',
    optimistic: 'from-blue-500/10 to-transparent border-blue-500/20',
  };
  const textColors = {
    conservative: 'text-orange-400',
    expected: 'text-emerald-400',
    optimistic: 'text-blue-400',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass-card p-6 bg-gradient-to-b ${gradients[variant]} transition-all duration-300 ${isMain ? 'ring-1 ring-emerald-500/30 scale-[1.03]' : ''}`}
    >
      {isMain && (
        <span className="mb-2 inline-block rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400">
          Most Likely
        </span>
      )}
      <p className="text-sm font-medium text-white/50">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold tracking-tight ${textColors[variant]}`}>
        {display}%
      </p>
    </motion.div>
  );
};

/* ── Main Page ── */
const DegreeWorthIt = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['degree-worth-it'],
    queryFn: fetchDegreeWorthIt,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Unable to Load Insights</h1>
        <p className="text-muted-foreground">Please try again later.</p>
        <Link to="/"><Button variant="outline">Go Home</Button></Link>
      </div>
    );
  }

  const verdictStyle = getVerdictStyle(data.verdict);
  const salaryDisplay = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(data.expectedSalary);

  return (
    <>
      <Helmet>
        <title>{data.pageTitle}</title>
        <meta name="description" content={data.metaDescription} />
        {data.canonicalUrl && <link rel="canonical" href={data.canonicalUrl} />}
      </Helmet>

      <div className="results-dark-bg min-h-screen">
        {/* ─── 1. HERO ─── */}
        <section className="relative overflow-hidden">
          {/* Ambient orbs */}
          <div className="ambient-orb w-[500px] h-[500px] bg-emerald-500 -top-40 -right-40" />
          <div className="ambient-orb w-[400px] h-[400px] bg-primary -bottom-40 -left-40" />

          <div className="container relative py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="text-4xl font-extrabold leading-tight text-gradient-hero md:text-5xl lg:text-6xl">
                {data.pageTitle}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                {data.metaDescription}
              </p>

              {/* Verdict + Confidence */}
              <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-12">
                {/* Verdict Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className={`inline-flex items-center gap-3 rounded-2xl border px-6 py-3 text-lg font-bold ${verdictStyle.bg} ${verdictStyle.text} ${verdictStyle.border}`}
                >
                  <span className="text-2xl">{verdictStyle.emoji}</span>
                  {data.verdict}
                </motion.div>

                {/* Confidence Gauge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                  <ConfidenceGauge score={data.confidenceScore} level={data.confidenceLevel} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <AdSlot slot="in-content" className="container mt-4" />

        {/* ─── 2. ROI SCENARIOS ─── */}
        <section className="container py-16">
          <Section>
            <h2 className="mb-8 text-center text-2xl font-bold text-gradient-hero md:text-3xl">
              ROI Scenario <span className="text-gradient-accent">Comparison</span>
            </h2>
            <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
              <RoiCard label="Conservative" value={data.conservativeRoi} variant="conservative" />
              <RoiCard label="Expected" value={data.expectedRoi} variant="expected" />
              <RoiCard label="Optimistic" value={data.optimisticRoi} variant="optimistic" />
            </div>
          </Section>
        </section>

        {/* ─── 3. BREAK-EVEN & SALARY ─── */}
        <section className="container pb-16">
          <Section delay={0.1}>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {/* Break-even */}
              <div className="glass-card glass-card-hover p-6">
                <div className="flex items-center gap-3">
                  <div className="gradient-purple inline-flex rounded-xl p-2.5">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/40">Break-Even Timeline</p>
                    <p className="text-3xl font-extrabold text-gradient-purple">{data.breakEvenYears} <span className="text-lg font-semibold text-white/50">years</span></p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-white/40">Time to recover your full education investment</p>
              </div>

              {/* Salary */}
              <div className="glass-card glass-card-hover p-6">
                <div className="flex items-center gap-3">
                  <div className="gradient-mint inline-flex rounded-xl p-2.5">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/40">Expected Salary</p>
                    <p className="text-3xl font-extrabold text-gradient-mint">{salaryDisplay}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-white/40">Projected annual earnings post-graduation</p>
              </div>
            </div>
          </Section>
        </section>

        <AdSlot slot="in-content" className="container mb-8" />

        {/* ─── 4. CAREER & MARKET INTELLIGENCE ─── */}
        <section className="container pb-16">
          <Section delay={0.15}>
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-gradient-hero md:text-3xl">
                Career & Market <span className="text-gradient-accent">Intelligence</span>
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="gradient-blue inline-flex rounded-xl p-2.5">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white">Market Outlook</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/60">{data.marketOutlook}</p>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="gradient-orange inline-flex rounded-xl p-2.5">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-white">Employment Summary</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/60">{data.employmentSummary}</p>
                </div>
              </div>
            </div>
          </Section>
        </section>

        {/* ─── 5. KEY INSIGHTS ─── */}
        {data.keyInsights && data.keyInsights.length > 0 && (
          <section className="container pb-16">
            <Section delay={0.2}>
              <div className="mx-auto max-w-3xl">
                <h2 className="mb-8 text-center text-2xl font-bold text-gradient-hero md:text-3xl">
                  Key <span className="text-gradient-accent">Insights</span>
                </h2>
                <ul className="space-y-4">
                  {data.keyInsights.map((insight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="flex items-start gap-3 glass-subtle p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                      <span className="text-sm leading-relaxed text-white/70">{insight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Section>
          </section>
        )}

        <AdSlot slot="below-results" className="container mb-8" />

        {/* ─── 6. FINAL CONCLUSION ─── */}
        <section className="container pb-20">
          <Section delay={0.25}>
            <div className="mx-auto max-w-3xl glass-card p-8 md:p-12 text-center glow-mint">
              <TrendingUp className="mx-auto mb-4 h-8 w-8 text-emerald-400" />
              <h2 className="mb-4 text-2xl font-bold text-gradient-hero md:text-3xl">Our Conclusion</h2>
              <p className="text-lg leading-relaxed text-white/70">{data.finalConclusion}</p>

              <Link to="/calculator">
                <Button
                  size="lg"
                  className="mt-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-hero px-8 text-base font-semibold"
                >
                  Calculate Your ROI <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Section>
        </section>
      </div>
    </>
  );
};

export default DegreeWorthIt;
