import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionFromToken } from "@/lib/session";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const sessionToken = request.cookies.get("arco_session")?.value;

    const session = sessionToken
        ? await getSessionFromToken(sessionToken)
        : null;
    if (!session) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set(
            "callbackUrl",
            request.nextUrl.pathname
        )

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
export const config = {
    matcher: [
        "/",
        "/practice/:path*",
        "/scales/:path*",
        "/plans/:path*",
        "/progress/:path*",
    ]
}