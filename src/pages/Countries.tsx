import { motion } from 'framer-motion';
import { Globe, TrendingUp, DollarSign, AlertCircle, Loader2, BookOpen, Users, Award, ArrowRight, ChevronRight } from 'lucide-react';
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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative py-16">
        <div className="container text-center relative z-10">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(76,111,255,0.12)', border: '1px solid rgba(76,111,255,0.25)', color: '#6B8FFF' }}
          >
            <Globe className="h-3.5 w-3.5" />
            Global Education ROI Database
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold text-white md:text-4xl tracking-tight"
          >
            Explore Education by <span className="text-gradient-blue">Country</span>
          </motion.h1>

          {/* Subtitle — bumped from /40 to /65 so it's actually readable */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mx-auto mt-4 max-w-lg text-base text-white/65 leading-relaxed"
          >
            Compare tuition costs, living expenses, and ROI across countries worldwide.
          </motion.p>

          {/* Keyword chips — SEO + AdSense topic signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap items-center justify-center gap-2.5 mt-6"
          >
            {[
              'Tuition Fees by Country',
              'Cost of Living Index',
              'Graduate Salary Data',
              'Student Loan ROI',
              'University Rankings',
            ].map(tag => (
              <span
                key={tag}
                className="text-xs text-white/55 px-3 py-1 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Stat row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="flex flex-wrap items-center justify-center gap-10 mt-10"
          >
            {[
              { icon: Globe,    value: '50+',    label: 'Countries'           },
              { icon: BookOpen, value: '1,200+', label: 'Universities'        },
              { icon: Users,    value: '300+',   label: 'Degree Programs'     },
              { icon: Award,    value: '10M+',   label: 'Salary Data Points'  },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <Icon className="h-4 w-4" style={{ color: '#6B8FFF' }} />
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                </div>
                <p className="text-xs font-medium text-white/50">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COUNTRY GRID — logic completely untouched ─────────────────────── */}
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
          <>
            {/* SEO section label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <h2 className="text-sm font-bold text-white/55 tracking-widest uppercase">
                All Countries
              </h2>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }} />
              <span className="text-xs text-white/35 font-medium">{countries.length} destinations</span>
            </motion.div>

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
          </>
        )}
      </div>

      {/* ── SEO EDITORIAL SECTION ────────────────────────────────────────────
          All text at legible opacity (white/80 headings, white/60 body).
          Targets high-CPM AdSense education finance keywords.
          FAQ targets Google "People Also Ask" boxes.
          Internal CTA boosts pages-per-session → raises AdSense RPM. ─────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="container max-w-4xl py-16 space-y-16">

          {/* ── Block 1: How to choose ────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white/85">
              How to Choose the Best Country for Your Education ROI
            </h2>
            <p className="text-base text-white/60 leading-relaxed">
              Selecting the right country for your university education is one of the most consequential financial decisions you'll make. Beyond prestige, the true measure is <strong className="text-white font-semibold">return on investment</strong> — the net gain from your degree after accounting for tuition fees, cost of living, student loan interest, and post-graduation salary. Our calculator models these variables across 50+ countries so you can make a data-driven choice instead of guessing.
            </p>
          </div>

          {/* ── Block 2: Topic cards ──────────────────────────────────────── */}
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: DollarSign,
                heading: 'Tuition Fees by Country',
                body: 'Annual tuition ranges from near-zero in Germany and Norway to over $55,000 at elite US private universities. Scandinavian countries offer heavily subsidised tuition even for international students, making them top picks for budget-conscious students seeking high-quality education.',
                color: '#4C6FFF',
              },
              {
                icon: Globe,
                heading: 'Cost of Living for Students',
                body: 'Monthly student living costs range from ~$500 in Eastern Europe and Southeast Asia to over $2,500 in cities like London, Zurich, and New York. Our Cost of Living Index lets you instantly benchmark housing, food, transport, and healthcare across every country.',
                color: '#4DD6C8',
              },
              {
                icon: TrendingUp,
                heading: 'Graduate Salary Comparisons',
                body: 'Post-graduation salary is the single biggest driver of ROI. STEM graduates in the US and Germany consistently outperform peers globally, while finance and law graduates in Singapore and the UK top regional salary charts. We update salary benchmarks quarterly.',
                color: '#9FE0C3',
              },
              {
                icon: BookOpen,
                heading: 'Student Loan & Debt Impact',
                body: 'A $100k loan at 6% over 10 years adds $33k in interest to your total cost. Countries with income-contingent repayment systems — like the UK and Australia — dramatically reduce default risk. Our loan calculator factors in interest, term length, and repayment structure.',
                color: '#C77DFF',
              },
            ].map(({ icon: Icon, heading, body, color }) => (
              <div
                key={heading}
                className="rounded-2xl p-5 space-y-3"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <h3 className="text-sm font-bold text-white/85">{heading}</h3>
                </div>
                <p className="text-sm text-white/55 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* ── Block 3: Best countries 2025 ─────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white/85">
              Best Countries for International Students in 2025
            </h2>
            <p className="text-base text-white/60 leading-relaxed">
              Based on our ROI model, the top-ranked destinations for international students in 2025 balance affordable tuition, moderate cost of living, strong graduate employment rates, and post-study work visa options. Germany, Canada, the Netherlands, and Australia consistently rank highly across all four dimensions. The United States leads on raw salary potential but requires careful debt management given high tuition costs.
            </p>

            {/* Quick-ranking pills */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {[
                { rank: '01', name: 'Germany',     note: 'Near-zero tuition'        },
                { rank: '02', name: 'Canada',       note: 'Post-study work visa'     },
                { rank: '03', name: 'Netherlands',  note: 'High English proficiency' },
                { rank: '04', name: 'Australia',    note: 'Strong STEM salaries'     },
                { rank: '05', name: 'United States', note: 'Top salary outcomes'     },
              ].map(({ rank, name, note }) => (
                <div
                  key={rank}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                >
                  <span className="text-[10px] font-black text-white/25">{rank}</span>
                  <div>
                    <p className="text-sm font-semibold text-white/80">{name}</p>
                    <p className="text-[11px] text-white/38">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Block 4: FAQ ──────────────────────────────────────────────── */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white/85">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                {
                  q: 'Which country has the cheapest university tuition for international students?',
                  a: 'Germany, Norway, and Finland offer the lowest tuition fees, with many public universities charging minimal or zero tuition even for non-EU international students. However, living costs in these countries are moderate to high, so total cost of attendance should be calculated.',
                },
                {
                  q: 'How do I calculate the ROI of a university degree?',
                  a: 'Education ROI is calculated by comparing the total investment (tuition + living costs + opportunity cost + loan interest) against the lifetime salary premium your degree generates. Our calculator automates this using real salary data and adjusts for inflation, tax rates, and loan repayment schedules.',
                },
                {
                  q: 'Is studying in the US worth the cost?',
                  a: "It depends on the major and institution. US STEM and business graduates at top-50 universities often see 10-year ROIs exceeding 200%. However, humanities and arts degrees at less selective institutions can produce negative ROI when accounting for student debt. Use our comparison tool to model your specific scenario.",
                },
                {
                  q: 'What is a Cost of Living Index for students?',
                  a: 'A Cost of Living Index (COL index) benchmarks the relative expense of living in a city or country. A score of 100 represents the global average. A score of 150 means 50% more expensive; a score of 60 means 40% cheaper. We use COL data to adjust break-even and ROI calculations for each country.',
                },
              ].map(({ q, a }, i) => (
                <motion.div
                  key={q}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                  className="rounded-2xl p-5 space-y-2.5"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{ background: 'rgba(76,111,255,0.15)', color: '#6B8FFF' }}
                    >
                      Q
                    </span>
                    <h3 className="text-sm font-semibold text-white/80 leading-snug">{q}</h3>
                  </div>
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{ background: 'rgba(77,214,200,0.12)', color: '#4DD6C8' }}
                    >
                      A
                    </span>
                    <p className="text-sm text-white/55 leading-relaxed">{a}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── CTA Banner ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{
              background: 'linear-gradient(135deg, rgba(76,111,255,0.12) 0%, rgba(129,140,248,0.08) 100%)',
              border: '1px solid rgba(76,111,255,0.22)',
            }}
          >
            <div>
              <p className="text-base font-bold text-white">Ready to calculate your exact ROI?</p>
              <p className="text-sm text-white/50 mt-1">Pick a country above and run a full degree ROI analysis in under 2 minutes.</p>
            </div>
            <Link
              to="/compare"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4C6FFF, #818CF8)', boxShadow: '0 0 24px rgba(76,111,255,0.3)' }}
            >
              Compare Two Options
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

        </div>
      </motion.section>
    </div>
  );
};

export default CountriesPage;