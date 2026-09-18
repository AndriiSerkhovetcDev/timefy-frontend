import { describe, expect, it } from "vitest";
import {
  createDefaultEmployeeListQuery,
  createEmployeeListRequest,
  resetEmployeeListFilters,
} from "./employeeListQuery";

describe("createEmployeeListRequest", () => {
  it("creates the initial request without an unused filters object", () => {
    expect(createEmployeeListRequest("123", createDefaultEmployeeListQuery(), 25)).toEqual({
      organisationId: "123",
      page: 1,
      limit: 25,
      search: null,
      sort: { field: "createdAt", order: "desc" },
    });
  });

  it("passes the current page, search, active filters and sorting", () => {
    expect(
      createEmployeeListRequest(
        "123",
        {
          page: 3,
          search: "andrii",
          position: "Адміністратор",
          active: "false",
          bookable: "true",
          sortOrder: "asc",
        },
        25,
      ),
    ).toEqual({
      organisationId: "123",
      page: 3,
      limit: 25,
      search: "andrii",
      filters: {
        position: "Адміністратор",
        memberIsActive: false,
        isBookable: true,
      },
      sort: { field: "createdAt", order: "asc" },
    });
  });
});

describe("resetEmployeeListFilters", () => {
  it("clears every filter, returns to the first page and preserves sorting", () => {
    expect(
      resetEmployeeListFilters({
        page: 4,
        search: "andrii",
        position: "Адміністратор",
        active: "false",
        bookable: "true",
        sortOrder: "asc",
      }),
    ).toEqual({
      page: 1,
      search: null,
      position: "",
      active: "all",
      bookable: "all",
      sortOrder: "asc",
    });
  });
});
