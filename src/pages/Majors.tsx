/**
 * MajorsPage.tsx — FINAL
 * ─────────────────────────────────────────────────────────────
 * FIXES IN THIS VERSION:
 *
 *   1. GRID GAP — AdSlot has no minHeight, lives outside the grid.
 *      Cards are perfectly even with no blank rows ever.
 *
 *   2. 404 NAV LINKS — The SEO internal links previously pointed to
 *      routes that don't exist:
 *        /majors?category=STEM       → 404
 *        /majors/highest-salary      → 404
 *        /careers                    → 404
 *
 *      FIX: All links now use one of two safe strategies:
 *        a) Category filter links  → set activeFilter state and
 *           scroll to #majors-grid (works on the same page, no 404)
 *        b) Calculator / Compare   → use existing app routes only
 *
 *   3. CATEGORY FILTER — clicking a category pill in the nav NOW
 *      actually filters the visible cards in real time. No new
 *      routes needed. Filter state is local, query is untouched.
 *
 * ORIGINAL LOGIC: 100% untouched — query, map, card JSX, classNames,
 * animations, routing to /calculator?major=ID all identical.
 * ─────────────────────────────────────────────────────────────
 */

// ── Original imports (unchanged) ─────────────────────────────────────────────
import { motion } from 'framer-motion';
import { BookOpen, Star, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { fetchMajors } from '@/lib/api';
import type { MajorDto } from '@/types/api';
import { AmbientParticles } from '@/components/effects/AmbientParticles';
import { FilmGrain } from '@/components/effects/FilmGrain';

// ── New imports ───────────────────────────────────────────────────────────────
import { Helmet } from 'react-helmet-async';
import { useEffect, useRef, useState } from 'react';

// ── Original constant (unchanged) ────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  STEM: 'bg-[#4DD6C8]/15 text-[#4DD6C8] border-[#4DD6C8]/20',
  Business: 'bg-[#FF9F43]/15 text-[#FF9F43] border-[#FF9F43]/20',
  Health: 'bg-[#D16BA5]/15 text-[#D16BA5] border-[#D16BA5]/20',
  'Social Sciences': 'bg-[#4C6FFF]/15 text-[#4C6FFF] border-[#4C6FFF]/20',
};

// ── Category accent colors for the filter pills ───────────────────────────────
const CATEGORY_PILL_ACTIVE: Record<string, string> = {
  All:              'bg-white/10 text-white border-white/25',
  STEM:             'bg-[#4DD6C8]/20 text-[#4DD6C8] border-[#4DD6C8]/40',
  Business:         'bg-[#FF9F43]/20 text-[#FF9F43] border-[#FF9F43]/40',
  Health:           'bg-[#D16BA5]/20 text-[#D16BA5] border-[#D16BA5]/40',
  'Social Sciences':'bg-[#4C6FFF]/20 text-[#4C6FFF] border-[#4C6FFF]/40',
};

// ── SEO helper (unchanged) ───────────────────────────────────────────────────
function buildStructuredData(majors: MajorDto[]) {
  const topSalary = [...majors].sort((a, b) => (b.avgGlobalSalary ?? 0) - (a.avgGlobalSalary ?? 0))[0];
  const topGrowth = [...majors].sort((a, b) => (b.jobGrowthRate ?? 0) - (a.jobGrowthRate ?? 0))[0];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',   item: 'https://yourdomain.com' },
          { '@type': 'ListItem', position: 2, name: 'Majors', item: 'https://yourdomain.com/majors' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'College Majors & Career Outcomes',
        description: 'Compare salary, job growth, and demand for every college major.',
        numberOfItems: majors.length,
        itemListElement: majors.map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: m.name,
          url: `https://yourdomain.com/calculator?major=${m.id}`,
          description: `${m.name} — avg salary $${m.avgGlobalSalary?.toLocaleString()}, +${m.jobGrowthRate}% job growth, demand ${m.demandScore}/10`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Which college major has the highest salary?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${topSalary?.name ?? 'Computer Science'} ranks highest with an average global salary of $${topSalary?.avgGlobalSalary?.toLocaleString() ?? '120,000'}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Which major has the fastest job growth?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${topGrowth?.name ?? 'Health Sciences'} leads at +${topGrowth?.jobGrowthRate ?? 15}% projected growth over the next decade.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How is the demand score calculated?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The demand score (1–10) combines employer job postings, industry growth projections, and graduate employment rates across global markets.',
            },
          },
        ],
      },
    ],
  };
}

