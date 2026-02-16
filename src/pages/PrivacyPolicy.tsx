import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, AlertCircle, Lock, Eye, Cookie, Database, UserCheck, Mail, ArrowRight, CheckCircle, Globe, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – EduROI Education ROI Calculator</title>
        <meta name="description" content="EduROI Privacy Policy: Learn how we collect, use, protect, and safeguard your personal information when using our free education ROI calculator. GDPR compliant, transparent data practices." />
        <link rel="canonical" href="https://eduroi.com/privacy-policy" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy – EduROI" />
        <meta property="og:description" content="How we protect your privacy and handle your data when using our education ROI calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduroi.com/privacy-policy" />
        
        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Privacy Policy',
            description: 'Privacy policy for EduROI education ROI calculator',
            url: 'https://eduroi.com/privacy-policy',
            publisher: {
              '@type': 'Organization',
              name: 'EduROI',
              logo: {
                '@type': 'ImageObject',
                url: 'https://eduroi.com/logo.png'
              }
            },
            datePublished: '2026-02-15',
            dateModified: '2026-02-15'
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="gradient-hero relative overflow-hidden py-12 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(160_84%_39%_/_0.1),_transparent_60%)]" />
          <div className="container relative max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                <Lock className="h-4 w-4" />
                Privacy & Data Protection
              </div>
              <h1 className="text-3xl font-bold text-gradient-hero md:text-4xl lg:text-5xl">
                Privacy Policy
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/70">
                Your privacy matters to us. Learn how we collect, use, and protect your personal information.
              </p>
              <p className="mt-3 text-sm text-primary-foreground/60">
                Last updated: February 15, 2026 • GDPR Compliant
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Summary Box */}
        <section className="container max-w-4xl py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border-2 border-accent/20 bg-accent/5 p-6"
          >
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 shrink-0 text-accent mt-1" />
              <div>
                <h2 className="text-lg font-bold text-foreground mb-3">Privacy at a Glance</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>We <strong>don't require registration</strong> to use our calculator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>Calculator inputs are <strong>not stored</strong> unless you create a shareable link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>We use <strong>cookies and analytics</strong> to improve your experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>Third-party ads (Google AdSense) may <strong>track your browsing</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>You have <strong>full control</strong> over your data and privacy settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Table of Contents */}
        <section className="container max-w-4xl pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Table of Contents
            </h2>
            <div className="grid gap-2 md:grid-cols-2 text-sm">
              <a href="#introduction" className="text-accent hover:underline">1. Introduction</a>
              <a href="#information" className="text-accent hover:underline">2. Information We Collect</a>
              <a href="#usage" className="text-accent hover:underline">3. How We Use Your Information</a>
              <a href="#sharing" className="text-accent hover:underline">4. Information Sharing</a>
              <a href="#third-party" className="text-accent hover:underline">5. Third-Party Services</a>
              <a href="#cookies" className="text-accent hover:underline">6. Cookies & Tracking</a>
              <a href="#data-retention" className="text-accent hover:underline">7. Data Retention</a>
              <a href="#your-rights" className="text-accent hover:underline">8. Your Privacy Rights</a>
              <a href="#children" className="text-accent hover:underline">9. Children's Privacy</a>
              <a href="#security" className="text-accent hover:underline">10. Data Security</a>
              <a href="#international" className="text-accent hover:underline">11. International Transfers</a>
              <a href="#changes" className="text-accent hover:underline">12. Policy Changes</a>
              <a href="#contact" className="text-accent hover:underline">13. Contact Us</a>
            </div>
          </motion.div>
        </section>

        <AdSlot slot="in-content" className="container max-w-4xl mb-8" />

        {/* Main Content */}
        <div className="container max-w-4xl pb-12">
          <div className="space-y-10 text-foreground/90 leading-relaxed">
            
            {/* Section 1 */}
            <motion.section
              id="introduction"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">1</div>
                <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  Welcome to EduROI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains in detail how we collect, use, disclose, and safeguard your information when you visit our website at <strong>eduroi.com</strong> and use our education ROI calculator services.
                </p>
                <p>
                  By accessing or using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
                </p>
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-accent" />
                    GDPR & Privacy Law Compliance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We comply with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other applicable privacy laws. We respect your rights to privacy, data access, and control over your personal information.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section
              id="information"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">2</div>
                <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
              </div>
              <div className="space-y-4 pl-11">
                <p>
                  We collect several types of information to provide and improve our Service. The information we collect includes:
                </p>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-accent" />
                      Usage Data & Calculator Inputs
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Calculator inputs:</strong> Country, major, degree level, tuition costs, living expenses, expected salary, and other financial parameters you enter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Browsing behavior:</strong> Pages visited, time spent on pages, links clicked, and navigation paths</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Session data:</strong> Date and time of visits, session duration, and repeat visit patterns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Referral sources:</strong> Where you came from (search engines, social media, direct links)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Database className="h-5 w-5 text-accent" />
                      Technical & Device Information
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Device details:</strong> Device type (desktop, mobile, tablet), operating system, screen resolution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Browser information:</strong> Browser type, version, language preference, and timezone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>IP address:</strong> Your Internet Protocol address (anonymized in analytics)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Network information:</strong> Internet service provider and approximate geographic location</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-accent" />
                      Voluntarily Provided Information
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Contact forms:</strong> Name, email address, and message content when you reach out to us</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Feedback submissions:</strong> Comments, suggestions, or bug reports you choose to share</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Newsletter subscriptions:</strong> Email address if you opt-in to receive updates (optional)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        <span><strong>Shared results:</strong> Calculator data when you create a shareable link</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm">
                  <strong>Important:</strong> We do NOT require user accounts or registration to use our calculator. Most usage is completely anonymous unless you choose to share results or contact us directly.
                </p>
              </div>
            </motion.section>

            <AdSlot slot="in-content" className="my-8" />

            {/* Section 3 */}
            <motion.section
              id="usage"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">3</div>
                <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Provide our core service:</strong> Calculate education ROI, generate reports, and display comparison data</li>
                  <li><strong>Improve user experience:</strong> Analyze how visitors use our site to optimize navigation, speed, and functionality</li>
                  <li><strong>Personalize content:</strong> Remember your preferences and display relevant information</li>
                  <li><strong>Display advertisements:</strong> Show relevant ads through third-party networks like Google AdSense</li>
                  <li><strong>Analytics and research:</strong> Understand usage patterns, popular features, and user demographics (in aggregate)</li>
                  <li><strong>Customer support:</strong> Respond to your inquiries, questions, and feedback</li>
                  <li><strong>Security and fraud prevention:</strong> Detect and prevent abuse, spam, and malicious activity</li>
                  <li><strong>Legal compliance:</strong> Meet our legal obligations and enforce our Terms of Service</li>
                  <li><strong>Product development:</strong> Test new features, conduct A/B testing, and gather feedback</li>
                  <li><strong>Communications:</strong> Send service updates, policy changes, or newsletter content (if opted-in)</li>
                </ul>
                <p>
                  We process your data based on your consent, our legitimate business interests, and legal obligations. You can withdraw consent or object to processing at any time (see "Your Privacy Rights" section).
                </p>
              </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section
              id="sharing"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">4</div>
                <h2 className="text-2xl font-bold text-foreground">Information Sharing & Disclosure</h2>
              </div>
              <div className="space-y-3 pl-11">
                <div className="rounded-lg border-2 border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-400">
                    ✅ We do NOT sell, rent, or trade your personal information to third parties for their marketing purposes.
                  </p>
                </div>
                <p>
                  However, we may share your information in the following limited circumstances:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Service providers:</strong> Third-party companies that help us operate our website (hosting, analytics, email services)</li>
                  <li><strong>Advertising partners:</strong> Networks like Google AdSense that display ads (they may collect data via cookies)</li>
                  <li><strong>Analytics providers:</strong> Tools like Google Analytics that help us understand usage patterns</li>
                  <li><strong>Legal requirements:</strong> When required by law, court order, or government request</li>
                  <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                  <li><strong>With your consent:</strong> When you explicitly agree to share your information</li>
                  <li><strong>Public sharing:</strong> When you create a shareable ROI calculation link (voluntary)</li>
                </ul>
                <p>
                  All third-party service providers are contractually obligated to keep your information confidential and use it only for the purposes we specify.
                </p>
              </div>
            </motion.section>

            <AdSlot slot="in-content" className="my-8" />

            {/* Section 5 */}
            <motion.section
              id="third-party"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">5</div>
                <h2 className="text-2xl font-bold text-foreground">Third-Party Services & Integrations</h2>
              </div>
              <div className="space-y-4 pl-11">
                <p>
                  We use the following third-party services that may collect information about you:
                </p>

                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">Google AdSense</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    We display advertisements through Google AdSense. Google uses cookies to serve ads based on your prior visits to our website and other sites.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>Google may collect data about your browsing activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>Ads may be personalized based on your interests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>You can opt out via <a href="https://adssettings.google.com" className="text-accent underline hover:no-underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">Google Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    We use Google Analytics to collect anonymous usage statistics and understand how visitors interact with our site.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>Collects data on page views, sessions, and user behavior</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>IP addresses are anonymized to protect privacy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" className="text-accent underline hover:no-underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">Affiliate Partners</h3>
                  <p className="text-sm text-muted-foreground">
                    We may link to third-party educational services, universities, or financial tools and earn commissions on referrals. These partners may have their own privacy policies, which we encourage you to review.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Section 6 */}
            <motion.section
              id="cookies"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">6</div>
                <h2 className="text-2xl font-bold text-foreground">Cookies & Tracking Technologies</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience and collect information about how you use our Service.
                </p>

                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Cookie className="h-5 w-5 text-accent" />
                    What are Cookies?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences, login status, and browsing behavior.
                  </p>
                </div>

                <p><strong>Types of cookies we use:</strong></p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Essential cookies:</strong> Required for the website to function properly (e.g., security, session management)</li>
                  <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site (Google Analytics)</li>
                  <li><strong>Advertising cookies:</strong> Used to display relevant ads and measure ad performance (Google AdSense)</li>
                  <li><strong>Preference cookies:</strong> Remember your settings and preferences (e.g., language, theme)</li>
                  <li><strong>Third-party cookies:</strong> Set by external services we use (analytics, ads, social media)</li>
                </ul>

                <div className="rounded-lg border border-border bg-card p-5 mt-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-accent" />
                    Managing Cookies
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    You have full control over cookies and can manage your preferences:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies through settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span><strong>Opt-out tools:</strong> Use Google Ads Settings and Analytics Opt-out tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span><strong>Do Not Track:</strong> We respect browser "Do Not Track" signals when possible</span>
                    </li>
                  </ul>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-3">
                    ⚠️ Note: Disabling cookies may affect the functionality of certain features on our website.
                  </p>
                </div>
              </div>
            </motion.section>

            <AdSlot slot="in-content" className="my-8" />

            {/* Section 7 */}
            <motion.section
              id="data-retention"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">7</div>
                <h2 className="text-2xl font-bold text-foreground">Data Retention</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  We retain your information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
                <p><strong>Specific retention periods:</strong></p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Calculator inputs:</strong> Immediately discarded unless you create a shareable link (stored for up to 12 months)</li>
                  <li><strong>Analytics data:</strong> Anonymized usage statistics retained for up to 26 months (Google Analytics standard)</li>
                  <li><strong>Contact form submissions:</strong> Retained for up to 2 years for customer support purposes</li>
                  <li><strong>Cookie data:</strong> Varies by cookie type (typically 1 day to 2 years)</li>
                  <li><strong>Server logs:</strong> Automatically deleted after 90 days</li>
                  <li><strong>Newsletter subscriptions:</strong> Retained until you unsubscribe</li>
                </ul>
                <p>
                  When data is no longer needed, we securely delete or anonymize it. You can request early deletion of your data at any time (see "Your Privacy Rights" section).
                </p>
              </div>
            </motion.section>

            {/* Section 8 */}
            <motion.section
              id="your-rights"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">8</div>
                <h2 className="text-2xl font-bold text-foreground">Your Privacy Rights</h2>
              </div>
              <div className="space-y-4 pl-11">
                <p>
                  Depending on your jurisdiction (especially if you're in the EU, EEA, UK, or California), you have the following privacy rights:
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Right to Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of the personal data we hold about you
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Right to Rectification</h3>
                    <p className="text-sm text-muted-foreground">
                      Correct any inaccurate or incomplete personal information
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Right to Erasure</h3>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your personal data ("right to be forgotten")
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Right to Object</h3>
                    <p className="text-sm text-muted-foreground">
                      Object to processing of your data for specific purposes
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Right to Portability</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive your data in a machine-readable format
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Right to Restrict</h3>
                    <p className="text-sm text-muted-foreground">
                      Limit how we use your personal information
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Right to Withdraw Consent</h3>
                    <p className="text-sm text-muted-foreground">
                      Revoke consent for data processing at any time
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">Right to Complain</h3>
                    <p className="text-sm text-muted-foreground">
                      Lodge a complaint with your data protection authority
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-accent/20 bg-accent/5 p-5 mt-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Download className="h-5 w-5 text-accent" />
                    How to Exercise Your Rights
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    To exercise any of these rights, please contact us at{' '}
                    <a href="mailto:privacyeduroi@gmail.com" className="text-accent underline hover:no-underline">privacyeduroi@gmail.com</a> with:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground pl-6">
                    <li>• Your full name and contact information</li>
                    <li>• Description of which right you wish to exercise</li>
                    <li>• Any relevant details to help us process your request</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">
                    We will respond to your request within <strong>30 days</strong> (or sooner as required by law).
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Section 9 */}
            <motion.section
              id="children"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">9</div>
                <h2 className="text-2xl font-bold text-foreground">Children's Privacy</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  Our services are not directed to individuals under the age of <strong>13</strong> (or 16 in some jurisdictions). We do not knowingly collect personal information from children without parental consent.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at{' '}
                  <a href="mailto:privacyeduroi@gmail.com" className="text-accent underline hover:no-underline">privacyeduroi@gmail.com</a>.
                </p>
                <p>
                  If we become aware that we have inadvertently collected data from a child without proper consent, we will take immediate steps to delete that information from our servers.
                </p>
              </div>
            </motion.section>

            <AdSlot slot="in-content" className="my-8" />

            {/* Section 10 */}
            <motion.section
              id="security"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">10</div>
                <h2 className="text-2xl font-bold text-foreground">Data Security</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  We implement reasonable and appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p><strong>Our security measures include:</strong></p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using SSL/TLS</li>
                  <li><strong>Secure hosting:</strong> Our website is hosted on secure, reputable infrastructure with regular security updates</li>
                  <li><strong>Access controls:</strong> Limited employee access to personal data on a need-to-know basis</li>
                  <li><strong>Regular monitoring:</strong> Continuous monitoring for security threats and vulnerabilities</li>
                  <li><strong>Data minimization:</strong> We collect only the data necessary for our services</li>
                  <li><strong>Secure deletion:</strong> Permanent deletion of data when no longer needed</li>
                </ul>
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-5 mt-4">
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    ⚠️ <strong>Important:</strong> While we take security seriously, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information. You use our Service at your own risk.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Section 11 */}
            <motion.section
              id="international"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">11</div>
                <h2 className="text-2xl font-bold text-foreground">International Data Transfers</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ.
                </p>
                <p>
                  If you are located outside the country where our servers are located and choose to use our Service, you consent to the transfer of your information to that jurisdiction.
                </p>
                <p>
                  We ensure appropriate safeguards are in place for international transfers, including:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Standard contractual clauses approved by the European Commission</li>
                  <li>Adequacy decisions for data transfers to countries with adequate protection</li>
                  <li>Compliance with applicable data transfer regulations (GDPR, CCPA, etc.)</li>
                </ul>
              </div>
            </motion.section>

            {/* Section 12 */}
            <motion.section
              id="changes"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">12</div>
                <h2 className="text-2xl font-bold text-foreground">Changes to This Privacy Policy</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons.
                </p>
                <p><strong>When we make changes, we will:</strong></p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Update the "Last updated" date at the top of this page</li>
                  <li>Post a notice on our homepage for significant changes</li>
                  <li>Send an email notification (if you've provided contact information)</li>
                  <li>Obtain your consent for material changes that affect your rights</li>
                </ul>
                <p>
                  <strong>Your continued use</strong> of the Service after any modifications to this Privacy Policy constitutes your acceptance of the updated policy. If you do not agree with the changes, please discontinue use of our Service.
                </p>
                <p className="text-sm">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </div>
            </motion.section>

            <AdSlot slot="below-results" className="my-8" />

            {/* Section 13 */}
            <motion.section
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">13</div>
                <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="h-6 w-6 text-accent" />
                    <h3 className="font-semibold text-foreground">Privacy Contact</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our privacy team typically responds within <strong>48 hours</strong> during business days.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-muted-foreground w-24 shrink-0">Email:</span>
                      <a 
                        href="mailto:privacyeduroi@gmail.com" 
                        className="text-accent hover:underline font-medium text-sm"
                      >
                        privacyeduroi@gmail.com
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-muted-foreground w-24 shrink-0">General:</span>
                      <a 
                        href="mailto:codewithkaran723@gmail.com" 
                        className="text-accent hover:underline font-medium text-sm"
                      >
                        codewithkaran723@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-5 mt-4">
                  <h3 className="font-semibold text-foreground mb-2">Data Protection Officer</h3>
                  <p className="text-sm text-muted-foreground">
                    For EU/EEA residents: If you have concerns about how we handle your personal data, you may also contact your local data protection authority.
                  </p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Related Pages Section */}
        <section className="container max-w-4xl pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-foreground">Related Legal Documents</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/terms-of-service" className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-accent/5">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    Terms of Service →
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Read the terms and conditions governing your use of our education ROI calculator.
                </p>
              </Link>

              <Link to="/calculator" className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-accent/5">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    ROI Calculator →
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Calculate your education ROI with complete privacy and data protection.
                </p>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="container max-w-4xl pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-2xl p-10 text-center md:p-12"
          >
            <Lock className="mx-auto h-12 w-12 text-accent mb-4" />
            <h2 className="text-2xl font-bold text-gradient-hero md:text-3xl">
              Your Privacy is Protected
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
              Use our calculator with confidence. We respect your privacy and protect your data.
            </p>
            <Link to="/calculator">
              <Button
                size="lg"
                className="mt-6 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base font-semibold"
              >
                Start Calculator
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;