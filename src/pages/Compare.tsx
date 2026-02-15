import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompareArrows, Trophy, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
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

const OptionForm = ({
  label, option, onChange, countries, majors, degreeLevels, currencies,
}: {
  label: string;
  option: Partial<RoiCalculationRequest>;
  onChange: (opt: Partial<RoiCalculationRequest>) => void;
  countries: CountryDto[] | undefined;
  majors: any[] | undefined;
  degreeLevels: any[] | undefined;
  currencies: any[] | undefined;
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

  return (
    <div className={`glass-card p-6 flex-1 transition-all duration-300 ${complete ? 'glow-purple border-[#C77DFF]/20' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{label}</h3>
        {complete && <Badge className="bg-[#4DD6C8]/15 text-[#4DD6C8] border-[#4DD6C8]/20 border text-xs">Ready</Badge>}
      </div>
      <div className="space-y-4">
        {/* Education */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">Country</Label>
            <Select value={option.countryCode || ''} onValueChange={v => update('countryCode', v)}>
              <SelectTrigger className="h-9 text-sm glass-input"><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>{countries?.map(c => <SelectItem key={c.id} value={c.code}>{c.name}</SelectItem>)}{(!countries || countries.length === 0) && <SelectItem value="_none" disabled>No countries</SelectItem>}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">University (optional)</Label>
            <Select value={option.universityId ? String(option.universityId) : ''} onValueChange={v => update('universityId', parseInt(v))} disabled={!selectedCountry}>
              <SelectTrigger className="h-9 text-sm glass-input"><SelectValue placeholder={selectedCountry ? "Select university" : "Select country first"} /></SelectTrigger>
              <SelectContent>{universities?.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}{(!universities || universities.length === 0) && <SelectItem value="_none" disabled>No universities</SelectItem>}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/50">Major</Label>
              <Select value={option.majorId ? String(option.majorId) : ''} onValueChange={v => update('majorId', parseInt(v))}>
                <SelectTrigger className="h-9 text-sm glass-input"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{majors?.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}{(!majors || majors.length === 0) && <SelectItem value="_none" disabled>No majors</SelectItem>}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/50">Degree</Label>
              <Select value={option.degreeLevelId ? String(option.degreeLevelId) : ''} onValueChange={v => {
                const deg = degreeLevels?.find(d => d.id === parseInt(v));
                onChange({ ...option, degreeLevelId: parseInt(v), durationYears: deg?.typicalDurationYears || 4 });
              }}>
                <SelectTrigger className="h-9 text-sm glass-input"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{degreeLevels?.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}{(!degreeLevels || degreeLevels.length === 0) && <SelectItem value="_none" disabled>None</SelectItem>}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Costs & Income */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">Annual Tuition *</Label>
            <Input className="h-9 text-sm glass-input" type="number" min={0} value={option.tuitionAnnual || ''} onChange={e => numUpdate('tuitionAnnual', e.target.value)} placeholder="25000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">Living Cost / yr</Label>
            <Input className="h-9 text-sm glass-input" type="number" min={0} value={option.livingCostAnnual || ''} onChange={e => numUpdate('livingCostAnnual', e.target.value)} placeholder="15000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">Expected Salary *</Label>
            <Input className="h-9 text-sm glass-input" type="number" min={0} value={option.expectedSalaryAfter || ''} onChange={e => numUpdate('expectedSalaryAfter', e.target.value)} placeholder="75000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/50">Duration (yrs)</Label>
            <Input className="h-9 text-sm glass-input" type="number" min={1} max={10} value={option.durationYears || ''} onChange={e => numUpdate('durationYears', e.target.value)} />
          </div>
        </div>

        <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex w-full items-center justify-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors py-1">
          {showAdvanced ? 'Hide' : 'Show'} Advanced
          {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5"><Label className="text-xs text-white/50">Other Costs / yr</Label><Input className="h-9 text-sm glass-input" type="number" min={0} value={option.otherCostsAnnual || ''} onChange={e => numUpdate('otherCostsAnnual', e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-white/50">Loan Amount</Label><Input className="h-9 text-sm glass-input" type="number" min={0} value={option.loanAmount || ''} onChange={e => numUpdate('loanAmount', e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-white/50">Interest Rate %</Label><Input className="h-9 text-sm glass-input" type="number" min={0} max={30} step={0.1} value={option.interestRate || ''} onChange={e => numUpdate('interestRate', e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-white/50">Loan Term (yrs)</Label><Input className="h-9 text-sm glass-input" type="number" min={1} max={30} value={option.loanTermYears || ''} onChange={e => numUpdate('loanTermYears', e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-white/50">Part-time Income</Label><Input className="h-9 text-sm glass-input" type="number" min={0} value={option.partTimeIncomeAnnual || ''} onChange={e => numUpdate('partTimeIncomeAnnual', e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-white/50">Current Salary</Label><Input className="h-9 text-sm glass-input" type="number" min={0} value={option.currentSalary || ''} onChange={e => numUpdate('currentSalary', e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-white/50">Tax Rate %</Label><Input className="h-9 text-sm glass-input" type="number" min={0} max={60} value={option.taxRate || ''} onChange={e => numUpdate('taxRate', e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs text-white/50">Currency</Label>
                  <Select value={option.currencyCode || 'USD'} onValueChange={v => update('currencyCode', v)}>
                    <SelectTrigger className="h-9 text-sm glass-input"><SelectValue /></SelectTrigger>
                    <SelectContent>{currencies?.map(c => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>)}{(!currencies || currencies.length === 0) && <SelectItem value="_none" disabled>None</SelectItem>}</SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const VERDICT_DARK = {
  Excellent: { bg: 'bg-[#4DD6C8]/15', color: 'text-[#4DD6C8]', border: 'border-[#4DD6C8]/30' },
  Good: { bg: 'bg-[#9FE0C3]/15', color: 'text-[#9FE0C3]', border: 'border-[#9FE0C3]/30' },
  Fair: { bg: 'bg-[#FF9F43]/15', color: 'text-[#FF9F43]', border: 'border-[#FF9F43]/30' },
  Poor: { bg: 'bg-[#FF7849]/15', color: 'text-[#FF7849]', border: 'border-[#FF7849]/30' },
} as const;

const ResultCard = ({ label, result, isWinner }: { label: string; result: CompareResponse['optionA']; isWinner: boolean }) => {
  const verdict = result.roiResults.verdict;
  const vd = VERDICT_DARK[verdict];

  return (
    <div className={`glass-card p-6 flex-1 relative overflow-hidden transition-all duration-300 ${isWinner ? 'glow-mint border-[#4DD6C8]/30' : ''}`}>
      {isWinner && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-[#4DD6C8] to-[#9FE0C3] text-white px-3 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1">
          <Trophy className="h-3 w-3" /> Winner
        </div>
      )}
      <h3 className="text-lg font-bold text-white mb-4">{label}</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">Net ROI</span>
          <span className="text-xl font-bold text-gradient-rose">${result.roiResults.netRoi.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">ROI %</span>
          <span className="text-lg font-semibold text-white">{result.roiResults.roiPercentage}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">Break-even</span>
          <span className="text-lg font-semibold text-white">{result.roiResults.breakEvenYears} yrs</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">Annual Return</span>
          <span className="text-lg font-semibold text-white">{result.roiResults.annualizedReturn}%</span>
        </div>
        <Separator className="bg-white/5" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/40">Verdict</span>
          <Badge className={`${vd.bg} ${vd.color} ${vd.border} border text-xs`}>{VERDICT_CONFIG[verdict].label}</Badge>
        </div>
      </div>
    </div>
  );
};

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
        <div className="glass-card mx-auto max-w-md p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-[#FF7849]" />
          <h2 className="mt-3 font-semibold text-white">Backend Unavailable</h2>
          <p className="mt-1 text-sm text-white/40">Could not load reference data.</p>
        </div>
      </div>
    );
  }

  if (isRefLoading) {
    return (
      <div className="min-h-screen results-dark-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C77DFF]" />
        <span className="ml-3 text-white/40">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen results-dark-bg">
      <AmbientParticles count={30} color="#C77DFF" maxOpacity={0.2} />
      <FilmGrain opacity={0.02} />

      <section className="relative py-14">
        <div className="container text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-extrabold text-white md:text-4xl tracking-tight">
            Compare Education <span className="text-gradient-purple">Options</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="mx-auto mt-3 max-w-lg text-white/40">
            Side-by-side ROI comparison across programs, countries, and majors.
          </motion.p>
        </div>
      </section>

      <div className="container max-w-5xl pb-16 relative z-10">
        <div className="flex flex-col gap-6 md:flex-row">
          <OptionForm label="Option A" option={optionA} onChange={setOptionA} countries={countries} majors={majors} degreeLevels={degreeLevels} currencies={currencies} />
          <OptionForm label="Option B" option={optionB} onChange={setOptionB} countries={countries} majors={majors} degreeLevels={degreeLevels} currencies={currencies} />
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="gap-2 px-10 text-base font-semibold rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 hover:opacity-90 transition-opacity"
            disabled={!bothReady || loading}
            onClick={handleCompare}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GitCompareArrows className="h-5 w-5" />}
            {loading ? 'Comparing...' : 'Compare Now'}
          </Button>
          {!bothReady && (
            <p className="mt-2 text-xs text-white/30">Fill in both options to compare.</p>
          )}
        </div>

        {error && (
          <div className="mt-6 glass-card p-4 text-sm text-[#FF7849] text-center border-[#FF7849]/20">
            <AlertCircle className="inline h-4 w-4 mr-1" />{error}
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-10 space-y-8">
              <h2 className="text-2xl font-bold text-white text-center">Comparison Results</h2>

              <div className="flex flex-col gap-6 md:flex-row">
                <ResultCard label="Option A" result={result.optionA} isWinner={result.summary.winner === 'A'} />
                <ResultCard label="Option B" result={result.optionB} isWinner={result.summary.winner === 'B'} />
              </div>

              {/* Summary */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-[#4DD6C8]" /> Key Differences
                </h3>
                <div className="grid gap-3 sm:grid-cols-3 mb-4">
                  {[
                    { label: 'ROI Difference', value: `$${Math.abs(result.summary.roiDifference).toLocaleString()}` },
                    { label: 'Cost Difference', value: `$${Math.abs(result.summary.costDifference).toLocaleString()}` },
                    { label: 'Break-even Diff', value: `${Math.abs(result.summary.breakEvenDifference)} yrs` },
                  ].map(item => (
                    <div key={item.label} className="glass-subtle p-3 text-center">
                      <p className="text-xs text-white/30">{item.label}</p>
                      <p className="text-lg font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2">
                  {result.summary.keyDifferences.map((diff, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4DD6C8]" />
                      {diff}
                    </li>
                  ))}
                </ul>
                {result.summary.keyDifferences.length === 0 && (
                  <p className="text-sm text-white/30 text-center">No comparison data available</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComparePage;
