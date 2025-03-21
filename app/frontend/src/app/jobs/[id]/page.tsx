"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Text,
  Title2,
  Title3,
  Button,
  makeStyles,
  tokens,
  Spinner,
  Link,
  InfoLabel,
  Tag,
  TagGroup,
  Textarea,
  Input,
  Toast,
  ToastTitle,
  useToastController,
} from "@fluentui/react-components";
import {
  ArrowLeft24Filled,
  EditRegular,
  BuildingRegular,
  LocationRegular,
  CurrencyDollarEuroRegular,
  CalendarMonthRegular,
  DocumentRegular,
  BookInformationRegular,
  PersonRegular,
  CheckmarkRegular,
  DeleteRegular,
  AddRegular,
} from "@fluentui/react-icons";
import { getJob, updateJob } from "@/api/jobs";
import { Job, EmploymentType, getJobDisplayValue } from "@/types/jobs";

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
  // Status badges
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  active: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  draft: {
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
    color: tokens.colorPaletteMarigoldForeground2,
  },
  expired: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  filled: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
    color: tokens.colorPaletteBerryForeground2,
  },
  // Job type badges
  typeBadge: {
    backgroundColor: tokens.colorPaletteLavenderBackground2,
    color: tokens.colorPaletteLavenderForeground2,
  },
  editableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  editButton: {
    minWidth: "unset",
    height: "unset",
  },
  tagEditContainer: {
    marginTop: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  addInputRow: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
    alignItems: "center",
  },
  tagInput: {
    flexGrow: 1,
  },
  sectionDivider: {
    margin: "32px 0",
  },
  fullWidthSection: {
    gridColumn: "1 / -1",
  },
});

