"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Text,
  Title2,
  Title3,
  Badge,
  Divider,
  Button,
  Tag,
  makeStyles,
  tokens,
  Spinner,
  Link,
  InfoLabel,
  Avatar,
} from "@fluentui/react-components";
import {
  DocumentBulletList24Regular,
  EditRegular,
  Calendar24Regular,
  CheckmarkCircle24Filled,
  CalendarCancel24Regular,
  CalendarClock24Regular,
  ArrowLeft24Filled,
  Lightbulb24Regular,
} from "@fluentui/react-icons";
import { Session } from "@/types/sessions";
import { getSession } from "@/api/sessions";

const useStyles = makeStyles({
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  navigationContainer: {
    marginBottom: "16px",
  },
  navigationRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
  },
  section: {
    marginBottom: "36px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    marginTop: "15px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    gap: "15px",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  aiCard: {
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
    padding: "20px",
  },
  tableContainer: {
    overflowX: "auto",
    marginTop: "16px",
  },
  statusScheduled: {
    backgroundColor: tokens.colorStatusWarningBackground1,
    color: tokens.colorStatusWarningForeground1,
  },
  statusCompleted: {
    backgroundColor: tokens.colorStatusSuccessBackground1,
    color: tokens.colorStatusSuccessForeground1,
  },
  statusCancelled: {
    backgroundColor: tokens.colorStatusDangerBackground1,
    color: tokens.colorStatusDangerForeground1,
  },
  sentimentPositive: {
    backgroundColor: tokens.colorPaletteLightGreenBackground1,
    borderLeft: `3px solid ${tokens.colorPaletteGreenBorder1}`,
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "4px",
  },
  sentimentNegative: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    borderLeft: `3px solid ${tokens.colorPaletteRedBorder1}`,
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "4px",
  },
  cardContent: {
    padding: "20px",
  },
  analysisSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionDivider: {
    margin: "32px 0",
  },
  basicInfoContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  personContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    gap: "12px",
  },
  insightCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  insightCardContent: {
    padding: "20px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  yellowTag: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
    color: tokens.colorPaletteDarkOrangeForeground1,
  },
});

