import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { useCallback } from 'react';

const GRADIENT_COLORS = ['#D16BA5', '#4DD6C8', '#FF9F43', '#C77DFF', '#4C6FFF'];

interface CostBreakdownChartProps {
  data: { name: string; value: number }[];
  currencySymbol: string;
  totalInvestment: number;
  formatCurrency: (value: number, symbol?: string) => string;
}

const RADIAN = Math.PI / 180;

/** Outside labels with leader lines for readable, non-overlapping text */
const renderCustomLabel = (
  props: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    name: string;
    percent: number;
    index: number;
  },
) => {
  const { cx, cy, midAngle, outerRadius, name, percent, index } = props;
  if (percent < 0.03) return null; // skip tiny slices

  const lineLen = 24;
  const extraLen = 18;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  // Point on outer radius
  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;

  // Elbow point
  const mx = cx + (outerRadius + lineLen) * cos;
  const my = cy + (outerRadius + lineLen) * sin;

  // End point (horizontal tail)
  const ex = mx + (cos >= 0 ? extraLen : -extraLen);
  const ey = my;

  const textAnchor = cos >= 0 ? 'start' : 'end';
  const color = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

  return (
    <g>
      {/* Leader line */}
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.5}
        fill="none"
      />
      {/* Dot at pie edge */}
      <circle cx={sx} cy={sy} r={2.5} fill={color} />
      {/* Label text */}
      <text
        x={ex + (cos >= 0 ? 6 : -6)}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill="rgba(255,255,255,0.8)"
        fontSize={11}
        fontWeight={500}
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        {name}
      </text>
      {/* Percentage below */}
      <text
        x={ex + (cos >= 0 ? 6 : -6)}
        y={ey + 14}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill="rgba(255,255,255,0.4)"
        fontSize={10}
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

export const CostBreakdownChart = ({ data, currencySymbol, totalInvestment, formatCurrency }: CostBreakdownChartProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="glass-card p-6"
  >
    <h2 className="text-lg font-bold text-foreground">Cost Breakdown</h2>
    <p className="text-sm text-muted-foreground">
      Total investment: {formatCurrency(totalInvestment, currencySymbol)}
    </p>
    <div className="mt-4 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="value"
            paddingAngle={3}
            stroke="none"
            label={renderCustomLabel}
            labelLine={false}
            animationBegin={200}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={GRADIENT_COLORS[i % GRADIENT_COLORS.length]} />
            ))}
            <Label
              value={formatCurrency(totalInvestment, currencySymbol)}
              position="center"
              fill="rgba(255,255,255,0.9)"
              fontSize={16}
              fontWeight={700}
              fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
            />
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
    {/* Legend */}
    <div className="mt-1 flex flex-wrap justify-center gap-4">
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center gap-2 text-xs text-muted-foreground">
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
