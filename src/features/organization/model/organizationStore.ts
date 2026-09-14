import { create } from "zustand";
import { getMyOrganizations } from "../api/organizationApi";
import type { CreatedOrganization, OrganizationPreview } from "./types";

type OrganizationState = {
  items: OrganizationPreview[];
  details: Record<string, CreatedOrganization>;
  selectedId: string | null;
  userId: string | null;
  isLoading: boolean;
  error: string | null;
  load: (userId: string) => Promise<OrganizationPreview[]>;
  select: (id: string | null) => void;
  addCreated: (organization: CreatedOrganization) => void;
  updateDetails: (id: string, changes: Partial<CreatedOrganization>) => void;
};
export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  items: [],
  details: {},
  selectedId: null,
  userId: null,
  isLoading: false,
  error: null,
  load: async (userId) => {
    set((state) => ({
      isLoading: true,
      error: null,
      ...(state.userId === userId ? {} : { items: [], selectedId: null, userId }),
    }));
    try {
      const items = await getMyOrganizations();
      const selectedId = get().selectedId;
      set({
        items,
        userId,
        selectedId: items.some((item) => item.id === selectedId) ? selectedId : null,
        isLoading: false,
      });
      return items;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Не вдалося завантажити організації",
      });
      throw error;
    }
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
          organisationType: organization.organisationType,
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
}));
