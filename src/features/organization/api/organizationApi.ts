import { httpClient } from "@/shared/api/httpClient";
import type {
  ApiSuccess,
  CreatedOrganization,
  Organization,
  OrganizationHistory,
  OrganizationLogo,
  OrganizationPreview,
  OrganizationType,
  SlugCheck,
} from "../model/types";

const BASE = "/organisations";
export const checkOrganizationSlug = async (payload: { displayName?: string; slug?: string }) =>
  (await httpClient.post<ApiSuccess<SlugCheck>>(`${BASE}/check-slug`, payload)).data;
export type CreateOrganizationPayload = {
  slug: string;
  displayName: string;
  legalName?: string;
  organisationType: OrganizationType;
  taxId?: string;
  file?: File | null;
};
export const createOrganization = async (payload: CreateOrganizationPayload) => {
  const form = new FormData();
  form.append("slug", payload.slug);
  form.append("displayName", payload.displayName);
  form.append("organisationType", payload.organisationType);
  if (payload.legalName) form.append("legalName", payload.legalName);
  if (payload.taxId) form.append("taxId", payload.taxId);
  if (payload.file) form.append("file", payload.file);
  return (await httpClient.postForm<ApiSuccess<CreatedOrganization>>(`${BASE}/create`, form)).data;
};
export const getMyOrganizations = async () =>
  (await httpClient.get<ApiSuccess<{ items: OrganizationPreview[] }>>(`${BASE}/my`)).data.items;
export type UpdateOrganizationPayload = {
  organisationId: string;
  displayName?: string;
  legalName?: string | null;
  organisationType?: OrganizationType;
  taxId?: string | null;
};
export const updateOrganization = async (payload: UpdateOrganizationPayload) =>
  (await httpClient.post<ApiSuccess<Organization>>(`${BASE}/update`, payload)).data;
export const deactivateOrganization = async (organisationId: string) =>
  (await httpClient.post<ApiSuccess<Organization>>(`${BASE}/deactivate`, { organisationId })).data;
export const getOrganizationHistory = async (organisationId: string, page = 1, limit = 25) =>
  (
    await httpClient.post<ApiSuccess<OrganizationHistory>>(`${BASE}/history`, {
      organisationId,
      page,
      limit,
    })
  ).data;
const sendLogo = async (action: "upload" | "change", organisationId: string, file: File) => {
  const form = new FormData();
  form.append("organisationId", organisationId);
  form.append("file", file);
  return (await httpClient.postForm<ApiSuccess<OrganizationLogo>>(`${BASE}/logo/${action}`, form))
    .data;
};
export const uploadOrganizationLogo = (organisationId: string, file: File) =>
  sendLogo("upload", organisationId, file);
export const changeOrganizationLogo = (organisationId: string, file: File) =>
  sendLogo("change", organisationId, file);
export const deleteOrganizationLogo = async (organisationId: string) =>
  (await httpClient.post<ApiSuccess<OrganizationLogo>>(`${BASE}/logo/delete`, { organisationId }))
    .data;
