"use client"

import { useActionState } from "react"

import { submitContactForm, type ContactFormState } from "@/lib/actions/contact"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const initialState: ContactFormState = { status: "idle" }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  if (state.status === "success") {
    return (
      <p className="text-center text-muted-foreground">
        Thanks for reaching out — we&apos;ll be in touch shortly.
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "error" && (
        <p className="text-center text-sm text-destructive">{state.message}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input id="contact-name" name="name" placeholder="Jane Doe" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            required
          />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="contact-company">Company (optional)</FieldLabel>
        <Input id="contact-company" name="company" placeholder="Acme Corp" />
      </Field>
      <Field>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Tell us about your team and what you're looking for."
          required
        />
      </Field>
      <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Sending..." : "Send message"}
      </Button>
    </form>
  )
}
