import { useEffect, useState, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  Target,
  Lightbulb,
  Loader2,
  AlertTriangle,
  Zap,
  Shield,
  Rocket,
  Clock,
  DollarSign,
  Award,
} from 'lucide-react';
import { fetchCareerIntelligence } from '@/lib/api';
import type { CareerIntelligenceRequest, CareerIntelligenceResponse, CareerPathStage } from '@/types/api';

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

/* ---------- Outlook risk mapping ---------- */
function getOutlookConfig(outlook: string) {
  const lower = outlook.toLowerCase();
  if (lower.includes('strong') || lower.includes('low risk'))
    return { gradient: 'from-[#4DD6C8] to-[#2EC4B6]', glow: '#4DD6C8', text: 'text-[#4DD6C8]', label: outlook };
  if (lower.includes('risk') || lower.includes('weak'))
    return { gradient: 'from-[#FF6B6B] to-[#EE5A5A]', glow: '#FF6B6B', text: 'text-[#FF6B6B]', label: outlook };
  return { gradient: 'from-[#FFB347] to-[#FF9F43]', glow: '#FF9F43', text: 'text-[#FF9F43]', label: outlook };
}

/* ---------- Animated count-up ---------- */
const CountUp = ({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) => {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [value, decimals]);
  return <>{prefix}{display}{suffix}</>;
};

