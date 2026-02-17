import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompareArrows, Trophy, AlertCircle, Loader2, ChevronDown, ChevronUp, Sparkles, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { fetchCountries, fetchMajors, fetchDegreeLevels, fetchCurrencies, fetchUniversities, compareOptions } from '@/lib/api';
import type { RoiCalculationRequest, CountryDto, CompareResponse } from '@/types/api';
import { VERDICT_CONFIG } from '@/types/api';
import { AmbientParticles } from '@/components/effects/AmbientParticles';
import { FilmGrain } from '@/components/effects/FilmGrain';

// ─── UNCHANGED LOGIC ──────────────────────────────────────────────────────────

const defaultOption: Partial<RoiCalculationRequest> = {
  countryCode: '', majorId: undefined, degreeLevelId: undefined,
  tuitionAnnual: 0, livingCostAnnual: 0, otherCostsAnnual: 0, durationYears: 4,
  loanAmount: 0, interestRate: 0, loanTermYears: 10, partTimeIncomeAnnual: 0,
  expectedSalaryAfter: 0, currentSalary: 0, inflationRate: 3, taxRate: 25,
  calculationYears: 10, currencyCode: 'USD',
};

function isOptionComplete(opt: Partial<RoiCalculationRequest>) {
  return !!(opt.countryCode && opt.majorId && opt.degreeLevelId && (opt.tuitionAnnual || 0) > 0 && (opt.expectedSalaryAfter || 0) > 0);
}

const VERDICT_DARK = {
  Excellent: { bg: 'bg-[#4DD6C8]/15', color: 'text-[#4DD6C8]', border: 'border-[#4DD6C8]/30' },
  Good: { bg: 'bg-[#9FE0C3]/15', color: 'text-[#9FE0C3]', border: 'border-[#9FE0C3]/30' },
  Fair: { bg: 'bg-[#FF9F43]/15', color: 'text-[#FF9F43]', border: 'border-[#FF9F43]/30' },
  Poor: { bg: 'bg-[#FF7849]/15', color: 'text-[#FF7849]', border: 'border-[#FF7849]/30' },
} as const;

// ─── OPTION FORM ──────────────────────────────────────────────────────────────

