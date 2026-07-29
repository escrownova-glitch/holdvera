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
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Shield,
  Camera,
  CreditCard,
  User
} from "lucide-react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

interface KYCData {
  kycStatus: string;
  kycSubmittedAt: string | null;
  kycRejectReason: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  idType: string | null;
}

export default function KYCPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    idType: "DRIVERS_LICENSE",
  });

  const [images, setImages] = useState({
    idFront: "",
    idBack: "",
    selfie: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("holdvera_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch("/api/kyc", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setKycData(data.kyc);
    } catch (error) {
      console.error("Failed to fetch KYC status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("holdvera_user");
    localStorage.removeItem("holdvera_token");
    window.location.href = "/login";
  };

  const handleImageUpload = (field: "idFront" | "idBack" | "selfie") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages(prev => ({ ...prev, [field]: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!formData.dateOfBirth || !formData.ssn || !formData.address || !formData.city ||
        !formData.state || !formData.zipCode || !images.idFront || !images.idBack || !images.selfie) {
      alert("Please fill in all fields and upload all required documents.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          idFrontUrl: images.idFront,
          idBackUrl: images.idBack,
          selfieUrl: images.selfie,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit KYC");
      }

      await fetchKYCStatus();
    } catch (error) {
      console.error("KYC submission error:", error);
      alert("Failed to submit verification. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderStatus = () => {
    switch (kycData?.kycStatus) {
      case "APPROVED":
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
            <p className="text-gray-500 mb-6">Your identity has been verified. You have full access to all features.</p>
            <Link href="/dashboard" className="btn-gold px-6 py-2.5">
              Go to Dashboard
            </Link>
          </div>
        );

      case "SUBMITTED":
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Under Review</h2>
            <p className="text-gray-500 mb-2">Your documents are being reviewed by our team.</p>
            <p className="text-sm text-gray-400 mb-6">
              Submitted: {new Date(kycData.kycSubmittedAt!).toLocaleString()}
            </p>
            <p className="text-gray-500">This usually takes 1-2 business days. We&apos;ll email you when complete.</p>
          </div>
        );

      case "REJECTED":
        return (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 font-medium">Verification Declined</p>
                  <p className="text-red-700 text-sm mt-1">
                    {kycData.kycRejectReason || "Your documents could not be verified."}
                  </p>
                </div>
              </div>
            </div>
            {renderForm()}
          </div>
        );

      default:
        return renderForm();
    }
  };

  const renderForm = () => (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 font-medium">Why verify your identity?</p>
            <p className="text-blue-700 text-sm mt-1">
              Identity verification protects all parties in escrow transactions and is required by financial regulations.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--gold)]" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Social Security Number</label>
              <input
                type="password"
                value={formData.ssn}
                onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                placeholder="XXX-XX-XXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-[var(--gold)]" />
            Address
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="ZIP Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] bg-white"
              >
                <option value="USA">USA</option>
              </select>
            </div>
          </div>
        </div>

        {/* ID Upload */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[var(--gold)]" />
            Identity Document
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
            <select
              value={formData.idType}
              onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] bg-white"
            >
              <option value="DRIVERS_LICENSE">Driver&apos;s License</option>
              <option value="PASSPORT">Passport</option>
              <option value="STATE_ID">State ID</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ID Front */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Front of ID</label>
              <label className={`
                aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden
                ${images.idFront ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-[var(--gold)] hover:bg-[var(--gold)]/5"}
              `}>
                {images.idFront ? (
                  <img src={images.idFront} alt="ID Front" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Front</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload("idFront")} className="hidden" />
              </label>
            </div>

            {/* ID Back */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Back of ID</label>
              <label className={`
                aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden
                ${images.idBack ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-[var(--gold)] hover:bg-[var(--gold)]/5"}
              `}>
                {images.idBack ? (
                  <img src={images.idBack} alt="ID Back" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Back</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload("idBack")} className="hidden" />
              </label>
            </div>

            {/* Selfie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selfie Holding ID</label>
              <label className={`
                aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden
                ${images.selfie ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-[var(--gold)] hover:bg-[var(--gold)]/5"}
              `}>
                {images.selfie ? (
                  <img src={images.selfie} alt="Selfie" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Take Selfie</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload("selfie")} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full btn-gold py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Submit for Verification
              </>
            )}
          </button>
          <p className="text-center text-sm text-gray-500 mt-3">
            Your information is encrypted and securely stored.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[var(--black)] z-50 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="HoldVera" width={40} height={40} />
              <span className="font-serif text-xl font-bold">
                <span className="text-white">HOLD</span>
                <span className="gold-text">VERA</span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: "Dashboard", icon: Home, href: "/dashboard" },
              { label: "Transactions", icon: FileText, href: "/dashboard/transactions" },
              { label: "New Transaction", icon: PlusCircle, href: "/dashboard/new-transaction" },
              { label: "Settings", icon: Settings, href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.firstName} {user?.lastName}</p>
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
        <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700">
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </div>
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h1>
            <p className="text-gray-500">Complete KYC to unlock all features</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            {renderStatus()}
          </div>
        </main>
      </div>
    </div>
  );
}
