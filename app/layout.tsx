import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Call Scorer - AI-Powered Call Management",
  description: "Manage and score customer calls with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="ml-20 flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
