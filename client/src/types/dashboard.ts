import type { MessageLanguage, MessageTone, MessageType } from "./message";

export interface RecentMessage{
    _id: string;
    type: MessageType;
    tone: MessageTone;
    language: MessageLanguage;
    subject?: string;
    content: string;
    variantLabel?: "A" | "B" | "C";
    createdAt: string;
    contact: { _id: string; name: string; company: string } | null;
}

export interface DashboardStats{
    totals: {
        contacts: number;
        analyzedContacts: number;
        messages: number;
        icebreakers: number;
    }
    messageBreakdown: {
        byType: Record<string, number>;
        byLanguage: Record<string, number>;
        byTone: Record<string, number>
    };
    recentMessages: RecentMessage[];
}