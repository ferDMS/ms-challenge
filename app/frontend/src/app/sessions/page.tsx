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
} from "@fluentui/react-components";
import {
  SearchRegular,
  AddRegular,
  FilterRegular,
  CalendarRegular,
  ArrowSortDownRegular,
  ArrowSortUpRegular,
  ArrowSortRegular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import { getSessions } from "@/api/sessions";
import {
  SessionPreview,
  SessionType,
  SessionStatus,
  getDisplayValue,
  getOptionsForField,
} from "@/types/sessions";

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
    alignItems: "flex-end", // Align items to bottom to line up with inputs
  },
  // Add a new style for the clear filters button to push it to the right
  clearFiltersButton: {
    marginLeft: "auto", // Push to the right side
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
  completed: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  scheduled: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  cancelled: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  emptyState: {
    marginTop: "40px",
    textAlign: "center",
  },
  dateInput: {
    width: "100%",
    "& input[type='date']::-webkit-calendar-picker-indicator": {
      display: "none",
    },
    // Add this styling to prevent browser's default date styling
    "& input": {
      appearance: "none",
      "-webkit-appearance": "none",
      "-moz-appearance": "none",
    },
  },
  // Add styles for the sortable column headers
  sortableHeader: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    "&:hover": {
      color: tokens.colorBrandForeground1,
    },
  },
  // Style for avatar in table cell
  avatarCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  // Column width styles
  titleColumn: {
    width: "20%", // Bigger
  },
  participantColumn: {
    width: "20%", // Bigger
  },
  locationColumn: {
    width: "20%", // Bigger
  },
  typeColumn: {
    width: "10%", // Slightly smaller
  },
  dateColumn: {
    width: "10%", // Smaller
  },
  timeColumn: {
    width: "10%", // Smaller
  },
  statusColumn: {
    width: "10%", // Smaller
  },
});

// Type for sort direction
type SortDirection = "asc" | "desc" | undefined;

// Type for sort columns
interface SortConfig {
  key: keyof SessionPreview;
  direction: SortDirection;
}

