import { motion } from 'framer-motion';
import { Globe, TrendingUp, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCountries } from '@/lib/api';
import type { CountryDto } from '@/types/api';

const CountriesPage = () => {
  const { data: countries, isLoading, isError, error } = useQuery<CountryDto[]>({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-12">
        <div className="container text-center">
          <h1 className="text-3xl font-extrabold text-gradient-hero md:text-4xl">
            Explore Education by Country
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Compare tuition costs, living expenses, and ROI across countries worldwide.
          </p>
        </div>
      </div>

      <div className="container py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-3 text-muted-foreground">Loading countries...</span>
          </div>
        )}

        {isError && (
          <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
            <h2 className="mt-3 font-semibold text-foreground">Backend Unavailable</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Could not load countries from the server.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && countries && countries.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">No data available</div>
        )}

        {countries && countries.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country, i) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/calculator?country=${country.code}`}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{country.name}</h3>
                      <span className="text-xs text-muted-foreground">{country.region}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5" /> {country.currencyCode}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
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
