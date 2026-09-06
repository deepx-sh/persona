import type { Document,Types } from "mongoose";
export interface IAnalyzedProfile{
    jobTitle?: string;
    skills?: string[];
    about?: string;
    analyzedAt?: Date;
}

export interface IContact extends Document{
    user: Types.ObjectId;
    name: string;
    company: string;
    role: string;
    linkedinUrl: string;
    analyzedProfile?: IAnalyzedProfile;
    createdAt: Date;
    updatedAt: Date;
}