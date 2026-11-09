"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { CreatePlanModal } from "@/components/plans/CreatePlanModal";
import Link from "next/link";
import { usePlansApi } from "@/hooks/usePlansApi";
import { usePracticeSessions } from "@/hooks/usePracticeSessions";
import type { Plan, PlanDraft } from "@/types/plan";


export default function Plans() {
    /* ---------------------------------- */
    // API data
    /* ---------------------------------- */

    const {
        plans,
        isPlansLoading,
        plansError,
        loadPlans,
        createPlan,
        updatePlan,
        restartPlan,
        deletePlan,
    } = usePlansApi();

    const {
        completedScaleNames,
        isSessionsLoading,
        sessionsError,
        loadPracticeSessions,
    } = usePracticeSessions();



    /* ----------------------------------- */
    // Local page/UI specfic states
    /* ----------------------------------- */

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    // Editing plan state
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    // CreatePlanModal state
    const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);

    // Restart a plan state
    const [isRestarting, setIsRestarting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Deleting plan state
    const [isDeleting, setIsDeleting] = useState(false);

    /* ---------------------------------- */
    // Derived values
    /* ---------------------------------- */
    const isLoading = isPlansLoading || isSessionsLoading;
    const loadError = plansError ?? sessionsError;

    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;

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

    /* ---------------------------------- */
    // Effects
    /* ---------------------------------- */

    // Select the first plan when plans initially load. Preserve the 
    // user's selection if that plan still exists.
    useEffect(() => {
        setSelectedPlanId((currentPlanId) => {
            const currentPlanStillExists = plans.some(
                (plan) => plan.id === currentPlanId
            );

            return currentPlanStillExists
                ? currentPlanId
                : plans[0]?.id ?? null;
        });
    }, [plans]);

    /* ---------------------------------- */
    // Event handlers
    /* ---------------------------------- */

    // Create plan handler
    async function handleCreatePlan(draft: PlanDraft) {
        const newPlan = await createPlan(draft);

        setSelectedPlanId(newPlan.id);
        setShowCreatePlanModal(false);
    }

    // Edit plan handler
    async function handleEditPlan(draft: PlanDraft) {
        if (!editingPlan) {
            return;
        }

        await updatePlan(editingPlan.id, draft);
        setEditingPlan(null);
    }

    // Restart plan handler
    async function handleRestartPlan() {
        if (!selectedPlan) {
            return;
        }

        setIsRestarting(true);
        setActionError(null);

        try {
            await restartPlan(selectedPlan.id);

            // Restart resets matching practice-session success values in Supabase
            await loadPracticeSessions();
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
            await deletePlan(selectedPlan.id);
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

    /* ---------------------------------- */
    // Rendering
    /* ---------------------------------- */
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
                            onClick={() => {
                                void loadPlans();
                                void loadPracticeSessions();
                            }}
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