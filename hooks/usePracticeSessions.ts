"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/api";
import type {
    CreatePracticeSessionInput,
    PracticeSession,
    UpdatePracticeSessionInput,
} from "@/types/practice-session";

/* usePracticeSessions hook handles:
 * - session state, loading state, errors
 * - GET, POST, PUT logic
 * - Derived session information: latest session per scale, completed scale names
 */
export function usePracticeSessions() {
    const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);

    // Loading api states
    const [isSessionsLoading, setIsSessionsLoading] = useState(true);
    const [sessionsError, setSessionsError] = useState<string | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);

    const [completionError, setCompletionError] = useState<string | null>(null);

    // GET : loadPracticeSessions
    const loadPracticeSessions = useCallback(async () => {
        setIsSessionsLoading(true);
        setSessionsError(null);

        try {
            const response = await fetch("/api/practice-sessions");

            if (!response.ok) {
                throw new Error(
                    await getErrorMessage(
                        response,
                        "Could not load practice history.."
                    )
                );
            }

            const loadedSessions: PracticeSession[] = await response.json();

            setPracticeSessions(loadedSessions);
        } catch (error) {
            setSessionsError(error instanceof Error
                ? error.message
                : "Could not load practice history."
            );
        } finally {
            setIsSessionsLoading(false);
        }
    }, []);

    // Load the practice sessions on page load
    useEffect(() => {
        void loadPracticeSessions();
    }, [loadPracticeSessions]);

    // POST : createSession
    async function createSession(
        input: CreatePracticeSessionInput
    ) {
        // Create if it's the first completion for this scale
        const response = await fetch("/api/practice-sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });
        if (!response.ok) {
            throw new Error(
                await getErrorMessage(
                    response,
                    "Could not mark this scale complete."
                )
            );
        }

        const newSession: PracticeSession = await response.json();

        // update screen immediately
        setPracticeSessions((currentSessions) => [
            newSession,
            ...currentSessions,
        ]);

        return newSession;
    }

    // PUT: updateSession
    async function updateSession(
        sessionId: string,
        input: UpdatePracticeSessionInput
    ) {
        // Existing record: toggle completion state and Update!
        const response = await fetch(`/api/practice-sessions/${sessionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error(
                await getErrorMessage(
                    response,
                    "Could not update this practice session."
                )
            );
        }

        const updatedSession: PracticeSession = await response.json();

        // update screen immediately
        setPracticeSessions((currentSessions) => [
            updatedSession,
            ...currentSessions.filter(
                (session) => session.id !== updatedSession.id
            ),
        ]);

        return updateSession;
    }

    // latestSessionByScale : the latest practice-session per scale
    const latestSessionByScale = useMemo(() => {
        const latestSessions = new Map<string, PracticeSession>();

        for (const session of practiceSessions) {
            if (!latestSessions.has(session.scaleName)) {
                latestSessions.set(session.scaleName, session);
            }
        }
        return latestSessions;
    }, [practiceSessions]);


    // completedScaleNames : scale names that have been marked complete
    const completedScaleNames = useMemo(() => {
        return Array.from(latestSessionByScale.values())
            .filter((session) => session.success)
            .map((session) => session.scaleName);
    }, [latestSessionByScale]);


    // return all the functions from the hook
    return {
        practiceSessions,
        latestSessionByScale,
        completedScaleNames,
        isSessionsLoading,
        sessionsError,
        loadPracticeSessions,
        createSession,
        updateSession,
    };
}