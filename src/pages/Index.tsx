import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  TrendingUp,
  Globe,
  Calculator,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Users,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';

const FEATURES = [
  {
    icon: Calculator,
    title: 'Comprehensive Calculator',
    description: 'Factor in tuition, living costs, loans, and opportunity cost for accurate ROI.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Compare education costs and outcomes across 50+ countries worldwide.',
  },
  {
    icon: BarChart3,
    title: 'Visual Insights',
    description: 'Interactive charts showing cost breakdowns and lifetime earnings projections.',
  },
  {
    icon: TrendingUp,
    title: 'Career Projections',
    description: 'See break-even timelines and annualized returns on your education investment.',
  },
];

const STATS = [
  { value: '50+', label: 'Countries', icon: Globe },
  { value: '200+', label: 'Majors', icon: BookOpen },
  { value: '1M+', label: 'Calculations', icon: Calculator },
  { value: '$2.4T', label: 'Analyzed', icon: DollarSign },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(160_84%_39%_/_0.1),_transparent_60%)]" />
        <div className="container relative py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                <TrendingUp className="h-3.5 w-3.5" />
                Trusted by 1M+ students worldwide
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold leading-tight text-gradient-hero md:text-5xl lg:text-6xl"
            >
              Is Your Degree{' '}
              <span className="text-gradient-accent">Worth the Investment?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/70"
            >
              Calculate the true return on your education investment. Compare universities,
              majors, and countries to make data-driven decisions about your future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Link to="/calculator">
                <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-hero px-8 text-base font-semibold">
                  Calculate Your ROI
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/majors">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-base">
                  Browse Majors
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 32C840 40 960 48 1080 44C1200 40 1320 24 1380 16L1440 8V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(210 20% 98%)" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-4 relative z-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-xl bg-card p-6 text-center shadow-card"
            >
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-accent" />
              <div className="text-2xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <AdSlot slot="header" className="container mt-8" />

      {/* Features */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Everything you need to decide <span className="text-gradient-accent">smarter</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our comprehensive tools analyze every factor that impacts your education ROI.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-card-hover"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Three steps to <span className="text-gradient-accent">clarity</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Enter Your Details', desc: 'Tell us about your education plans — country, major, university, and costs.' },
              { step: '02', title: 'Get Your Analysis', desc: 'Our engine calculates costs, projections, and break-even timelines instantly.' },
              { step: '03', title: 'Make Your Decision', desc: 'Compare options, share results, and invest in your future with confidence.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative rounded-xl border border-border bg-background p-6"
              >
                <span className="text-5xl font-extrabold text-accent/10">{item.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gradient-hero rounded-2xl p-10 text-center md:p-16"
        >
          <h2 className="text-3xl font-bold text-gradient-hero md:text-4xl">
            Ready to calculate your education ROI?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
            Join over a million students making smarter education investment decisions.
          </p>
          <Link to="/calculator">
            <Button size="lg" className="mt-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base font-semibold">
              Start Free Calculator
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
