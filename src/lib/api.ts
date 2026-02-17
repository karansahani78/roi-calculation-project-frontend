import axios from 'axios';
import type {
  ApiResponse,
  CountryDto,
  MajorDto,
  UniversityDto,
  DegreeLevelDto,
  CurrencyDto,
  RoiCalculationRequest,
  RoiCalculationResponse,
  SeoPageDto,
  CompareRequest,
  CompareResponse,
  SimulationRequest,
  SimulationResponse,
  CareerIntelligenceRequest,
  CareerIntelligenceResponse,
  DecisionConfidenceRequest,
  DecisionConfidenceResponse,
  DegreeWorthItResponse,
} from '@/types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'https://719f-111-119-37-34.ngrok-free.app';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data: response } = await promise;
  if (!response.success || !response.data) {
    throw new Error(response.message || response.errors?.join(', ') || 'API Error');
  }
  return response.data;
}

// Reference Data
export const fetchCountries = () => unwrap<CountryDto[]>(client.get('/api/v1/data/countries'));
export const fetchMajors = (category?: string) =>
  unwrap<MajorDto[]>(client.get('/api/v1/data/majors', { params: category ? { category } : {} }));
export const fetchUniversities = (countryId: number) =>
  unwrap<UniversityDto[]>(client.get('/api/v1/data/universities', { params: { countryId } }));
export const fetchDegreeLevels = () => unwrap<DegreeLevelDto[]>(client.get('/api/v1/data/degree-levels'));
export const fetchCurrencies = () => unwrap<CurrencyDto[]>(client.get('/api/v1/data/currencies'));

// ROI Calculation
export const calculateRoi = (req: RoiCalculationRequest) =>
  unwrap<RoiCalculationResponse>(client.post('/api/v1/roi/calculate', req));
export const quickEstimateRoi = (req: RoiCalculationRequest) =>
  unwrap<RoiCalculationResponse>(client.post('/api/v1/roi/quick-estimate', req));

export const fetchSharedResult = async (uuid: string) => {
  const res = await client.get<ApiResponse<any>>(
    `/api/v1/roi/share/${uuid}`
  );

  const outer = res.data;

  if (!outer || !outer.success || !outer.data) {
    throw new Error(outer?.message || 'Failed to load shared result');
  }

  // 🧠 HANDLE BOTH SHAPES
  const payload = outer.data;

  // Case A: already RoiCalculationResponse
  if (payload.roiResults && payload.inputSummary) {
    return payload as RoiCalculationResponse;
  }

  // Case B: nested ApiResponse<RoiCalculationResponse>
  if (payload.success && payload.data?.roiResults) {
    return payload.data as RoiCalculationResponse;
  }

  throw new Error('Invalid shared result structure');
};

// Simulation
export const simulateRoi = (req: SimulationRequest) =>
  unwrap<SimulationResponse>(client.post('/api/v1/roi/simulate', req));

// Compare
export const compareOptions = (req: CompareRequest) =>
  unwrap<CompareResponse>(client.post('/api/v1/compare', req));

// Career Intelligence
export const fetchCareerIntelligence = (req: CareerIntelligenceRequest) =>
  unwrap<CareerIntelligenceResponse>(client.post('/api/v1/career/intelligence', req));

// Decision Confidence
export const fetchDecisionConfidence = (req: DecisionConfidenceRequest) =>
  unwrap<DecisionConfidenceResponse>(client.post('/api/v1/decision/confidence', req));

// PDF Report
export const downloadRoiPdf = async (uuid: string): Promise<Blob> => {
  const { data } = await client.get(`/api/v1/reports/roi/pdf/${uuid}`, {
    responseType: 'blob',
  });
  return data;
};

// Insights
export const fetchDegreeWorthIt = (params: {
  majorId: number;
  countryCode: string;
  currencyCode: string;
}) =>
  unwrap<DegreeWorthItResponse>(
    client.get('/api/v1/insights/degree-worth-it', {
      params,
    })
  );


// SEO Pages
export const fetchSeoPages = () => unwrap<SeoPageDto[]>(client.get('/api/v1/seo/pages'));
export const fetchSeoPage = (slug: string) => unwrap<SeoPageDto>(client.get(`/api/v1/seo/pages/${slug}`));