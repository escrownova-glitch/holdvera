import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/sections/CTA";
import Link from "next/link";
import { ShoppingBag, Car, Home, Briefcase, Globe, Laptop, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | HoldVera",
  description: "Explore HoldVera's comprehensive escrow services for merchandise, vehicles, real estate, and more.",
};

const services = [
  {
    icon: ShoppingBag,
    title: "General Merchandise",
    description: "Secure transactions for electronics, jewelry, collectibles, art, and high-value goods.",
    features: ["Full buyer protection", "Quality verification", "Secure shipping", "Inspection period", "Fraud prevention"],
    feeRange: "2.5% - 3.25%",
    minTransaction: "$500",
  },
  {
    icon: Car,
    title: "Vehicle Transactions",
    description: "Safe escrow for cars, motorcycles, boats, RVs, and recreational vehicles.",
    features: ["Title verification", "Lien coordination", "14-day inspection", "DMV assistance", "Shipping available"],
    feeRange: "1.5% - 2.5%",
    minTransaction: "$2,000",
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Escrow for property purchases, down payments, and earnest money deposits.",
    features: ["Title insurance", "Legal compliance", "Multi-party support", "International deals", "Commercial property"],
    feeRange: "0.5% - 1.5%",
    minTransaction: "$10,000",
  },
  {
    icon: Briefcase,
    title: "Business Services",
    description: "Milestone-based payments for freelancers, contractors, and consultants.",
    features: ["Milestone releases", "Work verification", "Dispute mediation", "Contractor protection", "Progress tracking"],
    feeRange: "3.0% - 3.5%",
    minTransaction: "$250",
  },
  {
    icon: Globe,
    title: "Domain & Digital Assets",
    description: "Secure transfers for domains, websites, apps, and digital IP.",
    features: ["Ownership verification", "Transfer assistance", "Source code escrow", "DNS support", "Asset inspection"],
    feeRange: "2.0% - 3.0%",
    minTransaction: "$500",
  },
  {
    icon: Laptop,
    title: "Enterprise Solutions",
    description: "Custom escrow solutions for high-volume business needs.",
    features: ["API integration", "Dedicated manager", "Custom workflows", "Volume pricing", "White-label options"],
    feeRange: "Custom",
    minTransaction: "$50,000+",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">Our Services</span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Escrow for <span className="gold-text">Every Transaction</span></h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">From everyday purchases to complex business deals, HoldVera provides secure escrow tailored to your needs.</p>
            </div>

            <div className="space-y-12">
              {services.map((service) => (
                <div key={service.title} className="card-luxury overflow-hidden">
                  <div className="grid lg:grid-cols-3 gap-0">
                    <div className="p-8 lg:p-12 lg:col-span-2">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-lg gold-gradient flex items-center justify-center">
                          <service.icon className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-semibold">{service.title}</h2>
                      </div>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      <div className="grid sm:grid-cols-2 gap-3 mb-8">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-[var(--gold)]" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href="/register" className="inline-flex items-center gap-2 text-[var(--gold)] font-medium hover:gap-3 transition-all">
                        Start a Transaction <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="bg-[var(--cream)] p-8 lg:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-1">Escrow Fee</div>
                        <div className="text-3xl font-bold gold-text">{service.feeRange}</div>
                      </div>
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-1">Minimum Transaction</div>
                        <div className="text-xl font-semibold">{service.minTransaction}</div>
                      </div>
                      <Link href="/register" className="btn-gold text-center">Get Started</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-[var(--cream)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Need a Custom Solution?</h2>
            <p className="text-gray-600 mb-8">Our enterprise team can design custom escrow workflows for your specific business needs.</p>
            <Link href="/contact" className="btn-gold inline-flex items-center gap-2">Contact Enterprise Sales <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
