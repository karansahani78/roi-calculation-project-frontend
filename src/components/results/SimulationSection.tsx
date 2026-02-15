import { useState, useEffect, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Sparkles,
  Loader2,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Slider } from '@/components/ui/slider';
import { simulateRoi } from '@/lib/api';
import type { RoiCalculationRequest, RoiCalculationResponse, SimulationResponse } from '@/types/api';

interface SimulationSectionProps {
  baseRequest: RoiCalculationRequest;
  currencySymbol: string;
}

function formatCurrency(value: number, symbol = '$') {
  if (Math.abs(value) >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}K`;
  return `${symbol}${value.toFixed(0)}`;
}

const SCENARIOS = [
  {
    key: 'conservative' as const,
    label: 'Conservative',
    icon: Shield,
    gradient: 'gradient-blue',
    glow: 'glow-blue',
    textGradient: 'text-gradient-blue',
    color: '#4C6FFF',
    chartColor: '#4C6FFF',
  },
  {
    key: 'expected' as const,
    label: 'Expected',
    icon: Zap,
    gradient: 'gradient-mint',
    glow: 'glow-mint',
    textGradient: 'text-gradient-mint',
    color: '#4DD6C8',
    chartColor: '#4DD6C8',
    highlighted: true,
  },
  {
    key: 'optimistic' as const,
    label: 'Optimistic',
    icon: Sparkles,
    gradient: 'gradient-purple',
    glow: 'glow-purple',
    textGradient: 'text-gradient-purple',
    color: '#C77DFF',
    chartColor: '#C77DFF',
  },
] as const;

const VERDICT_COLORS: Record<string, string> = {
  Excellent: '#4DD6C8',
  Good: '#9FE0C3',
  Fair: '#FF9F43',
  Poor: '#FF7849',
};

/** Animated number that counts up */
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

const ScenarioCard = ({
  scenario,
  result,
  currencySymbol,
  index,
}: {
  scenario: typeof SCENARIOS[number];
  result: RoiCalculationResponse;
  currencySymbol: string;
  index: number;
}) => {
  const { roiResults } = result;
  const Icon = scenario.icon;
  const isHighlighted = 'highlighted' in scenario && scenario.highlighted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass-card p-6 relative overflow-hidden transition-all duration-300 ${scenario.glow} ${
        isHighlighted ? 'ring-1 ring-white/10' : ''
      }`}
    >
      {/* Radial glow */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-[0.08] blur-[50px] pointer-events-none"
        style={{ background: scenario.color }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`inline-flex rounded-xl p-2.5 ${scenario.gradient}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-sm">{scenario.label}</h3>
          {isHighlighted && (
            <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">
              Most likely
            </span>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        <div>
          <div className="text-xs text-white/40 mb-1">Net ROI</div>
          <div className={`text-2xl font-extrabold tracking-tight ${scenario.textGradient}`}>
            {currencySymbol}<CountUp value={roiResults.netRoi / 1000} decimals={0} />K
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[11px] text-white/30 mb-0.5">ROI %</div>
            <div className="text-lg font-bold text-white">
              <CountUp value={roiResults.roiPercentage} decimals={0} />%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-white/30 mb-0.5">Break-even</div>
            <div className="text-lg font-bold text-white">
              <CountUp value={roiResults.breakEvenYears} decimals={1} /> yrs
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: `${VERDICT_COLORS[roiResults.verdict]}15`,
            color: VERDICT_COLORS[roiResults.verdict],
            border: `1px solid ${VERDICT_COLORS[roiResults.verdict]}30`,
          }}
        >
          {roiResults.verdict === 'Excellent' || roiResults.verdict === 'Good' ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {roiResults.verdict}
        </div>
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  }, [baseRequest, salaryVariation, costVariation]);

  // Auto-run on mount
  useEffect(() => {
    runSimulation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced re-run when sliders change
  useEffect(() => {
    const timer = setTimeout(runSimulation, 600);
    return () => clearTimeout(timer);
  }, [salaryVariation, costVariation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Build chart data from all 3 scenarios
  const chartData = simulation
    ? simulation.expected.yearlyBreakdown.map((row, i) => ({
        year: row.year,
        conservative: simulation.conservative.yearlyBreakdown[i]?.netPosition ?? 0,
        expected: simulation.expected.yearlyBreakdown[i]?.netPosition ?? 0,
        optimistic: simulation.optimistic.yearlyBreakdown[i]?.netPosition ?? 0,
      }))
    : [];

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

      {/* Sliders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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

      {error && (
        <div className="glass-card p-4 mb-6 text-center text-sm text-white/40">
          {error}
        </div>
      )}

      {simulation && !loading && (
        <>
          {/* Scenario Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {SCENARIOS.map((scenario, i) => (
              <ScenarioCard
                key={scenario.key}
                scenario={scenario}
                result={simulation[scenario.key]}
                currencySymbol={currencySymbol}
                index={i}
              />
            ))}
          </div>

          {/* Comparison Chart */}
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
              Scenario Comparison
            </h3>
            <div className="h-72 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    {SCENARIOS.map((s) => (
                      <linearGradient key={s.key} id={`sim-${s.key}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={s.chartColor} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={s.chartColor} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="year"
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v) => formatCurrency(v)}
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      formatCurrency(v, currencySymbol),
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                    contentStyle={{
                      background: 'rgba(15, 17, 23, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      backdropFilter: 'blur(16px)',
                      fontSize: '13px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, paddingTop: 8 }}
                    formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  {SCENARIOS.map((s) => (
                    <Line
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      stroke={`url(#sim-${s.key})`}
                      strokeWidth={s.key === 'expected' ? 3 : 2}
                      strokeDasharray={s.key === 'expected' ? undefined : '6 4'}
                      dot={false}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </>
      )}
    </motion.section>
  );
};
