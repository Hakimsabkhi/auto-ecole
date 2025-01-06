import type { Metadata } from "next";
import SessionProviderWrapper from "@/components/compsession/SessionProviderWrapper";
import "./globals.css";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

export const metadata: Metadata = {
  title: "AutoEcole",
  description: "AutoEcole to company autocar",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body
      >
         <SessionProviderWrapper session={session}>
        {children}
        </SessionProviderWrapper>
      </body>
      
    </html>
  );
}
