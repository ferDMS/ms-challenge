"use client";

import React, { useState } from "react";
import {
  tokens,
  makeStyles,
  Text,
  Button,
  Divider,
  mergeClasses,
} from "@fluentui/react-components";
import {
  Calendar24Regular,
  Calendar24Filled,
  People24Regular,
  People24Filled,
  PersonAdd24Regular,
  Briefcase24Regular,
  Briefcase24Filled,
  Add24Regular,
  ChevronRight24Regular,
  ChevronDown24Regular,
  Board24Regular,
  Board24Filled,
  Clock24Regular,
  AppsListDetail24Regular,
  DocumentAdd24Regular,
} from "@fluentui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const useStyles = makeStyles({
  sidebar: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    width: "250px",
    height: "calc(100vh - 48px)", // Subtract header height
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    overflow: "auto",
  },
  navSection: {
    marginBottom: "12px", // Slightly reduced margin
  },
  sectionTitle: {
    padding: "0 20px 6px", // Slightly reduced padding
    fontSize: tokens.fontSizeBase200, // Smaller font size
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "6px 20px", // Reduced vertical padding
    textDecoration: "none",
    color: tokens.colorNeutralForeground1,
    cursor: "pointer",
    borderLeft: "3px solid transparent",
    fontSize: tokens.fontSizeBase200, // Smaller font size
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  activeNavItem: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    borderLeftColor: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  icon: {
    marginRight: "10px", // Slightly reduced margin
    display: "flex",
    alignItems: "center",
    fontSize: tokens.fontSizeBase500, // Control icon size
  },
  expandButton: {
    marginLeft: "auto",
    padding: 0,
    minWidth: "auto",
  },
  navText: {
    fontSize: tokens.fontSizeBase200, // Smaller font size
  },
});

interface SectionItemProps {
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick?: () => void;
}

interface NavSection {
  title: string;
  key: string;
  icon?: React.ReactNode;
  items: {
    href: string;
    text: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
  }[];
}

export const Sidebar: React.FC = () => {
  const styles = useStyles();
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    sessions: true,
    people: true,
    jobs: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const SectionItem = ({
    href,
    icon,
    activeIcon,
    text,
    isActive,
  }: SectionItemProps) => (
    <Link href={href} passHref>
      <div
        className={mergeClasses(
          styles.navItem,
          isActive && styles.activeNavItem
        )}
      >
        <span className={styles.icon}>{isActive ? activeIcon : icon}</span>
        <Text className={styles.navText}>{text}</Text>
      </div>
    </Link>
  );

  const navSections: NavSection[] = [
    {
      title: "Sessions",
      key: "sessions",
      icon: <Calendar24Regular />,
      items: [
        {
          href: "/calendar",
          text: "Calendar",
          icon: <Calendar24Regular />,
          activeIcon: <Calendar24Filled />,
        },
        {
          href: "/sessions",
          text: "All Sessions",
          icon: <AppsListDetail24Regular />,
          activeIcon: <AppsListDetail24Regular />,
        },
        {
          href: "/sessions/new",
          text: "Register Session",
          icon: <DocumentAdd24Regular />,
          activeIcon: <DocumentAdd24Regular />,
        },
      ],
    },
    {
      title: "People",
      key: "people",
      icon: <People24Regular />,
      items: [
        {
          href: "/people",
          text: "Participants Dashboard",
          icon: <Board24Regular />,
          activeIcon: <Board24Filled />,
        },
        {
          href: "/people/all",
          text: "All Participants",
          icon: <People24Regular />,
          activeIcon: <People24Filled />,
        },
        {
          href: "/people/new",
          text: "Register Participant",
          icon: <PersonAdd24Regular />,
          activeIcon: <PersonAdd24Regular />,
        },
      ],
    },
    {
      title: "Jobs",
      key: "jobs",
      icon: <Briefcase24Regular />,
      items: [
        {
          href: "/jobs",
          text: "Jobs Dashboard",
          icon: <Board24Regular />,
          activeIcon: <Board24Filled />,
        },
        {
          href: "/jobs/all",
          text: "All Jobs",
          icon: <Briefcase24Regular />,
          activeIcon: <Briefcase24Filled />,
        },
        {
          href: "/jobs/new",
          text: "Register Job",
          icon: <Add24Regular />,
          activeIcon: <Add24Regular />,
        },
        {
          href: "/jobs/suggestions",
          text: "Job Suggestions",
          icon: <Clock24Regular />,
          activeIcon: <Clock24Regular />,
        },
      ],
    },
  ];

  return (
    <nav className={styles.sidebar}>
      {navSections.map((section) => (
        <div key={section.key} className={styles.navSection}>
          <div
            className={styles.navItem}
            onClick={() => toggleSection(section.key)}
          >
            <span className={styles.icon}>{section.icon}</span>
            <Text weight="semibold" className={styles.navText}>
              {section.title}
            </Text>
            <Button
              className={styles.expandButton}
              appearance="transparent"
              icon={
                expandedSections[section.key] ? (
                  <ChevronDown24Regular />
                ) : (
                  <ChevronRight24Regular />
                )
              }
              aria-label={`${
                expandedSections[section.key] ? "Collapse" : "Expand"
              } ${section.title}`}
            />
          </div>

          {expandedSections[section.key] &&
            section.items.map((item) => (
              <SectionItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                activeIcon={item.activeIcon}
                text={item.text}
                isActive={pathname === item.href}
              />
            ))}

          <Divider style={{ margin: "8px 0" }} />
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
