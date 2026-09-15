import type { Metadata } from "next"

import { BookingEmbed } from "@/components/booking-embed"

export const metadata: Metadata = {
  title: "Book a Call — castroai",
}

export default function BookACallPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Book a call</h1>
        <p className="mt-2 text-muted-foreground">
          Pick a time that works for you and we&apos;ll walk you through castroai.
        </p>
      </div>

      <BookingEmbed className="mt-10" />
    </div>
  )
}