export default function SessionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const styles = useStyles();
  const router = useRouter();
  const { id: sessionId } = use(params);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const data = await getSession(sessionId);
        setSession(data);
        setError(null);
      } catch (err) {
        console.error("Error loading session:", err);
        setError("Could not load session information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge
            appearance="filled"
            className={styles.statusScheduled}
            icon={<CalendarClock24Regular />}
          >
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge
            appearance="filled"
            className={styles.statusCompleted}
            icon={<CheckmarkCircle24Filled />}
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            appearance="filled"
            className={styles.statusCancelled}
            icon={<CalendarCancel24Regular />}
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSessionTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      initial: "Initial Session",
      "follow-up": "Follow-up",
      assessment: "Assessment",
      training: "Training",
      "job-matching": "Job Search",
    };

    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Spinner label="Loading session details..." />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className={styles.container}>
        <Card>
          <Text weight="semibold">
            {error || "Could not load session information."}
          </Text>
          <Button
            appearance="primary"
            onClick={() => router.push("/sessions")}
            style={{ marginTop: "16px" }}
          >
            Return to Sessions
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navigation area with back button */}
      <div className={styles.navigationContainer}>
        <div className={styles.navigationRow}>
          <Button
            icon={<ArrowLeft24Filled />}
            appearance="subtle"
            onClick={() => router.push("/sessions")}
          >
            Back to Sessions
          </Button>
        </div>
      </div>

      <div className={styles.header}>
        <div>
          <Title2>{session.title}</Title2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {getStatusBadge(session.status)}
            <Badge appearance="outline">
              {getSessionTypeLabel(session.type)}
            </Badge>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button icon={<Calendar24Regular />}>Schedule Follow-up</Button>
          <Button icon={<EditRegular />} appearance="primary">
            Edit Session
          </Button>
        </div>
      </div>

      {/* Session Details Section */}
      <Title3>Details</Title3>
      <div className={styles.grid}>
        {/* Basic Information Card */}
        <Card>
          <div className={styles.cardContent}>
            <div className={styles.basicInfoContainer}>
              {/* Date and Time Section */}
              <InfoLabel weight="semibold">Date</InfoLabel>
              <div className={styles.infoItem}>
                <Text style={{ marginTop: "12px", lineHeight: "1.5" }}>
                  {new Date(session.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  , {session.startTime} - {session.endTime}
                </Text>
              </div>

              {/* People Section */}
              <InfoLabel weight="semibold">Coach</InfoLabel>
              <div className={styles.infoItem}>
                <div
                  style={{ marginTop: "12px", lineHeight: "1.5" }}
                  className={styles.personContainer}
                >
                  <Avatar name={session.coachName} size={28} color="colorful" />
                  <div>
                    <Link href={`/coaches/${session.coachId}`}>
                      {session.coachName}
                    </Link>
                  </div>
                </div>
              </div>

              <InfoLabel weight="semibold">Participant</InfoLabel>
              <div className={styles.infoItem}>
                <div
                  style={{ marginTop: "12px", lineHeight: "1.5" }}
                  className={styles.personContainer}
                >
                  <Avatar
                    name={session.participantName}
                    size={28}
                    color="colorful"
                  />
                  <div>
                    <Link href={`/participants/${session.participantId}`}>
                      {session.participantName}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <InfoLabel weight="semibold">Location</InfoLabel>
              <div className={styles.infoItem}>
                <Text style={{ marginTop: "12px", lineHeight: "1.5" }}>
                  {session.location}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Session Notes Card */}
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Session Notes</InfoLabel>
            <div className={styles.infoItem}>
              <Text style={{ marginTop: "12px", lineHeight: "1.5" }}>
                {session.notes}
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Topics and Goals */}
      <div className={styles.grid} style={{ marginTop: "16px" }}>
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Topics Covered</InfoLabel>
            <div className={styles.tagContainer}>
              {session.topics.map((topic, index) => (
                <Tag key={index} appearance="brand">
                  <DocumentBulletList24Regular />
                  {topic}
                </Tag>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Goals</InfoLabel>
            <div className={styles.tagContainer}>
              {session.goals.map((goal, index) => (
                <Tag key={index}>{goal}</Tag>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Divider className={styles.sectionDivider} />

      {/* Insights Section */}
      <Title3>Insights</Title3>
      {session.status !== "completed" ? (
        <div className={styles.section}>
          <Text
            size={200}
            style={{
              display: "block",
              marginTop: "8px",
              marginBottom: "16px",
              color: tokens.colorNeutralForeground3,
              fontStyle: "italic",
            }}
          >
            Insights will be available when this session is marked as completed.
          </Text>
        </div>
      ) : (
        <>
          {/* First row: Positive and Negative Sentiment Analysis */}
          <div className={styles.grid}>
            {/* Positive Sentiment Analysis Card */}
            <Card className={styles.insightCard}>
              <div className={styles.insightCardContent}>
                <InfoLabel weight="semibold">Positive Observations</InfoLabel>
                <div style={{ marginTop: "16px", flex: 1 }}>
                  {session.aiSuggestions.sentimentAnalysis.positive.length >
                  0 ? (
                    session.aiSuggestions.sentimentAnalysis.positive.map(
                      (item, index) => (
                        <div
                          key={`positive-${index}`}
                          className={styles.sentimentPositive}
                        >
                          <Text>{item}</Text>
                        </div>
                      )
                    )
                  ) : (
                    <Text
                      size={200}
                      style={{
                        fontStyle: `italic`,
                        color: tokens.colorNeutralForeground3,
                      }}
                    >
                      No positive observations recorded for this session.
                    </Text>
                  )}
                </div>
              </div>
            </Card>

            {/* Negative Sentiment Analysis Card */}
            <Card className={styles.insightCard}>
              <div className={styles.insightCardContent}>
                <InfoLabel weight="semibold">Areas for Improvement</InfoLabel>
                <div style={{ marginTop: "16px", flex: 1 }}>
                  {session.aiSuggestions.sentimentAnalysis.negative.length >
                  0 ? (
                    session.aiSuggestions.sentimentAnalysis.negative.map(
                      (item, index) => (
                        <div
                          key={`negative-${index}`}
                          className={styles.sentimentNegative}
                        >
                          <Text>{item}</Text>
                        </div>
                      )
                    )
                  ) : (
                    <Text
                      size={200}
                      style={{
                        fontStyle: `italic`,
                        color: tokens.colorNeutralForeground3,
                      }}
                    >
                      No improvement areas identified for this session.
                    </Text>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Second row: Recommended Topics and Session Summary */}
          <div className={styles.grid} style={{ marginTop: "16px" }}>
            {/* Recommended Topics Card */}
            <Card className={styles.insightCard}>
              <div className={styles.insightCardContent}>
                <InfoLabel weight="semibold">
                  Recommended Topics for Next Session
                </InfoLabel>
                <div className={styles.tagContainer}>
                  {session.aiSuggestions.recommendedTopics.map(
                    (topic, index) => (
                      <Tag
                        key={index}
                        appearance="brand"
                        className={styles.yellowTag}
                      >
                        <Lightbulb24Regular />
                        {topic}
                      </Tag>
                    )
                  )}
                </div>
              </div>
            </Card>

            {/* Session Summary Card */}
            <Card className={styles.insightCard}>
              <div className={styles.insightCardContent}>
                <InfoLabel weight="semibold">Session Summary</InfoLabel>
                <div style={{ marginTop: "12px", flex: 1 }}>
                  <Text>
                    {session.aiSuggestions.summary ||
                      "The participant showed good progress on their job search skills. They've improved their interviewing technique but need further practice with technical questions. We discussed potential opportunities in the software development sector that match their experience level."}
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
