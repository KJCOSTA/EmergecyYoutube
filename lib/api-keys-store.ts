import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StoredAPIKeys {
  youtube_api_key: string;
  youtube_channel_id: string;
  openai_api_key: string;
  google_api_key: string;
  anthropic_api_key: string;
  pexels_api_key: string;
  pixabay_api_key: string;
  unsplash_api_key: string;
  json2video_api_key: string;
  elevenlabs_api_key: string;
  tavily_api_key: string;
  replicate_api_key: string;
  stability_api_key: string;
}

export interface APIKeyTestResult {
  key: keyof StoredAPIKeys;
  success: boolean;
  message: string;
}

interface APIKeysStore {
  keys: StoredAPIKeys;
  testedKeys: Record<keyof StoredAPIKeys, boolean>;

  setKey: (key: keyof StoredAPIKeys, value: string) => void;
  setKeys: (keys: Partial<StoredAPIKeys>) => void;
  markKeyTested: (key: keyof StoredAPIKeys, success: boolean) => void;
  clearKey: (key: keyof StoredAPIKeys) => void;
  clearAllKeys: () => void;
  getKey: (key: keyof StoredAPIKeys) => string;
  hasKey: (key: keyof StoredAPIKeys) => boolean;
}

const defaultKeys: StoredAPIKeys = {
  youtube_api_key: "",
  youtube_channel_id: "",
  openai_api_key: "",
  google_api_key: "",
  anthropic_api_key: "",
  pexels_api_key: "",
  pixabay_api_key: "",
  unsplash_api_key: "",
  json2video_api_key: "",
  elevenlabs_api_key: "",
  tavily_api_key: "",
  replicate_api_key: "",
  stability_api_key: "",
};

const defaultTestedKeys: Record<keyof StoredAPIKeys, boolean> = {
  youtube_api_key: false,
  youtube_channel_id: false,
  openai_api_key: false,
  google_api_key: false,
  anthropic_api_key: false,
  pexels_api_key: false,
  pixabay_api_key: false,
  unsplash_api_key: false,
  json2video_api_key: false,
  elevenlabs_api_key: false,
  tavily_api_key: false,
  replicate_api_key: false,
  stability_api_key: false,
};

export const useAPIKeysStore = create<APIKeysStore>()(
  persist(
    (set, get) => ({
      keys: defaultKeys,
      testedKeys: defaultTestedKeys,

      setKey: (key, value) =>
        set((state) => ({
          keys: { ...state.keys, [key]: value },
          testedKeys: { ...state.testedKeys, [key]: false },
        })),

      setKeys: (keys) =>
        set((state) => ({
          keys: { ...state.keys, ...keys },
        })),

      markKeyTested: (key, success) =>
        set((state) => ({
          testedKeys: { ...state.testedKeys, [key]: success },
        })),

      clearKey: (key) =>
        set((state) => ({
          keys: { ...state.keys, [key]: "" },
          testedKeys: { ...state.testedKeys, [key]: false },
        })),

      clearAllKeys: () =>
        set({
          keys: defaultKeys,
          testedKeys: defaultTestedKeys,
        }),

      getKey: (key) => get().keys[key],

      hasKey: (key) => !!get().keys[key],
    }),
    {
      name: "emergency-youtube-api-keys",
      storage: createJSONStorage(() => sessionStorage), // Usar sessionStorage para segurança
    }
  )
);

// Helper para obter headers com as chaves da sessão
export function getAPIKeyHeaders(keys: StoredAPIKeys): Record<string, string> {
  const headers: Record<string, string> = {};

  if (keys.youtube_api_key) headers["x-youtube-api-key"] = keys.youtube_api_key;
  if (keys.youtube_channel_id) headers["x-youtube-channel-id"] = keys.youtube_channel_id;
  if (keys.openai_api_key) headers["x-openai-api-key"] = keys.openai_api_key;
  if (keys.google_api_key) headers["x-google-api-key"] = keys.google_api_key;
  if (keys.anthropic_api_key) headers["x-anthropic-api-key"] = keys.anthropic_api_key;
  if (keys.pexels_api_key) headers["x-pexels-api-key"] = keys.pexels_api_key;
  if (keys.pixabay_api_key) headers["x-pixabay-api-key"] = keys.pixabay_api_key;
  if (keys.unsplash_api_key) headers["x-unsplash-api-key"] = keys.unsplash_api_key;
  if (keys.json2video_api_key) headers["x-json2video-api-key"] = keys.json2video_api_key;
  if (keys.elevenlabs_api_key) headers["x-elevenlabs-api-key"] = keys.elevenlabs_api_key;
  if (keys.tavily_api_key) headers["x-tavily-api-key"] = keys.tavily_api_key;
  if (keys.replicate_api_key) headers["x-replicate-api-key"] = keys.replicate_api_key;
  if (keys.stability_api_key) headers["x-stability-api-key"] = keys.stability_api_key;

  return headers;
}
