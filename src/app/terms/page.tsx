import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | HoldVera",
  description: "Read HoldVera's Terms of Service governing the use of our escrow platform and services.",
};

export default function TermsPage() {
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
              Terms of <span className="gold-text">Service</span>
            </h1>
            <p className="text-gray-500 mb-8">Last updated: July 29, 2026</p>

            <div className="prose prose-lg max-w-none text-gray-600">
              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using HoldVera's escrow services ("Services"), you agree to be bound by these Terms of Service ("Terms").
                  If you disagree with any part of the terms, you may not access the Services.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Description of Services</h2>
                <p>
                  HoldVera provides online escrow services that facilitate secure transactions between buyers and sellers.
                  We act as a neutral third party, holding funds in escrow until all conditions of a transaction are met.
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Creation and management of escrow transactions</li>
                  <li>Secure holding of funds during transaction periods</li>
                  <li>Verification of transaction completion</li>
                  <li>Dispute resolution assistance</li>
                  <li>Release of funds upon transaction completion</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Account Registration</h2>
                <p>
                  To use our Services, you must create an account and complete our identity verification (KYC) process.
                  You agree to:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Escrow Transactions</h2>
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Transaction Creation</h3>
                <p>
                  Either party may initiate an escrow transaction. The initiating party must provide accurate details including:
                  transaction amount, description of goods/services, inspection period, and counterparty information.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Funding</h3>
                <p>
                  The buyer must fund the escrow within the specified timeframe. Funds are held in FDIC-insured partner bank accounts.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Inspection Period</h3>
                <p>
                  Upon delivery, buyers have an inspection period to verify goods/services meet the agreed terms.
                  If satisfactory, the buyer must approve release of funds.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.4 Fund Release</h3>
                <p>
                  Funds are released to the seller upon buyer approval or after the inspection period expires without dispute.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Fees</h2>
                <p>
                  HoldVera charges a service fee for each escrow transaction. Current fees are:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Standard transactions: 2.9% of transaction value</li>
                  <li>Minimum fee: $25 per transaction</li>
                  <li>Wire transfer fees may apply for certain payment methods</li>
                </ul>
                <p className="mt-4">
                  Fees are collected at the time of fund release. Fee responsibility is determined during transaction setup.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Disputes</h2>
                <p>
                  If a dispute arises, either party may open a formal dispute through our platform. Our dispute resolution process includes:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Review of all transaction documentation and communications</li>
                  <li>Collection of evidence from both parties</li>
                  <li>Mediation attempts to reach mutual agreement</li>
                  <li>Final determination by HoldVera if mediation fails</li>
                </ul>
                <p className="mt-4">
                  HoldVera's determination in disputes is final and binding. Funds will be released according to our determination.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>
                <p>You may not use our Services for:</p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Illegal goods, services, or activities</li>
                  <li>Money laundering or terrorist financing</li>
                  <li>Fraud or misrepresentation</li>
                  <li>Transactions violating sanctions or export controls</li>
                  <li>Circumvention of our fee structure</li>
                  <li>Any activity that could harm HoldVera's reputation</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                <p>
                  HoldVera shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                  or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use,
                  goodwill, or other intangible losses.
                </p>
                <p className="mt-4">
                  Our total liability for any claim arising from or relating to these Terms or our Services is limited to
                  the greater of $100 or the fees paid by you in the 12 months preceding the claim.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless HoldVera and its officers, directors, employees, and agents
                  from any claims, damages, losses, liabilities, costs, and expenses arising from your use of our Services
                  or violation of these Terms.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Modifications to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify you of material changes via email
                  or through our platform. Continued use of our Services after changes constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Commonwealth of Virginia,
                  United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the
                  federal or state courts located in Arlington, Virginia.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">12. Contact Information</h2>
                <p>For questions about these Terms, please contact us:</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>HoldVera, Inc.</strong></p>
                  <p>Arlington, Virginia, USA</p>
                  <p>Email: legal@holdvera.site</p>
                  <p>Phone: +1 (703) 555-0100</p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
