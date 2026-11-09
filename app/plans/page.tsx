"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { CreatePlanModal } from "@/components/plans/CreatePlanModal";
import { usePlansApi } from "@/hooks/usePlansApi";
import { usePracticeSessions } from "@/hooks/usePracticeSessions";
import type { Plan, PlanDraft } from "@/types/plan";
import { PlanSelector } from "@/components/plans/PlanSelector";
import { handler } from "next/dist/build/templates/app-route";
import { PlanDetails } from "@/components/plans/PlanDetails";


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
                        <PlanSelector
                            plans={plans}
                            selectedPlanId={selectedPlanId ?? ""}
                            onPlanChange={setSelectedPlanId}
                        />
                        <PlanDetails
                            plan={selectedPlan}
                            completedCount={completedCount}
                            totalScales={totalScales}
                            progressPercent={progressPercent}
                            actionError={actionError}
                            isRestarting={isRestarting}
                            isDeleting={isDeleting}
                            onRestart={handleRestartPlan}
                            onEdit={() => setEditingPlan(selectedPlan)}
                            onDelete={handleDeletePlan}
                        />
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