"use server"

import { sendContactFormNotification } from "@/lib/email"
import { getPayloadClient } from "@/lib/payload"

export type ContactFormState = {
  status: "idle" | "success" | "error"
  message?: string
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const company = String(formData.get("company") || "").trim()
  const message = String(formData.get("message") || "").trim()

  if (!name || !email || !message) {
    return { status: "error", message: "Name, email, and message are required." }
  }

  const payload = await getPayloadClient()
  await payload.create({
    collection: "contact-submissions",
    data: { name, email, company: company || undefined, message },
  })

  // Best-effort notification: the submission is already saved above, so a
  // failure here (e.g. Resend not configured) shouldn't fail the request.
  try {
    await sendContactFormNotification({ name, email, company: company || undefined, message })
  } catch (error) {
    console.error("Failed to send contact form notification email", error)
  }

  return { status: "success" }
}
