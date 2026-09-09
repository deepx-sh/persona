import mongoose, { Schema } from "mongoose";
import type { IAnalyzedProfile, IContact } from "../types/contact.types.js";

const analyzedProfileSchema = new Schema<IAnalyzedProfile>(
    {
        jobTitle: {
            type: String
        },
        skills: {
            type: [String],
            default: []
        },
        about: {
            type: String
        },
        analyzedAt: {
            type: Date
        },
    },
    {_id:false}
)

const contactSchema = new Schema<IContact>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim:true
    },
    company: {
        type: String,
        required: true,
        trim:true
    },
    role: {
        type: String,
        required: true,
        trim:true
    },
    linkedinUrl: {
        type: String,
        required: true,
        trim: true,
    },
    analyzedProfile: {
        type: analyzedProfileSchema,
        default:undefined
    }
}, { timestamps: true })

contactSchema.index({ user: 1, name: "text", company: "text", role: "text" })

export const Contact=mongoose.model<IContact>("Contact",contactSchema)