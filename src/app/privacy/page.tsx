import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | HoldVera",
  description: "Learn how HoldVera collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-padding bg-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">
              Legal
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Privacy <span className="gold-text">Policy</span>
            </h1>
            <p className="text-gray-500 mb-8">Last updated: July 29, 2026</p>

            <div className="prose prose-lg max-w-none text-gray-600">
              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p>
                  HoldVera, Inc. ("HoldVera," "we," "us," or "our") respects your privacy and is committed to protecting
                  your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you use our escrow services.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                  <li><strong>Identity Verification:</strong> Government-issued ID, date of birth, address, SSN/SIN (last 4 digits)</li>
                  <li><strong>Transaction Data:</strong> Payment information, transaction history, escrow details</li>
                  <li><strong>Communications:</strong> Messages, support tickets, feedback</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Information Collected Automatically</h3>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                  <li><strong>Cookies:</strong> Session data, preferences, analytics</li>
                  <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p>We use your personal information to:</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Provide, maintain, and improve our escrow services</li>
                  <li>Verify your identity and prevent fraud</li>
                  <li>Process transactions and send related notifications</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send administrative and promotional communications</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Protect the security and integrity of our platform</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Legal Basis for Processing</h2>
                <p>We process your personal data based on:</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li><strong>Contract Performance:</strong> To provide our escrow services</li>
                  <li><strong>Legal Obligation:</strong> To comply with KYC/AML regulations</li>
                  <li><strong>Legitimate Interests:</strong> To prevent fraud and improve services</li>
                  <li><strong>Consent:</strong> For marketing communications (where required)</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Information Sharing</h2>
                <p>We may share your information with:</p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Transaction Counterparties</h3>
                <p>
                  When you participate in an escrow transaction, certain information is shared with the other party,
                  including your name and transaction status.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Service Providers</h3>
                <p>
                  We work with trusted third-party providers for payment processing, identity verification,
                  cloud hosting, email delivery, and customer support.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.3 Legal Requirements</h3>
                <p>
                  We may disclose information when required by law, court order, or government request,
                  or to protect our rights, property, or safety.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.4 Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred
                  as part of that transaction.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p>We implement robust security measures including:</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>256-bit SSL/TLS encryption for data in transit</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>Multi-factor authentication options</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>SOC 2 Type II compliance</li>
                  <li>Employee access controls and training</li>
                  <li>24/7 security monitoring</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Data Retention</h2>
                <p>
                  We retain your personal data for as long as necessary to provide our services and comply with
                  legal obligations. Generally:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Account data: Duration of account plus 7 years</li>
                  <li>Transaction records: 7 years from transaction completion</li>
                  <li>Identity documents: Duration required by AML regulations</li>
                  <li>Communication logs: 3 years</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Your Rights</h2>
                <p>Depending on your location, you may have the right to:</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li><strong>Access:</strong> Request copies of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your data (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Restriction:</strong> Request limited processing of your data</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw previously given consent</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at privacy@holdvera.site.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Cookies and Tracking</h2>
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Keep you logged in</li>
                  <li>Remember your preferences</li>
                  <li>Analyze site usage and performance</li>
                  <li>Detect and prevent fraud</li>
                </ul>
                <p className="mt-4">
                  You can manage cookie preferences through your browser settings. Disabling cookies may affect
                  site functionality.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. International Transfers</h2>
                <p>
                  Your data may be transferred to and processed in countries other than your own. We ensure
                  appropriate safeguards are in place, including Standard Contractual Clauses and adequacy decisions.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
                <p>
                  Our Services are not intended for individuals under 18 years of age. We do not knowingly collect
                  personal data from children. If we learn we have collected data from a child, we will delete it promptly.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. California Privacy Rights (CCPA)</h2>
                <p>California residents have additional rights under the CCPA:</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to know if personal information is sold or disclosed</li>
                  <li>Right to opt-out of the sale of personal information</li>
                  <li>Right to non-discrimination for exercising privacy rights</li>
                </ul>
                <p className="mt-4">
                  HoldVera does not sell personal information to third parties.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">13. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically. We will notify you of material changes via email
                  or through our platform. Your continued use of our Services after changes constitutes acceptance.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">14. Contact Us</h2>
                <p>For privacy-related inquiries, please contact:</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>HoldVera Privacy Team</strong></p>
                  <p>Arlington, Virginia, USA</p>
                  <p>Email: privacy@holdvera.site</p>
                  <p>Phone: +1 (703) 555-0100</p>
                </div>
                <p className="mt-4">
                  If you are not satisfied with our response, you may have the right to lodge a complaint with a
                  supervisory authority in your jurisdiction.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
