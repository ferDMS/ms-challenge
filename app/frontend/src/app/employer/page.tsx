"use client";

import {
  Title1,
  Subtitle1,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    ...shorthands.padding("2rem"),
  },
  title: {
    marginBottom: "1rem",
  },
  subtitle: {
    marginBottom: "2rem",
    color: "#555",
  },
});

export default function EmployerPage() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Title1 className={styles.title}>Employer Dashboard</Title1>
      <Subtitle1 className={styles.subtitle}>
        Welcome to the Employer Portal
      </Subtitle1>
      <p>This is the employer area with the main layout applied.</p>
    </div>
  );
}
