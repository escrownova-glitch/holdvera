"use client";

import { ShoppingBag, Car, Home, Briefcase, Globe, Laptop } from "lucide-react";

const services = [
  {
    icon: ShoppingBag,
    title: "General Merchandise",
    description: "Secure transactions for electronics, jewelry, collectibles, and high-value goods.",
    features: ["Full buyer protection", "Quality verification", "Secure shipping"],
  },
  {
    icon: Car,
    title: "Vehicle Transactions",
    description: "Safe auto escrow for cars, motorcycles, boats, and recreational vehicles.",
    features: ["Title verification", "Inspection period", "DMV coordination"],
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Escrow services for property purchases, down payments, and earnest money.",
    features: ["Title insurance", "Legal compliance", "Multi-party escrow"],
  },
  {
    icon: Briefcase,
    title: "Business Services",
    description: "Milestone-based payments for freelancers, contractors, and service providers.",
    features: ["Milestone releases", "Work verification", "Dispute mediation"],
  },
  {
    icon: Globe,
    title: "Domain & Websites",
    description: "Secure transfers for domain names, websites, and digital assets.",
    features: ["Asset verification", "Transfer assistance", "Code escrow"],
  },
  {
    icon: Laptop,
    title: "Enterprise Solutions",
    description: "Custom escrow solutions for businesses with high-volume transaction needs.",
    features: ["API integration", "Dedicated support", "Custom workflows"],
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Escrow for <span className="gold-text">Every Transaction</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From everyday purchases to complex business deals, HoldVera provides secure escrow services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.title} className="card-luxury p-8 group">
              <div className="w-14 h-14 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center mb-6 group-hover:gold-gradient transition-all duration-300">
                <service.icon className="w-7 h-7 text-[var(--gold)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
