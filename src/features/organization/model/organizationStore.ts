import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getMyOrganizations } from "../api/organizationApi";
import type { CreatedOrganization, OrganizationPreview } from "./types";

type OrganizationState = {
  items: OrganizationPreview[];
  details: Record<string, CreatedOrganization>;
  selectedId: string | null;
  userId: string | null;
  loadedUserId: string | null;
  isLoading: boolean;
  error: string | null;
  load: (userId: string) => Promise<OrganizationPreview[]>;
  select: (id: string | null) => void;
  addCreated: (organization: CreatedOrganization) => void;
  updateDetails: (id: string, changes: Partial<CreatedOrganization>) => void;
};

type InFlightOrganizationsRequest = {
  userId: string;
  promise: Promise<OrganizationPreview[]>;
};

let inFlightRequest: InFlightOrganizationsRequest | null = null;
let requestGeneration = 0;

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      items: [],
      details: {},
      selectedId: null,
      userId: null,
      loadedUserId: null,
      isLoading: false,
      error: null,
      load: async (userId) => {
        if (inFlightRequest?.userId === userId) return inFlightRequest.promise;

        const generation = ++requestGeneration;
        set((state) => ({
          isLoading: true,
          error: null,
          ...(state.userId === userId
            ? {}
            : {
                items: [],
                details: {},
                selectedId: null,
                userId,
                loadedUserId: null,
              }),
        }));

        const promise = getMyOrganizations()
          .then((items) => {
            if (generation === requestGeneration) {
              const selectedId = get().selectedId;
              set({
                items,
                userId,
                loadedUserId: userId,
                selectedId: items.some((item) => item.id === selectedId) ? selectedId : null,
                isLoading: false,
              });
            }
            return items;
          })
          .catch((error: unknown) => {
            if (generation === requestGeneration) {
              set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Не вдалося завантажити компанії",
              });
            }
            throw error;
          })
          .finally(() => {
            if (inFlightRequest?.promise === promise) inFlightRequest = null;
          });

        inFlightRequest = { userId, promise };
        return promise;
      },
      select: (selectedId) => set({ selectedId }),
      addCreated: (organization) =>
        set((state) => ({
          details: { ...state.details, [organization.id]: organization },
          items: [
            {
              id: organization.id,
              slug: organization.slug,
              displayName: organization.displayName,
              legalName: organization.legalName,
              organisationType: organization.organisationType,
              taxId: organization.taxId,
              logoUrl: organization.logoUrl,
              position: null,
              isOwner: true,
            },
            ...state.items.filter((item) => item.id !== organization.id),
          ],
          selectedId: organization.id,
        })),
      updateDetails: (id, changes) =>
        set((state) => ({
          details: state.details[id]
            ? { ...state.details, [id]: { ...state.details[id], ...changes } }
            : state.details,
          items: state.items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
        })),
    }),
    {
      name: "organization-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ details, selectedId, userId }) => ({ details, selectedId, userId }),
    },
  ),
);
