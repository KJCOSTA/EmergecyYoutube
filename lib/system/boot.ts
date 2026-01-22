import { apiRegistry, ApiStatus } from "./api-registry";

export interface BootReport {
  status: "ONLINE" | "DEGRADED";
  apis: Record<string, ApiStatus>;
}

export async function systemBoot(): Promise<BootReport> {
  const apis: Record<string, ApiStatus> = {};
  let degraded = false;

  for (const api of apiRegistry) {
    const status = await api.check();
    apis[api.name] = status;
    if (status !== "ONLINE") degraded = true;
  }

  return {
    status: degraded ? "DEGRADED" : "ONLINE",
    apis
  };
}
