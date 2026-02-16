import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, FileText, AlertCircle, Scale, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service – EduROI Education ROI Calculator</title>
        <meta name="description" content="Read EduROI's Terms of Service. Comprehensive terms and conditions governing your use of our free education ROI calculator, career planning tools, and financial analysis services." />
        <link rel="canonical" href="https://eduroi.com/terms-of-service" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Terms of Service – EduROI" />
        <meta property="og:description" content="Terms and conditions for using EduROI's education ROI calculator and career planning tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eduroi.com/terms-of-service" />
        
        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Terms of Service',
            description: 'Terms and conditions governing the use of EduROI education ROI calculator',
            url: 'https://eduroi.com/terms-of-service',
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
                <Shield className="h-4 w-4" />
                Legal Information
              </div>
              <h1 className="text-3xl font-bold text-gradient-hero md:text-4xl lg:text-5xl">
                Terms of Service
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/70">
                Please read these terms carefully before using EduROI's education ROI calculator and related services.
              </p>
              <p className="mt-3 text-sm text-primary-foreground/60">
                Last updated: February 15, 2026
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
              <AlertCircle className="h-6 w-6 shrink-0 text-accent mt-1" />
              <div>
                <h2 className="text-lg font-bold text-foreground mb-3">Key Points Summary</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>Our calculator provides <strong>estimates only</strong> – not financial advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>You must provide <strong>accurate information</strong> for meaningful results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>We are <strong>not liable</strong> for decisions made based on our calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>All content is protected by <strong>intellectual property</strong> laws</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>We may display <strong>third-party ads</strong> (Google AdSense)</span>
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
              <a href="#acceptance" className="text-accent hover:underline">1. Acceptance of Terms</a>
              <a href="#service" className="text-accent hover:underline">2. Description of Service</a>
              <a href="#disclaimer" className="text-accent hover:underline">3. Disclaimer of Financial Advice</a>
              <a href="#responsibilities" className="text-accent hover:underline">4. User Responsibilities</a>
              <a href="#intellectual" className="text-accent hover:underline">5. Intellectual Property</a>
              <a href="#accuracy" className="text-accent hover:underline">6. Data Accuracy</a>
              <a href="#third-party" className="text-accent hover:underline">7. Third-Party Links</a>
              <a href="#liability" className="text-accent hover:underline">8. Limitation of Liability</a>
              <a href="#indemnification" className="text-accent hover:underline">9. Indemnification</a>
              <a href="#modifications" className="text-accent hover:underline">10. Modifications to Terms</a>
              <a href="#termination" className="text-accent hover:underline">11. Termination</a>
              <a href="#governing" className="text-accent hover:underline">12. Governing Law</a>
              <a href="#contact" className="text-accent hover:underline">13. Contact Information</a>
            </div>
          </motion.div>
        </section>

        <AdSlot slot="in-content" className="container max-w-4xl mb-8" />

        {/* Main Content */}
        <div className="container max-w-4xl pb-12">
          <div className="space-y-10 text-foreground/90 leading-relaxed">
            
            {/* Section 1 */}
            <motion.section
              id="acceptance"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">1</div>
                <h2 className="text-2xl font-bold text-foreground">Acceptance of Terms</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  By accessing or using EduROI ("the Service," "our Service," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Students researching education options</li>
                  <li>Parents and guardians evaluating degree programs</li>
                  <li>Education consultants using our tools</li>
                  <li>Career counselors and advisors</li>
                  <li>Anyone using our ROI calculator or comparison features</li>
                </ul>
                <p>
                  By continuing to use EduROI, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
                </p>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section
              id="service"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">2</div>
                <h2 className="text-2xl font-bold text-foreground">Description of Service</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  EduROI provides an online education return-on-investment (ROI) calculator and comprehensive comparison platform. Our Service allows users to:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li><strong>Calculate education ROI:</strong> Estimate financial returns based on degree choice, location, and costs</li>
                  <li><strong>Compare programs:</strong> Evaluate different majors, universities, and countries</li>
                  <li><strong>Analyze career prospects:</strong> Review salary projections and job market data</li>
                  <li><strong>Access educational content:</strong> Read guides, articles, and decision-making resources</li>
                  <li><strong>Generate reports:</strong> Create shareable ROI analyses and comparisons</li>
                </ul>
                <p>
                  The Service is provided <strong>for informational and educational purposes only</strong>. All calculations are estimates based on user-provided inputs and publicly available statistical data. Results should be used as one factor among many in your education decision-making process.
                </p>
              </div>
            </motion.section>

            <AdSlot slot="in-content" className="my-8" />

            {/* Section 3 */}
            <motion.section
              id="disclaimer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">3</div>
                <h2 className="text-2xl font-bold text-foreground">Disclaimer of Financial Advice</h2>
              </div>
              <div className="space-y-3 pl-11">
                <div className="rounded-lg border-2 border-amber-500/30 bg-amber-500/10 p-4">
                  <p className="font-semibold text-amber-800 dark:text-amber-400">
                    ⚠️ IMPORTANT: The calculations, projections, and information provided by EduROI are estimates only and do NOT constitute financial, investment, career, or educational advice.
                  </p>
                </div>
                <p>
                  Our calculations are based on:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Data you provide (which we cannot independently verify)</li>
                  <li>General statistical averages and market trends</li>
                  <li>Third-party data sources that may become outdated</li>
                  <li>Mathematical models that make certain assumptions</li>
                </ul>
                <p>
                  <strong>You should consult with qualified professionals</strong> before making any significant financial or educational decisions, including:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Certified financial planners for investment decisions</li>
                  <li>Education counselors for academic planning</li>
                  <li>Career advisors for job market insights</li>
                  <li>Tax professionals for financial aid and loan strategies</li>
                </ul>
                <p>
                  <strong>We are not responsible</strong> for any decisions made, actions taken, or financial outcomes resulting from the use of our calculations or information. Your use of this Service is entirely at your own risk.
                </p>
              </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section
              id="responsibilities"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">4</div>
                <h2 className="text-2xl font-bold text-foreground">User Responsibilities</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>When using our Service, you agree to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Provide accurate information:</strong> Enter truthful data when using our calculators for meaningful results</li>
                  <li><strong>Use lawfully:</strong> Access the Service only for legal purposes and in accordance with these Terms</li>
                  <li><strong>Respect infrastructure:</strong> Not attempt to interfere with, compromise, disrupt, or damage the Service or its infrastructure</li>
                  <li><strong>No automation:</strong> Not use automated systems, bots, scrapers, or scripts to access the Service without our prior written consent</li>
                  <li><strong>No unauthorized reproduction:</strong> Not reproduce, duplicate, copy, sell, or resell any part of the Service without express permission</li>
                  <li><strong>Respect intellectual property:</strong> Not remove copyright notices, trademarks, or other proprietary markings</li>
                  <li><strong>No reverse engineering:</strong> Not decompile, disassemble, or reverse engineer our algorithms or software</li>
                </ul>
                <p>
                  Violation of these responsibilities may result in immediate termination of your access to the Service and potential legal action.
                </p>
              </div>
            </motion.section>

            <AdSlot slot="in-content" className="my-8" />

            {/* Section 5 */}
            <motion.section
              id="intellectual"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">5</div>
                <h2 className="text-2xl font-bold text-foreground">Intellectual Property Rights</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  All content, features, and functionality of the Service — including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, page layout, underlying code, algorithms, software, and user interface design — are the exclusive property of EduROI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p>
                  You are granted a limited, non-exclusive, non-transferable, revocable license to:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Access and use the Service for personal, non-commercial purposes</li>
                  <li>Generate and download ROI reports for your own educational planning</li>
                  <li>Share links to our website (but not reproduce our content)</li>
                </ul>
                <p>
                  You may NOT:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Copy, reproduce, or distribute any content from our Service without written permission</li>
                  <li>Create derivative works based on our Service</li>
                  <li>Frame or embed our content on other websites</li>
                  <li>Use our branding, logos, or trademarks without authorization</li>
                  <li>Republish our algorithms or methodologies</li>
                </ul>
              </div>
            </motion.section>

            {/* Section 6 */}
            <motion.section
              id="accuracy"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">6</div>
                <h2 className="text-2xl font-bold text-foreground">Data Accuracy and Limitations</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  While we strive to provide accurate and up-to-date information, we make <strong>no warranties or representations</strong> regarding the accuracy, completeness, reliability, or timeliness of any data, calculations, or projections provided through our Service.
                </p>
                <p>
                  Please be aware that:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Tuition costs vary:</strong> University fees change annually and differ by program, residency status, and institution</li>
                  <li><strong>Salary data fluctuates:</strong> Market conditions, economic cycles, and geographic location affect earnings</li>
                  <li><strong>Economic indicators change:</strong> Inflation rates, interest rates, and employment statistics are dynamic</li>
                  <li><strong>Sources may differ:</strong> Different data providers report varying statistics for the same metrics</li>
                  <li><strong>Individual results vary:</strong> Your personal outcomes may differ significantly from statistical averages</li>
                  <li><strong>Future is uncertain:</strong> Projections are not guarantees of future performance or earnings</li>
                </ul>
                <p>
                  <strong>Users must independently verify</strong> all information before making decisions. We recommend consulting primary sources such as university websites, government labor statistics, and professional advisors.
                </p>
              </div>
            </motion.section>

            <AdSlot slot="in-content" className="my-8" />

            {/* Section 7 */}
            <motion.section
              id="third-party"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">7</div>
                <h2 className="text-2xl font-bold text-foreground">Third-Party Links and Advertising</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  Our Service may contain:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Third-party links:</strong> Links to external websites, resources, and services</li>
                  <li><strong>Google AdSense ads:</strong> Display advertising provided by Google and its partners</li>
                  <li><strong>Affiliate partnerships:</strong> Links to education providers, financial services, or career resources where we may earn commissions</li>
                  <li><strong>Embedded content:</strong> Videos, maps, or tools from third-party providers</li>
                </ul>
                <p>
                  <strong>Important disclaimers:</strong>
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>We do not endorse, warrant, or guarantee third-party content, products, or services</li>
                  <li>We are not responsible for the privacy policies, practices, or content of third-party sites</li>
                  <li>Third-party advertisers may use cookies and tracking technologies (see our Privacy Policy)</li>
                  <li>Affiliate commissions do not influence our ROI calculations or recommendations</li>
                  <li>You acknowledge that we shall not be liable for any damage, loss, or harm caused by third-party interactions</li>
                </ul>
                <p>
                  We encourage you to review the terms and privacy policies of any third-party websites or services you visit through our platform.
                </p>
              </div>
            </motion.section>

            {/* Section 8 */}
            <motion.section
              id="liability"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">8</div>
                <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  <strong>To the fullest extent permitted by applicable law</strong>, EduROI and its operators, directors, employees, partners, agents, suppliers, and affiliates shall not be liable for:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li><strong>Indirect damages:</strong> Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li><strong>Loss of profits:</strong> Loss of revenue, income, profits, or business opportunities</li>
                  <li><strong>Loss of data:</strong> Loss of data, files, or other information</li>
                  <li><strong>Educational decisions:</strong> Outcomes resulting from education or career choices</li>
                  <li><strong>Financial losses:</strong> Investment losses, student loan debt, or opportunity costs</li>
                  <li><strong>Service interruptions:</strong> Inability to access or use the Service due to downtime, errors, or technical issues</li>
                  <li><strong>Calculation errors:</strong> Inaccuracies in ROI calculations or projections</li>
                  <li><strong>Third-party actions:</strong> Actions of advertisers, linked websites, or other third parties</li>
                </ul>
                <p>
                  This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other legal theory, even if we have been advised of the possibility of such damages.
                </p>
                <p>
                  In jurisdictions that do not allow the exclusion of certain warranties or limitation of liability for consequential damages, our liability shall be limited to the maximum extent permitted by law.
                </p>
              </div>
            </motion.section>

            <AdSlot slot="in-content" className="my-8" />

            {/* Section 9 */}
            <motion.section
              id="indemnification"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">9</div>
                <h2 className="text-2xl font-bold text-foreground">Indemnification</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  You agree to defend, indemnify, and hold harmless EduROI, its operators, directors, employees, partners, agents, suppliers, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, and fees (including reasonable attorneys' fees) arising out of or in any way connected with:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Your access to or use of the Service</li>
                  <li>Your violation of these Terms of Service</li>
                  <li>Your violation of any third-party rights, including intellectual property rights</li>
                  <li>Any decisions made based on information from our Service</li>
                  <li>Any content or data you submit to the Service</li>
                </ul>
              </div>
            </motion.section>

            {/* Section 10 */}
            <motion.section
              id="modifications"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">10</div>
                <h2 className="text-2xl font-bold text-foreground">Modifications to Terms</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  We reserve the right to modify, amend, or replace these Terms at any time at our sole discretion. We will provide notice of any material changes by:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Updating the "Last updated" date at the top of this page</li>
                  <li>Posting a notice on our homepage (for significant changes)</li>
                  <li>Sending an email notification (if you've provided contact information)</li>
                </ul>
                <p>
                  <strong>Your continued use</strong> of the Service after any such changes constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must discontinue use of the Service.
                </p>
                <p>
                  We encourage you to review this page periodically for any updates or changes.
                </p>
              </div>
            </motion.section>

            {/* Section 11 */}
            <motion.section
              id="termination"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">11</div>
                <h2 className="text-2xl font-bold text-foreground">Termination</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason, including without limitation if you:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Breach these Terms of Service</li>
                  <li>Engage in fraudulent or illegal activity</li>
                  <li>Misuse or abuse the Service</li>
                  <li>Attempt to harm our infrastructure or other users</li>
                  <li>Violate intellectual property rights</li>
                </ul>
                <p>
                  Upon termination, your right to use the Service will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                </p>
              </div>
            </motion.section>

            {/* Section 12 */}
            <motion.section
              id="governing"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">12</div>
                <h2 className="text-2xl font-bold text-foreground">Governing Law and Jurisdiction</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  These Terms shall be governed and construed in accordance with applicable laws, without regard to conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
                <p>
                  Any disputes arising under these Terms or relating to the Service shall be subject to the exclusive jurisdiction of the competent courts, and you consent to personal jurisdiction in such courts.
                </p>
                <p>
                  If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
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
                <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
              </div>
              <div className="space-y-3 pl-11">
                <p>
                  If you have any questions, concerns, or feedback about these Terms of Service, please contact us:
                </p>
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="h-6 w-6 text-accent" />
                    <h3 className="font-semibold text-foreground">Get in Touch</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    We typically respond to all inquiries within 48 hours during business days.
                  </p>
                  <a 
                    href="mailto:codewithkaran723@gmail.com" 
                    className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
                  >
                    <Mail className="h-4 w-4" />
                    codewithkaran723@gmail.com
                  </a>
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
              <Link to="/privacy-policy" className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-accent/5">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    Privacy Policy →
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn how we collect, use, and protect your personal information and data.
                </p>
              </Link>

              <Link to="/calculator" className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-accent/5">
                <div className="flex items-center gap-3 mb-2">
                  <Scale className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    ROI Calculator →
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Calculate your education ROI and make informed decisions about your future.
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
            <Shield className="mx-auto h-12 w-12 text-accent mb-4" />
            <h2 className="text-2xl font-bold text-gradient-hero md:text-3xl">
              Ready to Calculate Your Education ROI?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
              Start using our free calculator to make data-driven decisions about your education investment.
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

export default TermsOfService;