export const getSiteUrl = () =>
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

// Default social share image (public/og-image.png). Pages with their own
// image (e.g. a case study hero) should override this in their own metadata.
export const defaultOgImage = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'castroai — AI automation for startups',
}
