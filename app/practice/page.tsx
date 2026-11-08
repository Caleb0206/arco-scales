"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

import Link from "next/link";

import { scales, type OctaveCount } from "@/data/scales";
import ScaleSelector from "@/components/practice/ScaleSelector";
import KeySignatureInfo from "@/components/practice/KeySignatureInfo";
import Metronome from "@/components/practice/Metronome";
import FingeringDiagram from "@/components/practice/FingeringDiagram";
import CompleteButton from "@/components/practice/CompleteButton";
import { useSearchParams } from "next/navigation";
import { usePracticeSessions } from "@/hooks/usePracticeSessions";

type Plan = {
    id: string;
    name: string;
    description: string;
    scales: string[];
    currentRunStartedAt: string | null;
};

export default function Practice() {

    /* ---------------------------------- */
    // Route Context
    /* ---------------------------------- */

    // URL values determine if user arrived from ScaleLibrary or practice plan
    const searchParams = useSearchParams();
    const requestedScaleName = searchParams.get("scale");
    const planId = searchParams.get("plan");

    // Find requested scale if there is one
    const requestedScale = scales.find(
        (scale) => scale.name === requestedScaleName
    );

    /* ---------------------------------- */
    // Persisted practice-session data
    /* ---------------------------------- */

    const {
        latestSessionByScale,
        completedScaleNames,
        isSessionsLoading,
        sessionsError,
        loadPracticeSessions,
        createSession,
        updateSession,
    } = usePracticeSessions();

    /* ---------------------------------- */
    // Local page/UI states
    /* ---------------------------------- */
    
    // Local practice-page state: which scale is currently displayed.
    const [selectedScaleName, setSelectedScaleName] = useState(
        requestedScale?.name ?? scales[0].name
    );

    const [selectedOctaves, setSelectedOctaves] = useState<OctaveCount>(2);
    const [selectedBpm, setSelectedBpm] = useState(80);

    // Current plan exists only when URL includes a valid plan ID.
    const [activePlan, setActivePlan] = useState<Plan | null>(null);
    const [isPlanLoading, setIsPlanLoading] = useState(false);
    const [planError, setPlanError] = useState<string | null>(null);

    // Local UI state for the mobile fingering-diagram overlay
    const [isDiagramOpen, setIsDiagramOpen] = useState(false);

    const [isCompleting, setIsCompleting] = useState(false);
    const [completionError, setCompletionError] = useState<string | null>(null);

    /* ---------------------------------- */
    // Derived values
    /* ---------------------------------- */
    // Find complete scale data object for current scale name
    const selectedScale = scales.find((scale) => scale.name === selectedScaleName) ?? scales[0];

    // Plan mode limits selector scales. Free practice allows everything
    const availableScales = activePlan
        ? scales.filter((scale) => activePlan.scales.includes(scale.name))
        : scales;

    // Derived plan progress values for header and progress display
    const totalScales = activePlan?.scales.length ?? 0;

    // Completed count of scales per active plan
    const completedCount = activePlan
        ? activePlan.scales.filter((scaleName) =>
            completedScaleNames.includes(scaleName)
        ).length
        : 0;

    const currentScaleSession = latestSessionByScale.get(selectedScale.name);

    // Whether currently displayed scale is marked complete
    const isCurrentScaleComplete = completedScaleNames.includes(selectedScale.name);

    /* ---------------------------------- */
    // Effects
    /* ---------------------------------- */

    // Load the selected plan only when the URL includes ?plan=<id>
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

    // In plan mode, select the first incomplete scale automatically
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


    /* --------------------------------- */
    // Event handlers
    /* --------------------------------- */

    // Mark or unmark the selected scale
    async function handleComplete() {
        if (isCompleting) {
            return;
        }
        setIsCompleting(true);
        setCompletionError(null);

        try {
            // If a session already exists, update it.
            if (currentScaleSession) {
                await updateSession(currentScaleSession.id, {
                    tempoBpm: selectedBpm,
                    octaves: selectedOctaves,
                    success: !isCurrentScaleComplete,
                });
                return;
            }
            // otherwise, create new session
            await createSession({
                scaleName: selectedScale.name,
                tempoBpm: selectedBpm,
                octaves: selectedOctaves,
                success: true,
            });
        } catch (error) {
            setCompletionError(
                error instanceof Error
                    ? error.message
                    : "Could not update this practice session."
            );
        } finally {
            setIsCompleting(false);
        }

    }

    /* --------------------------------- */
    // Rendering
    /* --------------------------------- */
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
                                    onClick={() => void loadPracticeSessions()}
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
