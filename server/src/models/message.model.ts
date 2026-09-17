import mongoose from "mongoose";
import { Schema, type Document, type Types } from "mongoose";
import type { IMessage } from "../types/message.types.js";

const messageSchema = new Schema<IMessage>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index:true
        },
        contact: {
            type: Schema.Types.ObjectId,
            ref: "Contact",
            required: true,
            index:true
        },
        type: {
            type: String,
            enum: ["linkedin_note", "cold_email", "follow_up"],
            required:true
        },
        tone: {
            type: String,
            enum: ["professional", "friendly", "casual", "direct"],
            default:"professional"
        },
        subject: {
            type:String
        },
        content: {
            type: String,
            required:true
        }
    },
    {timestamps:true}
)

export const Message=mongoose.model<IMessage>("Message",messageSchema)