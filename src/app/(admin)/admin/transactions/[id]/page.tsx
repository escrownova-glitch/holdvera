"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  FileText,
  MessageSquare,
  Shield,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";

interface Transaction {
  id: string;
  transactionId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  creatorRole: string;
  inspectionDays: number;
  terms: string;
  adminNotes: string;
  createdAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    kycStatus: string;
  };
  counterparty: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    kycStatus: string;
  } | null;
  counterpartyName: string;
  counterpartyEmail: string;
  images: { url: string }[];
  documents: { id: string; name: string; url: string }[];
  messages: {
    id: string;
    content: string;
    createdAt: string;
    sender: { firstName: string; lastName: string; email: string; role: string };
  }[];
  timeline: { event: string; description: string; createdAt: string }[];
}

export default function AdminTransactionDetail() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "chat" | "documents" | "timeline">("details");
  const [actionLoading, setActionLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTransaction();
  }, []);

  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [transaction?.messages, activeTab]);

  const fetchTransaction = async () => {
    const token = localStorage.getItem("holdvera_token");
    const res = await fetch(`/api/admin/transactions/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTransaction(data.transaction);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    const token = localStorage.getItem("holdvera_token");

    await fetch(`/api/admin/transactions/${params.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newMessage }),
    });

    setNewMessage("");
    await fetchTransaction();
    setSending(false);
  };

  const handleAction = async (action: "complete" | "cancel") => {
    const reason = action === "cancel" ? prompt("Enter cancellation reason:") : null;
    if (action === "cancel" && !reason) return;

    setActionLoading(true);
    const token = localStorage.getItem("holdvera_token");

    await fetch(`/api/admin/transactions/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, reason }),
    });

    await fetchTransaction();
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Transaction not found</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING_ACCEPTANCE: "bg-amber-500/20 text-amber-400",
    ACTIVE: "bg-blue-500/20 text-blue-400",
    COMPLETED: "bg-green-500/20 text-green-400",
    CANCELLED: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-800 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">{transaction.title}</h1>
              <p className="text-gray-500 text-sm">{transaction.transactionId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[transaction.status] || "bg-gray-600 text-gray-300"}`}>
              {transaction.status.replace("_", " ")}
            </span>
            {transaction.status === "ACTIVE" && (
              <>
                <button
                  onClick={() => handleAction("complete")}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete
                </button>
                <button
                  onClick={() => handleAction("cancel")}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pb-0">
          {[
            { id: "details", label: "Details", icon: FileText },
            { id: "chat", label: `Chat (${transaction.messages.length})`, icon: MessageSquare },
            { id: "documents", label: `Documents (${transaction.images.length + transaction.documents.length})`, icon: ImageIcon },
            { id: "timeline", label: "Timeline", icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--gold)] text-[var(--gold)]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6">
        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-white font-semibold mb-4">Transaction Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-1">Amount</p>
                    <p className="text-2xl font-bold text-white">${transaction.amount.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">{transaction.currency}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-500 text-xs mb-1">Inspection Period</p>
                    <p className="text-2xl font-bold text-white">{transaction.inspectionDays}</p>
                    <p className="text-gray-400 text-sm">Days</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500 text-xs mb-1">Description</p>
                  <p className="text-gray-300">{transaction.description}</p>
                </div>
                {transaction.terms && (
                  <div className="mt-4">
                    <p className="text-gray-500 text-xs mb-1">Additional Terms</p>
                    <p className="text-gray-300">{transaction.terms}</p>
                  </div>
                )}
              </div>

              {/* Property Images */}
              {transaction.images.length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-white font-semibold mb-4">Property Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {transaction.images.map((img, i) => (
                      <img key={i} src={img.url} alt={`Property ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Parties */}
            <div className="space-y-6">
              {/* Creator */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-gray-500" />
                  <h3 className="text-white font-semibold">{transaction.creatorRole === "buyer" ? "Buyer" : "Seller"} (Creator)</h3>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {transaction.creator.firstName[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.creator.firstName} {transaction.creator.lastName}</p>
                    <p className="text-gray-500 text-sm">{transaction.creator.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    transaction.creator.kycStatus === "APPROVED" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    KYC: {transaction.creator.kycStatus}
                  </span>
                </div>
              </div>

              {/* Counterparty */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-gray-500" />
                  <h3 className="text-white font-semibold">{transaction.creatorRole === "buyer" ? "Seller" : "Buyer"}</h3>
                </div>
                {transaction.counterparty ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                        {transaction.counterparty.firstName[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.counterparty.firstName} {transaction.counterparty.lastName}</p>
                        <p className="text-gray-500 text-sm">{transaction.counterparty.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        transaction.counterparty.kycStatus === "APPROVED" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        KYC: {transaction.counterparty.kycStatus}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-gray-400">Pending Acceptance</p>
                    <p className="text-gray-500 text-sm mt-1">{transaction.counterpartyName}</p>
                    <p className="text-gray-500 text-sm">{transaction.counterpartyEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {transaction.messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No messages yet</p>
                </div>
              ) : (
                transaction.messages.map((msg) => {
                  const isAdmin = msg.sender.role === "CEO" || msg.sender.role === "ADMIN";
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${isAdmin ? "bg-[var(--gold)]" : "bg-gray-700"} rounded-lg p-3`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${isAdmin ? "text-white/80" : "text-gray-400"}`}>
                            {msg.sender.firstName} {msg.sender.lastName}
                            {isAdmin && " (Support)"}
                          </span>
                          <span className={`text-xs ${isAdmin ? "text-white/60" : "text-gray-500"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className={isAdmin ? "text-white" : "text-gray-200"}>{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Send message to both parties..."
                  className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">Messages are sent to both parties with [HOLDVERA SUPPORT] prefix</p>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-4">Property Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {transaction.images.map((img, i) => (
                <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                  <img src={img.url} alt={`Image ${i + 1}`} className="w-full h-40 object-cover rounded-lg hover:opacity-80 transition-opacity" />
                </a>
              ))}
            </div>

            {transaction.documents.length > 0 && (
              <>
                <h3 className="text-white font-semibold mt-8 mb-4">Documents</h3>
                <div className="space-y-2">
                  {transaction.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{doc.name}</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="space-y-4">
              {transaction.timeline.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-[var(--gold)] rounded-full" />
                    {i < transaction.timeline.length - 1 && <div className="w-0.5 h-full bg-gray-700 mt-2" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-white font-medium">{event.event.replace("_", " ")}</p>
                    <p className="text-gray-400 text-sm">{event.description}</p>
                    <p className="text-gray-500 text-xs mt-1">{new Date(event.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
