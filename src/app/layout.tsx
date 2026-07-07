import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Smart Bharat - AI-Powered Civic Companion",
  description: "Your intelligent AI companion for government services, issue reporting, and personalized civic support.",
};

import GlobalChatWidget from "@/components/chat/GlobalChatWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <GlobalChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