const OptionForm = ({
  label, option, onChange, countries, majors, degreeLevels, currencies, index,
}: {
  label: string;
  option: Partial<RoiCalculationRequest>;
  onChange: (opt: Partial<RoiCalculationRequest>) => void;
  countries: CountryDto[] | undefined;
  majors: any[] | undefined;
  degreeLevels: any[] | undefined;
  currencies: any[] | undefined;
  index: number;
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const selectedCountry = countries?.find(c => c.code === option.countryCode);
  const { data: universities } = useQuery({
    queryKey: ['universities', selectedCountry?.id],
    queryFn: () => fetchUniversities(selectedCountry!.id),
    enabled: !!selectedCountry?.id,
  });

  const update = (key: keyof RoiCalculationRequest, value: string | number) => onChange({ ...option, [key]: value });
  const numUpdate = (key: keyof RoiCalculationRequest, value: string) => {
    const num = parseFloat(value);
    update(key, isNaN(num) ? 0 : num);
  };
  const complete = isOptionComplete(option);

  const accentColor = index === 0 ? '#818CF8' : '#F472B6';
  const accentColorDim = index === 0 ? 'rgba(129,140,248,0.12)' : 'rgba(244,114,182,0.12)';
  const accentBorder = index === 0 ? 'rgba(129,140,248,0.25)' : 'rgba(244,114,182,0.25)';
  const glowClass = index === 0 ? 'shadow-[0_0_30px_rgba(129,140,248,0.15)]' : 'shadow-[0_0_30px_rgba(244,114,182,0.15)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1"
    >
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${complete ? glowClass : ''}`}
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.018) 100%)',
          border: `1px solid ${complete ? accentBorder : 'rgba(255,255,255,0.07)'}`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500"
          style={{
            background: complete
              ? `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`
              : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          }}
        />

        {/* Corner badge */}
        <div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
          style={{ background: accentColorDim, color: accentColor, border: `1px solid ${accentBorder}` }}
        >
          {label}
        </div>

        {complete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3.5 left-4"
          >
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(77,214,200,0.12)', color: '#4DD6C8', border: '1px solid rgba(77,214,200,0.25)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DD6C8] animate-pulse" />
              Ready
            </div>
          </motion.div>
        )}

        <div className="p-6 pt-10 space-y-5">
          {/* Section: Education */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/25 mb-3">Education Details</p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-white/40 font-medium">Country</Label>
                <Select value={option.countryCode || ''} onValueChange={v => update('countryCode', v)}>
                  <SelectTrigger className="h-9 text-sm glass-input border-white/[0.07] bg-white/[0.04] focus:border-white/20">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map(c => <SelectItem key={c.id} value={c.code}>{c.name}</SelectItem>)}
                    {(!countries || countries.length === 0) && <SelectItem value="_none" disabled>No countries</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-white/40 font-medium">University <span className="text-white/20">(optional)</span></Label>
                <Select value={option.universityId ? String(option.universityId) : ''} onValueChange={v => update('universityId', parseInt(v))} disabled={!selectedCountry}>
                  <SelectTrigger className="h-9 text-sm glass-input border-white/[0.07] bg-white/[0.04] focus:border-white/20">
                    <SelectValue placeholder={selectedCountry ? "Select university" : "Select country first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {universities?.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                    {(!universities || universities.length === 0) && <SelectItem value="_none" disabled>No universities</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/40 font-medium">Major</Label>
                  <Select value={option.majorId ? String(option.majorId) : ''} onValueChange={v => update('majorId', parseInt(v))}>
                    <SelectTrigger className="h-9 text-sm glass-input border-white/[0.07] bg-white/[0.04]"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {majors?.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                      {(!majors || majors.length === 0) && <SelectItem value="_none" disabled>No majors</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-white/40 font-medium">Degree</Label>
                  <Select value={option.degreeLevelId ? String(option.degreeLevelId) : ''} onValueChange={v => {
                    const deg = degreeLevels?.find(d => d.id === parseInt(v));
                    onChange({ ...option, degreeLevelId: parseInt(v), durationYears: deg?.typicalDurationYears || 4 });
                  }}>
                    <SelectTrigger className="h-9 text-sm glass-input border-white/[0.07] bg-white/[0.04]"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {degreeLevels?.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                      {(!degreeLevels || degreeLevels.length === 0) && <SelectItem value="_none" disabled>None</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          {/* Section: Costs */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/25 mb-3">Financials</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-white/40 font-medium">Annual Tuition <span className="text-[#F472B6]/60">*</span></Label>
                <Input className="h-9 text-sm glass-input border-white/[0.07] bg-white/[0.04]" type="number" min={0} value={option.tuitionAnnual || ''} onChange={e => numUpdate('tuitionAnnual', e.target.value)} placeholder="25,000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-white/40 font-medium">Living Cost / yr</Label>
                <Input className="h-9 text-sm glass-input border-white/[0.07] bg-white/[0.04]" type="number" min={0} value={option.livingCostAnnual || ''} onChange={e => numUpdate('livingCostAnnual', e.target.value)} placeholder="15,000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-white/40 font-medium">Expected Salary <span className="text-[#F472B6]/60">*</span></Label>
                <Input className="h-9 text-sm glass-input border-white/[0.07] bg-white/[0.04]" type="number" min={0} value={option.expectedSalaryAfter || ''} onChange={e => numUpdate('expectedSalaryAfter', e.target.value)} placeholder="75,000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-white/40 font-medium">Duration (yrs)</Label>
                <Input className="h-9 text-sm glass-input border-white/[0.07] bg-white/[0.04]" type="number" min={1} max={10} value={option.durationYears || ''} onChange={e => numUpdate('durationYears', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="group flex w-full items-center justify-center gap-1.5 text-[11px] text-white/25 hover:text-white/55 transition-all duration-200 py-1"
          >
            <span className="font-medium tracking-wide">{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
            <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/20 mb-3">Advanced</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs text-white/35">Other Costs / yr</Label><Input className="h-9 text-sm glass-input border-white/[0.06] bg-white/[0.03]" type="number" min={0} value={option.otherCostsAnnual || ''} onChange={e => numUpdate('otherCostsAnnual', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-white/35">Loan Amount</Label><Input className="h-9 text-sm glass-input border-white/[0.06] bg-white/[0.03]" type="number" min={0} value={option.loanAmount || ''} onChange={e => numUpdate('loanAmount', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-white/35">Interest Rate %</Label><Input className="h-9 text-sm glass-input border-white/[0.06] bg-white/[0.03]" type="number" min={0} max={30} step={0.1} value={option.interestRate || ''} onChange={e => numUpdate('interestRate', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-white/35">Loan Term (yrs)</Label><Input className="h-9 text-sm glass-input border-white/[0.06] bg-white/[0.03]" type="number" min={1} max={30} value={option.loanTermYears || ''} onChange={e => numUpdate('loanTermYears', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-white/35">Part-time Income</Label><Input className="h-9 text-sm glass-input border-white/[0.06] bg-white/[0.03]" type="number" min={0} value={option.partTimeIncomeAnnual || ''} onChange={e => numUpdate('partTimeIncomeAnnual', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-white/35">Current Salary</Label><Input className="h-9 text-sm glass-input border-white/[0.06] bg-white/[0.03]" type="number" min={0} value={option.currentSalary || ''} onChange={e => numUpdate('currentSalary', e.target.value)} /></div>
                    <div className="space-y-1.5"><Label className="text-xs text-white/35">Tax Rate %</Label><Input className="h-9 text-sm glass-input border-white/[0.06] bg-white/[0.03]" type="number" min={0} max={60} value={option.taxRate || ''} onChange={e => numUpdate('taxRate', e.target.value)} /></div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-white/35">Currency</Label>
                      <Select value={option.currencyCode || 'USD'} onValueChange={v => update('currencyCode', v)}>
                        <SelectTrigger className="h-9 text-sm glass-input border-white/[0.06] bg-white/[0.03]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {currencies?.map(c => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>)}
                          {(!currencies || currencies.length === 0) && <SelectItem value="_none" disabled>None</SelectItem>}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ─── RESULT CARD ──────────────────────────────────────────────────────────────

const ResultCard = ({ label, result, isWinner, index }: { label: string; result: CompareResponse['optionA']; isWinner: boolean; index: number }) => {
  const verdict = result.roiResults.verdict;
  const vd = VERDICT_DARK[verdict];
  const accentColor = index === 0 ? '#818CF8' : '#F472B6';
  const accentColorDim = index === 0 ? 'rgba(129,140,248,0.10)' : 'rgba(244,114,182,0.10)';
  const glowClass = isWinner ? (index === 0 ? 'shadow-[0_0_50px_rgba(129,140,248,0.2)]' : 'shadow-[0_0_50px_rgba(244,114,182,0.2)]') : '';

  const metrics = [
    { icon: DollarSign, label: 'Net ROI', value: `$${result.roiResults.netRoi.toLocaleString()}`, highlight: true },
    { icon: TrendingUp, label: 'ROI %', value: `${result.roiResults.roiPercentage}%`, highlight: false },
    { icon: Clock, label: 'Break-even', value: `${result.roiResults.breakEvenYears} yrs`, highlight: false },
    { icon: Sparkles, label: 'Annual Return', value: `${result.roiResults.annualizedReturn}%`, highlight: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`flex-1 relative rounded-2xl overflow-hidden transition-all duration-500 ${glowClass}`}
      style={{
        background: isWinner
          ? `linear-gradient(145deg, ${accentColorDim} 0%, rgba(255,255,255,0.02) 100%)`
          : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
        border: `1px solid ${isWinner ? accentColor + '35' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: isWinner
            ? `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`
            : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
        }}
      />

      {isWinner && (
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute top-0 right-0"
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-bl-2xl"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${index === 0 ? '#a78bfa' : '#fb7185'})`, color: '#fff' }}
          >
            <Trophy className="h-3 w-3" />
            Winner
          </div>
        </motion.div>
      )}

      <div className="p-6 pt-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
          <h3 className="text-base font-bold text-white/90">{label}</h3>
        </div>

        <div className="space-y-3">
          {metrics.map(({ icon: Icon, label: mLabel, value, highlight }, i) => (
            <motion.div
              key={mLabel}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
                <span className="text-sm text-white/40">{mLabel}</span>
              </div>
              <span className={highlight ? `text-xl font-extrabold` : 'text-base font-semibold text-white/90'}
                style={highlight ? { background: `linear-gradient(135deg, ${accentColor}, #fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}>
                {value}
              </span>
            </motion.div>
          ))}

          <div className="h-px bg-gradient-to-r from-transparent via-white/6 to-transparent my-1" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40">Verdict</span>
            <Badge className={`${vd.bg} ${vd.color} ${vd.border} border text-[11px] font-semibold tracking-wide`}>
              {VERDICT_CONFIG[verdict].label}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const ComparePage = () => {
  const [optionA, setOptionA] = useState<Partial<RoiCalculationRequest>>({ ...defaultOption });
  const [optionB, setOptionB] = useState<Partial<RoiCalculationRequest>>({ ...defaultOption });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResponse | null>(null);

  const { data: countries, isLoading: countriesLoading, isError: countriesError } = useQuery({ queryKey: ['countries'], queryFn: fetchCountries });
  const { data: majors, isLoading: majorsLoading, isError: majorsError } = useQuery({ queryKey: ['majors'], queryFn: () => fetchMajors() });
  const { data: degreeLevels, isLoading: degreesLoading, isError: degreesError } = useQuery({ queryKey: ['degree-levels'], queryFn: fetchDegreeLevels });
  const { data: currencies, isLoading: currenciesLoading, isError: currenciesError } = useQuery({ queryKey: ['currencies'], queryFn: fetchCurrencies });

  const isRefLoading = countriesLoading || majorsLoading || degreesLoading || currenciesLoading;
  const hasRefError = countriesError || majorsError || degreesError || currenciesError;
  const bothReady = isOptionComplete(optionA) && isOptionComplete(optionB);

  const handleCompare = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await compareOptions({ optionA: optionA as RoiCalculationRequest, optionB: optionB as RoiCalculationRequest, comparisonType: 'university' });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (hasRefError) {
    return (
      <div className="min-h-screen results-dark-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md p-8 text-center rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,120,73,0.2)', backdropFilter: 'blur(20px)' }}
        >
          <div className="w-14 h-14 rounded-full bg-[#FF7849]/10 border border-[#FF7849]/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-[#FF7849]" />
          </div>
          <h2 className="font-bold text-white text-lg">Backend Unavailable</h2>
          <p className="mt-2 text-sm text-white/35">Could not load reference data. Please try again later.</p>
        </motion.div>
      </div>
    );
  }

  if (isRefLoading) {
    return (
      <div className="min-h-screen results-dark-bg flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border border-white/[0.06] flex items-center justify-center"
            style={{ background: 'rgba(129,140,248,0.08)' }}>
            <Loader2 className="h-7 w-7 animate-spin text-[#818CF8]" />
          </div>
        </div>
        <p className="text-sm text-white/30 tracking-wide">Initializing data...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen results-dark-bg overflow-x-hidden">
      <AmbientParticles count={30} color="#C77DFF" maxOpacity={0.2} />
      <FilmGrain opacity={0.02} />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-12">
        {/* Mesh gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #818CF8 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute -top-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #F472B6 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="container relative z-10 text-center">
          {/* SEO-optimized H1 with keyword targeting */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase mb-5"
            style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#818CF8' }}
          >
            <Sparkles className="h-3 w-3" />
            Education ROI Calculator
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-extrabold text-white md:text-5xl tracking-tight leading-[1.1]"
          >
            Compare Education{' '}
            <span
              className="inline-block"
              style={{ background: 'linear-gradient(135deg, #818CF8 0%, #F472B6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              ROI Options
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-4 max-w-xl text-base text-white/40 leading-relaxed"
          >
            Make smarter university decisions with a side-by-side financial return analysis across programs, countries, and majors.
          </motion.p>

          {/* Trust signals / SEO keywords */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-6"
          >
            {['Net Present Value', 'Break-even Analysis', 'Salary Projections', 'Loan Calculator'].map((tag) => (
              <span key={tag}
                className="text-[11px] text-white/25 px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FORMS ──────────────────────────────────────────────────────── */}
      <div className="container max-w-5xl pb-20 relative z-10">

        {/* VS Divider */}
        <div className="flex flex-col gap-5 md:flex-row items-stretch">
          <OptionForm label="Option A" option={optionA} onChange={setOptionA} countries={countries} majors={majors} degreeLevels={degreeLevels} currencies={currencies} index={0} />

          <div className="hidden md:flex flex-col items-center justify-center gap-2 px-2 min-w-[44px]">
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white/30 shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              VS
            </div>
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
          </div>

          <div className="md:hidden flex items-center justify-center py-1">
            <div className="flex items-center gap-3 text-[11px] font-black text-white/25">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/10" />
              VS
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/10" />
            </div>
          </div>

          <OptionForm label="Option B" option={optionB} onChange={setOptionB} countries={countries} majors={majors} degreeLevels={degreeLevels} currencies={currencies} index={1} />
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <Button
            size="lg"
            className="relative gap-2.5 px-12 py-6 text-base font-bold rounded-2xl text-white border-0 overflow-hidden group transition-all duration-300 disabled:opacity-40"
            style={{
              background: bothReady && !loading
                ? 'linear-gradient(135deg, #818CF8 0%, #a78bfa 50%, #F472B6 100%)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: bothReady && !loading ? '0 0 40px rgba(129,140,248,0.35), 0 8px 30px rgba(0,0,0,0.4)' : 'none',
            }}
            disabled={!bothReady || loading}
            onClick={handleCompare}
          >
            {/* Shine sweep */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 60%, transparent 80%)' }} />
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GitCompareArrows className="h-5 w-5" />}
            {loading ? 'Calculating ROI...' : 'Compare Now'}
          </Button>

          <AnimatePresence>
            {!bothReady && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-white/20 tracking-wide"
              >
                Fill in both options to run a comparison
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── ERROR ────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-center gap-2.5 p-4 rounded-xl text-sm text-[#FF7849]"
              style={{ background: 'rgba(255,120,73,0.08)', border: '1px solid rgba(255,120,73,0.18)' }}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RESULTS ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-14 space-y-8"
            >
              {/* Results header */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Comparison Results</h2>
                <p className="mt-1.5 text-sm text-white/30">Based on your financial inputs and career projections</p>
              </motion.div>

              {/* Result cards */}
              <div className="flex flex-col gap-5 md:flex-row">
                <ResultCard label="Option A" result={result.optionA} isWinner={result.summary.winner === 'A'} index={0} />
                <ResultCard label="Option B" result={result.optionB} isWinner={result.summary.winner === 'B'} index={1} />
              </div>

              {/* Summary panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
              >
                {/* Panel header */}
                <div className="px-6 py-4 flex items-center gap-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="w-7 h-7 rounded-lg bg-[#4DD6C8]/10 border border-[#4DD6C8]/20 flex items-center justify-center">
                    <Trophy className="h-3.5 w-3.5 text-[#4DD6C8]" />
                  </div>
                  <h3 className="text-sm font-bold text-white/85">Key Differences</h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Stat row */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: 'ROI Difference', value: `$${Math.abs(result.summary.roiDifference).toLocaleString()}`, color: '#818CF8' },
                      { label: 'Cost Difference', value: `$${Math.abs(result.summary.costDifference).toLocaleString()}`, color: '#4DD6C8' },
                      { label: 'Break-even Diff', value: `${Math.abs(result.summary.breakEvenDifference)} yrs`, color: '#F472B6' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + i * 0.08 }}
                        className="text-center rounded-xl py-4 px-3"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 mb-1">{item.label}</p>
                        <p className="text-xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Key differences list */}
                  {result.summary.keyDifferences.length > 0 ? (
                    <ul className="space-y-2.5">
                      {result.summary.keyDifferences.map((diff, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.07 }}
                          className="flex items-start gap-3 text-sm text-white/45 leading-relaxed"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4DD6C8]" />
                          {diff}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/20 text-center py-2">No comparison data available</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComparePage;