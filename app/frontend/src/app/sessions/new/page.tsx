"use client";

import React, { useState, useEffect } from "react";
import {
  makeStyles,
  tokens,
  Title2,
  Card,
  CardHeader,
  Button,
  Input,
  Combobox,
  Option,
  Textarea,
  Field,
  Toast,
  ToastTitle,
  useToastController,
  useId,
  Tag,
  TagGroup,
  Divider,
  Text,
  Spinner,
} from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  CalendarRegular,
  LocationRegular,
  NoteRegular,
  ClockRegular,
  DeleteRegular,
  AddRegular,
  DocumentRegular,
  ListRegular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import { createSession } from "@/api/sessions";
import { getParticipants } from "@/api/participants"; // Import the getParticipants function
import {
  Session,
  SessionAISuggestions,
  TagInputType,
  SessionType,
  SessionStatus,
  getDisplayValue,
  getOptionsForField,
} from "@/types/sessions";
import { ParticipantPreview } from "@/types/participants"; // Import the ParticipantPreview type

const useStyles = makeStyles({
  container: {
    padding: "20px",
    maxWidth: "960px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    gap: "16px",
  },
  backButton: {
    minWidth: "unset",
  },
  formCard: {
    marginBottom: "24px",
  },
  cardHeader: {
    paddingBottom: "0",
  },
  cardContent: {
    padding: "16px 24px 24px",
  },
  inputsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "24px",
  },
  addInputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
    alignItems: "flex-end",
  },
  tagInput: {
    flexGrow: 1,
  },
  tagsContainer: {
    marginTop: "8px",
  },
  inlineTag: {
    marginRight: "8px",
    marginBottom: "8px",
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    marginTop: "4px",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  dateTimeInput: {
    width: "100%",
    "& input[type='date']::-webkit-calendar-picker-indicator, & input[type='time']::-webkit-calendar-picker-indicator":
      {
        display: "none",
      },
    "& input": {
      appearance: "none",
      "-webkit-appearance": "none",
      "-moz-appearance": "none",
    },
  },
});

