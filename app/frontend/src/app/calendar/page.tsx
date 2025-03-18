"use client";

import styles from "./calendar.module.css";

export default function CalendarPage() {
  const calendarUrl =
    "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/1cc303ef-0fef-4541-b1a7-db88b33804bf/cid-FE6BA55B4A319984/index.html?isWorkPaneExpanded=false&mode=edit";

  return (
    <div className={styles.container}>
      <iframe
        src={calendarUrl}
        title="Outlook Calendar"
        className={styles.calendarFrame}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
      ></iframe>
    </div>
  );
}
