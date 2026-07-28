"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export default function CTA() {
  return (
    <section className="section-padding bg-[var(--black)] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[var(--gold)] text-sm font-medium mb-6">
          <Shield className="w-4 h-4" />
          <span>Start your secure transaction today</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
          Ready to Experience <br />
          <span className="gold-text">Secure Escrow?</span>
        </h2>

        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of satisfied clients who trust HoldVera for their high-value transactions.
          Create your account in minutes and start transacting with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-gold inline-flex items-center justify-center gap-2">
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="#contact" className="btn-outline border-white text-white hover:bg-white hover:text-black inline-flex items-center justify-center">
            Talk to an Expert
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          No credit card required · Free to create an account · 24/7 Support
        </p>
      </div>
    </section>
  );
}
