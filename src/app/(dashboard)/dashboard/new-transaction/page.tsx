"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  ArrowLeft,
  ArrowRight,
  User,
  DollarSign,
  FileCheck,
  Shield,
  Check,
  AlertCircle,
  Upload,
  X,
  ImageIcon
} from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function NewTransactionPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    counterpartyEmail: "",
    counterpartyName: "",
    title: "",
    description: "",
    amount: "",
    currency: "USD",
    inspectionDays: "3",
    terms: ""
  });
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (images.length >= 6) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string].slice(0, 6));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateEscrow = async () => {
    setSubmitting(true);

    // Generate a transaction ID
    const txId = `HV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Simulate API call (replace with real API later)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store transaction locally for now
    const transaction = {
      id: txId,
      ...formData,
      images,
      status: "pending_acceptance",
      createdAt: new Date().toISOString(),
      createdBy: user?.email
    };

    const existingTransactions = JSON.parse(localStorage.getItem("holdvera_transactions") || "[]");
    existingTransactions.push(transaction);
    localStorage.setItem("holdvera_transactions", JSON.stringify(existingTransactions));

    setTransactionId(txId);
    setSubmitting(false);
    setSubmitted(true);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("holdvera_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("holdvera_user");
    localStorage.removeItem("holdvera_token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Your Role", icon: User },
    { number: 2, title: "Transaction Details", icon: FileCheck },
    { number: 3, title: "Payment", icon: DollarSign },
    { number: 4, title: "Review", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[var(--black)] z-50 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="HoldVera" width={40} height={40} />
              <span className="font-serif text-xl font-bold">
                <span className="text-white">HOLD</span>
                <span className="gold-text">VERA</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: "Dashboard", icon: Home, href: "/dashboard", active: false },
              { label: "Transactions", icon: FileText, href: "/dashboard/transactions", active: false },
              { label: "New Transaction", icon: PlusCircle, href: "/dashboard/new-transaction", active: true },
              { label: "Settings", icon: Settings, href: "/dashboard/settings", active: false },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${item.active
                    ? "bg-[var(--gold)] text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-500 text-sm truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Transaction</h1>
            <p className="text-gray-500">Set up a secure escrow transaction in minutes</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${step >= s.number
                        ? "bg-[var(--gold)] text-white"
                        : "bg-gray-200 text-gray-500"
                      }
                    `}>
                      {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                    </div>
                    <span className={`mt-2 text-xs font-medium hidden sm:block ${step >= s.number ? "text-[var(--gold)]" : "text-gray-500"}`}>
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 sm:w-24 h-1 mx-2 ${step > s.number ? "bg-[var(--gold)]" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            {/* Step 1: Your Role */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">What&apos;s your role?</h2>
                <p className="text-gray-500 mb-6">Select whether you&apos;re buying or selling in this transaction</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setFormData({ ...formData, role: "buyer" })}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      formData.role === "buyer"
                        ? "border-[var(--gold)] bg-[var(--gold)]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      formData.role === "buyer" ? "bg-[var(--gold)]" : "bg-gray-100"
                    }`}>
                      <DollarSign className={`w-6 h-6 ${formData.role === "buyer" ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">I&apos;m the Buyer</h3>
                    <p className="text-sm text-gray-500">I&apos;m purchasing goods or services</p>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, role: "seller" })}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      formData.role === "seller"
                        ? "border-[var(--gold)] bg-[var(--gold)]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      formData.role === "seller" ? "bg-[var(--gold)]" : "bg-gray-100"
                    }`}>
                      <FileCheck className={`w-6 h-6 ${formData.role === "seller" ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">I&apos;m the Seller</h3>
                    <p className="text-sm text-gray-500">I&apos;m providing goods or services</p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Transaction Details */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Transaction Details</h2>
                <p className="text-gray-500 mb-6">Describe what&apos;s being exchanged</p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Website Development Project"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the goods or services being exchanged..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Counterparty Email</label>
                      <input
                        type="email"
                        value={formData.counterpartyEmail}
                        onChange={(e) => setFormData({ ...formData, counterpartyEmail: e.target.value })}
                        placeholder="their@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Counterparty Name</label>
                      <input
                        type="text"
                        value={formData.counterpartyName}
                        onChange={(e) => setFormData({ ...formData, counterpartyName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Property Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Images <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      Upload at least 2 photos of the property (max 6). Clear images help build trust.
                    </p>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      {images.map((img, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                          <img src={img} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Upload Button */}
                      {images.length < 6 && (
                        <label className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-colors">
                          <Upload className="w-6 h-6 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Image Count Indicator */}
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 text-sm ${images.length >= 2 ? "text-green-600" : "text-amber-600"}`}>
                        {images.length >= 2 ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span>{images.length}/6 photos uploaded</span>
                        {images.length < 2 && <span className="text-amber-600">(minimum 2 required)</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Details</h2>
                <p className="text-gray-500 mb-6">Set the transaction amount and terms</p>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent bg-white"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Period</label>
                    <select
                      value={formData.inspectionDays}
                      onChange={(e) => setFormData({ ...formData, inspectionDays: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent bg-white"
                    >
                      <option value="1">1 Day</option>
                      <option value="3">3 Days</option>
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500">Buyer has this time to inspect and accept delivery</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Terms (Optional)</label>
                    <textarea
                      value={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                      placeholder="Any additional terms or conditions..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900 font-medium">Escrow Fee: 2.9%</p>
                        <p className="text-sm text-blue-700">
                          {formData.amount ? `Fee: $${(parseFloat(formData.amount) * 0.029).toFixed(2)}` : "Enter amount to see fee"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Review Transaction</h2>
                <p className="text-gray-500 mb-6">Confirm all details before creating the escrow</p>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Your Role</h3>
                    <p className="font-semibold text-gray-900 capitalize">{formData.role || "Not selected"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Transaction</h3>
                    <p className="font-semibold text-gray-900">{formData.title || "No title"}</p>
                    <p className="text-sm text-gray-600 mt-1">{formData.description || "No description"}</p>
                  </div>

                  {/* Property Images Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Property Images</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {images.map((img, index) => (
                        <div key={index} className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                          <img src={img} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{images.length} photo{images.length !== 1 ? "s" : ""} attached</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Counterparty</h3>
                    <p className="font-semibold text-gray-900">{formData.counterpartyName || "Not specified"}</p>
                    <p className="text-sm text-gray-600">{formData.counterpartyEmail || "No email"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment</h3>
                    <p className="font-semibold text-gray-900 text-xl">
                      ${formData.amount || "0.00"} {formData.currency}
                    </p>
                    <p className="text-sm text-gray-600">Inspection period: {formData.inspectionDays} days</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-900 font-medium">Ready to create?</p>
                        <p className="text-sm text-amber-700">
                          Once created, an invitation will be sent to {formData.counterpartyEmail || "the counterparty"}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {!submitted && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setStep(Math.max(1, step - 1))}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                    step === 1 || submitting
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  disabled={step === 1 || submitting}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                {step < 4 ? (
                  <button
                    onClick={() => setStep(Math.min(4, step + 1))}
                    disabled={step === 2 && images.length < 2}
                    className={`flex items-center gap-2 btn-gold px-6 py-2.5 ${step === 2 && images.length < 2 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreateEscrow}
                    disabled={submitting}
                    className="flex items-center gap-2 btn-gold px-6 py-2.5 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Create Escrow
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Success State */}
            {submitted && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Escrow Created!</h2>
                <p className="text-gray-500 mb-2">Your transaction has been created successfully.</p>
                <p className="text-sm text-gray-400 mb-6">Transaction ID: <span className="font-mono font-semibold text-gray-700">{transactionId}</span></p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left max-w-md mx-auto">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-medium">What&apos;s next?</p>
                      <p className="text-sm text-blue-700">
                        An invitation has been sent to {formData.counterpartyEmail}. Once they accept, the escrow will be active.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/dashboard/transactions"
                    className="btn-gold px-6 py-2.5"
                  >
                    View Transactions
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
