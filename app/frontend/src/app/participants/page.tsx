"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Text,
  Title2,
  makeStyles,
  tokens,
  Link,
  Spinner,
  Combobox,
  Option,
  Field,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout,
  useId,
  Avatar,
  Badge,
} from "@fluentui/react-components";
import {
  SearchRegular,
  AddRegular,
  FilterRegular,
  ArrowSortDownRegular,
  ArrowSortUpRegular,
  ArrowSortRegular,
  PeopleRegular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import { getParticipants } from "@/api/participants";
import {
  ParticipantPreview,
  EmploymentCycleStage,
  DisabilityType,
  getDisplayValue,
  getOptionsForField,
} from "@/types/participants";

// Styles for the page with FluentUI v2 styling system
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
  filtersContainer: {
    marginBottom: "16px",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "flex-end",
  },
  clearFiltersButton: {
    marginLeft: "auto",
  },
  filterItem: {
    minWidth: "180px",
    maxWidth: "300px",
  },
  table: {
    marginTop: "20px",
    width: "100%",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  seeking: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    color: tokens.colorPaletteYellowForeground1,
  },
  employed: {
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1,
  },
  training: {
    backgroundColor: tokens.colorPaletteBerryBackground1,
    color: tokens.colorPaletteBerryForeground1,
  },
  "job-search": {
    backgroundColor: tokens.colorPaletteMarigoldBackground1,
    color: tokens.colorPaletteMarigoldForeground1,
  },
  "job-matching": {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
    color: tokens.colorPaletteDarkOrangeForeground1,
  },
  "interview-preparation": {
    backgroundColor: tokens.colorPaletteLilacBackground2,
    color: tokens.colorPaletteLilacForeground2,
  },
  "post-employment-support": {
    backgroundColor: tokens.colorPaletteLightTealBackground2,
    color: tokens.colorPaletteLightTealForeground2,
  },
  inactive: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
  },
  emptyState: {
    marginTop: "40px",
    textAlign: "center",
  },
  sortableHeader: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    "&:hover": {
      color: tokens.colorBrandForeground1,
    },
  },
  skillsContainer: {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
  },
  skillBadge: {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: tokens.fontSizeBase100,
    backgroundColor: tokens.colorNeutralBackground1,
    marginBottom: "2px",
  },
  actionsContainer: {
    display: "flex",
    gap: "8px",
  },
  // Add column width styles
  nameColumn: {
    width: "25%",
    minWidth: "250px",
  },
  statusColumn: {
    width: "15%",
    minWidth: "120px",
  },
  disabilityTypeColumn: {
    width: "18%",
    minWidth: "180px",
  },
  employmentGoalColumn: {
    width: "25%",
    minWidth: "200px",
  },
  metricsColumn: {
    width: "8%",
    minWidth: "80px",
    textAlign: "center",
  },
});

// Type for sort direction
type SortDirection = "asc" | "desc" | undefined;

// Type for sort columns
interface SortConfig {
  key: keyof ParticipantPreview;
  direction: SortDirection;
}

