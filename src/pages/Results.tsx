import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Percent,
  Share2,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Loader2,
  AlertCircle,
  Mail,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';
import type { RoiCalculationResponse } from '@/types/api';
import { VERDICT_CONFIG } from '@/types/api';
import { fetchSharedResult } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CHART_COLORS = ['#1a365d', '#0d9668', '#e8a317', '#7c3aed', '#e53e3e'];

function formatCurrency(value: number, symbol = '$') {
  if (Math.abs(value) >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}K`;
  return `${symbol}${value.toFixed(0)}`;
}

const ResultsPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [result, setResult] = useState<RoiCalculationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportEmail, setReportEmail] = useState('');
  const [sendingReport, setSendingReport] = useState(false);
  const { toast } = useToast();

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

    // Fetch from backend if no session data
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <span className="ml-3 text-muted-foreground">Loading results...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h2 className="mt-3 font-semibold text-foreground">Error Loading Result</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Link to="/calculator">
            <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
              New Calculation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Result not found</h1>
          <p className="mt-2 text-muted-foreground">This calculation may have expired.</p>
          <Link to="/calculator">
            <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
              New Calculation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { roiResults, costBreakdown, incomeProjection, inputSummary, yearlyBreakdown, recommendations } = result;
  const verdictCfg = VERDICT_CONFIG[roiResults.verdict];

  const pieData = [
    { name: 'Tuition', value: costBreakdown.tuitionTotal },
    { name: 'Living', value: costBreakdown.livingCostTotal },
    { name: 'Other', value: costBreakdown.otherCostsTotal },
    { name: 'Loan Interest', value: costBreakdown.loanInterest },
    { name: 'Opportunity', value: costBreakdown.opportunityCost },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Metrics */}
      <section className="gradient-hero py-12 md:py-16">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="text-sm font-medium text-primary-foreground/60">
              {inputSummary.degreeLevel} in {inputSummary.major} • {inputSummary.country}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gradient-hero md:text-4xl">
              Your Education ROI Analysis
            </h1>

            <div className={`mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${verdictCfg.bg} ${verdictCfg.color}`}>
              {roiResults.verdict === 'Excellent' || roiResults.verdict === 'Good' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {verdictCfg.label}
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Net ROI', value: formatCurrency(roiResults.netRoi, inputSummary.currencySymbol), icon: TrendingUp },
              { label: 'ROI %', value: `${roiResults.roiPercentage}%`, icon: Percent },
              { label: 'Break-even', value: `${roiResults.breakEvenYears} yrs`, icon: Clock },
              { label: 'Annual Return', value: `${roiResults.annualizedReturn}%`, icon: BarChart3 },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-xl bg-primary-foreground/10 p-4 text-center backdrop-blur-sm"
              >
                <metric.icon className="mx-auto mb-1 h-4 w-4 text-accent" />
                <div className="text-xl font-extrabold text-primary-foreground md:text-2xl">{metric.value}</div>
                <div className="text-xs text-primary-foreground/60">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="container max-w-5xl py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Cost Breakdown Pie */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-bold text-foreground">Cost Breakdown</h2>
              <p className="text-sm text-muted-foreground">
                Total investment: {formatCurrency(costBreakdown.totalInvestment, inputSummary.currencySymbol)}
              </p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v, inputSummary.currencySymbol)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Yearly Earnings Line Chart */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-bold text-foreground">Cumulative Position Over Time</h2>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip formatter={(v: number) => formatCurrency(v, inputSummary.currencySymbol)} />
                    <Legend />
                    <Line type="monotone" dataKey="cumulativeEarnings" stroke="#0d9668" name="Earnings" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="cumulativeInvestment" stroke="#e53e3e" name="Investment" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="netPosition" stroke="#1a365d" name="Net Position" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <AdSlot slot="below-results" />

            {/* Recommendations */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Lightbulb className="h-5 w-5 text-gold" />
                Recommendations
              </h2>
              <ul className="mt-4 space-y-3">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-foreground">Share Results</h3>
              <p className="mt-1 text-sm text-muted-foreground">Send this analysis to friends or advisors.</p>
              <Button
                className="mt-4 w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => {
                  const shareUrl = result.shareableUrl || window.location.href;
                  navigator.clipboard.writeText(shareUrl).then(() => {
                    toast({ title: 'Link copied!', description: 'Share this link with anyone to view your ROI analysis.' });
                  }).catch(() => {
                    toast({ title: 'Copy failed', description: 'Please copy the URL from your browser address bar.', variant: 'destructive' });
                  });
                }}
              >
                <Copy className="h-4 w-4" /> Copy Link
              </Button>
            </div>

            <AdSlot slot="sidebar" />

            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-foreground">Summary</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ['Total Cost', formatCurrency(costBreakdown.totalEducationCost, inputSummary.currencySymbol)],
                  ['Opportunity Cost', formatCurrency(costBreakdown.opportunityCost, inputSummary.currencySymbol)],
                  ['Lifetime Earnings', formatCurrency(incomeProjection.lifetimeEarnings, inputSummary.currencySymbol)],
                  ['Additional Earnings', formatCurrency(incomeProjection.additionalLifetimeEarnings, inputSummary.currencySymbol)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
              <h3 className="font-semibold text-foreground">Get Detailed Report</h3>
              <p className="mt-1 text-sm text-muted-foreground">Enter your email to receive a detailed analysis report.</p>
              <input
                type="email"
                value={reportEmail}
                onChange={(e) => setReportEmail(e.target.value)}
                placeholder="you@email.com"
                className="mt-3 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
              <Button
                className="mt-2 w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={sendingReport || !reportEmail.trim()}
                onClick={() => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(reportEmail)) {
                    toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
                    return;
                  }
                  setSendingReport(true);

                  const subject = encodeURIComponent(`EduROI Report: ${inputSummary.degreeLevel} in ${inputSummary.major} – ${inputSummary.country}`);
                  const body = encodeURIComponent(
                    `EduROI Analysis Report\n` +
                    `========================\n\n` +
                    `Program: ${inputSummary.degreeLevel} in ${inputSummary.major}\n` +
                    `Country: ${inputSummary.country}\n` +
                    `University: ${inputSummary.university}\n` +
                    `Duration: ${inputSummary.durationYears} years\n\n` +
                    `ROI Results\n` +
                    `-----------\n` +
                    `Net ROI: ${formatCurrency(roiResults.netRoi, inputSummary.currencySymbol)}\n` +
                    `ROI Percentage: ${roiResults.roiPercentage}%\n` +
                    `Break-even: ${roiResults.breakEvenYears} years\n` +
                    `Annualized Return: ${roiResults.annualizedReturn}%\n` +
                    `Verdict: ${roiResults.verdict}\n\n` +
                    `Cost Breakdown\n` +
                    `--------------\n` +
                    `Total Education Cost: ${formatCurrency(costBreakdown.totalEducationCost, inputSummary.currencySymbol)}\n` +
                    `Opportunity Cost: ${formatCurrency(costBreakdown.opportunityCost, inputSummary.currencySymbol)}\n` +
                    `Total Investment: ${formatCurrency(costBreakdown.totalInvestment, inputSummary.currencySymbol)}\n\n` +
                    `Income Projection\n` +
                    `-----------------\n` +
                    `Lifetime Earnings: ${formatCurrency(incomeProjection.lifetimeEarnings, inputSummary.currencySymbol)}\n` +
                    `Additional Earnings: ${formatCurrency(incomeProjection.additionalLifetimeEarnings, inputSummary.currencySymbol)}\n\n` +
                    `Recommendations\n` +
                    `---------------\n` +
                    recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n') +
                    `\n\nView full results: ${result.shareableUrl || window.location.href}\n` +
                    `\nRequested by: ${reportEmail}\n` +
                    `\n---\nGenerated by EduROI (https://eduroi.com)`
                  );

                  window.open(`mailto:codewithkaran723@gmail.com?subject=${subject}&body=${body}`, '_blank');
                  toast({ title: 'Report ready!', description: 'Your email client will open with the report. Just hit send!' });
                  setSendingReport(false);
                }}
              >
                <Mail className="h-4 w-4" /> Send Report
              </Button>
            </div>

            <Link to="/calculator">
              <Button variant="outline" className="w-full gap-2">
                New Calculation <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
