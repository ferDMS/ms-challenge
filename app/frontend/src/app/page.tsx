"use client";

import {
  FluentProvider,
  webLightTheme,
  Button,
  Text,
  Title1,
  Title2,
  Card,
  tokens,
  makeStyles,
  shorthands,
  Divider,
} from "@fluentui/react-components";
import {
  RocketRegular,
  ShieldRegular,
  DocumentRegular,
  PeopleRegular,
} from "@fluentui/react-icons";

// Microsoft-style design system with clean spacing
const useStyles = makeStyles({
  container: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    ...shorthands.padding("0", "20px"),
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    ...shorthands.padding("80px", "0", "60px"),
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "600",
    lineHeight: "1.2",
    color: "#000",
    marginBottom: "20px",
    maxWidth: "600px",
    textAlign: "left",
  },
  heroText: {
    fontSize: "1.125rem",
    lineHeight: "1.5",
    color: "#505050",
    marginBottom: "32px",
    maxWidth: "600px",
    textAlign: "left",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  featureSection: {
    ...shorthands.padding("60px", "0"),
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  sectionTitle: {
    fontSize: "1.75rem",
    fontWeight: "600",
    color: "#000",
    marginBottom: "24px",
    textAlign: "left",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#fff",
    ...shorthands.borderRadius("4px"),
    boxShadow: tokens.shadow4,
  },
  cardIcon: {
    color: "#0078d4",
    fontSize: "24px",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#000",
  },
  cardText: {
    color: "#505050",
    lineHeight: "1.5",
  },
  footer: {
    ...shorthands.borderTop("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.padding("32px", "0"),
    marginTop: "40px",
  },
});

// Feature card component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.cardIcon}>{icon}</div>
      <Title2 className={styles.cardTitle}>{title}</Title2>
      <Text className={styles.cardText}>{description}</Text>
    </Card>
  );
};

export default function Home() {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Hero Section */}
          <section className={styles.hero}>
            <Title1 className={styles.heroTitle}>
              Transform Your Ideas Into Reality
            </Title1>
            <Text className={styles.heroText}>
              Leverage our cutting-edge platform to build, deploy, and scale
              your next big project with confidence.
            </Text>
            <div className={styles.buttonGroup}>
              <Button appearance="primary" size="large">
                Get Started
              </Button>
              <Button appearance="secondary" size="large">
                Learn More
              </Button>
            </div>
          </section>

          <Divider />

          {/* Feature Section */}
          <section className={styles.featureSection}>
            <Title2 className={styles.sectionTitle}>
              Enterprise-grade solutions for every need
            </Title2>
            <div className={styles.cardGrid}>
              <FeatureCard
                icon={<RocketRegular />}
                title="Fast Development"
                description="Build and deploy applications in record time with our streamlined tooling and optimized workflows."
              />
              <FeatureCard
                icon={<ShieldRegular />}
                title="Enterprise Security"
                description="Rest easy with built-in security features that keep your data protected and compliant."
              />
              <FeatureCard
                icon={<DocumentRegular />}
                title="Extensive Documentation"
                description="Access comprehensive guides and examples to help you implement every feature efficiently."
              />
              <FeatureCard
                icon={<PeopleRegular />}
                title="Community Support"
                description="Join our vibrant community of developers to share insights and get the help you need."
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-neutral-200 py-8 mt-10">
            <div className="flex justify-between items-center">
              <Text>
                © 2023 Microsoft Corporation.{" "}
                <a href="/pokemon" className="text-[#0078d4] hover:underline">
                  Go to Demo
                </a>
                .
              </Text>
            </div>
          </footer>
        </div>
      </div>
    </FluentProvider>
  );
}
