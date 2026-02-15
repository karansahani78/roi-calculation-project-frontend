import { motion } from 'framer-motion';
import { Globe, TrendingUp, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCountries } from '@/lib/api';
import type { CountryDto } from '@/types/api';
import { AmbientParticles } from '@/components/effects/AmbientParticles';
import { FilmGrain } from '@/components/effects/FilmGrain';

const CountriesPage = () => {
  const { data: countries, isLoading, isError, error } = useQuery<CountryDto[]>({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });

  return (
    <div className="relative min-h-screen results-dark-bg">
      <AmbientParticles count={35} color="#4C6FFF" maxOpacity={0.2} />
      <FilmGrain opacity={0.02} />

      {/* Hero */}
      <section className="relative py-14">
        <div className="container text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold text-white md:text-4xl tracking-tight"
          >
            Explore Education by <span className="text-gradient-blue">Country</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-auto mt-3 max-w-lg text-white/40"
          >
            Compare tuition costs, living expenses, and ROI across countries worldwide.
          </motion.p>
        </div>
      </section>

      <div className="container pb-16 relative z-10">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C77DFF]" />
            <span className="ml-3 text-white/40">Loading countries...</span>
          </div>
        )}

        {isError && (
          <div className="mx-auto max-w-md glass-card p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-[#FF7849]" />
            <h2 className="mt-3 font-semibold text-white">Backend Unavailable</h2>
            <p className="mt-1 text-sm text-white/40">
              {error instanceof Error ? error.message : 'Could not load countries from the server.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && countries && countries.length === 0 && (
          <div className="py-20 text-center text-white/40">No data available</div>
        )}

        {countries && countries.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country, i) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/calculator?country=${country.code}`}
                  className="group glass-card glass-card-hover flex flex-col p-5 transition-all duration-300 hover:glow-blue"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-blue">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-[#4C6FFF] transition-colors">{country.name}</h3>
                      <span className="text-xs text-white/30">{country.region}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <span className="flex items-center gap-1 text-white/40">
                      <DollarSign className="h-3.5 w-3.5" /> {country.currencyCode}
                    </span>
                    <span className="flex items-center gap-1 text-white/40">
                      <TrendingUp className="h-3.5 w-3.5" /> COL: {country.costOfLivingIndex}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountriesPage;
