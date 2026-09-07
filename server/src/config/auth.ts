import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { sendEmail } from "../utils/email.js";
import { buildVerificationEmail } from "../templates/verificationEmail.template.js";
import { buildResetPasswordEmail } from "../templates/resetPasswordEmail.template.js";


export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.db!),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your Persona password",
        htmlContent:buildResetPasswordEmail(url)
      })
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url,token },request) => {
      
      void sendEmail({
        to: user.email,
        subject: "Verify your Persona account",
        htmlContent:buildVerificationEmail(url)
      })
    },
    
    autoSignInAfterVerification:true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET as string
    }
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
});
