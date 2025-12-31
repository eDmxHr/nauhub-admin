import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.7:8000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = Cookies.get("admin_auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error status codes
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          Cookies.remove("admin_auth_token");
          // You can add redirect logic here
          // window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 422:
          // Validation error
          console.error("Validation error:", error.response.data);
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error: No response received");
    } else {
      // Error in request configuration
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // GET request
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  // POST request
  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  // PUT request
  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },

  // Upload file with multipart/form-data
  upload: <T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
  },
};

// Auth helper methods
export const auth = {
  // Set auth token
  setToken: (token: string, options?: Cookies.CookieAttributes): void => {
    Cookies.set("admin_auth_token", token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // CSRF protection
      ...options,
    });
  },

  // Get auth token
  getToken: (): string | undefined => {
    return Cookies.get("admin_auth_token");
  },

  // Remove auth token
  removeToken: (): void => {
    Cookies.remove("admin_auth_token");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },
};

export default apiClient;
