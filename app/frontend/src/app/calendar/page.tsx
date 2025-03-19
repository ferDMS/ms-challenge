"use client";

import { Title2, makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  page: {
    padding: "20px",
  },
  header: {
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  calendarContainer: {
    width: "100%",
    height: "calc(100vh - 120px)", // Adjust height to be smaller than full page
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "4px",
    boxShadow: tokens.shadow4,
  },
  calendarFrame: {
    width: "100%",
    height: "100%",
    border: "none",
  },
});

export default function CalendarPage() {
  const styles = useStyles();
  const calendarUrl =
    "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/1cc303ef-0fef-4541-b1a7-db88b33804bf/cid-FE6BA55B4A319984/index.html?isWorkPaneExpanded=false&mode=edit";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Title2>Calendar</Title2>
      </div>
      <div className={styles.calendarContainer}>
        <iframe
          src={calendarUrl}
          title="Outlook Calendar"
          className={styles.calendarFrame}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
        ></iframe>
      </div>
    </div>
  );
}
