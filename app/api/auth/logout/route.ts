import { NextRequest, NextResponse } from "next/server";

// Logout request
export function POST(request: NextRequest) {
    const response = NextResponse.redirect(
        new URL("/login", request.url),
        303
    );

    response.cookies.set("arco_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // tells the browser to delete the cookie
    });

    return response;
}