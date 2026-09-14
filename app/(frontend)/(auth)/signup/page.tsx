import { SignupForm } from "@/components/signup-form"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; email?: string }>
}) {
  const { redirect, email } = await searchParams

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm redirectTo={redirect} defaultEmail={email} />
      </div>
    </div>
  )
}