export default function SessionsPage() {
  const styles = useStyles();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionPreview[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionPreview[]>(
    []
  );
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | "all">(
    "all"
  );
  const [selectedType, setSelectedType] = useState<SessionType | "all">("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateInputValue, setDateInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const searchId = useId("search");
  const statusId = useId("status");
  const typeId = useId("type");
  const dateId = useId("date");
  // Add state for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  });

  // Helper functions
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch sessions on component mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);

        // Create filters object based on selected filters
        const filters: {
          status?: SessionStatus;
          type?: SessionType;
          date?: string;
        } = {};

        if (selectedStatus !== "all") filters.status = selectedStatus;
        if (selectedType !== "all") filters.type = selectedType;
        if (selectedDate) {
          // Format date as YYYY-MM-DD for API
          filters.date = selectedDate.toISOString().split("T")[0];
        }

        // Fetch data from API using the imported getSessions function
        const data = await getSessions(filters);
        setSessions(data);
        setFilteredSessions(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading sessions:", err);
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [selectedStatus, selectedType, selectedDate]); // Re-fetch when filters change

  // Apply search filter client-side
  useEffect(() => {
    if (sessions.length === 0) return;

    let result = [...sessions];

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (session) =>
          session.title.toLowerCase().includes(searchLower) ||
          session.participantName.toLowerCase().includes(searchLower) ||
          session.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        // Handle date sorting separately
        if (sortConfig.key === "date") {
          const dateA = new Date(a[sortConfig.key]).getTime();
          const dateB = new Date(b[sortConfig.key]).getTime();
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }

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

    setFilteredSessions(result);
  }, [searchText, sessions, sortConfig]);

  // Handler functions
  const handleSearchChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(ev.target.value);
  };

  const handleStatusChange = (
    _: React.SyntheticEvent,
    data: { selectedOptions: string[] }
  ) => {
    setSelectedStatus(data.selectedOptions[0] as SessionStatus | "all");
  };

  const handleTypeChange = (
    _: React.SyntheticEvent,
    data: { selectedOptions: string[] }
  ) => {
    setSelectedType(data.selectedOptions[0] as SessionType | "all");
  };

  // Handler for date input change - Fix timezone issues
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

      setSelectedDate(selectedDate);
    } else {
      setSelectedDate(null);
    }
  };

  // Update clearFilters to trigger a new fetch
  const clearFilters = () => {
    setSearchText("");
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedDate(null);
    setDateInputValue("");
  };

  const createNewSession = () => {
    router.push("/sessions/new");
  };

  const handleRowClick = (sessionId: string) => {
    router.push(`/sessions/${sessionId}`);
  };

  const renderStatusBadge = (status: SessionStatus) => {
    let className = "";

    switch (status) {
      case "completed":
        className = styles.completed;
        break;
      case "scheduled":
        className = styles.scheduled;
        break;
      case "cancelled":
        className = styles.cancelled;
        break;
    }

    return (
      <span className={`${styles.statusBadge} ${className}`}>
        {getDisplayValue("sessionStatus", status)}
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

    setSortConfig({ key: key as keyof SessionPreview, direction });
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
        <Title2>Sessions</Title2>
        <Button
          appearance="primary"
          icon={<AddRegular />}
          onClick={createNewSession}
        >
          New Session
        </Button>
      </div>

      <div className={styles.filtersContainer}>
        <Field label="Search">
          <Input
            id={searchId}
            className={styles.filterItem}
            placeholder="Search sessions..."
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
            selectedOptions={[selectedStatus]}
            value={
              selectedStatus === "all"
                ? "All"
                : getDisplayValue("sessionStatus", selectedStatus)
            }
            onOptionSelect={(_, data) => handleStatusChange(_, data)}
            size="medium"
          >
            <Option value="all">All</Option>
            {getOptionsForField("sessionStatus").map((option) => (
              <Option key={option.value} value={option.value}>
                {option.text}
              </Option>
            ))}
          </Combobox>
        </Field>

        <Field label="Session Type">
          <Combobox
            className={styles.filterItem}
            id={typeId}
            selectedOptions={[selectedType]}
            value={
              selectedType === "all"
                ? "All"
                : getDisplayValue("sessionType", selectedType)
            }
            onOptionSelect={(_, data) => handleTypeChange(_, data)}
            size="medium"
          >
            <Option value="all">All</Option>
            {getOptionsForField("sessionType").map((option) => (
              <Option key={option.value} value={option.value}>
                {option.text}
              </Option>
            ))}
          </Combobox>
        </Field>

        <Field label="Date">
          <Input
            id={dateId}
            className={styles.filterItem}
            type="date"
            value={dateInputValue}
            onChange={handleDateChange}
            contentBefore={<CalendarRegular />}
            placeholder="Select a date"
            size="medium"
          />
        </Field>

        <Button
          appearance="primary" // Match the New Session button appearance
          icon={<FilterRegular />}
          onClick={clearFilters}
          className={styles.clearFiltersButton}
          disabled={
            !(
              searchText ||
              selectedStatus !== "all" ||
              selectedType !== "all" ||
              selectedDate
            )
          }
        >
          Clear Filters
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spinner label="Loading sessions..." />
        </div>
      ) : (
        <div className={styles.table}>
          <Table aria-label="Sessions table">
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={styles.titleColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("title")}
                  >
                    Session Title {getSortIcon("title")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.participantColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("participantName")}
                  >
                    Participant {getSortIcon("participantName")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.locationColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("location")}
                  >
                    Location {getSortIcon("location")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.typeColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("type")}
                  >
                    Type {getSortIcon("type")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.dateColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("date")}
                  >
                    Date {getSortIcon("date")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.timeColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("startTime")}
                  >
                    Time {getSortIcon("startTime")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.statusColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </div>
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow
                  key={session.id}
                  onClick={() => handleRowClick(session.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell className={styles.titleColumn}>
                    <TableCellLayout>
                      <Link>{session.title}</Link>
                    </TableCellLayout>
                  </TableCell>
                  <TableCell className={styles.participantColumn}>
                    <TableCellLayout
                      media={
                        <Avatar
                          image={
                            session.participantAvatar
                              ? { src: session.participantAvatar }
                              : undefined
                          }
                          name={session.participantName}
                          color="colorful"
                          size={28}
                        />
                      }
                    >
                      {session.participantName}
                    </TableCellLayout>
                  </TableCell>
                  <TableCell className={styles.locationColumn}>
                    {session.location}
                  </TableCell>
                  <TableCell className={styles.typeColumn}>
                    {getDisplayValue("sessionType", session.type)}
                  </TableCell>
                  <TableCell className={styles.dateColumn}>
                    {formatDate(new Date(session.date))}
                  </TableCell>
                  <TableCell
                    className={styles.timeColumn}
                  >{`${session.startTime} - ${session.endTime}`}</TableCell>
                  <TableCell className={styles.statusColumn}>
                    {renderStatusBadge(session.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredSessions.length === 0 && !isLoading && (
            <div className={styles.emptyState}>
              <Text>No sessions found matching your criteria.</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
