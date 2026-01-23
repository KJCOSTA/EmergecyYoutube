import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  WorkflowStep,
  ContextData,
  ResearchData,
  ProposalData,
  StoryboardData,
  RenderData,
  UploadData,
  GuidelinesData,
  Diretriz,
  BrandingConfig,
} from "@/types";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Workflow Store
// ============================================
interface WorkflowStore {
  currentStep: WorkflowStep;
  context: ContextData | null;
  research: ResearchData | null;
  proposal: ProposalData | null;
  storyboard: StoryboardData | null;
  render: RenderData | null;
  upload: UploadData | null;

  // Navigation
  setStep: (step: WorkflowStep) => void;
  canNavigateToStep: (step: WorkflowStep) => boolean;

  // Context (Step 1)
  setContext: (context: ContextData) => void;
  clearContext: () => void;

  // Research (Step 2)
  setResearch: (research: ResearchData) => void;
  clearResearch: () => void;

  // Proposal (Step 4)
  setProposal: (proposal: ProposalData) => void;
  updateProposal: (updates: Partial<ProposalData>) => void;
  clearProposal: () => void;

  // Storyboard (Step 5)
  setStoryboard: (storyboard: StoryboardData) => void;
  updateStoryboard: (updates: Partial<StoryboardData>) => void;
  clearStoryboard: () => void;

  // Render (Step 5)
  setRender: (render: RenderData) => void;
  updateRender: (updates: Partial<RenderData>) => void;
  clearRender: () => void;

  // Upload (Step 6)
  setUpload: (upload: UploadData) => void;
  updateUpload: (updates: Partial<UploadData>) => void;
  clearUpload: () => void;

  // Reset all
  resetWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      context: null,
      research: null,
      proposal: null,
      storyboard: null,
      render: null,
      upload: null,

      setStep: (step) => {
        if (get().canNavigateToStep(step)) {
          set({ currentStep: step });
        }
      },

      canNavigateToStep: (step) => {
        const { context, research, proposal, storyboard } = get();

        switch (step) {
          case 1:
            return true;
          case 2:
            return context !== null;
          case 4:
            return research !== null;
          case 5:
            return proposal !== null && proposal.allApproved;
          case 6:
            return storyboard !== null;
          default:
            return false;
        }
      },

      setContext: (context) => set({ context }),
      clearContext: () => set({ context: null }),

      setResearch: (research) => set({ research }),
      clearResearch: () => set({ research: null }),

      setProposal: (proposal) => set({ proposal }),
      updateProposal: (updates) =>
        set((state) => ({
          proposal: state.proposal ? { ...state.proposal, ...updates } : null,
        })),
      clearProposal: () => set({ proposal: null }),

      setStoryboard: (storyboard) => set({ storyboard }),
      updateStoryboard: (updates) =>
        set((state) => ({
          storyboard: state.storyboard
            ? { ...state.storyboard, ...updates }
            : null,
        })),
      clearStoryboard: () => set({ storyboard: null }),

      setRender: (render) => set({ render }),
      updateRender: (updates) =>
        set((state) => ({
          render: state.render ? { ...state.render, ...updates } : null,
        })),
      clearRender: () => set({ render: null }),

      setUpload: (upload) => set({ upload }),
      updateUpload: (updates) =>
        set((state) => ({
          upload: state.upload ? { ...state.upload, ...updates } : null,
        })),
      clearUpload: () => set({ upload: null }),

