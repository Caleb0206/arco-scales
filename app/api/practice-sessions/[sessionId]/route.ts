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

    const practiceSession = getPracticeSession(sessionId, currentUser.userId);

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

    if (
        typeof body.tempoBpm !== "number" || typeof body.octaves !== "number"
    ) {
        return Response.json(
            { error: "tempoBpm and octaves must be numbers." },
            { status: 400 }
        );
    }
    const updatedSession = updatePracticeSession(
        sessionId, 
        currentUser.userId,
        {
            tempoBpm: body.tempoBpm,
            octaves: body.octaves,
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

    const deletedSession = deletePracticeSession(sessionId, currentUser.userId);

    if (!deletedSession) {
        return Response.json(
            { error: "Practice session not found." },
            { status: 404 }
        );
    }

    return Response.json(deletedSession);
}