export default function SessionRegister() {
  const styles = useStyles();
  const router = useRouter();
  const toastController = useToastController();

  // Form IDs
  const titleId = useId("title");
  const participantId = useId("participant");
  const dateId = useId("date");
  const startTimeId = useId("start-time");
  const endTimeId = useId("end-time");
  const statusId = useId("status");
  const typeId = useId("type");
  const locationId = useId("location");
  const notesId = useId("notes");
  const topicsInputId = useId("topics-input");
  const goalsInputId = useId("goals-input");

  // Initial form state
  const [formState, setFormState] = useState({
    title: "",
    participantId: "",
    participantName: "", // Will be populated when participantId is selected
    date: new Date(),
    startTime: "",
    endTime: "",
    status: "scheduled" as SessionStatus, // Default status for new sessions
    type: "" as SessionType | "", // Properly type this to allow empty string initially but enforce correct values when set
    location: "",
    notes: "",
    topics: [] as string[],
    goals: [] as string[],
  });

  // Date input state
  const [dateInputValue, setDateInputValue] = useState<string>(() => {
    // Format the initial date to YYYY-MM-DD for the input
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Participants state from API
  const [participants, setParticipants] = useState<ParticipantPreview[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);

  // Fetch participants when component mounts
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setIsLoadingParticipants(true);
        const data = await getParticipants();
        setParticipants(data);
      } catch (error) {
        console.error("Error loading participants:", error);
        toastController.dispatchToast(
          <Toast>
            <ToastTitle>Failed to load participants</ToastTitle>
          </Toast>,
          { intent: "error" }
        );
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    loadParticipants();
  }, [toastController]);

  // Form state for tag inputs
  const [tagInputs, setTagInputs] = useState({
    topics: "",
    goals: "",
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle regular input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Handle combobox changes
  const handleComboboxChange = (
    field: string,
    _: React.SyntheticEvent,
    data: { selectedOptions: string[] }
  ) => {
    if (!data.selectedOptions.length) return;

    const value = data.selectedOptions[0];

    if (field === "participantId") {
      const selected = participants.find((p) => p.id === value);
      setFormState((prevState) => ({
        ...prevState,
        participantId: value,
        participantName: selected ? selected.fullName : "",
      }));
    } else {
      setFormState((prevState) => ({ ...prevState, [field]: value }));
    }

    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);

    if (value) {
      // Create the date object properly, ensuring timezone consistency
      const [year, month, day] = value.split("-").map(Number);
      const selectedDate = new Date();
      selectedDate.setFullYear(year);
      selectedDate.setMonth(month - 1); // Months are 0-indexed in JS
      selectedDate.setDate(day);
      // Reset time components to avoid time-related issues
      selectedDate.setHours(0, 0, 0, 0);

      setFormState((prevState) => ({ ...prevState, date: selectedDate }));

      if (errors.date) {
        setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
      }
    }
  };

  // Handle tag input changes
  const handleTagInputChange = (
    type: TagInputType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTagInputs((prevTagInputs) => ({
      ...prevTagInputs,
      [type]: e.target.value,
    }));
  };

  // Add a tag
  const addTag = (type: TagInputType) => {
    const value = tagInputs[type].trim();
    if (value && !formState[type].includes(value)) {
      setFormState((prevState) => ({
        ...prevState,
        [type]: [...prevState[type], value],
      }));
      setTagInputs((prevTagInputs) => ({ ...prevTagInputs, [type]: "" }));
    }
  };

  // Remove a tag
  const removeTag = (type: TagInputType, tag: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [type]: prevState[type].filter((t) => t !== tag),
    }));
  };

  // Handle tag input key press (add on Enter)
  const handleTagKeyPress = (type: TagInputType, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(type);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.title) {
      newErrors.title = "Title is required";
    }

    if (!formState.participantId) {
      newErrors.participantId = "Participant selection is required";
    }

    if (!dateInputValue) {
      newErrors.date = "Date is required";
    }

    if (!formState.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formState.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (!formState.type) {
      newErrors.type = "Session type is required";
    }

    if (!formState.location) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastController.dispatchToast(
        <Toast>
          <ToastTitle>Please fill in all required fields</ToastTitle>
        </Toast>,
        { intent: "error" }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Format date for API using the dateInputValue
      const formattedDate = dateInputValue;

      // Mock coach data (in a real app, this would come from auth context)
      const coachId = "coach-123";
      const coachName = "Maria González";

      // Create a properly structured aiSuggestions object
      const aiSuggestions: SessionAISuggestions = {
        recommendedTopics: [],
        sentimentAnalysis: {
          positive: [],
          negative: [],
        },
        jobRecommendations: [],
        summary: "",
      };

      // Prepare session data with proper types
      const sessionData: Omit<Session, "id"> = {
        title: formState.title,
        coachId,
        coachName,
        participantId: formState.participantId,
        participantName: formState.participantName,
        date: `${formattedDate}T${formState.startTime}:00Z`,
        startTime: formState.startTime,
        endTime: formState.endTime,
        status: formState.status,
        type: formState.type as SessionType, // Cast to the required type
        location: formState.location,
        notes: formState.notes,
        topics: formState.topics,
        goals: formState.goals,
        aiSuggestions, // Use the properly structured object
      };

      // Call API
      await createSession(sessionData);
      toastController.dispatchToast(
        <Toast>
          <ToastTitle>Session created successfully</ToastTitle>
        </Toast>,
        { intent: "success" }
      );

      // Navigate back to sessions list
      router.push("/sessions");
    } catch (error) {
      console.error("Error creating session:", error);
      toastController.dispatchToast(
        <Toast>
          <ToastTitle>Failed to create session</ToastTitle>
        </Toast>,
        { intent: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/sessions");
  };

  if (isSubmitting) {
    return (
      <div className={styles.spinner}>
        <Spinner label="Creating session..." />
      </div>
    );
  }

  if (isLoadingParticipants) {
    return (
      <div className={styles.spinner}>
        <Spinner label="Loading participants..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          appearance="subtle"
          icon={<ArrowLeftRegular />}
          className={styles.backButton}
          onClick={handleCancel}
        />
        <Title2>Register New Session</Title2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className={styles.formCard}>
          <CardHeader
            className={styles.cardHeader}
            header={<Text weight="semibold">Session Information</Text>}
          />
          <div className={styles.cardContent}>
            <div className={styles.inputsGrid}>
              <Field
                label="Session Title"
                required
                validationMessage={errors.title}
                validationState={errors.title ? "error" : "none"}
              >
                <Input
                  id={titleId}
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  contentBefore={<DocumentRegular />}
                  placeholder="Enter session title"
                />
              </Field>

              <Field
                label="Participant"
                required
                validationMessage={errors.participantId}
                validationState={errors.participantId ? "error" : "none"}
              >
                <Combobox
                  id={participantId}
                  placeholder="Select participant"
                  selectedOptions={
                    formState.participantId ? [formState.participantId] : []
                  }
                  value={formState.participantName}
                  onOptionSelect={(e, data) =>
                    handleComboboxChange("participantId", e, data)
                  }
                >
                  {participants.map((participant) => (
                    <Option key={participant.id} value={participant.id}>
                      {participant.fullName}
                    </Option>
                  ))}
                </Combobox>
              </Field>

              <Field
                label="Date"
                required
                validationMessage={errors.date}
                validationState={errors.date ? "error" : "none"}
              >
                <Input
                  id={dateId}
                  className={styles.dateTimeInput}
                  type="date"
                  value={dateInputValue}
                  onChange={handleDateChange}
                  contentBefore={<CalendarRegular />}
                  placeholder="Select date"
                />
              </Field>

              <Field
                label="Start Time"
                required
                validationMessage={errors.startTime}
                validationState={errors.startTime ? "error" : "none"}
              >
                <Input
                  id={startTimeId}
                  className={styles.dateTimeInput}
                  type="time"
                  name="startTime"
                  value={formState.startTime}
                  onChange={handleInputChange}
                  contentBefore={<ClockRegular />}
                />
              </Field>

              <Field
                label="End Time"
                required
                validationMessage={errors.endTime}
                validationState={errors.endTime ? "error" : "none"}
              >
                <Input
                  id={endTimeId}
                  className={styles.dateTimeInput}
                  type="time"
                  name="endTime"
                  value={formState.endTime}
                  onChange={handleInputChange}
                  contentBefore={<ClockRegular />}
                />
              </Field>

              <Field label="Status" required>
                <Combobox
                  id={statusId}
                  placeholder="Select status"
                  selectedOptions={[formState.status]}
                  value={getDisplayValue("sessionStatus", formState.status)}
                  onOptionSelect={(e, data) =>
                    handleComboboxChange("status", e, data)
                  }
                >
                  {getOptionsForField("sessionStatus").map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.text}
                    </Option>
                  ))}
                </Combobox>
              </Field>

              <Field
                label="Session Type"
                required
                validationMessage={errors.type}
                validationState={errors.type ? "error" : "none"}
              >
                <Combobox
                  id={typeId}
                  placeholder="Select session type"
                  selectedOptions={formState.type ? [formState.type] : []}
                  value={
                    formState.type
                      ? getDisplayValue("sessionType", formState.type)
                      : ""
                  }
                  onOptionSelect={(e, data) =>
                    handleComboboxChange("type", e, data)
                  }
                >
                  {getOptionsForField("sessionType").map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.text}
                    </Option>
                  ))}
                </Combobox>
              </Field>

              <Field
                label="Location"
                required
                validationMessage={errors.location}
                validationState={errors.location ? "error" : "none"}
              >
                <Input
                  id={locationId}
                  name="location"
                  value={formState.location}
                  onChange={handleInputChange}
                  contentBefore={<LocationRegular />}
                  placeholder="Enter session location"
                />
              </Field>
            </div>

            <Field label="Notes">
              <Textarea
                id={notesId}
                name="notes"
                value={formState.notes}
                onChange={handleInputChange}
                placeholder="Enter any notes about this session"
                style={{ height: "100px" }}
              />
            </Field>
          </div>
        </Card>

        {/* Session Topics & Goals */}
        <Card className={styles.formCard}>
          <CardHeader
            className={styles.cardHeader}
            header={<Text weight="semibold">Topics & Goals</Text>}
          />
          <div className={styles.cardContent}>
            {/* Topics */}
            <Field label="Topics">
              <div className={styles.addInputRow}>
                <Input
                  id={topicsInputId}
                  className={styles.tagInput}
                  placeholder="Add session topic"
                  value={tagInputs.topics}
                  onChange={(e) => handleTagInputChange("topics", e)}
                  onKeyPress={(e) => handleTagKeyPress("topics", e)}
                  contentBefore={<ListRegular />}
                />
                <Button
                  appearance="secondary"
                  icon={<AddRegular />}
                  onClick={() => addTag("topics")}
                >
                  Add
                </Button>
              </div>
              {formState.topics.length > 0 && (
                <div className={styles.tagsContainer}>
                  <TagGroup>
                    {formState.topics.map((topic, index) => (
                      <Tag
                        key={index}
                        dismissible
                        dismissIcon={<DeleteRegular />}
                        onClick={() => removeTag("topics", topic)}
                      >
                        {topic}
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
              )}
            </Field>

            <Divider style={{ margin: "16px 0" }} />

            {/* Goals */}
            <Field label="Goals">
              <div className={styles.addInputRow}>
                <Input
                  id={goalsInputId}
                  className={styles.tagInput}
                  placeholder="Add session goal"
                  value={tagInputs.goals}
                  onChange={(e) => handleTagInputChange("goals", e)}
                  onKeyPress={(e) => handleTagKeyPress("goals", e)}
                  contentBefore={<NoteRegular />}
                />
                <Button
                  appearance="secondary"
                  icon={<AddRegular />}
                  onClick={() => addTag("goals")}
                >
                  Add
                </Button>
              </div>
              {formState.goals.length > 0 && (
                <div className={styles.tagsContainer}>
                  <TagGroup>
                    {formState.goals.map((goal, index) => (
                      <Tag
                        key={index}
                        dismissible
                        dismissIcon={<DeleteRegular />}
                        onClick={() => removeTag("goals", goal)}
                      >
                        {goal}
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
              )}
            </Field>
          </div>
        </Card>

        {/* Form Actions */}
        <div className={styles.buttonGroup}>
          <Button appearance="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button appearance="primary" type="submit">
            Create Session
          </Button>
        </div>
      </form>
    </div>
  );
}