export default function ParticipantsPage() {
  const styles = useStyles();
  const router = useRouter();
  const [participants, setParticipants] = useState<ParticipantPreview[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    ParticipantPreview[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDisabilityType, setSelectedDisabilityType] =
    useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const searchId = useId("search");
  const statusId = useId("status");
  const disabilityTypeId = useId("disabilityType");
  // const skillTypeId = useId("skillType");

  // Add state for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "fullName",
    direction: "asc",
  });

  // Fetch participants on component mount
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setIsLoading(true);

        // Create filters object based on selected filters
        const filters: {
          status?: string;
          disabilityType?: DisabilityType;
        } = {};

        if (selectedStatus !== "all") filters.status = selectedStatus;
        if (selectedDisabilityType !== "all")
          filters.disabilityType = selectedDisabilityType as DisabilityType;

        // Fetch data from API
        const data = await getParticipants(filters);
        setParticipants(data);
        setFilteredParticipants(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading participants:", err);
        setIsLoading(false);
      }
    };

    loadParticipants();
  }, [selectedStatus, selectedDisabilityType]);

  // Apply search filter client-side
  useEffect(() => {
    if (participants.length === 0) return;

    let result = [...participants];

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (participant) =>
          participant.fullName.toLowerCase().includes(searchLower) ||
          participant.email.toLowerCase().includes(searchLower) ||
          participant.employmentGoal.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        // For string comparison
        const aValue = String(a[sortConfig.key]);
        const bValue = String(b[sortConfig.key]);
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredParticipants(result);
  }, [searchText, participants, sortConfig]);

  // Handler functions
  const handleSearchChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(ev.target.value);
  };

  const handleStatusChange = (
    _: React.SyntheticEvent,
    data: { selectedOptions: string[] }
  ) => {
    setSelectedStatus(data.selectedOptions[0]);
  };

  const handleDisabilityTypeChange = (
    _: React.SyntheticEvent,
    data: { selectedOptions: string[] }
  ) => {
    setSelectedDisabilityType(data.selectedOptions[0]);
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedStatus("all");
    setSelectedDisabilityType("all");
  };

  const createNewParticipant = () => {
    router.push("/participants/new");
  };

  const handleRowClick = (participantId: string) => {
    router.push(`/participants/${participantId}`);
  };

  const renderStatusBadge = (status: EmploymentCycleStage) => {
    let className = "";

    // Map status to style
    className = styles[status];

    return (
      <span className={`${styles.statusBadge} ${className}`}>
        {getDisplayValue("employmentCycleStage", status)}
      </span>
    );
  };

  // Enhanced sorting functionality
  const handleSort = (key: string) => {
    let direction: SortDirection = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = undefined;
      } else {
        direction = "asc";
      }
    }

    setSortConfig({
      key: key as keyof ParticipantPreview,
      direction,
    });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowSortRegular />;
    }

    return sortConfig.direction === "asc" ? (
      <ArrowSortUpRegular />
    ) : sortConfig.direction === "desc" ? (
      <ArrowSortDownRegular />
    ) : (
      <ArrowSortRegular />
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Title2>Participants</Title2>
        <Button
          appearance="primary"
          icon={<AddRegular />}
          onClick={createNewParticipant}
        >
          New Participant
        </Button>
      </div>

      <div className={styles.filtersContainer}>
        <Field label="Search">
          <Input
            id={searchId}
            className={styles.filterItem}
            placeholder="Search participants..."
            value={searchText}
            onChange={handleSearchChange}
            contentBefore={<SearchRegular />}
            size="medium"
          />
        </Field>

        <Field label="Status">
          <Combobox
            className={styles.filterItem}
            id={statusId}
            value={
              selectedStatus === "all"
                ? "All Statuses"
                : getDisplayValue("employmentCycleStage", selectedStatus)
            }
            onOptionSelect={(_, data) => handleStatusChange(_, data)}
            size="medium"
          >
            <Option value="all">All Statuses</Option>
            {getOptionsForField("employmentCycleStage").map((option) => (
              <Option key={option.value} value={option.value}>
                {option.text}
              </Option>
            ))}
          </Combobox>
        </Field>

        <Field label="Disability Type">
          <Combobox
            className={styles.filterItem}
            id={disabilityTypeId}
            value={
              selectedDisabilityType === "all"
                ? "All Types"
                : getDisplayValue("disabilityType", selectedDisabilityType)
            }
            onOptionSelect={(_, data) => handleDisabilityTypeChange(_, data)}
            size="medium"
          >
            <Option value="all">All Types</Option>
            {getOptionsForField("disabilityType").map((option) => (
              <Option key={option.value} value={option.value}>
                {option.text}
              </Option>
            ))}
          </Combobox>
        </Field>

        <Button
          appearance="primary"
          icon={<FilterRegular />}
          onClick={clearFilters}
          className={styles.clearFiltersButton}
          disabled={
            !(
              searchText ||
              selectedStatus !== "all" ||
              selectedDisabilityType !== "all"
            )
          }
        >
          Clear Filters
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spinner label="Loading participants..." />
        </div>
      ) : (
        <div className={styles.table}>
          <Table aria-label="Participants table">
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={styles.nameColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("fullName")}
                  >
                    Name {getSortIcon("fullName")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.statusColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("currentStatus")}
                  >
                    Status {getSortIcon("currentStatus")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.disabilityTypeColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("disabilityType")}
                  >
                    Disability Type {getSortIcon("disabilityType")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.employmentGoalColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("employmentGoal")}
                  >
                    Employment Goal {getSortIcon("employmentGoal")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.metricsColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("sessionCount")}
                  >
                    Sessions {getSortIcon("sessionCount")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.metricsColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("jobMatchCount")}
                  >
                    Job Matches {getSortIcon("jobMatchCount")}
                  </div>
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow
                  key={participant.id}
                  onClick={() => handleRowClick(participant.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell className={styles.nameColumn}>
                    <TableCellLayout
                      media={
                        <Avatar
                          image={
                            participant.avatar
                              ? { src: participant.avatar }
                              : undefined
                          }
                          name={participant.fullName}
                          color="colorful"
                          size={28}
                        />
                      }
                    >
                      <Link>{participant.fullName}</Link>
                      <br />
                      <Text size={200} as="span">
                        {participant.email}
                      </Text>
                    </TableCellLayout>
                  </TableCell>
                  <TableCell className={styles.statusColumn}>
                    {renderStatusBadge(participant.currentStatus)}
                  </TableCell>
                  <TableCell className={styles.disabilityTypeColumn}>
                    {getDisplayValue(
                      "disabilityType",
                      participant.disabilityType
                    )}
                  </TableCell>
                  <TableCell className={styles.employmentGoalColumn}>
                    {participant.employmentGoal}
                  </TableCell>
                  <TableCell className={styles.metricsColumn}>
                    <Badge
                      appearance="filled"
                      color="informative"
                      shape="rounded"
                      icon={<PeopleRegular />}
                    >
                      {participant.sessionCount || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className={styles.metricsColumn}>
                    <Badge appearance="filled" color="success" shape="rounded">
                      {participant.jobMatchCount || 0}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredParticipants.length === 0 && !isLoading && (
            <div className={styles.emptyState}>
              <Text>No participants found matching your criteria.</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
