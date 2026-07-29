"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  CreditCard,
  Eye,
  Download,
  Send,
  MessageSquare,
  X,
} from "lucide-react";

interface UserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  verified: boolean;
  emailVerified: boolean;
  createdAt: string;
  signupMethod: string;
  kycStatus: string;
  kycSubmittedAt: string | null;
  kycReviewedAt: string | null;
  kycRejectReason: string | null;
  kycFirstName: string | null;
  kycMiddleName: string | null;
  kycLastName: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  kycPhone: string | null;
  address: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  idType: string | null;
  idFrontUrl: string | null;
  idBackUrl: string | null;
  selfieUrl: string | null;
  ssnLast4: string | null;
  createdTransactions: any[];
  counterpartyTransactions: any[];
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [processing, setProcessing] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [requestInfoMessage, setRequestInfoMessage] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch(`/api/admin/users/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to fetch user");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleKYCAction = async (action: "approve" | "reject" | "request_info", reason?: string) => {
    if (!user) return;
    setProcessing(true);

    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch("/api/admin/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          action,
          reason: reason || undefined,
          issues: action === "request_info" ? selectedIssues : undefined,
        }),
      });

      if (res.ok) {
        await fetchUser();
        if (action === "request_info") {
          setShowRequestInfoModal(false);
          setRequestInfoMessage("");
          setSelectedIssues([]);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Action failed");
      }
    } catch {
      alert("Action failed");
    } finally {
      setProcessing(false);
    }
  };

  const kycIssueOptions = [
    { id: "id_blurry", label: "ID photo is blurry or unreadable" },
    { id: "id_expired", label: "ID appears to be expired" },
    { id: "id_mismatch", label: "Name on ID doesn't match account" },
    { id: "selfie_unclear", label: "Selfie is unclear or doesn't match ID" },
    { id: "address_incomplete", label: "Address information is incomplete" },
    { id: "dob_mismatch", label: "Date of birth doesn't match ID" },
    { id: "missing_back", label: "Back of ID is required" },
    { id: "ssn_invalid", label: "SSN/Tax ID format is invalid" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400 mb-4">{error || "User not found"}</p>
          <Link href="/admin" className="text-[var(--gold)] hover:underline">
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  const allTransactions = [...user.createdTransactions, ...user.counterpartyTransactions];

  const kycStatusColors: Record<string, string> = {
    PENDING: "bg-gray-500/20 text-gray-400",
    SUBMITTED: "bg-amber-500/20 text-amber-400",
    APPROVED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--gold)] flex items-center justify-center text-white text-xl font-bold">
                {user.firstName[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${kycStatusColors[user.kycStatus]}`}>
              KYC: {user.kycStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2">
          {["profile", "kyc", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                activeTab === tab
                  ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                  {user.emailVerified && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">{user.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Date of Birth</p>
                    <p className="text-white">{user.dateOfBirth || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white">
                      {user.address ? (
                        <>
                          {user.address}<br />
                          {user.city}, {user.state} {user.zipCode}<br />
                          {user.country}
                        </>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Role</p>
                    <p className="text-white">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Signup Method</p>
                    <p className="text-white">{user.signupMethod}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Joined</p>
                    <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-400 text-sm">SSN</p>
                    <p className="text-white">{user.ssnLast4 || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KYC Tab */}
        {activeTab === "kyc" && (
          <div className="space-y-6">
            {/* KYC Status Card */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">KYC Verification</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${kycStatusColors[user.kycStatus]}`}>
                  {user.kycStatus}
                </span>
              </div>

              {user.kycStatus === "SUBMITTED" && (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => handleKYCAction("approve")}
                    disabled={processing}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {processing ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => setShowRequestInfoModal(true)}
                    disabled={processing}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Request Info
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Enter rejection reason:");
                      if (reason) handleKYCAction("reject", reason);
                    }}
                    disabled={processing}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}

              {user.kycRejectReason && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
                  <p className="text-red-400 text-sm"><strong>Rejection Reason:</strong> {user.kycRejectReason}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">KYC Name</p>
                  <p className="text-white">
                    {user.kycFirstName ? `${user.kycFirstName} ${user.kycMiddleName || ''} ${user.kycLastName}`.trim() : "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Date of Birth</p>
                  <p className="text-white">{user.dateOfBirth || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Nationality</p>
                  <p className="text-white">{user.nationality || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-400">KYC Phone</p>
                  <p className="text-white">{user.kycPhone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-400">SSN/Tax ID</p>
                  <p className="text-white">{user.ssnLast4 || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-400">ID Type</p>
                  <p className="text-white">{user.idType?.replace(/_/g, ' ') || "Not provided"}</p>
                </div>
                <div className="col-span-2 md:col-span-3">
                  <p className="text-gray-400">Address</p>
                  <p className="text-white">
                    {user.address ? (
                      <>
                        {user.address}
                        {user.addressLine2 && <>, {user.addressLine2}</>}
                        <br />
                        {user.city}{user.state && `, ${user.state}`} {user.zipCode}
                        <br />
                        {user.country}
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Submitted</p>
                  <p className="text-white">{user.kycSubmittedAt ? new Date(user.kycSubmittedAt).toLocaleString() : "Not submitted"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Reviewed</p>
                  <p className="text-white">{user.kycReviewedAt ? new Date(user.kycReviewedAt).toLocaleString() : "Not reviewed"}</p>
                </div>
              </div>
            </div>

            {/* ID Documents */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Identity Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "ID Front", url: user.idFrontUrl },
                  { label: "ID Back", url: user.idBackUrl },
                  { label: "Selfie with ID", url: user.selfieUrl },
                ].map((doc) => (
                  <div key={doc.label} className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">{doc.label}</p>
                    {doc.url ? (
                      <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={doc.url}
                          alt={doc.label}
                          className="w-full h-full object-cover"
                        />
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-6 h-6 text-white" />
                        </a>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Not uploaded</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Transactions ({allTransactions.length})</h2>
            </div>
            {allTransactions.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Title</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Amount</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Role</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {allTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-700/50">
                      <td className="p-4">
                        <Link href={`/admin/transactions/${tx.id}`} className="text-white hover:text-[var(--gold)]">
                          {tx.title}
                        </Link>
                      </td>
                      <td className="p-4 text-white font-medium">${tx.amount?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                          tx.status === "ACTIVE" ? "bg-blue-500/20 text-blue-400" :
                          tx.status === "CANCELLED" ? "bg-red-500/20 text-red-400" :
                          "bg-amber-500/20 text-amber-400"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {user.createdTransactions.find((t: any) => t.id === tx.id) ? "Creator" : "Counterparty"}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No transactions yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request More Info Modal */}
      {showRequestInfoModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Request Additional Information</h3>
              <button
                onClick={() => setShowRequestInfoModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-gray-400 text-sm">
                Select the issues that need to be addressed by <strong className="text-white">{user.firstName} {user.lastName}</strong>:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {kycIssueOptions.map((issue) => (
                  <label
                    key={issue.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedIssues.includes(issue.id)
                        ? "border-[var(--gold)] bg-[var(--gold)]/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIssues.includes(issue.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIssues([...selectedIssues, issue.id]);
                        } else {
                          setSelectedIssues(selectedIssues.filter(i => i !== issue.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-500 text-[var(--gold)] focus:ring-[var(--gold)]"
                    />
                    <span className="text-white text-sm">{issue.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Additional message (optional):</label>
                <textarea
                  value={requestInfoMessage}
                  onChange={(e) => setRequestInfoMessage(e.target.value)}
                  placeholder="Add any specific instructions..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-700">
              <button
                onClick={() => setShowRequestInfoModal(false)}
                className="flex-1 py-2.5 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const message = [
                    ...selectedIssues.map(id => kycIssueOptions.find(o => o.id === id)?.label),
                    requestInfoMessage
                  ].filter(Boolean).join('\n');
                  handleKYCAction("request_info", message);
                }}
                disabled={processing || selectedIssues.length === 0}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {processing ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
