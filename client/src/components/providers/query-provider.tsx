"use client";

import { ApiRequestError } from "@/lib/api";
import { QueryCache,QueryClient,QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";


export function QueryProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error) => {
                    if (error instanceof ApiRequestError && error.status === 401) {
                        router.push("/signin")
                    }
                }
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 30 * 1000,
                        retry: (failureCount, error) => {
                            if (error instanceof ApiRequestError && error.status >= 400 && error.status < 500) {
                                return false
                            }
                            return failureCount < 2;
                        }
                    }
                }
            }),
        
    )
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}