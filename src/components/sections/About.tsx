"use client";

import Image from "next/image";
import { Shield, Lock, Award, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Maximum Security",
    description: "Multi-layer security and strict compliance standards protect every transaction.",
  },
  {
    icon: Users,
    title: "Buyer & Seller First",
    description: "Fair, transparent, and impartial escrow services for all parties.",
  },
  {
    icon: Award,
    title: "Global Without Limits",
    description: "Operating internationally with local expertise and seamless cross-border transactions.",
  },
  {
    icon: Lock,
    title: "Integrity Always",
    description: "Honesty, accountability, and commitment in every transaction we handle.",
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">
              About HoldVera
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              Your Trust, <span className="gold-text">Our Priority</span>
            </h2>
            <p className="text-gray-600 mb-6">
              HoldVera is a global escrow company built on trust, security, and transparency. We protect buyers and sellers by holding funds or assets securely and releasing them only when all conditions are met.
            </p>
            <p className="text-gray-600 mb-8">
              Whether you&apos;re buying, selling, or investing across borders, HoldVera ensures your transactions are safe, simple, and stress-free. Based in Arlington, Virginia, we serve clients worldwide with the same dedication to excellence.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{value.title}</h4>
                    <p className="text-xs text-gray-500">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/20 to-transparent rounded-3xl" />
              <Image
                src="/images/banner.png"
                alt="About HoldVera"
                fill
                className="object-cover rounded-3xl"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden lg:block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold gold-text">A+ Rating</div>
                  <div className="text-sm text-gray-500">BBB Accredited</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Recognized for excellence in customer service and business integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
