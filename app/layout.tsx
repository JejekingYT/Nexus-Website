import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/components/providers/AuthProvider";
import AnimatedBackground from "@/components/layout/AnimatedBackground";


export const metadata: Metadata = {
  title: {
    default: "Nexus",
    template: "%s | Nexus",
  },

  description:
    "Nexus is a modern community platform for Discord servers, Roblox communities, and gamers.",

  keywords: [
    "Nexus",
    "Discord",
    "Roblox",
    "Gaming Community",
    "Community Platform",
  ],

  authors: [
    {
      name: "Nexus",
    },
  ],
};


export const viewport = {
  themeColor: "#070711",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <body className="antialiased">

        <AnimatedBackground />


        <div className="relative z-10 min-h-screen">

          <AuthProvider>

            <main className="fade-in">
              {children}
            </main>

          </AuthProvider>

        </div>

      </body>

    </html>
  );
}