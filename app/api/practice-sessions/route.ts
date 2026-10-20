import {
    createPracticeSession,
    getPracticeSessions,
} from "@/lib/practiceSessions";

export function GET() {
    return Response.json(getPracticeSessions());
}

export async function POST(request: Request) {
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

    const newSession = createPracticeSession({
        scaleName: body.scaleName,
        tempoBpm: body.tempoBpm,
        octaves: body.octaves,
        success: body.success
    });

    return Response.json(newSession, { status: 201 });
}