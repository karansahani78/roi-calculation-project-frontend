import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – EduROI</title>
        <meta name="description" content="EduROI Privacy Policy. Learn how we collect, use, and protect your personal information when using our education ROI calculator." />
        <link rel="canonical" href="https://eduroi.com/privacy-policy" />
      </Helmet>

      <div className="container max-w-3xl py-12 md:py-16">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 15, 2026</p>

        <div className="mt-8 space-y-8 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p className="mt-3">
              Welcome to EduROI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our education ROI calculator services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <p className="mt-3">We may collect the following types of information:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, calculator inputs (country, major, tuition amounts), and session duration.</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device type, screen resolution, and IP address.</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your experience and collect analytics data.</li>
              <li><strong>Voluntarily Provided Information:</strong> Any information you choose to provide through contact forms or feedback submissions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p className="mt-3">We use the information we collect to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Provide, maintain, and improve our ROI calculation services.</li>
              <li>Analyze usage trends to enhance user experience.</li>
              <li>Display relevant advertisements through third-party ad networks (including Google AdSense).</li>
              <li>Respond to your inquiries and provide customer support.</li>
              <li>Comply with legal obligations and enforce our terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p className="mt-3">
              We use third-party services that may collect information about you. These include:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Google AdSense:</strong> Displays advertisements and may use cookies to serve ads based on your prior visits. You can opt out via <a href="https://adssettings.google.com" className="text-accent underline hover:no-underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
              <li><strong>Google Analytics:</strong> Collects anonymous usage statistics to help us understand how visitors use our site.</li>
              <li><strong>Affiliate Partners:</strong> We may link to third-party educational services and earn commissions on referrals.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
            <p className="mt-3">
              Our website uses cookies to improve your browsing experience. You can control cookie preferences through your browser settings. Disabling cookies may affect the functionality of certain features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Data Retention</h2>
            <p className="mt-3">
              We retain your information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. Calculator results shared via unique URLs are retained for up to 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
            <p className="mt-3">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access, correct, or delete your personal data.</li>
              <li>Opt out of targeted advertising.</li>
              <li>Withdraw consent for data processing.</li>
              <li>Lodge a complaint with a supervisory authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Children's Privacy</h2>
            <p className="mt-3">
              Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a child, we will take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Security</h2>
            <p className="mt-3">
              We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after any modifications constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Contact Us</h2>
            <p className="mt-3">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@eduroi.com" className="text-accent underline hover:no-underline">privacy@eduroi.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
