import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | HoldVera",
  description: "HoldVera Administration Portal",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
