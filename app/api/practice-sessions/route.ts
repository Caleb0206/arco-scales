import { getCurrentUser } from "@/lib/session";
import {
    createPracticeSession,
    getPracticeSessions,
} from "@/lib/practiceSessions";
import { create } from "domain";

export async function GET() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    return Response.json(await getPracticeSessions(currentUser.userId));
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

    const scaleName = 
        typeof body.scaleName === "string"
            ? body.scaleName.trim()
            : "";
    const tempoBpm = body.tempoBpm;
    const octaves = body.octaves;
    const success = body.success;

    if (
        !scaleName ||
        typeof tempoBpm !== "number" ||
        !Number.isFinite(tempoBpm) ||
        tempoBpm <= 0 ||
        !Number.isInteger(octaves) ||
        ![1, 2, 3].includes(octaves) ||
        typeof success !== "boolean"
    ) {
        return Response.json(
            {error : "Invalid practice-session data."},
            {status: 400}
        );
    }

    const newSession = await createPracticeSession(
        currentUser.userId,
        {
            scaleName,
            tempoBpm,
            octaves: octaves as 1 | 2 | 3,
            success,
        }
    )

    return Response.json(newSession, { status: 201 });
}