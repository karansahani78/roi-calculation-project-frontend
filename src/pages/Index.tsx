import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  TrendingUp,
  Globe,
  Calculator,
  BarChart3,
  ArrowRight,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';

const FEATURES = [
  {
    icon: Calculator,
    title: 'Comprehensive Calculator',
    description: 'Factor in tuition, living costs, loans, and opportunity cost for accurate ROI.',
    gradient: 'gradient-purple',
    glow: 'glow-purple',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Compare education costs and outcomes across 50+ countries worldwide.',
    gradient: 'gradient-blue',
    glow: 'glow-blue',
  },
  {
    icon: BarChart3,
    title: 'Visual Insights',
    description: 'Interactive charts showing cost breakdowns and lifetime earnings projections.',
    gradient: 'gradient-mint',
    glow: 'glow-mint',
  },
  {
    icon: TrendingUp,
    title: 'Career Projections',
    description: 'See break-even timelines and annualized returns on your education investment.',
    gradient: 'gradient-rose',
    glow: 'glow-rose',
  },
];

const STATS = [
  { value: '50+', label: 'Countries', icon: Globe, gradient: 'gradient-blue' },
  { value: '200+', label: 'Majors', icon: BookOpen, gradient: 'gradient-purple' },
  { value: '1M+', label: 'Calculations', icon: Calculator, gradient: 'gradient-mint' },
  { value: '$2.4T', label: 'Analyzed', icon: DollarSign, gradient: 'gradient-rose' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="ambient-orb w-[500px] h-[500px] bg-[#C77DFF] top-[-100px] right-[-100px]" />
        <div className="ambient-orb w-[400px] h-[400px] bg-[#4DD6C8] bottom-[0px] left-[-100px]" />

        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-[#4DD6C8]" />
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
              <span className="text-gradient-purple">Worth the Investment?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
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
                <Button size="lg" className="gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 px-8 text-base font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25">
                  Calculate Your ROI
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/majors">
                <Button size="lg" variant="outline" className="gap-2 rounded-xl border-white/[0.1] text-foreground hover:bg-white/[0.05] px-8 text-base font-semibold">
                  Browse Majors
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container relative z-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card glass-card-hover p-6 text-center transition-all duration-300"
            >
              <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.gradient}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-2xl font-extrabold text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <AdSlot slot="header" className="container mt-8" />

      {/* Features */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Everything you need to decide <span className="text-gradient-mint">smarter</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our comprehensive tools analyze every factor that impacts your education ROI.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`glass-card glass-card-hover p-6 transition-all duration-300 ${feature.glow}`}
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.gradient}`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Three steps to <span className="text-gradient-purple">clarity</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Enter Your Details', desc: 'Tell us about your education plans — country, major, university, and costs.', gradient: 'text-gradient-purple' },
              { step: '02', title: 'Get Your Analysis', desc: 'Our engine calculates costs, projections, and break-even timelines instantly.', gradient: 'text-gradient-mint' },
              { step: '03', title: 'Make Your Decision', desc: 'Compare options, share results, and invest in your future with confidence.', gradient: 'text-gradient-blue' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="glass-card p-8 transition-all duration-300"
              >
                <span className={`text-5xl font-extrabold ${item.gradient} opacity-60`}>{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden glass-card p-12 text-center md:p-16 glow-purple"
        >
          <div className="ambient-orb w-[300px] h-[300px] bg-[#C77DFF] top-[-50px] right-[-50px]" />
          <div className="ambient-orb w-[200px] h-[200px] bg-[#4C6FFF] bottom-[-30px] left-[-30px]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Ready to calculate your education ROI?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Join over a million students making smarter education investment decisions.
            </p>
            <Link to="/calculator">
              <Button size="lg" className="mt-8 gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] text-white border-0 px-8 text-base font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25">
                Start Free Calculator
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
