"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Home,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  User,
  Calendar,
  Shield,
  MessageSquare,
  Send,
  Image as ImageIcon,
  Download,
  ExternalLink,
  Upload,
  File,
  Eye,
} from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  kycStatus: string;
}

interface TransactionImage {
  id: string;
  url: string;
}

interface TransactionData {
  id: string;
  transactionId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  creatorRole: string;
  inspectionDays: number;
  terms: string | null;
  inviteCode: string | null;
  inviteAccepted: boolean;
  createdAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  counterparty: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  counterpartyName: string;
  counterpartyEmail: string;
  images: TransactionImage[];
  messages: {
    id: string;
    content: string;
    senderId: string | null;
    isSystem: boolean;
    createdAt: string;
    sender: { firstName: string; lastName: string } | null;
  }[];
  timeline: {
    id: string;
    event: string;
    description: string;
    createdAt: string;
  }[];
}

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "chat" | "documents" | "timeline">("details");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("holdvera_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchTransaction();
    fetchDocuments();
  }, [params.id]);

  // Poll for new messages every 5 seconds when on chat tab
  useEffect(() => {
    if (activeTab !== "chat") return;

    const interval = setInterval(() => {
      fetchTransaction();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab, params.id]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch(`/api/transactions/${params.id}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch documents");
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploadingDoc(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const token = localStorage.getItem("holdvera_token");

        const res = await fetch(`/api/transactions/${params.id}/documents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: file.name,
            url: base64,
            type: file.type.includes("pdf") ? "pdf" : "image",
          }),
        });

        if (res.ok) {
          await fetchDocuments();
        } else {
          alert("Failed to upload document");
        }
        setUploadingDoc(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadingDoc(false);
    }
  };

  const fetchTransaction = async () => {
    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch(`/api/transactions/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Transaction not found");
        return;
      }

      const data = await res.json();
      setTransaction(data.transaction);
    } catch (err) {
      setError("Failed to load transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !transaction) return;

    setSending(true);
    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch(`/api/transactions/${params.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (res.ok) {
        setNewMessage("");
        await fetchTransaction();
      }
    } catch (err) {
      console.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("holdvera_user");
    localStorage.removeItem("holdvera_token");
    window.location.href = "/login";
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING_ACCEPTANCE":
        return { label: "Pending Acceptance", color: "bg-amber-100 text-amber-800", icon: Clock };
      case "ACTIVE":
        return { label: "Active", color: "bg-blue-100 text-blue-800", icon: CheckCircle };
      case "AWAITING_PAYMENT":
        return { label: "Awaiting Payment", color: "bg-purple-100 text-purple-800", icon: DollarSign };
      case "FUNDED":
        return { label: "Funded", color: "bg-green-100 text-green-800", icon: DollarSign };
      case "COMPLETED":
        return { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle };
      case "CANCELLED":
        return { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle };
      case "DISPUTED":
        return { label: "Disputed", color: "bg-red-100 text-red-800", icon: AlertCircle };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800", icon: Clock };
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction Not Found</h1>
          <p className="text-gray-500 mb-6">{error || "This transaction doesn't exist or you don't have access."}</p>
          <Link href="/dashboard/transactions" className="btn-gold px-6 py-3 inline-block">
            Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transaction.status);
  const StatusIcon = statusInfo.icon;
  const isCreator = user?.id === transaction.creator.id;
  const myRole = isCreator ? transaction.creatorRole : (transaction.creatorRole === "buyer" ? "seller" : "buyer");
  const otherParty = isCreator
    ? (transaction.counterparty || { firstName: transaction.counterpartyName.split(' ')[0], lastName: transaction.counterpartyName.split(' ')[1] || '', email: transaction.counterpartyEmail })
    : transaction.creator;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[var(--black)] z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
              { label: "Transactions", icon: FileText, href: "/dashboard/transactions", active: true },
              { label: "New Transaction", icon: PlusCircle, href: "/dashboard/new-transaction" },
              { label: "Settings", icon: Settings, href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active ? "bg-[var(--gold)] text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
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
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700">
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/dashboard/transactions" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-bold text-gray-900 truncate">{transaction.title}</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${statusInfo.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Transaction Header Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                <p className="font-mono text-lg font-semibold text-gray-900">{transaction.transactionId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className="text-3xl font-bold text-gray-900">${transaction.amount.toLocaleString()} <span className="text-lg font-normal text-gray-500">{transaction.currency}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Your Role</p>
                <p className="font-medium text-gray-900 capitalize">{myRole}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Inspection Period</p>
                <p className="font-medium text-gray-900">{transaction.inspectionDays} Days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">{new Date(transaction.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Other Party</p>
                <p className="font-medium text-gray-900">{otherParty.firstName} {otherParty.lastName}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: "details", label: "Details", icon: FileText },
              { key: "chat", label: "Messages", icon: MessageSquare },
              { key: "documents", label: "Documents", icon: File },
              { key: "timeline", label: "Timeline", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key ? "bg-[var(--gold)] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[var(--gold)]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600">{transaction.description}</p>
                  {transaction.terms && (
                    <>
                      <h4 className="font-medium text-gray-900 mt-4 mb-2">Additional Terms</h4>
                      <p className="text-gray-600">{transaction.terms}</p>
                    </>
                  )}
                </div>

                {/* Images */}
                {transaction.images.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Property Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {transaction.images.map((img, index) => (
                        <div
                          key={img.id}
                          className="aspect-video rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage(img.url)}
                        >
                          <img src={img.url} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Parties */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Parties</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{transaction.creator.firstName} {transaction.creator.lastName}</p>
                        <p className="text-sm text-gray-500 capitalize">{transaction.creatorRole} {isCreator && "(You)"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {transaction.counterparty ? `${transaction.counterparty.firstName} ${transaction.counterparty.lastName}` : transaction.counterpartyName}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {transaction.creatorRole === "buyer" ? "seller" : "buyer"} {!isCreator && "(You)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Escrow Protected</h4>
                      <p className="text-sm text-blue-700">Funds are held securely until both parties confirm completion.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Transaction Messages</h3>
                <p className="text-sm text-gray-500">All messages are monitored by HoldVera for your protection.</p>
              </div>

              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {transaction.messages.length > 0 ? (
                  transaction.messages.map((msg) => {
                    // System message
                    if (msg.isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <div className="max-w-[85%] bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-semibold text-blue-600">HOLDVERA</span>
                            </div>
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              {msg.content.split('\n').map((line, i) => {
                                if (line.startsWith('**') && line.endsWith('**')) {
                                  return <p key={i} className="font-semibold text-gray-900 mt-2">{line.replace(/\*\*/g, '')}</p>;
                                }
                                if (line.startsWith('- ')) {
                                  return <p key={i} className="ml-3">{line}</p>;
                                }
                                return <p key={i}>{line}</p>;
                              })}
                            </div>
                            <p className="text-xs text-blue-400 mt-2">
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    // Regular message
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] ${isMe ? "bg-[var(--gold)] text-white" : "bg-gray-100 text-gray-900"} rounded-2xl px-4 py-3`}>
                          {!isMe && msg.sender && <p className="text-xs font-medium mb-1 opacity-70">{msg.sender.firstName}</p>}
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-white/70" : "text-gray-500"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-2.5 bg-[var(--gold)] text-white rounded-lg hover:bg-[var(--gold-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Documents</h3>
                  <p className="text-sm text-gray-500">Documents uploaded by parties are only visible to admin for security.</p>
                </div>
                <label className={`flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-white rounded-lg cursor-pointer hover:bg-[var(--gold-dark)] ${uploadingDoc ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploadingDoc ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Document
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleDocumentUpload}
                    disabled={uploadingDoc}
                    className="hidden"
                  />
                </label>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}`}>
                          {doc.type === 'pdf' ? (
                            <FileText className={`w-5 h-5 text-red-600`} />
                          ) : (
                            <ImageIcon className={`w-5 h-5 text-blue-600`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploadedAt).toLocaleDateString()} · {doc.uploadedByRole === 'ADMIN' ? 'Admin' : 'Party'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {doc.visibility === 'ADMIN_ONLY' && 'Admin Only'}
                          {doc.visibility === 'BOTH_PARTIES' && 'Both Parties'}
                          {doc.visibility === 'ALL' && 'Everyone'}
                        </span>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-[var(--gold)] transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <File className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No documents yet.</p>
                  <p className="text-sm text-gray-400">Upload PDFs or images related to this transaction.</p>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Transaction Timeline</h3>
              {transaction.timeline.length > 0 ? (
                <div className="space-y-6">
                  {transaction.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[var(--gold)]" />
                        {index < transaction.timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-2" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="font-medium text-gray-900">{event.event.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-500">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(event.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No timeline events yet.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Property" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={() => setSelectedImage(null)}>
            <XCircle className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
