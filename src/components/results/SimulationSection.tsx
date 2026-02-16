import { useState, useEffect, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import {
  Shield,
  Zap,
  Sparkles,
  Loader2,
  BarChart3,
  Play,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { simulateRoi } from '@/lib/api';
import type { RoiCalculationRequest, SimulationResponse, SimulationScenario } from '@/types/api';

interface SimulationSectionProps {
  baseRequest: RoiCalculationRequest;
  currencySymbol: string;
}

const SCENARIO_CONFIG = {
  CONSERVATIVE: {
    label: 'Conservative',
    subtitle: 'Worst-case scenario',
    icon: Shield,
    gradient: 'gradient-blue',
    glow: 'glow-blue',
    textGradient: 'text-gradient-blue',
    color: '#4C6FFF',
    barColor: '#4C6FFF',
  },
  EXPECTED: {
    label: 'Expected',
    subtitle: 'Most likely outcome',
    icon: Zap,
    gradient: 'gradient-purple',
    glow: 'glow-purple',
    textGradient: 'text-gradient-purple',
    color: '#C77DFF',
    barColor: '#C77DFF',
    highlighted: true,
  },
  OPTIMISTIC: {
    label: 'Optimistic',
    subtitle: 'Best-case growth',
    icon: Sparkles,
    gradient: 'gradient-mint',
    glow: 'glow-mint',
    textGradient: 'text-gradient-mint',
    color: '#4DD6C8',
    barColor: '#4DD6C8',
  },
} as const;

function formatCurrency(value: number, symbol = '$') {
  if (Math.abs(value) >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}K`;
  return `${symbol}${value.toFixed(0)}`;
}

/** Animated number that counts up */
const CountUp = ({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) => {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [value, decimals]);
  return <>{display}{suffix}</>;
};

/** Animated confidence ring */
const ConfidenceRing = ({ score, color }: { score: number; color: string }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAnimatedScore(v),
    });
    return () => controls.stop();
  }, [score]);

  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="32" cy="32" r="28" fill="none"
          stroke={color} strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{Math.round(animatedScore)}%</span>
      </div>
    </div>
  );
};

const ScenarioCard = ({
  scenario,
  config,
  currencySymbol,
  index,
}: {
  scenario: SimulationScenario;
  config: typeof SCENARIO_CONFIG[keyof typeof SCENARIO_CONFIG];
  currencySymbol: string;
  index: number;
}) => {
  const Icon = config.icon;
  const isHighlighted = 'highlighted' in config && config.highlighted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: isHighlighted ? 1.03 : 1 }}
      transition={{ delay: 0.1 + index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: isHighlighted ? 1.05 : 1.02 }}
      className={`glass-card p-6 relative overflow-hidden transition-all duration-300 ${config.glow} ${
        isHighlighted ? 'ring-1 ring-white/10' : ''
      }`}
    >
      {/* Radial glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.08] blur-[50px] pointer-events-none"
        style={{ background: config.color }}
      />

      {/* Pulse for expected */}
      {isHighlighted && (
        <motion.div
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          style={{ border: `1px solid ${config.color}` }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`inline-flex rounded-xl p-2.5 ${config.gradient}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{config.label}</h3>
            <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">
              {config.subtitle}
            </span>
          </div>
        </div>
        <ConfidenceRing score={scenario.confidenceScore} color={config.color} />
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        <div>
          <div className="text-xs text-white/40 mb-1">ROI</div>
          <div className={`text-3xl font-extrabold tracking-tight ${config.textGradient}`}>
            <CountUp value={scenario.roiPercentage} decimals={1} suffix="%" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[11px] text-white/30 mb-0.5">Net ROI</div>
            <div className="text-lg font-bold text-white">
              {currencySymbol}<CountUp value={scenario.netRoi / 1000} decimals={0} />K
            </div>
          </div>
          <div>
            <div className="text-[11px] text-white/30 mb-0.5">Break-even</div>
            <div className="text-lg font-bold text-white">
              <CountUp value={scenario.breakEvenYears} decimals={0} /> yrs
            </div>
          </div>
        </div>

        {/* Insight */}
        <p className="text-xs text-white/40 leading-relaxed italic border-t border-white/[0.06] pt-3 mt-3">
          "{scenario.insight}"
        </p>
      </div>
    </motion.div>
  );
};

export const SimulationSection = ({ baseRequest, currencySymbol }: SimulationSectionProps) => {
  const [salaryVariation, setSalaryVariation] = useState(10);
  const [costVariation, setCostVariation] = useState(10);
  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const runSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulateRoi({
        baseRequest,
        salaryVariationPercent: salaryVariation,
        costVariationPercent: costVariation,
      });
      setSimulation(data);
      setHasRun(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  }, [baseRequest, salaryVariation, costVariation]);

  // Debounced re-run when sliders change (only after first manual run)
  useEffect(() => {
    if (!hasRun) return;
    const timer = setTimeout(runSimulation, 600);
    return () => clearTimeout(timer);
  }, [salaryVariation, costVariation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ordered scenarios
  const orderedScenarios = simulation
    ? (['CONSERVATIVE', 'EXPECTED', 'OPTIMISTIC'] as const).map(
        (key) => simulation.scenarios.find((s) => s.scenario === key)!
      ).filter(Boolean)
    : [];

  // Bar chart data
  const barData = orderedScenarios.map((s) => ({
    name: SCENARIO_CONFIG[s.scenario].label,
    roi: s.roiPercentage,
    color: SCENARIO_CONFIG[s.scenario].barColor,
  }));

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="mt-12"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/40 mb-4">
          <BarChart3 className="h-3.5 w-3.5" />
          Scenario Analysis
        </div>
        <h2 className="text-2xl font-extrabold text-white md:text-3xl tracking-tight">
          ROI <span className="text-gradient-purple">Simulation</span>
        </h2>
        <p className="mt-2 text-sm text-white/40 max-w-md mx-auto">
          Explore how salary and cost variations impact your education investment.
        </p>
      </motion.div>

      {/* Controls */}
      {!hasRun ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-card p-8 text-center"
        >
          <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
            See how different salary and cost assumptions affect your ROI across three scenarios.
          </p>
          <Button
            onClick={runSimulation}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 hover:opacity-90 px-8 py-3 text-sm font-semibold gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Simulate Outcomes
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 mb-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white/60">Salary Variation</label>
                <span className="text-sm font-mono font-semibold text-gradient-mint">±{salaryVariation}%</span>
              </div>
              <Slider
                value={[salaryVariation]}
                onValueChange={([v]) => setSalaryVariation(v)}
                min={5}
                max={30}
                step={1}
                className="w-full"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white/60">Cost Variation</label>
                <span className="text-sm font-mono font-semibold text-gradient-purple">±{costVariation}%</span>
              </div>
              <Slider
                value={[costVariation]}
                onValueChange={([v]) => setCostVariation(v)}
                min={5}
                max={30}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          {loading && (
            <div className="flex items-center justify-center mt-4 gap-2 text-white/30 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Simulating...
            </div>
          )}
        </motion.div>
      )}

      {error && (
        <div className="glass-card p-4 mb-6 text-center text-sm text-white/40">
          {error}
        </div>
      )}

      {simulation && !loading && (
        <>
          {/* Scenario Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {orderedScenarios.map((scenario, i) => (
              <ScenarioCard
                key={scenario.scenario}
                scenario={scenario}
                config={SCENARIO_CONFIG[scenario.scenario]}
                currencySymbol={currencySymbol}
                index={i}
              />
            ))}
          </div>

          {/* Summary Insight */}
          {simulation.summaryInsight && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="glass-subtle p-5 mb-6 text-center"
            >
              <p className="text-sm text-white/50 leading-relaxed max-w-lg mx-auto">
                {simulation.summaryInsight}
              </p>
            </motion.div>
          )}

          {/* ROI Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-48 rounded-full bg-[#C77DFF] opacity-[0.04] blur-[60px]" />
            </div>
            <h3 className="text-lg font-bold text-white relative z-10 mb-4">
              ROI Comparison
            </h3>
            <div className="h-64 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v.toFixed(1)}%`, 'ROI']}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#1a1a2e',
                      fontSize: '13px',
                      fontWeight: 600,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}
                    itemStyle={{ color: '#1a1a2e' }}
                    labelStyle={{ color: '#1a1a2e', fontWeight: 700 }}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  />
                  <Bar dataKey="roi" radius={[8, 8, 0, 0]} animationDuration={1200} animationEasing="ease-out">
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </>
      )}
    </motion.section>
  );
};
