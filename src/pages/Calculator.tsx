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
  { id: 'education', label: 'Education', icon: GraduationCap, gradient: 'gradient-purple', color: '#C77DFF' },
  { id: 'costs', label: 'Costs', icon: DollarSign, gradient: 'gradient-orange', color: '#FF9F43' },
  { id: 'income', label: 'Income', icon: Briefcase, gradient: 'gradient-mint', color: '#4DD6C8' },
  { id: 'advanced', label: 'Advanced', icon: Settings2, gradient: 'gradient-blue', color: '#4C6FFF' },
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

  const selectedCountry = countries?.find((c: CountryDto) => c.code === form.countryCode);

  const { data: universities } = useQuery({
    queryKey: ['universities', selectedCountry?.id],
    queryFn: () => fetchUniversities(selectedCountry!.id),
    enabled: !!selectedCountry?.id,
  });

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
        <div className="glass-card mx-auto max-w-md p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-[#FF7849]" />
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
        <Loader2 className="h-8 w-8 animate-spin text-[#C77DFF]" />
        <span className="ml-3 text-muted-foreground">Loading calculator data...</span>
      </div>
    );
  }

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="ambient-orb w-[400px] h-[400px] bg-[#C77DFF] top-[-100px] right-[-150px]" />
      <div className="ambient-orb w-[300px] h-[300px] bg-[#4DD6C8] bottom-[-50px] left-[-100px]" />

      <div className="container relative max-w-3xl py-10 md:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-extrabold text-foreground md:text-4xl tracking-tight">
            Education <span className="text-gradient-purple">ROI Calculator</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Calculate the return on your education investment</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i <= step && setStep(i)}
                className="flex flex-1 flex-col items-center gap-1.5 text-xs font-medium transition-all duration-300"
              >
                <motion.div
                  animate={{
                    scale: i === step ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                    i < step
                      ? `${s.gradient} shadow-lg`
                      : i === step
                      ? `${s.gradient} shadow-lg`
                      : 'bg-white/[0.05] border border-white/[0.08]'
                  }`}
                  style={i <= step ? { boxShadow: `0 0 20px ${s.color}30` } : {}}
                >
                  <s.icon className={`h-4.5 w-4.5 ${i <= step ? 'text-white' : 'text-muted-foreground'}`} />
                </motion.div>
                <span className={`hidden sm:inline transition-colors duration-300 ${
                  i <= step ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-1 rounded-full bg-white/[0.05]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7]"
              initial={false}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Form Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-7 md:p-9"
          >
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                    <div className="gradient-purple inline-flex rounded-xl p-2">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    Education Details
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground ml-11">Tell us about your education plans.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Country</Label>
                    <Select value={form.countryCode || ''} onValueChange={(v) => update('countryCode', v)}>
                      <SelectTrigger className="glass-input h-11"><SelectValue placeholder="Select country" /></SelectTrigger>
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
                    <Label className="text-sm text-muted-foreground">University (optional)</Label>
                    <Select
                      value={form.universityId ? String(form.universityId) : ''}
                      onValueChange={(v) => update('universityId', parseInt(v))}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="glass-input h-11"><SelectValue placeholder={selectedCountry ? "Select university" : "Select country first"} /></SelectTrigger>
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
                    <Label className="text-sm text-muted-foreground">Major</Label>
                    <Select value={form.majorId ? String(form.majorId) : ''} onValueChange={(v) => update('majorId', parseInt(v))}>
                      <SelectTrigger className="glass-input h-11"><SelectValue placeholder="Select major" /></SelectTrigger>
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
                    <Label className="text-sm text-muted-foreground">Degree Level</Label>
                    <Select value={form.degreeLevelId ? String(form.degreeLevelId) : ''} onValueChange={(v) => {
                      const deg = degreeLevels?.find(d => d.id === parseInt(v));
                      setForm(prev => ({ ...prev, degreeLevelId: parseInt(v), durationYears: deg?.typicalDurationYears || 4 }));
                    }}>
                      <SelectTrigger className="glass-input h-11"><SelectValue placeholder="Select degree" /></SelectTrigger>
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
                    <Label className="text-sm text-muted-foreground">Duration (years)</Label>
                    <Input type="number" min={1} max={10} value={form.durationYears || ''} onChange={(e) => numUpdate('durationYears', e.target.value)} className="glass-input h-11" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                    <div className="gradient-orange inline-flex rounded-xl p-2">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    Cost Details
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground ml-11">Enter your expected education costs.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Annual Tuition</Label>
                    <Input type="number" min={0} value={form.tuitionAnnual || ''} onChange={(e) => numUpdate('tuitionAnnual', e.target.value)} placeholder="e.g. 25000" className="glass-input h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Annual Living Cost</Label>
                    <Input type="number" min={0} value={form.livingCostAnnual || ''} onChange={(e) => numUpdate('livingCostAnnual', e.target.value)} placeholder="e.g. 15000" className="glass-input h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Other Annual Costs</Label>
                    <Input type="number" min={0} value={form.otherCostsAnnual || ''} onChange={(e) => numUpdate('otherCostsAnnual', e.target.value)} placeholder="e.g. 3000" className="glass-input h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Loan Amount</Label>
                    <Input type="number" min={0} value={form.loanAmount || ''} onChange={(e) => numUpdate('loanAmount', e.target.value)} placeholder="e.g. 50000" className="glass-input h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Interest Rate (%)</Label>
                    <Input type="number" min={0} max={30} step={0.1} value={form.interestRate || ''} onChange={(e) => numUpdate('interestRate', e.target.value)} className="glass-input h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Loan Term (years)</Label>
                    <Input type="number" min={1} max={30} value={form.loanTermYears || ''} onChange={(e) => numUpdate('loanTermYears', e.target.value)} className="glass-input h-11" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
             <div className="space-y-6">
             <div>
               <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                 <div className="gradient-mint inline-flex rounded-xl p-2">
                   <Briefcase className="h-4 w-4 text-white" />
                 </div>
                 Income Details
               </h2>
               <p className="mt-1 text-sm text-muted-foreground ml-11">
                 Enter your <strong>annual</strong> income expectations (before tax).
               </p>
             </div>
           
             <div className="grid gap-5 md:grid-cols-2">
               <div className="space-y-2">
                 <Label className="text-sm text-muted-foreground">
                   Expected Annual Salary After Graduation (Before Tax)
                 </Label>
                 <Input
                   type="number"
                   min={0}
                   value={form.expectedSalaryAfter || ''}
                   onChange={(e) => numUpdate('expectedSalaryAfter', e.target.value)}
                   placeholder="e.g. 75000 per year"
                   className="glass-input h-11"
                 />
               </div>
           
               <div className="space-y-2">
                 <Label className="text-sm text-muted-foreground">
                   Current Annual Salary (Before Tax)
                 </Label>
                 <Input
                   type="number"
                   min={0}
                   value={form.currentSalary || ''}
                   onChange={(e) => numUpdate('currentSalary', e.target.value)}
                   placeholder="e.g. 30000 per year"
                   className="glass-input h-11"
                 />
               </div>
           
               <div className="space-y-2">
                 <Label className="text-sm text-muted-foreground">
                   Part-time Income During Studies (Annual)
                 </Label>
                 <Input
                   type="number"
                   min={0}
                   value={form.partTimeIncomeAnnual || ''}
                   onChange={(e) => numUpdate('partTimeIncomeAnnual', e.target.value)}
                   placeholder="e.g. 8000 per year"
                   className="glass-input h-11"
                 />
               </div>
             </div>
           </div>
           
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                    <div className="gradient-blue inline-flex rounded-xl p-2">
                      <Settings2 className="h-4 w-4 text-white" />
                    </div>
                    Advanced Settings
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground ml-11">Fine-tune your calculation parameters.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Tax Rate (%)</Label>
                    <Input type="number" min={0} max={60} value={form.taxRate || ''} onChange={(e) => numUpdate('taxRate', e.target.value)} className="glass-input h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Inflation Rate (%)</Label>
                    <Input type="number" min={0} max={20} step={0.1} value={form.inflationRate || ''} onChange={(e) => numUpdate('inflationRate', e.target.value)} className="glass-input h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Calculation Period (years)</Label>
                    <Input type="number" min={5} max={50} value={form.calculationYears || ''} onChange={(e) => numUpdate('calculationYears', e.target.value)} className="glass-input h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Currency</Label>
                    <Select value={form.currencyCode || 'USD'} onValueChange={(v) => update('currencyCode', v)}>
                      <SelectTrigger className="glass-input h-11"><SelectValue /></SelectTrigger>
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 glass-card border-[#FF7849]/20 p-4 text-sm text-[#FF7849]"
          >
            {submitError}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="gap-2 rounded-xl border-white/[0.1] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 px-8 font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
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
