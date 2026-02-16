import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Loader2, TrendingUp, DollarSign, Clock, BookOpen, Users, Award, BarChart3, CheckCircle } from 'lucide-react';
import { fetchSeoPage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const SeoPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['seo-page', slug],
    queryFn: () => fetchSeoPage(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground">
          {error ? 'Backend unavailable. Please try again later.' : 'No data available for this page.'}
        </p>
        <Link to="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    );
  }

  const calculatorLink = page.defaultParams
    ? `/calculator?${new URLSearchParams(
        Object.entries(page.defaultParams)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString()}`
    : '/calculator';

  const degreeTitle = page.h1Title.replace('Is ', '').replace('?', '');

  return (
    <>
      <Helmet>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={page.canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={page.metaTitle} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={page.canonicalUrl} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.metaTitle} />
        <meta name="twitter:description" content={page.metaDescription} />

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduroi.com' },
              { '@type': 'ListItem', position: 2, name: page.pageType, item: `https://eduroi.com/${page.pageType}` },
              { '@type': 'ListItem', position: 3, name: degreeTitle, item: page.canonicalUrl },
            ],
          })}
        </script>

        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: page.h1Title,
            description: page.metaDescription,
            url: page.canonicalUrl,
            author: { '@type': 'Organization', name: 'EduROI' },
            publisher: { '@type': 'Organization', name: 'EduROI', logo: { '@type': 'ImageObject', url: 'https://eduroi.com/logo.png' } },
            datePublished: new Date().toISOString(),
            dateModified: new Date().toISOString(),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        {/* Hero */}
        <section className="gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(160_84%_39%_/_0.1),_transparent_60%)]" />
          <div className="container relative py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent capitalize">
                {page.pageType}
              </span>
              <h1 className="mt-6 text-3xl font-extrabold leading-tight text-gradient-hero md:text-4xl lg:text-5xl">
                {page.h1Title}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/70">
                {page.metaDescription}
              </p>
              <Link to={calculatorLink}>
                <Button
                  size="lg"
                  className="mt-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-hero px-8 text-base font-semibold"
                >
                  Calculate ROI Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" className="w-full">
              <path
                d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 32C840 40 960 48 1080 44C1200 40 1320 24 1380 16L1440 8V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
                fill="hsl(210 20% 98%)"
              />
            </svg>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-6"
          >
            <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              Table of Contents
            </h2>
            <ul className="grid gap-2 md:grid-cols-2 text-sm">
              <li><a href="#overview" className="text-accent hover:underline">Complete ROI Analysis</a></li>
              <li><a href="#factors" className="text-accent hover:underline">Key Factors to Consider</a></li>
              <li><a href="#calculation" className="text-accent hover:underline">How ROI is Calculated</a></li>
              <li><a href="#career" className="text-accent hover:underline">Career Prospects</a></li>
              <li><a href="#comparison" className="text-accent hover:underline">Compare Similar Degrees</a></li>
              <li><a href="#faqs" className="text-accent hover:underline">Frequently Asked Questions</a></li>
            </ul>
          </motion.div>
        </section>

        {/* ─── OVERVIEW SECTION ─── */}
        <section id="overview" className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl space-y-6 text-muted-foreground leading-relaxed"
          >
            <h2 className="text-3xl font-bold text-foreground">
              {degreeTitle} – Complete ROI Analysis
            </h2>

            <p className="text-lg">
              Choosing the right degree is one of the most important financial decisions you will ever make.
              In this comprehensive guide, we break down whether <strong>{degreeTitle}</strong> makes financial sense based on tuition costs, expected salary, career demand, and long-term return on investment.
            </p>

            <p>
              Our analysis uses real market data, salary projections from verified sources, and education cost modeling to help
              students understand the true return on their education investment — not just the headline salary figures you see advertised.
            </p>

            <p>
              We examine multiple scenarios including best-case, worst-case, and most-likely outcomes to give you a realistic picture
              of what to expect financially over a 10, 20, and 30-year career horizon.
            </p>

            <div className="grid gap-4 md:grid-cols-3 pt-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <DollarSign className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Financial ROI</h3>
                <p className="text-sm text-muted-foreground">Complete cost-benefit analysis including tuition, living expenses, and opportunity costs</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <TrendingUp className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Career Growth</h3>
                <p className="text-sm text-muted-foreground">Long-term salary trajectory and advancement opportunities in the field</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <BarChart3 className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Market Demand</h3>
                <p className="text-sm text-muted-foreground">Industry trends, job availability, and future-proofing considerations</p>
              </div>
            </div>
          </motion.div>
        </section>

        <AdSlot slot="in-content" className="container mb-8" />

        {/* ─── KEY FACTORS ─── */}
        <section id="factors" className="container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl space-y-6 text-muted-foreground"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Key Factors to Consider When Evaluating {degreeTitle}
            </h2>

            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <CheckCircle className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Total Cost of Education</h3>
                  <p>Beyond tuition, consider textbooks, supplies, technology, housing, transportation, and other fees that can add 20-40% to your total education costs.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <CheckCircle className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Opportunity Cost</h3>
                  <p>The income you forgo while studying represents a significant hidden cost. For a 4-year degree, this could mean $100,000+ in lost earnings.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <CheckCircle className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Starting Salary vs. Career Trajectory</h3>
                  <p>Some degrees have lower starting salaries but steeper growth curves. Consider 10-year and 20-year earnings, not just entry-level pay.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <CheckCircle className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Industry Stability and Automation Risk</h3>
                  <p>Future-proof your career by understanding which roles are growing, stable, or at risk of automation and outsourcing.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <CheckCircle className="h-6 w-6 text-accent shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Geographic Flexibility</h3>
                  <p>Can you work remotely? Are jobs concentrated in expensive cities? Location requirements significantly impact real take-home pay.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── CTA BOX 1 ─── */}
        <section className="container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl rounded-xl border-2 border-accent/20 bg-accent/5 p-8 text-center"
          >
            <TrendingUp className="mx-auto h-10 w-10 text-accent mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-3">
              Get Your Personalized ROI Calculation
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use our free calculator to see exactly how {degreeTitle} stacks up for your specific situation,
              location, and financial goals.
            </p>
            <Link to={calculatorLink}>
              <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Calculate Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>

        <AdSlot slot="in-content" className="container mb-8" />

        {/* ─── HOW ROI IS CALCULATED ─── */}
        <section id="calculation" className="container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl space-y-6 text-muted-foreground"
          >
            <h2 className="text-3xl font-bold text-foreground">
              How We Calculate Education ROI
            </h2>

            <p>
              Our ROI calculation methodology is based on industry-standard financial modeling used by education consultants
              and financial advisors. We take a comprehensive approach that goes beyond simple "salary minus tuition" math.
            </p>

            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">ROI Formula Components:</h3>
              
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-foreground">Direct Education Costs</h4>
                    <p className="text-sm">Tuition, fees, books, supplies, and technology requirements</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-foreground">Living Expenses During Studies</h4>
                    <p className="text-sm">Housing, food, transportation, and personal expenses for the duration of the program</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-foreground">Opportunity Cost</h4>
                    <p className="text-sm">Income you would have earned if working instead of studying (often the largest hidden cost)</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium text-foreground">Expected Post-Graduation Salary</h4>
                    <p className="text-sm">Median starting salary based on verified data from graduates in the field</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-medium text-foreground">Career Growth Trajectory</h4>
                    <p className="text-sm">Expected salary increases over 10-30 years based on industry norms and advancement opportunities</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-medium text-foreground">Market Demand & Job Security</h4>
                    <p className="text-sm">Industry growth projections, automation risk, and employment stability factors</p>
                  </div>
                </div>
              </div>
            </div>

            <p>
              This comprehensive approach gives a realistic, conservative, and transparent picture of what students
              can expect financially over the long term. We adjust for inflation, regional cost differences, and market conditions.
            </p>
          </motion.div>
        </section>

        {/* ─── CAREER PROSPECTS ─── */}
        <section id="career" className="container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl space-y-6 text-muted-foreground"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Career Prospects and Job Market Outlook
            </h2>

            <p>
              Understanding the job market is crucial for evaluating education ROI. A degree with excellent financial returns
              today might face saturation or automation risks in the future. Here's what you need to know about careers
              related to {degreeTitle}.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <Users className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-semibold text-foreground mb-3">Employment Opportunities</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Job availability in major cities vs. rural areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Entry-level position requirements and competition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Industry sectors with highest demand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Remote work and freelance opportunities</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <Award className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-semibold text-foreground mb-3">Career Advancement</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Typical career progression timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Additional certifications that boost earnings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Management and leadership opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Entrepreneurship and consulting potential</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Future-Proofing Considerations
              </h3>
              <p className="text-sm">
                As automation and AI reshape the job market, it's essential to consider which skills remain valuable.
                Fields requiring human creativity, complex problem-solving, emotional intelligence, and strategic thinking
                tend to be more resilient to technological disruption. Evaluate how {degreeTitle} prepares you for
                an evolving workplace.
              </p>
            </div>
          </motion.div>
        </section>

        <AdSlot slot="in-content" className="container mb-8" />

        {/* ─── COMPARISON SECTION ─── */}
        <section id="comparison" className="container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl space-y-6"
          >
            <h2 className="text-3xl font-bold text-foreground">
              Compare {degreeTitle} with Similar Degrees
            </h2>

            <p className="text-muted-foreground">
              Before making your final decision, it's worth exploring related degrees that might offer better ROI,
              align more closely with your interests, or provide more career flexibility.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/majors" className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-accent/5">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  Compare Different Majors →
                </h3>
                <p className="text-sm text-muted-foreground">
                  See how {degreeTitle} stacks up against other popular degree programs in terms of ROI, salary, and job prospects.
                </p>
              </Link>

              <Link to="/countries" className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-accent/5">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  Best Countries for Education ROI →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Discover which countries offer the best value for {degreeTitle} based on tuition costs and post-graduation salaries.
                </p>
              </Link>

              <Link to="/calculator" className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-accent/5">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  ROI Calculator →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get a personalized ROI estimate based on your specific situation, location, and financial circumstances.
                </p>
              </Link>

              <Link to="/blog" className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-accent/5">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  Education Finance Blog →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Read expert insights on maximizing education ROI, reducing student debt, and career planning strategies.
                </p>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ─── CTA BOX 2 ─── */}
        <section className="container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Ready to Make an Informed Decision?
                </h3>
                <p className="text-muted-foreground">
                  Use our comprehensive ROI calculator to see exact numbers for {degreeTitle} based on your location,
                  program choice, and financial situation. Get instant results in under 2 minutes.
                </p>
              </div>
              <Link to={calculatorLink}>
                <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap">
                  Start Calculator <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <AdSlot slot="below-results" className="container mb-8" />

        {/* FAQs */}
        {page.faqs && page.faqs.length > 0 && (
          <section id="faqs" className="container py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl"
            >
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
                Frequently Asked <span className="text-gradient-accent">Questions</span>
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {page.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-xl border border-border bg-card px-6"
                  >
                    <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* JSON-LD for FAQs */}
              <Helmet>
                <script type="application/ld+json">
                  {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: page.faqs.map((faq) => ({
                      '@type': 'Question',
                      name: faq.question,
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.answer,
                      },
                    })),
                  })}
                </script>
              </Helmet>
            </motion.div>
          </section>
        )}

        {/* ─── BOTTOM LINE SECTION ─── */}
        <section className="container pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl space-y-6 text-muted-foreground"
          >
            <h2 className="text-3xl font-bold text-foreground">
              The Bottom Line: {page.h1Title}
            </h2>

            <p className="text-lg">
              The decision to pursue {degreeTitle} should be based on comprehensive financial analysis, career goals,
              and personal interests. While ROI is important, it's not the only factor to consider.
            </p>

            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Key Takeaways:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Calculate total costs including opportunity cost, not just tuition</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Consider long-term career trajectory, not just starting salary</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Evaluate job market demand and future-proofing potential</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Compare with alternative degrees and career paths</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Use data-driven tools like our ROI calculator for personalized insights</span>
                </li>
              </ul>
            </div>

            <p>
              Remember, the best degree is one that aligns with your strengths, interests, and career goals while
              providing solid financial returns. Use our calculator to get specific numbers for your situation.
            </p>
          </motion.div>
        </section>

        <AdSlot slot="in-content" className="container mb-8" />

        {/* Final CTA */}
        <section className="container pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-2xl p-10 text-center md:p-16"
          >
            <h2 className="text-3xl font-bold text-gradient-hero md:text-4xl">
              Calculate Your Education ROI in 2 Minutes
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
              Get instant, personalized ROI analysis for {degreeTitle} based on your specific situation.
              Make data-driven decisions about your education investment.
            </p>
            <Link to={calculatorLink}>
              <Button
                size="lg"
                className="mt-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base font-semibold"
              >
                Start Free Calculator
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default SeoPage;