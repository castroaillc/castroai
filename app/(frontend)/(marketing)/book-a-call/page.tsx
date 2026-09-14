import type { Metadata } from "next"

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

      <div className="mt-10 overflow-hidden rounded-lg border">
        <iframe
          src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2eSG-Hp5MKr5zUnzzlOpB72s5_30z00CZWct-Kdh1SNRr7Nas7yukssbFmrtyCcBV93fdFRpfa?gv=true"
          title="Book a call"
          className="h-[700px] w-full"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>
    </div>
  )
}
