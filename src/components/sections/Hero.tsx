"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Users, Globe, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Bank-level security and advanced fraud protection",
  },
  {
    icon: Users,
    title: "Buyer & Seller Protection",
    description: "Fair and transparent experience for all parties",
  },
  {
    icon: Globe,
    title: "International Reach",
    description: "Borderless escrow for individuals and businesses",
  },
  {
    icon: Zap,
    title: "Fast. Fair. Reliable.",
    description: "Efficient processes with committed support",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-cream" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--gold)]/10 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--gold)]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[var(--gold)]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Trusted by 50,000+ clients worldwide</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[var(--black)] leading-tight mb-6">
              Global Escrow Solutions for a{" "}
              <span className="gold-text">Safer Tomorrow</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              HoldVera is a global escrow company built on trust, security, and transparency.
              We protect buyers and sellers by holding funds securely and releasing them only when all conditions are met.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register" className="btn-gold text-center">
                Start a Transaction
              </Link>
              <Link href="#how-it-works" className="btn-outline text-center">
                Learn How It Works
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold gold-text">$2.5B+</div>
                <div className="text-sm text-gray-500">Secured</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-3xl font-bold gold-text">50K+</div>
                <div className="text-sm text-gray-500">Transactions</div>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div className="text-center">
                <div className="text-3xl font-bold gold-text">99.9%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/20 to-transparent rounded-full blur-3xl" />
              <Image
                src="/images/logo.png"
                alt="HoldVera"
                fill
                className="object-contain float"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card-luxury p-6">
              <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
