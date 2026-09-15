import { cn } from "cn"

export function BookingEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <iframe
        src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2eSG-Hp5MKr5zUnzzlOpB72s5_30z00CZWct-Kdh1SNRr7Nas7yukssbFmrtyCcBV93fdFRpfa?gv=true"
        title="Book a call"
        className="h-[700px] w-full"
        style={{ border: 0 }}
        loading="lazy"
      />
    </div>
  )
}
