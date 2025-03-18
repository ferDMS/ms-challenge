import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/app/providers";
import Header from "@/components/general/Header"; // Import the Header component

export const metadata: Metadata = {
  title: "WorkAble AI",
  description: "Empowering coaches, enabling careers.",
  icons: {
    icon: "https://placehold.co/40x40",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header /> {/* Add the Header component here */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