// ── AdSense slot — no minHeight, zero gap when unloaded ──────────────────────
function AdSlot({ slot, className = '' }: { slot: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (_) {}
  }, []);
  return (
    <div ref={ref} className={className} aria-label="Advertisement" style={{ overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const MajorsPage = () => {

  // ── ORIGINAL QUERY LOGIC — NOT TOUCHED ───────────────────────────────────
  const { data: majors, isLoading, isError, error } = useQuery<MajorDto[]>({
    queryKey: ['majors'],
    queryFn: () => fetchMajors(),
  });

  // ── Category filter state (UI only — query never changes) ─────────────────
  // 'All' shows everything, any other value filters the displayed cards.
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Derive filtered list — original `majors` array is never mutated
  const displayedMajors = activeFilter === 'All'
    ? (majors ?? [])
    : (majors ?? []).filter(m => m.category === activeFilter);

  // Sorted view for "Highest Salary" quick-filter
  const [sortBySalary, setSortBySalary] = useState(false);
  const sortedMajors = sortBySalary
    ? [...displayedMajors].sort((a, b) => (b.avgGlobalSalary ?? 0) - (a.avgGlobalSalary ?? 0))
    : displayedMajors;

  // Scroll helper — smooth scroll to the grid when a filter link is clicked
  const scrollToGrid = () => {
    document.getElementById('majors-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFilterClick = (category: string, salary = false) => {
    setActiveFilter(category);
    setSortBySalary(salary);
    scrollToGrid();
  };

  // ── Dynamic SEO meta (unchanged) ─────────────────────────────────────────
  const year        = new Date().getFullYear();
  const totalMajors = majors?.length ?? 0;
  const topSalary   = majors ? [...majors].sort((a, b) => (b.avgGlobalSalary ?? 0) - (a.avgGlobalSalary ?? 0))[0] : null;
  const topGrowth   = majors ? [...majors].sort((a, b) => (b.jobGrowthRate ?? 0) - (a.jobGrowthRate ?? 0))[0] : null;
  const metaTitle   = `Best College Majors by Salary & Job Growth (${year}) | CareerScope`;
  const metaDesc    = topSalary
    ? `Compare ${totalMajors} college majors. ${topSalary.name} leads salary at $${topSalary.avgGlobalSalary?.toLocaleString()}. ${topGrowth?.name} leads growth at +${topGrowth?.jobGrowthRate}%. Free career calculator.`
    : `Compare college majors by salary, job growth, and employer demand. Make smarter education decisions with real ${year} career outcome data.`;
  const canonicalUrl = 'https://yourdomain.com/majors';

  return (
    <>
      {/* SEO HEAD — unchanged */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical"    href={canonicalUrl} />
        <meta name="robots"      content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:title"       content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image"       content="https://yourdomain.com/og/majors.png" />
        <meta property="og:site_name"   content="CareerScope" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image"       content="https://yourdomain.com/og/majors.png" />
        {majors && majors.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(buildStructuredData(majors))}
          </script>
        )}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </Helmet>

      <div className="relative min-h-screen results-dark-bg">
        <AmbientParticles count={40} color="#4DD6C8" maxOpacity={0.25} />
        <FilmGrain opacity={0.02} />

        {/* AD 1: TOP LEADERBOARD — no minHeight, zero gap if unloaded */}
        <div className="relative z-10 flex justify-center pt-3">
          <AdSlot slot="1111111111" className="w-full max-w-[728px]" />
        </div>

        {/* ── HERO — ORIGINAL, untouched ─────────────────────────────────── */}
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

            {/* ── CATEGORY FILTER PILLS ──────────────────────────────────────
                These replace the broken nav links. Clicking filters
                cards IN PLACE — no routing, no 404, instant feedback.   */}
            {majors && majors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-2"
              >
                {['All', 'STEM', 'Business', 'Health', 'Social Sciences'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilterClick(cat, false)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200
                      ${activeFilter === cat && !sortBySalary
                        ? CATEGORY_PILL_ACTIVE[cat]
                        : 'bg-white/[0.04] text-white/40 border-white/10 hover:bg-white/[0.07] hover:text-white/70'
                      }`}
                  >
                    {cat === 'All' ? 'All Majors' : cat}
                  </button>
                ))}
                {/* Highest Salary sort button */}
                <button
                  onClick={() => { setActiveFilter('All'); setSortBySalary(true); scrollToGrid(); }}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200
                    ${sortBySalary
                      ? 'bg-[#FF9F43]/20 text-[#FF9F43] border-[#FF9F43]/40'
                      : 'bg-white/[0.04] text-white/40 border-white/10 hover:bg-white/[0.07] hover:text-white/70'
                    }`}
                >
                  ↑ Highest Salary
                </button>
              </motion.div>
            )}

            {/* Active filter label */}
            {(activeFilter !== 'All' || sortBySalary) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 flex items-center justify-center gap-2"
              >
                <span className="text-xs text-white/30">
                  Showing {sortedMajors.length} {activeFilter !== 'All' ? activeFilter : ''} major{sortedMajors.length !== 1 ? 's' : ''}
                  {sortBySalary ? ' · sorted by salary' : ''}
                </span>
                <button
                  onClick={() => { setActiveFilter('All'); setSortBySalary(false); }}
                  className="text-xs text-[#4DD6C8]/60 hover:text-[#4DD6C8] transition-colors"
                >
                  Clear ✕
                </button>
              </motion.div>
            )}
          </div>
        </section>

        <div className="container pb-16 relative z-10">

          {/* Loading — ORIGINAL */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#C77DFF]" />
              <span className="ml-3 text-white/40">Loading majors...</span>
            </div>
          )}

          {/* Error — ORIGINAL */}
          {isError && (
            <div className="mx-auto max-w-md glass-card p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-[#FF7849]" />
              <h2 className="mt-3 font-semibold text-white">Backend Unavailable</h2>
              <p className="mt-1 text-sm text-white/40">
                {error instanceof Error ? error.message : 'Could not load majors from the server.'}
              </p>
            </div>
          )}

          {/* Empty — ORIGINAL */}
          {!isLoading && !isError && majors && majors.length === 0 && (
            <div className="py-20 text-center text-white/40">No data available</div>
          )}

          {majors && majors.length > 0 && (
            <>
              {/* No results for active filter */}
              {sortedMajors.length === 0 && (
                <div className="py-16 text-center text-white/30 text-sm">
                  No majors found for "{activeFilter}".{' '}
                  <button
                    onClick={() => setActiveFilter('All')}
                    className="text-[#4DD6C8]/70 hover:text-[#4DD6C8] underline"
                  >
                    Show all
                  </button>
                </div>
              )}

              {/* ── GRID — original card JSX unchanged, now uses sortedMajors ── */}
              {sortedMajors.length > 0 && (
                <div
                  id="majors-grid"
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  style={{ scrollMarginTop: '1rem' }}
                >
                  {sortedMajors.map((major, i) => (
                    <motion.div
                      key={major.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* ORIGINAL card JSX — not a single character changed */}
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

              {/* AD 2: MID-PAGE — outside grid, no gap */}
              <div className="mt-6 flex justify-center">
                <AdSlot slot="2222222222" className="w-full max-w-[728px]" />
              </div>

              {/* AD 3: BOTTOM — no gap */}
              <div className="mt-4 flex justify-center">
                <AdSlot slot="3333333333" className="w-full max-w-[728px]" />
              </div>

              {/* ── SEO CONTENT BLOCK ────────────────────────────────────────
                  Internal links now use onClick handlers that call
                  handleFilterClick() — no routing, no 404 ever.
                  The "Compare" link goes to /compare which exists.      */}
              <section className="mt-16 mx-auto max-w-3xl" aria-label="Guide: Choosing a College Major">
                <div className="glass-card p-8">
                  <h2 className="text-xl font-bold text-white mb-4">
                    How to Choose a College Major for Career Success
                  </h2>
                  <div className="space-y-3 text-sm leading-relaxed text-white/45">
                    <p>
                      Choosing the right college major directly impacts your earning potential, job security,
                      and long-term career satisfaction. Our platform compares{' '}
                      <strong className="text-white/70">{totalMajors} majors</strong> across average global salary,
                      job growth rate, and employer demand so you can make a fully data-driven decision.
                    </p>
                    {topSalary && (
                      <p>
                        Among all fields tracked,{' '}
                        <strong className="text-white/70">{topSalary.name}</strong> leads in average global
                        salary at{' '}
                        <strong className="text-white/70">${topSalary.avgGlobalSalary?.toLocaleString()}</strong>,
                        while{' '}
                        <strong className="text-white/70">{topGrowth?.name}</strong> shows the strongest projected
                        job growth at{' '}
                        <strong className="text-white/70">+{topGrowth?.jobGrowthRate}%</strong>.
                        Click any major card to open the salary calculator and model your specific situation
                        by country and experience level.
                      </p>
                    )}
                    <p>
                      A demand score above 7 indicates strong employer hiring activity across global markets.
                      Job growth rate reflects projected employment expansion over the next decade based on
                      industry and government data sources.
                    </p>
                  </div>

                  {/* ── FIXED NAV LINKS ───────────────────────────────────────
                      BEFORE: <Link to="/majors?category=STEM"> → 404
                              <Link to="/majors/highest-salary"> → 404
                              <Link to="/careers"> → 404

                      AFTER:  Category links → onClick filter (same page)
                              Highest Paying → onClick sort (same page)
                              Salary Calculator → /calculator (exists ✓)
                              Compare → /compare (exists ✓)
                  ─────────────────────────────────────────────────────── */}
                  <nav aria-label="Related pages" className="mt-6 flex flex-wrap gap-2">

                    {/* Salary Calculator — existing route ✓ */}
                    <Link
                      to="/calculator"
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/45
                                 transition-colors duration-200 hover:border-[#4DD6C8]/40 hover:text-[#4DD6C8]"
                    >
                      Salary Calculator
                    </Link>

                    {/* Compare — existing route ✓ */}
                    <Link
                      to="/compare"
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/45
                                 transition-colors duration-200 hover:border-[#4DD6C8]/40 hover:text-[#4DD6C8]"
                    >
                      Compare Options
                    </Link>

                    {/* STEM Majors — filter on same page, no route needed */}
                    <button
                      onClick={() => handleFilterClick('STEM')}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/45
                                 transition-colors duration-200 hover:border-[#4DD6C8]/40 hover:text-[#4DD6C8]"
                    >
                      STEM Majors
                    </button>

                    {/* Business Majors — filter on same page */}
                    <button
                      onClick={() => handleFilterClick('Business')}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/45
                                 transition-colors duration-200 hover:border-[#4DD6C8]/40 hover:text-[#4DD6C8]"
                    >
                      Business Majors
                    </button>

                    {/* Highest Paying — sort on same page */}
                    <button
                      onClick={() => { setActiveFilter('All'); setSortBySalary(true); scrollToGrid(); }}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/45
                                 transition-colors duration-200 hover:border-[#4DD6C8]/40 hover:text-[#4DD6C8]"
                    >
                      Highest Paying Majors
                    </button>

                    {/* Career Path Explorer — /compare is the closest existing page */}
                    <Link
                      to="/compare"
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/45
                                 transition-colors duration-200 hover:border-[#4DD6C8]/40 hover:text-[#4DD6C8]"
                    >
                      Career Path Explorer
                    </Link>

                  </nav>
                </div>
              </section>

              {/* FAQ SECTION — unchanged */}
              <section className="mt-6 mx-auto max-w-3xl" aria-label="Frequently Asked Questions about College Majors">
                <h2 className="text-lg font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      q: 'Which college major has the highest salary?',
                      a: topSalary
                        ? `${topSalary.name} tops our list with an average global salary of $${topSalary.avgGlobalSalary?.toLocaleString()}. Use the salary calculator to see location-adjusted figures.`
                        : 'STEM majors like Computer Science and Engineering consistently rank among the highest paid.',
                    },
                    {
                      q: 'Which major has the fastest job growth?',
                      a: topGrowth
                        ? `${topGrowth.name} leads at +${topGrowth.jobGrowthRate}% projected growth over the next decade.`
                        : 'Health sciences and technology fields show the strongest hiring outlooks.',
                    },
                    {
                      q: 'How is the demand score calculated?',
                      a: 'The demand score (1–10) is a composite of employer job postings, industry growth projections, and graduate employment rates across global markets.',
                    },
                  ].map((faq) => (
                    <details key={faq.q} className="glass-card p-4 cursor-pointer">
                      <summary className="font-semibold text-white text-sm list-none select-none">
                        {faq.q}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-white/45">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MajorsPage;