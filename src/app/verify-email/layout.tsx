import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | HoldVera",
  description: "Verify your email address to continue",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
