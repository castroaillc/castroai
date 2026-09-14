import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — castroai",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 14, 2026</p>

      <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
        <section>
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy explains how castroai (&ldquo;castroai&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and shares information when you
            use our website and application (the &ldquo;Service&rdquo;). By using the Service, you
            agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>
              <strong className="text-foreground">Account information</strong> — your name, email
              address, and password (stored as a salted hash, never in plain text) when you create
              an account directly.
            </li>
            <li>
              <strong className="text-foreground">Third-party sign-in information</strong> — if you
              sign in with Google, we receive your name, email address, and profile image as
              authorized by you during that sign-in flow.
            </li>
            <li>
              <strong className="text-foreground">Organization data</strong> — organizations you
              create or join, member roles, and invitations you send or receive.
            </li>
            <li>
              <strong className="text-foreground">Usage data</strong> — log data such as IP
              address, browser type, pages visited, and timestamps, collected automatically as you
              use the Service.
            </li>
            <li>
              <strong className="text-foreground">Cookies and session data</strong> — used to keep
              you signed in and to remember your preferences.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain the Service</li>
            <li>Authenticate you and keep your account secure</li>
            <li>Send transactional emails, such as organization invitations, email verification, and password resets</li>
            <li>Respond to support requests and communicate with you about the Service</li>
            <li>Monitor and analyze usage and trends to improve the Service</li>
            <li>Detect, prevent, and address technical issues, fraud, or abuse</li>
          </ul>
        </section>

        <section>
          <h2>4. Third-Party Services</h2>
          <p>We rely on the following third-party service providers to operate the Service:</p>
          <ul>
            <li>
              <strong className="text-foreground">Google</strong> — for optional sign-in via
              Google OAuth.
            </li>
            <li>
              <strong className="text-foreground">Resend</strong> — to deliver transactional
              emails (invitations, verification, password resets) on our behalf.
            </li>
            <li>
              <strong className="text-foreground">Neon (Postgres)</strong> — to store account,
              organization, and application data.
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> — to host the Service and
              provide privacy-friendly product analytics and performance monitoring.
            </li>
          </ul>
          <p>
            Each of these providers processes data only as necessary to provide their service to
            us and is bound by its own privacy and data-processing terms.
          </p>
        </section>

        <section>
          <h2>5. Data Sharing</h2>
          <p>
            We do not sell your personal information. We share information only with the
            third-party service providers described above, other members of an organization you
            join (such as your name, email, and role), or when required to comply with the law,
            enforce our agreements, or protect the rights, property, or safety of castroai, our
            users, or others.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to
            provide the Service. If you delete your account, we delete or anonymize your personal
            information within a reasonable period, except where retention is required for legal,
            security, or legitimate business purposes.
          </p>
        </section>

        <section>
          <h2>7. Security</h2>
          <p>
            We use reasonable administrative, technical, and physical safeguards to protect your
            information, including encrypted connections, hashed passwords, and access controls.
            However, no method of transmission or storage is completely secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>8. Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have the right to access, correct, export, or
            delete your personal information. You can update your account information at any time
            from within the Service, or contact us using the details below to exercise these
            rights.
          </p>
        </section>

        <section>
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            The Service is not directed to children under 16, and we do not knowingly collect
            personal information from children under 16. If you believe a child has provided us
            with personal information, please contact us so we can delete it.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we
            will notify you by updating the &ldquo;Last updated&rdquo; date above or, where
            appropriate, by other means.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:support@castroai.com" className="text-foreground underline underline-offset-4">
              support@castroai.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
