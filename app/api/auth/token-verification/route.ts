import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/session";

const googleClient = new OAuth2Client();

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const credential = formData.get("credential");
    const csrfTokenFromBody = formData.get("g_csrf_token");
    const csrfTokenFromCookie = request.cookies.get("g_csrf_token")?.value;

    // 1. Confirm the Google-generated CSRF values match.
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
        // 2. Verify Google's signed ID token.
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: googleClientId,
        });

        const payload = ticket.getPayload();

        if (!payload?.sub) {
            return NextResponse.json(
                { error: "Google token did not include a user ID." },
                { status: 401 }
            );
        }

        const sessionToken = await createSessionToken({
            userId: payload.sub,
            email: payload.email ?? null,
            name: payload.name ?? null,
        });
        const response = NextResponse.redirect(
            new URL("/", request.url),
            303
        );

        response.cookies.set("arco_session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch {
        return NextResponse.json(
            { error: "Google token verification failed." },
            { status: 401 }
        );
    }
}