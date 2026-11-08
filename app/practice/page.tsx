"use client";
import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";

import Link from "next/link";

import { scales, type OctaveCount } from "@/data/scales";
import ScaleSelector from "@/components/practice/ScaleSelector";
import KeySignatureInfo from "@/components/practice/KeySignatureInfo";
import Metronome from "@/components/practice/Metronome";
import FingeringDiagram from "@/components/practice/FingeringDiagram";
import CompleteButton from "@/components/practice/CompleteButton";
import { useSearchParams } from "next/navigation";


type Plan = {
    id: string;
    name: string;
    description: string;
    scales: string[];
    currentRunStartedAt: string | null;
};

export type PracticeSession = {
    id: string;
    userId: string;
    scaleName: string;
    octaves: number;
    tempoBpm: number;
    success: boolean;
    practicedAt: string;
}

async function getErrorMessage(response: Response, fallback: string) {
    const body = await response
        .json()
        .catch(() => null) as { error?: string } | null;

    return body?.error ?? fallback;
}

export default function Practice() {
    // PracticeSessions from GET /api/practice-session
    const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);

    // Loading api states
    const [isSessionsLoading, setIsSessionsLoading] = useState(true);
    const [sessionsError, setSessionsError] = useState<string | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);

    const [completionError, setCompletionError] = useState<string | null>(null);


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

    useEffect(() => {
        void loadPracticeSessions();
    }, [loadPracticeSessions]);

    const latestSessionByScale = new Map<string, PracticeSession>();

    for (const session of practiceSessions) {
        if (!latestSessionByScale.has(session.scaleName)) {
            latestSessionByScale.set(session.scaleName, session);
        }
    }

    const completedScaleNames = Array.from(
        latestSessionByScale.values()
    )
        .filter((session) => session.success)
        .map((session) => session.scaleName);




    const [selectedOctaves, setSelectedOctaves] = useState<OctaveCount>(2);
    const [selectedBpm, setSelectedBpm] = useState(80);

    // URL values determine if user arrived from ScaleLibrary or practice plan
    const searchParams = useSearchParams();
    const requestedScaleName = searchParams.get("scale");
    const planId = searchParams.get("plan");

    // Find requested scale if there is one
    const requestedScale = scales.find(
        (scale) => scale.name === requestedScaleName
    );


    // Current plan exists only when URL includes a valid plan ID.
    // const activePlan = plans.find((plan) => plan.id === planId);



    const [activePlan, setActivePlan] = useState<Plan | null>(null);
    const [isPlanLoading, setIsPlanLoading] = useState(false);
    const [planError, setPlanError] = useState<string | null>(null);

    // lookup the plan
    useEffect(() => {
        if (!planId) {
            setActivePlan(null);
            setPlanError(null);
            return;
        }

        async function loadActivePlan() {
            setIsPlanLoading(true);
            setPlanError(null);

            try {
                const response = await fetch(`/api/plans/${planId}`);

                if (!response.ok) {
                    throw new Error("Could not load practice plan.");
                }

                const plan: Plan = await response.json();

                setActivePlan(plan);
            } catch (error) {
                setPlanError(
                    error instanceof Error
                        ? error.message
                        : "Could not load practice plan."
                );
            } finally {
                setIsPlanLoading(false);
            }
        }
        void loadActivePlan();
    }, [planId]);

    // update the selected scale once it loads
    useEffect(() => {
        if (!activePlan) {
            return;
        }

        const firstIncompleteScale =
            activePlan.scales.find(
                (scaleName) => !completedScaleNames.includes(scaleName)
            ) ?? activePlan.scales[0];

        if (firstIncompleteScale) {
            setSelectedScaleName(firstIncompleteScale);
        }
    }, [activePlan?.id]);

    // In plan mode, begin with first scale that isn't complete.
    // else, use first scale
    const planStartingScaleName =
        activePlan?.scales.find(
            (scaleName) => !completedScaleNames.includes(scaleName)

        ) ??
        activePlan?.scales[0];

    /*
    Decide the initial scale:
    - Plan mode: plan's starting scale
    - Free practice: scale from Scale Library
    - Fallback: first scale in the database
    */
    const startingScaleName = activePlan
        ? planStartingScaleName ?? scales[0].name
        : requestedScale?.name ?? scales[0].name;

    // Local practice-page state: which scale is currently displayed.
    const [selectedScaleName, setSelectedScaleName] = useState(startingScaleName);

    // Find complete scale data object for current scale name
    const selectedScale = scales.find((scale) => scale.name === selectedScaleName) ?? scales[0];

    // Plan mode limits selector scales. Free practice allows everything
    const availableScales = activePlan
        ? scales.filter((scale) => activePlan.scales.includes(scale.name))
        : scales;

    // Local UI state for the mobile fingering-diagram overlay
    const [isDiagramOpen, setIsDiagramOpen] = useState(false);

    // Derived plan progress values for header and progress display
    const totalScales = activePlan?.scales.length ?? 0;

    const completedCount = activePlan
        ? activePlan.scales.filter((scaleName) =>
            completedScaleNames.includes(scaleName)
        ).length
        : 0;

    const currentScaleSession = latestSessionByScale.get(selectedScale.name);

    // Whether currently displayed scale is marked complete
    const isCurrentScaleComplete = completedScaleNames.includes(selectedScale.name);


    // Mark or unmark the selected scale
    async function handleComplete() {
        if (isCompleting) {
            return;
        }

        setIsCompleting(true);
        setCompletionError(null);

        try {
            if (currentScaleSession) {
                // Existing record: toggle completion state and Update!
                const response = await fetch(`/api/practice-sessions/${currentScaleSession.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        tempoBpm: selectedBpm,
                        octaves: selectedOctaves,
                        success: !isCurrentScaleComplete,
                    }),
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
                setPracticeSessions((currentSessions) =>
                    currentSessions.map((session) =>
                        session.id === updatedSession.id
                            ? updatedSession
                            : session
                    )
                );
                return;
            }

            // Create if it's the first completion for this scale
            const response = await fetch("/api/practice-sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scaleName: selectedScale.name,
                    tempoBpm: selectedBpm,
                    octaves: selectedOctaves,
                    success: true,
                }),
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
        } catch (error) {
            setCompletionError(
                error instanceof Error
                    ? error.message
                    : "Could not mark this scale complete."
            );
        } finally {
            setIsCompleting(false);
        }
    }

    return (
        <div>
            <main className={styles.practiceWorkspace}>
                <header className={styles.practiceHeader}>
                    <div className={styles.practiceHeaderText}>
                        <h1>Practice</h1>

                        {isPlanLoading && (
                            <p role="status">Loading practice plan...</p>
                        )}
                        {planError && (
                            <p role="alert">{planError}</p>
                        )}
                        {isSessionsLoading && (
                            <p role="status">Loading practice history...</p>
                        )}
                        {sessionsError && (
                            <div role="alert">
                                <p>{sessionsError}</p>
                                <button
                                    type="button"
                                    onClick={() => void loadPracticeSessions}
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        <p className={styles.planContext}>
                            {activePlan
                                ? `Plan: ${activePlan.name} ${completedCount} of ${totalScales} completed`
                                : "Free practice - choose any available scale"}
                        </p>
                    </div>


                    <button
                        className={styles.diagramOpenButton}
                        type="button"
                        aria-expanded={isDiagramOpen}
                        aria-controls="fingering-diagram"
                        onClick={() => setIsDiagramOpen(true)}
                    >
                        View Fingering Diagram
                    </button>
                </header>

                <div className={styles.practiceTools}>
                    {activePlan && (
                        <aside className={styles.planNotice} aria-labelledby="plan-notice-heading">
                            <h2 id="plan-notice-heading">
                                Practicing a plan
                            </h2>
                            <p>
                                You are working through <strong>{activePlan.name}</strong>.
                                The scale selector only shows the {totalScales} scales in this plan.

                            </p>
                            <Link href="/scales">
                                Leave plan and browse all scales.
                            </Link>

                        </aside>
                    )}
                    <ScaleSelector
                        scales={availableScales}
                        selectedScaleName={selectedScaleName}
                        selectedOctaves={selectedOctaves}
                        completedScaleNames={completedScaleNames}
                        onScaleChange={setSelectedScaleName}
                        onOctavesChange={setSelectedOctaves}
                        label={activePlan ? "Scale in this plan" : "Scale"}
                    />
                    <KeySignatureInfo scale={selectedScale} />

                    {completionError && (
                        <p role="alert">{completionError}</p>
                    )}

                    <div className={styles.metronomeCompleteRow}>
                        <Metronome
                            selectedBpm={selectedBpm}
                            onBpmChange={setSelectedBpm}
                        />

                        <div className={styles.mobileCompleteButton}>
                            <CompleteButton
                                isComplete={isCurrentScaleComplete}
                                isSaving={isCompleting}
                                onComplete={handleComplete}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.practiceRightPanel}>
                    <div
                        id="fingering-diagram"
                        className={`${styles.diagramPanel} ${isDiagramOpen ? styles.isOpen : ""}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="fingering-diagram-heading"
                    >
                        <button
                            className={styles.diagramCloseButton}
                            type="button"
                            value="cancel"
                            aria-label="Close diagram"
                            onClick={() => setIsDiagramOpen(false)}
                        >
                            ✕
                        </button>
                        <FingeringDiagram
                            scale={selectedScale}
                            selectedOctaves={selectedOctaves}
                        />

                    </div>

                    <div className={styles.desktopCompleteButton}>
                        <CompleteButton
                            isComplete={isCurrentScaleComplete}
                            isSaving={isCompleting}
                            onComplete={handleComplete}
                        />
                    </div>

                </div>

            </main>
        </div>
    );
}
