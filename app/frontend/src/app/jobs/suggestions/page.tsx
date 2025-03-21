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
  Divider,
} from "@fluentui/react-components";
import { useRouter } from "next/navigation";
import { getParticipants, getParticipant } from "@/api/participants";
import {
  getJobSuggestionsForParticipant,
  createSuggestedJobMatch,
} from "@/api/job-matches";
import {
  ParticipantPreview,
  Participant,
  getDisplayValue,
} from "@/types/participants";
import { getJobDisplayValue } from "@/types/jobs";
import { JobSuggestion } from "@/types/job-matches";
import {
  ArrowRightRegular,
  StarRegular,
  BuildingRegular,
  LocationRegular,
  // PersonRegular,
  // BriefcaseRegular,
  // VehicleCarRegular,
  // ClockRegular,
  // TagRegular,
  // MapRegular,
  // TargetRegular,
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
  sectionDivider: {
    margin: "24px 0",
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
    width: "120px",
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
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  lowScore: {
    backgroundColor: tokens.colorPaletteSteelBackground2,
    color: tokens.colorPaletteSteelForeground2,
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
  reasoningText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
  },
  participantInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "120px",
  },
  jobInfoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: "250px",
    maxWidth: "300px",
  },
  jobDetailsContainer: {
    marginTop: "4px",
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
  participantDetailRow: {
    marginTop: "20px",
    marginBottom: "12px",
    display: "flex",
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "16px",
    borderRadius: "4px",
    boxShadow: tokens.shadow2,
  },
  detailColumn: {
    padding: "0 12px",
  },
  participantColumn: {
    width: "20%",
    padding: "0 12px",
  },
  employmentGoalColumn: {
    width: "20%",
    padding: "0 12px",
  },
  transportationColumn: {
    width: "20%",
    padding: "0 12px",
  },
  locationsColumn: {
    width: "20%",
    padding: "0 12px",
  },
  skillsColumn: {
    width: "20%",
    padding: "0 12px",
  },
  columnTitle: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  detailValue: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginBottom: "2px",
  },
  infoSection: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  reasonsColumn: {
    flex: 2,
    minWidth: "400px",
  },
  compatibilitySection: {
    marginTop: "12px",
  },
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
  jobInfoColumn: {
    width: "15%",
  },
  matchScoreColumn: {
    width: "10%",
    textAlign: "center",
  },
  compatibilityColumn: {
    width: "45%",
    minWidth: "400px",
  },
  actionsColumn: {
    width: "15%",
    minWidth: "120px",
  },
});

