"use client";

import { useRouter } from "next/navigation";
import {
  FluentProvider,
  webLightTheme,
  Button,
  Title1,
  Subtitle1,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "600px",
    textAlign: "center",
    ...shorthands.padding("2rem"),
  },
  title: {
    marginBottom: "1rem",
    fontSize: "3.5rem",
    fontWeight: "600",
    color: "#0078d4",
  },
  subtitle: {
    marginBottom: "3rem",
    fontSize: "1.5rem",
    color: "#323130",
    lineHeight: "1.5",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
    ...shorthands.margin("1rem", "0"),
  },
});

export default function LandingPage() {
  const styles = useStyles();
  const router = useRouter();

  const handleCoachLogin = () => {
    router.push("/participants");
  };

  const handleEmployerLogin = () => {
    router.push("/employer");
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Title1 className={styles.title}>WorkAble AI</Title1>
          <Subtitle1 className={styles.subtitle}>
            Empowering Job Coaches, Enabling Careers
          </Subtitle1>
          <div className={styles.buttonContainer}>
            <Button
              appearance="primary"
              size="large"
              onClick={handleCoachLogin}
            >
              Log in as Coach
            </Button>
            {/* <Button
              appearance="secondary"
              size="large"
              onClick={handleEmployerLogin}
            >
              Log in as Employer
            </Button> */}
          </div>
        </div>
      </div>
    </FluentProvider>
  );
}
