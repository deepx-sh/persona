import genAI from "../config/geminiAI.js";
import { ApiError } from "../utils/ApiError.js";
import type { IContact } from "../types/contact.types.js";

export const generateIcebreakers = async (contact: IContact, count: number): Promise<string[]> => {
    const profile = contact.analyzedProfile;

    const context = profile ? `Job Title: ${profile.jobTitle}\nAbout: ${profile.about}\nSkills: ${(profile.skills || []).join(", ")}`
        : `Role: ${contact.role} at ${contact.company} (limited profile data available)`
    
    const prompt = `Generate ${count} short, punchy icebreaker lines to open a cold outreach message to this person.

${contact.name}, ${contact.company}
${context}

Rules:
- Each icebreaker is ONE short sentence, under 15 words.
- Reference something specific and genuine-sounding about their role, company, or background — never generic ("I saw your profile...").
- No greetings ("Hi X") — these are just the opening hook line, used before the greeting.

Return ONLY a JSON object: { "icebreakers": ["...", "...", "..."] }`.trim();
    
    let text: string;

    try {
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents:prompt
        })
        text=result.text?.trim() || ""
    } catch (error) {
        throw new ApiError(502,"AI icebreaker generation failed")
    }

    try {
        const jsonText = text
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
        
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed.icebreakers)) throw new Error("Malformed response")
        return parsed.icebreakers;
    } catch (error) {
        throw new ApiError(502,"AI returned an unexpected response format")
    }
}