/* ---------- Employment bar ---------- */
const EmploymentBar = ({ value, delay, label }: { value: number; delay: number; label: string }) => {
  const pct = Math.round(value * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-white/30" />
          <span className="text-sm text-white/50 font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold text-white tabular-nums">
          <CountUp value={pct} />%
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.15, duration: 1, ease: EASE }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, rgba(76,111,255,0.8) 0%, rgba(77,214,200,0.9) 100%)`,
          }}
        >
          <div className="absolute inset-0 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ---------- Salary Card ---------- */
const SalaryCard = ({
  label, value, symbol, variant, delay,
}: {
  label: string; value: number; symbol: string; variant: 'conservative' | 'expected' | 'optimistic'; delay: number;
}) => {
  const config = {
    conservative: { icon: Shield, color: '#4C6FFF', gradientBg: 'from-[#4C6FFF]/[0.08] to-transparent', borderColor: 'border-[#4C6FFF]/20' },
    expected: { icon: Target, color: '#4DD6C8', gradientBg: 'from-[#4DD6C8]/[0.12] to-transparent', borderColor: 'border-[#4DD6C8]/30' },
    optimistic: { icon: Rocket, color: '#C77DFF', gradientBg: 'from-[#C77DFF]/[0.08] to-transparent', borderColor: 'border-[#C77DFF]/20' },
  }[variant];

  const Icon = config.icon;
  const isExpected = variant === 'expected';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      whileHover={{ y: -3, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border ${config.borderColor} bg-gradient-to-b ${config.gradientBg} p-5 transition-all duration-300 ${isExpected ? 'ring-1 ring-[#4DD6C8]/20' : ''}`}
      style={isExpected ? { boxShadow: `0 0 40px ${config.color}15, 0 8px 32px rgba(0,0,0,0.3)` } : { boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
    >
      {/* Ambient glow */}
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-20 blur-[35px] pointer-events-none" style={{ background: config.color }} />

      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-lg p-1.5" style={{ background: `${config.color}15` }}>
          <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
        </div>
        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-2xl font-extrabold tracking-tight ${isExpected ? 'text-gradient-mint' : 'text-white/80'}`}>
        <CountUp value={value} prefix={symbol} />
      </div>
      {isExpected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
          className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#4DD6C8]/10 px-2 py-0.5 text-[10px] font-semibold text-[#4DD6C8] uppercase tracking-wider"
        >
          <Zap className="h-2.5 w-2.5" /> Most Likely
        </motion.div>
      )}
    </motion.div>
  );
};

/* ---------- Timeline Node ---------- */
const TimelineNode = ({
  stage, index, total, symbol, delay,
}: {
  stage: CareerPathStage; index: number; total: number; symbol: string; delay: number;
}) => {
  const colors = ['#4C6FFF', '#4DD6C8', '#C77DFF'];
  const icons = [Briefcase, TrendingUp, Award];
  const color = colors[index % colors.length];
  const Icon = icons[index % icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.55, ease: EASE }}
      className="relative pl-10"
    >
      {/* Connector line */}
      {index < total - 1 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ delay: delay + 0.1, duration: 0.6, ease: EASE }}
          className="absolute left-[15px] top-8 w-px bottom-0"
          style={{ background: `linear-gradient(180deg, ${color}40 0%, ${colors[(index + 1) % colors.length]}20 100%)` }}
        />
      )}

      {/* Node circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.05, duration: 0.4, ease: EASE }}
        className="absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: `${color}15`,
          border: `2px solid ${color}40`,
          boxShadow: `0 0 16px ${color}20`,
        }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </motion.div>

      {/* Card */}
      <div className="glass-subtle p-4 hover:bg-white/[0.04] transition-colors duration-300 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-sm font-bold text-white">{stage.stage}</h4>
          <span className="text-xs text-white/30 font-mono bg-white/[0.04] px-2 py-0.5 rounded-full">{stage.years} yrs</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">{stage.roleFocus}</span>
          <span className="text-sm font-extrabold" style={{ color }}>
            {formatSalary(stage.avgSalary, symbol)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ========== Main Component ========== */
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

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-10 mt-10 flex items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-[#C77DFF]" />
        <span className="text-sm text-white/40">Analyzing career intelligence...</span>
      </motion.div>
    );
  }

  if (error || !data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 mt-10 text-center">
        <AlertTriangle className="mx-auto h-5 w-5 text-[#FF9F43] mb-2" />
        <p className="text-sm text-white/40">{error || 'Career data unavailable'}</p>
      </motion.div>
    );
  }

  const outlook = getOutlookConfig(data.marketOutlook);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.8 }}
      className="mt-14 relative"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/40 mb-4">
          <Briefcase className="h-3.5 w-3.5" />
          Career Intelligence
        </div>
        <h2 className="text-3xl font-extrabold text-white md:text-4xl tracking-tight">
          Career <span className="text-gradient-mint">Outcome</span> Intelligence
        </h2>
        <p className="mt-3 text-sm text-white/35 max-w-lg mx-auto leading-relaxed">
          Data-driven projections for your post-degree career trajectory.
        </p>
      </motion.div>

      {/* 1️⃣ Market Outlook Badge (Full Width) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
        className="flex justify-center mb-8"
      >
        <div
          className={`inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r ${outlook.gradient} px-5 py-2.5 text-sm font-bold text-white shadow-lg`}
          style={{ boxShadow: `0 0 30px ${outlook.glow}25, 0 4px 16px rgba(0,0,0,0.3)` }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full bg-white/80"
          />
          {outlook.label}
        </div>
      </motion.div>

      {/* 2️⃣ Executive Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
        className="glass-card p-8 mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#4DD6C8]/[0.04] via-transparent to-[#C77DFF]/[0.03] pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#4DD6C8] opacity-[0.04] blur-[60px] pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="shrink-0">
            <div className="rounded-2xl p-3 bg-gradient-to-br from-[#4DD6C8]/15 to-[#4DD6C8]/5 border border-[#4DD6C8]/10">
              <Lightbulb className="h-5 w-5 text-[#4DD6C8]" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#4DD6C8]/70 uppercase tracking-widest mb-2">Executive Insight</h3>
            <p className="text-lg text-white/70 leading-relaxed font-medium">{data.insight}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* 3️⃣ Employment Probability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-[#4C6FFF] opacity-[0.04] blur-[50px] pointer-events-none" />
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Target className="h-4 w-4 text-white/30" />
              Employment Probability
            </h3>
            <div className="space-y-4">
              <EmploymentBar value={data.employmentProbability['3_months']} delay={0.6} label="Within 3 months" />
              <EmploymentBar value={data.employmentProbability['6_months']} delay={0.7} label="Within 6 months" />
              <EmploymentBar value={data.employmentProbability['12_months']} delay={0.8} label="Within 12 months" />
            </div>
          </motion.div>

          {/* 4️⃣ Salary Confidence Band */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease: EASE }}
          >
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2 px-1">
              <DollarSign className="h-4 w-4 text-white/30" />
              Salary Confidence Band
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <SalaryCard label="Conservative" value={data.salaryBand.conservative} symbol={currencySymbol} variant="conservative" delay={0.7} />
              <SalaryCard label="Expected" value={data.salaryBand.expected} symbol={currencySymbol} variant="expected" delay={0.8} />
              <SalaryCard label="Optimistic" value={data.salaryBand.optimistic} symbol={currencySymbol} variant="optimistic" delay={0.9} />
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div>
          {/* 5️⃣ Career Growth Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="absolute -top-10 right-6 w-28 h-28 rounded-full bg-[#C77DFF] opacity-[0.04] blur-[50px] pointer-events-none" />
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white/30" />
              Career Growth Timeline
            </h3>
            <div className="space-y-0">
              {data.careerPath.map((stage, i) => (
                <TimelineNode
                  key={stage.stage}
                  stage={stage}
                  index={i}
                  total={data.careerPath.length}
                  symbol={currencySymbol}
                  delay={0.65 + i * 0.15}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
