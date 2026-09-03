import { BrevoClient } from "@getbrevo/brevo";
import type { SendEmailParams } from "../types/email.types.js";

const client = new BrevoClient({
    apiKey:process.env.BREVO_API_KEY as string
})

export const sendEmail = async ({ to, subject, htmlContent }: SendEmailParams)=>{
    try {
        await client.transactionalEmails.sendTransacEmail({
            subject: subject,
            htmlContent: htmlContent,
            sender: {
                name: "Persona",
                email:process.env.BREVO_FROM_EMAIL 
            },
            to: [
                {
                    email:to
                }
            ]
        })
        console.log(`Sucessfully email sent to ${to}`);
        
    } catch (error) {
        console.error("Brevo email error:",error);
        throw new Error("Failed to send email")
    }
}