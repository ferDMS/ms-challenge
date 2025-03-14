import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/app/providers";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
