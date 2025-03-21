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
  Badge,
} from "@fluentui/react-components";
import {
  SearchRegular,
  AddRegular,
  FilterRegular,
  ArrowSortDownRegular,
  ArrowSortUpRegular,
  ArrowSortRegular,
  BuildingRegular,
  CalendarRegular,
  LocationRegular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import { getJobs } from "@/api/jobs";
import {
  Job,
  JobStatus,
  getJobDisplayValue,
  getJobOptionsForField,
} from "@/types/jobs";

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
  active: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground2,
  },
  filled: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  expired: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
  draft: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
    color: tokens.colorPaletteBerryForeground2,
  },
  "pending-approval": {
    backgroundColor: tokens.colorPaletteLilacBackground2,
    color: tokens.colorPaletteLilacForeground2,
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
  // Add column width styles
  titleColumn: {
    width: "21.5%",
    minWidth: "200px",
  },
  employerColumn: {
    width: "21.5%",
    minWidth: "180px",
  },
  statusColumn: {
    width: "15%",
    minWidth: "150px",
  },
  locationColumn: {
    width: "21.5%",
    minWidth: "180px",
  },
  employmentTypeColumn: {
    width: "12%",
    minWidth: "120px",
  },
  dateColumn: {
    width: "7.5%",
    minWidth: "60px",
  },
  typeBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground2,
  },
});

// Type for sort direction
type SortDirection = "asc" | "desc" | undefined;

// Type for sort columns
interface SortConfig {
  key: keyof Job;
  direction: SortDirection;
}

export default function JobsPage() {
  const styles = useStyles();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const searchId = useId("search");
  const statusId = useId("status");
  const employmentTypeId = useId("employmentType");

  // Add state for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "postedDate",
    direction: "desc",
  });

  // Fetch jobs on component mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);

        // Create filters object based on selected filters
        const filters: {
          status?: string;
          employmentType?: string;
        } = {};

        if (selectedStatus !== "all") filters.status = selectedStatus;
        if (selectedEmploymentType !== "all")
          filters.employmentType = selectedEmploymentType;

        // Fetch data from API
        const data = await getJobs(filters);
        setJobs(data);
        setFilteredJobs(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading jobs:", err);
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [selectedStatus, selectedEmploymentType]);

  // Apply search filter client-side
  useEffect(() => {
    if (jobs.length === 0) return;

    let result = [...jobs];

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.companyName.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        // For date comparison
        if (sortConfig.key === "postedDate") {
          const dateA = new Date(a.postedDate);
          const dateB = new Date(b.postedDate);
          return sortConfig.direction === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        // For number comparison
        if (sortConfig.key === "salary") {
          return sortConfig.direction === "asc"
            ? a.salary - b.salary
            : b.salary - a.salary;
        }

        // For string comparison
        const aValue = String(a[sortConfig.key] || "");
        const bValue = String(b[sortConfig.key] || "");
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredJobs(result);
  }, [searchText, jobs, sortConfig]);

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

  const handleEmploymentTypeChange = (
    _: React.SyntheticEvent,
    data: { selectedOptions: string[] }
  ) => {
    setSelectedEmploymentType(data.selectedOptions[0]);
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedStatus("all");
    setSelectedEmploymentType("all");
  };

  const createNewJob = () => {
    router.push("/jobs/new");
  };

  const handleRowClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const renderStatusBadge = (status: JobStatus) => {
    let className = "";
    className = styles[status];

    return (
      <span className={`${styles.statusBadge} ${className}`}>
        {getJobDisplayValue("status", status)}
      </span>
    );
  };

  // Format salary with currency
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Render employment type as a badge
  const renderEmploymentTypeBadge = (employmentType: string) => {
    return (
      <span className={styles.typeBadge}>
        {getJobDisplayValue("employmentType", employmentType)}
      </span>
    );
  };

  // Enhanced sorting functionality
  const handleSort = (key: keyof Job) => {
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
      key,
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
        <Title2>Jobs</Title2>
        <Button
          appearance="primary"
          icon={<AddRegular />}
          onClick={createNewJob}
        >
          New Job
        </Button>
      </div>

      <div className={styles.filtersContainer}>
        <Field label="Search">
          <Input
            id={searchId}
            className={styles.filterItem}
            placeholder="Search jobs..."
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
                ? "All"
                : getJobDisplayValue("status", selectedStatus)
            }
            onOptionSelect={(_, data) => handleStatusChange(_, data)}
            size="medium"
          >
            <Option value="all">All</Option>
            {getJobOptionsForField("status").map((option) => (
              <Option key={option.value} value={option.value}>
                {option.text}
              </Option>
            ))}
          </Combobox>
        </Field>

        <Field label="Employment Type">
          <Combobox
            className={styles.filterItem}
            id={employmentTypeId}
            value={
              selectedEmploymentType === "all"
                ? "All"
                : getJobDisplayValue("employmentType", selectedEmploymentType)
            }
            onOptionSelect={(_, data) => handleEmploymentTypeChange(_, data)}
            size="medium"
          >
            <Option value="all">All</Option>
            {getJobOptionsForField("employmentType").map((option) => (
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
              selectedEmploymentType !== "all"
            )
          }
        >
          Clear Filters
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spinner label="Loading jobs..." />
        </div>
      ) : (
        <div className={styles.table}>
          <Table aria-label="Jobs table">
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={styles.titleColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("title")}
                  >
                    Job Title {getSortIcon("title")}
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className={styles.employerColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("companyName")}
                  >
                    Company {getSortIcon("companyName")}
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
                <TableHeaderCell className={styles.employmentTypeColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("employmentType")}
                  >
                    Type {getSortIcon("employmentType")}
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
                <TableHeaderCell className={styles.dateColumn}>
                  <div
                    className={styles.sortableHeader}
                    onClick={() => handleSort("postedDate")}
                  >
                    Posted Date {getSortIcon("postedDate")}
                  </div>
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  onClick={() => handleRowClick(job.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell className={styles.titleColumn}>
                    <TableCellLayout>
                      <Link>{job.title}</Link>
                    </TableCellLayout>
                  </TableCell>
                  <TableCell className={styles.employerColumn}>
                    <TableCellLayout>{job.companyName}</TableCellLayout>
                  </TableCell>
                  <TableCell className={styles.locationColumn}>
                    <TableCellLayout>
                      {job.remoteOption ? (
                        <Badge
                          appearance="outline"
                          color="informative"
                          shape="rounded"
                        >
                          Remote
                        </Badge>
                      ) : (
                        job.location
                      )}
                    </TableCellLayout>
                  </TableCell>
                  <TableCell className={styles.employmentTypeColumn}>
                    {renderEmploymentTypeBadge(job.employmentType)}
                  </TableCell>
                  <TableCell className={styles.statusColumn}>
                    {renderStatusBadge(job.status)}
                  </TableCell>
                  <TableCell className={styles.dateColumn}>
                    <TableCellLayout>
                      {new Date(job.postedDate).toLocaleDateString()}
                    </TableCellLayout>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredJobs.length === 0 && !isLoading && (
            <div className={styles.emptyState}>
              <Text>No jobs found matching your criteria.</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