      resetWorkflow: () =>
        set({
          currentStep: 1,
          context: null,
          research: null,
          proposal: null,
          storyboard: null,
          render: null,
          upload: null,
        }),
    }),
    {
      name: "emergency-youtube-workflow",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================
// Guidelines Store (Global - Not a step)
// ============================================
interface GuidelinesStore {
  guidelines: GuidelinesData;

  // CRUD Operations
  addDiretriz: (diretriz: Omit<Diretriz, "id" | "createdAt" | "updatedAt">) => void;
  updateDiretriz: (id: string, updates: Partial<Diretriz>) => void;
  deleteDiretriz: (id: string) => void;
  toggleDiretriz: (id: string) => void;

  // Getters
  getActiveDiretrizes: () => Diretriz[];
  getDiretrizesForScope: (scope: Diretriz["appliesTo"][number]) => Diretriz[];
}

const defaultGuidelines: GuidelinesData = {
  diretrizes: [],
  updatedAt: new Date().toISOString(),
};

export const useGuidelinesStore = create<GuidelinesStore>()(
  persist(
    (set, get) => ({
      guidelines: defaultGuidelines,

      addDiretriz: (diretriz) => {
        const now = new Date().toISOString();
        const newDiretriz: Diretriz = {
          ...diretriz,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          guidelines: {
            diretrizes: [...state.guidelines.diretrizes, newDiretriz],
            updatedAt: now,
          },
        }));
      },

      updateDiretriz: (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          guidelines: {
            diretrizes: state.guidelines.diretrizes.map((d) =>
              d.id === id ? { ...d, ...updates, updatedAt: now } : d
            ),
            updatedAt: now,
          },
        }));
      },

      deleteDiretriz: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          guidelines: {
            diretrizes: state.guidelines.diretrizes.filter((d) => d.id !== id),
            updatedAt: now,
          },
        }));
      },

      toggleDiretriz: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          guidelines: {
            diretrizes: state.guidelines.diretrizes.map((d) =>
              d.id === id ? { ...d, active: !d.active, updatedAt: now } : d
            ),
            updatedAt: now,
          },
        }));
      },

      getActiveDiretrizes: () => {
        return get().guidelines.diretrizes.filter((d) => d.active);
      },

      getDiretrizesForScope: (scope) => {
        return get()
          .guidelines.diretrizes.filter((d) => d.active && d.appliesTo.includes(scope));
      },
    }),
    {
      name: "emergency-youtube-guidelines",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================
// UI Store (Non-persistent)
// ============================================
interface UIStore {
  isSidebarOpen: boolean;
  isGuidelinesModalOpen: boolean;
  isApiKeyModalOpen: boolean;
  isConnectApisModalOpen: boolean;
  activeModal: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openGuidelinesModal: () => void;
  closeGuidelinesModal: () => void;
  openApiKeyModal: () => void;
  closeApiKeyModal: () => void;
  setConnectApisModalOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isSidebarOpen: true,
  isGuidelinesModalOpen: false,
  isApiKeyModalOpen: false,
  isConnectApisModalOpen: false,
  activeModal: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openGuidelinesModal: () => set({ isGuidelinesModalOpen: true }),
  closeGuidelinesModal: () => set({ isGuidelinesModalOpen: false }),
  openApiKeyModal: () => set({ isApiKeyModalOpen: true }),
  closeApiKeyModal: () => set({ isApiKeyModalOpen: false }),
  setConnectApisModalOpen: (open) => set({ isConnectApisModalOpen: open }),
  setActiveModal: (modal) => set({ activeModal: modal }),
}));

// ============================================
// Branding Store (White Label System)
// ============================================
interface BrandingStore {
  systemName: string;
  logoUrl: string | null;
  setSystemName: (name: string) => void;
  setLogoUrl: (url: string | null) => void;
  setBranding: (systemName: string, logoUrl: string | null) => void;
  resetBranding: () => void;
}

const defaultBranding = {
  systemName: "ORION",
  logoUrl: null,
};

export const useBrandingStore = create<BrandingStore>()(
  persist(
    (set) => ({
      systemName: defaultBranding.systemName,
      logoUrl: defaultBranding.logoUrl,

      setSystemName: (name) => set({ systemName: name }),
      setLogoUrl: (url) => set({ logoUrl: url }),
      setBranding: (systemName, logoUrl) => set({ systemName, logoUrl }),
      resetBranding: () => set(defaultBranding),
    }),
    {
      name: "orion-branding",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
