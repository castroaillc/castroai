import Link from "next/link"
import Image from "next/image"

import { Logo } from "@/components/logo"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/">
            <Logo className="text-lg" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm redirectTo={redirect} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/login-hero-2.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
