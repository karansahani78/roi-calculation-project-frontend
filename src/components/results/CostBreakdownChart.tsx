import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const GRADIENT_COLORS = ['#D16BA5', '#4DD6C8', '#FF9F43', '#C77DFF', '#4C6FFF'];

interface CostBreakdownChartProps {
  data: { name: string; value: number }[];
  currencySymbol: string;
  totalInvestment: number;
  formatCurrency: (value: number, symbol?: string) => string;
}

export const CostBreakdownChart = ({ data, currencySymbol, totalInvestment, formatCurrency }: CostBreakdownChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="glass-card p-6"
  >
    <h2 className="text-lg font-bold text-white">Cost Breakdown</h2>
    <p className="text-sm text-white/40">
      Total investment: {formatCurrency(totalInvestment, currencySymbol)}
    </p>
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            paddingAngle={3}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={GRADIENT_COLORS[i % GRADIENT_COLORS.length]} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-2 flex flex-wrap justify-center gap-4">
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center gap-2 text-xs text-white/60">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: GRADIENT_COLORS[i % GRADIENT_COLORS.length] }}
          />
          {d.name}
        </div>
      ))}
    </div>
  </motion.div>
);
