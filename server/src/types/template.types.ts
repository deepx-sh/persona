import type { Document, Types } from "mongoose";

export type TemplateCategory = "recruitment" | "saas_sales" | "partnership" | "investor_outrich" | "custom";

export interface ITemplate extends Document{
    user: Types.ObjectId;
    name: string;
    category: TemplateCategory;
    description?: string;
    promptGuidence: string;
    isSystemDefault: boolean;
    createdAt: Date;
    updatedAt:Date
}
