import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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

/** Extracts a numeric portion from a formatted string like "$123K" or "4.5%" */
function parseDisplayValue(str: string): { prefix: string; num: number; suffix: string; decimals: number } {
  const match = str.match(/^([^0-9-]*)([-\d.]+)(.*)$/);
  if (!match) return { prefix: '', num: 0, suffix: str, decimals: 0 };
  const num = parseFloat(match[2]);
  const decPart = match[2].includes('.') ? match[2].split('.')[1].length : 0;
  return { prefix: match[1], num, suffix: match[3], decimals: decPart };
}

const CountUpValue = ({ value, className }: { value: string; className: string }) => {
  const { prefix, num, suffix, decimals } = parseDisplayValue(value);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const controls = animate(0, num, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [num, decimals]);

  return <div className={className}>{prefix}{display}{suffix}</div>;
};

export const MetricCard = ({ label, value, icon: Icon, gradient, glow, textGradient, delay }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4, scale: 1.02 }}
    className={`glass-card glass-card-hover p-6 transition-all duration-300 ${glow} relative overflow-hidden`}
  >
    {/* Radial glow */}
    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 blur-[40px] pointer-events-none"
      style={{ background: `var(--glow-color, rgba(199,125,255,0.4))` }}
    />
    <div className={`inline-flex rounded-xl p-2.5 ${gradient}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <CountUpValue
      value={value}
      className={`mt-4 text-3xl font-extrabold tracking-tight ${textGradient}`}
    />
    <div className="mt-1 text-sm font-medium text-white/40">{label}</div>
  </motion.div>
);
