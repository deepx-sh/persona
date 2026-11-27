"use client";

import { languageLabels,messageTypesLabels,toneLabels } from "@/config/labels";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { ApiRequestError } from "@/lib/api";
import { MessageSquareText,Sparkles,UserCheck,Users } from "lucide-react";
import { ErrorState } from "../shared/error-state";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { StatCard } from "./stat-card";
import { BreakdownCard } from "./breakdown-card";
import { RecentMessages } from "./recent-messages";


export function DashboardOverview() {
    const { data, isPending, isError, error, refetch } = useDashboardStats()
    
    if (isPending) {
        return <DashboardSkeleton/>
    }

    if (isError || !data) {
        return(
            <ErrorState
                title="Couldn't load your dashboard"
                message={error instanceof ApiRequestError ? error.message : "Something went wrong"}
                onRetry={()=>refetch()}
            />
        )
    }

    const { totals, messageBreakdown, recentMessages } = data;
    const analyzedShare = totals.contacts > 0 ? Math.round((totals.analyzedContacts / totals.contacts) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total contacts" value={totals.contacts} icon={Users} />
                <StatCard
                    label="Profiles analyzed"
                    value={totals.analyzedContacts}
                    icon={UserCheck}
                    caption={totals.contacts>0? `${analyzedShare}% of your contacts`:"No contacts yet"}
                />
                <StatCard label="Messages generated" value={totals.messages} icon={MessageSquareText} />
                <StatCard label="Icebreakers" value={totals.icebreakers} icon={Sparkles}/>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <RecentMessages messages={recentMessages} className="lg:col-span-2" />
                
                <div className="space-y-4">
                    <BreakdownCard
                        title="By message type"
                        data={messageBreakdown.byType}
                        labels={messageTypesLabels}
                    />

                    <BreakdownCard
                        title="By language"
                        data={messageBreakdown.byLanguage}
                        labels={languageLabels}
                    />

                    <BreakdownCard title="By tone" data={messageBreakdown.byTone} labels={toneLabels}/>
                </div>
            </div>
        </div>
    )
}
