import genAI from "../config/geminiAI.js";
import { ApiError } from "../utils/ApiError.js";


interface AnalyzedProfileResult{
    jobTitle: string;
    skills: string[];
    about: string;
}

export const analyzeProfileText = async(
    name: string,
    company: string,
    role: string,
    rawProfileText:string
): Promise<AnalyzedProfileResult> => {
    const prompt = `
You are analyzing a professional profile for cold outreach personalization.

Known info:
- Name: ${name}
- Company: ${company}
- Role: ${role}

Raw profile text (About section, headline, etc.):
"""
${rawProfileText}
"""

Extract and return ONLY a JSON object with this exact shape, no markdown, no extra text:
{
  "jobTitle": "string - their precise current job title, refine from Role if needed",
  "skills": ["array", "of", "5-8", "key skills or focus areas mentioned or implied"],
  "about": "string - a concise 2-3 sentence summary of who they are professionally, written in third person, suitable for personalizing an outreach message"
}
`.trim();
   
    let text: string;
    try {
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents:prompt
        })
        text = result.text?.trim() || "";
    } catch (error) {
        console.log(error)
        throw new ApiError(502,"AI analysis service failed")
    }

    try {
        console.log(text);
     
        const parsed = JSON.parse(text);
        console.log(parsed)
        if (!parsed.jobTitle || !Array.isArray(parsed.skills) || !parsed.about) {
            throw new Error("Malformed AI response shape")
        }

        return parsed as AnalyzedProfileResult;
    } catch (error) {
        console.log(error);
        
        throw new ApiError(502,"AI returned an unexpected response format")
    }
}