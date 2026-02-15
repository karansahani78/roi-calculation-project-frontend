// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  timestamp: number;
}

// DTOs
export interface CountryDto {
  id: number;
  code: string;
  name: string;
  region: string;
  currencyCode: string;
  avgTaxRate: number;
  costOfLivingIndex: number;
}

export interface MajorDto {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  avgGlobalSalary: number;
  jobGrowthRate: number;
  demandScore: number;
}

export interface UniversityDto {
  id: number;
  name: string;
  slug: string;
  city: string;
  type: string;
  ranking: number;
  avgTuitionAnnual: number;
  currencyCode: string;
}

export interface DegreeLevelDto {
  id: number;
  name: string;
  slug: string;
  typicalDurationYears: number;
}

export interface CurrencyDto {
  code: string;
  name: string;
  symbol: string;
}

export interface RoiCalculationRequest {
  countryCode: string;
  universityId?: number;
  majorId: number;
  degreeLevelId: number;
  tuitionAnnual: number;
  livingCostAnnual?: number;
  otherCostsAnnual?: number;
  durationYears: number;
  loanAmount?: number;
  interestRate?: number;
  loanTermYears?: number;
  partTimeIncomeAnnual?: number;
  expectedSalaryAfter: number;
  currentSalary?: number;
  inflationRate?: number;
  taxRate: number;
  calculationYears?: number;
  currencyCode: string;
  userCountryCode?: string;
}

export interface RoiCalculationResponse {
  uuid: string;
  shareableUrl: string;
  inputSummary: {
    country: string;
    university: string;
    major: string;
    degreeLevel: string;
    durationYears: number;
    currencyCode: string;
    currencySymbol: string;
  };
  costBreakdown: {
    tuitionTotal: number;
    livingCostTotal: number;
    otherCostsTotal: number;
    loanInterest: number;
    totalEducationCost: number;
    opportunityCost: number;
    totalInvestment: number;
  };
  incomeProjection: {
    partTimeIncomeTotal: number;
    lifetimeEarnings: number;
    lifetimeEarningsWithoutDegree: number;
    additionalLifetimeEarnings: number;
  };
  roiResults: {
    netRoi: number;
    roiPercentage: number;
    breakEvenYears: number;
    annualizedReturn: number;
    verdict: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  };
  yearlyBreakdown: {
    year: number;
    cumulativeInvestment: number;
    cumulativeEarnings: number;
    netPosition: number;
  }[];
  recommendations: string[];
}

export interface SeoPageDto {
  slug: string;
  pageType: string;
  metaTitle: string;
  metaDescription: string;
  h1Title: string;
  canonicalUrl: string;
  defaultParams?: RoiCalculationRequest;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

// Compare DTOs
export interface CompareRequest {
  optionA: RoiCalculationRequest;
  optionB: RoiCalculationRequest;
  comparisonType: string;
}

export interface CompareOptionResult {
  roiResults: {
    netRoi: number;
    roiPercentage: number;
    breakEvenYears: number;
    annualizedReturn: number;
    verdict: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  };
}

export interface CompareSummary {
  winner: 'A' | 'B';
  roiDifference: number;
  costDifference: number;
  breakEvenDifference: number;
  keyDifferences: string[];
}

export interface CompareResponse {
  uuid: string;
  optionA: CompareOptionResult;
  optionB: CompareOptionResult;
  summary: CompareSummary;
}

// Verdict color mapping
export const VERDICT_CONFIG = {
  Excellent: { color: 'text-accent', bg: 'bg-emerald-light', label: 'Excellent ROI' },
  Good: { color: 'text-emerald', bg: 'bg-emerald-light', label: 'Good ROI' },
  Fair: { color: 'text-gold', bg: 'bg-gold-light', label: 'Fair ROI' },
  Poor: { color: 'text-destructive', bg: 'bg-destructive/10', label: 'Poor ROI' },
} as const;
