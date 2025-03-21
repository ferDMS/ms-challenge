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
  makeStyles,
  tokens,
  Spinner,
  Link,
  InfoLabel,
  Tag,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";
import {
  ArrowLeft24Filled,
  EditRegular,
  PersonRegular,
  CalendarMonthRegular,
  PhoneRegular,
  BuildingRegular,
  PeopleTeamRegular,
  BriefcaseRegular,
  DocumentTextRegular,
  CompassNorthwestRegular,
  LocationRegular,
  BookInformationRegular,
  AddRegular,
} from "@fluentui/react-icons";
import {
  getParticipant,
  getParticipantSessions,
  getParticipantJobMatches,
} from "@/api/participants";
import {
  Participant,
  EmploymentCycleStage,
  JobMatchStatus,
  JobMatch,
  GoalStatus,
  getDisplayValue,
} from "@/types/participants";
import { Session } from "@/types/sessions";

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
  cardContent: {
    padding: "20px",
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
  tableSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px",
    marginBottom: "15px",
  },
  tableContainer: {
    marginTop: "16px",
    overflowX: "auto",
  },
  sectionDivider: {
    margin: "32px 0",
  },
  // Status styles
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  initial: {
    backgroundColor: tokens.colorPaletteBlueBackground2,
    color: tokens.colorPaletteBlueForeground2,
  },
  employed: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  training: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
    color: tokens.colorPaletteBerryForeground2,
  },
  "job-search": {
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
    color: tokens.colorPaletteMarigoldForeground2,
  },
  "interview-preparation": {
    backgroundColor: tokens.colorPaletteLilacBackground2,
    color: tokens.colorPaletteLilacForeground2,
  },
  inactive: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  emptyState: {
    marginTop: "40px",
    textAlign: "center",
  },
  // Job match status styles
  matchStatusBadge: {
    padding: "3px 6px",
    borderRadius: "4px",
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
  },
  considering: {
    backgroundColor: tokens.colorPaletteLavenderBackground2,
    color: tokens.colorPaletteLavenderForeground2,
  },
  suggested: {
    backgroundColor: tokens.colorPaletteBeigeForeground2,
    color: tokens.colorPaletteBeigeBackground2,
  },
  applied: {
    backgroundColor: tokens.colorPaletteCornflowerBackground2,
    color: tokens.colorPaletteCornflowerForeground2,
  },
  interviewing: {
    backgroundColor: tokens.colorPalettePurpleBackground2,
    color: tokens.colorPalettePurpleForeground2,
  },
  offered: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground2,
    color: tokens.colorPaletteDarkOrangeForeground2,
  },
  accepted: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  rejected: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  // Goal status styles
  goalStatusBadge: {
    padding: "3px 6px",
    borderRadius: "4px",
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
  },
  "not-started": {
    backgroundColor: tokens.colorNeutralBackground5,
    color: tokens.colorNeutralForeground3,
  },
  "in-progress": {
    backgroundColor: tokens.colorPaletteBerryBackground2,
    color: tokens.colorPaletteBerryForeground2,
  },
  completed: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  abandoned: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
});

