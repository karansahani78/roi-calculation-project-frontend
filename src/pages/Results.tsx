import { Sparkles } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Percent,
  BarChart3,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';
import type { RoiCalculationRequest, RoiCalculationResponse, CareerIntelligenceRequest } from '@/types/api';
import { VERDICT_CONFIG } from '@/types/api';
import { fetchSharedResult } from '@/lib/api';
import { MetricCard } from '@/components/results/MetricCard';
import { CostBreakdownChart } from '@/components/results/CostBreakdownChart';
import { EarningsChart } from '@/components/results/EarningsChart';
import { RecommendationsCard } from '@/components/results/RecommendationsCard';
import { ShareCard } from '@/components/results/ShareCard';
import { PdfDownloadCard } from '@/components/results/PdfDownloadCard';
import { SummaryCard } from '@/components/results/SummaryCard';
import { SimulationSection } from '@/components/results/SimulationSection';
import { CareerIntelligencePanel } from '@/components/results/CareerIntelligencePanel';
import { DecisionConfidenceSection } from '@/components/results/DecisionConfidenceSection';
import { AmbientParticles } from '@/components/effects/AmbientParticles';
import { FilmGrain } from '@/components/effects/FilmGrain';

function formatCurrency(value: number, symbol = '$') {
  if (Math.abs(value) >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}K`;
  return `${symbol}${value.toFixed(0)}`;
}

const VERDICT_DARK = {
  Excellent: { bg: 'bg-[#4DD6C8]/15', color: 'text-[#4DD6C8]', border: 'border-[#4DD6C8]/30' },
  Good: { bg: 'bg-[#9FE0C3]/15', color: 'text-[#9FE0C3]', border: 'border-[#9FE0C3]/30' },
  Fair: { bg: 'bg-[#FF9F43]/15', color: 'text-[#FF9F43]', border: 'border-[#FF9F43]/30' },
  Poor: { bg: 'bg-[#FF7849]/15', color: 'text-[#FF7849]', border: 'border-[#FF7849]/30' },
} as const;

const ResultsPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [result, setResult] = useState<RoiCalculationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load form data for simulation
  const baseRequest = useMemo<RoiCalculationRequest | null>(() => {
    try {
      const saved = localStorage.getItem('eduroi-calculator-form');
      if (saved) return JSON.parse(saved) as RoiCalculationRequest;
    } catch {}
    return null;
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('eduroi-result');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.uuid === uuid) {
          setResult(parsed);
          setLoading(false);
          return;
        }
      } catch {}
    }

    if (uuid) {
      fetchSharedResult(uuid)
        .then((data) => {
          setResult(data);
          setLoading(false);
        })
        .catch((err) => { setError(err instanceof Error ? err.message : 'Could not load result.'); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center results-dark-bg">
        <Loader2 className="h-8 w-8 animate-spin text-[#C77DFF]" />
        <span className="ml-3 text-white/50">Loading results...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center results-dark-bg">
        <div className="glass-card mx-auto max-w-md p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-[#FF7849]" />
          <h2 className="mt-3 font-semibold text-white">Error Loading Result</h2>
          <p className="mt-1 text-sm text-white/40">{error}</p>
          <Link to="/calculator">
            <Button className="mt-4 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 hover:opacity-90">
              New Calculation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!result || !result.roiResults || !result.inputSummary) {
    return (
      <div className="flex min-h-screen items-center justify-center results-dark-bg">
        <Loader2 className="h-8 w-8 animate-spin text-[#C77DFF]" />
        <span className="ml-3 text-white/50">Preparing results…</span>
      </div>
    );
  }

  const {
    roiResults,
    costBreakdown,
    incomeProjection,
    inputSummary,
    yearlyBreakdown,
    recommendations,
  } = result;

  const verdictDark = VERDICT_DARK[roiResults.verdict];

  const pieData = [
    { name: 'Tuition', value: costBreakdown.tuitionTotal },
    { name: 'Living', value: costBreakdown.livingCostTotal },
    { name: 'Other', value: costBreakdown.otherCostsTotal },
    { name: 'Loan Interest', value: costBreakdown.loanInterest },
    { name: 'Opportunity', value: costBreakdown.opportunityCost },
  ].filter(d => d.value > 0);

  const metrics = [
    { label: 'Net ROI', value: formatCurrency(roiResults.netRoi, inputSummary.currencySymbol), icon: TrendingUp, gradient: 'gradient-rose', glow: 'glow-rose', textGradient: 'text-gradient-rose' },
    { label: 'ROI %', value: `${roiResults.roiPercentage}%`, icon: Percent, gradient: 'gradient-purple', glow: 'glow-purple', textGradient: 'text-gradient-purple' },
    { label: 'Break-even', value: `${roiResults.breakEvenYears} yrs`, icon: Clock, gradient: 'gradient-mint', glow: 'glow-mint', textGradient: 'text-gradient-mint' },
    { label: 'Annual Return', value: `${roiResults.annualizedReturn}%`, icon: BarChart3, gradient: 'gradient-blue', glow: 'glow-blue', textGradient: 'text-gradient-blue' },
  ];

  const summaryItems: [string, string][] = [
    ['Total Cost', formatCurrency(costBreakdown.totalEducationCost, inputSummary.currencySymbol)],
    ['Opportunity Cost', formatCurrency(costBreakdown.opportunityCost, inputSummary.currencySymbol)],
    ['Lifetime Earnings', formatCurrency(incomeProjection.lifetimeEarnings, inputSummary.currencySymbol)],
    ['Additional Earnings', formatCurrency(incomeProjection.additionalLifetimeEarnings, inputSummary.currencySymbol)],
  ];

  return (
    <div className="relative min-h-screen results-dark-bg">
      <AmbientParticles count={35} color="#C77DFF" maxOpacity={0.2} />
      <FilmGrain opacity={0.02} />
      {/* Hero */}
      <section className="relative py-12 md:py-16">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <p className="text-sm font-medium text-white/40 tracking-wide uppercase">
              {inputSummary.degreeLevel} in {inputSummary.major} • {inputSummary.country}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-white md:text-5xl tracking-tight">
              Your Education <span className="text-gradient-purple">ROI Analysis</span>
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold ${verdictDark.bg} ${verdictDark.color} ${verdictDark.border}`}
            >
              {roiResults.verdict === 'Excellent' || roiResults.verdict === 'Good' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {VERDICT_CONFIG[roiResults.verdict].label}
            </motion.div>
          </motion.div>

          {/* Metric Cards */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {metrics.map((m, i) => (
              <MetricCard key={m.label} {...m} delay={0.15 + i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container max-w-5xl pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CostBreakdownChart
              data={pieData}
              currencySymbol={inputSummary.currencySymbol}
              totalInvestment={costBreakdown.totalInvestment}
              formatCurrency={formatCurrency}
            />
            <EarningsChart
              data={yearlyBreakdown}
              currencySymbol={inputSummary.currencySymbol}
              formatCurrency={formatCurrency}
            />
            <AdSlot slot="below-results" />
            <RecommendationsCard recommendations={recommendations} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ShareCard shareableUrl={result.shareableUrl} />
            <PdfDownloadCard uuid={result.uuid} />
            <AdSlot slot="sidebar" />
            <SummaryCard items={summaryItems} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Link to="/calculator">
                <Button variant="outline" className="w-full gap-2 rounded-xl border-white/10 text-white/60 hover:bg-white/5 hover:text-white">
                  New Calculation <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ─── DEGREE WORTH IT CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card p-6 glow-mint text-center mt-6"
        >
          <div className="mx-auto flex max-w-xl flex-col items-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1 text-sm font-semibold text-emerald-400">
              <Sparkles className="h-4 w-4" />
              Decision Insight
            </div>

            <h3 className="text-xl font-extrabold text-gradient-hero">
              Is This Degree Actually Worth It?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Get a clear verdict based on ROI, downside risk, salary outcomes, and career demand —
              explained in simple, human language.
            </p>

            <Link
              to={`/degree-worth-it?majorId=${baseRequest?.majorId}&countryCode=${baseRequest?.countryCode}&currencyCode=${inputSummary.currencyCode}`}
            >
              <Button
                size="lg"
                className="mt-5 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-hero px-6 text-sm font-semibold"
              >
                Check If It's Worth It <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Decision Confidence Score */}
        {baseRequest && (
          <DecisionConfidenceSection baseRequest={baseRequest} />
        )}

        {/* Simulation Section */}
        {baseRequest && (
          <SimulationSection
            baseRequest={baseRequest}
            currencySymbol={inputSummary.currencySymbol}
          />
        )}

        {/* Career Intelligence Panel */}
        {baseRequest && (
          <CareerIntelligencePanel
            request={{
              majorId: baseRequest.majorId,
              countryCode: baseRequest.countryCode,
              degreeLevelId: baseRequest.degreeLevelId,
              expectedSalaryAfter: baseRequest.expectedSalaryAfter,
              durationYears: baseRequest.durationYears,
              roiPercentage: roiResults.roiPercentage,
            }}
            currencySymbol={inputSummary.currencySymbol}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsPage;