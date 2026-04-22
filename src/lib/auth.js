import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";
import { magicLink } from "better-auth/plugins/magic-link";

import { prisma } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/resend";

const fallbackBaseURL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const authBaseURL = process.env.BETTER_AUTH_URL || fallbackBaseURL;

// Keep local/dev builds functional while still signaling production misconfiguration.
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  "dev-insecure-fallback-secret-change-before-production";

if (process.env.NODE_ENV !== "production" && !process.env.BETTER_AUTH_SECRET) {
  console.warn(
    "BETTER_AUTH_SECRET is not set. Using fallback secret; set BETTER_AUTH_SECRET in production."
  );
}

const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!trustedOrigins.includes(authBaseURL)) {
  trustedOrigins.push(authBaseURL);
}

export const auth = betterAuth({
  appName: "Sharma Real Estates",
  baseURL: authBaseURL,
  secret: authSecret,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "SUPER_ADMIN"],
        required: false,
        defaultValue: "ADMIN",
        input: false,
      },
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
  trustedOrigins,
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendTransactionalEmail({
          to: email,
          subject: "Your Sharma Real Estates verification code",
          html: `<p>Your OTP code is <strong>${otp}</strong>.</p><p>Flow: ${type}</p>`,
          text: `Your OTP code is ${otp}. Flow: ${type}.`,
        });
      },
    }),
    magicLink({
      async sendMagicLink({ email, url }) {
        await sendTransactionalEmail({
          to: email,
          subject: "Your Sharma Real Estates sign-in link",
          html: `<p>Use this secure link to sign in:</p><p><a href="${url}">${url}</a></p>`,
          text: `Use this secure link to sign in: ${url}`,
        });
      },
    }),
  ],
});
