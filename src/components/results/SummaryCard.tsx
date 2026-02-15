import { motion } from 'framer-motion';

interface SummaryCardProps {
  items: [string, string][];
}

export const SummaryCard = ({ items }: SummaryCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.5 }}
    className="glass-card p-6"
  >
    <h3 className="font-semibold text-white">Summary</h3>
    <dl className="mt-4 space-y-3 text-sm">
      {items.map(([label, value]) => (
        <div key={label} className="flex justify-between">
          <dt className="text-white/40">{label}</dt>
          <dd className="font-medium text-white/80">{value}</dd>
        </div>
      ))}
    </dl>
  </motion.div>
);
