// axios for types, interceptors, error handling, timeout
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from "axios";

export class ServerApiClient {
    protected instance: AxiosInstance;

    constructor(
        baseURL: string,
        private apiKey?: string,
        private apiKeyHeader: string = "Authorization",
        private apiKeyPrefix: string = "Bearer",
    ) {
        this.instance = axios.create({
            baseURL,
            headers: this.getHeaders(),
        });

        this.setupInterceptors();
    }

    private getHeaders() {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (this.apiKey) {
            headers[this.apiKeyHeader] = `${this.apiKeyPrefix} ${this.apiKey}`;
        }

        return headers;
    }

    // common error handling
    // could also add token refresh here
    private setupInterceptors() {
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                return Promise.reject({
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                });
            },
        );
    }

    // could add request logging here
    protected async request<T>(config: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.request<T>(config);
        return response.data;
    }

    public async get<T>(
        endpoint: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>({ ...config, method: "GET", url: endpoint });
    }

    public async post<T>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>({
            ...config,
            method: "POST",
            url: endpoint,
            data,
        });
    }

    public async put<T>(
        endpoint: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>({
            ...config,
            method: "PUT",
            url: endpoint,
            data,
        });
    }

    public async delete<T>(
        endpoint: string,
        config?: AxiosRequestConfig,
    ): Promise<T> {
        return this.request<T>({ ...config, method: "DELETE", url: endpoint });
    }
}
