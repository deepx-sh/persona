export const buildVerificationEmail = (url: string): string => `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
    <h2 style="color: #0f172a;">Verify your Persona account</h2>
    <p style="color: #334155;">Click the button below to verify your email address.</p>
    <a href="${url}" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; margin-top: 12px;">
      Verify Email
    </a>
    <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">If you didn't create this account, you can ignore this email.</p>
  </div>
`