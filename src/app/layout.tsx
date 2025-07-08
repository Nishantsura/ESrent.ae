import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import cn from "classnames";
import Footer from "@/components/Footer";
// import CrispChat from "@/components/CrispChat";
import { CarHireProvider } from "@/contexts/CarHireContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Autoluxe - Luxury Car Rental in Dubai",
  description: "Find the best cars for rent in Dubai. Explore our wide range of luxury vehicles and book your dream car today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-clash antialiased",
          "selection:bg-primary selection:text-primary-foreground",
          "flex flex-col",
          inter.variable,
          instrumentSans.variable,
          "font-sans"
        )}
      >
        <CarHireProvider>
          <main className="flex-1">
            {children}
          </main>
          {/* <CrispChat /> */}
          <Footer />
        </CarHireProvider>
      </body>
    </html>
  );
}
