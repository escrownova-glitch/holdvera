import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/sections/CTA";
import Testimonials from "@/components/sections/Testimonials";
import Image from "next/image";
import { Shield, Lock, Award, Users, Globe, Building, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | HoldVera",
  description: "Learn about HoldVera, a global escrow company built on trust, security, and transparency.",
};

const values = [
  { icon: Shield, title: "Maximum Security", description: "Multi-layer security and strict compliance standards." },
  { icon: Users, title: "Buyer & Seller First", description: "Fair, transparent, and impartial escrow services." },
  { icon: Globe, title: "Global Without Limits", description: "Operating internationally with local expertise." },
  { icon: Lock, title: "Integrity Always", description: "Honesty and commitment in every transaction." },
];

const stats = [
  { value: "$2.5B+", label: "Secured Transactions" },
  { value: "50,000+", label: "Happy Clients" },
  { value: "99.9%", label: "Success Rate" },
  { value: "150+", label: "Countries Served" },
];

const team = [
  { name: "Dennis Miller", role: "Chief Executive Officer", bio: "20+ years in financial services and fintech." },
  { name: "Anthony Kochanski", role: "Senior Escrow Agent", bio: "Specialized in high-value transactions." },
  { name: "James Keen", role: "Senior Escrow Agent", bio: "Expert in international transactions." },
];

const certifications = ["FDIC Insured Partner Banks", "SOC 2 Type II Certified", "PCI DSS Compliant", "256-bit SSL Encryption", "BBB A+ Accredited", "Licensed in 50 States"];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">About HoldVera</span>
                <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Your Trust, <span className="gold-text">Our Priority</span></h1>
                <p className="text-gray-600 mb-6 text-lg">HoldVera is a global escrow company built on trust, security, and transparency. We protect buyers and sellers by holding funds securely and releasing them only when all conditions are met.</p>
                <p className="text-gray-600 mb-8">Based in Arlington, Virginia, we serve over 50,000 clients across 150+ countries with the same dedication to excellence.</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><Building className="w-5 h-5 text-[var(--gold)]" /><span className="text-sm text-gray-600">Arlington, Virginia, USA</span></div>
                  <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-[var(--gold)]" /><span className="text-sm text-gray-600">150+ Countries</span></div>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/20 to-transparent rounded-3xl" />
                  <Image src="/images/banner.png" alt="About HoldVera" fill className="object-cover rounded-3xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[var(--black)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold gold-text mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-[var(--cream)]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4">Our <span className="gold-text">Core Values</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v) => (
                <div key={v.title} className="card-luxury p-8 text-center">
                  <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6"><v.icon className="w-8 h-8 text-white" /></div>
                  <h3 className="text-xl font-semibold mb-3">{v.title}</h3>
                  <p className="text-gray-600 text-sm">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4">Leadership <span className="gold-text">Team</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((m) => (
                <div key={m.name} className="card-luxury p-8 text-center">
                  <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">{m.name.split(" ").map((n) => n[0]).join("")}</div>
                  <h3 className="text-xl font-semibold mb-1">{m.name}</h3>
                  <p className="text-[var(--gold)] text-sm mb-4">{m.role}</p>
                  <p className="text-gray-600 text-sm">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-[var(--cream)]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Trust & <span className="gold-text">Compliance</span></h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3 p-4 bg-white rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[var(--gold)]" />
                  <span className="text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
