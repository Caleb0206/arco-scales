import { getCurrentUser } from "@/lib/session";
import {
    getPracticeSession,
    deletePracticeSession,
    updatePracticeSession,
} from "@/lib/practiceSessions";

type RouteContext = {
    params: Promise<{
        sessionId: string;
    }>;
};

// GET function
export async function GET(
    _request: Request,
    { params }: RouteContext
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    const { sessionId } = await params;

    const practiceSession = await getPracticeSession(sessionId, currentUser.userId);

    if (!practiceSession) {
        return Response.json(
            { error: "Practice session not found." },
            { status: 404 }
        );
    }

    return Response.json(practiceSession);
}

// PUT function
export async function PUT(
    request: Request,
    { params }: RouteContext
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    const { sessionId } = await params;
    const body = await request.json();

    const tempoBpm = body.tempoBpm;
    const octaves = body.octaves;

    if (
        typeof tempoBpm !== "number" ||
        !Number.isFinite(tempoBpm) ||
        tempoBpm <= 0 ||
        !Number.isInteger(octaves) ||
        ![1, 2, 3].includes(octaves) ||
        typeof body.success !== "boolean"
    ) {
        return Response.json(
            { error: "tempoBpm must be positive, octaves must be 1, 2, or 3, and success must be a boolean." },
            { status: 400 }
        );
    }

    const updatedSession = await updatePracticeSession(
        sessionId,
        currentUser.userId,
        {
            tempoBpm,
            octaves: octaves as 1 | 2 | 3,
            success: body.success,
        });

    if (!updatedSession) {
        return Response.json(
            { error: "Practice session not found." },
            { status: 404 }
        );
    }

    return Response.json(updatedSession);
}

// DELETE 
export async function DELETE(
    _request: Request,
    { params }: RouteContext
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return Response.json(
            { error: "Please sign in." },
            { status: 401 }
        );
    }

    const { sessionId } = await params;

    const deletedSession = await deletePracticeSession(sessionId, currentUser.userId);

    if (!deletedSession) {
        return Response.json(
            { error: "Practice session not found." },
            { status: 404 }
        );
    }

    return Response.json(deletedSession);
}