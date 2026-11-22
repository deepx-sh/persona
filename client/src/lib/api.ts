const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiRequestError extends Error{
    status: number;
    errors: unknown[];

    constructor(status: number, message: string, errors: unknown[] = []) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
        this.errors = errors;
    }
}

interface ApiEnvelop<T>{
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T>{
    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
    }

    let response: Response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...init,
            credentials: "include",
            headers:{Accept:"application/json",...init?.headers}
        })
    } catch  {
        throw new ApiRequestError(0,"Couldn't reach the server. Check your connection and try again.")
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiRequestError(
            response.status,
            body?.message || "Something went wrong. Please try again.",
            body?.errors ?? []
        )
    }

    return (body as ApiEnvelop<T>).data;
}

export const apiGet = <T>(path: string) => request<T>(path);