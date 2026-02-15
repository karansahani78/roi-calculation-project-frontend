import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, GitCompareArrows } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ComparePage = () => (
  <div className="min-h-screen bg-background">
    <div className="gradient-hero py-12">
      <div className="container text-center">
        <h1 className="text-3xl font-extrabold text-gradient-hero md:text-4xl">
          Compare Education Options
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
          Side-by-side comparison of ROI across different programs, countries, and majors.
        </p>
      </div>
    </div>

    <div className="container max-w-3xl py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-10 text-center shadow-card"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
          <GitCompareArrows className="h-8 w-8 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Comparison Tool Coming Soon</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Run multiple ROI calculations first, then compare them side by side. Start by calculating the ROI for your first option.
        </p>
        <Link to="/calculator">
          <Button className="mt-6 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            Start First Calculation <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </div>
);

export default ComparePage;
