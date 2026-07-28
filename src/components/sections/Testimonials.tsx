"use client";

import Image from "next/image";
import { Star, MapPin } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Thompson",
    location: "Atlanta, Georgia",
    country: "USA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    transaction: "Sold a 2019 Mercedes-AMG GT for $87,500",
    content: "Sold my AMG to a buyer in Texas I never met. Was nervous as hell about getting scammed. HoldVera held his payment, I shipped the car, he had 5 days to inspect. Money hit my account 24 hours after he approved. No BS, just worked.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Toronto, Ontario",
    country: "Canada",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    transaction: "Purchased luxury watches worth $32,000",
    content: "Bought two Rolex watches from a dealer in Miami. With that kind of money, I wasn't about to wire funds to someone I found online. HoldVera verified everything - the watches arrived exactly as described. The seller got paid, I got my pieces. Everyone happy.",
    rating: 5,
  },
  {
    name: "James Okonkwo",
    location: "London",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    transaction: "Acquired premium domain for $156,000",
    content: "Bought a 3-letter .com domain from a seller in Singapore. Six figures, different continents, different time zones. HoldVera handled the whole thing - domain transfer verified before funds released. Smooth as it gets for a deal this size.",
    rating: 5,
  },
  {
    name: "Sofia Rodriguez",
    location: "Miami, Florida",
    country: "USA",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    transaction: "Real estate deposit of $45,000",
    content: "Put down earnest money on a condo through HoldVera. Seller tried to back out and keep my deposit. HoldVera's dispute team stepped in, reviewed the contract, got my full deposit back in 11 days. They actually read the paperwork and fought for me.",
    rating: 5,
  },
  {
    name: "Takeshi Yamamoto",
    location: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    transaction: "Sold vintage camera collection for $28,400",
    content: "Sold my Leica collection to a collector in Germany. International shipping, customs, insurance - lot of ways for things to go wrong. Buyer inspected everything, approved the condition. Payment cleared to my account same week. No drama.",
    rating: 5,
  },
  {
    name: "Elena Kowalski",
    location: "Melbourne",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face",
    transaction: "Freelance contract payment of $67,000",
    content: "Did a 6-month dev contract for a US startup. They'd burned freelancers before on payments. Set up milestone escrow through HoldVera - they funded each phase upfront, I delivered, funds released. Got paid for every hour I worked. Finally.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">
            Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            What Our <span className="gold-text">Clients Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real transactions. Real people. Real protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="card-luxury p-8">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>

              <div className="mb-4 px-3 py-1.5 bg-[var(--gold)]/10 rounded-lg inline-block">
                <span className="text-xs font-medium text-[var(--gold)]">{t.transaction}</span>
              </div>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">&ldquo;{t.content}&rdquo;</p>

              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--gold)]/30">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{t.location}, {t.country}</span>
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
