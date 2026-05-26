"use client";

import { useVelvetStore } from "@/store/useVelvetStore";
import { AgeConfirmation } from "@/components/ui/AgeConfirmation";
import { Navigation } from "@/components/ui/Navigation";
import { Toast } from "@/components/ui/Toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ageConfirmed = useVelvetStore((state) => state.ageConfirmed);
  const setAgeConfirmed = useVelvetStore((state) => state.setAgeConfirmed);

  return (
    <html lang="en">
      <head>
        <title>Premium Social Discovery</title>
        <meta name="description" content="Verified Connections. Premium Experiences." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>V</text></svg>" />
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
