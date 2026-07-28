"use client";

import { FileText, CreditCard, Package, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Create Transaction",
    description:
      "Buyer and seller agree on terms. Create a transaction with detailed conditions, timeline, and payment amount.",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Secure Payment",
    description:
      "Buyer deposits funds into our secure escrow account. Funds are protected with bank-level security.",
  },
  {
    icon: Package,
    step: "03",
    title: "Delivery & Verification",
    description:
      "Seller delivers goods or services. Buyer inspects and verifies everything meets the agreed conditions.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Release Funds",
    description:
      "Once buyer approves, funds are released to seller. Both parties are protected throughout the process.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            How <span className="gold-text">HoldVera</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our streamlined escrow process ensures secure transactions for both buyers and sellers.
            Experience peace of mind with every transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-[var(--gold)] to-transparent" />
              )}
              <div className="card-luxury p-8 text-center relative z-10">
                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-bold text-[var(--gold)] mb-2">
                  STEP {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
