import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
  Sector,
} from 'recharts';

const GRADIENT_COLORS = ['#D16BA5', '#4DD6C8', '#FF9F43', '#C77DFF', '#4C6FFF'];

interface CostBreakdownChartProps {
  data: { name: string; value: number }[];
  currencySymbol: string;
  totalInvestment: number;
  formatCurrency: (value: number, symbol?: string) => string;
}

const RADIAN = Math.PI / 180;

/** Active slice renderer — scale up + glow, no dark overlay */
const renderActiveShape = (props: any) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 16 : -16);
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* Glow behind active slice */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.25}
        style={{ filter: 'blur(8px)' }}
      />
      {/* Active slice — slightly bigger, full opacity */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="none"
      />
      {/* Leader line */}
      <path
        d={`M${cx + outerRadius * cos},${cy + outerRadius * sin}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        strokeWidth={1.5}
        strokeOpacity={0.6}
        fill="none"
      />
      <circle cx={cx + outerRadius * cos} cy={cy + outerRadius * sin} r={3} fill={fill} />
      <text
        x={ex + (cos >= 0 ? 8 : -8)}
        y={ey - 6}
        textAnchor={textAnchor}
        fill="rgba(255,255,255,0.9)"
        fontSize={12}
        fontWeight={600}
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        {payload.name}
      </text>
      <text
        x={ex + (cos >= 0 ? 8 : -8)}
        y={ey + 10}
        textAnchor={textAnchor}
        fill="rgba(255,255,255,0.5)"
        fontSize={11}
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
};

/** Outside labels with leader lines for readable, non-overlapping text */
const renderCustomLabel = (props: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  name: string;
  percent: number;
  index: number;
}) => {
  const { cx, cy, midAngle, outerRadius, name, percent, index } = props;
  if (percent < 0.03) return null;

  const lineLen = 24;
  const extraLen = 18;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;
  const mx = cx + (outerRadius + lineLen) * cos;
  const my = cy + (outerRadius + lineLen) * sin;
  const ex = mx + (cos >= 0 ? extraLen : -extraLen);
  const ey = my;

  const textAnchor = cos >= 0 ? 'start' : 'end';
  const color = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.5}
        fill="none"
      />
      <circle cx={sx} cy={sy} r={2.5} fill={color} />
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

/** Custom tooltip with glass effect */
const GlassTooltip = ({ active, payload, formatCurrency, currencySymbol }: any) => {
  if (!active || !payload?.[0]) return null;
  const { name, value } = payload[0];
  return (
    <div
      style={{
        background: 'rgba(15, 17, 23, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '14px',
        padding: '10px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(199,125,255,0.1)',
      }}
    >
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 2 }}>{name}</p>
      <p style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>
        {formatCurrency(value, currencySymbol)}
      </p>
    </div>
  );
};

export const CostBreakdownChart = ({ data, currencySymbol, totalInvestment, formatCurrency }: CostBreakdownChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Radial glow behind chart */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-[#C77DFF] opacity-[0.06] blur-[80px]" />
      </div>

      <h2 className="text-lg font-bold text-foreground relative z-10">Cost Breakdown</h2>
      <p className="text-sm text-muted-foreground relative z-10">
        Total investment: {formatCurrency(totalInvestment, currencySymbol)}
      </p>
      <div className="mt-4 h-80 relative z-10">
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
              label={activeIndex === undefined ? renderCustomLabel : undefined}
              labelLine={false}
              animationBegin={200}
              animationDuration={900}
              animationEasing="ease-out"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
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
              content={<GlassTooltip formatCurrency={formatCurrency} currencySymbol={currencySymbol} />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-1 flex flex-wrap justify-center gap-4 relative z-10">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer transition-colors hover:text-foreground"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
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
};