export default function JobSuggestions() {
  const styles = useStyles();
  const router = useRouter();

  // States
  const [participants, setParticipants] = useState<ParticipantPreview[]>([]);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [jobSuggestions, setJobSuggestions] = useState<JobSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [loadingParticipantDetails, setLoadingParticipantDetails] =
    useState(false);
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

    try {
      // First, set loading states
      setLoadingParticipantDetails(true);
      setLoading(true);
      setJobSuggestions([]);

      // Fetch full participant details
      const participantDetails = await getParticipant(participantId);
      setSelectedParticipant(participantDetails);

      setLoadingParticipantDetails(false);

      // Fetch job suggestions for selected participant
      const suggestions = await getJobSuggestionsForParticipant(participantId);
      setJobSuggestions(suggestions as unknown as JobSuggestion[]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingParticipantDetails(false);
    } finally {
      setLoading(false);
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

  // Render a status badge for the participant
  const renderStatusBadge = (status: string) => {
    let className = "";
    className = styles[status as keyof typeof styles] || "";

    return (
      <span className={`${styles.statusBadge} ${className}`}>
        {getDisplayValue("employmentCycleStage", status)}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title2>AI Job Suggestions</Title2>
      </div>

      {/* Participant selection */}
      <div className={styles.selectionArea}>
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
      </div>

      {/* Loading state for participant details */}
      {loadingParticipantDetails && (
        <div className={styles.spinner}>
          <Spinner label="Loading participant information..." />
        </div>
      )}

      {/* Selected Participant Information */}
      {selectedParticipant && !loadingParticipantDetails && (
        <>
          <div className={styles.participantDetailRow}>
            <div className={styles.participantColumn}>
              <div className={styles.columnTitle}>Participant</div>
              <div className={styles.detailValue}>
                <div className={styles.infoRow}>
                  <Avatar
                    name={selectedParticipant.fullName}
                    size={24}
                    color="colorful"
                  />
                  <Text weight="semibold">
                    <Link href={`/participants/${selectedParticipant.id}`}>
                      {selectedParticipant.fullName}
                    </Link>
                  </Text>
                </div>
                <div className={styles.infoRow}>
                  {renderStatusBadge(selectedParticipant.currentStatus)}
                </div>
              </div>
            </div>

            <div className={styles.employmentGoalColumn}>
              <div className={styles.columnTitle}>Employment Goal</div>
              <div className={styles.detailValue}>
                <Text>{selectedParticipant.employmentGoal}</Text>
              </div>
              <div className={styles.columnTitle} style={{ marginTop: "8px" }}>
                Disability Type
              </div>
              <div className={styles.detailValue}>
                <Text>
                  {getDisplayValue(
                    "disabilityType",
                    selectedParticipant.disabilityType
                  )}
                </Text>
              </div>
            </div>

            <div className={styles.detailColumn}>
              <div className={styles.columnTitle}>Transportation</div>
              <div className={styles.detailValue}>
                <Text>
                  {getDisplayValue(
                    "transportationStatus",
                    selectedParticipant.transportationStatus || "independent"
                  )}
                </Text>
              </div>
              <div className={styles.columnTitle} style={{ marginTop: "8px" }}>
                Desired Hours
              </div>
              <div className={styles.detailValue}>
                <Text>
                  {getDisplayValue(
                    "desiredHours",
                    selectedParticipant.desiredHours || "flexible"
                  )}
                </Text>
              </div>
            </div>

            <div className={styles.detailColumn}>
              <div className={styles.columnTitle}>Preferred Locations</div>
              <div className={styles.tagContainer}>
                {selectedParticipant.preferredLocations?.map(
                  (location, index) => (
                    <Tag key={index} size="small">
                      {location}
                    </Tag>
                  )
                ) || <Text size={200}>No preferences specified</Text>}
              </div>
            </div>

            <div className={styles.detailColumn}>
              <div className={styles.columnTitle}>Skills</div>
              <div className={styles.tagContainer}>
                {selectedParticipant.skills?.technical?.map((skill, index) => (
                  <Tag key={`tech-${index}`} size="small">
                    {skill}
                  </Tag>
                ))}
                {selectedParticipant.skills?.soft?.map((skill, index) => (
                  <Tag key={`soft-${index}`} size="small" appearance="outline">
                    {skill}
                  </Tag>
                ))}
                {!selectedParticipant.skills?.technical?.length &&
                  !selectedParticipant.skills?.soft?.length && (
                    <Text size={200}>No skills specified</Text>
                  )}
              </div>
            </div>
          </div>

          <Divider className={styles.sectionDivider} />
        </>
      )}

      {/* Loading state */}
      {loading && (
        <div className={styles.spinner}>
          <Spinner label="Finding AI job matches..." />
        </div>
      )}

      {/* Results table */}
      {!loading && selectedParticipant && jobSuggestions.length > 0 && (
        <Table className={styles.table}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell className={styles.jobInfoColumn}>
                Job Information
              </TableHeaderCell>
              <TableHeaderCell className={styles.matchScoreColumn}>
                Match Score
              </TableHeaderCell>
              <TableHeaderCell className={styles.compatibilityColumn}>
                Compatibility Analysis
              </TableHeaderCell>
              <TableHeaderCell className={styles.actionsColumn}>
                Actions
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobSuggestions.map((job) => (
              <TableRow key={job.id}>
                {/* Job info column */}
                <TableCell className={styles.jobInfoColumn}>
                  <div className={styles.jobInfoContainer}>
                    <div className={styles.jobTitleContainer}>
                      <TableCellLayout>
                        <Link href={`/jobs/${job.id}`}>
                          <Text weight="semibold">{job.title}</Text>
                        </Link>
                      </TableCellLayout>
                      <Tag className={styles.jobTypeTag}>
                        {getJobDisplayValue(
                          "employmentType",
                          job.employmentType
                        )}
                      </Tag>
                    </div>
                    <div className={styles.jobDetailsContainer}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "4px",
                        }}
                      >
                        <BuildingRegular fontSize={12} />
                        <Text size={200}>{job.employer}</Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <LocationRegular fontSize={12} />
                        <Text size={200}>{job.location}</Text>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Match score column */}
                <TableCell className={styles.matchScoreColumn}>
                  <div style={{ textAlign: "center" }}>
                    <span
                      className={`${styles.scoreBadge} ${getScoreBadgeClass(
                        job.matchScore
                      )}`}
                    >
                      {job.matchScore}%
                    </span>
                    <div style={{ marginTop: "8px" }}>
                      <Text size={200}>
                        {job.matchScore >= 80
                          ? "Excellent Match"
                          : job.matchScore >= 60
                          ? "Good Match"
                          : "Potential Match"}
                      </Text>
                    </div>
                  </div>
                </TableCell>

                {/* Compatibility reasons column */}
                <TableCell className={styles.compatibilityColumn}>
                  <ul className={styles.reasonsList}>
                    {job.compatibilityElements
                      .slice(0, 3)
                      .map((element, index) => (
                        <li key={index} className={styles.reasonItem}>
                          <Text size={200}>
                            <strong>{formatCategory(element.category)}</strong>
                            <br />
                            <span className={styles.reasoningText}>
                              {element.reasoning}
                            </span>
                          </Text>
                        </li>
                      ))}
                  </ul>
                  {/* <div className={styles.categoriesContainer}>
                    {Array.from(
                      new Set(job.compatibilityElements.map((e) => e.category))
                    )
                      .slice(0, 5)
                      .map((category, i) => (
                        <Tag key={i} size="small">
                          {formatCategory(category)}
                        </Tag>
                      ))}
                  </div> */}
                </TableCell>

                {/* Actions column */}
                <TableCell className={styles.actionsColumn}>
                  <div className={styles.actionsContainer}>
                    <Button
                      icon={<StarRegular />}
                      appearance="primary"
                      onClick={() => handleCreateJobMatch(job.id)}
                      disabled={savingJobs[job.id]}
                    >
                      {savingJobs[job.id] ? "Saving..." : "Save Match"}
                    </Button>
                    <Button
                      icon={<ArrowRightRegular />}
                      appearance="secondary"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      View Details
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
        <div className={styles.noResults}>
          <Text>No job suggestions found for this participant.</Text>
          <div className={styles.cardAction}>
            <Button appearance="primary" onClick={() => router.push("/jobs")}>
              Browse All Jobs
            </Button>
          </div>
        </div>
      )}

      {/* Empty state - no participant selected */}
      {!loading && !loadingParticipants && !selectedParticipant && (
        <div className={styles.emptyState}>
          <Text size={300}>
            Select a participant to view their AI job suggestions
          </Text>
        </div>
      )}
    </div>
  );
}
