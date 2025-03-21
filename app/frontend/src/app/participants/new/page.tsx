"use client";

import React, { useState } from "react";
import {
  makeStyles,
  Title2,
  Card,
  CardHeader,
  Button,
  Input,
  Combobox,
  Option,
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
  RadioGroup,
  Radio,
} from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  PersonRegular,
  MailRegular,
  PhoneRegular,
  LocationRegular,
  CalendarRegular,
  BriefcaseRegular,
  DeleteRegular,
  AddRegular,
  TranslateRegular,
  DocumentRegular,
  PersonFeedbackRegular,
  BuildingRegular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import { createParticipant } from "@/api/participants";
import {
  EmploymentCycleStage,
  Participant,
  Gender,
  TransportationStatus,
  DesiredHours,
  DisabilityType,
  getOptionsForField,
  getDisplayValue,
} from "@/types/participants";

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
  dateTimeInput: {
    width: "100%",
    "& input[type='date']::-webkit-calendar-picker-indicator": {
      display: "none",
    },
    "& input": {
      appearance: "none",
      "-webkit-appearance": "none",
      "-moz-appearance": "none",
    },
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
});

// Define tag input types
type TagInputType =
  | "accommodationsNeeded"
  | "technicalSkills"
  | "softSkills"
  | "preferredLocations"
  | "preferredIndustries";

