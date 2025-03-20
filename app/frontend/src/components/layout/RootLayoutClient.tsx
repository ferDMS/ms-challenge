"use client";

import { Providers } from "@/app/providers";
import { ThemeProvider } from "@/context/ThemeContext";

import { usePathname } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ThemeProvider>
        <LayoutWrapper>{children}</LayoutWrapper>
      </ThemeProvider>
    </Providers>
  );
}
