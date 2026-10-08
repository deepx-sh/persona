import ExcelJS from "exceljs";
import { stringify } from "csv-stringify/sync";
import type { IContact } from "../types/contact.types.js";
import type { IMessage } from "../types/message.types.js";

interface ContactExportRows{
    Name: string;
    Company: string;
    Role: string;
    "LinkedIn URL": string;
    "Job Title": string;
    Skills: string;
    About:string
}

const contactsToRows = (contacts: IContact[]): ContactExportRows[] =>
    contacts.map((c) => ({
        Name: c.name,
        Company: c.company,
        Role: c.role,
        "LinkedIn URL": c.linkedinUrl,
        "Job Title": c.analyzedProfile?.jobTitle || "",
        Skills: (c.analyzedProfile?.skills || []).join(", "),
        About:c.analyzedProfile?.about || ""
    }))

interface MessageExportRow{
    "Contact Name": string;
    Company: string;
    Type: string;
    Tone: string;
    Language: string;
    Subject: string;
    Content: string;
    "Generated At":string
}
    
const messagesToRows = (messages: (IMessage & { contact: IContact })[]): MessageExportRow[] =>
    messages.map((m) => ({
        "Contact Name": m.contact?.name || "Unknown",
        Company: m.contact?.company || "",
        Type: m.type,
        Tone: m.tone,
        Language: m.language,
        Subject: m.subject || "",
        Content: m.content,
        "Generated At":m.createdAt.toISOString()
    }))

export const exportContactsCSV = (contacts: IContact[]): string => {
    const rows = contactsToRows(contacts);
    return stringify(rows,{header:true})
}
    
export const exportMessagesCSV = (messages: (IMessage & { contact: IContact })[]): string => {
    const rows = messagesToRows(messages);
    return stringify(rows,{header:true})
}

export const exportContactsExcel = async (contacts: IContact[]): Promise<ExcelJS.Buffer> => {
    const rows = contactsToRows(contacts);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Contacts");

    const firstRow = rows[0];
    if (firstRow) {
        sheet.columns = Object.keys(firstRow).map((key) => ({ header: key, key, width: 25 }))
        sheet.addRows(rows);
        sheet.getRow(1).font={bold:true}
    }

    return workbook.xlsx.writeBuffer()
}

export const exportMessageExcel = async (messages: (IMessage & { contact: IContact })[]): Promise<ExcelJS.Buffer> => {
    const rows = messagesToRows(messages)
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Messages")
    
    const firstRow = rows[0];
    if (firstRow) {
        sheet.columns = Object.keys(firstRow).map((key) => ({ header: key, key, width: 30 }))
        sheet.addRow(rows);
        sheet.getRow(1).font={bold:true}
    }

    return workbook.xlsx.writeBuffer()
}