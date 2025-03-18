"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  layoutContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
  },
  contentContainer: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    overflow: "auto",
  },
});

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const styles = useStyles();

  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <Sidebar />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
