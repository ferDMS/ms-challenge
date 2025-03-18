import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/app/providers";
import MainLayout from "@/components/layout/MainLayout"; // Import MainLayout instead of Header
import { ThemeProvider } from "../context/ThemeContext";

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
          <ThemeProvider>
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
