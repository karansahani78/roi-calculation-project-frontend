import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, BookOpen, ArrowRight, Tag } from 'lucide-react';
import { AdSlot } from '@/components/ads/AdSlot';

export const BLOG_POSTS = [
  {
    slug: 'is-college-worth-it-in-2025',
    title: 'Is College Worth It in 2025? The Data-Driven Answer',
    excerpt: 'With tuition costs rising and remote work exploding, millions are questioning whether a degree still delivers value. We analyzed 10,000+ salary data points to give you the real answer.',
    category: 'Education ROI',
    readTime: '12 min read',
    date: 'February 10, 2026',
    tags: ['College ROI', 'Tuition', 'Career', 'Worth It'],
    featured: true,
  },
  {
    slug: 'highest-roi-degrees-2025',
    title: 'Top 15 Highest ROI Degrees in 2025 (Ranked by Net Return)',
    excerpt: 'Not all degrees are created equal. Computer Science, Nursing, and Engineering consistently top the ROI charts — but the results might surprise you. Full salary data included.',
    category: 'Best Degrees',
    readTime: '10 min read',
    date: 'February 8, 2026',
    tags: ['Best Degrees', 'ROI', 'Salary', 'Rankings'],
    featured: true,
  },
  {
    slug: 'student-loan-roi-strategy',
    title: 'How to Maximize ROI When Taking Student Loans: The Complete Strategy',
    excerpt: 'Student loan debt hit $1.7 trillion — but borrowing strategically can still lead to excellent returns. Learn exactly how to calculate if your loan is worth taking.',
    category: 'Student Loans',
    readTime: '9 min read',
    date: 'February 5, 2026',
    tags: ['Student Loans', 'Debt', 'Strategy', 'ROI'],
    featured: false,
  },
  {
    slug: 'study-abroad-roi-worth-it',
    title: 'Study Abroad ROI: Is an International Degree Worth the Extra Cost?',
    excerpt: 'International degrees cost 2–5x more, but can unlock global career opportunities and higher salaries. We compare ROI across 20 countries to help you decide.',
    category: 'Study Abroad',
    readTime: '11 min read',
    date: 'February 2, 2026',
    tags: ['Study Abroad', 'International', 'Countries', 'ROI'],
    featured: false,
  },
  {
    slug: 'computer-science-degree-roi',
    title: 'Computer Science Degree ROI in 2025: Is It Still the King?',
    excerpt: 'CS grads earn an average of $105,000 starting salary — but with bootcamps and self-taught developers flooding the market, does a CS degree still make financial sense?',
    category: 'Tech Careers',
    readTime: '8 min read',
    date: 'January 28, 2026',
    tags: ['Computer Science', 'Tech', 'Salary', 'Bootcamp'],
    featured: false,
  },
  {
    slug: 'break-even-analysis-education',
    title: 'Education Break-Even Analysis: How Long Until Your Degree Pays Off?',
    excerpt: 'Most degrees take 5–12 years to break even financially. Learn how to calculate your personal break-even point and what to do if it takes too long.',
    category: 'Financial Planning',
    readTime: '7 min read',
    date: 'January 24, 2026',
    tags: ['Break-Even', 'Financial Planning', 'Analysis', 'Timeline'],
    featured: false,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Education ROI': 'bg-[#C77DFF]/15 text-[#C77DFF] border-[#C77DFF]/20',
  'Best Degrees': 'bg-[#4DD6C8]/15 text-[#4DD6C8] border-[#4DD6C8]/20',
  'Student Loans': 'bg-[#FF9F43]/15 text-[#FF9F43] border-[#FF9F43]/20',
  'Study Abroad': 'bg-[#4C6FFF]/15 text-[#4C6FFF] border-[#4C6FFF]/20',
  'Tech Careers': 'bg-[#FF6EC7]/15 text-[#FF6EC7] border-[#FF6EC7]/20',
  'Financial Planning': 'bg-[#9FE0C3]/15 text-[#9FE0C3] border-[#9FE0C3]/20',
};

const BlogPage = () => {
  const featured = BLOG_POSTS.filter(p => p.featured);
  const rest = BLOG_POSTS.filter(p => !p.featured);

  return (
    <>
      <Helmet>
        <title>Education ROI Blog – Expert Guides on Degree Value & Career Finance | EduROI</title>
        <meta name="description" content="Expert articles on education ROI, degree rankings, student loan strategies, and career finance. Data-driven guides to help you make smarter education investment decisions." />
        <link rel="canonical" href="https://eduroi.com/blog" />
        <meta property="og:title" content="Education ROI Blog – EduROI" />
        <meta property="og:description" content="Expert articles on education ROI, degree rankings, student loan strategies, and career finance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduroi.com/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'EduROI Blog',
            description: 'Expert guides on education ROI, degree value, and career finance',
            url: 'https://eduroi.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'EduROI',
              logo: { '@type': 'ImageObject', url: 'https://eduroi.com/logo.png' },
            },
            blogPost: BLOG_POSTS.map(p => ({
              '@type': 'BlogPosting',
              headline: p.title,
              description: p.excerpt,
              url: `https://eduroi.com/blog/${p.slug}`,
              datePublished: p.date,
              author: { '@type': 'Organization', name: 'EduROI' },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="ambient-orb w-[500px] h-[500px] bg-[#C77DFF] top-[-200px] right-[-200px]" />
        <div className="ambient-orb w-[300px] h-[300px] bg-[#4DD6C8] bottom-[100px] left-[-100px]" />

        {/* Hero */}
        <section className="relative py-14 md:py-20">
          <div className="container max-w-5xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C77DFF]/30 bg-[#C77DFF]/10 px-4 py-1.5 text-sm font-medium text-[#C77DFF]">
                <BookOpen className="h-4 w-4" />
                Education Finance Blog
              </div>
              <h1 className="text-4xl font-extrabold text-white md:text-5xl lg:text-6xl tracking-tight">
                Make Smarter <span className="text-gradient-purple">Education</span> Decisions
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">
                Data-driven guides on degree ROI, student loans, career finance, and making your education investment actually pay off.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container max-w-5xl pb-20">

          {/* Ad above content */}
          <AdSlot slot="in-content" className="mb-10" />

          {/* Featured Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#C77DFF]" />
              Featured Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link to={`/blog/${post.slug}`} className="group glass-card block p-6 transition-all hover:border-[#C77DFF]/40 hover:glow-purple h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[post.category]}`}>
                        <Tag className="h-3 w-3" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#C77DFF] transition-colors leading-snug mb-3">
                      {post.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30">{post.date}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#C77DFF] group-hover:gap-2 transition-all">
                        Read Article <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ad between sections */}
          <AdSlot slot="below-results" className="mb-10" />

          {/* All Other Posts */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#4DD6C8]" />
              All Articles
            </h2>
            <div className="space-y-4">
              {rest.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link to={`/blog/${post.slug}`} className="group glass-card flex flex-col md:flex-row md:items-center gap-4 p-5 transition-all hover:border-white/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[post.category]}`}>
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-white/30">
                          <Clock className="h-3 w-3" />{post.readTime}
                        </span>
                        <span className="text-xs text-white/30">{post.date}</span>
                      </div>
                      <h3 className="font-bold text-white group-hover:text-[#C77DFF] transition-colors mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-white/40 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-[#C77DFF] shrink-0 transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ad after articles */}
          <AdSlot slot="in-content" className="mt-10 mb-10" />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card glow-purple p-10 text-center mt-4"
          >
            <h2 className="text-2xl font-extrabold text-white">Ready to Calculate Your ROI?</h2>
            <p className="mt-3 text-white/50 max-w-md mx-auto">Stop guessing. Use our free calculator to get a data-driven answer in under 2 minutes.</p>
            <Link to="/calculator">
              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] px-8 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-lg">
                Calculate Your ROI Free <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;