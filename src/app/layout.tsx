import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar"; // Import Sidebar
import 'katex/dist/katex.min.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KPK Boards - Class 11 Notes",
  description: "Complete study notes for KPK Board Class 11 students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <div className="flex">
          {/* <Sidebar /> */}
          <main className="flex-1 min-h-screen bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}