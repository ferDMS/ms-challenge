"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

interface ThemeContextType {
  isDarkMode: boolean; // Keeping this for API compatibility
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Always set isDarkMode to false
  const isDarkMode = false;

  // Always use the light theme
  const theme = webLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      <FluentProvider theme={theme}>{children}</FluentProvider>
    </ThemeContext.Provider>
  );
};
