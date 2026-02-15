import { useEffect, useState, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  Target,
  Lightbulb,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { fetchCareerIntelligence } from '@/lib/api';
import type { CareerIntelligenceRequest, CareerIntelligenceResponse } from '@/types/api';

interface CareerIntelligencePanelProps {
  request: CareerIntelligenceRequest;
  currencySymbol: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function formatSalary(value: number, symbol: string) {
  if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}K`;
  return `${symbol}${value.toFixed(0)}`;
}

const OUTLOOK_STYLES: Record<string, { bg: string; text: string; glow: string }> = {
  'Strong Market Signal': { bg: 'bg-[#4DD6C8]/10', text: 'text-[#4DD6C8]', glow: '#4DD6C8' },
  'Moderate Market Signal': { bg: 'bg-[#FF9F43]/10', text: 'text-[#FF9F43]', glow: '#FF9F43' },
  'Risk Market Signal': { bg: 'bg-[#FF7849]/10', text: 'text-[#FF7849]', glow: '#FF7849' },
};

function getOutlookStyle(outlook: string) {
  return OUTLOOK_STYLES[outlook] || OUTLOOK_STYLES['Moderate Market Signal'];
}

/** Animated number */
const CountUp = ({ value, decimals = 0 }: { value: number; decimals?: number }) => {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [value, decimals]);
  return <>{display}</>;
};

/** Animated progress bar */
const AnimatedBar = ({ value, delay, label }: { value: number; delay: number; label: string }) => {
  const pct = Math.round(value * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span className="font-semibold text-white"><CountUp value={pct} />%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.9, ease: EASE }}
          className="h-full rounded-full bg-gradient-to-r from-[#4C6FFF] to-[#4DD6C8]"
        />
      </div>
    </motion.div>
  );
};

export const CareerIntelligencePanel = ({ request, currencySymbol }: CareerIntelligencePanelProps) => {
  const [data, setData] = useState<CareerIntelligenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCareerIntelligence(request);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load career data');
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 mt-8 flex items-center justify-center gap-3 text-white/40"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading career intelligence...</span>
      </motion.div>
    );
  }

  if (error || !data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-6 mt-8 text-center"
      >
        <AlertTriangle className="mx-auto h-5 w-5 text-[#FF9F43] mb-2" />
        <p className="text-sm text-white/40">{error || 'Career data unavailable'}</p>
      </motion.div>
    );
  }

  const outlookStyle = getOutlookStyle(data.marketOutlook);
  const salaryMin = data.salaryBand.conservative;
  const salaryMax = data.salaryBand.optimistic;
  const salaryExpected = data.salaryBand.expected;
  const expectedPct = ((salaryExpected - salaryMin) / (salaryMax - salaryMin)) * 100;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="mt-12"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/40 mb-4">
          <Briefcase className="h-3.5 w-3.5" />
          Career Intelligence
        </div>
        <h2 className="text-2xl font-extrabold text-white md:text-3xl tracking-tight">
          Career <span className="text-gradient-mint">Outcome</span> Intelligence
        </h2>
        <p className="mt-2 text-sm text-white/40 max-w-md mx-auto">
          Data-driven insights into what your career could look like after this degree.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Market Outlook + Employment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.06] blur-[50px] pointer-events-none"
              style={{ background: outlookStyle.glow }}
            />

            {/* Market Outlook Badge */}
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-4 w-4 text-white/40" />
              <span className="text-sm font-medium text-white/60">Market Outlook</span>
              <div
                className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${outlookStyle.bg} ${outlookStyle.text}`}
                style={{ boxShadow: `0 0 20px ${outlookStyle.glow}15` }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: outlookStyle.glow }} />
                {data.marketOutlook}
              </div>
            </div>

            {/* Employment Probability */}
            <h3 className="text-sm font-semibold text-white/70 mb-4">Employment Probability</h3>
            <div className="space-y-3">
              <AnimatedBar value={data.employmentProbability['3_months']} delay={0.5} label="Within 3 months" />
              <AnimatedBar value={data.employmentProbability['6_months']} delay={0.6} label="Within 6 months" />
              <AnimatedBar value={data.employmentProbability['12_months']} delay={0.7} label="Within 12 months" />
            </div>
          </motion.div>

          {/* Salary Band */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-[#C77DFF] opacity-[0.05] blur-[50px] pointer-events-none" />

            <h3 className="text-sm font-semibold text-white/70 mb-5 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white/40" />
              Salary Confidence Band
            </h3>

            <div className="space-y-3">
              {/* Range labels */}
              <div className="flex justify-between text-xs text-white/40">
                <span>Conservative</span>
                <span>Optimistic</span>
              </div>

              {/* Range bar */}
              <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.7, duration: 1, ease: EASE }}
                  className="h-full rounded-full bg-gradient-to-r from-[#4C6FFF] via-[#4DD6C8] to-[#C77DFF]"
                />
                {/* Expected marker */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.4, ease: EASE }}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#4DD6C8] shadow-lg shadow-[#4DD6C8]/30"
                  style={{ left: `calc(${expectedPct}% - 8px)` }}
                />
              </div>

              {/* Values */}
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="text-lg font-bold text-white/70">{formatSalary(salaryMin, currencySymbol)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider text-[#4DD6C8] font-medium mb-0.5">Expected</div>
                  <div className="text-2xl font-extrabold text-gradient-mint">{formatSalary(salaryExpected, currencySymbol)}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white/70">{formatSalary(salaryMax, currencySymbol)}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Career Growth Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="absolute -top-8 right-4 w-24 h-24 rounded-full bg-[#4DD6C8] opacity-[0.04] blur-[40px] pointer-events-none" />

            <h3 className="text-sm font-semibold text-white/70 mb-6 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-white/40" />
              Career Growth Timeline
            </h3>

            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#4C6FFF] via-[#4DD6C8] to-[#C77DFF] opacity-40" />

              <div className="space-y-6">
                {data.careerPath.map((stage, i) => {
                  const colors = ['#4C6FFF', '#4DD6C8', '#C77DFF'];
                  const color = colors[i % colors.length];
                  return (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.15, duration: 0.5, ease: EASE }}
                      className="relative"
                    >
                      {/* Dot */}
                      <div
                        className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2"
                        style={{
                          borderColor: color,
                          background: `${color}30`,
                          boxShadow: `0 0 10px ${color}30`,
                        }}
                      />

                      <div className="glass-card p-4 hover:bg-white/[0.04] transition-colors duration-300">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-white">{stage.stage}</h4>
                          <span className="text-xs text-white/30 font-mono">{stage.years} yrs</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/40">{stage.roleFocus}</span>
                          <span className="text-sm font-bold" style={{ color }}>
                            {formatSalary(stage.avgSalary, currencySymbol)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Insight Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6, ease: EASE }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4DD6C8]/[0.03] to-transparent pointer-events-none" />
            <div className="relative z-10 flex gap-3">
              <div className="shrink-0 mt-0.5">
                <div className="rounded-xl p-2 bg-[#4DD6C8]/10">
                  <Lightbulb className="h-4 w-4 text-[#4DD6C8]" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Key Insight</h3>
                <p className="text-sm text-white/50 leading-relaxed">{data.insight}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
