import type { Document, Types } from "mongoose";

export type MessageType = "linkedin_note" | "cold_email" | "follow_up";

export type MessageTone = "professional" | "friendly" | "casual" | "direct"

export interface IMessage extends Document {
    user: Types.ObjectId;
    contact: Types.ObjectId;
    type: MessageType;
    tone: MessageTone;
    subject?: string;
    content: string;
    createdAt: Date;
    updatedAt:Date
}