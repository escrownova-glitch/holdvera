"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  FileText,
  AlertCircle,
  ArrowRight,
  Lock
} from "lucide-react";

interface TransactionData {
  id: string;
  transactionId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  creatorRole: string;
  inspectionDays: number;
  status: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
  };
  counterpartyName: string;
  counterpartyEmail: string;
  images: { url: string }[];
}

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("holdvera_token");
    setIsLoggedIn(!!token);

    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`/api/invite/${params.token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid or expired invite");
        return;
      }

      setTransaction(data.transaction);
    } catch (err) {
      setError("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!isLoggedIn) {
      localStorage.setItem("holdvera_invite_redirect", params.token as string);
      router.push("/register");
      return;
    }

    setAccepting(true);
    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch(`/api/invite/${params.token}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to accept invitation");
        return;
      }

      router.push(`/dashboard/transactions/${transaction?.id}`);
    } catch (err) {
      setError("Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Not Found</h1>
          <p className="text-gray-500 mb-6">{error || "This invitation link is invalid or has expired."}</p>
          <Link href="/" className="btn-gold px-6 py-3 inline-block">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const creatorName = `${transaction.creator.firstName} ${transaction.creator.lastName}`;
  const yourRole = transaction.creatorRole === "buyer" ? "Seller" : "Buyer";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[var(--black)] py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="HoldVera" width={40} height={40} />
            <span className="font-serif text-xl font-bold">
              <span className="text-white">HOLD</span>
              <span className="gold-text">VERA</span>
            </span>
          </Link>
          {!isLoggedIn && (
            <Link href="/login" className="text-white hover:text-[var(--gold)] transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">Secure Escrow Transaction</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[var(--black)] to-gray-800 text-white p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium">
                Pending Your Response
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">You&apos;ve Been Invited to an Escrow Transaction</h1>
            <p className="text-gray-300">
              <strong>{creatorName}</strong> wants to {transaction.creatorRole === "buyer" ? "purchase from" : "sell to"} you
            </p>
          </div>

          {/* Transaction Details */}
          <div className="p-8">
            {/* Images */}
            {transaction.images && transaction.images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Property Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {transaction.images.map((img, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <img src={img.url} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction</p>
                    <p className="font-semibold text-gray-900">{transaction.title}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{transaction.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-bold text-2xl text-gray-900">
                      ${transaction.amount.toLocaleString()} {transaction.currency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Your Role</p>
                    <p className="font-semibold text-gray-900">{yourRole}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Inspection Period</p>
                    <p className="font-semibold text-gray-900">{transaction.inspectionDays} Days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How Escrow Works */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                How HoldVera Escrow Protects You
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <p className="text-sm text-blue-800">Buyer&apos;s funds are held securely in escrow</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <p className="text-sm text-blue-800">Seller delivers goods/services as agreed</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <p className="text-sm text-blue-800">Funds released after buyer confirms receipt</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="flex-1 btn-gold py-4 text-lg flex items-center justify-center gap-2"
              >
                {accepting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {isLoggedIn ? "Accept & Join Transaction" : "Create Account to Accept"}
                  </>
                )}
              </button>
            </div>

            {!isLoggedIn && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <Link href={`/login?redirect=/invite/${params.token}`} className="text-[var(--gold)] font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Bank-Level Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>FDIC Protected</span>
          </div>
        </div>
      </main>
    </div>
  );
}