export default function ParticipantRegister() {
  const styles = useStyles();
  const router = useRouter();
  const toastController = useToastController();

  // Form IDs
  const firstNameId = useId("first-name");
  const lastNameId = useId("last-name");
  const emailId = useId("email");
  const phoneId = useId("phone");
  const dobId = useId("dob");
  const genderId = useId("gender");
  const languageId = useId("language");
  const disabilityTypeId = useId("disability-type");
  const transportationId = useId("transportation");
  const employmentGoalId = useId("employment-goal");
  const desiredHoursId = useId("desired-hours");

  // Date input state
  const [dateOfBirthValue, setDateOfBirthValue] = useState("");

  // Initial form state
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "" as Gender,
    primaryLanguage: "",
    disabilityType: "" as DisabilityType, // Fix: Use DisabilityType instead of string
    accommodationsNeeded: [] as string[],
    transportationStatus: "" as TransportationStatus,
    currentStatus: "seeking" as EmploymentCycleStage,
    employmentGoal: "",
    desiredHours: "" as DesiredHours,
    skills: {
      technical: [] as string[],
      soft: [] as string[],
    },
    preferredLocations: [] as string[],
    preferredIndustries: [] as string[],
  });

  // Tag input state
  const [tagInputs, setTagInputs] = useState({
    accommodationsNeeded: "",
    technicalSkills: "",
    softSkills: "",
    preferredLocations: "",
    preferredIndustries: "",
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateOfBirthValue(value);
    setFormState((prev) => ({ ...prev, dateOfBirth: value }));
    if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
  };

  // Handle combobox changes with display value support
  const handleComboboxChange = (
    field: string,
    _: React.SyntheticEvent,
    data: { selectedOptions: string[] }
  ) => {
    if (data.selectedOptions.length > 0) {
      setFormState((prev) => ({
        ...prev,
        [field]: data.selectedOptions[0],
      }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };

  // Handle status change
  const handleStatusChange = (
    _: React.FormEvent<HTMLDivElement>,
    data: { value: string }
  ) => {
    setFormState((prev) => ({
      ...prev,
      currentStatus: data.value as EmploymentCycleStage,
    }));
  };

  // Handle nested changes for skills
  const handleNestedChange = (
    category: "skills",
    subCategory: "technical" | "soft",
    values: string[]
  ) => {
    setFormState((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [subCategory]: values,
      },
    }));
  };

  // Handle tag input changes
  const handleTagInputChange = (
    type: TagInputType,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTagInputs((prev) => ({ ...prev, [type]: e.target.value }));
  };

  // Add a tag
  const addTag = (type: TagInputType) => {
    const value = tagInputs[type].trim();
    if (!value) return;

    if (type === "technicalSkills") {
      if (!formState.skills.technical.includes(value)) {
        handleNestedChange("skills", "technical", [
          ...formState.skills.technical,
          value,
        ]);
      }
    } else if (type === "softSkills") {
      if (!formState.skills.soft.includes(value)) {
        handleNestedChange("skills", "soft", [...formState.skills.soft, value]);
      }
    } else if (type === "preferredLocations") {
      if (!formState.preferredLocations.includes(value)) {
        setFormState((prev) => ({
          ...prev,
          preferredLocations: [...prev.preferredLocations, value],
        }));
      }
    } else if (type === "preferredIndustries") {
      if (!formState.preferredIndustries.includes(value)) {
        setFormState((prev) => ({
          ...prev,
          preferredIndustries: [...prev.preferredIndustries, value],
        }));
      }
    } else if (type === "accommodationsNeeded") {
      if (!formState.accommodationsNeeded.includes(value)) {
        setFormState((prev) => ({
          ...prev,
          accommodationsNeeded: [...prev.accommodationsNeeded, value],
        }));
      }
    }

    setTagInputs((prev) => ({ ...prev, [type]: "" }));
  };

  // Remove a tag
  const removeTag = (type: TagInputType, tag: string) => {
    if (type === "technicalSkills") {
      handleNestedChange(
        "skills",
        "technical",
        formState.skills.technical.filter((t) => t !== tag)
      );
    } else if (type === "softSkills") {
      handleNestedChange(
        "skills",
        "soft",
        formState.skills.soft.filter((t) => t !== tag)
      );
    } else if (type === "preferredLocations") {
      setFormState((prev) => ({
        ...prev,
        preferredLocations: prev.preferredLocations.filter((t) => t !== tag),
      }));
    } else if (type === "preferredIndustries") {
      setFormState((prev) => ({
        ...prev,
        preferredIndustries: prev.preferredIndustries.filter((t) => t !== tag),
      }));
    } else if (type === "accommodationsNeeded") {
      setFormState((prev) => ({
        ...prev,
        accommodationsNeeded: prev.accommodationsNeeded.filter(
          (t) => t !== tag
        ),
      }));
    }
  };

  // Handle tag input key press
  const handleTagKeyPress = (type: TagInputType, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(type);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      { field: "firstName", label: "First name" },
      { field: "lastName", label: "Last name" },
      { field: "email", label: "Email" },
      { field: "phone", label: "Phone" },
      { field: "dateOfBirth", label: "Date of birth" },
      { field: "gender", label: "Gender" },
      { field: "primaryLanguage", label: "Primary language" },
      { field: "disabilityType", label: "Disability type" },
      { field: "transportationStatus", label: "Transportation status" },
      { field: "employmentGoal", label: "Employment goal" },
      { field: "desiredHours", label: "Desired hours" },
    ];

    requiredFields.forEach(({ field, label }) => {
      if (!formState[field as keyof typeof formState]) {
        newErrors[field] = `${label} is required`;
      }
    });

    // Email validation
    if (
      formState.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)
    ) {
      newErrors.email = "Please enter a valid email";
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
      const participantData: Omit<Participant, "id"> = {
        ...formState,
        fullName: `${formState.firstName} ${formState.lastName}`,
        workHistory: [],
        goals: [],
        jobMatches: [],
      };

      await createParticipant(participantData);

      toastController.dispatchToast(
        <Toast>
          <ToastTitle>Participant registered successfully</ToastTitle>
        </Toast>,
        { intent: "success" }
      );

      router.push("/participants");
    } catch (error) {
      console.error("Error registering participant:", error);
      toastController.dispatchToast(
        <Toast>
          <ToastTitle>Failed to register participant</ToastTitle>
        </Toast>,
        { intent: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className={styles.spinner}>
        <Spinner label="Registering participant..." />
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
          onClick={() => router.push("/participants")}
        />
        <Title2>Register New Participant</Title2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <Card className={styles.formCard}>
          <CardHeader
            className={styles.cardHeader}
            header={<Text weight="semibold">Personal Information</Text>}
          />
          <div className={styles.cardContent}>
            <div className={styles.inputsGrid}>
              <Field
                label="First Name"
                required
                validationMessage={errors.firstName}
                validationState={errors.firstName ? "error" : "none"}
              >
                <Input
                  id={firstNameId}
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleInputChange}
                  contentBefore={<PersonRegular />}
                  placeholder="Enter first name"
                />
              </Field>

              <Field
                label="Last Name"
                required
                validationMessage={errors.lastName}
                validationState={errors.lastName ? "error" : "none"}
              >
                <Input
                  id={lastNameId}
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleInputChange}
                  contentBefore={<PersonRegular />}
                  placeholder="Enter last name"
                />
              </Field>

              <Field
                label="Email"
                required
                validationMessage={errors.email}
                validationState={errors.email ? "error" : "none"}
              >
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  contentBefore={<MailRegular />}
                  placeholder="Enter email address"
                />
              </Field>

              <Field
                label="Phone"
                required
                validationMessage={errors.phone}
                validationState={errors.phone ? "error" : "none"}
              >
                <Input
                  id={phoneId}
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  contentBefore={<PhoneRegular />}
                  placeholder="Enter phone number"
                />
              </Field>

              <Field
                label="Date of Birth"
                required
                validationMessage={errors.dateOfBirth}
                validationState={errors.dateOfBirth ? "error" : "none"}
              >
                <Input
                  id={dobId}
                  className={styles.dateTimeInput}
                  type="date"
                  value={dateOfBirthValue}
                  onChange={handleDateChange}
                  contentBefore={<CalendarRegular />}
                />
              </Field>

              <Field
                label="Gender"
                required
                validationMessage={errors.gender}
                validationState={errors.gender ? "error" : "none"}
              >
                <Combobox
                  id={genderId}
                  placeholder="Select gender"
                  value={getDisplayValue("gender", formState.gender)}
                  onOptionSelect={(e, data) =>
                    handleComboboxChange("gender", e, data)
                  }
                >
                  {getOptionsForField("gender").map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.text}
                    </Option>
                  ))}
                </Combobox>
              </Field>

              <Field
                label="Primary Language"
                required
                validationMessage={errors.primaryLanguage}
                validationState={errors.primaryLanguage ? "error" : "none"}
              >
                <Input
                  id={languageId}
                  name="primaryLanguage"
                  value={formState.primaryLanguage}
                  onChange={handleInputChange}
                  contentBefore={<TranslateRegular />}
                  placeholder="Enter primary language"
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* Disability Information */}
        <Card className={styles.formCard}>
          <CardHeader
            className={styles.cardHeader}
            header={<Text weight="semibold">Disability Information</Text>}
          />
          <div className={styles.cardContent}>
            <div className={styles.inputsGrid}>
              <Field
                label="Disability Type"
                required
                validationMessage={errors.disabilityType}
                validationState={errors.disabilityType ? "error" : "none"}
              >
                <Combobox
                  id={disabilityTypeId}
                  placeholder="Select disability type"
                  value={getDisplayValue(
                    "disabilityType",
                    formState.disabilityType
                  )}
                  onOptionSelect={(e, data) =>
                    handleComboboxChange("disabilityType", e, data)
                  }
                >
                  {getOptionsForField("disabilityType").map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.text}
                    </Option>
                  ))}
                </Combobox>
              </Field>

              <Field
                label="Transportation Status"
                required
                validationMessage={errors.transportationStatus}
                validationState={errors.transportationStatus ? "error" : "none"}
              >
                <Combobox
                  id={transportationId}
                  placeholder="Select transportation status"
                  value={getDisplayValue(
                    "transportationStatus",
                    formState.transportationStatus
                  )}
                  onOptionSelect={(e, data) =>
                    handleComboboxChange("transportationStatus", e, data)
                  }
                >
                  {getOptionsForField("transportationStatus").map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.text}
                    </Option>
                  ))}
                </Combobox>
              </Field>
            </div>

            <Divider style={{ margin: "16px 0" }} />
            <Field label="Accommodations Needed">
              <div className={styles.addInputRow}>
                <Input
                  className={styles.tagInput}
                  placeholder="Add accommodation needed"
                  value={tagInputs.accommodationsNeeded}
                  onChange={(e) =>
                    handleTagInputChange("accommodationsNeeded", e)
                  }
                  onKeyPress={(e) =>
                    handleTagKeyPress("accommodationsNeeded", e)
                  }
                  contentBefore={<PersonFeedbackRegular />}
                />
                <Button
                  appearance="secondary"
                  icon={<AddRegular />}
                  onClick={() => addTag("accommodationsNeeded")}
                >
                  Add
                </Button>
              </div>
              {formState.accommodationsNeeded.length > 0 && (
                <div className={styles.tagsContainer}>
                  <TagGroup>
                    {formState.accommodationsNeeded.map((item, index) => (
                      <Tag
                        key={index}
                        dismissible
                        dismissIcon={<DeleteRegular />}
                        onClick={() => removeTag("accommodationsNeeded", item)}
                      >
                        {item}
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
              )}
            </Field>
          </div>
        </Card>

        {/* Employment Information */}
        <Card className={styles.formCard}>
          <CardHeader
            className={styles.cardHeader}
            header={<Text weight="semibold">Employment Information</Text>}
          />
          <div className={styles.cardContent}>
            <Field label="Current Employment Status" required>
              <RadioGroup
                value={formState.currentStatus}
                onChange={handleStatusChange}
                layout="horizontal"
              >
                <Radio value="initial" label="Initial" />
                <Radio value="employed" label="Employed" />
                <Radio value="training" label="In Training" />
                <Radio value="job-search" label="Job Search" />
                <Radio value="interview-preparation" label="Interview Prep" />
                <Radio value="inactive" label="Inactive" />
              </RadioGroup>
            </Field>

            <Divider style={{ margin: "16px 0" }} />
            <div className={styles.inputsGrid}>
              <Field
                label="Employment Goal"
                required
                validationMessage={errors.employmentGoal}
                validationState={errors.employmentGoal ? "error" : "none"}
              >
                <Input
                  id={employmentGoalId}
                  name="employmentGoal"
                  value={formState.employmentGoal}
                  onChange={handleInputChange}
                  contentBefore={<BriefcaseRegular />}
                  placeholder="Enter employment goal"
                />
              </Field>

              <Field
                label="Desired Hours"
                required
                validationMessage={errors.desiredHours}
                validationState={errors.desiredHours ? "error" : "none"}
              >
                <Combobox
                  id={desiredHoursId}
                  placeholder="Select desired hours"
                  value={getDisplayValue(
                    "desiredHours",
                    formState.desiredHours
                  )}
                  onOptionSelect={(e, data) =>
                    handleComboboxChange("desiredHours", e, data)
                  }
                >
                  {getOptionsForField("desiredHours").map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.text}
                    </Option>
                  ))}
                </Combobox>
              </Field>
            </div>

            {/* Skills section */}
            <Divider style={{ margin: "16px 0" }} />
            <Field label="Technical Skills">
              <div className={styles.addInputRow}>
                <Input
                  className={styles.tagInput}
                  placeholder="Add technical skill"
                  value={tagInputs.technicalSkills}
                  onChange={(e) => handleTagInputChange("technicalSkills", e)}
                  onKeyPress={(e) => handleTagKeyPress("technicalSkills", e)}
                  contentBefore={<DocumentRegular />}
                />
                <Button
                  appearance="secondary"
                  icon={<AddRegular />}
                  onClick={() => addTag("technicalSkills")}
                >
                  Add
                </Button>
              </div>
              {formState.skills.technical.length > 0 && (
                <div className={styles.tagsContainer}>
                  <TagGroup>
                    {formState.skills.technical.map((skill, index) => (
                      <Tag
                        key={index}
                        dismissible
                        dismissIcon={<DeleteRegular />}
                        onClick={() => removeTag("technicalSkills", skill)}
                      >
                        {skill}
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
              )}
            </Field>

            <Divider style={{ margin: "16px 0" }} />
            <Field label="Soft Skills">
              <div className={styles.addInputRow}>
                <Input
                  className={styles.tagInput}
                  placeholder="Add soft skill"
                  value={tagInputs.softSkills}
                  onChange={(e) => handleTagInputChange("softSkills", e)}
                  onKeyPress={(e) => handleTagKeyPress("softSkills", e)}
                  contentBefore={<PersonFeedbackRegular />}
                />
                <Button
                  appearance="secondary"
                  icon={<AddRegular />}
                  onClick={() => addTag("softSkills")}
                >
                  Add
                </Button>
              </div>
              {formState.skills.soft.length > 0 && (
                <div className={styles.tagsContainer}>
                  <TagGroup>
                    {formState.skills.soft.map((skill, index) => (
                      <Tag
                        key={index}
                        dismissible
                        dismissIcon={<DeleteRegular />}
                        onClick={() => removeTag("softSkills", skill)}
                      >
                        {skill}
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
              )}
            </Field>
          </div>
        </Card>

        {/* Preferences */}
        <Card className={styles.formCard}>
          <CardHeader
            className={styles.cardHeader}
            header={<Text weight="semibold">Preferences</Text>}
          />
          <div className={styles.cardContent}>
            <Field label="Preferred Locations">
              <div className={styles.addInputRow}>
                <Input
                  className={styles.tagInput}
                  placeholder="Add preferred location"
                  value={tagInputs.preferredLocations}
                  onChange={(e) =>
                    handleTagInputChange("preferredLocations", e)
                  }
                  onKeyPress={(e) => handleTagKeyPress("preferredLocations", e)}
                  contentBefore={<LocationRegular />}
                />
                <Button
                  appearance="secondary"
                  icon={<AddRegular />}
                  onClick={() => addTag("preferredLocations")}
                >
                  Add
                </Button>
              </div>
              {formState.preferredLocations.length > 0 && (
                <div className={styles.tagsContainer}>
                  <TagGroup>
                    {formState.preferredLocations.map((location, index) => (
                      <Tag
                        key={index}
                        dismissible
                        dismissIcon={<DeleteRegular />}
                        onClick={() =>
                          removeTag("preferredLocations", location)
                        }
                      >
                        {location}
                      </Tag>
                    ))}
                  </TagGroup>
                </div>
              )}
            </Field>

            <Divider style={{ margin: "16px 0" }} />
            <Field label="Preferred Industries">
              <div className={styles.addInputRow}>
                <Input
                  className={styles.tagInput}
                  placeholder="Add preferred industry"
                  value={tagInputs.preferredIndustries}
                  onChange={(e) =>
                    handleTagInputChange("preferredIndustries", e)
                  }
                  onKeyPress={(e) =>
                    handleTagKeyPress("preferredIndustries", e)
                  }
                  contentBefore={<BuildingRegular />}
                />
                <Button
                  appearance="secondary"
                  icon={<AddRegular />}
                  onClick={() => addTag("preferredIndustries")}
                >
                  Add
                </Button>
              </div>
              {formState.preferredIndustries.length > 0 && (
                <div className={styles.tagsContainer}>
                  <TagGroup>
                    {formState.preferredIndustries.map((industry, index) => (
                      <Tag
                        key={index}
                        dismissible
                        dismissIcon={<DeleteRegular />}
                        onClick={() =>
                          removeTag("preferredIndustries", industry)
                        }
                      >
                        {industry}
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
          <Button
            appearance="secondary"
            onClick={() => router.push("/participants")}
          >
            Cancel
          </Button>
          <Button appearance="primary" type="submit">
            Register Participant
          </Button>
        </div>
      </form>
    </div>
  );
}
