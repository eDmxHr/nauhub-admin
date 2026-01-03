import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// Integration types
export interface Integration {
  service: string;
  name: string;
  configured: boolean;
  status?: string;
  fields?: {
    account_id?: string;
    api_token?: string;
    customer_subdomain?: string;
  };
}

export interface IntegrationSettings {
  cloudflare: Integration;
  putio: Integration;
}

// Response types
interface IntegrationsResponse {
  integrations: Integration[];
}

interface TestConnectionResponse {
  success: boolean;
  message: string;
}

// Fetch integration settings
export function useIntegrations() {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      try {
        const response = await api.get<IntegrationsResponse>(
          "/admin/integrations"
        );
        console.log(response.data);
        const integrations = response.data.integrations;

        // Transform array to object with service keys
        const settings: IntegrationSettings = {
          cloudflare: integrations.find((i) => i.service === "cloudflare") || {
            service: "cloudflare",
            name: "Cloudflare Stream",
            configured: false,
          },
          putio: integrations.find((i) => i.service === "putio") || {
            service: "putio",
            name: "Put.io",
            configured: false,
          },
        };

        return settings;
      } catch (error) {
        console.error("Error fetching integrations:", error);
        throw error;
      }
    },
  });
}

// Test Cloudflare connection
export function useTestCloudflare() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<TestConnectionResponse>(
        "/admin/integrations/cloudflare/test"
      );
      return response.data;
    },
  });
}

// Test Put.io connection
export function useTestPutio() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<TestConnectionResponse>(
        "/admin/integrations/putio/test"
      );
      return response.data;
    },
  });
}
