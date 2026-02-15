import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompareArrows, Trophy, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { fetchCountries, fetchMajors, fetchDegreeLevels, fetchCurrencies, fetchUniversities, compareOptions } from '@/lib/api';
import type { RoiCalculationRequest, CountryDto, CompareResponse } from '@/types/api';
import { VERDICT_CONFIG } from '@/types/api';

const defaultOption: Partial<RoiCalculationRequest> = {
  countryCode: '',
  majorId: undefined,
  degreeLevelId: undefined,
  tuitionAnnual: 0,
  livingCostAnnual: 0,
  otherCostsAnnual: 0,
  durationYears: 4,
  loanAmount: 0,
  interestRate: 0,
  loanTermYears: 10,
  partTimeIncomeAnnual: 0,
  expectedSalaryAfter: 0,
  currentSalary: 0,
  inflationRate: 3,
  taxRate: 25,
  calculationYears: 10,
  currencyCode: 'USD',
};

function isOptionComplete(opt: Partial<RoiCalculationRequest>) {
  return !!(opt.countryCode && opt.majorId && opt.degreeLevelId && (opt.tuitionAnnual || 0) > 0 && (opt.expectedSalaryAfter || 0) > 0);
}

const OptionForm = ({
  label,
  option,
  onChange,
  countries,
  majors,
  degreeLevels,
  currencies,
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

  const update = (key: keyof RoiCalculationRequest, value: string | number) => {
    onChange({ ...option, [key]: value });
  };
  const numUpdate = (key: keyof RoiCalculationRequest, value: string) => {
    const num = parseFloat(value);
    update(key, isNaN(num) ? 0 : num);
  };

  const complete = isOptionComplete(option);

  return (
    <Card className={`flex-1 transition-all ${complete ? 'border-accent/40 shadow-card-hover' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{label}</CardTitle>
          {complete && <Badge className="bg-accent text-accent-foreground text-xs">Ready</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Education */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Country</Label>
            <Select value={option.countryCode || ''} onValueChange={v => update('countryCode', v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                {countries?.map(c => <SelectItem key={c.id} value={c.code}>{c.name}</SelectItem>)}
                {(!countries || countries.length === 0) && <SelectItem value="_none" disabled>No countries</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">University (optional)</Label>
            <Select
              value={option.universityId ? String(option.universityId) : ''}
              onValueChange={v => update('universityId', parseInt(v))}
              disabled={!selectedCountry}
            >
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={selectedCountry ? "Select university" : "Select country first"} /></SelectTrigger>
              <SelectContent>
                {universities?.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                {(!universities || universities.length === 0) && <SelectItem value="_none" disabled>No universities</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Major</Label>
              <Select value={option.majorId ? String(option.majorId) : ''} onValueChange={v => update('majorId', parseInt(v))}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {majors?.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                  {(!majors || majors.length === 0) && <SelectItem value="_none" disabled>No majors</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Degree</Label>
              <Select value={option.degreeLevelId ? String(option.degreeLevelId) : ''} onValueChange={v => {
                const deg = degreeLevels?.find(d => d.id === parseInt(v));
                onChange({ ...option, degreeLevelId: parseInt(v), durationYears: deg?.typicalDurationYears || 4 });
              }}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {degreeLevels?.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                  {(!degreeLevels || degreeLevels.length === 0) && <SelectItem value="_none" disabled>None</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Costs & Income */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Annual Tuition *</Label>
            <Input className="h-9 text-sm" type="number" min={0} value={option.tuitionAnnual || ''} onChange={e => numUpdate('tuitionAnnual', e.target.value)} placeholder="25000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Living Cost / yr</Label>
            <Input className="h-9 text-sm" type="number" min={0} value={option.livingCostAnnual || ''} onChange={e => numUpdate('livingCostAnnual', e.target.value)} placeholder="15000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Expected Salary *</Label>
            <Input className="h-9 text-sm" type="number" min={0} value={option.expectedSalaryAfter || ''} onChange={e => numUpdate('expectedSalaryAfter', e.target.value)} placeholder="75000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Duration (yrs)</Label>
            <Input className="h-9 text-sm" type="number" min={1} max={10} value={option.durationYears || ''} onChange={e => numUpdate('durationYears', e.target.value)} />
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced
          {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Other Costs / yr</Label>
                  <Input className="h-9 text-sm" type="number" min={0} value={option.otherCostsAnnual || ''} onChange={e => numUpdate('otherCostsAnnual', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Loan Amount</Label>
                  <Input className="h-9 text-sm" type="number" min={0} value={option.loanAmount || ''} onChange={e => numUpdate('loanAmount', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Interest Rate %</Label>
                  <Input className="h-9 text-sm" type="number" min={0} max={30} step={0.1} value={option.interestRate || ''} onChange={e => numUpdate('interestRate', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Loan Term (yrs)</Label>
                  <Input className="h-9 text-sm" type="number" min={1} max={30} value={option.loanTermYears || ''} onChange={e => numUpdate('loanTermYears', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Part-time Income</Label>
                  <Input className="h-9 text-sm" type="number" min={0} value={option.partTimeIncomeAnnual || ''} onChange={e => numUpdate('partTimeIncomeAnnual', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Current Salary</Label>
                  <Input className="h-9 text-sm" type="number" min={0} value={option.currentSalary || ''} onChange={e => numUpdate('currentSalary', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tax Rate %</Label>
                  <Input className="h-9 text-sm" type="number" min={0} max={60} value={option.taxRate || ''} onChange={e => numUpdate('taxRate', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Currency</Label>
                  <Select value={option.currencyCode || 'USD'} onValueChange={v => update('currencyCode', v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {currencies?.map(c => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>)}
                      {(!currencies || currencies.length === 0) && <SelectItem value="_none" disabled>None</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const ResultCard = ({ label, result, isWinner }: { label: string; result: CompareResponse['optionA']; isWinner: boolean }) => {
  const verdict = result.roiResults.verdict;
  const config = VERDICT_CONFIG[verdict];

  return (
    <Card className={`flex-1 relative overflow-hidden transition-all ${isWinner ? 'border-accent ring-2 ring-accent/20' : ''}`}>
      {isWinner && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1">
          <Trophy className="h-3 w-3" /> Winner
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Net ROI</span>
            <span className="text-xl font-bold text-foreground">
              ${result.roiResults.netRoi.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ROI %</span>
            <span className="text-lg font-semibold text-foreground">{result.roiResults.roiPercentage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Break-even</span>
            <span className="text-lg font-semibold text-foreground">{result.roiResults.breakEvenYears} yrs</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Annual Return</span>
            <span className="text-lg font-semibold text-foreground">{result.roiResults.annualizedReturn}%</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Verdict</span>
            <Badge className={`${config.bg} ${config.color} border-0`}>{config.label}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
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
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await compareOptions({
        optionA: optionA as RoiCalculationRequest,
        optionB: optionB as RoiCalculationRequest,
        comparisonType: 'university',
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (hasRefError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h2 className="mt-3 font-semibold text-foreground">Backend Unavailable</h2>
          <p className="mt-1 text-sm text-muted-foreground">Could not load reference data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (isRefLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <span className="ml-3 text-muted-foreground">Loading data...</span>
      </div>
    );
  }

  return (
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

      <div className="container max-w-5xl py-8">
        {/* Option Forms */}
        <div className="flex flex-col gap-6 md:flex-row">
          <OptionForm label="Option A" option={optionA} onChange={setOptionA} countries={countries} majors={majors} degreeLevels={degreeLevels} currencies={currencies} />
          <OptionForm label="Option B" option={optionB} onChange={setOptionB} countries={countries} majors={majors} degreeLevels={degreeLevels} currencies={currencies} />
        </div>

        {/* Compare Button */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-10 text-base font-semibold"
            disabled={!bothReady || loading}
            onClick={handleCompare}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GitCompareArrows className="h-5 w-5" />}
            {loading ? 'Comparing...' : 'Compare Now'}
          </Button>
          {!bothReady && (
            <p className="mt-2 text-xs text-muted-foreground">
              Fill in both options (country, major, degree, tuition, expected salary) to compare.
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive text-center">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            {error}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 space-y-8"
            >
              <h2 className="text-2xl font-bold text-foreground text-center">Comparison Results</h2>

              <div className="flex flex-col gap-6 md:flex-row">
                <ResultCard label="Option A" result={result.optionA} isWinner={result.summary.winner === 'A'} />
                <ResultCard label="Option B" result={result.optionB} isWinner={result.summary.winner === 'B'} />
              </div>

              {/* Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-accent" />
                    Key Differences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-3 mb-4">
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-xs text-muted-foreground">ROI Difference</p>
                      <p className="text-lg font-bold text-foreground">${Math.abs(result.summary.roiDifference).toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-xs text-muted-foreground">Cost Difference</p>
                      <p className="text-lg font-bold text-foreground">${Math.abs(result.summary.costDifference).toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-xs text-muted-foreground">Break-even Diff</p>
                      <p className="text-lg font-bold text-foreground">{Math.abs(result.summary.breakEvenDifference)} yrs</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {result.summary.keyDifferences.map((diff, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {diff}
                      </li>
                    ))}
                  </ul>
                  {result.summary.keyDifferences.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">No comparison data available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComparePage;
