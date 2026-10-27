import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/session";
import { findOrCreateUser } from "@/lib/users";

// Google library client used to verify Google-signed ID tokens.
const googleClient = new OAuth2Client();

export async function POST(request: NextRequest) {
    // Google Identity Services submits the credential as form data.
    const formData = await request.formData();

    // credential is Google's ID token, signed JWT
    const credential = formData.get("credential");

    // Google CSRF tokens in POST body and cookie
    const csrfTokenFromBody = formData.get("g_csrf_token");
    const csrfTokenFromCookie = request.cookies.get("g_csrf_token")?.value;

    // Confirm the Google-generated CSRF values match.
    // Prevents another site from submiting a sign-in request to this endpoint
    if (
        typeof csrfTokenFromBody !== "string" ||
        !csrfTokenFromCookie ||
        csrfTokenFromBody !== csrfTokenFromCookie
    ) {
        return NextResponse.json(
            { error: "Invalid CSRF token." },
            { status: 400 }
        );
    }

    if (typeof credential !== "string") {
        return NextResponse.json(
            { error: "Missing Google credential." },
            { status: 400 }
        );
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
        return NextResponse.json(
            { error: "Server is missing GOOGLE_CLIENT_ID." },
            { status: 500 }
        );
    }

    try {
        // Verify Google's signed ID token.
        // checks Google's signature, intended audience, issuer, expiration time
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: googleClientId,
        });

        const payload = ticket.getPayload();

        // sub is Google's stable unique identifier for this account
        if (!payload?.sub || !payload.email) {
            return NextResponse.json(
                { error: "Google token did not include required user info." },
                { status: 401 }
            );
        }
        try {
            // Find the app with this Google sub, or create one on first successful login
            
            const user = await findOrCreateUser({
                authUserId: payload.sub,
                email: payload.email,
            });

            // returned user.id is Arco Scales internal database UUID
            const sessionToken = await createSessionToken({
                userId: user.id,
                email: user.email,
                name: payload.name ?? null,
            })

            // send user to home page after success
            const response = NextResponse.redirect(
                new URL("/", request.url),
                303
            );
            // store session in HTTP cookie, lasts 1 week
            response.cookies.set("arco_session", sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            return response;
        } catch (error) {
            // A database or app-session failure is server error, not Google
            return NextResponse.json(
                { error: "Could not complete sign in." },
                { status: 500 }
            );
        }

    } catch (error) {
        // Google verification failed.
        return NextResponse.json(
            { error: "Google token verification failed." },
            { status: 401 }
        );
    }
}