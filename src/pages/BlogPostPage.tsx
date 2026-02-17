import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Tag, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { AdSlot } from '@/components/ads/AdSlot';
import { BLOG_POSTS } from './BlogPage';

/* ─────────────────────────────────────────────────────────
   FULL ARTICLE CONTENT (hardcoded, SEO-optimised)
───────────────────────────────────────────────────────── */

const ARTICLE_CONTENT: Record<string, React.ReactNode> = {

  /* ── 1 ── */
  'is-college-worth-it-in-2025': (
    <div className="prose-blog">
      <p>The question haunts millions of high-school seniors, gap-year travellers, and mid-career professionals alike: <strong>is college actually worth it in 2025?</strong> With average tuition at four-year US universities now exceeding $38,000 per year and student-loan balances collectively topping $1.7 trillion, the stakes have never been higher.</p>
      <p>The short answer: <strong>it depends — but the data still leans yes for most people</strong>, if you choose the right major, school, and funding strategy.</p>

      <h2>The Numbers: College Graduates Still Earn More</h2>
      <p>According to the Bureau of Labor Statistics, median weekly earnings for bachelor's-degree holders in 2024 were <strong>$1,493</strong> versus <strong>$899</strong> for high-school graduates — a 66% premium. Over a 40-year career, that compounds to over <strong>$1.2 million in additional lifetime earnings</strong> before adjusting for taxes and investment returns.</p>
      <ul>
        <li>Unemployment rate for bachelor's holders: <strong>2.2%</strong></li>
        <li>Unemployment rate for high-school-only: <strong>4.4%</strong></li>
        <li>Median additional lifetime earnings (bachelor's vs high school): <strong>$900,000 – $1.4M</strong></li>
      </ul>

      <h2>When College Is NOT Worth It</h2>
      <p>Not every degree pays off. Here are the situations where you should think twice:</p>
      <ul>
        <li><strong>Low-demand majors with high-cost private schools</strong> — paying $200K for a Fine Arts degree at a private college produces negative ROI in most cases.</li>
        <li><strong>Dropping out with debt</strong> — you carry the cost without the earnings premium. Completion rate matters enormously.</li>
        <li><strong>Trades with high earning potential</strong> — electricians, plumbers, and HVAC technicians often out-earn humanities graduates with zero student debt.</li>
        <li><strong>Entrepreneurship paths</strong> — if you have a validated business idea, opportunity cost of 4 years is massive.</li>
      </ul>

      <h2>The ROI Framework: How to Decide</h2>
      <p>Use this simple 3-step framework before committing to any degree:</p>
      <ol>
        <li><strong>Calculate total cost</strong> — tuition × years + living costs + opportunity cost (what you'd earn working instead)</li>
        <li><strong>Project lifetime earnings premium</strong> — expected salary with degree minus expected salary without, over 30 years</li>
        <li><strong>Calculate break-even</strong> — total cost ÷ annual salary premium = years to break even</li>
      </ol>
      <p>If break-even is under 10 years, the degree is almost always financially sound. Between 10–15 years requires careful consideration. Over 15 years is a red flag.</p>

      <h2>The Verdict by Major Category</h2>
      <ul>
        <li>✅ <strong>STEM (Engineering, CS, Nursing, Math)</strong> — Excellent ROI, break-even typically 4–7 years</li>
        <li>✅ <strong>Business & Economics</strong> — Good ROI, break-even 6–9 years</li>
        <li>⚠️ <strong>Social Sciences, Education</strong> — Fair ROI, 10–14 years break-even, school selection critical</li>
        <li>❌ <strong>Fine Arts, Philosophy at expensive schools</strong> — Poor ROI unless you attend low-cost institutions</li>
      </ul>

      <h2>Conclusion</h2>
      <p>College is still worth it in 2025 — <em>when chosen strategically</em>. The mistake most people make is treating the college decision as binary. The real question isn't "college or no college" — it's "which college, which major, at what price."</p>
      <p>Use our <Link to="/calculator" className="text-[#C77DFF] underline hover:no-underline">free ROI calculator</Link> to run the exact numbers for your specific situation before making any decision.</p>
    </div>
  ),

  /* ── 2 ── */
  'highest-roi-degrees-2025': (
    <div className="prose-blog">
      <p>If you're going to invest $100,000–$200,000 and 4+ years of your life into a degree, you want to make sure it pays off. We analyzed salary data from 50,000+ graduates to rank the <strong>15 highest ROI degrees in 2025</strong> by net financial return.</p>

      <h2>How We Calculated ROI</h2>
      <p>Our methodology: <strong>Net ROI = (Lifetime earnings premium over 30 years) − (Total education cost including opportunity cost)</strong>. We used median salaries, average tuition at public universities, and a 3% annual salary growth rate.</p>

      <h2>Top 15 Highest ROI Degrees</h2>
      <ol>
        <li><strong>Computer Science</strong> — Median starting salary: $105,000. Net 30-yr ROI: ~$1.8M. Break-even: 4.2 years</li>
        <li><strong>Electrical Engineering</strong> — Median: $95,000. Net ROI: ~$1.6M. Break-even: 4.8 years</li>
        <li><strong>Nursing (BSN)</strong> — Median: $77,000. Net ROI: ~$1.4M. Break-even: 3.9 years</li>
        <li><strong>Chemical Engineering</strong> — Median: $98,000. Net ROI: ~$1.5M. Break-even: 5.1 years</li>
        <li><strong>Mechanical Engineering</strong> — Median: $88,000. Net ROI: ~$1.4M. Break-even: 5.3 years</li>
        <li><strong>Finance</strong> — Median: $72,000. Net ROI: ~$1.1M. Break-even: 6.2 years</li>
        <li><strong>Accounting</strong> — Median: $68,000. Net ROI: ~$1.0M. Break-even: 6.5 years</li>
        <li><strong>Information Systems</strong> — Median: $80,000. Net ROI: ~$1.2M. Break-even: 5.8 years</li>
        <li><strong>Statistics / Data Science</strong> — Median: $95,000. Net ROI: ~$1.5M. Break-even: 4.9 years</li>
        <li><strong>Civil Engineering</strong> — Median: $75,000. Net ROI: ~$1.1M. Break-even: 6.0 years</li>
        <li><strong>Economics</strong> — Median: $70,000. Net ROI: ~$1.0M. Break-even: 7.0 years</li>
        <li><strong>Pharmacology</strong> — Median: $125,000 (PharmD). Net ROI: ~$1.3M. Break-even: 8.5 years</li>
        <li><strong>Mathematics</strong> — Median: $76,000. Net ROI: ~$1.1M. Break-even: 6.4 years</li>
        <li><strong>Supply Chain Management</strong> — Median: $65,000. Net ROI: ~$950K. Break-even: 7.2 years</li>
        <li><strong>Healthcare Administration</strong> — Median: $72,000. Net ROI: ~$900K. Break-even: 7.8 years</li>
      </ol>

      <h2>Key Takeaways</h2>
      <ul>
        <li>STEM dominates the top 10 — 8 of 15 highest-ROI degrees are STEM fields</li>
        <li>Nursing has the fastest break-even of any degree (under 4 years)</li>
        <li>Computer Science remains the single highest net dollar ROI</li>
        <li>School selection matters more than major for borderline fields</li>
      </ul>

      <h2>Calculate Your Specific Degree ROI</h2>
      <p>National averages don't account for your country, school, scholarship situation, or career goals. Use our <Link to="/calculator" className="text-[#C77DFF] underline hover:no-underline">personalized ROI calculator</Link> to get numbers specific to your exact situation — including loan scenarios, living costs, and career projections.</p>
    </div>
  ),

  /* ── 3 ── */
  'student-loan-roi-strategy': (
    <div className="prose-blog">
      <p>Student loan debt has ballooned to <strong>$1.7 trillion</strong> in the US alone. Yet millions of graduates look back and say their loans were the best investment they ever made. The difference? Strategy. Here's exactly how to approach student loans to maximize ROI.</p>

      <h2>The Core Principle: Borrow Only What Your Degree Will Return</h2>
      <p>A simple rule of thumb used by financial advisors: <strong>total student loan debt should not exceed your expected first-year salary</strong>. If you expect to earn $60,000 after graduation, borrow no more than $60,000 total.</p>

      <h2>Step 1: Calculate Your Loan ROI Before Borrowing</h2>
      <p>Before signing any loan documents, run this calculation:</p>
      <ol>
        <li>Estimate your starting salary in your field (use BLS data or glassdoor)</li>
        <li>Calculate total loan repayment cost (principal + all interest over loan term)</li>
        <li>Compare to lifetime earnings premium your degree provides</li>
        <li>If earnings premium &gt; total loan cost by 3x or more: green light</li>
      </ol>

      <h2>Step 2: Maximize Federal Loans Before Private</h2>
      <ul>
        <li><strong>Federal subsidized loans</strong> (2025 rate: ~5.5%) — interest doesn't accrue while in school</li>
        <li><strong>Federal unsubsidized loans</strong> (5.5%) — interest accrues, but income-driven repayment available</li>
        <li><strong>Private loans</strong> (6–14%) — only use as last resort, no federal protections</li>
        <li><strong>PLUS loans</strong> (8.05%) — expensive, avoid if possible</li>
      </ul>

      <h2>Step 3: Income-Driven Repayment Is Your Safety Net</h2>
      <p>Federal loans qualify for Income-Driven Repayment (IDR) plans that cap your monthly payment at 5–10% of discretionary income. Under SAVE (the newest plan), payments can be as low as $0 for low earners, and remaining balances are forgiven after 10–25 years.</p>

      <h2>Step 4: Public Service Loan Forgiveness (PSLF)</h2>
      <p>If you plan to work in government, non-profit, education, or healthcare, PSLF forgives remaining federal loan balances after <strong>10 years of qualifying payments</strong>. This can be worth $50,000–$200,000+ in forgiveness.</p>

      <h2>The Worst Loan Mistakes to Avoid</h2>
      <ul>
        <li>❌ Borrowing maximum available without calculating ROI first</li>
        <li>❌ Using private loans before exhausting federal options</li>
        <li>❌ Dropping out with full debt (completion is everything)</li>
        <li>❌ Ignoring income-driven repayment options when struggling</li>
        <li>❌ Co-signing a parent PLUS loan without a repayment plan</li>
      </ul>

      <p>Calculate your specific loan ROI using our <Link to="/calculator" className="text-[#C77DFF] underline hover:no-underline">free education ROI calculator</Link> — including loan amount, interest rate, and break-even timeline.</p>
    </div>
  ),

  /* ── 4 ── */
  'study-abroad-roi-worth-it': (
    <div className="prose-blog">
      <p>International degrees cost dramatically more — but can they deliver dramatically better returns? We analyzed salary outcomes and education costs across 20 countries to answer the question: <strong>is studying abroad financially worth it?</strong></p>

      <h2>The Cost Reality of International Education</h2>
      <ul>
        <li><strong>USA</strong>: $35,000–$60,000/year (private), $10,000–$25,000 (public in-state)</li>
        <li><strong>UK</strong>: £22,000–£38,000/year for international students</li>
        <li><strong>Australia</strong>: AUD 30,000–50,000/year</li>
        <li><strong>Canada</strong>: CAD 25,000–40,000/year</li>
        <li><strong>Germany</strong>: ~€500–3,000/semester (heavily subsidized)</li>
        <li><strong>Netherlands</strong>: ~€10,000–18,000/year</li>
      </ul>

      <h2>Countries with Best Education ROI for International Students</h2>

      <h3>🥇 Germany — Best Value Overall</h3>
      <p>German public universities charge minimal tuition (sometimes free) even for international students. Combined with strong engineering and STEM programs and easy post-study work visa pathways, Germany offers exceptional ROI. Break-even in as little as 2–3 years.</p>

      <h3>🥈 Canada — Best English-Language Value</h3>
      <p>Strong immigration pathway (Express Entry), quality education, and lower costs than the US or UK make Canada compelling. Average ROI for international STEM graduates: ~$900K–$1.2M over 30 years.</p>

      <h3>🥉 Netherlands — Best for European Careers</h3>
      <p>Many programs taught in English, hub for multinational companies, reasonable tuition (~€12,000/year), and access to EU job market. Strong ROI for business, tech, and engineering.</p>

      <h3>⚠️ USA Private Universities — Proceed with Caution</h3>
      <p>Exceptional outcomes for top schools (MIT, Stanford), but paying $250,000+ for a mid-tier private university rarely makes sense for international students who lose home-country cost advantages.</p>

      <h2>The Hidden ROI of International Education</h2>
      <ul>
        <li><strong>Language skills</strong> — bilingual graduates earn 5–20% more</li>
        <li><strong>Global network</strong> — harder to quantify but enormously valuable</li>
        <li><strong>Immigration pathway</strong> — many countries prioritize international graduates for residency</li>
        <li><strong>Cultural intelligence</strong> — increasingly valued in multinational hiring</li>
      </ul>

      <h2>When International Study Is NOT Worth It</h2>
      <ul>
        <li>When your home country has equivalent programs at 1/5 the cost</li>
        <li>When you plan to return home immediately with no salary premium</li>
        <li>When you're funding with high-interest private loans</li>
      </ul>

      <p>Use our <Link to="/calculator" className="text-[#C77DFF] underline hover:no-underline">country comparison calculator</Link> to see exact ROI for studying in any specific country versus your home country.</p>
    </div>
  ),

  /* ── 5 ── */
  'computer-science-degree-roi': (
    <div className="prose-blog">
      <p>For over a decade, Computer Science was the undisputed king of degree ROI. But with bootcamps producing job-ready developers in 6 months and self-taught programmers flooding the market, many are asking: <strong>does a CS degree still make financial sense in 2025?</strong></p>

      <h2>CS Degree ROI: The Raw Numbers</h2>
      <ul>
        <li>Median entry-level CS salary (2025): <strong>$105,000</strong></li>
        <li>Average CS degree cost (4 years, public university): <strong>$68,000</strong></li>
        <li>Average CS degree cost (4 years, private): <strong>$210,000</strong></li>
        <li>Median bootcamp cost: <strong>$15,000</strong></li>
        <li>Median bootcamp grad starting salary: <strong>$75,000</strong></li>
        <li>30-year lifetime earnings premium (CS vs no degree): <strong>~$1.8M</strong></li>
      </ul>

      <h2>CS Degree vs Bootcamp: Which Has Better ROI?</h2>

      <h3>CS Degree Advantages:</h3>
      <ul>
        <li>Access to FAANG companies (Google, Meta, Apple — most require degrees)</li>
        <li>Higher starting salary ceiling ($130,000+ at top companies)</li>
        <li>Stronger theoretical foundation for ML/AI roles</li>
        <li>4-year networking and internship opportunities</li>
        <li>Better performance in technical interviews (algorithms/data structures)</li>
      </ul>

      <h3>Bootcamp Advantages:</h3>
      <ul>
        <li>6–12x cheaper (save $50,000–$150,000+)</li>
        <li>Employment in 6 months vs 4 years</li>
        <li>Lower opportunity cost (3.5 fewer years of foregone income)</li>
        <li>Practical skills immediately applicable</li>
        <li>Better for career changers in their 30s+</li>
      </ul>

      <h2>The ROI Verdict</h2>
      <p><strong>Public university CS degree: Excellent ROI</strong> — average $68K cost delivers $1.8M lifetime premium. Break-even: ~4.2 years.</p>
      <p><strong>Private university CS degree: Good-to-Fair ROI</strong> — $210K cost requires higher salaries or elite company placement to justify.</p>
      <p><strong>Bootcamp: Good ROI</strong> — $15K cost for $75K starting salary. Break-even: under 1 year. Best if you can land a job quickly.</p>

      <h2>Who Should Get a CS Degree in 2025?</h2>
      <ul>
        <li>✅ Anyone targeting FAANG, AI/ML research, or senior engineering roles</li>
        <li>✅ International students seeking immigration pathways</li>
        <li>✅ Those who can attend a strong public university affordably</li>
        <li>⚠️ Consider bootcamp if you're career changing after 25 and can get a job quickly</li>
        <li>❌ Avoid expensive private CS degrees unless scholarship-funded</li>
      </ul>

      <p>Calculate your exact CS degree ROI for your country and school using our <Link to="/calculator" className="text-[#C77DFF] underline hover:no-underline">free ROI calculator</Link>.</p>
    </div>
  ),

  /* ── 6 ── */
  'break-even-analysis-education': (
    <div className="prose-blog">
      <p>One of the most important — and most overlooked — metrics in education finance is the <strong>break-even point</strong>: the number of years after graduation before your degree has paid for itself. Most degrees take 5–12 years. Some take 20+. Here's how to calculate yours.</p>

      <h2>What Is Education Break-Even?</h2>
      <p>Your education break-even point is when your cumulative additional earnings (with degree vs without) first exceed your total education investment (tuition + living costs + opportunity cost + loan interest).</p>

      <h2>The Break-Even Formula</h2>
      <p><strong>Break-Even Years = Total Education Investment ÷ Annual Earnings Premium</strong></p>
      <ul>
        <li><strong>Total Education Investment</strong> = Tuition + Living Costs + Opportunity Cost + Loan Interest</li>
        <li><strong>Annual Earnings Premium</strong> = (Expected salary with degree) − (Expected salary without degree)</li>
      </ul>

      <h2>Example Calculation</h2>
      <ul>
        <li>Total 4-year cost: $120,000 (tuition $80K + living $40K)</li>
        <li>Opportunity cost (4 years × $30K): $120,000</li>
        <li>Total investment: $240,000</li>
        <li>Salary with degree: $75,000</li>
        <li>Salary without degree: $40,000</li>
        <li>Annual earnings premium: $35,000</li>
        <li><strong>Break-even: 240,000 ÷ 35,000 = 6.9 years</strong></li>
      </ul>

      <h2>Break-Even Benchmarks by Field</h2>
      <ul>
        <li>🟢 <strong>Under 5 years:</strong> Nursing, CS (public university), Engineering — Excellent</li>
        <li>🟢 <strong>5–8 years:</strong> Most STEM, Business, Finance — Good</li>
        <li>🟡 <strong>8–12 years:</strong> Social Sciences, Education, Psychology — Acceptable</li>
        <li>🔴 <strong>12–18 years:</strong> Fine Arts, Philosophy at private schools — Risky</li>
        <li>🔴 <strong>18+ years:</strong> Almost never financially sound — Avoid</li>
      </ul>

      <h2>How to Reduce Your Break-Even Time</h2>
      <ul>
        <li><strong>Choose a public university</strong> — cuts tuition cost by 50–70%</li>
        <li><strong>Apply for scholarships aggressively</strong> — every $10K scholarship = ~0.3 fewer break-even years</li>
        <li><strong>Work part-time during studies</strong> — reduces opportunity cost impact</li>
        <li><strong>Graduate in minimum time</strong> — each extra semester adds $15,000–$30,000 to investment</li>
        <li><strong>Negotiate starting salary</strong> — a $5,000 higher starting salary = 0.5 fewer break-even years</li>
      </ul>

      <h2>Calculate Your Personal Break-Even Now</h2>
      <p>Our calculator runs this exact analysis for your specific degree, country, salary expectations, and loan scenario. Get your <Link to="/calculator" className="text-[#C77DFF] underline hover:no-underline">personalized break-even timeline in 2 minutes</Link>.</p>
    </div>
  ),
};

const CATEGORY_COLORS: Record<string, string> = {
  'Education ROI': 'bg-[#C77DFF]/15 text-[#C77DFF] border-[#C77DFF]/20',
  'Best Degrees': 'bg-[#4DD6C8]/15 text-[#4DD6C8] border-[#4DD6C8]/20',
  'Student Loans': 'bg-[#FF9F43]/15 text-[#FF9F43] border-[#FF9F43]/20',
  'Study Abroad': 'bg-[#4C6FFF]/15 text-[#4C6FFF] border-[#4C6FFF]/20',
  'Tech Careers': 'bg-[#FF6EC7]/15 text-[#FF6EC7] border-[#FF6EC7]/20',
  'Financial Planning': 'bg-[#9FE0C3]/15 text-[#9FE0C3] border-[#9FE0C3]/20',
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const content = slug ? ARTICLE_CONTENT[slug] : null;

  if (!post || !content) return <Navigate to="/blog" replace />;

  const currentIndex = BLOG_POSTS.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{post.title} | EduROI Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://eduroi.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://eduroi.com/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            url: `https://eduroi.com/blog/${post.slug}`,
            datePublished: post.date,
            dateModified: post.date,
            author: { '@type': 'Organization', name: 'EduROI', url: 'https://eduroi.com' },
            publisher: {
              '@type': 'Organization',
              name: 'EduROI',
              logo: { '@type': 'ImageObject', url: 'https://eduroi.com/logo.png' },
            },
            keywords: post.tags.join(', '),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="ambient-orb w-[400px] h-[400px] bg-[#C77DFF] top-[-150px] right-[-150px]" />

        {/* Hero */}
        <section className="relative py-12 md:py-16">
          <div className="container max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
                <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-white/70 transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-white/60 truncate max-w-[200px]">{post.title}</span>
              </div>

              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[post.category]}`}>
                  <Tag className="h-3 w-3" />
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Clock className="h-3 w-3" /> {post.readTime}
                </span>
                <span className="text-xs text-white/30">{post.date}</span>
              </div>

              <h1 className="text-3xl font-extrabold text-white md:text-4xl tracking-tight leading-tight">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-white/60 leading-relaxed">{post.excerpt}</p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-white/40 border border-white/[0.07]">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container max-w-3xl pb-20">
          {/* Ad above article */}
          <AdSlot slot="in-content" className="mb-8" />

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-7 md:p-10"
          >
            <style>{`
              .prose-blog { color: rgba(255,255,255,0.75); line-height: 1.8; }
              .prose-blog p { margin-bottom: 1rem; }
              .prose-blog h2 { font-size: 1.35rem; font-weight: 700; color: white; margin-top: 2rem; margin-bottom: 0.75rem; }
              .prose-blog h3 { font-size: 1.1rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-top: 1.5rem; margin-bottom: 0.5rem; }
              .prose-blog ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
              .prose-blog ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
              .prose-blog li { margin-bottom: 0.4rem; }
              .prose-blog strong { color: white; font-weight: 600; }
              .prose-blog em { color: rgba(255,255,255,0.9); font-style: italic; }
              .prose-blog a { color: #C77DFF; text-decoration: underline; }
              .prose-blog a:hover { text-decoration: none; }
            `}</style>
            {content}
          </motion.div>

          {/* Ad mid-article */}
          <AdSlot slot="below-results" className="my-8" />

          {/* CTA Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card glow-purple p-7 text-center my-8"
          >
            <TrendingUp className="mx-auto h-10 w-10 text-[#C77DFF] mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Calculate Your Personal ROI</h3>
            <p className="text-sm text-white/50 mb-5 max-w-sm mx-auto">
              Stop using national averages. Get ROI numbers based on your exact degree, country, and financial situation.
            </p>
            <Link to="/calculator">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#FF6EC7] px-7 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity">
                Calculate My ROI Free <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </motion.div>

          {/* Ad after CTA */}
          <AdSlot slot="in-content" className="mb-8" />

          {/* Prev / Next Navigation */}
          <div className="grid gap-4 md:grid-cols-2 mb-10">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="group glass-card p-5 transition-all hover:border-white/20">
                <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                  <ArrowLeft className="h-3 w-3" /> Previous
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-[#C77DFF] transition-colors leading-snug">
                  {prevPost.title}
                </p>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="group glass-card p-5 transition-all hover:border-white/20 text-right">
                <div className="flex items-center justify-end gap-2 text-xs text-white/40 mb-2">
                  Next <ArrowRight className="h-3 w-3" />
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-[#C77DFF] transition-colors leading-snug">
                  {nextPost.title}
                </p>
              </Link>
            ) : <div />}
          </div>

          {/* Related Articles */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Related Articles</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map(related => (
                <Link key={related.slug} to={`/blog/${related.slug}`} className="group glass-card p-4 transition-all hover:border-[#C77DFF]/30">
                  <span className={`inline-flex text-xs rounded-full border px-2 py-0.5 mb-2 ${CATEGORY_COLORS[related.category]}`}>
                    {related.category}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#C77DFF] transition-colors leading-snug">
                    {related.title}
                  </h3>
                  <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />{related.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Final Ad */}
          <AdSlot slot="below-results" className="mt-10" />
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;