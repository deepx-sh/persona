import { Template } from "../models/template.model.js";

const SYSTEM_TEMPLATE = [
    {
        name: "Recruitment",
        category: "recruitment" as const,
        description: "Reach out about a specific job opportunity or role",
        promptGuidance: "Position this message as a recruiter or hiring manager reaching out about a specific role that matches the recipient's background. Reference their apparent skills/experience as the reason for contact. Mention next step is a quick intro call.",
        isSystemDefault:true
    },
    {
        name: "SaaS Sales",
        category: "saas_sales" as const,
        description: "Introduction a product/tool relevant to their role or company.",
        promptGuidance: "Position this message as introducing a SaaS product relevant to the recipient's role and industry. Focus on one specific pain point their role likely faces, and how the product addresses it. Avoid generic 'our product does everything' language. CTA: offer a short demo.",
        isSystemDefault:true
    },
    {
        name: "Partnership",
        category: "partnership" as const,
        description: "Propose a business or collaboration partnership.",
        promptGuidance: "Position this message as proposing a potential partnership or collaboration between compnies. Reference their company's apparent focus area and how a partnership could be mutually beneficial. Keep it exploratory, not hard pitch. CTA: gauge interest in a conversation",
        isSystemDefault:true
    },
    {
        name: "Investor Outreach",
        category: "investor_outreach" as const,
        description: "Reach out to a potential investor about your startup.",
        promptGuidance: "Position this message as a foundar reaching out to a potential investor. Reference the investor's apparent focus/background as relevant to the startup's space. Be concise and confident, not desperate. CTA:offer to share a deck or have a shor call",
        isSystemDefault:true
    }
]

export const seedSystemTemplates = async (userId: string) => {
    const existing = await Template.countDocuments({ user: userId, isSystemDefault: true })
    if (existing > 0) return;
    await Template.insertMany(
         SYSTEM_TEMPLATE.map((t)=>({...t,user:userId}))
     )
}