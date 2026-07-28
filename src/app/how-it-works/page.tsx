import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/sections/CTA";
import { FileText, CreditCard, Package, CheckCircle, Shield, Clock, Users, HeadphonesIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | HoldVera",
  description: "Learn how HoldVera's secure escrow process protects buyers and sellers in every transaction.",
};

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Agree on Terms",
    description: "Buyer and seller agree on the transaction details including price, inspection period, and delivery terms.",
    details: ["Define the goods or services", "Set transaction amount", "Establish inspection period", "Agree on delivery timeline"],
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Buyer Pays HoldVera",
    description: "The buyer submits payment to HoldVera. Funds are held securely in our FDIC-insured escrow account.",
    details: ["Multiple payment methods", "FDIC-insured accounts", "Seller notified when funded", "Transaction timeline begins"],
  },
  {
    icon: Package,
    step: "03",
    title: "Seller Delivers",
    description: "Once payment is secured, the seller ships the merchandise or delivers the service as agreed.",
    details: ["Tracking information provided", "Buyer receives confirmation", "Inspection period begins", "All communications logged"],
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Buyer Approves",
    description: "The buyer inspects and approves. Funds are released to seller within 24 hours of approval.",
    details: ["Full inspection period", "Option to request changes", "Dispute resolution available", "Fast fund release"],
  },
];

const benefits = [
  { icon: Shield, title: "Maximum Security", description: "Bank-level encryption and FDIC-insured accounts." },
  { icon: Clock, title: "Fast Processing", description: "Funds released within 24 hours of approval." },
  { icon: Users, title: "Fair for Everyone", description: "Both parties protected equally." },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Expert support around the clock." },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">Our Process</span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">How <span className="gold-text">HoldVera</span> Works</h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Our streamlined escrow process ensures secure transactions for both buyers and sellers.</p>
            </div>

            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={step.title} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-5xl font-bold text-gray-100">{step.step}</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
                    <p className="text-gray-600 mb-6">{step.description}</p>
                    <ul className="space-y-3">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="card-luxury p-12 text-center">
                      <div className="w-32 h-32 rounded-full gold-gradient mx-auto flex items-center justify-center mb-6">
                        <step.icon className="w-16 h-16 text-white" />
                      </div>
                      <div className="text-6xl font-bold gold-text mb-2">Step {step.step}</div>
                      <div className="text-gray-500">{step.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-[var(--cream)]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Why Choose <span className="gold-text">HoldVera</span>?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((b) => (
                <div key={b.title} className="card-luxury p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mx-auto mb-4">
                    <b.icon className="w-8 h-8 text-[var(--gold)]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
