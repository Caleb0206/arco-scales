"use client";
import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { CreatePlanModal } from "@/components/plans/CreatePlanModal";
import Link from "next/link";
import { getErrorMessage } from "@/lib/api";


type PlanDraft = {
    name: string;
    description: string;
    scales: string[];
};

type Plan = {
    id: string;
    userId: string;
    name: string;
    description: string;
    scales: string[];
    createdAt: string;
    updatedAt: string;
    currentRunStartedAt: string | null;
};

type PracticeSession = {
    id: string;
    userId: string;
    scaleName: string;
    octaves: number;
    tempoBpm: number;
    success: boolean;
    practicedAt: string;
}



export default function Plans() {
    // PracticeSessions
    const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);


    // Plans from GET /api/plans
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    // Loading api states
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Restart a plan state
    const [isRestarting, setIsRestarting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Editing plan state
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    // Deleting plan state
    const [isDeleting, setIsDeleting] = useState(false);


    // CreatePlanModal state
    const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);

    const loadPlans = useCallback(async () => {
        setIsLoading(true);
        setLoadError(null);

        try {
            const [plansResponse, sessionsResponse] = await Promise.all([
                fetch("/api/plans"),
                fetch("/api/practice-sessions"),
            ]);

            if (!plansResponse.ok) {
                throw new Error(
                    await getErrorMessage(
                        plansResponse,
                        "Could not load plans."
                    )
                );
            }

            if (!sessionsResponse.ok) {
                throw new Error(
                    await getErrorMessage(
                        sessionsResponse,
                        "Could not load practice history."
                    )
                );
            }

            const [loadedPlans, loadedSessions] = await Promise.all([
                plansResponse.json() as Promise<Plan[]>,
                sessionsResponse.json() as Promise<PracticeSession[]>,
            ]);

            setPlans(loadedPlans);
            setPracticeSessions(loadedSessions);

            setSelectedPlanId((currentPlanId) => {
                const currentPlanStillExists = loadedPlans.some(
                    (plan) => plan.id === currentPlanId
                );

                return currentPlanStillExists
                    ? currentPlanId
                    : loadedPlans[0]?.id ?? null;
            });
        } catch (error) {
            setLoadError(error instanceof Error
                ? error.message
                : "Could not load plans."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load plans on page load
    useEffect(() => {
        void loadPlans();
    }, [loadPlans]);

    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;

    const latestSessionByScale = new Map<string, PracticeSession>();

    for (const session of practiceSessions) {
        if (!latestSessionByScale.has(session.scaleName)) {
            latestSessionByScale.set(session.scaleName, session);
        }
    }

    // current run
    const currentRunStartedAt = selectedPlan?.currentRunStartedAt
        ? Date.parse(selectedPlan.currentRunStartedAt)
        : null;

    const completedScaleNames = Array.from(
        latestSessionByScale.values()
    )
        .filter((session) => session.success)
        .map((session) => session.scaleName);


    const completedCount = selectedPlan
        ? selectedPlan.scales.filter((scaleName) =>
            completedScaleNames.includes(scaleName)
        ).length
        : 0;

    const totalScales = selectedPlan?.scales.length ?? 0;

    const progressPercent =
        totalScales === 0
            ? 0
            : Math.round((completedCount / totalScales) * 100);

    async function handleRestartPlan() {
        if (!selectedPlan) {
            return;
        }

        setIsRestarting(true);
        setActionError(null);

        try {
            const response = await fetch(`/api/plans/${selectedPlan.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: "restart", }),
            });

            if (!response.ok) {
                throw new Error(
                    await getErrorMessage(
                        response,
                        "Could not restart plan."
                    )
                );
            }

            const updatedPlan: Plan = await response.json();

            // update screen immediately
            setPlans((currentPlans) =>
                currentPlans.map((plan) =>
                    plan.id === updatedPlan.id
                        ? updatedPlan
                        : plan
                )
            );

            // match UI state to the practice-session rows, restart endpoint in supabase
            setPracticeSessions((currentSessions) =>
                currentSessions.map((session) =>
                    updatedPlan.scales.includes(session.scaleName)
                        ? { ...session, success: false }
                        : session
                )
            );
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : "Could not restart plan."
            );
        } finally {
            setIsRestarting(false);
        }
    }

    async function handleCreatePlan(draft: PlanDraft) {
        const response = await fetch("/api/plans", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(draft),
        });

        if (!response.ok) {
            throw new Error(
                await getErrorMessage(
                    response,
                    "Could not create plan."
                )
            )
        }
        const newPlan: Plan = await response.json();


        // update screen immediately
        setPlans((currentPlans) => [...currentPlans, newPlan]);
        setSelectedPlanId(newPlan.id);
        setShowCreatePlanModal(false);
    }

    async function handleEditPlan(draft: PlanDraft) {
        if (!editingPlan) {
            return;
        }

        const response = await fetch(
            `/api/plans/${editingPlan.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(draft),
            }
        );

        if (!response.ok) {
            throw new Error(
                await getErrorMessage(
                    response,
                    "Could not update plan."
                )
            )
        }
        const updatedPlan: Plan = await response.json();


        // update screen immediately
        setPlans((currentPlans) =>
            currentPlans.map((plan) =>
                plan.id === updatedPlan.id
                    ? updatedPlan
                    : plan
            )
        );
        setEditingPlan(null);
    }

    // Delete handler
    async function handleDeletePlan() {
        if (!selectedPlan) {
            return;
        }
        const shouldDelete = window.confirm(
            `Delete "${selectedPlan.name}"? This cannot be undone.`
        );

        if (!shouldDelete) {
            return;
        }
        setIsDeleting(true);
        setActionError(null);
        try {
            const response = await fetch(
                `/api/plans/${selectedPlan.id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    await getErrorMessage(
                        response,
                        "Could not delete plan."
                    )
                );
            }
            const remainingPlans = plans.filter(
                (plan) => plan.id !== selectedPlan.id
            );




            // update screen immediately
            setPlans(remainingPlans);
            setSelectedPlanId(remainingPlans[0]?.id ?? null);
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : "Could not delete plan."
            );
        } finally {
            setIsDeleting(false);
        }

    }

    return (
        <div>
            <main>
                <header className={styles.planHeader}>
                    <h1>
                        Plans
                    </h1>
                    <button
                        className={styles.createPlanButton}
                        type="button"
                        onClick={() => setShowCreatePlanModal(true)}
                    >
                        Create new plan
                    </button>
                </header>

                {isLoading && (
                    <p role="status">
                        Loading plans...
                    </p>
                )}

                {loadError && (
                    <div role="alert">
                        <p>{loadError}</p>
                        <button
                            type="button"
                            onClick={() => void loadPlans()}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !loadError && plans.length === 0 && (
                    <p>
                        You have no plans yet. Create one to begin.
                    </p>
                )}

                {!isLoading && !loadError && selectedPlan && (
                    <div className={styles.planWorkspace}>
                        <nav className={styles.planList}>


                            {plans.map((plan) => (
                                <button
                                    className={
                                        plan.id === selectedPlanId
                                            ? `${styles.planListItem} ${styles.isSelected}`
                                            : styles.planListItem
                                    }
                                    type="button"
                                    key={plan.id}
                                    aria-pressed={plan.id === selectedPlanId}
                                    onClick={() => setSelectedPlanId(plan.id)} // CHANGE to an OnClick method
                                >
                                    {plan.name}
                                </button>
                            ))}
                        </nav>

                        <div>
                            <label className={styles.planSelector} htmlFor="plan">
                                <h2>Choose a plan</h2>
                                <select
                                    id="plan"
                                    value={selectedPlanId ?? ""}
                                    onChange={(event) => setSelectedPlanId(event.target.value)}
                                >
                                    {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {actionError && (
                                <p role="alert">
                                    {actionError}
                                </p>
                            )}
                            {/* CHANGE: Componentize this  */}
                            <div className={styles.planProgress} aria-labelledby="plan-progress-heading">
                                <h3 id="plan-progress-heading">Plan progress</h3>

                                <progress
                                    className={styles.progressBar}
                                    value={completedCount}
                                    max={totalScales}
                                >
                                    {progressPercent}%
                                </progress>

                                <p>
                                    {completedCount} of {totalScales} scales completed ({progressPercent}%)
                                </p>
                            </div>

                            <div className={styles.planActions}>
                                <Link
                                    className={styles.practicePlanLink}
                                    href={`/practice?plan=${selectedPlan.id}`}
                                >
                                    Practice this plan
                                </Link>

                                <button
                                    className={styles.restartPlanButton}
                                    type="button"
                                    disabled={isRestarting}
                                    onClick={handleRestartPlan}
                                >
                                    {isRestarting
                                        ? "Restarting..."
                                        : "Restart progress"}
                                </button>

                                <button
                                    className={styles.restartPlanButton}
                                    type="button"
                                    onClick={() => setEditingPlan(selectedPlan)}
                                >
                                    Edit plan
                                </button>

                                <button
                                    className={styles.restartPlanButton}
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={() => void handleDeletePlan()}
                                >
                                    {isDeleting ? "Deleting..." : "Delete plan"}
                                </button>
                            </div>

                            <section className={styles.planContent}>
                                <h2 id="plan-title">{selectedPlan.name}</h2>
                                <p>{selectedPlan.description}</p>
                                <h3> Scales in this plan</h3>
                                <ul>
                                    {selectedPlan.scales.map((scale) => (
                                        <li key={scale}>{scale}</li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>
                )}
            </main >

            <CreatePlanModal
                isOpen={showCreatePlanModal}
                mode="create"
                onClose={() => setShowCreatePlanModal(false)}
                onSave={handleCreatePlan}
            />
            <CreatePlanModal
                isOpen={editingPlan !== null}
                mode="edit"
                plan={editingPlan
                    ? {
                        name: editingPlan.name,
                        description: editingPlan.description,
                        scales: editingPlan.scales,
                    }
                    : undefined
                }
                onClose={() => setEditingPlan(null)}
                onSave={handleEditPlan}
            />
        </div >


    );
}