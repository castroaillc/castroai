"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "cn"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function safeRedirect(redirectTo: string | undefined) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/dashboard"
  }
  return redirectTo
}

export function LoginForm({
  className,
  redirectTo,
  ...props
}: React.ComponentProps<"div"> & { redirectTo?: string }) {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const destination = safeRedirect(redirectTo)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const { error } = await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Unable to sign in.")
      return
    }

    router.push(destination)
  }

  async function handleGoogleSignIn() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: destination,
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-balance text-muted-foreground">
              Login to your account
            </p>
          </div>
          {error ? (
            <p className="text-sm text-destructive text-center">{error}</p>
          ) : null}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="/forgot-password"
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Forgot password?
              </a>
            </div>
            <Input id="password" name="password" type="password" required />
          </Field>
          <Field>
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            Or continue with
          </FieldSeparator>
          <Field>
            <Button variant="outline" type="button" onClick={handleGoogleSignIn}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Login with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <p className="px-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a
          href={`/signup${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
          className="underline underline-offset-4 hover:text-foreground"
        >
          Sign up
        </a>
      </p>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="underline underline-offset-4 hover:text-foreground">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  )
}
