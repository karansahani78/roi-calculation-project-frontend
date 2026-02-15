import { motion } from 'framer-motion';
import { BookOpen, Star, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { fetchMajors } from '@/lib/api';
import type { MajorDto } from '@/types/api';
import { AmbientParticles } from '@/components/effects/AmbientParticles';
import { FilmGrain } from '@/components/effects/FilmGrain';

const CATEGORY_COLORS: Record<string, string> = {
  STEM: 'bg-[#4DD6C8]/15 text-[#4DD6C8] border-[#4DD6C8]/20',
  Business: 'bg-[#FF9F43]/15 text-[#FF9F43] border-[#FF9F43]/20',
  Health: 'bg-[#D16BA5]/15 text-[#D16BA5] border-[#D16BA5]/20',
  'Social Sciences': 'bg-[#4C6FFF]/15 text-[#4C6FFF] border-[#4C6FFF]/20',
};

const MajorsPage = () => {
  const { data: majors, isLoading, isError, error } = useQuery<MajorDto[]>({
    queryKey: ['majors'],
    queryFn: () => fetchMajors(),
  });

  return (
    <div className="relative min-h-screen results-dark-bg">
      <AmbientParticles count={40} color="#4DD6C8" maxOpacity={0.25} />
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
            Explore Majors & <span className="text-gradient-mint">Career Outcomes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-auto mt-3 max-w-lg text-white/40"
          >
            Compare salary potential, job growth, and demand across fields of study.
          </motion.p>
        </div>
      </section>

      <div className="container pb-16 relative z-10">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C77DFF]" />
            <span className="ml-3 text-white/40">Loading majors...</span>
          </div>
        )}

        {isError && (
          <div className="mx-auto max-w-md glass-card p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-[#FF7849]" />
            <h2 className="mt-3 font-semibold text-white">Backend Unavailable</h2>
            <p className="mt-1 text-sm text-white/40">
              {error instanceof Error ? error.message : 'Could not load majors from the server.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && majors && majors.length === 0 && (
          <div className="py-20 text-center text-white/40">No data available</div>
        )}

        {majors && majors.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {majors.map((major, i) => (
              <motion.div
                key={major.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/calculator?major=${major.id}`}
                  className="group glass-card glass-card-hover flex flex-col p-5 transition-all duration-300 hover:glow-mint"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-mint">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-[#4DD6C8] transition-colors">{major.name}</h3>
                        <Badge variant="outline" className={`mt-1 text-xs border ${CATEGORY_COLORS[major.category] || 'bg-white/5 text-white/50 border-white/10'}`}>
                          {major.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="font-semibold text-white">${major.avgGlobalSalary?.toLocaleString()}</div>
                      <div className="text-white/30">Avg Salary</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#4DD6C8]">+{major.jobGrowthRate}%</div>
                      <div className="text-white/30">Growth</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-0.5 font-semibold text-[#FF9F43]">
                        <Star className="h-3 w-3" />{major.demandScore}
                      </div>
                      <div className="text-white/30">Demand</div>
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
