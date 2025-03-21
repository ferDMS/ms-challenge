"use client";

import { useEffect, useState } from "react";
import {
  makeStyles,
  tokens,
  Title2,
  Text,
  Combobox,
  Option,
  Spinner,
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout,
  Link,
  Field,
  Button,
  Tag,
  Avatar,
} from "@fluentui/react-components";
import { useRouter } from "next/navigation";
import { getParticipants } from "@/api/participants";
import {
  getJobSuggestionsForParticipant,
  createSuggestedJobMatch,
} from "@/api/job-matches";
import { ParticipantPreview } from "@/types/participants";
import { JobSuggestion } from "@/types/job-matches";
import {
  ArrowRightRegular,
  StarRegular,
  DocumentBulletListRegular,
  BuildingRegular,
  LocationRegular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  selectionArea: {
    marginBottom: "32px",
  },
  comboboxContainer: {
    maxWidth: "500px",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  table: {
    marginTop: "16px",
  },
  scoreCell: {
    textAlign: "center",
  },
  scoreBadge: {
    display: "inline-flex",
    fontWeight: tokens.fontWeightSemibold,
    padding: "4px 8px",
    borderRadius: "16px",
    fontSize: tokens.fontSizeBase300,
  },
  highScore: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  mediumScore: {
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
    color: tokens.colorPaletteMarigoldForeground2,
  },
  lowScore: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
    color: tokens.colorPaletteBerryForeground2,
  },
  reasonsList: {
    margin: "0",
    padding: "0 0 0 16px",
  },
  reasonItem: {
    marginBottom: "4px",
  },
  categoriesContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "8px",
  },
  jobTypeTag: {
    backgroundColor: tokens.colorPaletteLavenderBackground2,
    color: tokens.colorPaletteLavenderForeground2,
  },
  noResults: {
    textAlign: "center",
    padding: "32px",
    color: tokens.colorNeutralForeground3,
  },
  reasoningTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "8px",
  },
  participantInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
  },
  actionsContainer: {
    display: "flex",
    gap: "8px",
  },
  jobTitleContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  cardAction: {
    marginTop: "16px",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 0",
  },
});

