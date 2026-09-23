import mongoose, { Schema } from "mongoose";
import type { ITemplate } from "../types/template.types.js";

const templateSchema = new Schema<ITemplate>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index:true
        },
        name: {
            type: String,
            required: true,
            trim:true
        },
        category: {
            type: String,
            enum: ["recuitment", "saas_sales", "partnership", "investor_outreach", "custom"],
            required:true
        },
        description: {
            type:String
        },
        promptGuidence: {
            type: String,
            required:true
        },
        isSystemDefault: {
            type: Boolean,
            default:false
        }
    },
    {timestamps:true}
)

export const Template=mongoose.model<ITemplate>("Template",templateSchema)