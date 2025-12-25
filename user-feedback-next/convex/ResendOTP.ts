import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";

export const ResendOTP = Resend({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 20, // 20 minutes

  async generateVerificationToken() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return String(array[0] % 1000000).padStart(6, "0");
  },

  async sendVerificationRequest({ identifier: email, token, provider }) {
    const resend = new ResendAPI(provider.apiKey);

    const { error } = await resend.emails.send({
      from: process.env.AUTH_EMAIL_FROM || "onboarding@resend.dev",
      to: [email],
      subject: "Your Votivy verification code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #333; margin-bottom: 24px; font-weight: 500;">Verify your email</h2>
          <p style="color: #666; margin-bottom: 24px; line-height: 1.5;">
            Enter the following code to complete your sign-up:
          </p>
          <div style="background: #f5f5f5; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 600; letter-spacing: 8px; color: #333;">
              ${token}
            </span>
          </div>
          <p style="color: #999; font-size: 13px; line-height: 1.5;">
            This code expires in 20 minutes. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
      text: `Your Votivy verification code is: ${token}. This code expires in 20 minutes.`,
    });

    if (error) {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  },
});
