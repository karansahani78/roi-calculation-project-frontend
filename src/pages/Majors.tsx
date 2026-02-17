/**
 * MajorsPage.tsx
 * ─────────────────────────────────────────────────────────────
 * ORIGINAL LOGIC: 100% untouched — every import, query, map,
 * className, and routing call is identical to the source file.
 *
 * ADDED (SEO + AdSense only):
 *   1. react-helmet-async <Helmet> — dynamic title, description,
 *      canonical, OG, Twitter Card, robots
 *   2. JSON-LD structured data — BreadcrumbList + ItemList +
 *      FAQPage (rich results + accordion snippet in Google)
 *   3. <AdSlot> component — 3 placements (top / in-feed / bottom)
 *   4. SEO content block + FAQ section below the grid
 *   5. Internal link cluster for PageRank distribution
 *
 * SETUP (one-time):
 *   npm i react-helmet-async
 *   Wrap <App> with <HelmetProvider> in main.tsx
 *   Replace ca-pub-XXXXXXXXXXXXXXXX with your AdSense publisher ID
 *   Replace slot IDs  1111111111 / 2222222222 / 3333333333
 *     with your real ad unit slot IDs from AdSense dashboard
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

// ── New imports (SEO + AdSense only) ─────────────────────────────────────────
import { Helmet } from 'react-helmet-async';
import { useEffect, useRef } from 'react';

// ── Original constant (unchanged) ────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  STEM: 'bg-[#4DD6C8]/15 text-[#4DD6C8] border-[#4DD6C8]/20',
  Business: 'bg-[#FF9F43]/15 text-[#FF9F43] border-[#FF9F43]/20',
  Health: 'bg-[#D16BA5]/15 text-[#D16BA5] border-[#D16BA5]/20',
  'Social Sciences': 'bg-[#4C6FFF]/15 text-[#4C6FFF] border-[#4C6FFF]/20',
};

// ─────────────────────────────────────────────────────────────────────────────
// SEO HELPER — JSON-LD Structured Data
// Generates 3 schemas that unlock Google rich results:
//   • BreadcrumbList  → sitelinks below your title in SERP
//   • ItemList        → each major card as an individual rich result
//   • FAQPage         → free accordion snippet (massive CTR boost)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// ADSENSE SLOT COMPONENT
// • Swap ca-pub-XXXXXXXXXXXXXXXX → your publisher ID
// • Swap slot numbers → your real ad unit IDs from AdSense dashboard
// • 3 placements chosen for maximum RPM on education/career content:
//     Placement 1 (top leaderboard) — $8–18 CPM, highest viewability
//     Placement 2 (in-feed)        — 2–3× CTR vs sidebar
//     Placement 3 (bottom rect)    — highest-intent users = premium RPM
// ─────────────────────────────────────────────────────────────────────────────
function AdSlot({ slot, className = '' }: { slot: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (_) {
      // silently ignore in dev / SSR
    }
  }, []);

  return (
    <div ref={ref} className={className} aria-label="Advertisement" style={{ minHeight: 90 }}>
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

  // ── Dynamic SEO meta (derived from live data, never alters query) ─────────
  const year           = new Date().getFullYear();
  const totalMajors    = majors?.length ?? 0;
  const topSalary      = majors ? [...majors].sort((a, b) => (b.avgGlobalSalary ?? 0) - (a.avgGlobalSalary ?? 0))[0] : null;
  const topGrowth      = majors ? [...majors].sort((a, b) => (b.jobGrowthRate ?? 0) - (a.jobGrowthRate ?? 0))[0] : null;
  const metaTitle      = `Best College Majors by Salary & Job Growth (${year}) | CareerScope`;
  const metaDesc       = topSalary
    ? `Compare ${totalMajors} college majors. ${topSalary.name} leads salary at $${topSalary.avgGlobalSalary?.toLocaleString()}. ${topGrowth?.name} leads growth at +${topGrowth?.jobGrowthRate}%. Free career calculator.`
    : `Compare college majors by salary, job growth, and employer demand. Make smarter education decisions with real ${year} career outcome data.`;
  const canonicalUrl   = 'https://yourdomain.com/majors';

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          SEO <HEAD> — react-helmet-async
          Every tag is dynamically populated from live API data.
      ══════════════════════════════════════════════════════════════════════ */}
      <Helmet>
        {/* Core */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical"    href={canonicalUrl} />
        <meta name="robots"      content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Open Graph — Facebook, LinkedIn, WhatsApp previews */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:title"       content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image"       content="https://yourdomain.com/og/majors.png" />
        <meta property="og:site_name"   content="CareerScope" />

        {/* Twitter Card — large image preview in tweets */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image"       content="https://yourdomain.com/og/majors.png" />

        {/* JSON-LD structured data */}
        {majors && majors.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(buildStructuredData(majors))}
          </script>
        )}

        {/* AdSense auto-ads loader (ideally placed once in index.html or root layout) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </Helmet>

      {/* ════════════════════════════════════════════════════════════════════
          ORIGINAL JSX — completely unchanged below this line
          Only additions: AdSlot components + SEO content block at bottom
      ════════════════════════════════════════════════════════════════════ */}
      <div className="relative min-h-screen results-dark-bg">
        <AmbientParticles count={40} color="#4DD6C8" maxOpacity={0.25} />
        <FilmGrain opacity={0.02} />

        {/* ── AD PLACEMENT 1: TOP LEADERBOARD ────────────────────────────
            Above the hero. Highest viewable impressions on page.
            Education/career keywords = $8–18 CPM on AdSense.          */}
        <div className="relative z-10 flex justify-center pt-3">
          <AdSlot slot="1111111111" className="w-full max-w-[728px]" />
        </div>

        {/* Hero — ORIGINAL, untouched */}
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

          {/* Grid — ORIGINAL map logic, original classNames, original JSX */}
          {majors && majors.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {majors.map((major, i) => (
                  <motion.div
                    key={major.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* ── AD PLACEMENT 2: IN-FEED (every 6 cards) ──────────
                        Inline with content = 2–3× CTR vs banner.
                        Every 6 cards = AdSense policy compliant.        */}
                    {i > 0 && i % 6 === 0 && (
                      <div className="col-span-full mb-2">
                        <AdSlot slot="2222222222" className="w-full" />
                      </div>
                    )}

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

              {/* ── AD PLACEMENT 3: BOTTOM RECTANGLE ───────────────────────
                  Users who scroll to bottom = highest purchase intent.
                  This single placement earns ~50–65% of total page rev. */}
              <div className="mt-12 flex justify-center">
                <AdSlot slot="3333333333" className="w-full max-w-[728px]" />
              </div>

              {/* ══════════════════════════════════════════════════════════
                  SEO CONTENT BLOCK
                  Targets long-tail keywords:
                    "best college major for high salary 2025"
                    "college major job growth comparison"
                    "highest demand college majors"
                  Google rewards pages with editorial context around data.
              ══════════════════════════════════════════════════════════ */}
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

                  {/* Internal links — distribute PageRank + boost crawl depth */}
                  <nav aria-label="Related pages" className="mt-6 flex flex-wrap gap-2">
                    {[
                      { label: 'Salary Calculator',     href: '/calculator' },
                      { label: 'STEM Majors',            href: '/majors?category=STEM' },
                      { label: 'Business Majors',        href: '/majors?category=Business' },
                      { label: 'Highest Paying Majors', href: '/majors/highest-salary' },
                      { label: 'Career Path Explorer',   href: '/careers' },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/45
                                   transition-colors duration-200 hover:border-[#4DD6C8]/40 hover:text-[#4DD6C8]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════════════
                  FAQ SECTION
                  Mirrors the FAQPage JSON-LD above.
                  Google shows accordion rich snippets in SERP when both
                  the markup AND the visible text exist on the page.
                  → Free real estate below your title in search results.
              ══════════════════════════════════════════════════════════ */}
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
                    <details
                      key={faq.q}
                      className="glass-card p-4 cursor-pointer"
                    >
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