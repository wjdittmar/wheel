// advantages over fetch
// common headers
// throw errors for non 200 responses
// typed error handling
// typing for response data
// timeout handling / retries

import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from "axios";

export type ApiResponse<T = any> = {
    data: T;
    status: number;
    statusText: string;
};

export type ApiError = {
    message: string;
    status?: number;
    data?: any;
};

// Use the same BASE_URL for all requests
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

class ApiClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: BASE_URL,
            // set common headers
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                // could check token here
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        // Response interceptor
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {
                const apiError: ApiError = {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                };
                return Promise.reject(apiError);
            },
        );
    }

    public async get<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.get<T>(url, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }

    public async post<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.post<T>(url, data, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }

    public async put<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.put<T>(url, data, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }

    public async delete<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.delete<T>(url, config);
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }
}

// singleton instance of the API client
// if there is a need for multiple api clients with different configurations could use a registry pattern as for server api client

export const apiClient = new ApiClient();
