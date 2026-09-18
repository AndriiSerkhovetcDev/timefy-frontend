import type { EmployeeListFilters, EmployeeListRequest } from "./types";

export type EmployeeBooleanFilter = "all" | "true" | "false";

export type EmployeeListQuery = {
  page: number;
  search: string | null;
  position: string;
  active: EmployeeBooleanFilter;
  bookable: EmployeeBooleanFilter;
  sortOrder: "asc" | "desc";
};

export const createDefaultEmployeeListQuery = (): EmployeeListQuery => ({
  page: 1,
  search: null,
  position: "",
  active: "all",
  bookable: "all",
  sortOrder: "desc",
});

export const createEmployeeListRequest = (
  organisationId: string,
  query: EmployeeListQuery,
  limit: number,
): EmployeeListRequest => {
  const filters: EmployeeListFilters = {
    ...(query.position && { position: query.position }),
    ...(query.active !== "all" && { memberIsActive: query.active === "true" }),
    ...(query.bookable !== "all" && { isBookable: query.bookable === "true" }),
  };

  return {
    organisationId,
    page: query.page,
    limit,
    search: query.search,
    ...(Object.keys(filters).length > 0 && { filters }),
    sort: { field: "createdAt", order: query.sortOrder },
  };
};
