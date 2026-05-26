"use client";

import { useVelvetStore } from "@/store/useVelvetStore";
import { AgeConfirmation } from "@/components/ui/AgeConfirmation";
import { Navigation } from "@/components/ui/Navigation";
import { Toast } from "@/components/ui/Toast";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ageConfirmed = useVelvetStore((state) => state.ageConfirmed);
  const setAgeConfirmed = useVelvetStore((state) => state.setAgeConfirmed);

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <title>Premium Social Discovery</title>
        <meta name="description" content="Verified Connections. Premium Experiences." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/logo/Velvet.png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-velvet-black">
        {!ageConfirmed ? (
          <AgeConfirmation onConfirm={() => setAgeConfirmed(true)} />
        ) : (
          <>
            <Navigation />
            <main className="flex-1 flex flex-col pt-14 pb-[68px] md:pb-0 md:pl-[72px]">
              {children}
            </main>
            <Toast />
          </>
        )}
      </body>
    </html>
  );
}
