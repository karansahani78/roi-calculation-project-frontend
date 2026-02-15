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
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.6 }}
    className="glass-card p-6"
  >
    <h2 className="text-lg font-bold text-white">Cumulative Position Over Time</h2>
    <div className="mt-4 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="year"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
            label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.4)' }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
          />
          <Tooltip
            formatter={(v: number) => formatCurrency(v, currencySymbol)}
            contentStyle={{
              background: 'rgba(15, 17, 23, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              backdropFilter: 'blur(12px)',
            }}
          />
          <Legend
            wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          />
          <Line type="monotone" dataKey="cumulativeEarnings" stroke="#4DD6C8" name="Earnings" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="cumulativeInvestment" stroke="#FF7849" name="Investment" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="netPosition" stroke="#4C6FFF" name="Net Position" strokeWidth={2} strokeDasharray="6 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);
