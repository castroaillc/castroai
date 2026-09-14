import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function getFrom() {
  const from = process.env.RESEND_FROM_EMAIL
  if (!from) {
    throw new Error(
      "RESEND_FROM_EMAIL is not set. Add a sender address verified in your Resend dashboard, e.g. \"CastroAI <noreply@yourdomain.com>\"."
    )
  }
  return from
}

function layout(heading: string, body: string, ctaLabel: string, ctaUrl: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #18181b;">
      <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 16px;">${heading}</h1>
      <p style="font-size: 14px; line-height: 1.6; color: #52525b; margin: 0 0 24px;">${body}</p>
      <a href="${ctaUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 10px 20px;">${ctaLabel}</a>
      <p style="font-size: 12px; color: #a1a1aa; margin: 24px 0 0;">If the button doesn't work, copy and paste this link:<br />${ctaUrl}</p>
    </div>
  `
}

export async function sendOrganizationInvitationEmail({
  to,
  organizationName,
  inviterName,
  role,
  url,
}: {
  to: string
  organizationName: string
  inviterName: string
  role: string
  url: string
}) {
  const { error } = await resend.emails.send({
    from: getFrom(),
    to,
    subject: `${inviterName} invited you to join ${organizationName}`,
    html: layout(
      `Join ${organizationName}`,
      `${inviterName} invited you to join <strong>${organizationName}</strong> as ${role === "admin" ? "an" : "a"} ${role}.`,
      "Accept invitation",
      url
    ),
  })
  if (error) throw new Error(error.message)
}

export async function sendVerificationEmail({ to, url }: { to: string; url: string }) {
  const { error } = await resend.emails.send({
    from: getFrom(),
    to,
    subject: "Verify your email address",
    html: layout(
      "Verify your email",
      "Confirm this is your email address to finish setting up your account.",
      "Verify email",
      url
    ),
  })
  if (error) throw new Error(error.message)
}

export async function sendPasswordResetEmail({ to, url }: { to: string; url: string }) {
  const { error } = await resend.emails.send({
    from: getFrom(),
    to,
    subject: "Reset your password",
    html: layout(
      "Reset your password",
      "We received a request to reset your password. If you didn't make this request, you can ignore this email.",
      "Reset password",
      url
    ),
  })
  if (error) throw new Error(error.message)
}
