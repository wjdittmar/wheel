import { ServerApiClient } from "./serverApiClient";

interface ServiceConfig {
    baseURL: string;
    apiKey?: string;
    apiKeyHeader?: string;
    apiKeyPrefix?: string;
}

class ServiceRegistry {
    private static instance: ServiceRegistry;
    private initialized = false;
    private services: Map<string, ServerApiClient> = new Map();

    private constructor() {}

    static getInstance(): ServiceRegistry {
        if (!ServiceRegistry.instance) {
            ServiceRegistry.instance = new ServiceRegistry();
        }
        return ServiceRegistry.instance;
    }

    initialize() {
        if (this.initialized) return;

        if (process.env.GITHUB_API_URL && process.env.GITHUB_API_KEY) {
            this.registerService("github", {
                baseURL: process.env.GITHUB_API_URL,
                apiKey: process.env.GITHUB_API_KEY,
                apiKeyHeader: "Authorization",
                apiKeyPrefix: "Bearer",
            });
        }
        if (
            process.env.EXTERNAL_SERVICE_URL &&
            process.env.EXTERNAL_SERVICE_API_KEY
        ) {
            this.registerService("externalService", {
                baseURL: process.env.EXTERNAL_SERVICE_URL,
                apiKey: process.env.EXTERNAL_SERVICE_API_KEY,
            });
        }

        this.initialized = true;
    }

    private registerService(serviceName: string, config: ServiceConfig) {
        const client = new ServerApiClient(
            config.baseURL,
            config.apiKey,
            config.apiKeyHeader,
            config.apiKeyPrefix,
        );
        this.services.set(serviceName, client);
    }

    getService(serviceName: string): ServerApiClient {
        if (!this.initialized) {
            this.initialize();
        }

        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }
        return service;
    }
}

// Singleton
export const serviceRegistry = ServiceRegistry.getInstance();
