import genAI from "../config/geminiAI.js";
import { ApiError } from "../utils/ApiError.js";
import type { IContact } from "../types/contact.types.js";
import type { MessageType, MessageTone } from "../types/message.types.js";

interface GeneratedMessage{
    subject?: string;
    content: string;
}

const typeInstructions: Record<MessageType, string> = {
    linkedin_note:
        "Write a LinkedIn connection request note. Maximum 300 characters (LinkedIn's hard limit). No subject line. Be warm but brief - this is the first touchpoint.",
    cold_email:
        "Write a cold outreach email. Include a compelling subject line. Body should be 3-5 short paragraphs, end with a clear low-friction call to action (e.g. 'worth a quick chat?').",
    follow_up:
    "Write a follow-up email, assuming no response to a prior first message. Include a subject line (can reference 'following up'). Keep it short, add one new piece of value or angle, and make it easy to say yes to."
}

const toneInstructions: Record<MessageTone, string>= {
    professional: "Formal, polished, respectful of their time.",
    friendly: "Warm, personable, conversational but still respectful.",
    casual: "Relaxed, informal, like messaging a peer.",
    direct:"Get straight to the point, no fluff, minimal pleasantries."
}

export const generateMessage = async (contact: IContact,
    type: MessageType,
    tone:MessageTone
): Promise<GeneratedMessage> => {
   
    const profile = contact.analyzedProfile;

    const profileContext = profile ? `Job Title: ${profile.jobTitle || contact.role} Skills: ${(profile.skills || []).join(", ")} About: ${profile.about || "N/A"}` : `Role: ${contact.role} (profile not yet analyzed - use only this and company info)`
    
    const prompt=
   `
You are writing a cold outreach message for a sales/networking purpose.

Recipient:
- Name: ${contact.name}
- Company: ${contact.company}
${profileContext}

Message type: ${type}
Instructions for this type: ${typeInstructions[type]}

Tone: ${tone}
Tone guidance: ${toneInstructions[tone]}

Return ONLY a JSON object with this exact shape, no markdown, no extra text:
{
  "subject": "string or empty string if not applicable (e.g. for linkedin_note)",
  "content": "string - the full message body"
}
`.trim();
    
    let text: string;
    try {
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents:prompt
        })

        text = result.text?.trim() || ""
    } catch (error) {
        throw new ApiError(502,"AI message generation failed")
    }

    try {
        const parsed = JSON.parse(text)
        
        if (typeof parsed.content !== "string" || !parsed.content.trim()) {
            throw new Error("Malformed AI response")
        }

        return {
            subject: parsed.subject || undefined,
            content:parsed.content
        }
    } catch (error) {
        throw new ApiError(502,"AI returned an unexpected response format")
    }

}