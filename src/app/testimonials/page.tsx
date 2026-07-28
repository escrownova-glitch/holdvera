import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/sections/CTA";
import Image from "next/image";
import { Star, MapPin, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "Testimonials | HoldVera",
  description: "Real stories from real clients. See how HoldVera protected their transactions.",
};

const testimonials = [
  {
    name: "Marcus Thompson",
    location: "Atlanta, Georgia",
    country: "USA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    transaction: "Sold a 2019 Mercedes-AMG GT",
    amount: "$87,500",
    content: "Sold my AMG to a buyer in Texas I never met. Was nervous as hell about getting scammed. HoldVera held his payment, I shipped the car, he had 5 days to inspect. Money hit my account 24 hours after he approved. No BS, just worked.",
    rating: 5,
    date: "March 2026",
  },
  {
    name: "Priya Sharma",
    location: "Toronto, Ontario",
    country: "Canada",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    transaction: "Purchased luxury watches",
    amount: "$32,000",
    content: "Bought two Rolex watches from a dealer in Miami. With that kind of money, I wasn't about to wire funds to someone I found online. HoldVera verified everything - the watches arrived exactly as described. The seller got paid, I got my pieces. Everyone happy.",
    rating: 5,
    date: "February 2026",
  },
  {
    name: "James Okonkwo",
    location: "London",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    transaction: "Acquired premium domain",
    amount: "$156,000",
    content: "Bought a 3-letter .com domain from a seller in Singapore. Six figures, different continents, different time zones. HoldVera handled the whole thing - domain transfer verified before funds released. Smooth as it gets for a deal this size.",
    rating: 5,
    date: "January 2026",
  },
  {
    name: "Sofia Rodriguez",
    location: "Miami, Florida",
    country: "USA",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    transaction: "Real estate deposit",
    amount: "$45,000",
    content: "Put down earnest money on a condo through HoldVera. Seller tried to back out and keep my deposit. HoldVera's dispute team stepped in, reviewed the contract, got my full deposit back in 11 days. They actually read the paperwork and fought for me.",
    rating: 5,
    date: "December 2025",
  },
  {
    name: "Takeshi Yamamoto",
    location: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    transaction: "Sold vintage camera collection",
    amount: "$28,400",
    content: "Sold my Leica collection to a collector in Germany. International shipping, customs, insurance - lot of ways for things to go wrong. Buyer inspected everything, approved the condition. Payment cleared to my account same week. No drama.",
    rating: 5,
    date: "November 2025",
  },
  {
    name: "Elena Kowalski",
    location: "Melbourne",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
    transaction: "Freelance contract payment",
    amount: "$67,000",
    content: "Did a 6-month dev contract for a US startup. They'd burned freelancers before on payments. Set up milestone escrow through HoldVera - they funded each phase upfront, I delivered, funds released. Got paid for every hour I worked. Finally.",
    rating: 5,
    date: "October 2025",
  },
  {
    name: "David Mensah",
    location: "Accra",
    country: "Ghana",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    transaction: "Sold construction equipment",
    amount: "$124,000",
    content: "Exported heavy machinery to a contractor in Nigeria. Cross-border B2B deal with a buyer I'd never worked with. HoldVera held his wire, I shipped the equipment, his team inspected on arrival. Funds released same day he confirmed. This is how business should work.",
    rating: 5,
    date: "September 2025",
  },
  {
    name: "Maria Santos",
    location: "São Paulo",
    country: "Brazil",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    transaction: "Purchased rare art piece",
    amount: "$89,000",
    content: "Bought an original painting from a gallery in New York. Art fraud is real and I wasn't taking chances. HoldVera arranged authentication verification before releasing my payment. The piece is now hanging in my living room. Exactly as advertised.",
    rating: 5,
    date: "August 2025",
  },
  {
    name: "Henrik Larsson",
    location: "Stockholm",
    country: "Sweden",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    transaction: "Sold SaaS business",
    amount: "$340,000",
    content: "Sold my bootstrapped SaaS to an acquirer in California. Asset transfer, customer migration, code handover - lots of moving parts. HoldVera structured milestone releases tied to each phase. Buyer got what they paid for, I got paid. Clean exit.",
    rating: 5,
    date: "July 2025",
  },
];

const stats = [
  { value: "$2.5B+", label: "Total Secured" },
  { value: "50,000+", label: "Transactions" },
  { value: "99.9%", label: "Success Rate" },
  { value: "4.9/5", label: "Average Rating" },
];

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-sm font-medium mb-4">
                Real Stories
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
                What Our <span className="gold-text">Clients Say</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Real transactions. Real people. Real protection. These are actual clients who used HoldVera to secure their deals.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat) => (
                <div key={stat.label} className="card-luxury p-6 text-center">
                  <div className="text-3xl font-bold gold-text mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-[var(--cream)]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.name} className="card-luxury p-8 flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">{t.date}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1.5 bg-[var(--gold)]/10 rounded-lg">
                      <span className="text-xs font-medium text-[var(--gold)]">{t.transaction}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{t.amount}</span>
                  </div>

                  <div className="relative mb-6 flex-1">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[var(--gold)]/20" />
                    <p className="text-gray-600 text-sm leading-relaxed pl-4">{t.content}</p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--gold)]/30">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{t.name}</div>
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

        <CTA />
      </main>
      <Footer />
    </>
  );
}
