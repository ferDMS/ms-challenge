"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Text,
  makeStyles,
  tokens,
  Link,
  Spinner,
  Toast,
  ToastTitle,
  ToastBody,
  Dropdown,
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
  Badge,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from "@fluentui/react-components";
import {
  SearchRegular,
  AddRegular,
  DismissRegular,
  FilterRegular,
  CalendarRegular,
  ArrowSortDownRegular,
  ArrowSortUpRegular,
  ArrowSortRegular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";

// Enhancing mock data with participant avatars and IDs
const mockSessions = [
  {
    id: "1",
    title: "Initial Assessment",
    participantId: "p-001",
    participantName: "Juan Pérez",
    participantAvatar: null, // Will use fallback
    date: "2025-03-19T10:00:00Z", // Updated date
    startTime: "10:00",
    endTime: "11:30",
    status: "completed",
    type: "assessment",
    location: "Office A",
  },
  {
    id: "2",
    title: "Career Planning",
    participantId: "p-002",
    participantName: "María González",
    participantAvatar: "https://i.pravatar.cc/150?img=47",
    date: "2025-03-20T14:00:00Z", // Updated date
    startTime: "14:00",
    endTime: "15:00",
    status: "scheduled",
    type: "follow-up",
    location: "Virtual",
  },
  {
    id: "3",
    title: "Job Interview Preparation",
    participantName: "Carlos Rodríguez",
    date: "2025-03-20T11:00:00Z", // Updated date
    startTime: "11:00",
    endTime: "12:30",
    status: "completed",
    type: "training",
    location: "Office B",
  },
  {
    id: "4",
    title: "Skills Assessment",
    participantName: "Ana Martínez",
    date: "2025-03-21T09:00:00Z", // Updated date
    startTime: "09:00",
    endTime: "10:30",
    status: "scheduled",
    type: "assessment",
    location: "Office A",
  },
  {
    id: "5",
    title: "Job Matching Discussion",
    participantName: "Roberto Díaz",
    date: "2025-03-22T15:00:00Z", // Updated date
    startTime: "15:00",
    endTime: "16:00",
    status: "cancelled",
    type: "job-matching",
    location: "Virtual",
  },
];

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
    backgroundColor: tokens.colorPaletteGreenBackground1,
    color: tokens.colorPaletteGreenForeground1,
  },
  scheduled: {
    backgroundColor: tokens.colorPaletteYellowBackground1,
    color: tokens.colorPaletteYellowForeground1,
  },
  cancelled: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
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
});

// Type for sort direction
type SortDirection = "asc" | "desc" | undefined;

// Type for sort columns
interface SortConfig {
  key: string;
  direction: SortDirection;
}

export default function SessionsPage() {
  const styles = useStyles();
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateInputValue, setDateInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
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

  const capitalizeAndFormat = (str: string): string => {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format date for input element (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch sessions on component mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch('/api/sessions');
        // const data = await response.json();

        // Using mock data for now
        setTimeout(() => {
          setSessions(mockSessions);
          setFilteredSessions(mockSessions);
          setIsLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        setError("Failed to load sessions. Please try again.");
        setShowErrorToast(true);
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Apply filters when they change
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

    // Apply status filter
    if (selectedStatus !== "all") {
      result = result.filter((session) => session.status === selectedStatus);
    }

    // Apply type filter
    if (selectedType !== "all") {
      result = result.filter((session) => session.type === selectedType);
    }

    // Apply date filter - Fix to ensure proper date comparison
    if (selectedDate) {
      // Use a normalized string format for comparison (YYYY-MM-DD)
      const filterDateString = selectedDate.toISOString().split("T")[0];

      result = result.filter((session) => {
        // Normalize the session date the same way
        const sessionDate = new Date(session.date);
        const sessionDateString = sessionDate.toISOString().split("T")[0];
        return sessionDateString === filterDateString;
      });
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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredSessions(result);
  }, [
    searchText,
    selectedStatus,
    selectedType,
    selectedDate,
    sessions,
    sortConfig,
  ]);

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

  const handleTypeChange = (
    _: React.SyntheticEvent,
    data: { selectedOptions: string[] }
  ) => {
    setSelectedType(data.selectedOptions[0]);
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

  // Update clearFilters to also clear dateInputValue
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

  const renderStatusBadge = (status: string) => {
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
        {capitalizeAndFormat(status)}
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

    setSortConfig({ key, direction });
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
        <Text size={600} weight="semibold" className={styles.title}>
          Sessions
        </Text>
        <Button
          appearance="primary"
          icon={<AddRegular />}
          onClick={createNewSession}
        >
          New Session
        </Button>
      </div>

      {/* {showErrorToast && error && (
        <Toast appearance="error" onDismiss={() => setShowErrorToast(false)}>
          <ToastTitle>Error</ToastTitle>
          <ToastBody>{error}</ToastBody>
        </Toast>
      )} */}

      <div className={styles.filtersContainer}>
        <Field label="Search">
          <Input
            id={searchId}
            className={styles.filterItem}
            placeholder="Search sessions..."
            value={searchText}
            onChange={handleSearchChange}
            contentBefore={<SearchRegular />}
            size="small"
          />
        </Field>

        <Field label="Status">
          <Dropdown
            className={styles.filterItem}
            id={statusId}
            value={selectedStatus}
            onOptionSelect={(_, data) => handleStatusChange(_, data)}
            size="small"
          >
            <Option value="all">All Statuses</Option>
            <Option value="scheduled">Scheduled</Option>
            <Option value="completed">Completed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Dropdown>
        </Field>

        <Field label="Session Type">
          <Dropdown
            className={styles.filterItem}
            id={typeId}
            value={selectedType}
            onOptionSelect={(_, data) => handleTypeChange(_, data)}
            size="small"
          >
            <Option value="all">All Types</Option>
            <Option value="initial">Initial</Option>
            <Option value="follow-up">Follow-up</Option>
            <Option value="assessment">Assessment</Option>
            <Option value="training">Training</Option>
            <Option value="job-matching">Job Matching</Option>
          </Dropdown>
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
            size="small"
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
                <TableHeaderCell>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("title")}
                  >
                    Session Title {getSortIcon("title")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("participantName")}
                  >
                    Participant {getSortIcon("participantName")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("date")}
                  >
                    Date {getSortIcon("date")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("startTime")}
                  >
                    Time {getSortIcon("startTime")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("type")}
                  >
                    Type {getSortIcon("type")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("location")}
                  >
                    Location {getSortIcon("location")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>
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
                  <TableCell>
                    <TableCellLayout>
                      <Link>{session.title}</Link>
                    </TableCellLayout>
                  </TableCell>
                  <TableCell>
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
                  <TableCell>{formatDate(new Date(session.date))}</TableCell>
                  <TableCell>{`${session.startTime} - ${session.endTime}`}</TableCell>
                  <TableCell>{capitalizeAndFormat(session.type)}</TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{renderStatusBadge(session.status)}</TableCell>
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
