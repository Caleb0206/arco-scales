import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// session secret owned by Arco Scales not Google. signs and verifies application session JWTs
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error("Missing SESSION_SECRET!");
}

const secretKey = new TextEncoder().encode(sessionSecret);

// trusted identity stored in the session.
export type AppSession = {
    userId: string;
    email: string | null;
    name: string | null;
};

// Signed Arco Scales session token after Google auth and Supabase user setup
export async function createSessionToken(session: AppSession) {
    return new SignJWT({
        email: session.email,
        name: session.name,
    })

        .setProtectedHeader({ alg: "HS256" })
        .setSubject(session.userId)
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secretKey);
}

// Verify session token
export async function getSessionFromToken(token: string) {
    try {
        //jwtVerify checks signature and expiration before returning its data
        const { payload } = await jwtVerify(token, secretKey);

        if (typeof payload.sub !== "string") {
            return null;
        }

        return {
            userId: payload.sub,
            email: typeof payload.email === "string" ? payload.email : null,
            name: typeof payload.name === "string" ? payload.name : null,
        };
    } catch {
        return null;
    }
}

// get the current user: read HTTP cookie on server and return verified user identiy
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("arco_session")?.value;

    if (!sessionToken) {
        return null;
    }

    return getSessionFromToken(sessionToken);
}