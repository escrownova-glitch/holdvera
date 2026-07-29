"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Send,
  Inbox,
  FileText,
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  X,
  User,
  ArrowLeft,
  Plus,
  Eye,
  Copy,
  Trash2,
  RefreshCw,
  Users,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

interface SentEmail {
  id: string;
  fromEmail: string;
  toEmail: string;
  toName: string | null;
  subject: string;
  body: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AdminEmailPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"compose" | "sent" | "templates">("compose");
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // Compose form
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fromEmail, setFromEmail] = useState("support@holdvera.site");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Preview
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedUser = localStorage.getItem("holdvera_user");
    const token = localStorage.getItem("holdvera_token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "CEO" && userData.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }

    setUser(userData);
    await fetchData(token);
    setLoading(false);
  };

  const fetchData = async (token: string) => {
    try {
      const [templatesRes, emailsRes] = await Promise.all([
        fetch("/api/admin/emails?type=templates", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/emails", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const templatesData = await templatesRes.json();
      const emailsData = await emailsRes.json();

      setTemplates(templatesData.templates || []);
      setSentEmails(emailsData.emails || []);
    } catch (error) {
      console.error("Failed to fetch email data:", error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setMessage(template.body);
    }
  };

  const handleSendEmail = async () => {
    if (!toEmail || !subject || !message) {
      alert("Please fill in all required fields");
      return;
    }

    setSending(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem("holdvera_token");
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toEmail,
          toName,
          subject,
          message,
          fromEmail,
          templateId: selectedTemplate || undefined,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setToEmail("");
        setToName("");
        setSubject("");
        setMessage("");
        setSelectedTemplate("");
        await fetchData(token!);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send email");
      }
    } catch {
      alert("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("holdvera_user");
    localStorage.removeItem("holdvera_token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[var(--gold)] border-t-transparent rounded-full" />
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", icon: FileText, href: "/admin" },
    { label: "Users", icon: Users, href: "/admin?tab=users" },
    { label: "Emails", icon: Mail, href: "/admin/emails", active: true },
    { label: "Settings", icon: Settings, href: "/admin?tab=settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-40">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-700">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="HoldVera" width={40} height={40} />
              <span className="font-serif text-xl font-bold">
                <span className="text-white">HOLD</span>
                <span className="gold-text">VERA</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active
                    ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-500 text-sm truncate">{user?.role}</p>
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
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 bg-gray-800 border-b border-gray-700 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-white">Email Center</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex gap-2">
            {[
              { key: "compose", label: "Compose Email", icon: Send },
              { key: "sent", label: "Sent Emails", icon: CheckCircle },
              { key: "templates", label: "Templates", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[var(--gold)] text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="p-6">
          {/* Compose Tab */}
          {activeTab === "compose" && (
            <div className="max-w-4xl">
              {success && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-400">Email sent successfully!</p>
                </div>
              )}

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-5 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[var(--gold)]" />
                    Compose New Email
                  </h2>
                </div>

                <div className="p-5 space-y-5">
                  {/* From */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">From</label>
                    <select
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    >
                      <option value="support@holdvera.site">HoldVera Support &lt;support@holdvera.site&gt;</option>
                      <option value="ceo@holdvera.site">Dennis Miller (CEO) &lt;ceo@holdvera.site&gt;</option>
                    </select>
                  </div>

                  {/* To */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">To (Email) *</label>
                      <input
                        type="email"
                        value={toEmail}
                        onChange={(e) => setToEmail(e.target.value)}
                        placeholder="recipient@example.com"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Recipient Name</label>
                      <input
                        type="text"
                        value={toName}
                        onChange={(e) => setToName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                      />
                    </div>
                  </div>

                  {/* Template */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Use Template (Optional)</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateSelect(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    >
                      <option value="">-- Select a template --</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name.replace(/_/g, ' ').toUpperCase()} ({template.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Subject *</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Email subject line"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Message *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here...

Use {{firstName}} for recipient's first name
Use {{transactionTitle}} for transaction title
Use {{amount}} for amount
Use {{customMessage}} for custom content"
                      rows={12}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      The message will be wrapped in HoldVera's branded email template.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => setShowPreview(true)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={handleSendEmail}
                      disabled={sending || !toEmail || !subject || !message}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sent Emails Tab */}
          {activeTab === "sent" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-5 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Sent Emails</h2>
                <span className="text-gray-400 text-sm">{sentEmails.length} emails</span>
              </div>

              {sentEmails.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {sentEmails.map((email) => (
                    <div key={email.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium truncate">{email.toEmail}</span>
                            {email.toName && (
                              <span className="text-gray-500 text-sm">({email.toName})</span>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm font-medium truncate">{email.subject}</p>
                          <p className="text-gray-500 text-sm truncate mt-1">{email.body.slice(0, 100)}...</p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            email.status === "SENT" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                          }`}>
                            {email.status}
                          </span>
                          <p className="text-gray-500 text-xs mt-2">
                            {email.sentAt ? new Date(email.sentAt).toLocaleString() : new Date(email.createdAt).toLocaleString()}
                          </p>
                          <p className="text-gray-600 text-xs">From: {email.fromEmail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-gray-400 font-medium mb-2">No emails sent yet</h3>
                  <p className="text-gray-500 text-sm">Compose your first email to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-[var(--gold)]/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{template.name.replace(/_/g, ' ').toUpperCase()}</h3>
                      <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">{template.category}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleTemplateSelect(template.id);
                        setActiveTab("compose");
                      }}
                      className="text-[var(--gold)] hover:underline text-sm font-medium"
                    >
                      Use Template
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Subject: {template.subject}</p>
                  <pre className="text-gray-500 text-xs bg-gray-700/50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {template.body.slice(0, 200)}...
                  </pre>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900">Email Preview</h3>
              <button onClick={() => setShowPreview(false)} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-0 overflow-y-auto max-h-[calc(90vh-60px)]">
              {/* Preview the rendered email */}
              <div className="bg-gray-100 p-4">
                <div className="bg-white max-w-xl mx-auto shadow-lg">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-center">
                    <h1 className="text-2xl font-bold">
                      <span className="text-amber-400">HOLD</span>
                      <span className="text-white">VERA</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Trust. Secure. Delivered.</p>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">To: {toEmail || "recipient@example.com"}</p>
                    <p className="text-sm text-gray-500 mb-4">Subject: {subject || "Email Subject"}</p>
                    <hr className="mb-4" />
                    {message.split('\n').map((line, i) => (
                      <p key={i} className="text-gray-700 mb-2">{line || <br />}</p>
                    ))}
                  </div>
                  {/* Footer */}
                  <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t">
                    <p><strong>HoldVera</strong></p>
                    <p>Arlington, Virginia, USA</p>
                    <p className="mt-2">© 2026 HoldVera. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
