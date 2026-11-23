import type { MessageLanguage, MessageTone, MessageType } from "@/types/message";

export const messageTypesLabels: Record<MessageType, string> = {
    linkedin_note: "Linkedin note",
    cold_email: "Cold email",
    follow_up:"Follow-up"
}

export const toneLabels: Record<MessageTone, string> = {
    professional: "Professional",
    friendly: "Friendly",
    casual: "Casual",
    direct:"Direct"
}

export const languageLabels: Record<MessageLanguage, string> = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    de:"German"
}