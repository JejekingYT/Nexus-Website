import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

export const metadata: Metadata = {
  title: "Nexus",
  description: "Nexus Community Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <AnimatedBackground />

        <div className="relative z-10">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>

      </body>
    </html>
  );
}