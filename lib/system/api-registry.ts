export type ApiStatus = "ONLINE" | "OFFLINE";

export interface ApiCheck {
  name: string;
  env: string;
  check: () => Promise<ApiStatus>;
}

export const apiRegistry: ApiCheck[] = [
  {
    name: "GEMINI",
    env: "GOOGLE_API_KEY",
    check: async () => {
      return process.env.GOOGLE_API_KEY ? "ONLINE" : "OFFLINE";
    }
  }
];
