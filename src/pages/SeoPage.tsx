import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Loader2 } from 'lucide-react';
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

  return (
    <>
      <Helmet>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={page.canonicalUrl} />
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
                  Calculate ROI
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

        <AdSlot slot="in-content" className="container mt-8" />

        {/* FAQs */}
        {page.faqs && page.faqs.length > 0 && (
          <section className="container py-16">
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

        <AdSlot slot="below-results" className="container mb-8" />

        {/* CTA */}
        <section className="container pb-20">
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
              Use our calculator to make data-driven decisions about your education investment.
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
