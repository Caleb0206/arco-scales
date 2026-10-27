import { getCurrentUser } from "@/lib/session";
import {
    createPracticeSession,
    getPracticeSessions,
} from "@/lib/practiceSessions";

export async function GET() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    return Response.json(getPracticeSessions(currentUser.userId));
}

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    const body = await request.json();

    if (
        typeof body.scaleName !== "string" ||
        typeof body.tempoBpm !== "number" ||
        typeof body.octaves !== "number" ||
        typeof body.success !== "boolean"
    ) {
        return Response.json(
            { error: "Invalid practice-session data." },
            { status: 404 }
        );
    }

    const newSession = createPracticeSession(
        currentUser.userId,
        {
            scaleName: body.scaleName,
            tempoBpm: body.tempoBpm,
            octaves: body.octaves,
            success: body.success
        });

    return Response.json(newSession, { status: 201 });
}