"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/api";
import type {
    Plan,
    PlanDraft
} from "@/types/plan";

export function usePlansApi() {
    const [plans, setPlans] = useState<Plan[]>([]);
    // Loading api states
    const [isPlansLoading, setIsPlansLoading] = useState(true);
    const [plansError, setPlansError] = useState<string | null>(null);

    const loadPlans = useCallback(async () => {
        setIsPlansLoading(true);
        setPlansError(null);

        try {
            // const [plansResponse, sessionsResponse] = await Promise.all([
            //     fetch("/api/plans"),
            //     fetch("/api/practice-sessions"),
            // ]);
            const response = await fetch ("/api/plans");

            if (!response.ok) {
                throw new Error(
                    await getErrorMessage(
                        response,
                        "Could not load plans."
                    )
                );
            }

            // if (!sessionsResponse.ok) {
            //     throw new Error(
            //         await getErrorMessage(
            //             sessionsResponse,
            //             "Could not load practice history."
            //         )
            //     );
            // }

            const loadedPlans: Plan[] = await response.json();

            setPlans(loadedPlans);
        } catch (error) {
            setPlansError(error instanceof Error
                ? error.message
                : "Could not load plans."
            );
        } finally {
            setIsPlansLoading(false);
        }
    }, []);

    // Load plans on page load
    useEffect(() => {
        void loadPlans();
    }, [loadPlans]);

    async function createPlan(draft: PlanDraft) {
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
        // setSelectedPlanId(newPlan.id);
        // setShowCreatePlanModal(false);
        return newPlan;
    }

    // PATCH
    async function updatePlan(
        planId: string, draft: PlanDraft
    ) {
        const response = await fetch(
            `/api/plans/${planId}`,
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
        return updatePlan;
    }

    // PATCH: Restart a plan.
    async function restartPlan(planId: string) {
        const response = await fetch(`/api/plans/${planId}`, {
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

        return updatedPlan;
    }

    //DELETE
    async function deletePlan(planId: string) {
        const response = await fetch(
            `/api/plans/${planId}`,
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
            (plan) => plan.id !== planId
        );

        // update screen immediately
        setPlans(remainingPlans);
    }

    return {
        plans,
        isPlansLoading,
        plansError,
        loadPlans,
        createPlan,
        updatePlan,
        restartPlan,
        deletePlan,
    }
}