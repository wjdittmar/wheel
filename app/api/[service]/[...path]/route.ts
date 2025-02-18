import { NextRequest } from "next/server";
import { serviceRegistry } from "@/lib/api/serviceRegistry";

export async function GET(
    request: NextRequest,
    { params }: { params: { service: string; path: string[] } },
) {
    try {
        const searchParams = Object.fromEntries(
            new URL(request.url).searchParams.entries(),
        );

        const service = serviceRegistry.getService(params.service);

        const endpoint = `/${params.path.join("/")}`;

        const data = await service.get(endpoint, { params: searchParams });

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        if (error.message.includes("not found")) {
            return new Response(
                JSON.stringify({ error: "Service not found" }),
                { status: 404 },
            );
        }

        return new Response(
            JSON.stringify({
                error: error.message || "API request failed",
                details: error.response?.data || {},
            }),
            {
                status: error.response?.status || 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
