import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  textGradient: string;
  delay: number;
}

export const MetricCard = ({ label, value, icon: Icon, gradient, glow, textGradient, delay }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4, scale: 1.02 }}
    className={`glass-card glass-card-hover p-6 transition-all duration-300 ${glow}`}
  >
    <div className={`inline-flex rounded-xl p-2.5 ${gradient}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className={`mt-4 text-3xl font-extrabold tracking-tight ${textGradient}`}>
      {value}
    </div>
    <div className="mt-1 text-sm font-medium text-white/40">{label}</div>
  </motion.div>
);
