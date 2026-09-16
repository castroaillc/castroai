import { eveChannel } from "eve/channels/eve";
import { localDev, vercelOidc, type AuthFn } from "eve/channels/auth";
import { auth } from "../../../../lib/auth";

// Maps a castroai dashboard session to an eve caller, scoped to the user's
// active organization (agents are per-organization "AI team members" — see
// globals/Landing.ts). No active organization means no agent access.
function appSession(): AuthFn<Request> {
  return async (request) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.session.activeOrganizationId) return null;

    return {
      authenticator: "app",
      principalId: session.user.id,
      principalType: "user",
      attributes: {
        email: session.user.email,
        organizationId: session.session.activeOrganizationId,
      },
    };
  };
}

export default eveChannel({
  auth: [
    appSession(),
    // Lets Vercel-to-Vercel and internal runtime callers reach the agent.
    vercelOidc(),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
  ],
});
