import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service – EduROI</title>
        <meta name="description" content="EduROI Terms of Service. Read the terms and conditions governing your use of our education ROI calculator and related services." />
        <link rel="canonical" href="https://eduroi.com/terms-of-service" />
      </Helmet>

      <div className="container max-w-3xl py-12 md:py-16">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 15, 2026</p>

        <div className="mt-8 space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using EduROI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p className="mt-3">
              EduROI provides an online education return-on-investment (ROI) calculator and comparison tool. Our Service allows users to estimate the financial returns of various education options based on user-provided inputs and publicly available data. The Service is provided for informational and educational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Disclaimer of Financial Advice</h2>
            <p className="mt-3">
              The calculations, projections, and information provided by EduROI are estimates based on the data you provide and general statistical data. They do <strong>not</strong> constitute financial, investment, career, or educational advice. You should consult with qualified professionals before making any financial or educational decisions. We are not responsible for any decisions made based on our calculations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. User Responsibilities</h2>
            <p className="mt-3">When using our Service, you agree to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Provide accurate and truthful information when using our calculators.</li>
              <li>Use the Service only for lawful purposes and in accordance with these Terms.</li>
              <li>Not attempt to interfere with, compromise, or disrupt the Service or its infrastructure.</li>
              <li>Not use automated systems or bots to access the Service without our prior written consent.</li>
              <li>Not reproduce, duplicate, copy, or resell any part of the Service without express permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
            <p className="mt-3">
              All content, features, and functionality of the Service — including but not limited to text, graphics, logos, icons, algorithms, and software — are the exclusive property of EduROI and are protected by international copyright, trademark, and other intellectual property laws. You may not use, reproduce, or distribute any content from our Service without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Data Accuracy</h2>
            <p className="mt-3">
              While we strive to provide accurate and up-to-date information, we make no warranties or representations regarding the accuracy, completeness, or reliability of any data, calculations, or projections provided through our Service. Tuition costs, salary data, and economic indicators may change and vary by source. Users should independently verify all information before making decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Third-Party Links and Services</h2>
            <p className="mt-3">
              Our Service may contain links to third-party websites, advertisements (including Google AdSense), and affiliate partnerships. We are not responsible for the content, privacy policies, or practices of any third-party sites or services. You acknowledge and agree that we shall not be liable for any damage or loss caused by your use of or reliance on any third-party content or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by applicable law, EduROI and its operators, directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Indemnification</h2>
            <p className="mt-3">
              You agree to defend, indemnify, and hold harmless EduROI and its operators from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Service or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Modifications to Terms</h2>
            <p className="mt-3">
              We reserve the right to modify or replace these Terms at any time at our sole discretion. We will provide notice of any material changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Termination</h2>
            <p className="mt-3">
              We may terminate or suspend your access to our Service immediately, without prior notice, for any reason, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">12. Governing Law</h2>
            <p className="mt-3">
              These Terms shall be governed and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">13. Contact Us</h2>
            <p className="mt-3">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@eduroi.com" className="text-accent underline hover:no-underline">legal@eduroi.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
