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
} from '@/types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'https://ec10-103-94-255-95.ngrok-free.app';

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
export const fetchSharedResult = (uuid: string) =>
  unwrap<RoiCalculationResponse>(client.get(`/api/v1/roi/share/${uuid}`));

// Compare
export const compareOptions = (req: CompareRequest) =>
  unwrap<CompareResponse>(client.post('/api/v1/compare', req));

// PDF Report
export const downloadRoiPdf = async (uuid: string): Promise<Blob> => {
  const { data } = await client.get(`/api/v1/reports/roi/pdf/${uuid}`, {
    responseType: 'blob',
  });
  return data;
};

// SEO Pages
export const fetchSeoPages = () => unwrap<SeoPageDto[]>(client.get('/api/v1/seo/pages'));
export const fetchSeoPage = (slug: string) => unwrap<SeoPageDto>(client.get(`/api/v1/seo/pages/${slug}`));
