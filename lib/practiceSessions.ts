export type PracticeSession = {
    id: string;
    userId: string;
    scaleName: string;
    octaves: number;
    tempoBpm: number;
    success: boolean;
    practicedAt: string;
}

export type CreatePracticeSessionInput = {
    scaleName: string;
    octaves: 1 | 2 | 3;
    tempoBpm: number;
    success: boolean;
}

const practiceSessions: PracticeSession[] = [];

export function getPracticeSessions() {
    return practiceSessions;
}

export function getPracticeSession(sessionId: string) {
    return practiceSessions.find((session) => session.id === sessionId);
}

export function createPracticeSession(
    input: CreatePracticeSessionInput
) {
    const newSession: PracticeSession = {
        id: crypto.randomUUID(),
        userId: "demo-user",
        scaleName: input.scaleName,
        tempoBpm: input.tempoBpm,
        octaves: input.octaves,
        success: input.success,
        practicedAt: new Date().toISOString(),
    }
    practiceSessions.unshift(newSession);

    return newSession;
};

// PUT Update
export type UpdatePracticeSessionInput = {
    tempoBpm: number;
    octaves: number;
};

export function updatePracticeSession(
    sessionId: string,
    input: UpdatePracticeSessionInput
) {
    const practiceSession = getPracticeSession(sessionId);

    if (!practiceSession) {
        return undefined;
    }

    practiceSession.tempoBpm = input.tempoBpm;
    practiceSession.octaves = input.octaves;

    return practiceSession;
}

export function deletePracticeSession(sessionId: string) {
    const sessionIndex = practiceSessions.findIndex(
        (session) => session.id === sessionId
    );

    if (sessionIndex === -1) {
        return undefined;
    }

    const [deletedSession] = practiceSessions.splice(sessionIndex, 1);

    return deletedSession;
}
