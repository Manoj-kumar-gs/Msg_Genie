import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import Navbar from "@/components/Navbar";
import SessionWrapper from "./providers/SessionWrapper";
import Footer from "@/components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MsgGenie — Connect & Get Support Instantly",
  description: "MsgGenie helps creators receive messages, feedback, and tips effortlessly with a secure dashboard and Razorpay integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Winky+Rough:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[100vw]`}
      >
        <SessionWrapper>
          <div>
          </div>
          <div >
            <Navbar />
            <ToastContainer position="bottom-right" theme="dark" />
            <div className="min-h-[80vh] w-full">
              {children}
            </div>
            <Footer />
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
