export const ORGANIZATION_TYPES = ["SOLE_PROPRIETOR", "COMPANY", "INDIVIDUAL"] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const ORGANIZATION_TYPE_OPTIONS: Array<{ value: OrganizationType; label: string }> = [
  { value: "SOLE_PROPRIETOR", label: "Фізична особа-підприємець (ФОП)" },
  { value: "COMPANY", label: "Юридична особа" },
  { value: "INDIVIDUAL", label: "Фізична особа" },
];

export type ApiSuccess<T> = { status: 200; code: "SUCCESS"; message: string; data: T };
export type Organization = {
  id: string;
  slug: string;
  displayName: string;
  legalName: string | null;
  organisationType: OrganizationType;
  taxId: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type CreatedOrganization = Organization & { logoUrl: string | null };
export type OrganizationPreview = {
  id: string;
  slug: string;
  displayName: string;
  organisationType: OrganizationType;
  logoUrl: string | null;
  position: string | null;
  isOwner: boolean;
};
export type OrganizationLogo = { organisationId: string; logoUrl: string | null };
export type SlugCheck = {
  available: boolean;
  slug: string;
  reason: "SLUG_INVALID" | "SLUG_RESERVED" | "SLUG_ALREADY_EXISTS" | null;
  suggestions: string[];
};
export type OrganizationHistoryEntry = {
  id: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  changedBy: string | null;
  createdAt: string;
};
export type OrganizationHistory = {
  items: OrganizationHistoryEntry[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export type Employee = {
  organisationId: string;
  memberId: string;
  login: string;
  email: string;
  phone: string | null;
  position: string | null;
  isBookable: boolean;
  memberIsActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeListFilters = {
  login: string;
  email: string;
  phone: string;
  position: string;
  isBookable: boolean;
  memberIsActive: boolean;
};

export type EmployeeListRequest = {
  organisationId: string;
  page?: number;
  limit?: number;
  search?: string | null;
  filters?: EmployeeListFilters;
  sort?: {
    field: "createdAt";
    order: "asc" | "desc";
  };
};

export type EmployeeList = {
  items: Employee[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

export type InvitationPreview = {
  organisationId: string;
  organisationDisplayName: string;
  organisationLogoUrl: string | null;
  position: string | null;
  isBookable: boolean;
  expiresAt: string;
};

export type CreatedInvitation = InvitationPreview & {
  invitationId: string;
  token: string;
  invitePath: string;
};
