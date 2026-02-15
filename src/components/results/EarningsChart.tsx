import { motion } from 'framer-motion';
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

interface EarningsChartProps {
  data: { year: number; cumulativeInvestment: number; cumulativeEarnings: number; netPosition: number }[];
  currencySymbol: string;
  formatCurrency: (value: number, symbol?: string) => string;
}

export const EarningsChart = ({ data, currencySymbol, formatCurrency }: EarningsChartProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="glass-card p-6 relative overflow-hidden"
  >
    {/* Radial glow */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-72 h-48 rounded-full bg-[#4C6FFF] opacity-[0.05] blur-[60px]" />
    </div>
    <h2 className="text-lg font-bold text-foreground relative z-10">Cumulative Position Over Time</h2>
    <div className="mt-4 h-72 relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="earningsGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9FE0C3" />
              <stop offset="100%" stopColor="#4DD6C8" />
            </linearGradient>
            <linearGradient id="investGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF9F43" />
              <stop offset="100%" stopColor="#FF7849" />
            </linearGradient>
            <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4C6FFF" />
              <stop offset="100%" stopColor="#2D9CDB" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="year"
            stroke="rgba(255,255,255,0.2)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            stroke="rgba(255,255,255,0.2)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          />
          <Tooltip
            formatter={(v: number) => formatCurrency(v, currencySymbol)}
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
          />
          <Line
            type="monotone"
            dataKey="cumulativeEarnings"
            stroke="url(#earningsGrad)"
            name="Earnings"
            strokeWidth={2.5}
            dot={false}
            animationDuration={1200}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="cumulativeInvestment"
            stroke="url(#investGrad)"
            name="Investment"
            strokeWidth={2.5}
            dot={false}
            animationDuration={1200}
            animationEasing="ease-out"
          />
          <Line
            type="monotone"
            dataKey="netPosition"
            stroke="url(#netGrad)"
            name="Net Position"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);
