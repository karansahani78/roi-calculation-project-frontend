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
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Could not load result.');
          setLoading(false);
        });
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm font-medium text-white/40 tracking-wide uppercase">
              {inputSummary.degreeLevel} in {inputSummary.major} • {inputSummary.country}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-white md:text-5xl tracking-tight">
              Your Education <span className="text-gradient-purple">ROI Analysis</span>
            </h1>

            {/* ── ADDED: Page-level orientation text ── */}
            <p className="mt-4 mx-auto max-w-2xl text-base sm:text-sm leading-relaxed text-white/50">
              This analysis projects the long-term financial value of your degree using your
              personal inputs alongside real labour-market data. It is designed to help you
              understand what the numbers mean — not to tell you what to decide. Think of it as a
              calm, data-backed conversation with an impartial financial guide.
            </p>
            {/* ── END ADDED ── */}

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

          {/* ── ADDED: Per-metric explanations rendered below the card grid ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4"
          >
            {/* Net ROI */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
              <p className="mb-1.5 text-sm md:text-xs font-semibold uppercase tracking-wide text-white/50">
                Net ROI — in plain terms
              </p>
              <p className="text-sm md:text-xs leading-relaxed text-white/40">
                This is the total extra money your degree is projected to put in your pocket over
                your entire working life, after every cost has been subtracted — including tuition,
                living expenses, loan interest, and the salary you forgo while studying. A positive
                number means the degree is expected to more than pay for itself.
              </p>
            </div>

            {/* ROI % */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
              <p className="mb-1.5 text-sm md:text-xs font-semibold uppercase tracking-wide text-white/50">
                ROI % — strong or weak?
              </p>
              <p className="text-sm md:text-xs leading-relaxed text-white/40">
                This shows how much you get back for every dollar invested in your education. As a
                benchmark, a diversified investment portfolio has historically returned around 7–10%
                per year over the long run. An ROI % that comfortably exceeds that benchmark
                suggests your degree is a financially efficient use of capital.
              </p>
            </div>

            {/* Break-even */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
              <p className="mb-1.5 text-sm md:text-xs font-semibold uppercase tracking-wide text-white/50">
                Break-even — before &amp; after
              </p>
              <p className="text-sm md:text-xs leading-relaxed text-white/40">
                Before this point, your higher graduate salary is still in the process of repaying
                the full cost of your education. After it, every additional working year adds clear
                net financial gain. A shorter break-even period means faster payoff and less
                vulnerability to career changes or life interruptions.
              </p>
            </div>

            {/* Annual Return */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
              <p className="mb-1.5 text-sm md:text-xs font-semibold uppercase tracking-wide text-white/50">
                Annual Return — investment context
              </p>
              <p className="text-sm md:text-xs leading-relaxed text-white/40">
                This expresses your degree's financial return the same way a savings account or
                investment fund reports yearly growth. Comparing it to a current risk-free savings
                rate (around 4–5%) shows whether the degree meaningfully outperforms simply
                investing your tuition money instead of spending it on education.
              </p>
            </div>
          </motion.div>
          {/* ── END ADDED ── */}
        </div>
      </section>

      {/* Content */}
      <div className="container max-w-5xl pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* ── ADDED: Cost breakdown section intro ── */}
            <div>
              <p className="mb-1 text-sm md:text-xs font-semibold uppercase tracking-widest text-white/30">
                Where your money goes
              </p>
              <p className="mb-3 text-base sm:text-sm leading-relaxed text-white/50">
                Understanding which costs dominate your total investment is the first step to
                reducing financial risk. For many students, the single largest expense is not
                tuition but the income forfeited by studying full-time rather than working — known
                as opportunity cost. Use this chart to identify your biggest financial lever.
              </p>
            </div>
            {/* ── END ADDED ── */}

            <CostBreakdownChart
              data={pieData}
              currencySymbol={inputSummary.currencySymbol}
              totalInvestment={costBreakdown.totalInvestment}
              formatCurrency={formatCurrency}
            />

            {/* ── ADDED: Cost breakdown caption ── */}
            <p className="text-sm md:text-xs leading-relaxed text-white/35">
              <strong className="font-medium text-white/50">Opportunity cost</strong> is the salary
              you could have earned by working instead of studying — a real economic cost even
              though no money leaves your account directly. Shortening your programme or working
              part-time during study are typically the most effective ways to reduce this component.
            </p>
            {/* ── END ADDED ── */}

            {/* ── ADDED: Earnings chart section intro ── */}
            <div>
              <p className="mb-1 text-sm md:text-xs font-semibold uppercase tracking-widest text-white/30">
                Earnings over your career
              </p>
              <p className="mb-3 text-base sm:text-sm leading-relaxed text-white/50">
                This chart maps two parallel career paths: your projected cumulative earnings with
                this degree versus what you might expect without one. The point where the lines
                cross is your financial break-even. Every year after that crossover represents the
                compounding advantage of having the qualification — a gap that typically widens with
                seniority and salary progression.
              </p>
            </div>
            {/* ── END ADDED ── */}

            <EarningsChart
              data={yearlyBreakdown}
              currencySymbol={inputSummary.currencySymbol}
              formatCurrency={formatCurrency}
            />

            <AdSlot slot="below-results" />

          
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ShareCard shareableUrl={result.shareableUrl} />
            <PdfDownloadCard uuid={result.uuid} />
            <AdSlot slot="sidebar" />

            {/* ── ADDED: Summary card legend ── */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
              <p className="mb-2 text-sm md:text-xs font-semibold uppercase tracking-wide text-white/50">
                What each figure means
              </p>
              <ul className="space-y-2 text-sm md:text-xs leading-relaxed text-white/40">
                <li>
                  <span className="font-medium text-white/55">Total Cost</span> — every dollar
                  spent on your education: fees, living expenses, and loan interest combined.
                </li>
                <li>
                  <span className="font-medium text-white/55">Opportunity Cost</span> — the salary
                  you forgo by not working full-time during your studies. Often larger than tuition.
                </li>
                <li>
                  <span className="font-medium text-white/55">Lifetime Earnings</span> — your total
                  projected career income with this degree factored in.
                </li>
                <li>
                  <span className="font-medium text-white/55">Additional Earnings</span> — the
                  extra lifetime income your degree is expected to generate above a no-degree career
                  baseline. This is the clearest single measure of financial return.
                </li>
              </ul>
            </div>
            {/* ── END ADDED ── */}

            <SummaryCard items={summaryItems} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Link to="/calculator">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                >
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
              to={`/insights/degree-worth-it?majorId=${baseRequest?.majorId}&countryCode=${baseRequest?.countryCode}&currencyCode=${inputSummary.currencyCode}`}
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

        {/* ─── BLOG LINKS ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6"
        >
          <p className="text-sm md:text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
            📖 Further Reading
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <Link
              to="/blog/is-college-worth-it-in-2025"
              className="group glass-card p-4 transition-all hover:border-[#C77DFF]/30"
            >
              <h3 className="text-base sm:text-sm font-semibold text-white group-hover:text-[#C77DFF] transition-colors leading-snug">
                Is College Worth It in 2025? →
              </h3>
              <p className="text-sm md:text-xs text-white/40 mt-1">
                Data-driven answer based on 10,000+ salary data points
              </p>
            </Link>
            <Link
              to="/blog/highest-roi-degrees-2025"
              className="group glass-card p-4 transition-all hover:border-[#4DD6C8]/30"
            >
              <h3 className="text-base sm:text-sm font-semibold text-white group-hover:text-[#4DD6C8] transition-colors leading-snug">
                Top 15 Highest ROI Degrees →
              </h3>
              <p className="text-sm md:text-xs text-white/40 mt-1">
                Ranked by net financial return over 30 years
              </p>
            </Link>
            <Link
              to="/blog"
              className="group glass-card p-4 transition-all hover:border-white/20"
            >
              <h3 className="text-base sm:text-sm font-semibold text-white group-hover:text-white/80 transition-colors leading-snug">
                Education Finance Blog →
              </h3>
              <p className="text-sm md:text-xs text-white/40 mt-1">
                Expert guides on maximizing your education ROI
              </p>
            </Link>
          </div>
        </motion.div>

        {/* Decision Confidence Score */}
        {baseRequest && (
          <>
            {/* ── ADDED: Decision Confidence Score explanation ── */}
            <div className="mt-8 mb-3">
              <p className="mb-1 text-sm md:text-xs font-semibold uppercase tracking-widest text-white/30">
                Decision Confidence Score
              </p>
              <p className="text-base sm:text-sm leading-relaxed text-white/50">
                This score reflects how well your inputs align with verified real-world data for
                your chosen field, degree level, and country. A high score means your salary
                expectations, cost estimates, and career assumptions are strongly supported by
                current labour-market evidence — which makes the ROI figures above more reliable.
              </p>
              <p className="mt-2 text-base sm:text-sm leading-relaxed text-white/50">
                A lower score does not mean a bad outcome; it indicates more uncertainty in the
                projection and suggests gathering additional information before making a final
                decision. Use this score to calibrate how much confidence to place in the numbers
                — high confidence warrants acting on the analysis; lower confidence is a prompt to
                research further.
              </p>
            </div>
            {/* ── END ADDED ── */}
            <DecisionConfidenceSection baseRequest={baseRequest} />
          </>
        )}

        {/* Simulation Section */}
        {baseRequest && (
          <>
            {/* ── ADDED: Simulation explanation ── */}
            <div className="mt-8 mb-3">
              <p className="mb-1 text-sm md:text-xs font-semibold uppercase tracking-widest text-white/30">
                ROI Scenario Simulations
              </p>
              <p className="text-base sm:text-sm leading-relaxed text-white/50">
                Life rarely follows a single script. This section lets you stress-test your ROI
                across a range of realistic assumptions — such as a longer job search, a more
                competitive starting salary market, or a programme running over time. If your ROI
                stays positive across most scenarios, that signals genuine financial resilience in
                your investment. If it turns negative under plausible changes, that is important
                risk information to have before committing.
              </p>
              <p className="mt-2 text-base sm:text-sm leading-relaxed text-white/50">
                Use the simulations to understand your range of possible outcomes, not to find the
                most optimistic one.
              </p>
            </div>
            {/* ── END ADDED ── */}
            <SimulationSection
              baseRequest={baseRequest}
              currencySymbol={inputSummary.currencySymbol}
            />
          </>
        )}

        {/* Career Intelligence Panel */}
        {baseRequest && (
          <>
            {/* ── ADDED: Career intelligence and salary band explanation ── */}
            <div className="mt-8 mb-3">
              <p className="mb-1 text-sm md:text-xs font-semibold uppercase tracking-widest text-white/30">
                Career Outcome Intelligence
              </p>
              <p className="text-base sm:text-sm leading-relaxed text-white/50">
                The career outcome probabilities below are derived from aggregated labour-market
                data specific to your field and region. They represent statistical likelihoods
                across a large population of graduates in similar roles — your individual result
                will also depend on factors such as location, employer, experience, and personal
                initiative. Use these probabilities to set informed expectations, not as a personal
                ceiling or guaranteed floor.
              </p>
              <p className="mt-2 text-base sm:text-sm leading-relaxed text-white/50">
                On salary confidence bands:{' '}
                <strong className="font-medium text-white/65">Conservative</strong> reflects the
                lower end of typical graduate earnings for this field — roughly the 25th percentile
                of observed outcomes.{' '}
                <strong className="font-medium text-white/65">Optimistic</strong> represents
                outcomes achieved by graduates who progress well, around the 75th percentile.
                Financial planning around the conservative figure is the more prudent approach;
                anything above it becomes an upside bonus rather than a dependency.
              </p>
            </div>
            {/* ── END ADDED ── */}
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
          </>
        )}

        {/* ── ADDED: Closing disclaimer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12 border-t border-white/[0.06] pt-8 text-center"
        >
          <p className="mx-auto max-w-2xl text-sm md:text-xs leading-relaxed text-white/25">
            All projections are based on the inputs you provided and aggregated third-party
            labour-market data. Figures are provided for informational and planning purposes only
            and do not constitute financial, legal, or careers advice. Individual outcomes will
            vary. We recommend consulting a qualified financial adviser or careers professional
            before making significant education investment decisions.
          </p>
        </motion.div>
        {/* ── END ADDED ── */}
      </div>
    </div>
  );
};

export default ResultsPage;