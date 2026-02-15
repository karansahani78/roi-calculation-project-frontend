import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface RecommendationsCardProps {
  recommendations: string[];
}

export const RecommendationsCard = ({ recommendations }: RecommendationsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.6 }}
    className="glass-card p-6"
  >
    <h2 className="flex items-center gap-2 text-lg font-bold text-white">
      <div className="gradient-orange inline-flex rounded-xl p-2">
        <Lightbulb className="h-4 w-4 text-white" />
      </div>
      Recommendations
    </h2>
    <ul className="mt-4 space-y-3">
      {recommendations.map((rec, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.08 }}
          className="flex gap-3 text-sm text-white/60"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4DD6C8]" />
          {rec}
        </motion.li>
      ))}
    </ul>
  </motion.div>
);
