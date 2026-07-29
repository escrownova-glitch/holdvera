import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Login | HoldVera",
  description: "HoldVera Agent Portal Login",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function AgentLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
