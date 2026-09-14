import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./auth-schema";
import { organization } from "better-auth/plugins"
import { dash } from "@better-auth/infra";
import {
  sendOrganizationInvitationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "./email";


const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ to: user.email, url });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ to: user.email, url });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [organization({
    teams:{
      enabled: true,
    },
    organizationLimit: 1,
    sendInvitationEmail: async (data) => {
      const url = `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/accept-invitation/${data.id}`;
      await sendOrganizationInvitationEmail({
        to: data.email,
        organizationName: data.organization.name,
        inviterName: data.inviter.user.name,
        role: data.role,
        url,
      });
    },
  }),dash({
    apiKey: process.env.BETTER_AUTH_API_KEY,
    activityTracking:{
      enabled: true,
      updateInterval: 300000
    }
  })],
});

