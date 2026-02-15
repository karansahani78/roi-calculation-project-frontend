import { motion } from 'framer-motion';
import { Globe, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const COUNTRIES = [
  { code: 'US', name: 'United States', region: 'North America', avgTuition: '$35,000', costIndex: 100 },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', avgTuition: '£9,250', costIndex: 85 },
  { code: 'CA', name: 'Canada', region: 'North America', avgTuition: 'CA$25,000', costIndex: 78 },
  { code: 'AU', name: 'Australia', region: 'Oceania', avgTuition: 'AU$30,000', costIndex: 82 },
  { code: 'DE', name: 'Germany', region: 'Europe', avgTuition: '€500', costIndex: 65 },
  { code: 'IN', name: 'India', region: 'Asia', avgTuition: '₹200,000', costIndex: 25 },
  { code: 'SG', name: 'Singapore', region: 'Asia', avgTuition: 'S$30,000', costIndex: 90 },
  { code: 'NL', name: 'Netherlands', region: 'Europe', avgTuition: '€2,200', costIndex: 73 },
  { code: 'JP', name: 'Japan', region: 'Asia', avgTuition: '¥535,800', costIndex: 70 },
];

const CountriesPage = () => (
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COUNTRIES.map((country, i) => (
          <motion.div
            key={country.code}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
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
                  <DollarSign className="h-3.5 w-3.5" /> Avg: {country.avgTuition}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" /> COL: {country.costIndex}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default CountriesPage;