export default function ParticipantDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const styles = useStyles();
  const router = useRouter();
  const { id: participantId } = use(params);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParticipant = async () => {
      try {
        setLoading(true);

        // Fetch participant details
        const participantData = await getParticipant(participantId);
        setParticipant(participantData);

        // Fetch related sessions
        const sessionsData = await getParticipantSessions(participantId);
        setSessions(sessionsData as Session[]);

        // Fetch job matches
        const jobMatchesData = await getParticipantJobMatches(participantId);
        setJobMatches(jobMatchesData as JobMatch[]);

        setError(null);
      } catch (err) {
        console.error("Error loading participant:", err);
        setError(
          "Could not load participant information. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadParticipant();
  }, [participantId]);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStatusBadge = (status: EmploymentCycleStage) => {
    const className = styles[status as keyof typeof styles];
    return (
      <span className={`${styles.statusBadge} ${className}`}>
        {getDisplayValue("employmentCycleStage", status)}
      </span>
    );
  };

  const renderJobMatchStatusBadge = (status: JobMatchStatus) => {
    const className = styles[status as keyof typeof styles];
    return (
      <span className={`${styles.matchStatusBadge} ${className}`}>
        {getDisplayValue("jobMatchStatus", status)}
      </span>
    );
  };

  const renderGoalStatusBadge = (status: GoalStatus) => {
    const className = styles[status as keyof typeof styles];
    return (
      <span className={`${styles.goalStatusBadge} ${className}`}>
        {getDisplayValue("goalStatus", status)}
      </span>
    );
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
        <Spinner label="Loading participant details..." />
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className={styles.container}>
        <Card>
          <Text weight="semibold">
            {error || "Could not load participant information."}
          </Text>
          <Button
            appearance="primary"
            onClick={() => router.push("/participants")}
            style={{ marginTop: "16px" }}
          >
            Return to Participants
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
            onClick={() => router.push("/participants")}
          >
            Back to Participants
          </Button>
        </div>
      </div>

      <div className={styles.header}>
        <div>
          <Title2>{participant.fullName}</Title2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {renderStatusBadge(participant.currentStatus)}
            <Badge appearance="outline">
              {getDisplayValue("disabilityType", participant.disabilityType)}
            </Badge>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button icon={<CalendarMonthRegular />}>Schedule Session</Button>
          <Button appearance="primary" icon={<EditRegular />}>
            Edit Participant
          </Button>
        </div>
      </div>

      {/* Personal Information Section */}
      <Title3>Personal Information</Title3>
      <div className={styles.grid}>
        {/* Basic Info Card */}
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Contact Information</InfoLabel>

            <div className={styles.infoItem}>
              <PersonRegular />
              <Text>
                {participant.firstName} {participant.lastName}
              </Text>
            </div>

            <div className={styles.infoItem}>
              <PhoneRegular />
              <Text>{participant.phone}</Text>
            </div>

            <div className={styles.infoItem}>
              <BookInformationRegular />
              <Text>{participant.email}</Text>
            </div>

            <div className={styles.infoItem}>
              <CalendarMonthRegular />
              <Text>Born: {formatDate(participant.dateOfBirth)}</Text>
            </div>

            <div className={styles.infoItem}>
              <DocumentTextRegular />
              <Text>
                Gender: {getDisplayValue("gender", participant.gender)}
              </Text>
            </div>

            <div className={styles.infoItem}>
              <DocumentTextRegular />
              <Text>Primary Language: {participant.primaryLanguage}</Text>
            </div>
          </div>
        </Card>

        {/* Disability & Support Card */}
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Disability & Support</InfoLabel>

            <div className={styles.infoItem}>
              <Text weight="semibold">Type: </Text>
              <Text>
                {getDisplayValue("disabilityType", participant.disabilityType)}
              </Text>
            </div>

            <InfoLabel style={{ marginTop: "16px" }}>
              Accommodations Needed
            </InfoLabel>
            <div className={styles.tagContainer}>
              {participant.accommodationsNeeded.map((accommodation, index) => (
                <Tag key={index}>{accommodation}</Tag>
              ))}
            </div>

            <div className={styles.infoItem} style={{ marginTop: "16px" }}>
              <Text weight="semibold">Transportation: </Text>
              <Text>
                {getDisplayValue(
                  "transportationStatus",
                  participant.transportationStatus
                )}
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Employment Section */}
      <Title3 style={{ marginTop: "32px" }}>Employment Information</Title3>
      <div className={styles.grid}>
        {/* Employment Details Card */}
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Employment Details</InfoLabel>

            <div className={styles.infoItem}>
              <PeopleTeamRegular />
              <div>
                <Text weight="semibold">Current Status: </Text>
                {renderStatusBadge(participant.currentStatus)}
              </div>
            </div>

            <div className={styles.infoItem}>
              <CompassNorthwestRegular />
              <div>
                <Text weight="semibold">Employment Goal: </Text>
                <Text>{participant.employmentGoal}</Text>
              </div>
            </div>

            <div className={styles.infoItem}>
              <CalendarMonthRegular />
              <div>
                <Text weight="semibold">Desired Hours: </Text>
                <Text>
                  {getDisplayValue("desiredHours", participant.desiredHours)}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences Card */}
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Preferences</InfoLabel>

            <div style={{ marginTop: "12px" }}>
              <Text weight="semibold">Preferred Locations</Text>
              <div className={styles.tagContainer}>
                {participant.preferredLocations.map((location, index) => (
                  <Tag key={index} icon={<LocationRegular />}>
                    {location}
                  </Tag>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <Text weight="semibold">Preferred Industries</Text>
              <div className={styles.tagContainer}>
                {participant.preferredIndustries.map((industry, index) => (
                  <Tag key={index} icon={<BuildingRegular />}>
                    {industry}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Skills Section */}
      <Title3 style={{ marginTop: "32px" }}>Skills</Title3>
      <div className={styles.grid}>
        {/* Technical Skills Card */}
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Technical Skills</InfoLabel>
            <div className={styles.tagContainer}>
              {participant.skills.technical.map((skill, index) => (
                <Tag key={index}>{skill}</Tag>
              ))}
            </div>
          </div>
        </Card>

        {/* Soft Skills Card */}
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Soft Skills</InfoLabel>
            <div className={styles.tagContainer}>
              {participant.skills.soft.map((skill, index) => (
                <Tag key={index}>{skill}</Tag>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Goals Section */}
      <div className={styles.tableSectionHeader}>
        <Title3>Goals</Title3>
        <Button appearance="primary" icon={<AddRegular />}>
          Add Goal
        </Button>
      </div>

      <Table aria-label="Goals table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Date Set</TableHeaderCell>
            <TableHeaderCell>Target Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participant.goals.map((goal, index) => (
            <TableRow key={index}>
              <TableCell>{goal.description}</TableCell>
              <TableCell>{formatDate(goal.dateSet)}</TableCell>
              <TableCell>{formatDate(goal.targetDate)}</TableCell>
              <TableCell>{renderGoalStatusBadge(goal.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Work History Section */}
      <div className={styles.tableSectionHeader}>
        <Title3>Work History</Title3>
        <Button appearance="primary" icon={<AddRegular />}>
          Add Work Experience
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <Table aria-label="Work history table">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Employer</TableHeaderCell>
              <TableHeaderCell>Position</TableHeaderCell>
              <TableHeaderCell>Period</TableHeaderCell>
              <TableHeaderCell>Responsibilities</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participant.workHistory.map((job, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TableCellLayout media={<BriefcaseRegular />}>
                    {job.employer}
                  </TableCellLayout>
                </TableCell>
                <TableCell>{job.position}</TableCell>
                <TableCell>
                  {formatDate(job.startDate)} -{" "}
                  {job.endDate ? formatDate(job.endDate) : "Present"}
                </TableCell>
                <TableCell>
                  <ul style={{ margin: 0, paddingLeft: "16px" }}>
                    {job.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex}>{resp}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Divider className={styles.sectionDivider} />

      {/* Job Matches Section */}
      <div className={styles.tableSectionHeader}>
        <Title3>Job Matches</Title3>
        <Button appearance="primary" icon={<AddRegular />}>
          Find Jobs
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <Table aria-label="Job matches table">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Job Title</TableHeaderCell>
              <TableHeaderCell>Employer</TableHeaderCell>
              <TableHeaderCell>Match Score</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(jobMatches.length > 0 ? jobMatches : participant.jobMatches).map(
              (job, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link href={`/jobs/${job.jobId}`}>{job.title}</Link>
                  </TableCell>
                  <TableCell>{job.employer}</TableCell>
                  <TableCell>
                    <Badge
                      appearance="filled"
                      color={
                        job.matchScore > 80
                          ? "success"
                          : job.matchScore > 60
                          ? "warning"
                          : "informative"
                      }
                    >
                      {job.matchScore}%
                    </Badge>
                  </TableCell>
                  <TableCell>{renderJobMatchStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <Button
                      appearance="subtle"
                      icon={<DocumentTextRegular />}
                      onClick={() => router.push(`/jobs/${job.jobId}`)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      {/* Recent Sessions Section */}
      <div className={styles.tableSectionHeader}>
        <Title3>Recent Sessions</Title3>
        <Button
          appearance="primary"
          icon={<CalendarMonthRegular />}
          onClick={() =>
            router.push(`/sessions/new?participantId=${participantId}`)
          }
        >
          Schedule Session
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <Table aria-label="Recent sessions table">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Coach</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(session.date)}</TableCell>
                <TableCell>
                  <Link href={`/sessions/${session.id}`}>{session.title}</Link>
                </TableCell>
                <TableCell>{session.type}</TableCell>
                <TableCell>
                  <Badge
                    appearance="filled"
                    color={
                      session.status === "completed"
                        ? "success"
                        : session.status === "scheduled"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell>{session.coachName}</TableCell>
                <TableCell>
                  <Button
                    appearance="subtle"
                    icon={<DocumentTextRegular />}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
