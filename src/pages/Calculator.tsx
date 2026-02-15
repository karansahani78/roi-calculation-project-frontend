import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, GraduationCap, DollarSign, Briefcase, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RoiCalculationRequest, RoiCalculationResponse } from '@/types/api';

const STEPS = [
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'costs', label: 'Costs', icon: DollarSign },
  { id: 'income', label: 'Income', icon: Briefcase },
  { id: 'advanced', label: 'Advanced', icon: Settings2 },
];

const STORAGE_KEY = 'eduroi-calculator-form';

const SAMPLE_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
];

const SAMPLE_MAJORS = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Business Administration' },
  { id: 3, name: 'Engineering' },
  { id: 4, name: 'Medicine' },
  { id: 5, name: 'Economics' },
  { id: 6, name: 'Data Science' },
];

const SAMPLE_DEGREES = [
  { id: 1, name: "Bachelor's", years: 4 },
  { id: 2, name: "Master's", years: 2 },
  { id: 3, name: 'PhD', years: 5 },
  { id: 4, name: 'Associate', years: 2 },
];

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

// Mock calculation for demo
function mockCalculate(form: Partial<RoiCalculationRequest>): RoiCalculationResponse {
  const tuition = (form.tuitionAnnual || 0) * (form.durationYears || 4);
  const living = (form.livingCostAnnual || 0) * (form.durationYears || 4);
  const other = (form.otherCostsAnnual || 0) * (form.durationYears || 4);
  const totalCost = tuition + living + other;
  const salary = form.expectedSalaryAfter || 50000;
  const currentSalary = form.currentSalary || 0;
  const years = form.calculationYears || 30;
  const lifetimeEarnings = salary * years;
  const lifetimeWithout = currentSalary * (years + (form.durationYears || 4));
  const netRoi = lifetimeEarnings - totalCost - lifetimeWithout;
  const roiPct = totalCost > 0 ? (netRoi / totalCost) * 100 : 0;
  const breakEven = salary > currentSalary ? totalCost / (salary - currentSalary) : 99;

  const verdict: RoiCalculationResponse['roiResults']['verdict'] =
    roiPct > 300 ? 'Excellent' : roiPct > 150 ? 'Good' : roiPct > 50 ? 'Fair' : 'Poor';

  const yearlyBreakdown = Array.from({ length: Math.min(years, 20) }, (_, i) => ({
    year: i + 1,
    cumulativeInvestment: i < (form.durationYears || 4) ? (totalCost / (form.durationYears || 4)) * (i + 1) : totalCost,
    cumulativeEarnings: i < (form.durationYears || 4) ? (form.partTimeIncomeAnnual || 0) * (i + 1) : (form.partTimeIncomeAnnual || 0) * (form.durationYears || 4) + salary * (i + 1 - (form.durationYears || 4)),
    netPosition: 0,
  })).map(y => ({ ...y, netPosition: y.cumulativeEarnings - y.cumulativeInvestment }));

  return {
    uuid: crypto.randomUUID(),
    shareableUrl: `/results/demo`,
    inputSummary: {
      country: SAMPLE_COUNTRIES.find(c => c.code === form.countryCode)?.name || 'Unknown',
      university: 'Selected University',
      major: SAMPLE_MAJORS.find(m => m.id === form.majorId)?.name || 'Unknown',
      degreeLevel: SAMPLE_DEGREES.find(d => d.id === form.degreeLevelId)?.name || 'Unknown',
      durationYears: form.durationYears || 4,
      currencyCode: form.currencyCode || 'USD',
      currencySymbol: '$',
    },
    costBreakdown: {
      tuitionTotal: tuition,
      livingCostTotal: living,
      otherCostsTotal: other,
      loanInterest: (form.loanAmount || 0) * (form.interestRate || 5) / 100 * (form.loanTermYears || 10) / 2,
      totalEducationCost: totalCost,
      opportunityCost: currentSalary * (form.durationYears || 4),
      totalInvestment: totalCost + currentSalary * (form.durationYears || 4),
    },
    incomeProjection: {
      partTimeIncomeTotal: (form.partTimeIncomeAnnual || 0) * (form.durationYears || 4),
      lifetimeEarnings,
      lifetimeEarningsWithoutDegree: lifetimeWithout,
      additionalLifetimeEarnings: lifetimeEarnings - lifetimeWithout,
    },
    roiResults: {
      netRoi: netRoi,
      roiPercentage: Math.round(roiPct),
      breakEvenYears: Math.round(breakEven * 10) / 10,
      annualizedReturn: years > 0 ? Math.round(roiPct / years * 10) / 10 : 0,
      verdict,
    },
    yearlyBreakdown,
    recommendations: [
      'Consider applying for scholarships to reduce tuition costs.',
      'Part-time work during studies can significantly improve your ROI.',
      'Look into countries with lower living costs for similar program quality.',
      'Consider starting with a community college to reduce initial costs.',
    ],
  };
}

const CalculatorPage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<RoiCalculationRequest>>(loadForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const result = mockCalculate(form);
      sessionStorage.setItem('eduroi-result', JSON.stringify(result));
      navigate(`/results/${result.uuid}`);
      setLoading(false);
    }, 1200);
  };

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
                        {SAMPLE_COUNTRIES.map(c => (
                          <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Major</Label>
                    <Select value={String(form.majorId || '')} onValueChange={(v) => update('majorId', parseInt(v))}>
                      <SelectTrigger><SelectValue placeholder="Select major" /></SelectTrigger>
                      <SelectContent>
                        {SAMPLE_MAJORS.map(m => (
                          <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Degree Level</Label>
                    <Select value={String(form.degreeLevelId || '')} onValueChange={(v) => {
                      const deg = SAMPLE_DEGREES.find(d => d.id === parseInt(v));
                      setForm(prev => ({ ...prev, degreeLevelId: parseInt(v), durationYears: deg?.years || 4 }));
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
                      <SelectContent>
                        {SAMPLE_DEGREES.map(d => (
                          <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                        ))}
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
                    <Label>Annual Tuition ($)</Label>
                    <Input type="number" min={0} value={form.tuitionAnnual || ''} onChange={(e) => numUpdate('tuitionAnnual', e.target.value)} placeholder="e.g. 25000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Living Cost ($)</Label>
                    <Input type="number" min={0} value={form.livingCostAnnual || ''} onChange={(e) => numUpdate('livingCostAnnual', e.target.value)} placeholder="e.g. 15000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Annual Costs ($)</Label>
                    <Input type="number" min={0} value={form.otherCostsAnnual || ''} onChange={(e) => numUpdate('otherCostsAnnual', e.target.value)} placeholder="e.g. 3000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Amount ($)</Label>
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
                    <Label>Expected Salary After Graduation ($)</Label>
                    <Input type="number" min={0} value={form.expectedSalaryAfter || ''} onChange={(e) => numUpdate('expectedSalaryAfter', e.target.value)} placeholder="e.g. 75000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Salary ($)</Label>
                    <Input type="number" min={0} value={form.currentSalary || ''} onChange={(e) => numUpdate('currentSalary', e.target.value)} placeholder="e.g. 30000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Part-time Income During Studies ($)</Label>
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
                        {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

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
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
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
