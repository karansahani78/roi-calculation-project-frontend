import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, GraduationCap, DollarSign, Briefcase, Settings2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { fetchCountries, fetchMajors, fetchDegreeLevels, fetchCurrencies, fetchUniversities, calculateRoi } from '@/lib/api';
import type { RoiCalculationRequest, CountryDto } from '@/types/api';

const STEPS = [
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'costs', label: 'Costs', icon: DollarSign },
  { id: 'income', label: 'Income', icon: Briefcase },
  { id: 'advanced', label: 'Advanced', icon: Settings2 },
];

const STORAGE_KEY = 'eduroi-calculator-form';

const defaultForm: Partial<RoiCalculationRequest> = {
  countryCode: '',
  majorId: undefined,
  degreeLevelId: undefined,
  tuitionAnnual: 0,
  livingCostAnnual: 0,
  otherCostsAnnual: 0,
  durationYears: 4,
  loanAmount: 0,
  interestRate: 5,
  loanTermYears: 10,
  partTimeIncomeAnnual: 0,
  expectedSalaryAfter: 0,
  currentSalary: 0,
  inflationRate: 3,
  taxRate: 25,
  calculationYears: 30,
  currencyCode: 'USD',
};

function loadForm(): Partial<RoiCalculationRequest> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultForm, ...JSON.parse(saved) };
  } catch {}
  return { ...defaultForm };
}

function saveForm(form: Partial<RoiCalculationRequest>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch {}
}

