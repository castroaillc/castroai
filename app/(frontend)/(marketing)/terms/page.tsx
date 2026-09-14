import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — castroai",
}

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 14, 2026</p>

      <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of castroai
            (&ldquo;castroai&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) and
            our website and application (the &ldquo;Service&rdquo;). By creating an account or
            otherwise using the Service, you agree to be bound by these Terms. If you do not agree,
            do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            castroai provides a dashboard for creating and managing an organization, inviting and
            managing members and their roles, and (in the future) managing a subscription. We may
            add, change, or remove features at any time.
          </p>
        </section>

        <section>
          <h2>3. Accounts and Registration</h2>
          <p>
            You must provide accurate and complete information when creating an account, and keep
            your login credentials confidential. You are responsible for all activity that occurs
            under your account. Notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2>4. Organizations, Members, and Roles</h2>
          <p>
            You may create one organization and invite other users to join it. Organization owners
            and admins can manage members, assign roles, and remove members. You are responsible
            for the members you invite and the access you grant them.
          </p>
        </section>

        <section>
          <h2>5. Subscription and Billing</h2>
          <p>
            The Service is currently offered on a free plan. If we introduce paid subscription
            plans, the applicable pricing, billing frequency, and payment terms will be presented
            to you before you subscribe, and your use of any paid plan will be subject to those
            additional terms.
          </p>
        </section>

        <section>
          <h2>6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in violation of any applicable law</li>
            <li>Attempt to gain unauthorized access to the Service, other accounts, or systems</li>
            <li>Interfere with or disrupt the integrity or performance of the Service</li>
            <li>Upload or transmit malicious code, or attempt to reverse engineer the Service</li>
            <li>Use the Service to send unsolicited or abusive communications, including through the invitation feature</li>
          </ul>
        </section>

        <section>
          <h2>7. User Content and Data</h2>
          <p>
            You retain ownership of the data and content you submit to the Service (&ldquo;User
            Content&rdquo;). You grant us a limited license to host, store, and process User
            Content solely to provide and improve the Service. You are responsible for having the
            right to submit any User Content you provide.
          </p>
        </section>

        <section>
          <h2>8. Intellectual Property</h2>
          <p>
            The Service, including its design, features, and underlying technology, is owned by
            castroai and protected by intellectual property laws. These Terms do not grant you any
            rights to our trademarks, logos, or branding.
          </p>
        </section>

        <section>
          <h2>9. Termination</h2>
          <p>
            You may stop using the Service and delete your organization or account at any time. We
            may suspend or terminate your access to the Service if you violate these Terms, or if
            we discontinue the Service, with notice where reasonably practicable.
          </p>
        </section>

        <section>
          <h2>10. Disclaimers and Limitation of Liability</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
            warranties of any kind, express or implied. To the fullest extent permitted by law,
            castroai will not be liable for any indirect, incidental, special, consequential, or
            punitive damages, or any loss of data, revenue, or profits, arising from your use of
            the Service.
          </p>
        </section>

        <section>
          <h2>11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we will
            notify you by updating the &ldquo;Last updated&rdquo; date above or, where appropriate,
            by other means. Continued use of the Service after changes take effect constitutes
            acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            If you have questions about these Terms, contact us at{" "}
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
