import { Schema, type Document, type Types } from "mongoose";

export interface IIcebreaker extends Document{
    user: Types.ObjectId;
    contact: Types.ObjectId;
    text: string;
    createdAt:Date
}


const icebreakerSchema = new Schema<IIcebreaker>(
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
        text: {
            type: String,
            required:true
        }
    },
    {timestamps:{createdAt:true,updatedAt:false}}
)