const CalculatorPage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<RoiCalculationRequest>>(loadForm);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Fetch reference data from backend
  const { data: countries, isLoading: countriesLoading, isError: countriesError } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });

  const { data: majors, isLoading: majorsLoading, isError: majorsError } = useQuery({
    queryKey: ['majors'],
    queryFn: () => fetchMajors(),
  });

  const { data: degreeLevels, isLoading: degreesLoading, isError: degreesError } = useQuery({
    queryKey: ['degree-levels'],
    queryFn: fetchDegreeLevels,
  });

  const { data: currencies, isLoading: currenciesLoading, isError: currenciesError } = useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
  });

  // Find selected country to get its ID for university fetch
  const selectedCountry = countries?.find((c: CountryDto) => c.code === form.countryCode);

  const { data: universities } = useQuery({
    queryKey: ['universities', selectedCountry?.id],
    queryFn: () => fetchUniversities(selectedCountry!.id),
    enabled: !!selectedCountry?.id,
  });

  // Pre-fill from URL params
  useEffect(() => {
    const countryParam = searchParams.get('country');
    const majorParam = searchParams.get('major');
    if (countryParam || majorParam) {
      setForm(prev => ({
        ...prev,
        ...(countryParam ? { countryCode: countryParam } : {}),
        ...(majorParam ? { majorId: parseInt(majorParam) } : {}),
      }));
    }
  }, [searchParams]);

  useEffect(() => { saveForm(form); }, [form]);

  const update = (key: keyof RoiCalculationRequest, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const numUpdate = (key: keyof RoiCalculationRequest, value: string) => {
    const num = parseFloat(value);
    update(key, isNaN(num) ? 0 : num);
  };

  const canNext = () => {
    if (step === 0) return form.countryCode && form.majorId && form.degreeLevelId;
    if (step === 1) return (form.tuitionAnnual || 0) > 0;
    if (step === 2) return (form.expectedSalaryAfter || 0) > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError(null);
    try {
      const result = await calculateRoi(form as RoiCalculationRequest);
      sessionStorage.setItem('eduroi-result', JSON.stringify(result));
      navigate(`/results/${result.uuid}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isReferenceLoading = countriesLoading || majorsLoading || degreesLoading || currenciesLoading;
  const hasReferenceError = countriesError || majorsError || degreesError || currenciesError;

  if (hasReferenceError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h2 className="mt-3 font-semibold text-foreground">Backend Unavailable</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Could not load reference data from the server. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (isReferenceLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <span className="ml-3 text-muted-foreground">Loading calculator data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-8 md:py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i <= step && setStep(i)}
                className={`flex flex-1 flex-col items-center gap-1 text-xs font-medium transition-colors ${
                  i <= step ? 'text-accent' : 'text-muted-foreground'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  i < step ? 'border-accent bg-accent text-accent-foreground' :
                  i === step ? 'border-accent bg-accent/10 text-accent' :
                  'border-border bg-muted text-muted-foreground'
                }`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card md:p-8"
          >
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Education Details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Tell us about your education plans.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select value={form.countryCode || ''} onValueChange={(v) => update('countryCode', v)}>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>
                        {countries && countries.length > 0 ? countries.map(c => (
                          <SelectItem key={c.id} value={c.code}>{c.name}</SelectItem>
                        )) : (
                          <SelectItem value="_none" disabled>No countries available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>University (optional)</Label>
                    <Select
                      value={form.universityId ? String(form.universityId) : ''}
                      onValueChange={(v) => update('universityId', parseInt(v))}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger><SelectValue placeholder={selectedCountry ? "Select university" : "Select country first"} /></SelectTrigger>
                      <SelectContent>
                        {universities && universities.length > 0 ? universities.map(u => (
                          <SelectItem key={u.id} value={String(u.id)}>{u.name} — {u.city}</SelectItem>
                        )) : (
                          <SelectItem value="_none" disabled>No universities available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Major</Label>
                    <Select value={form.majorId ? String(form.majorId) : ''} onValueChange={(v) => update('majorId', parseInt(v))}>
                      <SelectTrigger><SelectValue placeholder="Select major" /></SelectTrigger>
                      <SelectContent>
                        {majors && majors.length > 0 ? majors.map(m => (
                          <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                        )) : (
                          <SelectItem value="_none" disabled>No majors available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Degree Level</Label>
                    <Select value={form.degreeLevelId ? String(form.degreeLevelId) : ''} onValueChange={(v) => {
                      const deg = degreeLevels?.find(d => d.id === parseInt(v));
                      setForm(prev => ({ ...prev, degreeLevelId: parseInt(v), durationYears: deg?.typicalDurationYears || 4 }));
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                      <SelectContent>
                        {degreeLevels && degreeLevels.length > 0 ? degreeLevels.map(d => (
                          <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                        )) : (
                          <SelectItem value="_none" disabled>No degree levels available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (years)</Label>
                    <Input type="number" min={1} max={10} value={form.durationYears || ''} onChange={(e) => numUpdate('durationYears', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Cost Details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Enter your expected education costs.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Annual Tuition</Label>
                    <Input type="number" min={0} value={form.tuitionAnnual || ''} onChange={(e) => numUpdate('tuitionAnnual', e.target.value)} placeholder="e.g. 25000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Living Cost</Label>
                    <Input type="number" min={0} value={form.livingCostAnnual || ''} onChange={(e) => numUpdate('livingCostAnnual', e.target.value)} placeholder="e.g. 15000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Annual Costs</Label>
                    <Input type="number" min={0} value={form.otherCostsAnnual || ''} onChange={(e) => numUpdate('otherCostsAnnual', e.target.value)} placeholder="e.g. 3000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Amount</Label>
                    <Input type="number" min={0} value={form.loanAmount || ''} onChange={(e) => numUpdate('loanAmount', e.target.value)} placeholder="e.g. 50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input type="number" min={0} max={30} step={0.1} value={form.interestRate || ''} onChange={(e) => numUpdate('interestRate', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Term (years)</Label>
                    <Input type="number" min={1} max={30} value={form.loanTermYears || ''} onChange={(e) => numUpdate('loanTermYears', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Income Details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Enter your income expectations.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Expected Salary After Graduation</Label>
                    <Input type="number" min={0} value={form.expectedSalaryAfter || ''} onChange={(e) => numUpdate('expectedSalaryAfter', e.target.value)} placeholder="e.g. 75000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Salary</Label>
                    <Input type="number" min={0} value={form.currentSalary || ''} onChange={(e) => numUpdate('currentSalary', e.target.value)} placeholder="e.g. 30000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Part-time Income During Studies</Label>
                    <Input type="number" min={0} value={form.partTimeIncomeAnnual || ''} onChange={(e) => numUpdate('partTimeIncomeAnnual', e.target.value)} placeholder="e.g. 8000" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Advanced Settings</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Fine-tune your calculation parameters.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input type="number" min={0} max={60} value={form.taxRate || ''} onChange={(e) => numUpdate('taxRate', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Inflation Rate (%)</Label>
                    <Input type="number" min={0} max={20} step={0.1} value={form.inflationRate || ''} onChange={(e) => numUpdate('inflationRate', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Calculation Period (years)</Label>
                    <Input type="number" min={5} max={50} value={form.calculationYears || ''} onChange={(e) => numUpdate('calculationYears', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={form.currencyCode || 'USD'} onValueChange={(v) => update('currencyCode', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {currencies && currencies.length > 0 ? currencies.map(c => (
                          <SelectItem key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</SelectItem>
                        )) : (
                          <SelectItem value="_none" disabled>No currencies available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Submit Error */}
        {submitError && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating...
                </span>
              ) : (
                <>Calculate ROI <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
