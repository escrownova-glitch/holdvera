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
  Shield,
  Camera,
  CreditCard,
  User,
  Globe,
  Phone,
  MapPin
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
}

const COUNTRIES = [
  { code: "US", name: "United States", requiresSSN: true, phoneCode: "+1", taxIdLabel: "Social Security Number (SSN)", taxIdPlaceholder: "XXX-XX-XXXX" },
  { code: "GB", name: "United Kingdom", requiresSSN: false, phoneCode: "+44", taxIdLabel: "National Insurance Number", taxIdPlaceholder: "QQ 12 34 56 C" },
  { code: "CA", name: "Canada", requiresSSN: true, phoneCode: "+1", taxIdLabel: "Social Insurance Number (SIN)", taxIdPlaceholder: "XXX-XXX-XXX" },
  { code: "AU", name: "Australia", requiresSSN: false, phoneCode: "+61", taxIdLabel: "Tax File Number", taxIdPlaceholder: "XXX XXX XXX" },
  { code: "DE", name: "Germany", requiresSSN: false, phoneCode: "+49", taxIdLabel: "Tax ID", taxIdPlaceholder: "" },
  { code: "FR", name: "France", requiresSSN: false, phoneCode: "+33", taxIdLabel: "Tax ID", taxIdPlaceholder: "" },
  { code: "IT", name: "Italy", requiresSSN: false, phoneCode: "+39", taxIdLabel: "Codice Fiscale", taxIdPlaceholder: "" },
  { code: "ES", name: "Spain", requiresSSN: false, phoneCode: "+34", taxIdLabel: "NIE/NIF", taxIdPlaceholder: "" },
  { code: "NL", name: "Netherlands", requiresSSN: false, phoneCode: "+31", taxIdLabel: "BSN", taxIdPlaceholder: "" },
  { code: "BE", name: "Belgium", requiresSSN: false, phoneCode: "+32", taxIdLabel: "National Number", taxIdPlaceholder: "" },
  { code: "CH", name: "Switzerland", requiresSSN: false, phoneCode: "+41", taxIdLabel: "AHV Number", taxIdPlaceholder: "" },
  { code: "AT", name: "Austria", requiresSSN: false, phoneCode: "+43", taxIdLabel: "Tax ID", taxIdPlaceholder: "" },
  { code: "SE", name: "Sweden", requiresSSN: false, phoneCode: "+46", taxIdLabel: "Personal Number", taxIdPlaceholder: "" },
  { code: "NO", name: "Norway", requiresSSN: false, phoneCode: "+47", taxIdLabel: "Personal Number", taxIdPlaceholder: "" },
  { code: "DK", name: "Denmark", requiresSSN: false, phoneCode: "+45", taxIdLabel: "CPR Number", taxIdPlaceholder: "" },
  { code: "FI", name: "Finland", requiresSSN: false, phoneCode: "+358", taxIdLabel: "Personal ID", taxIdPlaceholder: "" },
  { code: "IE", name: "Ireland", requiresSSN: false, phoneCode: "+353", taxIdLabel: "PPS Number", taxIdPlaceholder: "" },
  { code: "PT", name: "Portugal", requiresSSN: false, phoneCode: "+351", taxIdLabel: "NIF", taxIdPlaceholder: "" },
  { code: "PL", name: "Poland", requiresSSN: false, phoneCode: "+48", taxIdLabel: "PESEL", taxIdPlaceholder: "" },
  { code: "CZ", name: "Czech Republic", requiresSSN: false, phoneCode: "+420", taxIdLabel: "Birth Number", taxIdPlaceholder: "" },
  { code: "GR", name: "Greece", requiresSSN: false, phoneCode: "+30", taxIdLabel: "AFM", taxIdPlaceholder: "" },
  { code: "HU", name: "Hungary", requiresSSN: false, phoneCode: "+36", taxIdLabel: "Tax ID", taxIdPlaceholder: "" },
  { code: "RO", name: "Romania", requiresSSN: false, phoneCode: "+40", taxIdLabel: "CNP", taxIdPlaceholder: "" },
  { code: "BG", name: "Bulgaria", requiresSSN: false, phoneCode: "+359", taxIdLabel: "EGN", taxIdPlaceholder: "" },
  { code: "HR", name: "Croatia", requiresSSN: false, phoneCode: "+385", taxIdLabel: "OIB", taxIdPlaceholder: "" },
  { code: "SK", name: "Slovakia", requiresSSN: false, phoneCode: "+421", taxIdLabel: "Birth Number", taxIdPlaceholder: "" },
  { code: "SI", name: "Slovenia", requiresSSN: false, phoneCode: "+386", taxIdLabel: "Tax Number", taxIdPlaceholder: "" },
  { code: "LT", name: "Lithuania", requiresSSN: false, phoneCode: "+370", taxIdLabel: "Personal Code", taxIdPlaceholder: "" },
  { code: "LV", name: "Latvia", requiresSSN: false, phoneCode: "+371", taxIdLabel: "Personal Code", taxIdPlaceholder: "" },
  { code: "EE", name: "Estonia", requiresSSN: false, phoneCode: "+372", taxIdLabel: "Personal ID", taxIdPlaceholder: "" },
  { code: "CY", name: "Cyprus", requiresSSN: false, phoneCode: "+357", taxIdLabel: "TIC", taxIdPlaceholder: "" },
  { code: "MT", name: "Malta", requiresSSN: false, phoneCode: "+356", taxIdLabel: "ID Number", taxIdPlaceholder: "" },
  { code: "LU", name: "Luxembourg", requiresSSN: false, phoneCode: "+352", taxIdLabel: "National ID", taxIdPlaceholder: "" },
  { code: "JP", name: "Japan", requiresSSN: false, phoneCode: "+81", taxIdLabel: "My Number", taxIdPlaceholder: "" },
  { code: "KR", name: "South Korea", requiresSSN: false, phoneCode: "+82", taxIdLabel: "RRN", taxIdPlaceholder: "" },
  { code: "SG", name: "Singapore", requiresSSN: false, phoneCode: "+65", taxIdLabel: "NRIC/FIN", taxIdPlaceholder: "" },
  { code: "HK", name: "Hong Kong", requiresSSN: false, phoneCode: "+852", taxIdLabel: "HKID", taxIdPlaceholder: "" },
  { code: "TW", name: "Taiwan", requiresSSN: false, phoneCode: "+886", taxIdLabel: "National ID", taxIdPlaceholder: "" },
  { code: "MY", name: "Malaysia", requiresSSN: false, phoneCode: "+60", taxIdLabel: "NRIC", taxIdPlaceholder: "" },
  { code: "TH", name: "Thailand", requiresSSN: false, phoneCode: "+66", taxIdLabel: "National ID", taxIdPlaceholder: "" },
  { code: "PH", name: "Philippines", requiresSSN: false, phoneCode: "+63", taxIdLabel: "TIN", taxIdPlaceholder: "" },
  { code: "ID", name: "Indonesia", requiresSSN: false, phoneCode: "+62", taxIdLabel: "NIK", taxIdPlaceholder: "" },
  { code: "VN", name: "Vietnam", requiresSSN: false, phoneCode: "+84", taxIdLabel: "CCCD", taxIdPlaceholder: "" },
  { code: "IN", name: "India", requiresSSN: false, phoneCode: "+91", taxIdLabel: "Aadhaar/PAN", taxIdPlaceholder: "" },
  { code: "PK", name: "Pakistan", requiresSSN: false, phoneCode: "+92", taxIdLabel: "CNIC", taxIdPlaceholder: "" },
  { code: "BD", name: "Bangladesh", requiresSSN: false, phoneCode: "+880", taxIdLabel: "NID", taxIdPlaceholder: "" },
  { code: "AE", name: "United Arab Emirates", requiresSSN: false, phoneCode: "+971", taxIdLabel: "Emirates ID", taxIdPlaceholder: "" },
  { code: "SA", name: "Saudi Arabia", requiresSSN: false, phoneCode: "+966", taxIdLabel: "National ID", taxIdPlaceholder: "" },
  { code: "QA", name: "Qatar", requiresSSN: false, phoneCode: "+974", taxIdLabel: "QID", taxIdPlaceholder: "" },
  { code: "KW", name: "Kuwait", requiresSSN: false, phoneCode: "+965", taxIdLabel: "Civil ID", taxIdPlaceholder: "" },
  { code: "BH", name: "Bahrain", requiresSSN: false, phoneCode: "+973", taxIdLabel: "CPR", taxIdPlaceholder: "" },
  { code: "OM", name: "Oman", requiresSSN: false, phoneCode: "+968", taxIdLabel: "National ID", taxIdPlaceholder: "" },
  { code: "IL", name: "Israel", requiresSSN: false, phoneCode: "+972", taxIdLabel: "Teudat Zehut", taxIdPlaceholder: "" },
  { code: "TR", name: "Turkey", requiresSSN: false, phoneCode: "+90", taxIdLabel: "TC Kimlik No", taxIdPlaceholder: "" },
  { code: "EG", name: "Egypt", requiresSSN: false, phoneCode: "+20", taxIdLabel: "National ID", taxIdPlaceholder: "" },
  { code: "ZA", name: "South Africa", requiresSSN: false, phoneCode: "+27", taxIdLabel: "ID Number", taxIdPlaceholder: "" },
  { code: "NG", name: "Nigeria", requiresSSN: false, phoneCode: "+234", taxIdLabel: "NIN", taxIdPlaceholder: "" },
  { code: "KE", name: "Kenya", requiresSSN: false, phoneCode: "+254", taxIdLabel: "National ID", taxIdPlaceholder: "" },
  { code: "GH", name: "Ghana", requiresSSN: false, phoneCode: "+233", taxIdLabel: "Ghana Card", taxIdPlaceholder: "" },
  { code: "MA", name: "Morocco", requiresSSN: false, phoneCode: "+212", taxIdLabel: "CIN", taxIdPlaceholder: "" },
  { code: "TN", name: "Tunisia", requiresSSN: false, phoneCode: "+216", taxIdLabel: "CIN", taxIdPlaceholder: "" },
  { code: "MX", name: "Mexico", requiresSSN: false, phoneCode: "+52", taxIdLabel: "CURP/RFC", taxIdPlaceholder: "" },
  { code: "BR", name: "Brazil", requiresSSN: false, phoneCode: "+55", taxIdLabel: "CPF", taxIdPlaceholder: "" },
  { code: "AR", name: "Argentina", requiresSSN: false, phoneCode: "+54", taxIdLabel: "CUIL/CUIT", taxIdPlaceholder: "" },
  { code: "CL", name: "Chile", requiresSSN: false, phoneCode: "+56", taxIdLabel: "RUT", taxIdPlaceholder: "" },
  { code: "CO", name: "Colombia", requiresSSN: false, phoneCode: "+57", taxIdLabel: "Cedula", taxIdPlaceholder: "" },
  { code: "PE", name: "Peru", requiresSSN: false, phoneCode: "+51", taxIdLabel: "DNI", taxIdPlaceholder: "" },
  { code: "VE", name: "Venezuela", requiresSSN: false, phoneCode: "+58", taxIdLabel: "Cedula", taxIdPlaceholder: "" },
  { code: "EC", name: "Ecuador", requiresSSN: false, phoneCode: "+593", taxIdLabel: "Cedula", taxIdPlaceholder: "" },
  { code: "UY", name: "Uruguay", requiresSSN: false, phoneCode: "+598", taxIdLabel: "Cedula", taxIdPlaceholder: "" },
  { code: "PY", name: "Paraguay", requiresSSN: false, phoneCode: "+595", taxIdLabel: "Cedula", taxIdPlaceholder: "" },
  { code: "BO", name: "Bolivia", requiresSSN: false, phoneCode: "+591", taxIdLabel: "Cedula", taxIdPlaceholder: "" },
  { code: "NZ", name: "New Zealand", requiresSSN: false, phoneCode: "+64", taxIdLabel: "IRD Number", taxIdPlaceholder: "" },
  { code: "RU", name: "Russia", requiresSSN: false, phoneCode: "+7", taxIdLabel: "INN", taxIdPlaceholder: "" },
  { code: "UA", name: "Ukraine", requiresSSN: false, phoneCode: "+380", taxIdLabel: "IPN", taxIdPlaceholder: "" },
  { code: "BY", name: "Belarus", requiresSSN: false, phoneCode: "+375", taxIdLabel: "Personal Number", taxIdPlaceholder: "" },
  { code: "KZ", name: "Kazakhstan", requiresSSN: false, phoneCode: "+7", taxIdLabel: "IIN", taxIdPlaceholder: "" },
  { code: "OTHER", name: "Other", requiresSSN: false, phoneCode: "+", taxIdLabel: "Tax ID", taxIdPlaceholder: "" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function KYCPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    phone: "",
    ssn: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    idType: "PASSPORT",
  });

  const [images, setImages] = useState({
    idFront: "",
    idBack: "",
    selfie: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("holdvera_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
      }));
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

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages(prev => ({ ...prev, [field]: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const selectedCountry = COUNTRIES.find(c => c.code === formData.country);
  const requiresSSN = selectedCountry?.requiresSSN || false;
  const isPassport = formData.idType === "PASSPORT";

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth ||
        !formData.nationality || !formData.phone || !formData.address ||
        !formData.city || !formData.country || !images.idFront || !images.selfie) {
      alert("Please fill in all required fields and upload required documents.");
      return;
    }

    // SSN required for US/CA
    if (requiresSSN && !formData.ssn) {
      alert("Tax ID / SSN is required for your country.");
      return;
    }

    // ID back required for non-passport
    if (!isPassport && !images.idBack) {
      alert("Please upload the back of your ID.");
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
          idBackUrl: isPassport ? null : images.idBack,
          selfieUrl: images.selfie,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit KYC");
      }

      await fetchKYCStatus();
    } catch (error: any) {
      console.error("KYC submission error:", error);
      alert(error.message || "Failed to submit verification. Please try again.");
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
      case "APPROVED": {
        const pendingInvite = typeof window !== "undefined" ? localStorage.getItem("holdvera_invite_redirect") : null;
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
            <p className="text-gray-500 mb-6">Your identity has been verified. You have full access to all features.</p>
            {pendingInvite ? (
              <div className="space-y-3">
                <Link href={`/invite/${pendingInvite}`} className="btn-gold px-6 py-2.5 inline-block">
                  Continue to Pending Invitation
                </Link>
                <p className="text-sm text-gray-400">
                  Or <Link href="/dashboard" className="text-[var(--gold)] hover:underline">go to dashboard</Link>
                </p>
              </div>
            ) : (
              <Link href="/dashboard" className="btn-gold px-6 py-2.5">
                Go to Dashboard
              </Link>
            )}
          </div>
        );
      }

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                placeholder="William"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] bg-white"
              >
                <option value="">Select nationality</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="w-24 flex-shrink-0">
                  <input
                    type="text"
                    value={selectedCountry?.phoneCode || "+1"}
                    readOnly
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-center"
                  />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--gold)]" />
            Residential Address
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country of Residence <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] bg-white"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 <span className="text-gray-400 font-normal">(Apt, Suite, etc.)</span>
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                placeholder="Apt 4B"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="NY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="10001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax ID / SSN / SIN */}
        {requiresSSN && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[var(--gold)]" />
              Tax Identification
            </h3>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedCountry?.taxIdLabel || "Tax ID"} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.ssn}
                onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                placeholder={selectedCountry?.taxIdPlaceholder || "Enter your tax ID"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              />
              <p className="text-xs text-gray-500 mt-1">This information is encrypted and securely stored.</p>
            </div>
          </div>
        )}

        {/* ID Upload */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[var(--gold)]" />
            Identity Document
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.idType}
              onChange={(e) => {
                setFormData({ ...formData, idType: e.target.value });
                if (e.target.value === "PASSPORT") {
                  setImages(prev => ({ ...prev, idBack: "" }));
                }
              }}
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] bg-white"
            >
              <option value="PASSPORT">Passport</option>
              <option value="DRIVERS_LICENSE">Driver&apos;s License</option>
              <option value="NATIONAL_ID">National ID Card</option>
              <option value="RESIDENCE_PERMIT">Residence Permit</option>
            </select>
          </div>

          <div className={`grid grid-cols-1 ${isPassport ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
            {/* ID Front / Passport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isPassport ? "Passport Photo Page" : "Front of ID"} <span className="text-red-500">*</span>
              </label>
              <label className={`
                aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden
                ${images.idFront ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-[var(--gold)] hover:bg-[var(--gold)]/5"}
              `}>
                {images.idFront ? (
                  <img src={images.idFront} alt="ID Front" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload {isPassport ? "Passport" : "Front"}</span>
                    <span className="text-xs text-gray-400 mt-1">Max 5MB</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload("idFront")} className="hidden" />
              </label>
            </div>

            {/* ID Back - only for non-passport */}
            {!isPassport && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Back of ID <span className="text-red-500">*</span>
                </label>
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
                      <span className="text-xs text-gray-400 mt-1">Max 5MB</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload("idBack")} className="hidden" />
                </label>
              </div>
            )}

            {/* Selfie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selfie Holding ID <span className="text-red-500">*</span>
              </label>
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
                    <span className="text-xs text-gray-400 mt-1">Hold your ID visible</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload("selfie")} className="hidden" />
              </label>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Make sure all text is clearly visible and the entire document is in frame.
          </p>
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

        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
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