export default function JobDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const styles = useStyles();
  const router = useRouter();
  const { id: jobId } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toastController = useToastController();

  // States for editing
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  // Temporary states to hold edited values
  const [editedDescription, setEditedDescription] = useState("");
  const [editedSkills, setEditedSkills] = useState<string[]>([]);

  // State for new input values
  const [newSkill, setNewSkill] = useState("");

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const data = await getJob(jobId);
        setJob(data);

        // Initialize edit states with current values
        setEditedDescription(data.description);
        setEditedSkills([...data.requiredSkills]);

        setError(null);
      } catch (err) {
        console.error("Error loading job:", err);
        setError("Could not load job information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  // Toggle edit mode handlers
  const toggleEditDescription = () => {
    if (isEditingDescription) {
      saveDescription();
    } else {
      setIsEditingDescription(true);
    }
  };

  const toggleEditSkills = () => {
    if (isEditingSkills) {
      saveSkills();
    } else {
      setIsEditingSkills(true);
    }
  };

  // Save handlers
  const saveDescription = async () => {
    if (!job) return;

    setIsSaving(true);
    try {
      const updatedJobData = {
        ...job,
        description: editedDescription,
      };

      const updatedJob = await updateJob(jobId, updatedJobData);
      setJob(updatedJob);
      setIsEditingDescription(false);
      showSuccessToast("Job description updated successfully");
    } catch (err) {
      console.error("Error saving description:", err);
      showErrorToast("Failed to update job description");
    } finally {
      setIsSaving(false);
    }
  };

  const saveSkills = async () => {
    if (!job) return;

    setIsSaving(true);
    try {
      const updatedJobData = {
        ...job,
        requiredSkills: editedSkills,
      };

      const updatedJob = await updateJob(jobId, updatedJobData);
      setJob(updatedJob);
      setIsEditingSkills(false);
      showSuccessToast("Required skills updated successfully");
    } catch (err) {
      console.error("Error saving skills:", err);
      showErrorToast("Failed to update required skills");
    } finally {
      setIsSaving(false);
    }
  };

  // List item handlers
  const addSkill = () => {
    if (newSkill.trim() && !editedSkills.includes(newSkill.trim())) {
      setEditedSkills([...editedSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (item: string) => {
    setEditedSkills(editedSkills.filter((s) => s !== item));
  };

  // Input key handlers
  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  // Toast helpers
  const showSuccessToast = (message: string) => {
    toastController.dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { intent: "success" }
    );
  };

  const showErrorToast = (message: string) => {
    toastController.dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { intent: "error" }
    );
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const renderStatusBadge = (status: string) => {
    const className = styles[status as keyof typeof styles];
    return (
      <span className={`${styles.statusBadge} ${className}`}>
        {getJobDisplayValue("status", status)}
      </span>
    );
  };

  const renderJobTypeBadge = (type: EmploymentType) => {
    return (
      <span className={`${styles.statusBadge} ${styles.typeBadge}`}>
        {getJobDisplayValue("employmentType", type)}
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
        <Spinner label="Loading job details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={styles.container}>
        <Card>
          <Text weight="semibold">
            {error || "Could not load job information."}
          </Text>
          <Button
            appearance="primary"
            onClick={() => router.push("/jobs")}
            style={{ marginTop: "16px" }}
          >
            Return to Jobs
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
            onClick={() => router.push("/jobs")}
          >
            Back to Jobs
          </Button>
        </div>
      </div>

      <div className={styles.header}>
        <div>
          <Title2>{job.title}</Title2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {renderStatusBadge(job.status)}
            {renderJobTypeBadge(job.employmentType)}
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button appearance="primary" icon={<EditRegular />}>
            Edit Job
          </Button>
        </div>
      </div>

      {/* Company Information Section */}
      <Title3>Company Information</Title3>
      <div className={styles.grid}>
        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Company Details</InfoLabel>

            <div className={styles.infoItem}>
              <BuildingRegular />
              <Text>{job.companyName}</Text>
            </div>

            <div className={styles.infoItem}>
              <LocationRegular />
              <Text>{job.location}</Text>
            </div>

            <div className={styles.infoItem}>
              <BookInformationRegular />
              <Text>Industry: {job.industry}</Text>
            </div>

            {job.contactPerson && (
              <div className={styles.infoItem}>
                <PersonRegular />
                <Text>Contact: {job.contactPerson}</Text>
              </div>
            )}

            {job.contactEmail && (
              <div className={styles.infoItem}>
                <BookInformationRegular />
                <Text>Email: {job.contactEmail}</Text>
              </div>
            )}

            {job.contactPhone && (
              <div className={styles.infoItem}>
                <BookInformationRegular />
                <Text>Phone: {job.contactPhone}</Text>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Job Details</InfoLabel>

            <div className={styles.infoItem}>
              <DocumentRegular />
              <Text>
                Type: {getJobDisplayValue("employmentType", job.employmentType)}
              </Text>
            </div>

            <div className={styles.infoItem}>
              <CurrencyDollarEuroRegular />
              <Text>Salary: {formatSalary(job.salary)}</Text>
            </div>

            {job.hoursPerWeek && (
              <div className={styles.infoItem}>
                <CalendarMonthRegular />
                <Text>
                  Hours: {job.hoursPerWeek.min}-{job.hoursPerWeek.max} per week
                </Text>
              </div>
            )}

            <div className={styles.infoItem}>
              <CalendarMonthRegular />
              <Text>Posted Date: {formatDate(job.postedDate)}</Text>
            </div>

            {job.startDate && (
              <div className={styles.infoItem}>
                <CalendarMonthRegular />
                <Text>Start Date: {formatDate(job.startDate)}</Text>
              </div>
            )}

            {job.remoteOption && (
              <div className={styles.infoItem}>
                <LocationRegular />
                <Text>Remote Option Available</Text>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Job Description Section */}
      <Title3 style={{ marginTop: "32px" }}>Job Description</Title3>
      <div className={styles.grid}>
        <Card className={styles.fullWidthSection}>
          <div className={styles.cardContent}>
            <div className={styles.editableHeader}>
              <InfoLabel weight="semibold">Description</InfoLabel>
              <Button
                appearance="subtle"
                className={styles.editButton}
                icon={
                  isEditingDescription ? <CheckmarkRegular /> : <EditRegular />
                }
                onClick={toggleEditDescription}
                disabled={isSaving}
              />
            </div>

            {isEditingDescription ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                style={{ marginTop: "12px", width: "100%", height: "150px" }}
                placeholder="Enter job description..."
                disabled={isSaving}
              />
            ) : (
              <div className={styles.infoItem}>
                <Text
                  style={{
                    marginTop: "12px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-line",
                  }}
                >
                  {job.description}
                </Text>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Skills Section */}
      <Title3 style={{ marginTop: "32px" }}>Required Skills</Title3>
      <div className={styles.grid}>
        <Card className={styles.fullWidthSection}>
          <div className={styles.cardContent}>
            <div className={styles.editableHeader}>
              <InfoLabel weight="semibold">Skills</InfoLabel>
              <Button
                appearance="subtle"
                className={styles.editButton}
                icon={isEditingSkills ? <CheckmarkRegular /> : <EditRegular />}
                onClick={toggleEditSkills}
                disabled={isSaving}
              />
            </div>

            {isEditingSkills ? (
              <>
                <div className={styles.tagEditContainer}>
                  <TagGroup
                    onDismiss={(_e, { value }) => {
                      removeSkill(value as string);
                    }}
                  >
                    {editedSkills.map((skill, index) => (
                      <Tag
                        key={index}
                        dismissible
                        dismissIcon={
                          <DeleteRegular aria-label="remove skill" />
                        }
                        value={skill}
                      >
                        {skill}
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
                <div className={styles.addInputRow}>
                  <Input
                    className={styles.tagInput}
                    placeholder="Add new skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addSkill)}
                    disabled={isSaving}
                  />
                  <Button
                    appearance="secondary"
                    icon={<AddRegular />}
                    onClick={addSkill}
                    disabled={isSaving}
                  >
                    Add
                  </Button>
                </div>
              </>
            ) : (
              <div className={styles.tagContainer}>
                {job.requiredSkills.map((skill, index) => (
                  <Tag key={index}>{skill}</Tag>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Accommodations Section */}
      <Title3 style={{ marginTop: "32px" }}>Accommodations</Title3>
      <div className={styles.grid}>
        <Card className={styles.fullWidthSection}>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Available Accommodations</InfoLabel>
            <div className={styles.tagContainer}>
              {job.availableAccommodations.map((accommodation, index) => (
                <Tag key={index}>{accommodation}</Tag>
              ))}
            </div>
            {job.availableAccommodations.length === 0 && (
              <Text
                size={200}
                style={{
                  fontStyle: "italic",
                  color: tokens.colorNeutralForeground3,
                  marginTop: "12px",
                }}
              >
                No specific accommodations listed for this job.
              </Text>
            )}
          </div>
        </Card>
      </div>

      {/* Accessibility Features Section */}
      <Title3 style={{ marginTop: "32px" }}>Accessibility Features</Title3>
      <div className={styles.grid}>
        <Card className={styles.fullWidthSection}>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Workplace Accessibility</InfoLabel>
            <div className={styles.tagContainer}>
              {job.accessibilityFeatures.map((feature, index) => (
                <Tag key={index}>{feature}</Tag>
              ))}
            </div>
            {job.accessibilityFeatures.length === 0 && (
              <Text
                size={200}
                style={{
                  fontStyle: "italic",
                  color: tokens.colorNeutralForeground3,
                  marginTop: "12px",
                }}
              >
                No specific accessibility features listed for this job.
              </Text>
            )}
          </div>
        </Card>
      </div>

      {/* Supportive Environment Section */}
      <Title3 style={{ marginTop: "32px" }}>Supportive Environment</Title3>
      <div className={styles.grid}>
        <Card className={styles.fullWidthSection}>
          <div className={styles.cardContent}>
            <InfoLabel weight="semibold">Workplace Support</InfoLabel>
            <div className={styles.tagContainer}>
              {job.supportiveEnvironment.map((support, index) => (
                <Tag key={index}>{support}</Tag>
              ))}
            </div>
            {job.supportiveEnvironment.length === 0 && (
              <Text
                size={200}
                style={{
                  fontStyle: "italic",
                  color: tokens.colorNeutralForeground3,
                  marginTop: "12px",
                }}
              >
                No specific support features listed for this job.
              </Text>
            )}
          </div>
        </Card>
      </div>

      {/* Application Information Section */}
      {job.applicationUrl && (
        <>
          <Title3 style={{ marginTop: "32px" }}>Application Information</Title3>
          <div className={styles.grid}>
            <Card className={styles.fullWidthSection}>
              <div className={styles.cardContent}>
                <InfoLabel weight="semibold">How to Apply</InfoLabel>
                <Text
                  style={{
                    marginTop: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  Apply online at:{" "}
                  <Link href={job.applicationUrl} target="_blank">
                    {job.applicationUrl}
                  </Link>
                </Text>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
