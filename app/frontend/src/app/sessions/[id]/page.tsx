"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Text,
  Title3,
  Badge,
  Divider,
  Button,
  Tag,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  makeStyles,
  tokens,
  Spinner,
  Link,
  TabList,
  Tab,
  InfoLabel,
} from "@fluentui/react-components";
import {
  CalendarAgenda24Regular,
  PersonNote24Regular,
  LocationFilled,
  DocumentBulletList24Regular,
  ArrowRight24Filled,
  EditRegular,
  Calendar24Regular,
  CheckmarkCircle24Filled,
  CalendarCancel24Regular,
  CalendarClock24Regular,
  Brain24Regular,
  ArrowLeft24Filled,
} from "@fluentui/react-icons";
import { Session } from "@/types/sessions";
import { getSession, generateSessionAnalysis } from "@/api/sessions";

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
    marginBottom: "20px",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
  },
  section: {
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    gap: "8px",
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
  },
  tableContainer: {
    overflowX: "auto",
    marginTop: "12px",
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
    padding: "12px",
    marginBottom: "8px",
  },
  sentimentNegative: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    borderLeft: `3px solid ${tokens.colorPaletteRedBorder1}`,
    padding: "12px",
    marginBottom: "8px",
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
  const [generating, setGenerating] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("details");

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

  const handleGenerateAnalysis = async () => {
    try {
      setGenerating(true);
      const analysis = await generateSessionAnalysis(sessionId);

      // Update the session with new analysis
      if (session) {
        setSession({
          ...session,
          aiSuggestions: analysis,
        });
      }
    } catch (err) {
      console.error("Error generating analysis:", err);
      // Handle error - could show a notification
    } finally {
      setGenerating(false);
    }
  };

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
          <Title3>{session.title}</Title3>
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

      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab id="details" value="details">
          Details
        </Tab>
        <Tab id="analysis" value="analysis">
          Analysis & Suggestions
        </Tab>
        <Tab id="progress" value="progress">
          Progress
        </Tab>
      </TabList>

      {selectedTab === "details" && (
        <>
          <div className={styles.section}>
            <Card>
              <div className={styles.grid}>
                <div>
                  <InfoLabel>Basic Information</InfoLabel>
                  <div className={styles.infoItem}>
                    <CalendarAgenda24Regular />
                    <Text>
                      {new Date(session.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </div>
                  <div className={styles.infoItem}>
                    <Text>
                      Time: {session.startTime} - {session.endTime}
                    </Text>
                  </div>
                  <div className={styles.infoItem}>
                    <LocationFilled />
                    <Text>{session.location}</Text>
                  </div>
                </div>
                <div>
                  <InfoLabel>Participant</InfoLabel>
                  <div className={styles.infoItem}>
                    <PersonNote24Regular />
                    <Link href={`/participants/${session.participantId}`}>
                      {session.participantName}
                    </Link>
                  </div>
                </div>
                <div>
                  <InfoLabel>Coach</InfoLabel>
                  <div className={styles.infoItem}>
                    <PersonNote24Regular />
                    <Link href={`/coaches/${session.coachId}`}>
                      {session.coachName}
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.section}>
            <Card>
              <InfoLabel>Session Notes</InfoLabel>
              <Text>{session.notes}</Text>
            </Card>
          </div>

          <div className={styles.grid}>
            <Card>
              <InfoLabel>Topics Covered</InfoLabel>
              <div className={styles.tagContainer}>
                {session.topics.map((topic, index) => (
                  <Tag key={index} appearance="brand">
                    <DocumentBulletList24Regular />
                    {topic}
                  </Tag>
                ))}
              </div>
            </Card>

            <Card>
              <InfoLabel>Goals</InfoLabel>
              <div className={styles.tagContainer}>
                {session.goals.map((goal, index) => (
                  <Tag key={index}>{goal}</Tag>
                ))}
              </div>
            </Card>
          </div>

          <div className={styles.section}>
            <Card>
              <InfoLabel>Next Steps</InfoLabel>
              {session.nextSteps.map((step, index) => (
                <div key={index} className={styles.infoItem}>
                  <ArrowRight24Filled />
                  <Text>{step}</Text>
                </div>
              ))}
            </Card>
          </div>
        </>
      )}

      {selectedTab === "analysis" && (
        <>
          <div className={styles.section}>
            <Card className={styles.aiCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Brain24Regular />
                  <Text weight="semibold" style={{ marginLeft: "8px" }}>
                    AI Analysis
                  </Text>
                </div>
                <Button
                  onClick={handleGenerateAnalysis}
                  disabled={generating}
                  icon={
                    generating ? <Spinner size="tiny" /> : <Brain24Regular />
                  }
                >
                  {generating ? "Generating..." : "Generate New Analysis"}
                </Button>
              </div>

              <div className={styles.grid}>
                <div>
                  <InfoLabel>Recommended Topics for Next Session</InfoLabel>
                  <div className={styles.tagContainer}>
                    {session.aiSuggestions.recommendedTopics.map(
                      (topic, index) => (
                        <Tag key={index} appearance="brand">
                          {topic}
                        </Tag>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <InfoLabel>Recommended Jobs</InfoLabel>
                  <div className={styles.tableContainer}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHeaderCell>Position</TableHeaderCell>
                          <TableHeaderCell>Match</TableHeaderCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {session.aiSuggestions.jobRecommendations?.map(
                          (job) => (
                            <TableRow key={job.id}>
                              <TableCell>
                                <Link href={`/jobs/${job.id}`}>
                                  {job.title}
                                </Link>
                                <div>
                                  <Text size={200}>{job.reason}</Text>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  appearance={
                                    job.match > 85 ? "filled" : "outline"
                                  }
                                >
                                  {job.match}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <Divider style={{ margin: "16px 0" }} />

              <InfoLabel>Sentiment Analysis</InfoLabel>
              <div>
                {session.aiSuggestions.sentimentAnalysis.positive.map(
                  (item, index) => (
                    <div
                      key={`positive-${index}`}
                      className={styles.sentimentPositive}
                    >
                      <Text>`{item}`</Text>
                    </div>
                  )
                )}

                {session.aiSuggestions.sentimentAnalysis.negative.map(
                  (item, index) => (
                    <div
                      key={`negative-${index}`}
                      className={styles.sentimentNegative}
                    >
                      <Text>`{item}`</Text>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </>
      )}

      {selectedTab === "progress" && (
        <>
          <div className={styles.section}>
            <Card>
              <InfoLabel>Completed Steps</InfoLabel>
              <div className={styles.tagContainer}>
                {session.completedSteps?.map((step, index) => (
                  <Tag key={index} appearance="brand">
                    <CheckmarkCircle24Filled />
                    {step}
                  </Tag>
                ))}
              </div>
            </Card>
          </div>

          <div className={styles.section}>
            <Card>
              <InfoLabel>Progress Notes</InfoLabel>
              <Text>{session.progressNotes}</Text>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
