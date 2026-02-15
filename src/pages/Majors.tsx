import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Star, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { fetchMajors } from '@/lib/api';
import type { MajorDto } from '@/types/api';

const CATEGORY_COLORS: Record<string, string> = {
  STEM: 'bg-accent/10 text-accent',
  Business: 'bg-gold/10 text-gold',
  Health: 'bg-destructive/10 text-destructive',
  'Social Sciences': 'bg-navy-light/10 text-navy-light',
};

const MajorsPage = () => {
  const { data: majors, isLoading, isError, error } = useQuery<MajorDto[]>({
    queryKey: ['majors'],
    queryFn: () => fetchMajors(),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero py-12">
        <div className="container text-center">
          <h1 className="text-3xl font-extrabold text-gradient-hero md:text-4xl">
            Explore Majors & Career Outcomes
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Compare salary potential, job growth, and demand across fields of study.
          </p>
        </div>
      </div>

      <div className="container py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-3 text-muted-foreground">Loading majors...</span>
          </div>
        )}

        {isError && (
          <div className="mx-auto max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
            <h2 className="mt-3 font-semibold text-foreground">Backend Unavailable</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Could not load majors from the server.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && majors && majors.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">No data available</div>
        )}

        {majors && majors.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {majors.map((major, i) => (
              <motion.div
                key={major.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/calculator?major=${major.id}`}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{major.name}</h3>
                        <Badge variant="secondary" className={`mt-1 text-xs ${CATEGORY_COLORS[major.category] || ''}`}>
                          {major.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="font-semibold text-foreground">${major.avgGlobalSalary?.toLocaleString()}</div>
                      <div className="text-muted-foreground">Avg Salary</div>
                    </div>
                    <div>
                      <div className="font-semibold text-accent">+{major.jobGrowthRate}%</div>
                      <div className="text-muted-foreground">Growth</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-0.5 font-semibold text-gold">
                        <Star className="h-3 w-3" />{major.demandScore}
                      </div>
                      <div className="text-muted-foreground">Demand</div>
                    </div>
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

export default MajorsPage;
