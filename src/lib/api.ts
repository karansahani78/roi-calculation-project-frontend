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
} from '@/types/api';

const API_BASE = import.meta.env.VITE_API_URL || 'https://4f6f-103-94-255-95.ngrok-free.app';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
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
export const fetchSharedResult = (uuid: string) =>
  unwrap<RoiCalculationResponse>(client.get(`/api/v1/roi/share/${uuid}`));

// SEO Pages
export const fetchSeoPages = () => unwrap<SeoPageDto[]>(client.get('/api/v1/seo/pages'));
export const fetchSeoPage = (slug: string) => unwrap<SeoPageDto>(client.get(`/api/v1/seo/pages/${slug}`));
