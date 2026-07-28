"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError("Please fill in all fields");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      window.location.href = "/login?registered=true";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--black)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Image
            src="/images/logo.png"
            alt="HoldVera"
            width={150}
            height={150}
            className="mb-8"
          />
          <h1 className="text-4xl font-serif font-bold text-white text-center mb-4">
            Join HoldVera
          </h1>
          <p className="text-gray-400 text-center max-w-sm mb-12">
            Create your secure escrow account and start making trusted transactions worldwide.
          </p>

          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center gap-4 text-white">
              <CheckCircle className="w-6 h-6 text-[var(--gold)]" />
              <span>Bank-level security for all transactions</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <CheckCircle className="w-6 h-6 text-[var(--gold)]" />
              <span>FDIC protected deposits up to $250,000</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <CheckCircle className="w-6 h-6 text-[var(--gold)]" />
              <span>24/7 dedicated customer support</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <CheckCircle className="w-6 h-6 text-[var(--gold)]" />
              <span>Global transactions with local expertise</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="HoldVera" width={50} height={50} />
              <span className="font-serif text-xl font-bold">
                <span className="text-black">HOLD</span>
                <span className="gold-text">VERA</span>
              </span>
            </Link>
          </div>

          <div className="card-luxury p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2">Create Account</h2>
              <p className="text-gray-500 text-sm">
                Step {step} of 2 - {step === 1 ? "Personal Information" : "Security"}
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <div className={`h-1 w-16 rounded-full ${step >= 1 ? "gold-gradient" : "bg-gray-200"}`} />
                <div className={`h-1 w-16 rounded-full ${step >= 2 ? "gold-gradient" : "bg-gray-200"}`} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="input-luxury pl-11"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        required
                        className="input-luxury"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        className="input-luxury pl-11"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        className="input-luxury pl-11"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="input-luxury pl-11 pr-11"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="input-luxury pl-11"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-gray-300 text-[var(--gold)] focus:ring-[var(--gold)]"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[var(--gold)] hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-[var(--gold)] hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                </>
              )}

              <div className="flex gap-4">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-outline flex-1"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold flex-1"
                >
                  {loading ? "Creating Account..." : step === 1 ? "Continue" : "Create Account"}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--gold)] font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