export default function JobSuggestions() {
  const styles = useStyles();
  const router = useRouter();

  // States
  const [participants, setParticipants] = useState<ParticipantPreview[]>([]);
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantPreview | null>(null);
  const [jobSuggestions, setJobSuggestions] = useState<JobSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [savingJobs, setSavingJobs] = useState<Record<string, boolean>>({});

  // Fetch participants when component mounts
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setLoadingParticipants(true);
        const data = await getParticipants();
        setParticipants(data);
      } catch (error) {
        console.error("Error loading participants:", error);
      } finally {
        setLoadingParticipants(false);
      }
    };

    loadParticipants();
  }, []);

  // Handle participant selection
  const handleParticipantSelect = async (
    _: unknown,
    data: { selectedOptions: string[] }
  ) => {
    if (!data.selectedOptions.length) return;

    const participantId = data.selectedOptions[0];
    const participant = participants.find((p) => p.id === participantId);

    if (participant) {
      setSelectedParticipant(participant);

      try {
        setLoading(true);
        setJobSuggestions([]);

        // Fetch job suggestions for selected participant
        const suggestions = await getJobSuggestionsForParticipant(
          participantId
        );
        // Use double casting to safely convert types when we know the structure matches
        setJobSuggestions(suggestions as unknown as JobSuggestion[]);
      } catch (error) {
        console.error("Error fetching job suggestions:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle creating a job match suggestion
  const handleCreateJobMatch = async (jobId: string) => {
    if (!selectedParticipant) return;

    try {
      setSavingJobs((prev) => ({ ...prev, [jobId]: true }));
      await createSuggestedJobMatch(selectedParticipant.id, jobId);

      // Navigate to participant detail page to see the match
      router.push(`/participants/${selectedParticipant.id}`);
    } catch (error) {
      console.error("Error creating job match:", error);
      setSavingJobs((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  // Function to get score badge color based on score
  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return styles.highScore;
    if (score >= 60) return styles.mediumScore;
    return styles.lowScore;
  };

  // Render category name more readable
  const formatCategory = (category: string) => {
    switch (category) {
      case "supportiveEnvironment":
        return "Supportive Environment";
      case "employmentType":
        return "Employment Type";
      case "accessibilityFeatures":
        return "Accessibility";
      case "availableAccommodations":
        return "Accommodations";
      case "employmentGoal":
        return "Career Goals";
      case "transportationAccess":
        return "Transportation";
      case "workHistory":
        return "Experience";
      case "hoursPerWeek":
        return "Hours";
      case "schedule":
        return "Schedule";
      case "language":
        return "Language";
      case "location":
        return "Location";
      case "industry":
        return "Industry";
      case "skills":
        return "Skills";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title2>Job Suggestions</Title2>
        <Text>
          Find the best job matches for participants based on their profile
          information
        </Text>
      </div>

      {/* Participant selection */}
      <div className={styles.selectionArea}>
        <Card>
          <div style={{ padding: "16px" }}>
            <Field label="Select a participant to see job suggestions">
              <div className={styles.comboboxContainer}>
                <Combobox
                  placeholder="Choose a participant"
                  value={selectedParticipant?.fullName || ""}
                  onOptionSelect={handleParticipantSelect}
                  disabled={loadingParticipants}
                >
                  {participants.map((participant) => (
                    <Option key={participant.id} value={participant.id}>
                      {participant.fullName}
                    </Option>
                  ))}
                </Combobox>
              </div>
            </Field>

            {selectedParticipant && (
              <div className={styles.participantInfo}>
                <Avatar
                  name={selectedParticipant.fullName}
                  size={28}
                  color="colorful"
                />
                <Text>
                  <Link href={`/participants/${selectedParticipant.id}`}>
                    {selectedParticipant.fullName}
                  </Link>{" "}
                  • {selectedParticipant.employmentGoal}
                </Text>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Loading state */}
      {loading && (
        <div className={styles.spinner}>
          <Spinner label="Finding job matches..." />
        </div>
      )}

      {/* Results table */}
      {!loading && selectedParticipant && jobSuggestions.length > 0 && (
        <Table className={styles.table}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Job</TableHeaderCell>
              <TableHeaderCell>Company & Location</TableHeaderCell>
              <TableHeaderCell>Match Score</TableHeaderCell>
              <TableHeaderCell>Compatibility Reasons</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobSuggestions.map((job) => (
              <TableRow key={job.id}>
                {/* Job title and type */}
                <TableCell>
                  <div className={styles.jobTitleContainer}>
                    <TableCellLayout>
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </TableCellLayout>
                    <Tag className={styles.jobTypeTag}>
                      {job.employmentType}
                    </Tag>
                  </div>
                </TableCell>

                {/* Company and location */}
                <TableCell>
                  <TableCellLayout
                    media={<BuildingRegular />}
                    description={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginTop: "4px",
                        }}
                      >
                        <LocationRegular fontSize={12} />
                        <Text size={200}>{job.location}</Text>
                      </div>
                    }
                  >
                    {job.employer}
                  </TableCellLayout>
                </TableCell>

                {/* Match score */}
                <TableCell className={styles.scoreCell}>
                  <span
                    className={`${styles.scoreBadge} ${getScoreBadgeClass(
                      job.matchScore
                    )}`}
                  >
                    {job.matchScore}%
                  </span>
                </TableCell>

                {/* Compatibility reasons */}
                <TableCell>
                  <div className={styles.reasoningTitle}>
                    <DocumentBulletListRegular /> Top Compatibility Factors
                  </div>
                  <ul className={styles.reasonsList}>
                    {job.compatibilityElements
                      .slice(0, 3)
                      .map((element, index) => (
                        <li key={index} className={styles.reasonItem}>
                          <Text size={200}>
                            <strong>{element.factor}</strong>:{" "}
                            {element.reasoning}
                          </Text>
                        </li>
                      ))}
                  </ul>
                  <div className={styles.categoriesContainer}>
                    {Array.from(
                      new Set(job.compatibilityElements.map((e) => e.category))
                    )
                      .slice(0, 5)
                      .map((category, i) => (
                        <Tag key={i} size="small">
                          {formatCategory(category)}
                        </Tag>
                      ))}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className={styles.actionsContainer}>
                    <Button
                      icon={<StarRegular />}
                      onClick={() => handleCreateJobMatch(job.id)}
                      disabled={savingJobs[job.id]}
                    >
                      {savingJobs[job.id] ? "Saving..." : "Save Match"}
                    </Button>
                    <Button
                      icon={<ArrowRightRegular />}
                      appearance="subtle"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* No results state */}
      {!loading && selectedParticipant && jobSuggestions.length === 0 && (
        <Card>
          <div className={styles.noResults}>
            <Text>No job suggestions found for this participant.</Text>
            <div className={styles.cardAction}>
              <Button appearance="primary" onClick={() => router.push("/jobs")}>
                Browse All Jobs
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty state - no participant selected */}
      {!loading && !loadingParticipants && !selectedParticipant && (
        <div className={styles.emptyState}>
          <Text size={300}>
            Select a participant to view their job suggestions
          </Text>
        </div>
      )}
    </div>
  );
}
