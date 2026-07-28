"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Michael Richardson",
    role: "Business Owner",
    company: "Richardson Imports LLC",
    content: "HoldVera made our first international transaction seamless. The security and transparency gave both parties complete confidence. Highly recommend for any business deal.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Sarah Chen",
    role: "Real Estate Investor",
    company: "Vertex Properties",
    content: "I've used HoldVera for multiple property transactions. Their attention to detail and customer service is unmatched. The funds are always secure and releases are prompt.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "David Thompson",
    role: "Classic Car Collector",
    company: "",
    content: "Bought a vintage Porsche through HoldVera. The inspection period and vehicle verification process gave me peace of mind. Worth every penny of the escrow fee.",
    rating: 5,
    avatar: "DT",
  },
  {
    name: "Jennifer Martinez",
    role: "Tech Entrepreneur",
    company: "ByteScale Inc.",
    content: "Sold my SaaS business through HoldVera. The milestone-based release structure made the transition smooth. Professional team that understands complex transactions.",
    rating: 5,
    avatar: "JM",
  },
  {
    name: "Robert Williams",
    role: "Domain Investor",
    company: "Premium Domains Co.",
    content: "I deal with six-figure domain sales regularly. HoldVera is my go-to escrow service. Fast, secure, and the support team actually knows what they're doing.",
    rating: 5,
    avatar: "RW",
  },
  {
    name: "Amanda Foster",
    role: "Art Dealer",
    company: "Foster Gallery",
    content: "Escrow for high-value art requires trust and expertise. HoldVera delivered on both. My clients feel protected, and the transactions are always handled with care.",
    rating: 5,
    avatar: "AF",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Trusted by <span className="gold-text">Thousands</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what our clients say about their experience with HoldVera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card-luxury p-8">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                    {testimonial.company && ` · ${testimonial.company}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
