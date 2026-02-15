import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const MAJORS = [
  { id: 1, name: 'Computer Science', slug: 'computer-science', category: 'STEM', avgSalary: '$95,000', growth: '+25%', demand: 95 },
  { id: 2, name: 'Business Administration', slug: 'business-admin', category: 'Business', avgSalary: '$72,000', growth: '+10%', demand: 78 },
  { id: 3, name: 'Mechanical Engineering', slug: 'mechanical-eng', category: 'STEM', avgSalary: '$88,000', growth: '+8%', demand: 82 },
  { id: 4, name: 'Medicine', slug: 'medicine', category: 'Health', avgSalary: '$120,000', growth: '+15%', demand: 98 },
  { id: 5, name: 'Economics', slug: 'economics', category: 'Business', avgSalary: '$78,000', growth: '+6%', demand: 72 },
  { id: 6, name: 'Data Science', slug: 'data-science', category: 'STEM', avgSalary: '$105,000', growth: '+35%', demand: 97 },
  { id: 7, name: 'Nursing', slug: 'nursing', category: 'Health', avgSalary: '$75,000', growth: '+12%', demand: 90 },
  { id: 8, name: 'Psychology', slug: 'psychology', category: 'Social Sciences', avgSalary: '$55,000', growth: '+5%', demand: 58 },
  { id: 9, name: 'Electrical Engineering', slug: 'electrical-eng', category: 'STEM', avgSalary: '$92,000', growth: '+7%', demand: 80 },
];

const CATEGORY_COLORS: Record<string, string> = {
  STEM: 'bg-accent/10 text-accent',
  Business: 'bg-gold/10 text-gold',
  Health: 'bg-destructive/10 text-destructive',
  'Social Sciences': 'bg-navy-light/10 text-navy-light',
};

const MajorsPage = () => (
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MAJORS.map((major, i) => (
          <motion.div
            key={major.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
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
                  <div className="font-semibold text-foreground">{major.avgSalary}</div>
                  <div className="text-muted-foreground">Avg Salary</div>
                </div>
                <div>
                  <div className="font-semibold text-accent">{major.growth}</div>
                  <div className="text-muted-foreground">Growth</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-0.5 font-semibold text-gold">
                    <Star className="h-3 w-3" />{major.demand}
                  </div>
                  <div className="text-muted-foreground">Demand</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default MajorsPage;
